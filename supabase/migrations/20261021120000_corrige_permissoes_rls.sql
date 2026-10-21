-- Correções da auditoria de segurança (2026-10-21).
-- Aplicar no projeto Supabase deste sistema (SQL Editor ou `supabase db push`).
-- Pode ser rodada mais de uma vez.

-- ---------------------------------------------------------------------------
-- B1. O usuário não pode mudar o próprio "role" (virar admin) nem o user_id.
-- ---------------------------------------------------------------------------

-- 1) Privilégio por coluna: pela API (anon/authenticated) só dá para alterar
--    o nome. O "updated_at" é preenchido pelo trigger.
REVOKE UPDATE ON public.profiles FROM anon, authenticated;
GRANT UPDATE (full_name) ON public.profiles TO authenticated;

-- 2) Política de UPDATE com WITH CHECK explícito.
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3) Cadastro do próprio perfil só como 'vendedor' (o trigger de signup já
--    cria o perfil; isto fecha o caminho de inserir um perfil como admin).
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND role = 'vendedor');

-- 4) Trigger de defesa: mesmo que alguém devolva o privilégio de UPDATE na
--    tabela inteira, role e user_id só mudam por quem não é usuário da API
--    (SQL Editor, service_role).
CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF current_user IN ('anon', 'authenticated')
     AND (NEW.role IS DISTINCT FROM OLD.role OR NEW.user_id IS DISTINCT FROM OLD.user_id) THEN
    RAISE EXCEPTION 'Não é permitido alterar role ou user_id do perfil.'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_profile_privilege_change ON public.profiles;
CREATE TRIGGER prevent_profile_privilege_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_privilege_change();

-- ---------------------------------------------------------------------------
-- B2. client_id de vendas, tarefas e atividades tem que ser um cliente do
--     próprio usuário (antes só o user_id era conferido).
-- ---------------------------------------------------------------------------

-- Função auxiliar: SECURITY DEFINER para não depender da RLS de clients
-- dentro da política, com search_path fixo.
CREATE OR REPLACE FUNCTION public.owns_client(p_client_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.clients c
    WHERE c.id = p_client_id AND c.user_id = auth.uid()
  );
$$;
REVOKE ALL ON FUNCTION public.owns_client(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.owns_client(uuid) TO authenticated;

-- sales
DROP POLICY IF EXISTS "Users can create their own sales" ON public.sales;
CREATE POLICY "Users can create their own sales" ON public.sales
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.owns_client(client_id));

DROP POLICY IF EXISTS "Users can update their own sales" ON public.sales;
CREATE POLICY "Users can update their own sales" ON public.sales
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND public.owns_client(client_id));

-- tasks (client_id é opcional)
DROP POLICY IF EXISTS "Users can create their own tasks" ON public.tasks;
CREATE POLICY "Users can create their own tasks" ON public.tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND (client_id IS NULL OR public.owns_client(client_id)));

DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
CREATE POLICY "Users can update their own tasks" ON public.tasks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND (client_id IS NULL OR public.owns_client(client_id)));

-- activities
DROP POLICY IF EXISTS "Users can create their own activities" ON public.activities;
CREATE POLICY "Users can create their own activities" ON public.activities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND public.owns_client(client_id));

DROP POLICY IF EXISTS "Users can update their own activities" ON public.activities;
CREATE POLICY "Users can update their own activities" ON public.activities
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND public.owns_client(client_id));

-- clients: UPDATE com WITH CHECK explícito (não deixa passar o registro
-- para outro user_id).
DROP POLICY IF EXISTS "Users can update their own clients" ON public.clients;
CREATE POLICY "Users can update their own clients" ON public.clients
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- B3. handle_new_user() é SECURITY DEFINER: search_path fixo e nomes
--     qualificados (aviso do linter do Supabase).
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    'vendedor'
  );
  RETURN NEW;
END;
$$;

-- Mesmo cuidado na função de timestamp (também apontada pelo linter).
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

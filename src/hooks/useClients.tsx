import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Client = Tables<"clients">;

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchClients = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData: Omit<Client, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("clients")
        .insert([{ ...clientData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setClients(prev => [data, ...prev]);
      toast({
        title: "Cliente adicionado",
        description: "Cliente cadastrado com sucesso.",
      });
      
      return data;
    } catch (error) {
      console.error("Error adding client:", error);
      toast({
        title: "Erro ao adicionar cliente",
        description: "Não foi possível cadastrar o cliente.",
        variant: "destructive",
      });
    }
  };

  const updateClient = async (clientId: string, updates: Partial<Client>) => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .update(updates)
        .eq("id", clientId)
        .select()
        .single();

      if (error) throw error;
      
      setClients(prev => prev.map(client => 
        client.id === clientId ? data : client
      ));
      
      toast({
        title: "Cliente atualizado",
        description: "Dados do cliente atualizados com sucesso.",
      });
      
      return data;
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        title: "Erro ao atualizar cliente",
        description: "Não foi possível atualizar o cliente.",
        variant: "destructive",
      });
    }
  };

  const deleteClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientId);

      if (error) throw error;
      
      setClients(prev => prev.filter(client => client.id !== clientId));
      toast({
        title: "Cliente removido",
        description: "Cliente removido com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        title: "Erro ao remover cliente",
        description: "Não foi possível remover o cliente.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    refetch: fetchClients
  };
}
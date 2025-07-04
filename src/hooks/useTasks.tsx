import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Task = Tables<"tasks">;

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .order("due_date", { ascending: true, nullsFirst: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Erro ao carregar tarefas",
        description: "Não foi possível carregar a lista de tarefas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskData: Omit<Task, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([{ ...taskData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => [data, ...prev]);
      toast({
        title: "Tarefa criada",
        description: "Tarefa adicionada com sucesso.",
      });
      
      return data;
    } catch (error) {
      console.error("Error adding task:", error);
      toast({
        title: "Erro ao criar tarefa",
        description: "Não foi possível criar a tarefa.",
        variant: "destructive",
      });
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", taskId)
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => prev.map(task => 
        task.id === taskId ? data : task
      ));
      
      return data;
    } catch (error) {
      console.error("Error updating task:", error);
      toast({
        title: "Erro ao atualizar tarefa",
        description: "Não foi possível atualizar a tarefa.",
        variant: "destructive",
      });
    }
  };

  const completeTask = async (taskId: string) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .update({ 
          completed: true, 
          completed_at: new Date().toISOString() 
        })
        .eq("id", taskId)
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => prev.map(task => 
        task.id === taskId ? data : task
      ));
      
      toast({
        title: "Tarefa concluída",
        description: "Tarefa marcada como concluída.",
      });
      
      return data;
    } catch (error) {
      console.error("Error completing task:", error);
      toast({
        title: "Erro ao concluir tarefa",
        description: "Não foi possível concluir a tarefa.",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast({
        title: "Tarefa removida",
        description: "Tarefa removida com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Erro ao remover tarefa",
        description: "Não foi possível remover a tarefa.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return {
    tasks,
    pendingTasks,
    completedTasks,
    loading,
    addTask,
    updateTask,
    completeTask,
    deleteTask,
    refetch: fetchTasks
  };
}
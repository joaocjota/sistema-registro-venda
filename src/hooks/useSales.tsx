import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Sale = Tables<"sales">;

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSales = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .eq("user_id", user.id)
        .order("sale_date", { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast({
        title: "Erro ao carregar vendas",
        description: "Não foi possível carregar as vendas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSale = async (saleData: Omit<Sale, "id" | "user_id" | "created_at" | "updated_at" | "commission_amount">) => {
    if (!user) return;

    try {
      // Calculate commission amount based on rate and amount
      const commissionAmount = saleData.amount * ((saleData.commission_rate || 10) / 100);
      
      const { data, error } = await supabase
        .from("sales")
        .insert([{ 
          ...saleData, 
          user_id: user.id,
          commission_amount: commissionAmount
        }])
        .select()
        .single();

      if (error) throw error;
      
      setSales(prev => [data, ...prev]);
      toast({
        title: "Venda registrada",
        description: "Venda cadastrada com sucesso.",
      });
      
      return data;
    } catch (error) {
      console.error("Error adding sale:", error);
      toast({
        title: "Erro ao registrar venda",
        description: "Não foi possível registrar a venda.",
        variant: "destructive",
      });
    }
  };

  const updateSale = async (saleId: string, updates: Partial<Sale>) => {
    try {
      // Recalculate commission if amount or rate changed
      if (updates.amount || updates.commission_rate) {
        const currentSale = sales.find(s => s.id === saleId);
        if (currentSale) {
          const amount = updates.amount || currentSale.amount;
          const rate = updates.commission_rate || currentSale.commission_rate || 10;
          updates.commission_amount = amount * (rate / 100);
        }
      }

      const { data, error } = await supabase
        .from("sales")
        .update(updates)
        .eq("id", saleId)
        .select()
        .single();

      if (error) throw error;
      
      setSales(prev => prev.map(sale => 
        sale.id === saleId ? data : sale
      ));
      
      toast({
        title: "Venda atualizada",
        description: "Dados da venda atualizados com sucesso.",
      });
      
      return data;
    } catch (error) {
      console.error("Error updating sale:", error);
      toast({
        title: "Erro ao atualizar venda",
        description: "Não foi possível atualizar a venda.",
        variant: "destructive",
      });
    }
  };

  const deleteSale = async (saleId: string) => {
    try {
      const { error } = await supabase
        .from("sales")
        .delete()
        .eq("id", saleId);

      if (error) throw error;
      
      setSales(prev => prev.filter(sale => sale.id !== saleId));
      toast({
        title: "Venda removida",
        description: "Venda removida com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting sale:", error);
      toast({
        title: "Erro ao remover venda",
        description: "Não foi possível remover a venda.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchSales();
    }
  }, [user]);

  // Calculate metrics
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthSales = sales.filter(sale => {
    const saleDate = new Date(sale.sale_date);
    return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
  });

  const totalMonthAmount = monthSales.reduce((sum, sale) => sum + Number(sale.amount), 0);
  const totalCommission = sales.reduce((sum, sale) => sum + Number(sale.commission_amount || 0), 0);

  return {
    sales,
    monthSales,
    totalMonthAmount,
    totalCommission,
    loading,
    addSale,
    updateSale,
    deleteSale,
    refetch: fetchSales
  };
}
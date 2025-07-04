import { useMemo } from "react";
import { useClients } from "./useClients";
import { useSales } from "./useSales";
import { useTasks } from "./useTasks";

export function useMetrics() {
  const { clients } = useClients();
  const { sales, totalMonthAmount, totalCommission } = useSales();
  const { pendingTasks } = useTasks();

  const metrics = useMemo(() => {
    // Active clients (status: client)
    const activeClients = clients.filter(client => client.status === 'client').length;
    
    // New clients this month
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newClientsThisMonth = clients.filter(client => {
      const createdDate = new Date(client.created_at);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;

    // Conversion rate calculation
    const totalLeads = clients.filter(client => client.status === 'lead').length;
    const totalClients = clients.filter(client => client.status === 'client').length;
    const conversionRate = totalLeads > 0 ? ((totalClients / (totalLeads + totalClients)) * 100) : 0;

    // Goal progress (assuming R$ 100.000 monthly goal)
    const monthlyGoal = 100000;
    const goalProgress = (totalMonthAmount / monthlyGoal) * 100;
    const remainingToGoal = Math.max(0, monthlyGoal - totalMonthAmount);

    // High priority pending tasks
    const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high').length;

    // Cross-sell opportunities
    const crossSellOpportunities = clients.filter(client => 
      client.cross_sell_potential && client.status === 'client'
    ).length;

    // Estimated cross-sell value (assuming R$ 3000 per opportunity)
    const crossSellValue = crossSellOpportunities * 3000;

    return {
      monthSales: {
        value: `R$ ${totalMonthAmount.toLocaleString('pt-BR')}`,
        change: "+12% em relação ao mês anterior", // This could be calculated with previous month data
        changeType: "positive" as const
      },
      activeClients: {
        value: activeClients.toString(),
        change: newClientsThisMonth > 0 ? `+${newClientsThisMonth} novos clientes` : "Nenhum cliente novo",
        changeType: newClientsThisMonth > 0 ? "positive" as const : "neutral" as const
      },
      conversionRate: {
        value: `${conversionRate.toFixed(1)}%`,
        change: "+2.5% este mês", // This could be calculated with previous month data
        changeType: "positive" as const
      },
      goalProgress: {
        value: `${goalProgress.toFixed(0)}%`,
        change: `R$ ${remainingToGoal.toLocaleString('pt-BR')} para bater meta`,
        changeType: goalProgress >= 100 ? "positive" as const : "neutral" as const
      },
      pendingTasks: {
        value: pendingTasks.length.toString(),
        change: highPriorityTasks > 0 ? `${highPriorityTasks} com alta prioridade` : "Nenhuma com alta prioridade",
        changeType: highPriorityTasks > 0 ? "negative" as const : "positive" as const
      },
      crossSell: {
        value: crossSellOpportunities.toString(),
        change: `R$ ${crossSellValue.toLocaleString('pt-BR')} em oportunidades`,
        changeType: crossSellOpportunities > 0 ? "positive" as const : "neutral" as const
      },
      commission: {
        value: `R$ ${totalCommission.toLocaleString('pt-BR')}`,
        change: "+15% vs mês anterior", // This could be calculated with previous month data
        changeType: "positive" as const
      }
    };
  }, [clients, sales, totalMonthAmount, totalCommission, pendingTasks]);

  return metrics;
}
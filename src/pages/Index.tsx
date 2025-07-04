import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ClientList } from "@/components/sales/ClientList";
import { TaskList } from "@/components/tasks/TaskList";
import { SalesChart } from "@/components/sales/SalesChart";
import { useMetrics } from "@/hooks/useMetrics";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Target,
  Calendar,
  Star
} from "lucide-react";

const Index = () => {
  const metrics = useMetrics();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <div className="hidden md:block border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Sidebar />
        </div>
        
        <main className="flex-1 p-6">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
              <p className="text-muted-foreground">
                Visão geral das suas vendas e atividades
              </p>
            </div>

            {/* Metrics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Vendas do Mês"
                value={metrics.monthSales.value}
                change={metrics.monthSales.change}
                changeType={metrics.monthSales.changeType}
                icon={DollarSign}
              />
              <MetricCard
                title="Clientes Ativos"
                value={metrics.activeClients.value}
                change={metrics.activeClients.change}
                changeType={metrics.activeClients.changeType}
                icon={Users}
              />
              <MetricCard
                title="Taxa de Conversão"
                value={metrics.conversionRate.value}
                change={metrics.conversionRate.change}
                changeType={metrics.conversionRate.changeType}
                icon={TrendingUp}
              />
              <MetricCard
                title="Meta do Mês"
                value={metrics.goalProgress.value}
                change={metrics.goalProgress.change}
                changeType={metrics.goalProgress.changeType}
                icon={Target}
              />
            </div>

            {/* Alertas e Cross-sell */}
            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard
                title="Tarefas Pendentes"
                value={metrics.pendingTasks.value}
                change={metrics.pendingTasks.change}
                changeType={metrics.pendingTasks.changeType}
                icon={Calendar}
              />
              <MetricCard
                title="Cross-sell Potencial"
                value={metrics.crossSell.value}
                change={metrics.crossSell.change}
                changeType={metrics.crossSell.changeType}
                icon={Star}
              />
              <MetricCard
                title="Comissão Atual"
                value={metrics.commission.value}
                change={metrics.commission.change}
                changeType={metrics.commission.changeType}
                icon={DollarSign}
              />
            </div>

            {/* Charts */}
            <SalesChart />

            {/* Lists */}
            <div className="grid gap-6 lg:grid-cols-2">
              <ClientList />
              <TaskList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

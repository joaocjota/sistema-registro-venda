import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { ClientList } from "@/components/sales/ClientList";
import { TaskList } from "@/components/tasks/TaskList";
import { SalesChart } from "@/components/sales/SalesChart";
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Target,
  Calendar,
  Star
} from "lucide-react";

const Index = () => {
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
                value="R$ 67.000"
                change="+12% em relação ao mês anterior"
                changeType="positive"
                icon={DollarSign}
              />
              <MetricCard
                title="Clientes Ativos"
                value="142"
                change="+8 novos clientes"
                changeType="positive"
                icon={Users}
              />
              <MetricCard
                title="Taxa de Conversão"
                value="24%"
                change="+2.5% este mês"
                changeType="positive"
                icon={TrendingUp}
              />
              <MetricCard
                title="Meta do Mês"
                value="92%"
                change="R$ 5.000 para bater meta"
                changeType="neutral"
                icon={Target}
              />
            </div>

            {/* Alertas e Cross-sell */}
            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard
                title="Tarefas Pendentes"
                value="8"
                change="2 com alta prioridade"
                changeType="negative"
                icon={Calendar}
              />
              <MetricCard
                title="Cross-sell Potencial"
                value="15"
                change="R$ 45.000 em oportunidades"
                changeType="positive"
                icon={Star}
              />
              <MetricCard
                title="Comissão Atual"
                value="R$ 6.700"
                change="+15% vs mês anterior"
                changeType="positive"
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

const salesData = [
  { month: 'Jan', vendas: 45000, meta: 50000 },
  { month: 'Fev', vendas: 52000, meta: 50000 },
  { month: 'Mar', vendas: 48000, meta: 55000 },
  { month: 'Abr', vendas: 61000, meta: 55000 },
  { month: 'Mai', vendas: 58000, meta: 60000 },
  { month: 'Jun', vendas: 67000, meta: 60000 },
];

const commissionsData = [
  { month: 'Jan', comissao: 4500 },
  { month: 'Fev', comissao: 5200 },
  { month: 'Mar', comissao: 4800 },
  { month: 'Abr', comissao: 6100 },
  { month: 'Mai', comissao: 5800 },
  { month: 'Jun', comissao: 6700 },
];

export function SalesChart() {
  const maxSales = Math.max(...salesData.map(d => Math.max(d.vendas, d.meta)));
  const maxCommission = Math.max(...commissionsData.map(d => d.comissao));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Vendas vs Meta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesData.map((data, index) => {
              const salesPercentage = (data.vendas / maxSales) * 100;
              const metaPercentage = (data.meta / maxSales) * 100;
              const isAboveMeta = data.vendas >= data.meta;
              
              return (
                <div key={data.month} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{data.month}</span>
                    <div className="flex items-center gap-2">
                      {isAboveMeta ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-warning" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        R$ {data.vendas.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    {/* Meta line */}
                    <div 
                      className="absolute h-full bg-accent/30 rounded-full"
                      style={{ width: `${metaPercentage}%` }}
                    />
                    {/* Sales bar */}
                    <div 
                      className={`absolute h-full rounded-full transition-all duration-500 ${
                        isAboveMeta ? 'bg-success' : 'bg-primary'
                      }`}
                      style={{ width: `${salesPercentage}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Meta: R$ {data.meta.toLocaleString('pt-BR')}</span>
                    <span>{((data.vendas / data.meta) * 100).toFixed(1)}% da meta</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>Vendas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent/30 rounded-full"></div>
                <span>Meta</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comissões Mensais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commissionsData.map((data, index) => {
              const percentage = (data.comissao / maxCommission) * 100;
              const previousMonth = index > 0 ? commissionsData[index - 1].comissao : data.comissao;
              const growth = ((data.comissao - previousMonth) / previousMonth) * 100;
              
              return (
                <div key={data.month} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{data.month}</span>
                    <div className="flex items-center gap-2">
                      {growth > 0 ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : growth < 0 ? (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      ) : null}
                      <span className="text-sm text-muted-foreground">
                        R$ {data.comissao.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="absolute h-full bg-gradient-success rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  {index > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {growth > 0 ? '+' : ''}{growth.toFixed(1)}% vs mês anterior
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Acumulado:</span>
              <span className="font-semibold text-success">
                R$ {commissionsData.reduce((acc, curr) => acc + curr.comissao, 0).toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
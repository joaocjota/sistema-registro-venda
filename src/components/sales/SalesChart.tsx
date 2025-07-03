import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

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
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Vendas vs Meta</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="month" 
                className="text-muted-foreground"
                fontSize={12}
              />
              <YAxis 
                className="text-muted-foreground"
                fontSize={12}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, '']}
                labelFormatter={(label) => `Mês: ${label}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="vendas" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                name="Vendas"
              />
              <Line 
                type="monotone" 
                dataKey="meta" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Meta"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comissões Mensais</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={commissionsData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="month" 
                className="text-muted-foreground"
                fontSize={12}
              />
              <YAxis 
                className="text-muted-foreground"
                fontSize={12}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Comissão']}
                labelFormatter={(label) => `Mês: ${label}`}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Bar 
                dataKey="comissao" 
                fill="hsl(var(--success))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
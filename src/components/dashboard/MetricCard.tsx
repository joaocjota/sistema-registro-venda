import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
}

export function MetricCard({ title, value, change, changeType = 'neutral', icon: Icon }: MetricCardProps) {
  return (
    <Card className="bg-gradient-card shadow hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <p className={`text-xs mt-1 ${
            changeType === 'positive' 
              ? 'text-success' 
              : changeType === 'negative' 
                ? 'text-destructive' 
                : 'text-muted-foreground'
          }`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
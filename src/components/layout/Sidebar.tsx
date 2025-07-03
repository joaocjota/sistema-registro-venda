import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Calendar, 
  TrendingUp, 
  Target,
  MessageSquare,
  Settings
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, current: true },
  { name: 'Clientes', href: '/clientes', icon: Users, current: false },
  { name: 'Vendas', href: '/vendas', icon: ShoppingBag, current: false },
  { name: 'Tarefas', href: '/tarefas', icon: Calendar, current: false },
  { name: 'Cross-sell', href: '/cross-sell', icon: Target, current: false },
  { name: 'Relatórios', href: '/relatorios', icon: TrendingUp, current: false },
  { name: 'Mensagens', href: '/mensagens', icon: MessageSquare, current: false },
];

export function Sidebar({ className }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('/');

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Button
                key={item.name}
                variant={activeItem === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  activeItem === item.href && "bg-accent text-accent-foreground"
                )}
                onClick={() => setActiveItem(item.href)}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="px-3">
          <div className="border-t pt-4">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
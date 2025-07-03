import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Phone, Mail, MessageSquare, Star } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'lead' | 'prospect' | 'client' | 'inactive';
  value: number;
  lastContact: string;
  crossSellPotential: boolean;
  recurrence: boolean;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    phone: '(11) 99999-9999',
    status: 'client',
    value: 15000,
    lastContact: '2024-03-01',
    crossSellPotential: true,
    recurrence: true
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@exemplo.com',
    phone: '(11) 88888-8888',
    status: 'prospect',
    value: 25000,
    lastContact: '2024-02-28',
    crossSellPotential: true,
    recurrence: false
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro@exemplo.com',
    phone: '(11) 77777-7777',
    status: 'lead',
    value: 8000,
    lastContact: '2024-02-25',
    crossSellPotential: false,
    recurrence: true
  },
];

const statusColors = {
  lead: 'bg-warning/10 text-warning border-warning/20',
  prospect: 'bg-primary/10 text-primary border-primary/20',
  client: 'bg-success/10 text-success border-success/20',
  inactive: 'bg-muted text-muted-foreground border-border'
};

const statusLabels = {
  lead: 'Lead',
  prospect: 'Prospect',
  client: 'Cliente',
  inactive: 'Inativo'
};

export function ClientList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Clientes Recentes
          <Button size="sm">Ver Todos</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockClients.map((client) => (
            <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-card">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`/avatars/${client.id}.png`} />
                  <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{client.name}</h4>
                    {client.crossSellPotential && (
                      <Star className="h-4 w-4 text-warning fill-warning" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={statusColors[client.status]}>
                      {statusLabels[client.status]}
                    </Badge>
                    {client.recurrence && (
                      <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                        Recorrente
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    R$ {client.value.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Último contato: {new Date(client.lastContact).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Editar Cliente</DropdownMenuItem>
                    <DropdownMenuItem>Criar Tarefa</DropdownMenuItem>
                    <DropdownMenuItem>Ver Histórico</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Remover Cliente
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
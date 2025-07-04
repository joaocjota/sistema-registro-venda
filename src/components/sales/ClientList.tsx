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
import { useClients } from "@/hooks/useClients";


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
  const { clients, loading } = useClients();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Clientes Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          {clients.slice(0, 5).map((client) => (
            <div key={client.id} className="flex items-center justify-between p-4 border rounded-lg bg-gradient-card">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`/avatars/${client.id}.png`} />
                  <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{client.name}</h4>
                    {client.cross_sell_potential && (
                      <Star className="h-4 w-4 text-warning fill-warning" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{client.email || 'Email não informado'}</p>
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
                    R$ {Number(client.value || 0).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Último contato: {client.last_contact ? new Date(client.last_contact).toLocaleDateString('pt-BR') : 'Não informado'}
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
          
          {clients.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum cliente cadastrado
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
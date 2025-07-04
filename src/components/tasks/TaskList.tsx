import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, User, Phone, Mail, MessageSquare } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useClients } from "@/hooks/useClients";


const typeIcons = {
  call: Phone,
  email: Mail,
  message: MessageSquare,
  meeting: Calendar,
  'follow-up': Clock
};

const typeLabels = {
  call: 'Ligação',
  email: 'E-mail',
  message: 'Mensagem',
  meeting: 'Reunião',
  'follow-up': 'Follow-up'
};

const priorityColors = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  low: 'bg-success/10 text-success border-success/20'
};

const priorityLabels = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa'
};

export function TaskList() {
  const { pendingTasks, loading, completeTask } = useTasks();
  const { clients } = useClients();

  const getClientName = (clientId: string | null) => {
    if (!clientId) return 'Sem cliente';
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente não encontrado';
  };

  const handleTaskComplete = async (taskId: string) => {
    await completeTask(taskId);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tarefas Pendentes</CardTitle>
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
          Tarefas Pendentes
          <Button size="sm">Nova Tarefa</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingTasks.map((task) => {
            const Icon = typeIcons[task.type];
            return (
              <div key={task.id} className="flex items-start space-x-4 p-4 border rounded-lg bg-gradient-card">
                <Checkbox 
                  id={task.id}
                  className="mt-1"
                  onCheckedChange={() => handleTaskComplete(task.id)}
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-foreground">{task.title}</h4>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    Cliente: {getClientName(task.client_id)}
                  </p>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={priorityColors[task.priority]}>
                      {priorityLabels[task.priority]}
                    </Badge>
                    <Badge variant="outline">
                      {typeLabels[task.type]}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {task.due_date ? new Date(task.due_date).toLocaleDateString('pt-BR') : 'Sem prazo'}
                  </div>
                  <Button variant="outline" size="sm">
                    Executar
                  </Button>
                </div>
              </div>
            );
          })}
          
          {pendingTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma tarefa pendente
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
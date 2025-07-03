import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, User, Phone, Mail, MessageSquare } from "lucide-react";

interface Task {
  id: string;
  title: string;
  client: string;
  type: 'call' | 'email' | 'message' | 'meeting' | 'follow-up';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  completed: boolean;
  description?: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Ligar para João Silva',
    client: 'João Silva',
    type: 'call',
    priority: 'high',
    dueDate: '2024-03-02',
    completed: false,
    description: 'Seguimento da proposta de R$ 15.000'
  },
  {
    id: '2',
    title: 'Enviar proposta para Maria Santos',
    client: 'Maria Santos',
    type: 'email',
    priority: 'medium',
    dueDate: '2024-03-03',
    completed: false,
    description: 'Proposta personalizada de cross-sell'
  },
  {
    id: '3',
    title: 'WhatsApp para Pedro Costa',
    client: 'Pedro Costa',
    type: 'message',
    priority: 'low',
    dueDate: '2024-03-04',
    completed: true,
    description: 'Check-in pós-venda'
  },
];

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
          {mockTasks.filter(task => !task.completed).map((task) => {
            const Icon = typeIcons[task.type];
            return (
              <div key={task.id} className="flex items-start space-x-4 p-4 border rounded-lg bg-gradient-card">
                <Checkbox 
                  id={task.id}
                  className="mt-1"
                />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h4 className="font-semibold text-foreground">{task.title}</h4>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    Cliente: {task.client}
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
                    {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                  </div>
                  <Button variant="outline" size="sm">
                    Executar
                  </Button>
                </div>
              </div>
            );
          })}
          
          {mockTasks.filter(task => !task.completed).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma tarefa pendente
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
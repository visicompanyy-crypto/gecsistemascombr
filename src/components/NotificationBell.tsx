import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, TrendingUp, TrendingDown, AlertCircle, Calendar, CheckCircle2 } from "lucide-react";
import { format, isToday, isTomorrow, parseISO, isPast, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  transaction_type: string;
  due_date: string | null;
  status: string;
}

export function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const { data: pendingTransactions } = useQuery({
    queryKey: ['pending-transactions-notifications', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('id, description, amount, transaction_type, due_date, status')
        .is('deleted_at', null)
        .eq('status', 'pendente')
        .not('due_date', 'is', null)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user?.id,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getNotifications = () => {
    if (!pendingTransactions) return [];

    const notifications: {
      id: string;
      type: 'urgent' | 'today' | 'tomorrow';
      transactionType: 'receita' | 'despesa';
      description: string;
      amount: number;
      dueDate: Date;
    }[] = [];

    pendingTransactions.forEach(t => {
      if (!t.due_date) return;
      
      const dueDate = parseISO(t.due_date);
      const today = startOfDay(new Date());
      
      if (isPast(dueDate) && !isToday(dueDate)) {
        notifications.push({
          id: t.id,
          type: 'urgent',
          transactionType: t.transaction_type as 'receita' | 'despesa',
          description: t.description,
          amount: t.amount,
          dueDate,
        });
      } else if (isToday(dueDate)) {
        notifications.push({
          id: t.id,
          type: 'today',
          transactionType: t.transaction_type as 'receita' | 'despesa',
          description: t.description,
          amount: t.amount,
          dueDate,
        });
      } else if (isTomorrow(dueDate)) {
        notifications.push({
          id: t.id,
          type: 'tomorrow',
          transactionType: t.transaction_type as 'receita' | 'despesa',
          description: t.description,
          amount: t.amount,
          dueDate,
        });
      }
    });

    return notifications.sort((a, b) => {
      const order = { urgent: 0, today: 1, tomorrow: 2 };
      return order[a.type] - order[b.type];
    });
  };

  const notifications = getNotifications();
  const urgentCount = notifications.filter(n => n.type === 'urgent').length;
  const todayCount = notifications.filter(n => n.type === 'today').length;
  const tomorrowCount = notifications.filter(n => n.type === 'tomorrow').length;
  const totalCount = notifications.length;

  const getIcon = (type: string, transactionType: string) => {
    if (type === 'urgent') return <AlertCircle className="h-4 w-4 text-destructive" />;
    if (transactionType === 'receita') return <TrendingUp className="h-4 w-4 text-income" />;
    return <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const getLabel = (type: string) => {
    if (type === 'urgent') return 'Atrasado';
    if (type === 'today') return 'Hoje';
    return 'Amanhã';
  };

  const getLabelColor = (type: string) => {
    if (type === 'urgent') return 'bg-destructive/10 text-destructive';
    if (type === 'today') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {totalCount > 0 && (
            <span className={cn(
              "absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center",
              urgentCount > 0 
                ? "bg-destructive text-destructive-foreground animate-pulse" 
                : "bg-primary text-primary-foreground"
            )}>
              {totalCount > 9 ? '9+' : totalCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[360px] p-0">
        <div className="p-3 border-b border-border">
          <h3 className="font-semibold text-sm">Notificações</h3>
          <p className="text-xs text-muted-foreground">
            {totalCount === 0 
              ? 'Nenhuma pendência próxima' 
              : `${totalCount} transaç${totalCount > 1 ? 'ões' : 'ão'} pendente${totalCount > 1 ? 's' : ''}`
            }
          </p>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-income mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">
                Tudo em dia! Nenhuma pendência para os próximos dias.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 hover:bg-muted/50 transition-colors",
                    notification.type === 'urgent' && "bg-destructive/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getIcon(notification.type, notification.transactionType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "text-[10px] font-medium px-1.5 py-0.5 rounded",
                          getLabelColor(notification.type)
                        )}>
                          {getLabel(notification.type)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {format(notification.dueDate, "dd/MM/yyyy")}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground truncate">
                        {notification.description}
                      </p>
                      <p className={cn(
                        "text-sm font-semibold",
                        notification.transactionType === 'receita' ? 'text-income' : 'text-destructive'
                      )}>
                        {notification.transactionType === 'receita' ? '+' : '-'} {formatCurrency(notification.amount)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-2 border-t border-border bg-muted/30">
            <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground">
              {urgentCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-destructive"></span>
                  {urgentCount} atrasado{urgentCount > 1 ? 's' : ''}
                </span>
              )}
              {todayCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  {todayCount} hoje
                </span>
              )}
              {tomorrowCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  {tomorrowCount} amanhã
                </span>
              )}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { format, isTomorrow, parseISO, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  transaction_type: string;
  due_date: string | null;
  status: string;
}

export function DailyReminder() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const { data: pendingTransactions } = useQuery({
    queryKey: ['pending-transactions-reminder', user?.id],
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

  useEffect(() => {
    if (!user || dismissed) return;

    // Check if it's the first access of the day
    const lastAccessKey = `daily_reminder_${user.id}`;
    const lastAccess = localStorage.getItem(lastAccessKey);
    const today = startOfDay(new Date()).toISOString();

    if (lastAccess !== today && pendingTransactions && pendingTransactions.length > 0) {
      // Check if there are transactions due tomorrow (1 day before)
      const hasDueTomorrow = pendingTransactions.some(t => {
        if (!t.due_date) return false;
        const dueDate = parseISO(t.due_date);
        return isTomorrow(dueDate);
      });

      if (hasDueTomorrow) {
        setVisible(true);
        localStorage.setItem(lastAccessKey, today);
      }
    }
  }, [user, pendingTransactions, dismissed]);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
  };

  if (!visible || !pendingTransactions) return null;

  // Filtrar apenas transações de amanhã (1 dia antes)
  const tomorrowTransactions = pendingTransactions.filter(t => {
    if (!t.due_date) return false;
    return isTomorrow(parseISO(t.due_date));
  });

  // Se não há transações de amanhã, não mostra o pop-up
  if (tomorrowTransactions.length === 0) return null;

  const receitas = tomorrowTransactions.filter(t => t.transaction_type === 'receita');
  const despesas = tomorrowTransactions.filter(t => t.transaction_type === 'despesa');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const totalReceitas = receitas.reduce((sum, t) => sum + t.amount, 0);
  const totalDespesas = despesas.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <Card className="w-[380px] p-4 bg-card border border-border shadow-2xl rounded-xl">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">Lembrete Diário</h3>
              <p className="text-xs text-muted-foreground">
                {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {/* Transações de AMANHÃ (1 dia antes) */}
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 border border-amber-200 dark:border-amber-900/30">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase">
                Vence Amanhã
              </span>
            </div>
            
            {receitas.length > 0 && (
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-income" />
                  <span className="text-xs text-foreground">
                    {receitas.length} receita{receitas.length > 1 ? 's' : ''} a receber
                  </span>
                </div>
                <span className="text-xs font-semibold text-income">
                  {formatCurrency(totalReceitas)}
                </span>
              </div>
            )}
            
            {despesas.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                  <span className="text-xs text-foreground">
                    {despesas.length} despesa{despesas.length > 1 ? 's' : ''} a pagar
                  </span>
                </div>
                <span className="text-xs font-semibold text-destructive">
                  {formatCurrency(totalDespesas)}
                </span>
              </div>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 text-xs text-muted-foreground hover:text-foreground"
          onClick={handleDismiss}
        >
          Entendi, fechar lembrete
        </Button>
      </Card>
    </div>
  );
}

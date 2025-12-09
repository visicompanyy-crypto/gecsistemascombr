import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Eye, CheckCircle2 } from "lucide-react";
import { format, parseISO, isToday, isTomorrow, isPast, startOfDay, differenceInDays } from "date-fns";
import { parseDateLocal } from "@/lib/utils";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  transaction_type: string;
  transaction_date: string;
  due_date?: string | null;
  category: string | null;
  status: string;
  payment_method?: string | null;
  cost_center_id?: string | null;
  cost_centers?: {
    name: string;
  } | null;
  notes?: string | null;
}

interface FinancialTransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onViewDetails: (transaction: Transaction) => void;
  onMarkAsPaid: (id: string) => void;
}

export function FinancialTransactionsTable({
  transactions,
  onEdit,
  onDelete,
  onViewDetails,
  onMarkAsPaid,
}: FinancialTransactionsTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getAlertBadge = (transaction: Transaction) => {
    if (transaction.status !== 'pendente') return null;
    
    const dueDate = transaction.due_date ? parseISO(transaction.due_date) : null;
    if (!dueDate) return null;
    
    const today = startOfDay(new Date());
    const daysDiff = differenceInDays(dueDate, today);
    
    // Atrasado (vermelho pulsando)
    if (isPast(dueDate) && !isToday(dueDate)) {
      const daysOverdue = Math.abs(daysDiff);
      return (
        <Badge variant="destructive" className="rounded-full animate-pulse">
          Atrasado {daysOverdue}d
        </Badge>
      );
    }
    
    // Vence hoje (vermelho)
    if (isToday(dueDate)) {
      return (
        <Badge variant="destructive" className="rounded-full">
          Hoje
        </Badge>
      );
    }
    
    // Vence amanhã / 1 dia (amarelo)
    if (isTomorrow(dueDate)) {
      return (
        <Badge className="rounded-full bg-amber-500 text-white hover:bg-amber-600">
          Amanhã
        </Badge>
      );
    }
    
    // Vence em 3 dias (verde)
    if (daysDiff === 3) {
      return (
        <Badge className="rounded-full bg-emerald-500 text-white hover:bg-emerald-600">
          3 dias
        </Badge>
      );
    }
    
    return null;
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-[0_5px_20px_rgba(0,0,0,0.06)]">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted border-b border-border">
            <TableHead className="w-[5%] font-semibold text-foreground">Alerta</TableHead>
            <TableHead className="w-[12%] font-semibold text-foreground">Data de Pagamento</TableHead>
            <TableHead className="w-[8%] font-semibold text-foreground">Tipo</TableHead>
            <TableHead className="w-[22%] font-semibold text-foreground">Nome</TableHead>
            <TableHead className="w-[12%] font-semibold text-foreground">Centro de Custo</TableHead>
            <TableHead className="w-[14%] font-semibold text-foreground">Forma de Pagamento</TableHead>
            <TableHead className="w-[10%] font-semibold text-foreground">Variável</TableHead>
            <TableHead className="w-[10%] text-right font-semibold text-foreground">Valor</TableHead>
            <TableHead className="w-[7%] font-semibold text-foreground">Status</TableHead>
            <TableHead className="w-[10%] text-right font-semibold text-foreground">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, idx) => {
            const alertBadge = getAlertBadge(transaction);
            
            return (
              <TableRow
                key={transaction.id} 
                className={`hover:bg-muted/50 transition-colors border-b border-border/50 ${
                  idx % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                }`}
              >
                <TableCell>
                  {alertBadge || (
                    <div className="flex items-center justify-center">
                      {transaction.transaction_type === 'receita' ? (
                        <span className="text-income">🔹</span>
                      ) : (
                        <span className="text-destructive">🔻</span>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {format(parseDateLocal(transaction.transaction_date), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  {transaction.transaction_type === 'receita' ? (
                    <span className="text-income font-semibold">🔹 Receita</span>
                  ) : (
                    <span className="text-destructive font-semibold">🔻 Despesa</span>
                  )}
                </TableCell>
                <TableCell className="font-medium text-foreground">{transaction.description || transaction.notes || '-'}</TableCell>
                <TableCell className="text-foreground">{transaction.cost_centers?.name || '-'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-muted">{transaction.payment_method || 'Pix'}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-muted">Fixa</Badge>
                </TableCell>
                <TableCell className={`text-right font-bold ${
                  transaction.transaction_type === 'receita' ? 'text-income' : 'text-destructive'
                }`}>
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={transaction.status === 'pago' ? 'info' : 'warning'}
                    className="rounded-full"
                  >
                    {transaction.status === 'pago' ? 'Pago' : 'Pendente'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-muted"
                      onClick={() => onViewDetails(transaction)}
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-primary/10"
                      onClick={() => onEdit(transaction)}
                      title="Editar transação"
                    >
                      <Pencil className="h-4 w-4 text-primary" />
                    </Button>
                    {transaction.status === 'pendente' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-success/10"
                        onClick={() => onMarkAsPaid(transaction.id)}
                        title="Marcar como pago"
                      >
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-destructive/10"
                      onClick={() => onDelete(transaction.id)}
                      title="Deletar transação"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

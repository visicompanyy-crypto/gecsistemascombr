import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Eye, CheckCircle2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  transaction_type: string;
  transaction_date: string;
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

  const getAlertBadge = (status: string, daysOverdue: number = 0) => {
    if (status === 'pendente' && daysOverdue > 20) {
      return <Badge variant="danger" className="rounded-full">ATRASADO {daysOverdue}</Badge>;
    }
    if (status === 'pendente' && daysOverdue > 10) {
      return <Badge variant="warning" className="rounded-full">URGENTE {daysOverdue}</Badge>;
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
            const daysOverdue = Math.floor((new Date().getTime() - new Date(transaction.transaction_date).getTime()) / (1000 * 60 * 60 * 24));
            const alertBadge = getAlertBadge(transaction.status, daysOverdue);
            
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
                        <span className="text-primary">🔹</span>
                      ) : (
                        <span className="text-destructive">🔻</span>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {format(new Date(transaction.transaction_date), 'dd/MM/yyyy')}
                </TableCell>
                <TableCell>
                  {transaction.transaction_type === 'receita' ? (
                    <span className="text-primary font-semibold">🔹 Receita</span>
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
                  transaction.transaction_type === 'receita' ? 'text-primary' : 'text-destructive'
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

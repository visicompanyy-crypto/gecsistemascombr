import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Transaction, TeamToolExpense } from "@/hooks/useFinancialSummary";

interface TransactionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  transactions: Transaction[];
  teamToolExpenses?: TeamToolExpense[];
}

export function TransactionDetailsModal({
  open,
  onOpenChange,
  title,
  transactions,
  teamToolExpenses = [],
}: TransactionDetailsModalProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pago: "default",
      pendente: "secondary",
      previsto: "secondary",
    };
    
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const totalValue = transactions.reduce((sum, t) => sum + Number(t.amount), 0) +
    teamToolExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <p className="text-3xl font-bold text-primary mt-2">
            {formatCurrency(totalValue)}
          </p>
        </DialogHeader>

        <div className="mt-4">
          {transactions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Transações Financeiras</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.transaction_date)}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.transaction_type === 'receita' ? 'default' : 'destructive'}>
                          {transaction.transaction_type === 'receita' ? 'Receita' : 'Despesa'}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(Number(transaction.amount))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {teamToolExpenses.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Despesas com Equipe e Ferramentas</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamToolExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{formatDate(expense.expense_date)}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {expense.expense_type === 'equipe' ? 'Equipe' : 'Ferramenta'}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(expense.status)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(Number(expense.amount))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {transactions.length === 0 && teamToolExpenses.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma transação encontrada.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
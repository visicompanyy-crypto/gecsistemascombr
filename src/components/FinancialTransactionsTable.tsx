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
}

interface FinancialTransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function FinancialTransactionsTable({
  transactions,
  onEdit,
  onDelete,
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
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">Alerta</TableHead>
              <TableHead>Data de Pagamento</TableHead>
              <TableHead>Data de Entrada</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Centro de Custo</TableHead>
              <TableHead>Forma de Pagamento</TableHead>
              <TableHead>Variante</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
              const daysOverdue = Math.floor((new Date().getTime() - new Date(transaction.transaction_date).getTime()) / (1000 * 60 * 60 * 24));
              const alertBadge = getAlertBadge(transaction.status, daysOverdue);
              
              return (
                <TableRow key={transaction.id} className="hover:bg-muted/50">
                  <TableCell>
                    {alertBadge || (
                      <div className="flex items-center justify-center">
                        {transaction.transaction_type === 'receita' ? (
                          <span className="text-green-600">🔹</span>
                        ) : (
                          <span className="text-red-600">🔻</span>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {format(new Date(transaction.transaction_date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.transaction_date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    {transaction.transaction_type === 'receita' ? (
                      <span className="text-green-600 font-medium">🔹 Receita</span>
                    ) : (
                      <span className="text-red-600 font-medium">🔻 Despesa</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>{transaction.category || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.payment_method || 'Pix'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Fixa</Badge>
                  </TableCell>
                  <TableCell className={`text-right font-bold ${
                    transaction.transaction_type === 'receita' ? 'text-green-600' : 'text-red-600'
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
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-700 dark:text-green-300" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
                        onClick={() => onDelete(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-700 dark:text-red-300" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

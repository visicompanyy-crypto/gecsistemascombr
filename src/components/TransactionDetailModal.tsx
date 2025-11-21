import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Calendar, DollarSign, FileText, Tag, CreditCard, MapPin, Users, Pencil } from "lucide-react";

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
  payment_date?: string | null;
  due_date?: string | null;
  notes?: string | null;
  is_installment?: boolean | null;
  installment_number?: number | null;
  total_installments?: number | null;
  pix_key?: string | null;
  pix_recipient_name?: string | null;
  bank_account?: string | null;
  document_number?: string | null;
}

interface TransactionDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  onEdit?: (transaction: Transaction) => void;
}

export function TransactionDetailModal({
  open,
  onOpenChange,
  transaction,
  onEdit,
}: TransactionDetailModalProps) {
  if (!transaction) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">Detalhes da Transação</DialogTitle>
              <p className="text-muted-foreground">{transaction.description}</p>
            </div>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onEdit(transaction);
                  onOpenChange(false);
                }}
                className="ml-4"
              >
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Valor e Tipo */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Valor</p>
                <p className={`text-2xl font-bold ${
                  transaction.transaction_type === 'receita' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
            <Badge variant={transaction.transaction_type === 'receita' ? 'default' : 'destructive'}>
              {transaction.transaction_type === 'receita' ? '🔹 Receita' : '🔻 Despesa'}
            </Badge>
          </div>

          <Separator />

          {/* Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Status</p>
              <Badge variant={transaction.status === 'pago' ? 'info' : 'warning'} className="rounded-full">
                {transaction.status === 'pago' ? 'Pago' : 'Pendente'}
              </Badge>
            </div>
            {transaction.payment_method && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Forma de Pagamento</p>
                <Badge variant="outline">{transaction.payment_method}</Badge>
              </div>
            )}
          </div>

          <Separator />

          {/* Datas */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Data da Transação</p>
                <p className="font-medium">{formatDate(transaction.transaction_date)}</p>
              </div>
            </div>

            {transaction.payment_date && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Data de Pagamento</p>
                  <p className="font-medium">{formatDate(transaction.payment_date)}</p>
                </div>
              </div>
            )}

            {transaction.due_date && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Data de Vencimento</p>
                  <p className="font-medium">{formatDate(transaction.due_date)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Categoria e Centro de Custo */}
          {(transaction.category || transaction.cost_center_id) && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                {transaction.category && (
                  <div className="flex items-center gap-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Categoria</p>
                      <p className="font-medium">{transaction.category}</p>
                    </div>
                  </div>
                )}
                {transaction.cost_center_id && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Centro de Custo</p>
                      <p className="font-medium">{transaction.cost_center_id}</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Parcelamento */}
          {transaction.is_installment && (
            <>
              <Separator />
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Parcelamento</p>
                  <p className="font-medium">
                    Parcela {transaction.installment_number} de {transaction.total_installments}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Informações PIX */}
          {(transaction.pix_key || transaction.pix_recipient_name) && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Informações PIX
                </p>
                {transaction.pix_recipient_name && (
                  <div className="ml-6">
                    <p className="text-sm text-muted-foreground">Beneficiário</p>
                    <p className="font-medium">{transaction.pix_recipient_name}</p>
                  </div>
                )}
                {transaction.pix_key && (
                  <div className="ml-6">
                    <p className="text-sm text-muted-foreground">Chave PIX</p>
                    <p className="font-medium font-mono text-sm">{transaction.pix_key}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Informações Bancárias */}
          {(transaction.bank_account || transaction.document_number) && (
            <>
              <Separator />
              <div className="space-y-2">
                {transaction.bank_account && (
                  <div>
                    <p className="text-sm text-muted-foreground">Conta Bancária</p>
                    <p className="font-medium">{transaction.bank_account}</p>
                  </div>
                )}
                {transaction.document_number && (
                  <div>
                    <p className="text-sm text-muted-foreground">Número do Documento</p>
                    <p className="font-medium">{transaction.document_number}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Notas */}
          {transaction.notes && (
            <>
              <Separator />
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Observações</p>
                  <p className="text-sm whitespace-pre-wrap">{transaction.notes}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

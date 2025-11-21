import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface NewTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  transaction?: any;
}

export function NewTransactionModal({
  open,
  onOpenChange,
  onSuccess,
  transaction,
}: NewTransactionModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: transaction?.description || '',
    amount: transaction?.amount || '',
    transaction_type: transaction?.transaction_type || 'receita',
    transaction_date: transaction?.transaction_date ? new Date(transaction.transaction_date) : new Date(),
    status: transaction?.status || 'pendente',
    category: transaction?.category || '',
    payment_method: transaction?.payment_method || '',
    notes: transaction?.notes || '',
    variation_type: 'fixa',
    installments: '1',
    payment_date: transaction?.payment_date ? new Date(transaction.payment_date) : new Date(),
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        transaction_type: transaction.transaction_type,
        transaction_date: new Date(transaction.transaction_date),
        status: transaction.status,
        category: transaction.category || '',
        payment_method: transaction.payment_method || '',
        notes: transaction.notes || '',
        variation_type: 'fixa',
        installments: '1',
        payment_date: transaction.payment_date ? new Date(transaction.payment_date) : new Date(transaction.transaction_date),
      });
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      const data = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        transaction_type: formData.transaction_type,
        transaction_date: format(formData.transaction_date, 'yyyy-MM-dd'),
        status: formData.status,
        category: formData.category || null,
        payment_method: formData.payment_method || null,
        notes: formData.notes || null,
      };

      if (transaction) {
        const { error } = await supabase
          .from('financial_transactions')
          .update(data)
          .eq('id', transaction.id);

        if (error) throw error;

        toast({
          title: "Transação atualizada",
          description: "A transação foi atualizada com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from('financial_transactions')
          .insert({
            ...data,
            user_id: user.id,
          });

        if (error) throw error;

        toast({
          title: "Transação criada",
          description: "A transação foi criada com sucesso.",
        });
      }

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Novo Lançamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Data de Lançamento/Compra */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Data de Lançamento/Compra *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "w-full justify-start text-left font-normal border-input",
                      !formData.transaction_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {format(formData.transaction_date, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.transaction_date}
                    onSelect={(date) => date && setFormData({ ...formData, transaction_date: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">Data de registro/compra (apenas histórico)</p>
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tipo *</Label>
              <Select
                value={formData.transaction_type}
                onValueChange={(value) => setFormData({ ...formData, transaction_type: value })}
              >
                <SelectTrigger className="w-full border-input">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">🔶 Receita</SelectItem>
                  <SelectItem value="despesa">🔴 Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Forma de pagamento */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Forma de pagamento *</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
              >
                <SelectTrigger className="w-full border-input">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">Pix</SelectItem>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                  <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de variação */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tipo de variação *</Label>
              <Select
                value={formData.variation_type}
                onValueChange={(value) => setFormData({ ...formData, variation_type: value })}
              >
                <SelectTrigger className="w-full border-input">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixa">Fixa</SelectItem>
                  <SelectItem value="variavel">Variável</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Nome da movimentação */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Nome da movimentação *</Label>
            <Input
              id="description"
              placeholder="Ex: Pagamento fornecedor"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="border-input"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Centro de custo */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Centro de custo *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="w-full border-input">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operacional">Operacional</SelectItem>
                  <SelectItem value="administrativo">Administrativo</SelectItem>
                  <SelectItem value="vendas">Vendas</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="rh">Recursos Humanos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Valor total */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">Valor total *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="border-input"
                required
              />
            </div>

            {/* Data do Pagamento */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Data do Pagamento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "w-full justify-start text-left font-normal border-input",
                      !formData.payment_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {format(formData.payment_date, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.payment_date}
                    onSelect={(date) => date && setFormData({ ...formData, payment_date: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">Quando pagar/receber</p>
            </div>

            {/* Parcelas */}
            <div className="space-y-2">
              <Label htmlFor="installments" className="text-sm font-medium">Parcelas *</Label>
              <Input
                id="installments"
                type="number"
                min="1"
                placeholder="1"
                value={formData.installments}
                onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                className="border-input"
                required
              />
            </div>
          </div>

          {/* Observação */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">Observação (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione observações sobre esta transação..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="border-input resize-none"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-initial">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 sm:flex-initial bg-primary hover:bg-primary/90">
              {loading ? 'Salvando...' : 'Salvar lançamento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

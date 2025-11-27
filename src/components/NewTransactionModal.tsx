import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Settings2, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import CurrencyInput from 'react-currency-input-field';
import { CostCenterManagerModal } from "./CostCenterManagerModal";


interface NewTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  transaction?: any;
}

interface CostCenter {
  id: string;
  name: string;
  code?: string;
}

export function NewTransactionModal({
  open,
  onOpenChange,
  onSuccess,
  transaction,
}: NewTransactionModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [costCenterModalOpen, setCostCenterModalOpen] = useState(false);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    installments: '1',
    payment_method: '',
    variation_type: 'fixa',
    first_installment_date: new Date(),
    cost_center_id: '',
    transaction_type: 'despesa',
    transaction_date: new Date(),
    notes: '',
  });

  const [variableInstallments, setVariableInstallments] = useState<Array<{
    amount: string;
    date: Date;
  }>>([]);

  useEffect(() => {
    if (open) {
      fetchCostCenters();
      if (transaction) {
        setFormData({
          description: transaction.description,
          amount: transaction.amount.toString(),
          installments: '1',
          payment_method: transaction.payment_method || '',
          variation_type: 'fixa',
          first_installment_date: new Date(),
          cost_center_id: transaction.cost_center_id || '',
          transaction_type: transaction.transaction_type,
          transaction_date: new Date(transaction.transaction_date),
          notes: transaction.notes || '',
        });
      }
    }
  }, [open, transaction]);

  const fetchCostCenters = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('cost_centers')
        .select('id, name, code')
        .is('deleted_at', null)
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setCostCenters(data || []);
    } catch (error: any) {
      console.error('Error fetching cost centers:', error);
    }
  };

  const numInstallments = parseInt(formData.installments) || 1;
  const totalAmount = parseFloat(formData.amount.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  const installmentAmount = totalAmount / numInstallments;

  // Initialize variable installments when needed
  useEffect(() => {
    if (formData.variation_type === 'variavel' && numInstallments > 1) {
      const suggestedAmount = (totalAmount / numInstallments).toFixed(2);
      const newInstallments = Array.from({ length: numInstallments }, (_, i) => ({
        amount: suggestedAmount,
        date: addMonths(formData.first_installment_date, i),
      }));
      setVariableInstallments(newInstallments);
    }
  }, [formData.variation_type, numInstallments, formData.first_installment_date, totalAmount]);

  const getPreviewText = () => {
    if (numInstallments <= 1 || formData.variation_type === 'recorrente') return null;

    const firstDate = format(formData.first_installment_date, "dd/MM/yyyy");
    const dayOfMonth = format(formData.first_installment_date, "dd");
    const formattedAmount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(installmentAmount);

    if (formData.variation_type === 'variavel') {
      return `As parcelas serão geradas mensalmente a partir de ${firstDate}, e você pode ajustar os valores e datas manualmente.`;
    }

    // Tipo fixo
    return `O valor será dividido em ${numInstallments} parcelas de ${formattedAmount}, com vencimentos automáticos todo dia ${dayOfMonth} dos próximos meses. Você pode ajustar as datas manualmente se desejar.`;
  };

  const getRecurrencePreviewText = () => {
    if (formData.variation_type !== 'recorrente' || numInstallments <= 1) return null;
    
    const dayOfMonth = format(formData.first_installment_date, "dd");
    const formattedTotalAmount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(totalAmount);

    return `O valor de ${formattedTotalAmount} será repetido ${numInstallments} vezes, todo dia ${dayOfMonth} dos próximos meses. Você pode ajustar as datas manualmente se desejar.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || totalAmount <= 0) {
      toast({
        title: "Erro",
        description: "Valor total deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    // Validate variable installments
    if (formData.variation_type === 'variavel' && numInstallments > 1) {
      const sumOfInstallments = variableInstallments.reduce(
        (sum, inst) => sum + parseFloat(inst.amount.replace(/[^\d,]/g, '').replace(',', '.') || '0'),
        0
      );
      
      if (Math.abs(sumOfInstallments - totalAmount) > 0.01) {
        toast({
          title: "Erro de validação",
          description: "A soma das parcelas deve ser igual ao valor total",
          variant: "destructive",
        });
        return;
      }

      const hasEmptyDates = variableInstallments.some(inst => !inst.date);
      if (hasEmptyDates) {
        toast({
          title: "Erro de validação",
          description: "Todas as datas das parcelas devem ser preenchidas",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const userId = user.id;
      const numInstallments = parseInt(formData.installments);
      const totalAmount = parseFloat(formData.amount.replace(/[^\d,]/g, '').replace(',', '.'));
      
      // Para recorrência, o valor NÃO é dividido, é repetido
      const isRecurring = formData.variation_type === 'recorrente' && numInstallments > 1;
      const installmentAmount = isRecurring ? totalAmount : totalAmount / numInstallments;

      if (transaction) {
        // Edit mode
        const { error } = await supabase
          .from('financial_transactions')
          .update({
            description: formData.description,
            amount: totalAmount,
            transaction_type: formData.transaction_type,
            transaction_date: format(formData.transaction_date, 'yyyy-MM-dd'),
            payment_method: formData.payment_method || null,
            notes: formData.notes || null,
            cost_center_id: formData.cost_center_id || null,
          })
          .eq('id', transaction.id);

        if (error) throw error;

        toast({
          title: "Transação atualizada",
          description: "A transação foi atualizada com sucesso.",
        });
      } else {
        // Create mode
        const firstDate = formData.first_installment_date;
        const purchaseDate = format(formData.transaction_date, 'yyyy-MM-dd');

        if (numInstallments === 1 && formData.variation_type !== 'recorrente') {
          // Lançamento simples (sem parcelamento)
          const { error } = await supabase.from('financial_transactions').insert({
            user_id: userId,
            description: formData.description,
            amount: totalAmount,
            transaction_type: formData.transaction_type,
            transaction_date: format(formData.first_installment_date, 'yyyy-MM-dd'),
            purchase_date: purchaseDate,
            first_installment_date: format(formData.first_installment_date, 'yyyy-MM-dd'),
            payment_method: formData.payment_method,
            cost_center_id: formData.cost_center_id || null,
            notes: formData.notes || null,
            status: 'pendente',
            is_installment: false,
            installment_number: 1,
            total_installments: 1,
            parent_transaction_id: null,
            is_recurring: false,
          });

          if (error) throw error;

          toast({
            title: "Lançamento criado",
            description: "A transação foi criada com sucesso.",
          });
        } else {
          // Lançamento parcelado (fixo, variável ou recorrente)
          const isRecurring = formData.variation_type === 'recorrente';

          // Criar a primeira parcela
          const firstInstallmentAmount = formData.variation_type === 'variavel' 
            ? parseFloat(variableInstallments[0].amount.replace(/[^\d,]/g, '').replace(',', '.')) 
            : installmentAmount;

          const { data: firstInstallmentData, error: firstError } = await supabase
            .from('financial_transactions')
            .insert({
              user_id: userId,
              description: formData.description,
              amount: firstInstallmentAmount,
              transaction_type: formData.transaction_type,
              transaction_date: format(firstDate, 'yyyy-MM-dd'),
              purchase_date: purchaseDate,
              first_installment_date: format(firstDate, 'yyyy-MM-dd'),
              payment_method: formData.payment_method,
              cost_center_id: formData.cost_center_id || null,
              notes: formData.notes || null,
              status: 'pendente',
              is_installment: true,
              installment_number: 1,
              total_installments: numInstallments,
              parent_transaction_id: null, // A primeira parcela não tem pai
              is_recurring: isRecurring,
              recurrence_frequency: isRecurring ? 'monthly' : null,
            })
            .select()
            .single();

          if (firstError) throw firstError;

          const parentId = firstInstallmentData.id;

          // Atualizar a primeira parcela para apontar para si mesma como parent
          await supabase
            .from('financial_transactions')
            .update({ parent_transaction_id: parentId })
            .eq('id', parentId);

          // Criar as demais parcelas
          const installments = [];
          for (let i = 1; i < numInstallments; i++) {
            const installmentDate = addMonths(firstDate, i);
            const installmentAmountValue = formData.variation_type === 'variavel' 
              ? parseFloat(variableInstallments[i].amount.replace(/[^\d,]/g, '').replace(',', '.')) 
              : installmentAmount;

            installments.push({
              user_id: userId,
              description: formData.description,
              amount: installmentAmountValue,
              transaction_type: formData.transaction_type,
              transaction_date: format(installmentDate, 'yyyy-MM-dd'),
              purchase_date: purchaseDate,
              first_installment_date: format(firstDate, 'yyyy-MM-dd'),
              payment_method: formData.payment_method,
              cost_center_id: formData.cost_center_id || null,
              notes: formData.notes || null,
              status: 'pendente',
              is_installment: true,
              installment_number: i + 1,
              total_installments: numInstallments,
              parent_transaction_id: parentId,
              is_recurring: isRecurring,
              recurrence_frequency: isRecurring ? 'monthly' : null,
            });
          }

          if (installments.length > 0) {
            const { error } = await supabase.from('financial_transactions').insert(installments);
            if (error) throw error;
          }

          const typeLabel = formData.variation_type === 'recorrente' ? 'recorrente' : 
                           formData.variation_type === 'variavel' ? 'com valores variáveis' : 'parcelada';

          toast({
            title: "Lançamento criado",
            description: `Transação ${typeLabel} em ${numInstallments}x criada com sucesso.`,
          });
        }
      }

      onOpenChange(false);
      if (onSuccess) onSuccess();
      
      // Reset form
      setFormData({
        description: '',
        amount: '',
        installments: '1',
        payment_method: '',
        variation_type: 'fixa',
        first_installment_date: new Date(),
        cost_center_id: '',
        transaction_type: 'despesa',
        transaction_date: new Date(),
        notes: '',
      });
      setVariableInstallments([]);
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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[720px] max-h-[90vh] overflow-y-auto bg-[#f6f7f8] rounded-[18px] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-secondary">
              {transaction ? 'Editar Lançamento' : 'Novo Lançamento'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm text-muted-foreground">
                Nome *
              </Label>
              <Input
                id="description"
                placeholder="Ex: Aluguel, Salário, Compra de material..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border-input bg-white focus-visible:ring-primary"
                required
              />
            </div>

            {/* Valor Total */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm text-muted-foreground">
                Valor total *
              </Label>
              <CurrencyInput
                id="amount"
                placeholder="R$ 0,00"
                value={formData.amount}
                onValueChange={(value) => setFormData({ ...formData, amount: value || '' })}
                decimalsLimit={2}
                decimalSeparator=","
                groupSeparator="."
                prefix="R$ "
                className="flex h-10 w-full rounded-lg border border-input bg-white px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Número de Parcelas */}
              <div className="space-y-2">
                <Label htmlFor="installments" className="text-sm text-muted-foreground">
                  Número de parcelas *
                </Label>
                <Input
                  id="installments"
                  type="number"
                  min="1"
                  placeholder="1"
                  value={formData.installments}
                  onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                  className="border-input bg-white focus-visible:ring-primary"
                  required
                />
              </div>

              {/* Forma de Pagamento */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Forma de pagamento *</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                >
                  <SelectTrigger className="border-input bg-white focus:ring-primary">
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
            </div>

            {/* Tipo de Variação - only visible when installments > 1 */}
            {numInstallments > 1 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Tipo de variação *</Label>
                <Select
                  value={formData.variation_type}
                  onValueChange={(value) => setFormData({ ...formData, variation_type: value })}
                >
                  <SelectTrigger className="border-input bg-white focus:ring-primary">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixa">Fixa (divisão igualitária)</SelectItem>
                    <SelectItem value="variavel">Variável (valores personalizados)</SelectItem>
                    <SelectItem value="recorrente">Recorrente (mensal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Data da Primeira Parcela */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Data da primeira parcela *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "w-full justify-start text-left font-normal border-input bg-white hover:bg-white/80",
                      !formData.first_installment_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {format(formData.first_installment_date, "dd/MM/yyyy", { locale: ptBR })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.first_installment_date}
                    onSelect={(date) => date && setFormData({ ...formData, first_installment_date: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Variable Installments Table */}
            {numInstallments > 1 && formData.variation_type === 'variavel' && (
              <div className="space-y-3">
                <Label className="text-sm text-muted-foreground">Valores das parcelas</Label>
                <div className="bg-white border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Parcela</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Data</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {variableInstallments.map((inst, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{index + 1}/{numInstallments}</TableCell>
                          <TableCell>
                            <CurrencyInput
                              placeholder="R$ 0,00"
                              value={inst.amount}
                              onValueChange={(value) => {
                                const newInstallments = [...variableInstallments];
                                newInstallments[index].amount = value || '';
                                setVariableInstallments(newInstallments);
                              }}
                              decimalsLimit={2}
                              decimalSeparator=","
                              groupSeparator="."
                              prefix="R$ "
                              className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm"
                            />
                          </TableCell>
                          <TableCell>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="w-full justify-start text-left font-normal"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {format(inst.date, "dd/MM/yyyy", { locale: ptBR })}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={inst.date}
                                  onSelect={(date) => {
                                    if (date) {
                                      const newInstallments = [...variableInstallments];
                                      newInstallments[index].date = date;
                                      setVariableInstallments(newInstallments);
                                    }
                                  }}
                                  initialFocus
                                  className="pointer-events-auto"
                                />
                              </PopoverContent>
                            </Popover>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {(() => {
                  const sumOfInstallments = variableInstallments.reduce(
                    (sum, inst) => sum + parseFloat(inst.amount.replace(/[^\d,]/g, '').replace(',', '.') || '0'),
                    0
                  );
                  const difference = Math.abs(sumOfInstallments - totalAmount);
                  if (difference > 0.01) {
                    return (
                      <div className="flex items-start gap-2 text-sm text-destructive">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          Soma das parcelas: R$ {sumOfInstallments.toFixed(2)} (diferença: R$ {difference.toFixed(2)})
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}

            {/* Preview Automático */}
            {getPreviewText() && (
              <div className="bg-white border border-border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground leading-relaxed">
                    {getPreviewText()}
                  </p>
                </div>
              </div>
            )}

            {/* Preview para Recorrência */}
            {getRecurrencePreviewText() && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-lg mt-0.5 flex-shrink-0">⟳</span>
                  <p className="text-sm text-primary font-medium leading-relaxed">
                    {getRecurrencePreviewText()}
                  </p>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {/* Tipo */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Tipo *</Label>
                <Select
                  value={formData.transaction_type}
                  onValueChange={(value) => setFormData({ ...formData, transaction_type: value })}
                >
                  <SelectTrigger className="border-input bg-white focus:ring-primary">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receita">🔶 Receita</SelectItem>
                    <SelectItem value="despesa">🔴 Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Centro de Custo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">Centro de custo *</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCostCenterModalOpen(true)}
                    className="h-8 gap-1 text-primary hover:text-primary/90"
                  >
                    <Settings2 className="w-4 h-4" />
                    Gerenciar
                  </Button>
                </div>
                <Select
                  value={formData.cost_center_id}
                  onValueChange={(value) => setFormData({ ...formData, cost_center_id: value })}
                >
                  <SelectTrigger className="border-input bg-white focus:ring-primary">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {costCenters.map((center) => (
                      <SelectItem key={center.id} value={center.id}>
                        {center.name} {center.code ? `(${center.code})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Data de Lançamento */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Data de lançamento/compra *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "w-full justify-start text-left font-normal border-input bg-white hover:bg-white/80",
                      !formData.transaction_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {format(formData.transaction_date, "dd/MM/yyyy", { locale: ptBR })}
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

            {/* Observação */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm text-muted-foreground">
                Observação (opcional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Adicione observações sobre esta transação..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="border-input bg-white resize-none focus-visible:ring-primary"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                className="flex-1 sm:flex-initial border-input"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 sm:flex-initial bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading ? 'Salvando...' : 'Salvar lançamento'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <CostCenterManagerModal
        open={costCenterModalOpen}
        onOpenChange={setCostCenterModalOpen}
        onUpdate={fetchCostCenters}
      />
    </>
  );
}

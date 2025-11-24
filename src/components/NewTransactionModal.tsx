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
import { format, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import CurrencyInput from 'react-currency-input-field';
import { CostCenterManagerModal } from "./CostCenterManagerModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface NewTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  transaction?: any;
}

interface VariableInstallment {
  installmentNumber: number;
  amount: string;
  date: Date;
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
  const [variableInstallments, setVariableInstallments] = useState<VariableInstallment[]>([]);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    installments: '1',
    payment_method: '',
    variation_type: '',
    first_installment_date: new Date(),
    cost_center_id: '',
    transaction_type: 'despesa',
    transaction_date: new Date(),
    notes: '',
  });

  useEffect(() => {
    if (open) {
      fetchCostCenters();
      if (transaction) {
        setFormData({
          description: transaction.description,
          amount: transaction.amount.toString(),
          installments: '1',
          payment_method: transaction.payment_method || '',
          variation_type: '',
          first_installment_date: new Date(),
          cost_center_id: transaction.cost_center_id || '',
          transaction_type: transaction.transaction_type,
          transaction_date: new Date(transaction.transaction_date),
          notes: transaction.notes || '',
        });
      }
    }
  }, [open, transaction]);

  useEffect(() => {
    const numInstallments = parseInt(formData.installments) || 1;
    if (formData.variation_type === 'variavel' && numInstallments > 1) {
      const newInstallments: VariableInstallment[] = Array.from({ length: numInstallments }, (_, i) => ({
        installmentNumber: i + 1,
        amount: '',
        date: addMonths(formData.first_installment_date, i),
      }));
      setVariableInstallments(newInstallments);
    }
  }, [formData.variation_type, formData.installments, formData.first_installment_date]);

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

  const showVariationType = formData.payment_method !== 'cartao_credito';
  const isVariableType = formData.variation_type === 'variavel';
  const numInstallments = parseInt(formData.installments) || 1;
  const totalAmount = parseFloat(formData.amount.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  const installmentAmount = totalAmount / numInstallments;

  const getPreviewText = () => {
    if (numInstallments <= 1) return null;
    
    const day = format(formData.first_installment_date, 'dd');
    const formattedAmount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(installmentAmount);

    return `O valor será dividido em ${numInstallments} parcelas de ${formattedAmount}, com vencimentos automáticos todo dia ${day} dos próximos meses. Você pode ajustar as datas manualmente se desejar.`;
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

    if (isVariableType) {
      const totalVariableAmount = variableInstallments.reduce(
        (sum, inst) => sum + (parseFloat(inst.amount.replace(/[^\d,]/g, '').replace(',', '.')) || 0),
        0
      );
      
      if (Math.abs(totalVariableAmount - totalAmount) > 0.01) {
        toast({
          title: "Erro",
          description: "A soma das parcelas variáveis deve ser igual ao valor total",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

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
        // Create mode with installments
        if (numInstallments > 1) {
          // Create parent transaction
          const parentData = {
            description: formData.description,
            amount: totalAmount,
            transaction_type: formData.transaction_type,
            transaction_date: format(formData.transaction_date, 'yyyy-MM-dd'),
            purchase_date: format(formData.transaction_date, 'yyyy-MM-dd'),
            first_installment_date: format(formData.first_installment_date, 'yyyy-MM-dd'),
            payment_method: formData.payment_method || null,
            notes: formData.notes || null,
            cost_center_id: formData.cost_center_id || null,
            is_installment: true,
            total_installments: numInstallments,
            status: 'pendente',
            user_id: user.id,
          };

          const { data: parentTransaction, error: parentError } = await supabase
            .from('financial_transactions')
            .insert(parentData)
            .select()
            .single();

          if (parentError) throw parentError;

          // Create installment transactions
          const installmentsData = [];
          
          if (isVariableType) {
            for (const inst of variableInstallments) {
              const instAmount = parseFloat(inst.amount.replace(/[^\d,]/g, '').replace(',', '.'));
              installmentsData.push({
                description: `${formData.description} - Parcela ${inst.installmentNumber}/${numInstallments}`,
                amount: instAmount,
                transaction_type: formData.transaction_type,
                transaction_date: format(inst.date, 'yyyy-MM-dd'),
                due_date: format(inst.date, 'yyyy-MM-dd'),
                payment_method: formData.payment_method || null,
                cost_center_id: formData.cost_center_id || null,
                is_installment: true,
                installment_number: inst.installmentNumber,
                total_installments: numInstallments,
                parent_transaction_id: parentTransaction.id,
                status: 'pendente',
                user_id: user.id,
              });
            }
          } else {
            for (let i = 0; i < numInstallments; i++) {
              const installmentDate = addMonths(formData.first_installment_date, i);
              installmentsData.push({
                description: `${formData.description} - Parcela ${i + 1}/${numInstallments}`,
                amount: installmentAmount,
                transaction_type: formData.transaction_type,
                transaction_date: format(installmentDate, 'yyyy-MM-dd'),
                due_date: format(installmentDate, 'yyyy-MM-dd'),
                payment_method: formData.payment_method || null,
                cost_center_id: formData.cost_center_id || null,
                is_installment: true,
                installment_number: i + 1,
                total_installments: numInstallments,
                parent_transaction_id: parentTransaction.id,
                is_recurring: formData.variation_type === 'recorrente',
                status: 'pendente',
                user_id: user.id,
              });
            }
          }

          const { error: installmentsError } = await supabase
            .from('financial_transactions')
            .insert(installmentsData);

          if (installmentsError) throw installmentsError;

          toast({
            title: "Lançamento criado",
            description: `Transação parcelada em ${numInstallments}x criada com sucesso.`,
          });
        } else {
          // Single transaction
          const { error } = await supabase
            .from('financial_transactions')
            .insert({
              description: formData.description,
              amount: totalAmount,
              transaction_type: formData.transaction_type,
              transaction_date: format(formData.transaction_date, 'yyyy-MM-dd'),
              due_date: format(formData.first_installment_date, 'yyyy-MM-dd'),
              payment_method: formData.payment_method || null,
              notes: formData.notes || null,
              cost_center_id: formData.cost_center_id || null,
              status: 'pendente',
              user_id: user.id,
            });

          if (error) throw error;

          toast({
            title: "Lançamento criado",
            description: "A transação foi criada com sucesso.",
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
        variation_type: '',
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
                  onValueChange={(value) => setFormData({ ...formData, payment_method: value, variation_type: value === 'cartao_credito' ? '' : formData.variation_type })}
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

            {/* Tipo de Variação (only if not credit card and has installments) */}
            {showVariationType && numInstallments > 1 && (
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
                    <SelectItem value="recorrente">Recorrente</SelectItem>
                    <SelectItem value="variavel">Variável</SelectItem>
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
            {isVariableType && numInstallments > 1 && (
              <div className="space-y-3 bg-white rounded-lg p-4 border border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  <span>Defina o valor e data de cada parcela</span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parcela</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {variableInstallments.map((inst, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {inst.installmentNumber}/{numInstallments}
                        </TableCell>
                        <TableCell>
                          <CurrencyInput
                            placeholder="R$ 0,00"
                            value={inst.amount}
                            onValueChange={(value) => {
                              const updated = [...variableInstallments];
                              updated[index].amount = value || '';
                              setVariableInstallments(updated);
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
                              <Button variant="outline" className="w-full justify-start text-left font-normal h-9 text-sm">
                                <CalendarIcon className="mr-2 h-3 w-3" />
                                {format(inst.date, "dd/MM/yy")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={inst.date}
                                onSelect={(date) => {
                                  if (date) {
                                    const updated = [...variableInstallments];
                                    updated[index].date = date;
                                    setVariableInstallments(updated);
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
            )}

            {/* Preview Automático */}
            {numInstallments > 1 && !isVariableType && (
              <div className="bg-white border border-border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground leading-relaxed">
                    {getPreviewText()}
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

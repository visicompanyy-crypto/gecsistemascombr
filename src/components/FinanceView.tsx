import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { FinancialSummaryCards } from "./FinancialSummaryCards";
import { FinanceChartSection } from "./FinanceChartSection";
import { FinancePieCharts } from "./FinancePieCharts";
import { FinancialTransactionsTable } from "./FinancialTransactionsTable";
import { FinancialFilters } from "./FinancialFilters";
import { NewTransactionModal } from "./NewTransactionModal";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { useToast } from "@/hooks/use-toast";
import { Header } from "./Header";

export function FinanceView() {
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [costCenterFilter, setCostCenterFilter] = useState("all");
  const [currentMonth] = useState(new Date());

  const { data: transactions, refetch } = useQuery({
    queryKey: ['financial-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .is('deleted_at', null)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Realtime subscription para atualização automática
  useEffect(() => {
    const channel = supabase
      .channel('financial-transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'financial_transactions'
        },
        (payload) => {
          console.log('Transação atualizada em tempo real:', payload);
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const summary = useFinancialSummary(transactions);

  const handleEdit = (transaction: any) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Transação excluída",
        description: "A transação foi excluída com sucesso.",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedTransaction(null);
  };

  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.transaction_type === typeFilter;
    const matchesPaymentMethod = paymentMethodFilter === "all" || transaction.payment_method === paymentMethodFilter;
    const matchesCostCenter = costCenterFilter === "all" || transaction.category === costCenterFilter;
    return matchesSearch && matchesType && matchesPaymentMethod && matchesCostCenter;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setPaymentMethodFilter("all");
    setCostCenterFilter("all");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentMonth={currentMonth} />
      
      <div className="max-w-7xl mx-auto p-8 space-y-8 mt-8">

        <FinancialSummaryCards
          totalReceitas={summary.totalReceitas}
          totalDespesas={summary.totalDespesas}
          saldo={summary.saldo}
          receitasFuturas={summary.receitasFuturas}
          despesasFuturas={summary.despesasFuturas}
          receitasDoMes={summary.receitasDoMes}
          despesasDoMes={summary.despesasDoMes}
        />

        <Button onClick={() => setModalOpen(true)} className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" />
          Novo Lançamento
        </Button>

        <Card className="p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold mb-6 text-secondary">Lista de Lançamentos</h2>
            <FinancialFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              paymentMethodFilter={paymentMethodFilter}
              onPaymentMethodFilterChange={setPaymentMethodFilter}
              costCenterFilter={costCenterFilter}
              onCostCenterFilterChange={setCostCenterFilter}
              onClearFilters={handleClearFilters}
            />
          </div>

          <FinancialTransactionsTable
            transactions={filteredTransactions || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-8 bg-gradient-to-br from-card to-muted/30 shadow-sm border-border/50">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-secondary uppercase tracking-wide">Total de Receitas</h3>
              <p className="text-4xl font-semibold text-primary">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.totalReceitas)}
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-gradient-to-br from-card to-muted/30 shadow-sm border-border/50">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-secondary uppercase tracking-wide">Total de Despesas</h3>
              <p className="text-4xl font-semibold text-destructive">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.totalDespesas)}
              </p>
            </div>
          </Card>
        </div>

        <Card className="p-8 bg-gradient-to-br from-secondary/10 to-secondary/20 shadow-sm border-secondary/30">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-secondary uppercase tracking-wide">Saldo Líquido</h3>
            <p className="text-5xl font-semibold text-primary">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.saldo)}
            </p>
          </div>
        </Card>

        <FinancePieCharts data={summary.transactionsByCategory} />

        <NewTransactionModal
          open={modalOpen}
          onOpenChange={handleModalClose}
          onSuccess={() => {
            refetch();
            handleModalClose();
          }}
          transaction={selectedTransaction}
        />
      </div>
    </div>
  );
}

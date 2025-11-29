import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { FinancialSummaryCards } from "./FinancialSummaryCards";
import { FinanceChartSection } from "./FinanceChartSection";
import { FinancePieCharts } from "./FinancePieCharts";
import { FinancialTransactionsTable } from "./FinancialTransactionsTable";
import { FinancialFilters } from "./FinancialFilters";
import { NewTransactionModal } from "./NewTransactionModal";
import { TransactionDetailModal } from "./TransactionDetailModal";
import { FirstAccessModal } from "./FirstAccessModal";
import { WelcomeCard } from "./WelcomeCard";
import { DailyReminder } from "./DailyReminder";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { useToast } from "@/hooks/use-toast";
import { Header } from "./Header";
import { OnboardingTour } from "./OnboardingTour";
import { useCompanySettings } from "@/contexts/CompanySettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { CostCenterManagerModal } from "./CostCenterManagerModal";
import { ClientManagerModal } from "./ClientManagerModal";

export function FinanceView() {
  const { toast } = useToast();
  const { settings, loading: settingsLoading, refreshSettings } = useCompanySettings();
  const { subscription } = useAuth();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [firstAccessModalOpen, setFirstAccessModalOpen] = useState(false);
  const [costCenterManagerOpen, setCostCenterManagerOpen] = useState(false);
  const [clientManagerOpen, setClientManagerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [costCenterFilter, setCostCenterFilter] = useState("all");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Show first access modal if user is subscribed but hasn't completed onboarding
  useEffect(() => {
    if (!settingsLoading && subscription?.subscribed && !settings?.onboarding_completed) {
      setFirstAccessModalOpen(true);
    }
  }, [settingsLoading, subscription, settings]);

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const { user } = useAuth();

  const { data: transactions, refetch: refetchTransactions } = useQuery({
    queryKey: ['financial-transactions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          cost_centers (
            name
          )
        `)
        .is('deleted_at', null)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: teamToolExpenses, refetch: refetchTeamToolExpenses } = useQuery({
    queryKey: ['team-tool-expenses', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('team_tool_expenses')
        .select('*')
        .is('deleted_at', null)
        .order('expense_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });


  const primeiroDiaDoMes = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const ultimoDiaDoMes = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  const teamToolExpensesDoMes = teamToolExpenses?.filter(e => {
    const dataExpense = new Date(e.expense_date);
    return dataExpense >= primeiroDiaDoMes && dataExpense <= ultimoDiaDoMes;
  });

  const summary = useFinancialSummary(transactions, teamToolExpenses, currentMonth);
  
  // Filtrar transações para exibir apenas as do mês selecionado na tabela
  const transactionsDoMes = transactions?.filter(t => {
    const dataTransacao = new Date(t.transaction_date);
    return dataTransacao >= primeiroDiaDoMes && dataTransacao <= ultimoDiaDoMes;
  });

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
      refetchTransactions();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (transaction: any) => {
    setSelectedTransaction(transaction);
    setDetailModalOpen(true);
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .update({
          status: 'pago',
          payment_date: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Transação marcada como paga!",
        description: "Os valores foram atualizados automaticamente.",
      });
      refetchTransactions();
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

  const filteredTransactions = transactionsDoMes?.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.transaction_type === typeFilter;
    const matchesPaymentMethod = paymentMethodFilter === "all" || transaction.payment_method === paymentMethodFilter;
    const matchesCostCenter = costCenterFilter === "all" || transaction.cost_center_id === costCenterFilter;
    return matchesSearch && matchesType && matchesPaymentMethod && matchesCostCenter;
  });

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setPaymentMethodFilter("all");
    setCostCenterFilter("all");
  };

  const handleFirstAccessComplete = async () => {
    await refreshSettings();
    // Refetch transactions to include newly created cost centers
    refetchTransactions();
  };

  return (
    <div className="min-h-screen bg-background">
      <OnboardingTour />
      <Header 
        currentMonth={currentMonth} 
        onOpenCompanySettings={() => setFirstAccessModalOpen(true)}
        onOpenCostCenterManager={() => setCostCenterManagerOpen(true)}
        onNewTransaction={() => setModalOpen(true)}
        onManageClients={() => setClientManagerOpen(true)}
      />
      
      <div className="max-w-[1320px] mx-auto px-6 py-8 space-y-8 mt-8">
        <WelcomeCard />

        <div data-tour="summary-cards">
          <FinancialSummaryCards
            resultadoDoMes={summary.resultadoDoMes}
            receitaTotalRecebida={summary.receitaTotalRecebida}
            receitasFuturas={summary.receitasFuturas}
            despesasFuturas={summary.despesasFuturas}
            receitasDoMes={summary.receitasDoMes}
            totalAPagarNoMes={summary.totalAPagarNoMes}
            listaReceitaTotalRecebida={summary.listaReceitaTotalRecebida}
            listaReceitasFuturas={summary.listaReceitasFuturas}
            listaDespesasFuturas={summary.listaDespesasFuturas}
            listaReceitasDoMes={summary.listaReceitasDoMes}
            listaDespesasDoMes={summary.listaDespesasDoMes}
            teamToolExpensesDoMes={teamToolExpensesDoMes}
          />
        </div>

        <div className="flex items-center gap-6">
          <Button 
            data-tour="new-transaction"
            onClick={() => setModalOpen(true)} 
            className="gap-2 bg-primary hover:bg-primary-dark text-primary-foreground rounded-[10px] px-6 py-2.5 font-medium shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            Novo Lançamento
          </Button>

          <div data-tour="month-selector" className="flex items-center gap-3 bg-card border border-border rounded-lg px-5 py-2.5 shadow-sm">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handlePreviousMonth}
              className="h-9 w-9 hover:bg-muted"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm font-semibold min-w-[160px] text-center text-foreground">
              {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}
            </span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleNextMonth}
              className="h-9 w-9 hover:bg-muted"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Card className="p-8 space-y-6 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.06)] border-border">
          <div>
            <h2 className="text-xl font-semibold mb-6 text-foreground">Lista de Lançamentos</h2>
            <div data-tour="filters">
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
          </div>

          <div data-tour="transactions-table">
            <FinancialTransactionsTable
              transactions={filteredTransactions || []}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              onMarkAsPaid={handleMarkAsPaid}
            />
          </div>
        </Card>

        <div className="grid gap-5 md:grid-cols-2">
          <Card className="p-8 bg-card rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.06)] border border-border">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-income uppercase tracking-wide">Total de Receitas Recebidas no Mês</h3>
              <p className="text-5xl font-bold text-income">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.receitaTotalRecebidaDoMes)}
              </p>
            </div>
          </Card>

          <Card className="p-8 bg-card rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.06)] border border-border">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Total a Pagar no Mês</h3>
              <p className="text-5xl font-bold text-destructive">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.totalAPagarNoMes)}
              </p>
            </div>
          </Card>
        </div>

        <div data-tour="charts">
          <FinancePieCharts 
            data={summary.transactionsByCategoryDoMes} 
            currentMonth={currentMonth}
          />
        </div>

        <NewTransactionModal
          open={modalOpen}
          onOpenChange={handleModalClose}
          onSuccess={() => {
            refetchTransactions();
            handleModalClose();
          }}
          transaction={selectedTransaction}
        />

        <TransactionDetailModal
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          transaction={selectedTransaction}
          onEdit={handleEdit}
        />

        <FirstAccessModal
          open={firstAccessModalOpen}
          onOpenChange={setFirstAccessModalOpen}
          onComplete={handleFirstAccessComplete}
        />

        <CostCenterManagerModal
          open={costCenterManagerOpen}
          onOpenChange={setCostCenterManagerOpen}
        />

        <ClientManagerModal
          open={clientManagerOpen}
          onOpenChange={setClientManagerOpen}
        />
      </div>
      
      {/* Daily reminder popup */}
      <DailyReminder />
    </div>
  );
}

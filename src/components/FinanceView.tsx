import { useState, useEffect, useMemo } from "react";
import { format, parseISO, startOfDay } from "date-fns";
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
import { RenewalAlert } from "./RenewalAlert";
import { AIAssistantButton } from "./AIAssistant";
import { CustomColumnBar } from "./CustomColumnBar";
import { CustomColumnManagerModal } from "./CustomColumnManagerModal";
import { useCustomColumns } from "@/hooks/useCustomColumns";
import { TrialBanner } from "./TrialBanner";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Skeleton } from "@/components/ui/skeleton";

export function FinanceView() {
  const { toast } = useToast();
  const { settings, loading: settingsLoading, refreshSettings } = useCompanySettings();
  const { subscription } = useAuth();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [firstAccessModalOpen, setFirstAccessModalOpen] = useState(false);
  const [costCenterManagerOpen, setCostCenterManagerOpen] = useState(false);
  const [clientManagerOpen, setClientManagerOpen] = useState(false);
  const [customColumnManagerOpen, setCustomColumnManagerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [inputSearchTerm, setInputSearchTerm] = useState("");
  const debouncedSearchTerm = useDebouncedValue(inputSearchTerm, 300);
  const [typeFilter, setTypeFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [costCenterFilter, setCostCenterFilter] = useState("all");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [canStartTour, setCanStartTour] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState(50);

  // Custom columns hook
  const { getCostCentersForColumn, costCenters } = useCustomColumns();

  // Show first access modal if user is subscribed but hasn't completed onboarding
  useEffect(() => {
    // Só prossegue quando terminou de carregar as settings E o usuário está inscrito
    if (!settingsLoading && subscription?.subscribed) {
      // Se settings é null, significa que o usuário nunca configurou (primeiro acesso)
      if (settings === null) {
        setFirstAccessModalOpen(true);
        setCanStartTour(false);
      } else if (settings.onboarding_completed === false) {
        // Settings existe mas onboarding não foi completado
        setFirstAccessModalOpen(true);
        setCanStartTour(false);
      } else {
        // Onboarding já completado - não abre modal
        setCanStartTour(true);
      }
    }
  }, [settingsLoading, subscription, settings]);

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const { user } = useAuth();

  const { data: transactions, refetch: refetchTransactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['financial-transactions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          cost_centers (
            name,
            custom_column_id
          )
        `)
        .is('deleted_at', null)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });

  const { data: teamToolExpenses, refetch: refetchTeamToolExpenses, isLoading: isLoadingExpenses } = useQuery({
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
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });


  const primeiroDiaDoMes = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const ultimoDiaDoMes = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  const teamToolExpensesDoMes = teamToolExpenses?.filter(e => {
    const dataExpense = new Date(e.expense_date);
    return dataExpense >= primeiroDiaDoMes && dataExpense <= ultimoDiaDoMes;
  });

  // Filter transactions by selected column (using custom_column_id directly)
  const transactionsFilteredByColumn = transactions?.filter(t => {
    if (!selectedColumnId) return true; // No column selected, show all
    return t.custom_column_id === selectedColumnId;
  });

  // Filter team tool expenses by selected column
  const teamToolExpensesFilteredByColumn = teamToolExpenses?.filter(e => {
    if (!selectedColumnId) return true;
    // Team tool expenses might need to be filtered by cost_center's column
    return true; // For now, show all team tool expenses
  });

  const summary = useFinancialSummary(transactionsFilteredByColumn, teamToolExpensesFilteredByColumn, currentMonth);
  
  // Filtrar transações para exibir apenas as do mês selecionado na tabela
  const transactionsDoMes = transactionsFilteredByColumn?.filter(t => {
    const dataTransacao = new Date(t.transaction_date);
    return dataTransacao >= primeiroDiaDoMes && dataTransacao <= ultimoDiaDoMes;
  });

  // Get cost centers available for filter (filtered by selected column or all)
  const availableCostCentersForFilter = selectedColumnId
    ? getCostCentersForColumn(selectedColumnId)
    : costCenters ?? [];

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
          payment_date: format(new Date(), 'yyyy-MM-dd'),
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
    const matchesSearch = transaction.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.transaction_type === typeFilter;
    const matchesPaymentMethod = paymentMethodFilter === "all" || transaction.payment_method === paymentMethodFilter;
    const matchesCostCenter = costCenterFilter === "all" || transaction.cost_center_id === costCenterFilter;
    return matchesSearch && matchesType && matchesPaymentMethod && matchesCostCenter;
  });

  // Ordenar transações: pendentes no topo (por proximidade de vencimento), depois pagas
  const sortedTransactions = useMemo(() => {
    if (!filteredTransactions) return [];
    
    const today = startOfDay(new Date());
    
    // Separar pendentes e pagas
    const pending = filteredTransactions.filter(t => t.status === 'pendente');
    const paid = filteredTransactions.filter(t => t.status === 'pago');
    
    // Ordenar pendentes pela proximidade do due_date (mais próximo primeiro)
    pending.sort((a, b) => {
      const dateA = a.due_date ? parseISO(a.due_date) : parseISO(a.transaction_date);
      const dateB = b.due_date ? parseISO(b.due_date) : parseISO(b.transaction_date);
      return dateA.getTime() - dateB.getTime();
    });
    
    // Ordenar pagas pela data de pagamento mais recente primeiro
    paid.sort((a, b) => {
      const dateA = parseISO(a.transaction_date);
      const dateB = parseISO(b.transaction_date);
      return dateB.getTime() - dateA.getTime();
    });
    
    return [...pending, ...paid];
  }, [filteredTransactions]);

  const handleClearFilters = () => {
    setInputSearchTerm("");
    setTypeFilter("all");
    setPaymentMethodFilter("all");
    setCostCenterFilter("all");
  };

  const handleFirstAccessComplete = async () => {
    await refreshSettings();
    // Refetch transactions to include newly created cost centers
    refetchTransactions();
    // Allow tour to start after onboarding is complete
    setCanStartTour(true);
  };

  // Show skeleton loading while initial data loads
  if (isLoadingTransactions || isLoadingExpenses) {
    return (
      <div className="min-h-screen bg-background">
        <TrialBanner />
        <Header 
          currentMonth={currentMonth} 
          onOpenCompanySettings={() => setFirstAccessModalOpen(true)}
          onOpenCostCenterManager={() => setCostCenterManagerOpen(true)}
          onNewTransaction={() => setModalOpen(true)}
          onManageClients={() => setClientManagerOpen(true)}
        />
        <div className="max-w-[1320px] mx-auto px-6 py-8 space-y-8 mt-8">
          {/* Summary Cards Skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          {/* Button and Month Selector Skeleton */}
          <div className="flex items-center gap-6">
            <Skeleton className="h-10 w-40 rounded-lg" />
            <Skeleton className="h-10 w-48 rounded-lg" />
          </div>
          {/* Column Bar Skeleton */}
          <Skeleton className="h-12 w-full rounded-lg" />
          {/* Table Skeleton */}
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // Limit displayed transactions for performance
  const displayedTransactions = sortedTransactions.slice(0, displayLimit);
  const hasMoreTransactions = sortedTransactions.length > displayLimit;

  return (
    <div className="min-h-screen bg-background">
      <TrialBanner />
      <OnboardingTour shouldRun={canStartTour && !firstAccessModalOpen} />
      <Header 
        currentMonth={currentMonth} 
        onOpenCompanySettings={() => setFirstAccessModalOpen(true)}
        onOpenCostCenterManager={() => setCostCenterManagerOpen(true)}
        onNewTransaction={() => setModalOpen(true)}
        onManageClients={() => setClientManagerOpen(true)}
      />
      
      <div className="max-w-[1320px] mx-auto px-6 py-8 space-y-8 mt-8">
        <RenewalAlert />
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

        {/* Custom Columns Bar */}
        <CustomColumnBar
          selectedColumnId={selectedColumnId}
          onSelectColumn={setSelectedColumnId}
          onManageColumns={() => setCustomColumnManagerOpen(true)}
        />

        <Card className="p-8 space-y-6 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.06)] border-border">
          <div>
            <h2 className="text-xl font-semibold mb-6 text-foreground">Lista de Lançamentos</h2>
            <div data-tour="filters">
              <FinancialFilters
                searchTerm={inputSearchTerm}
                onSearchChange={setInputSearchTerm}
                typeFilter={typeFilter}
                onTypeFilterChange={setTypeFilter}
                paymentMethodFilter={paymentMethodFilter}
                onPaymentMethodFilterChange={setPaymentMethodFilter}
                costCenterFilter={costCenterFilter}
                onCostCenterFilterChange={setCostCenterFilter}
                onClearFilters={handleClearFilters}
                costCenters={availableCostCentersForFilter}
              />
            </div>
          </div>

          <div data-tour="transactions-table">
            <FinancialTransactionsTable
              transactions={displayedTransactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
              onMarkAsPaid={handleMarkAsPaid}
            />
            {hasMoreTransactions && (
              <div className="mt-4 flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setDisplayLimit(prev => prev + 50)}
                  className="gap-2"
                >
                  Carregar mais ({sortedTransactions.length - displayLimit} restantes)
                </Button>
              </div>
            )}
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
          selectedColumnId={selectedColumnId}
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
          columnId={selectedColumnId}
        />

        <ClientManagerModal
          open={clientManagerOpen}
          onOpenChange={setClientManagerOpen}
        />

        <CustomColumnManagerModal
          open={customColumnManagerOpen}
          onOpenChange={setCustomColumnManagerOpen}
        />
      </div>
      
      {/* Daily reminder popup */}
      <DailyReminder />
      
      {/* AI Assistant floating button */}
      <AIAssistantButton />
    </div>
  );
}

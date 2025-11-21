import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, LogOut } from "lucide-react";
import { FinancialSummaryCards } from "./FinancialSummaryCards";
import { FinanceChartSection } from "./FinanceChartSection";
import { FinancePieCharts } from "./FinancePieCharts";
import { FinancialTransactionsTable } from "./FinancialTransactionsTable";
import { NewTransactionModal } from "./NewTransactionModal";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function FinanceView() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

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

  const summary = useFinancialSummary(transactions);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sistema Financeiro</h1>
          <p className="text-muted-foreground">Gerencie suas receitas e despesas</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>

      <FinancialSummaryCards
        totalReceitas={summary.totalReceitas}
        totalDespesas={summary.totalDespesas}
        saldo={summary.saldo}
      />

      <FinanceChartSection data={summary.transactionsByMonth} />

      <FinancePieCharts data={summary.transactionsByCategory} />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Transações</h2>
        <FinancialTransactionsTable
          transactions={transactions || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

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
  );
}

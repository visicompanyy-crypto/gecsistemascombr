import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calendar, DollarSign, CreditCard, Wallet } from "lucide-react";
import { TransactionDetailsModal } from "./TransactionDetailsModal";
import { Transaction, TeamToolExpense } from "@/hooks/useFinancialSummary";

interface FinancialSummaryCardsProps {
  saldoProjetado: number;
  receitaTotalRecebida: number;
  receitasFuturas: number;
  despesasFuturas: number;
  receitasDoMes: number;
  totalAPagarNoMes: number;
  // Listas para os modais
  listaReceitaTotalRecebida: Transaction[];
  listaReceitasFuturas: Transaction[];
  listaDespesasFuturas: Transaction[];
  listaReceitasDoMes: Transaction[];
  listaDespesasDoMes: Transaction[];
  teamToolExpensesDoMes?: TeamToolExpense[];
}

export function FinancialSummaryCards({
  saldoProjetado,
  receitaTotalRecebida,
  receitasFuturas,
  despesasFuturas,
  receitasDoMes,
  totalAPagarNoMes,
  listaReceitaTotalRecebida,
  listaReceitasFuturas,
  listaDespesasFuturas,
  listaReceitasDoMes,
  listaDespesasDoMes,
  teamToolExpensesDoMes,
}: FinancialSummaryCardsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalTransactions, setModalTransactions] = useState<Transaction[]>([]);
  const [modalTeamToolExpenses, setModalTeamToolExpenses] = useState<TeamToolExpense[]>([]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const openModal = (
    title: string, 
    transactions: Transaction[], 
    teamToolExpenses: TeamToolExpense[] = []
  ) => {
    setModalTitle(title);
    setModalTransactions(transactions);
    setModalTeamToolExpenses(teamToolExpenses);
    setModalOpen(true);
  };

  const saldoPositivo = saldoProjetado >= 0;

  return (
    <div className="space-y-6">
      {/* 💰 CARD PRINCIPAL - SALDO PROJETADO */}
      <Card 
        className={`p-8 bg-gradient-to-br ${
          saldoPositivo 
            ? 'from-primary/10 to-primary/5 border-primary/20' 
            : 'from-destructive/10 to-destructive/5 border-destructive/20'
        } shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary uppercase tracking-wide mb-2">
              💰 Saldo Projetado
            </p>
            <p className={`text-5xl font-semibold ${saldoPositivo ? 'text-primary' : 'text-destructive'}`}>
              {formatCurrency(saldoProjetado)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Projeção a partir do mês atual até o futuro
            </p>
          </div>
          <div className={`h-20 w-20 rounded-2xl ${
            saldoPositivo ? 'bg-primary/10' : 'bg-destructive/10'
          } flex items-center justify-center`}>
            <Wallet className={`h-10 w-10 ${saldoPositivo ? 'text-primary' : 'text-destructive'}`} />
          </div>
        </div>
      </Card>

      {/* 📊 OS 5 CARDS HORIZONTAIS */}
      <div className="grid gap-4 md:grid-cols-5">
        {/* 1️⃣ RECEITA TOTAL RECEBIDA */}
        <Card 
          className="p-6 hover:shadow-md transition-all duration-300 bg-card shadow-sm border-border/50 cursor-pointer"
          onClick={() => openModal("💰 Receita Total Recebida", listaReceitaTotalRecebida)}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-7 w-7 text-primary" />
            </div>
            <p className="text-xs font-medium text-secondary">Receita Total Recebida</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(receitaTotalRecebida)}</p>
          </div>
        </Card>

        {/* 2️⃣ RECEITAS FUTURAS */}
        <Card 
          className="p-6 hover:shadow-md transition-all duration-300 bg-card shadow-sm border-border/50 cursor-pointer"
          onClick={() => openModal("📅 Receitas Futuras", listaReceitasFuturas)}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="h-7 w-7 text-primary" />
            </div>
            <p className="text-xs font-medium text-secondary">Receitas Futuras</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(receitasFuturas)}</p>
          </div>
        </Card>

        {/* 3️⃣ DESPESAS FUTURAS */}
        <Card 
          className="p-6 hover:shadow-md transition-all duration-300 bg-card shadow-sm border-border/50 cursor-pointer"
          onClick={() => openModal("📉 Despesas Futuras", listaDespesasFuturas)}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-14 w-14 rounded-xl bg-destructive/10 flex items-center justify-center">
              <TrendingDown className="h-7 w-7 text-destructive" />
            </div>
            <p className="text-xs font-medium text-secondary">Despesas Futuras</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(despesasFuturas)}</p>
          </div>
        </Card>

        {/* 4️⃣ RECEITA DO MÊS */}
        <Card 
          className="p-6 hover:shadow-md transition-all duration-300 bg-card shadow-sm border-border/50 cursor-pointer"
          onClick={() => openModal("💵 Receita do Mês", listaReceitasDoMes)}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-7 w-7 text-primary" />
            </div>
            <p className="text-xs font-medium text-secondary">Receita do Mês</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(receitasDoMes)}</p>
          </div>
        </Card>

        {/* 5️⃣ TOTAL A PAGAR NO MÊS */}
        <Card 
          className="p-6 hover:shadow-md transition-all duration-300 bg-card shadow-sm border-border/50 cursor-pointer"
          onClick={() => openModal("💳 Total a Pagar no Mês", listaDespesasDoMes, teamToolExpensesDoMes)}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-14 w-14 rounded-xl bg-warning/10 flex items-center justify-center">
              <CreditCard className="h-7 w-7 text-warning" />
            </div>
            <p className="text-xs font-medium text-secondary">Total a Pagar no Mês</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(totalAPagarNoMes)}</p>
          </div>
        </Card>
      </div>

      {/* Modal de Detalhes */}
      <TransactionDetailsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={modalTitle}
        transactions={modalTransactions}
        teamToolExpenses={modalTeamToolExpenses}
      />
    </div>
  );
}

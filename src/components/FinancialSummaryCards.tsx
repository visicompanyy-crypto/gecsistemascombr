import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calendar, DollarSign, CreditCard } from "lucide-react";
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
    <div className="space-y-8">
      {/* 💰 CARD PRINCIPAL - SALDO PROJETADO */}
      <Card 
        className={`w-full min-h-[120px] p-8 rounded-[18px] bg-gradient-to-br ${
          saldoPositivo 
            ? 'from-primary/10 to-primary/5 border-primary/20' 
            : 'from-destructive/10 to-destructive/5 border-destructive/20'
        } shadow-[0_5px_20px_rgba(0,0,0,0.06)]`}
      >
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            💰 Saldo Projetado
          </p>
          <p className={`text-5xl font-bold ${saldoPositivo ? 'text-primary-dark' : 'text-destructive'}`}>
            {formatCurrency(saldoProjetado)}
          </p>
          <p className="text-sm text-secondary mt-3">
            Projeção a partir do mês atual até o futuro
          </p>
        </div>
      </Card>

      {/* 📊 OS 5 CARDS HORIZONTAIS */}
      <div className="grid gap-5 md:grid-cols-5">
        {/* 1️⃣ RECEITA TOTAL RECEBIDA */}
        <Card 
          className="w-full h-[110px] p-5 rounded-2xl hover:bg-muted/50 transition-all duration-300 bg-card shadow-[0_5px_20px_rgba(0,0,0,0.06)] border border-border cursor-pointer"
          onClick={() => openModal("💰 Receita Total Recebida", listaReceitaTotalRecebida)}
        >
          <div className="flex flex-col items-center justify-center text-center space-y-2 h-full">
            <div className="h-10 w-10 rounded-full border border-primary/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <p className="text-[10px] font-medium text-foreground leading-tight">Receita Total Recebida</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(receitaTotalRecebida)}</p>
          </div>
        </Card>

        {/* 2️⃣ RECEITAS FUTURAS */}
        <Card 
          className="w-full h-[110px] p-5 rounded-2xl hover:bg-muted/50 transition-all duration-300 bg-card shadow-[0_5px_20px_rgba(0,0,0,0.06)] border border-border cursor-pointer"
          onClick={() => openModal("📅 Receitas Futuras", listaReceitasFuturas)}
        >
          <div className="flex flex-col items-center justify-center text-center space-y-2 h-full">
            <div className="h-10 w-10 rounded-full border border-primary/20 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <p className="text-[10px] font-medium text-foreground leading-tight">Receitas Futuras</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(receitasFuturas)}</p>
          </div>
        </Card>

        {/* 3️⃣ DESPESAS FUTURAS */}
        <Card 
          className="w-full h-[110px] p-5 rounded-2xl hover:bg-muted/50 transition-all duration-300 bg-card shadow-[0_5px_20px_rgba(0,0,0,0.06)] border border-border cursor-pointer"
          onClick={() => openModal("📉 Despesas Futuras", listaDespesasFuturas)}
        >
          <div className="flex flex-col items-center justify-center text-center space-y-2 h-full">
            <div className="h-10 w-10 rounded-full border border-destructive/20 flex items-center justify-center">
              <TrendingDown className="h-5 w-5 text-destructive" />
            </div>
            <p className="text-[10px] font-medium text-foreground leading-tight">Despesas Futuras</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(despesasFuturas)}</p>
          </div>
        </Card>

        {/* 4️⃣ RECEITA DO MÊS */}
        <Card 
          className="w-full h-[110px] p-5 rounded-2xl hover:bg-muted/50 transition-all duration-300 bg-card shadow-[0_5px_20px_rgba(0,0,0,0.06)] border border-border cursor-pointer"
          onClick={() => openModal("💵 Receita do Mês", listaReceitasDoMes)}
        >
          <div className="flex flex-col items-center justify-center text-center space-y-2 h-full">
            <div className="h-10 w-10 rounded-full border border-primary/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <p className="text-[10px] font-medium text-foreground leading-tight">Receita do Mês</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(receitasDoMes)}</p>
          </div>
        </Card>

        {/* 5️⃣ TOTAL A PAGAR NO MÊS */}
        <Card 
          className="w-full h-[110px] p-5 rounded-2xl hover:bg-muted/50 transition-all duration-300 bg-card shadow-[0_5px_20px_rgba(0,0,0,0.06)] border border-border cursor-pointer"
          onClick={() => openModal("💳 Total a Pagar no Mês", listaDespesasDoMes, teamToolExpensesDoMes)}
        >
          <div className="flex flex-col items-center justify-center text-center space-y-2 h-full">
            <div className="h-10 w-10 rounded-full border border-warning/20 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-warning" />
            </div>
            <p className="text-[10px] font-medium text-foreground leading-tight">Total a Pagar no Mês</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(totalAPagarNoMes)}</p>
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

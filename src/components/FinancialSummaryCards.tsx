import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calendar, DollarSign, CreditCard } from "lucide-react";
import { TransactionDetailsModal } from "./TransactionDetailsModal";
import { Transaction, TeamToolExpense } from "@/hooks/useFinancialSummary";

interface FinancialSummaryCardsProps {
  resultadoDoMes: number;
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
  resultadoDoMes,
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

  // Determinar estado do resultado
  const isPositivo = resultadoDoMes > 0;
  const isNegativo = resultadoDoMes < 0;
  const isEquilibrado = resultadoDoMes === 0;

  // Definir cores e textos baseados no resultado
  const getResultadoStyles = () => {
    if (isPositivo) {
      return {
        bgClass: 'from-emerald-50 to-emerald-100/50 border-emerald-200',
        textColor: 'text-emerald-600',
        valueColor: 'text-emerald-700',
        emoji: '📈',
        subtitle: `Sobrará ${formatCurrency(resultadoDoMes)} este mês`
      };
    }
    if (isNegativo) {
      return {
        bgClass: 'from-red-50 to-red-100/50 border-red-200',
        textColor: 'text-red-600',
        valueColor: 'text-red-700',
        emoji: '📉',
        subtitle: `Faltará ${formatCurrency(Math.abs(resultadoDoMes))} este mês`
      };
    }
    return {
      bgClass: 'from-gray-50 to-gray-100/50 border-gray-200',
      textColor: 'text-gray-600',
      valueColor: 'text-gray-700',
      emoji: '⚖️',
      subtitle: 'O mês deve fechar equilibrado'
    };
  };

  const styles = getResultadoStyles();

  return (
    <div className="space-y-8">
      {/* 💰 CARD PRINCIPAL - RESULTADO DO MÊS */}
      <Card 
        className={`w-full min-h-[120px] p-8 rounded-[18px] bg-gradient-to-br ${styles.bgClass} shadow-[0_5px_20px_rgba(0,0,0,0.06)]`}
      >
        <div>
          <p className={`text-sm font-semibold ${styles.textColor} uppercase tracking-wider mb-3`}>
            {styles.emoji} Resultado do Mês
          </p>
          <p className={`text-5xl font-bold ${styles.valueColor}`}>
            {formatCurrency(resultadoDoMes)}
          </p>
          <p className={`text-sm ${styles.textColor} mt-3 font-medium`}>
            {styles.subtitle}
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

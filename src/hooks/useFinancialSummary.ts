import { useMemo } from 'react';
import { startOfMonth, endOfMonth } from 'date-fns';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  transaction_type: string;
  transaction_date: string;
  status: string;
  category?: string | null;
  cost_center_id?: string | null;
  cost_centers?: { name: string } | null;
  payment_method?: string | null;
  is_installment?: boolean | null;
  total_installments?: number | null;
  installment_number?: number | null;
}

export interface TeamToolExpense {
  id: string;
  description: string;
  amount: number;
  expense_date: string;
  status: string;
  expense_type: string;
  entity_name: string;
}

// Empty state object - extracted to avoid recreating on each render
const EMPTY_STATE = {
  resultadoDoMes: 0,
  receitaTotalRecebida: 0,
  receitasFuturas: 0,
  despesasFuturas: 0,
  receitasDoMes: 0,
  totalAPagarNoMes: 0,
  transactionsByCategory: {},
  transactionsByCategoryDoMes: {},
  receitaTotalRecebidaDoMes: 0,
  listaReceitaTotalRecebidaDoMes: [] as Transaction[],
  transactionsByMonth: [] as { month: string; receitas: number; despesas: number }[],
  listaReceitaTotalRecebida: [] as Transaction[],
  listaReceitasFuturas: [] as Transaction[],
  listaDespesasFuturas: [] as Transaction[],
  listaReceitasDoMes: [] as Transaction[],
  listaDespesasDoMes: [] as Transaction[],
};

export function useFinancialSummary(
  transactions: Transaction[] | undefined,
  teamToolExpenses: TeamToolExpense[] | undefined,
  currentMonth: Date
) {
  // Memoize date boundaries separately - they only change when month changes
  const { primeiroDiaDoMes, ultimoDiaDoMes } = useMemo(() => ({
    primeiroDiaDoMes: startOfMonth(currentMonth),
    ultimoDiaDoMes: endOfMonth(currentMonth),
  }), [currentMonth]);

  // Memoize valid transactions filter - only recalculates when transactions change
  const validTransactions = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    return transactions.filter(t => 
      t.is_installment === true || 
      (t.is_installment === false && (t.total_installments === null || t.total_installments === 1))
    );
  }, [transactions]);

  // Memoize team tool expenses for the month
  const teamToolExpensesDoMes = useMemo(() => {
    if (!teamToolExpenses || teamToolExpenses.length === 0) return [];
    return teamToolExpenses.filter(e => {
      const dataExpense = new Date(e.expense_date);
      return dataExpense >= primeiroDiaDoMes && dataExpense <= ultimoDiaDoMes;
    });
  }, [teamToolExpenses, primeiroDiaDoMes, ultimoDiaDoMes]);

  // Calculate all revenue-related metrics
  const revenueMetrics = useMemo(() => {
    if (validTransactions.length === 0) {
      return {
        listaReceitaTotalRecebida: [],
        receitaTotalRecebida: 0,
        listaReceitasFuturas: [],
        receitasFuturas: 0,
        listaReceitasDoMes: [],
        receitasDoMes: 0,
        listaReceitaTotalRecebidaDoMes: [],
        receitaTotalRecebidaDoMes: 0,
      };
    }

    // All paid revenues (complete history)
    const listaReceitaTotalRecebida = validTransactions.filter(
      t => t.transaction_type === 'receita' && t.status === 'pago'
    );
    const receitaTotalRecebida = listaReceitaTotalRecebida.reduce(
      (sum, t) => sum + Number(t.amount), 0
    );

    // Future revenues - unpaid, regardless of date
    const listaReceitasFuturas = validTransactions.filter(
      t => t.transaction_type === 'receita' && t.status !== 'pago'
    );
    const receitasFuturas = listaReceitasFuturas.reduce(
      (sum, t) => sum + Number(t.amount), 0
    );

    // Monthly revenues - paid in selected month
    const listaReceitasDoMes = validTransactions.filter(t => {
      const dataTransacao = new Date(t.transaction_date);
      return t.transaction_type === 'receita' && 
             t.status === 'pago' &&
             dataTransacao >= primeiroDiaDoMes && 
             dataTransacao <= ultimoDiaDoMes;
    });
    const receitasDoMes = listaReceitasDoMes.reduce(
      (sum, t) => sum + Number(t.amount), 0
    );

    return {
      listaReceitaTotalRecebida,
      receitaTotalRecebida,
      listaReceitasFuturas,
      receitasFuturas,
      listaReceitasDoMes,
      receitasDoMes,
      listaReceitaTotalRecebidaDoMes: listaReceitasDoMes,
      receitaTotalRecebidaDoMes: receitasDoMes,
    };
  }, [validTransactions, primeiroDiaDoMes, ultimoDiaDoMes]);

  // Calculate all expense-related metrics
  const expenseMetrics = useMemo(() => {
    if (validTransactions.length === 0) {
      return {
        listaDespesasFuturas: [],
        despesasFuturas: 0,
        listaDespesasDoMes: [],
        totalAPagarNoMes: 0,
      };
    }

    // Future expenses
    const listaDespesasFuturas = validTransactions.filter(t => {
      const dataTransacao = new Date(t.transaction_date);
      return t.transaction_type === 'despesa' && dataTransacao > ultimoDiaDoMes;
    });
    const despesasFuturas = listaDespesasFuturas.reduce(
      (sum, t) => sum + Number(t.amount), 0
    );

    // Monthly expenses
    const listaDespesasDoMes = validTransactions.filter(t => {
      const dataTransacao = new Date(t.transaction_date);
      return t.transaction_type === 'despesa' && 
             dataTransacao >= primeiroDiaDoMes && 
             dataTransacao <= ultimoDiaDoMes;
    });
    const despesasTransacoesDoMes = listaDespesasDoMes.reduce(
      (sum, t) => sum + Number(t.amount), 0
    );

    const despesasEquipeFerramentasDoMes = teamToolExpensesDoMes.reduce(
      (sum, e) => sum + Number(e.amount), 0
    );

    const totalAPagarNoMes = despesasTransacoesDoMes + despesasEquipeFerramentasDoMes;

    return {
      listaDespesasFuturas,
      despesasFuturas,
      listaDespesasDoMes,
      totalAPagarNoMes,
    };
  }, [validTransactions, primeiroDiaDoMes, ultimoDiaDoMes, teamToolExpensesDoMes]);

  // Calculate category groupings
  const categoryMetrics = useMemo(() => {
    if (validTransactions.length === 0) {
      return {
        transactionsByCategory: {},
        transactionsByCategoryDoMes: {},
      };
    }

    // Complete history by cost center
    const transactionsByCategory = validTransactions.reduce((acc: Record<string, { receitas: number; despesas: number }>, t) => {
      const costCenterName = t.cost_centers?.name || 'Sem centro de custo';
      if (!acc[costCenterName]) {
        acc[costCenterName] = { receitas: 0, despesas: 0 };
      }
      if (t.transaction_type === 'receita' && t.status === 'pago') {
        acc[costCenterName].receitas += Number(t.amount);
      } else if (t.transaction_type === 'despesa' && t.status === 'pago') {
        acc[costCenterName].despesas += Number(t.amount);
      }
      return acc;
    }, {});

    // Monthly by cost center (for dynamic charts)
    const transactionsByCategoryDoMes = validTransactions
      .filter(t => {
        const dataTransacao = new Date(t.transaction_date);
        return dataTransacao >= primeiroDiaDoMes && 
               dataTransacao <= ultimoDiaDoMes &&
               t.status === 'pago';
      })
      .reduce((acc: Record<string, { receitas: number; despesas: number }>, t) => {
        const costCenterName = t.cost_centers?.name || 'Sem centro de custo';
        if (!acc[costCenterName]) {
          acc[costCenterName] = { receitas: 0, despesas: 0 };
        }
        if (t.transaction_type === 'receita') {
          acc[costCenterName].receitas += Number(t.amount);
        } else if (t.transaction_type === 'despesa') {
          acc[costCenterName].despesas += Number(t.amount);
        }
        return acc;
      }, {});

    return { transactionsByCategory, transactionsByCategoryDoMes };
  }, [validTransactions, primeiroDiaDoMes, ultimoDiaDoMes]);

  // Calculate monthly groupings
  const transactionsByMonth = useMemo(() => {
    if (validTransactions.length === 0) return [];

    const monthlyData = validTransactions.reduce((acc: { month: string; receitas: number; despesas: number }[], t) => {
      const date = new Date(t.transaction_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      let monthData = acc.find(m => m.month === monthKey);
      if (!monthData) {
        monthData = { month: monthKey, receitas: 0, despesas: 0 };
        acc.push(monthData);
      }

      if (t.transaction_type === 'receita' && t.status === 'pago') {
        monthData.receitas += Number(t.amount);
      } else if (t.transaction_type === 'despesa' && t.status === 'pago') {
        monthData.despesas += Number(t.amount);
      }

      return acc;
    }, []);

    return monthlyData.sort((a, b) => a.month.localeCompare(b.month));
  }, [validTransactions]);

  // Return early if no transactions
  if (!transactions || transactions.length === 0) {
    return EMPTY_STATE;
  }

  // Calculate final result
  const resultadoDoMes = revenueMetrics.receitasDoMes - expenseMetrics.totalAPagarNoMes;

  return {
    resultadoDoMes,
    receitaTotalRecebida: revenueMetrics.receitaTotalRecebida,
    receitasFuturas: revenueMetrics.receitasFuturas,
    despesasFuturas: expenseMetrics.despesasFuturas,
    receitasDoMes: revenueMetrics.receitasDoMes,
    totalAPagarNoMes: expenseMetrics.totalAPagarNoMes,
    transactionsByCategory: categoryMetrics.transactionsByCategory,
    transactionsByMonth,
    transactionsByCategoryDoMes: categoryMetrics.transactionsByCategoryDoMes,
    receitaTotalRecebidaDoMes: revenueMetrics.receitaTotalRecebidaDoMes,
    listaReceitaTotalRecebidaDoMes: revenueMetrics.listaReceitaTotalRecebidaDoMes,
    listaReceitaTotalRecebida: revenueMetrics.listaReceitaTotalRecebida,
    listaReceitasFuturas: revenueMetrics.listaReceitasFuturas,
    listaDespesasFuturas: expenseMetrics.listaDespesasFuturas,
    listaReceitasDoMes: revenueMetrics.listaReceitasDoMes,
    listaDespesasDoMes: expenseMetrics.listaDespesasDoMes,
  };
}

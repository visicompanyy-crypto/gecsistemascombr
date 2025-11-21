import { useMemo } from 'react';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  transaction_type: string;
  transaction_date: string;
  status: string;
  category?: string | null;
  cost_center_id?: string | null;
  payment_method?: string | null;
}

export function useFinancialSummary(transactions: Transaction[] | undefined) {
  return useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        totalReceitas: 0,
        totalDespesas: 0,
        saldo: 0,
        receitasPagas: 0,
        despesasPagas: 0,
        receitasPendentes: 0,
        despesasPendentes: 0,
        transactionsByCategory: {},
        transactionsByMonth: [],
      };
    }

    const totalReceitas = transactions
      .filter(t => t.transaction_type === 'receita' && t.status === 'pago')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalDespesas = transactions
      .filter(t => t.transaction_type === 'despesa' && t.status === 'pago')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const receitasPendentes = transactions
      .filter(t => t.transaction_type === 'receita' && t.status === 'pendente')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const despesasPendentes = transactions
      .filter(t => t.transaction_type === 'despesa' && t.status === 'pendente')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const saldo = totalReceitas - totalDespesas;

    // Agrupar por categoria
    const transactionsByCategory = transactions.reduce((acc: any, t) => {
      const category = t.category || 'Sem categoria';
      if (!acc[category]) {
        acc[category] = { receitas: 0, despesas: 0 };
      }
      if (t.transaction_type === 'receita' && t.status === 'pago') {
        acc[category].receitas += Number(t.amount);
      } else if (t.transaction_type === 'despesa' && t.status === 'pago') {
        acc[category].despesas += Number(t.amount);
      }
      return acc;
    }, {});

    // Agrupar por mês
    const transactionsByMonth = transactions.reduce((acc: any[], t) => {
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

    transactionsByMonth.sort((a, b) => a.month.localeCompare(b.month));

    return {
      totalReceitas,
      totalDespesas,
      saldo,
      receitasPagas: totalReceitas,
      despesasPagas: totalDespesas,
      receitasPendentes,
      despesasPendentes,
      transactionsByCategory,
      transactionsByMonth,
    };
  }, [transactions]);
}

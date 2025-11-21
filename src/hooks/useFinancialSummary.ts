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

export interface TeamToolExpense {
  id: string;
  description: string;
  amount: number;
  expense_date: string;
  status: string;
  expense_type: string;
  entity_name: string;
}

export function useFinancialSummary(
  transactions: Transaction[] | undefined,
  teamToolExpenses: TeamToolExpense[] | undefined
) {
  return useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        saldoProjetado: 0,
        receitaTotalRecebida: 0,
        receitasFuturas: 0,
        despesasFuturas: 0,
        receitasDoMes: 0,
        totalAPagarNoMes: 0,
        transactionsByCategory: {},
        transactionsByMonth: [],
        // Listas detalhadas para os modais
        listaReceitaTotalRecebida: [],
        listaReceitasFuturas: [],
        listaDespesasFuturas: [],
        listaReceitasDoMes: [],
        listaDespesasDoMes: [],
      };
    }

    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    const primeiroDiaDoMes = new Date(anoAtual, mesAtual, 1);
    const ultimoDiaDoMes = new Date(anoAtual, mesAtual + 1, 0);

    // 1️⃣ RECEITA TOTAL RECEBIDA - Todas as receitas com status "pago" (histórico completo)
    const listaReceitaTotalRecebida = transactions.filter(
      t => t.transaction_type === 'receita' && t.status === 'pago'
    );
    const receitaTotalRecebida = listaReceitaTotalRecebida.reduce(
      (sum, t) => sum + Number(t.amount), 
      0
    );

    // 2️⃣ RECEITAS FUTURAS - Data maior que último dia do mês atual
    const listaReceitasFuturas = transactions.filter(t => {
      const dataTransacao = new Date(t.transaction_date);
      return t.transaction_type === 'receita' && dataTransacao > ultimoDiaDoMes;
    });
    const receitasFuturas = listaReceitasFuturas.reduce(
      (sum, t) => sum + Number(t.amount), 
      0
    );

    // 3️⃣ DESPESAS FUTURAS - Data maior que último dia do mês atual
    const listaDespesasFuturas = transactions.filter(t => {
      const dataTransacao = new Date(t.transaction_date);
      return t.transaction_type === 'despesa' && dataTransacao > ultimoDiaDoMes;
    });
    const despesasFuturas = listaDespesasFuturas.reduce(
      (sum, t) => sum + Number(t.amount), 
      0
    );

    // 4️⃣ RECEITA DO MÊS - Receitas do mês atual
    const listaReceitasDoMes = transactions.filter(t => {
      const dataTransacao = new Date(t.transaction_date);
      return t.transaction_type === 'receita' && 
             dataTransacao >= primeiroDiaDoMes && 
             dataTransacao <= ultimoDiaDoMes;
    });
    const receitasDoMes = listaReceitasDoMes.reduce(
      (sum, t) => sum + Number(t.amount), 
      0
    );

    // 5️⃣ TOTAL A PAGAR NO MÊS - Despesas + team_tool_expenses do mês atual
    const listaDespesasDoMes = transactions.filter(t => {
      const dataTransacao = new Date(t.transaction_date);
      return t.transaction_type === 'despesa' && 
             dataTransacao >= primeiroDiaDoMes && 
             dataTransacao <= ultimoDiaDoMes;
    });
    
    const despesasTransacoesDoMes = listaDespesasDoMes.reduce(
      (sum, t) => sum + Number(t.amount), 
      0
    );

    const despesasEquipeFerramentasDoMes = (teamToolExpenses || [])
      .filter(e => {
        const dataExpense = new Date(e.expense_date);
        return dataExpense >= primeiroDiaDoMes && dataExpense <= ultimoDiaDoMes;
      })
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const totalAPagarNoMes = despesasTransacoesDoMes + despesasEquipeFerramentasDoMes;

    // 💰 SALDO PROJETADO - Receitas do mês atual em diante - Despesas do mês atual em diante
    const receitasDoMesEmDiante = transactions
      .filter(t => {
        const dataTransacao = new Date(t.transaction_date);
        return t.transaction_type === 'receita' && dataTransacao >= primeiroDiaDoMes;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const despesasDoMesEmDiante = transactions
      .filter(t => {
        const dataTransacao = new Date(t.transaction_date);
        return t.transaction_type === 'despesa' && dataTransacao >= primeiroDiaDoMes;
      })
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const despesasEquipeFerramentasDoMesEmDiante = (teamToolExpenses || [])
      .filter(e => {
        const dataExpense = new Date(e.expense_date);
        return dataExpense >= primeiroDiaDoMes;
      })
      .reduce((sum, e) => sum + Number(e.amount), 0);

    const saldoProjetado = receitasDoMesEmDiante - (despesasDoMesEmDiante + despesasEquipeFerramentasDoMesEmDiante);

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
      saldoProjetado,
      receitaTotalRecebida,
      receitasFuturas,
      despesasFuturas,
      receitasDoMes,
      totalAPagarNoMes,
      transactionsByCategory,
      transactionsByMonth,
      // Listas detalhadas para os modais
      listaReceitaTotalRecebida,
      listaReceitasFuturas,
      listaDespesasFuturas,
      listaReceitasDoMes,
      listaDespesasDoMes,
    };
  }, [transactions, teamToolExpenses]);
}

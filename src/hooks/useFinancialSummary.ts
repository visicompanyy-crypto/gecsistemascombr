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

export function useFinancialSummary(
  transactions: Transaction[] | undefined,
  teamToolExpenses: TeamToolExpense[] | undefined,
  currentMonth: Date
) {
  return useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        resultadoDoMes: 0,
        receitaTotalRecebida: 0,
        receitasFuturas: 0,
        despesasFuturas: 0,
        receitasDoMes: 0,
        totalAPagarNoMes: 0,
        transactionsByCategory: {},
        transactionsByCategoryDoMes: {},
        receitaTotalRecebidaDoMes: 0,
        listaReceitaTotalRecebidaDoMes: [],
        transactionsByMonth: [],
        // Listas detalhadas para os modais
        listaReceitaTotalRecebida: [],
        listaReceitasFuturas: [],
        listaDespesasFuturas: [],
        listaReceitasDoMes: [],
        listaDespesasDoMes: [],
      };
    }

    // Usar currentMonth passado como parâmetro
    const primeiroDiaDoMes = startOfMonth(currentMonth);
    const ultimoDiaDoMes = endOfMonth(currentMonth);

    // Filtrar apenas transações válidas (evitar duplicação de "pais fictícios")
    const validTransactions = transactions.filter(t => 
      t.is_installment === true || 
      (t.is_installment === false && (t.total_installments === null || t.total_installments === 1))
    );

    // 1️⃣ RECEITA TOTAL RECEBIDA - Todas as receitas com status "pago" (histórico completo)
    const listaReceitaTotalRecebida = validTransactions.filter(
      t => t.transaction_type === 'receita' && t.status === 'pago'
    );
    const receitaTotalRecebida = listaReceitaTotalRecebida.reduce(
      (sum, t) => sum + Number(t.amount), 
      0
    );

    // 2️⃣ RECEITAS FUTURAS - Data maior que último dia do mês selecionado
    const listaReceitasFuturas = validTransactions.filter(t => {
      const dataTransacao = new Date(t.transaction_date);
      return t.transaction_type === 'receita' && dataTransacao > ultimoDiaDoMes;
    });
    const receitasFuturas = listaReceitasFuturas.reduce(
      (sum, t) => sum + Number(t.amount), 
      0
    );

    // 3️⃣ DESPESAS FUTURAS - Data maior que último dia do mês selecionado
    const listaDespesasFuturas = validTransactions.filter(t => {
      const dataTransacao = new Date(t.transaction_date);
      return t.transaction_type === 'despesa' && dataTransacao > ultimoDiaDoMes;
    });
    const despesasFuturas = listaDespesasFuturas.reduce(
      (sum, t) => sum + Number(t.amount), 
      0
    );

    // 4️⃣ RECEITA DO MÊS - Receitas do mês selecionado (independente de status)
    const listaReceitasDoMes = validTransactions.filter(t => {
      const dataTransacao = new Date(t.transaction_date);
      return t.transaction_type === 'receita' && 
             dataTransacao >= primeiroDiaDoMes && 
             dataTransacao <= ultimoDiaDoMes;
    });
    const receitasDoMes = listaReceitasDoMes.reduce(
      (sum, t) => sum + Number(t.amount), 
      0
    );

    // 5️⃣ TOTAL A PAGAR NO MÊS - Despesas + team_tool_expenses do mês selecionado
    const listaDespesasDoMes = validTransactions.filter(t => {
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

    // 💰 RESULTADO DO MÊS - Apenas receitas e despesas do mês atual (sem projeções futuras)
    const resultadoDoMes = receitasDoMes - totalAPagarNoMes;

    // Agrupar por centro de custo (histórico completo)
    const transactionsByCategory = validTransactions.reduce((acc: any, t) => {
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

    // 🆕 Agrupar por centro de custo APENAS do mês selecionado (para gráficos dinâmicos)
    const transactionsByCategoryDoMes = validTransactions
      .filter(t => {
        const dataTransacao = new Date(t.transaction_date);
        return dataTransacao >= primeiroDiaDoMes && 
               dataTransacao <= ultimoDiaDoMes &&
               t.status === 'pago';
      })
      .reduce((acc: any, t) => {
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

    // 🆕 Receita total recebida do mês selecionado (apenas pagas no mês)
    const listaReceitaTotalRecebidaDoMes = validTransactions.filter(t => {
      const dataTransacao = new Date(t.transaction_date);
      return t.transaction_type === 'receita' && 
             t.status === 'pago' &&
             dataTransacao >= primeiroDiaDoMes && 
             dataTransacao <= ultimoDiaDoMes;
    });
    const receitaTotalRecebidaDoMes = listaReceitaTotalRecebidaDoMes.reduce(
      (sum, t) => sum + Number(t.amount), 
      0
    );

    // Agrupar por mês
    const transactionsByMonth = validTransactions.reduce((acc: any[], t) => {
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
      resultadoDoMes,
      receitaTotalRecebida,
      receitasFuturas,
      despesasFuturas,
      receitasDoMes,
      totalAPagarNoMes,
      transactionsByCategory,
      transactionsByMonth,
      // 🆕 Dados filtrados por mês para gráficos dinâmicos
      transactionsByCategoryDoMes,
      receitaTotalRecebidaDoMes,
      listaReceitaTotalRecebidaDoMes,
      // Listas detalhadas para os modais
      listaReceitaTotalRecebida,
      listaReceitasFuturas,
      listaDespesasFuturas,
      listaReceitasDoMes,
      listaDespesasDoMes,
    };
  }, [transactions, teamToolExpenses, currentMonth]);
}

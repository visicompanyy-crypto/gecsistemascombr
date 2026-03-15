

## Plano: Exportar Todo o Historico de Lancamentos

### Problema Atual

O botao "Exportar Excel" ja existe com opcao "Tudo" no seletor de datas, porem:
1. A query do Supabase tem limite padrao de **1000 linhas** — usuarios com mais transacoes perdem dados na exportacao
2. Os dados passados (`transactionsFilteredByColumn`) sao filtrados pela coluna selecionada, nao mostrando tudo
3. O botao "Tudo" remove datas mas nao busca dados extras do banco

### Solucao

Ao clicar "Tudo" ou "Exportar", buscar **todas** as transacoes diretamente do banco (sem limite de 1000), independente da coluna selecionada.

### Alteracoes

**1. `src/components/ExportExcelButton.tsx`**
- Adicionar prop `userId` para fazer query direta
- No `handleExport`, quando o preset "Tudo" estiver ativo (sem datas), buscar todas as transacoes do banco usando paginacao (lotes de 1000) para contornar o limite
- Tambem buscar todas as `team_tool_expenses` do banco
- Manter o comportamento atual quando datas estiverem selecionadas (usa dados ja carregados)

**2. `src/components/FinanceView.tsx`**
- Passar `userId` e `transactions` (todas, sem filtro de coluna) para o ExportExcelButton
- Mudar `allTransactions` para usar `transactions` (sem filtro de coluna) em vez de `transactionsFilteredByColumn`

### Detalhe tecnico da paginacao

```typescript
// Buscar todas as transacoes sem limite de 1000
async function fetchAllTransactions(userId: string) {
  const allData = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data } = await supabase
      .from('financial_transactions')
      .select('*, cost_centers(name)')
      .is('deleted_at', null)
      .range(from, from + pageSize - 1)
      .order('transaction_date', { ascending: false });
    if (!data || data.length === 0) break;
    allData.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return allData;
}
```

### Arquivos

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/ExportExcelButton.tsx` | Buscar todos os dados do banco ao exportar "Tudo" |
| `src/components/FinanceView.tsx` | Passar `transactions` sem filtro de coluna |



## Plano: Ajustes no Onboarding e Lógica Financeira do Saldar

### Resumo das Alterações Solicitadas

1. **Corrigir tour que aparece toda vez** - Identificar e corrigir a causa
2. **Editar conteúdo do tour sobre colunas** - Explicar o uso para gastos específicos por cliente
3. **Ajustar lógica de receitas** - Lançamentos devem ir para "receita futura" e só contabilizar como "receita do mês" quando marcados como pagos

---

## 1. Diagnóstico: Tour Aparecendo Toda Vez

**Causa provável identificada:**
O código já verifica `localStorage.getItem('hasSeenOnboardingTour')` na linha 71-72. Se o tour continua aparecendo, pode ser:
- O localStorage está sendo limpo ao fazer logout/login
- O modal `FirstAccessModal` está resetando o estado

**Solução:**
Verificar se o `FirstAccessModal` precisa ser fechado corretamente e se o `onboarding_completed` do banco está sincronizado com o localStorage do tour.

---

## 2. Editar Conteúdo do Tour - Arquivo: `src/components/OnboardingTour.tsx`

Adicionar um novo step após o step de "Novo Lançamento" explicando as colunas personalizadas:

```typescript
// Novo step a ser adicionado (após o step do new-transaction)
{
  target: '[data-tour="custom-columns"]', // Precisamos adicionar esse data-tour no CustomColumnBar
  content: 'As colunas permitem organizar gastos específicos por cliente ou projeto. Por exemplo, se você está construindo um prédio, pode criar uma coluna para cada apartamento ou andar da obra, controlando exatamente quanto gastou em cada unidade.',
  placement: 'bottom',
  spotlightPadding: 8,
},
```

**Também alterar:** `src/components/CustomColumnBar.tsx` para adicionar `data-tour="custom-columns"` no container principal.

---

## 3. Ajustar Lógica de Receitas - Arquivo: `src/hooks/useFinancialSummary.ts`

### Lógica Atual:
- **Receita do Mês**: Todas as receitas com `transaction_date` dentro do mês (independente de status)
- **Receita Futura**: Receitas com `transaction_date` maior que o último dia do mês

### Nova Lógica Desejada:
- **Receita do Mês**: Apenas receitas com `status === 'pago'` E `transaction_date` dentro do mês
- **Receita Futura**: Receitas com `status !== 'pago'` (pendentes), independente da data

**Alterações no cálculo:**

```typescript
// ANTES - linha 97-107:
const listaReceitasDoMes = validTransactions.filter(t => {
  const dataTransacao = new Date(t.transaction_date);
  return t.transaction_type === 'receita' && 
         dataTransacao >= primeiroDiaDoMes && 
         dataTransacao <= ultimoDiaDoMes;
});

// DEPOIS:
const listaReceitasDoMes = validTransactions.filter(t => {
  const dataTransacao = new Date(t.transaction_date);
  return t.transaction_type === 'receita' && 
         t.status === 'pago' &&  // <-- NOVA CONDIÇÃO
         dataTransacao >= primeiroDiaDoMes && 
         dataTransacao <= ultimoDiaDoMes;
});
```

```typescript
// ANTES - linha 77-85:
const listaReceitasFuturas = validTransactions.filter(t => {
  const dataTransacao = new Date(t.transaction_date);
  return t.transaction_type === 'receita' && dataTransacao > ultimoDiaDoMes;
});

// DEPOIS:
const listaReceitasFuturas = validTransactions.filter(t => {
  return t.transaction_type === 'receita' && t.status !== 'pago';
  // Receitas não pagas são futuras, independente da data
});
```

---

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/OnboardingTour.tsx` | Adicionar novo step sobre colunas com exemplo de construção |
| `src/components/CustomColumnBar.tsx` | Adicionar `data-tour="custom-columns"` |
| `src/hooks/useFinancialSummary.ts` | Ajustar lógica de receitas (só conta quando pago) |

---

## Resultado Esperado

- O tour explicará claramente que as colunas são para organizar gastos por cliente/projeto (exemplo: apartamentos em uma obra)
- Receitas lançadas irão para "Receitas Futuras" até serem marcadas como pagas
- Ao marcar como pago, a receita move para "Receita do Mês" automaticamente
- O tour só aparecerá uma vez para cada usuário

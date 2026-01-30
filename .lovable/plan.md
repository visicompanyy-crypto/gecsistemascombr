

## Plano: Otimizar Performance e Corrigir Travamentos

### Diagnóstico

Após análise do código, identifiquei os seguintes problemas que podem causar lentidão e travamento:

1. **Múltiplas queries executando simultaneamente** - O `FinanceView.tsx` dispara várias queries ao mesmo tempo (transactions, teamToolExpenses, costCenters, columns) sem controle adequado de cache
2. **Recálculos excessivos no `useFinancialSummary`** - O hook recalcula todos os dados a cada mudança, mesmo quando não necessário
3. **Queries duplicadas** - O hook `useCustomColumns` é chamado em múltiplos componentes, causando requisições duplicadas
4. **Falta de debounce nos filtros** - Cada digitação no campo de busca causa re-renderização completa
5. **Ausência de paginação na tabela** - Carrega todas as transações de uma vez

---

## Alterações Propostas

### 1. Otimizar Cache das Queries

**Arquivo:** `src/components/FinanceView.tsx`

- Adicionar `staleTime` e `gcTime` nas queries para evitar refetch desnecessário
- Usar `placeholderData` para manter dados anteriores enquanto carrega

```typescript
const { data: transactions, refetch: refetchTransactions } = useQuery({
  queryKey: ['financial-transactions', user?.id],
  queryFn: async () => { ... },
  enabled: !!user?.id,
  staleTime: 2 * 60 * 1000, // 2 minutos
  gcTime: 5 * 60 * 1000,    // 5 minutos
  placeholderData: (previousData) => previousData, // Manter dados anteriores
});
```

### 2. Adicionar Debounce no Campo de Busca

**Arquivo:** `src/components/FinanceView.tsx`

- Criar um estado separado para o termo de busca com debounce
- Evitar re-renderizações a cada caractere digitado

```typescript
// Novo estado com debounce
const [inputSearchTerm, setInputSearchTerm] = useState("");
const debouncedSearchTerm = useDebouncedValue(inputSearchTerm, 300);

// Usar o valor com debounce nos filtros
const filteredTransactions = transactionsDoMes?.filter(transaction => {
  const matchesSearch = transaction.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
  // ...
});
```

**Novo arquivo:** `src/hooks/useDebouncedValue.ts`

```typescript
import { useState, useEffect } from 'react';

export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
```

### 3. Otimizar useFinancialSummary com useMemo Granular

**Arquivo:** `src/hooks/useFinancialSummary.ts`

- Separar cálculos em múltiplos `useMemo` menores para evitar recalcular tudo
- Adicionar verificação de igualdade para evitar recálculos desnecessários

### 4. Adicionar Loading State Visual

**Arquivo:** `src/components/FinanceView.tsx`

- Mostrar skeleton/loading enquanto carrega dados
- Evitar tela em branco que parece travamento

```typescript
if (isLoadingTransactions || isLoadingExpenses) {
  return (
    <div className="min-h-screen bg-background">
      <Header ... />
      <div className="max-w-[1320px] mx-auto px-6 py-8 space-y-8 mt-8">
        {/* Skeleton loading */}
        <div className="grid gap-4 md:grid-cols-4">
          {[1,2,3,4].map(i => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 5. Limitar Transações Exibidas na Tabela

**Arquivo:** `src/components/FinanceView.tsx`

- Implementar paginação virtual ou "load more" para tabelas grandes
- Inicialmente mostrar apenas 50 transações

```typescript
const [displayLimit, setDisplayLimit] = useState(50);

const displayedTransactions = sortedTransactions.slice(0, displayLimit);

// Botão "Carregar mais" se houver mais transações
{sortedTransactions.length > displayLimit && (
  <Button 
    variant="outline" 
    onClick={() => setDisplayLimit(prev => prev + 50)}
  >
    Carregar mais ({sortedTransactions.length - displayLimit} restantes)
  </Button>
)}
```

---

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/hooks/useDebouncedValue.ts` | **NOVO** - Hook de debounce |
| `src/components/FinanceView.tsx` | Otimizar queries, adicionar debounce, skeleton loading, paginação |
| `src/hooks/useFinancialSummary.ts` | Otimizar useMemo |

---

## Resultado Esperado

- Menos requisições ao banco de dados
- Interface mais responsiva durante digitação
- Feedback visual durante carregamento (sem parecer travado)
- Melhor performance com muitas transações


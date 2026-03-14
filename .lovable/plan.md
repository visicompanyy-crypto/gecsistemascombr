

## Plano: Correção de Bugs Criticos no Sistema

### Problemas Identificados

#### 1. Tour de Onboarding Travando o Sistema (CRITICO)
O `OnboardingTour` tem um passo (step 2) que busca o elemento `[data-tour="custom-columns"]`, mas o `CustomColumnBar` foi **comentado/removido** na ultima alteracao. Quando o Joyride nao encontra o elemento alvo, ele pode travar toda a interface, causando a **tela branca**.

**Arquivo:** `src/components/OnboardingTour.tsx` (linha 19-22)
- Remover o step que referencia `[data-tour="custom-columns"]`

#### 2. Chamadas Duplicadas ao Verificar Assinatura
Os logs mostram que `check-subscription` esta sendo chamado **3-4 vezes simultaneamente** (visivel nos logs das 18:17:31). Isso acontece porque:
- `onAuthStateChange` dispara `checkSubscription`
- `getSession` tambem dispara `checkSubscription`
- Ambos rodam ao mesmo tempo sem controle

**Arquivo:** `src/contexts/AuthContext.tsx`
- Adicionar flag `isCheckingRef` para evitar chamadas duplicadas simultaneas
- Garantir que apenas uma verificacao rode por vez

#### 3. Cliques Duplicados em Acoes da Tabela
Os botoes de "Marcar como pago", "Excluir" e "Editar" nao tem protecao contra cliques rapidos/duplos. Isso pode causar:
- Duplicacao de acoes no banco de dados
- Travamento enquanto duas requisicoes concorrem

**Arquivo:** `src/components/FinanceView.tsx`
- Adicionar estados de loading para `handleDelete` e `handleMarkAsPaid`
- Desabilitar botoes durante operacoes

**Arquivo:** `src/components/FinancialTransactionsTable.tsx`
- Receber props de loading e desabilitar botoes de acao

#### 4. Modal de Transacao - Problemas de Estado
O formulario do `NewTransactionModal` nao reseta corretamente quando o modal e fechado sem salvar, e o submit nao previne duplo clique adequadamente.

**Arquivo:** `src/components/NewTransactionModal.tsx`
- Garantir reset completo do form ao fechar modal
- Adicionar `e.stopPropagation()` no submit para evitar propagacao

---

## Detalhes Tecnicos das Alteracoes

### OnboardingTour.tsx
Remover o step 2 (custom-columns) do array de steps, ja que o componente foi ocultado:

```typescript
// REMOVER este step:
{
  target: '[data-tour="custom-columns"]',
  content: 'As colunas permitem organizar...',
  placement: 'bottom',
  spotlightPadding: 8,
},
```

### AuthContext.tsx
Adicionar controle de concorrencia:

```typescript
const isCheckingRef = useRef(false);

const checkSubscription = async (currentSession: Session | null) => {
  if (!currentSession) {
    setSubscription(null);
    setSubscriptionLoading(false);
    return;
  }
  
  if (isCheckingRef.current) return; // Evitar chamadas duplicadas
  isCheckingRef.current = true;
  
  // ... logica existente ...
  
  finally {
    isCheckingRef.current = false;
    setSubscriptionLoading(false);
  }
};
```

### FinanceView.tsx
Adicionar estados de loading para acoes:

```typescript
const [actionLoading, setActionLoading] = useState<string | null>(null);

const handleDelete = async (id: string) => {
  if (actionLoading) return;
  setActionLoading(id);
  try { ... } finally { setActionLoading(null); }
};

const handleMarkAsPaid = async (id: string) => {
  if (actionLoading) return;
  setActionLoading(id);
  try { ... } finally { setActionLoading(null); }
};
```

### FinancialTransactionsTable.tsx
Receber e usar prop de loading:

```typescript
interface Props {
  // ... existente
  actionLoadingId?: string | null;
}

// Desabilitar botoes quando actionLoadingId corresponde
<Button disabled={actionLoadingId === transaction.id} ...>
```

---

## Resumo dos Arquivos

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/OnboardingTour.tsx` | Remover step de custom-columns |
| `src/contexts/AuthContext.tsx` | Evitar chamadas duplicadas de subscription |
| `src/components/FinanceView.tsx` | Adicionar loading guards nas acoes |
| `src/components/FinancialTransactionsTable.tsx` | Desabilitar botoes durante acoes |
| `src/components/NewTransactionModal.tsx` | Melhorar reset e prevenir duplo submit |

### Resultado Esperado
- Sistema nao trava mais ao navegar (tour corrigido)
- Cliques nao duplicam acoes
- Modal funciona corretamente ao abrir/fechar
- Chamadas de API nao se repetem desnecessariamente


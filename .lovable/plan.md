
## Plano: Esconder Colunas do Sistema Temporariamente

### Alteração Necessária

**Arquivo:** `src/components/FinanceView.tsx`

Vou comentar a seção que renderiza o `CustomColumnBar` para ocultar as colunas do sistema por enquanto. Isso pode ser facilmente revertido no futuro.

#### Código a ser comentado (linhas 382-388):
```tsx
// ANTES:
{/* Custom Columns Bar */}
<CustomColumnBar
  selectedColumnId={selectedColumnId}
  onSelectColumn={setSelectedColumnId}
  onManageColumns={() => setCustomColumnManagerOpen(true)}
/>

// DEPOIS:
{/* Custom Columns Bar - Temporariamente oculto
<CustomColumnBar
  selectedColumnId={selectedColumnId}
  onSelectColumn={setSelectedColumnId}
  onManageColumns={() => setCustomColumnManagerOpen(true)}
/>
*/}
```

#### Também remover do skeleton loading (linhas ~318):
O skeleton da barra de colunas também será removido.

### Resultado Esperado
- A barra de colunas ("Todas", "Principal", etc.) não será mais exibida
- O sistema continuará funcionando normalmente mostrando todas as transações
- Fácil de reverter quando quiser ativar as colunas novamente

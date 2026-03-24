

## Plano: Corrigir Valores na Exportacao Excel

### Problema

Ha dois bugs no `ExportExcelButton.tsx`:

1. **Abas "Receitas" e "Despesas" com colunas desalinhadas**: As linhas de resumo no topo usam chaves `""` e `" "`, enquanto as transacoes usam `"Descricao"`, `"Valor (R$)"`, etc. O `json_to_sheet` do SheetJS coleta TODAS as chaves unicas como headers, fazendo as linhas de resumo ocuparem colunas A-B e as transacoes comecarem na coluna C. Os valores ficam "perdidos" em colunas inesperadas.

2. **Aba "Resumo" com valor vazio**: Na linha 298, `"Valor (R$)": ""` usa string vazia, misturando tipos (string e number) na mesma coluna.

### Solucao

**Arquivo: `src/components/ExportExcelButton.tsx`**

- Nas abas "Receitas" e "Despesas", usar as **mesmas chaves** para resumo e transacoes. Colocar o resumo com as mesmas colunas que as transacoes (Descricao, Valor, etc.), preenchendo campos nao usados com string vazia.
- Na aba "Resumo", usar `0` ou `null` em vez de `""` para campos numericos.
- Garantir `Number(t.amount)` em todas as ocorrencias para evitar que strings entrem na coluna de valor.

Exemplo da correcao para aba "Receitas":
```typescript
const data = [
  { "Descrição": "RESUMO DE RECEITAS", "Valor (R$)": null, ... },
  { "Descrição": "Total Recebido", "Valor (R$)": totalRecebido, ... },
  { "Descrição": "", "Valor (R$)": null, ... },
  ...receitas.map(t => ({
    "Descrição": t.description,
    "Valor (R$)": Number(t.amount),
    ...
  }))
];
```

### Arquivos

| Arquivo | Alteracao |
|---------|-----------|
| `src/components/ExportExcelButton.tsx` | Corrigir mapeamento de colunas nas abas Receitas, Despesas e Resumo |


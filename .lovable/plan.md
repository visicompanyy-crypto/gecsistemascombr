

## Plano: Exportar e Importar Planilhas Excel

### Resumo

Adicionar botoes de **Exportar** e **Importar** transacoes financeiras via Excel (.xlsx) no painel principal, ao lado do botao "Novo Lancamento".

---

### Arquitetura

**Biblioteca:** `xlsx` (SheetJS) - leve, roda no browser, sem dependencia de backend.

```
┌──────────────────────────────────────────────────────────────────┐
│  [+ Novo Lançamento]  [📥 Importar Excel]  [📤 Exportar Excel]  │
│                       [◄ Mês ►]                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Funcionalidades

#### Exportar Excel
- Exporta todas as transacoes do mes selecionado (filtradas)
- Colunas: Descricao, Tipo, Valor, Data, Vencimento, Status, Categoria, Forma de Pagamento, Centro de Custo, Observacoes
- Formatacao em moeda BRL
- Nome do arquivo: `relatorio-financeiro-MES-ANO.xlsx`

#### Importar Excel
- Modal com upload de arquivo `.xlsx` / `.xls`
- Botao para baixar **modelo de planilha** pre-formatado
- Validacao dos dados antes de inserir (campos obrigatorios: descricao, tipo, valor, data, status)
- Preview dos dados antes de confirmar importacao
- Insercao em lote no banco de dados

---

### Arquivos a Criar/Modificar

| Arquivo | Alteracao |
|---------|-----------|
| `package.json` | Adicionar dependencia `xlsx` |
| `src/components/ExportExcelButton.tsx` | **NOVO** - Botao que gera e baixa o Excel |
| `src/components/ImportExcelModal.tsx` | **NOVO** - Modal de upload, preview e importacao |
| `src/components/FinanceView.tsx` | Integrar botoes de importar/exportar |

### Detalhes Tecnicos

**ExportExcelButton:** Recebe as transacoes filtradas do mes + currentMonth. Usa `xlsx.utils.json_to_sheet` para gerar a planilha e `xlsx.writeFile` para download.

**ImportExcelModal:**
1. Input file aceita `.xlsx,.xls`
2. Le o arquivo com `xlsx.read`
3. Parseia as linhas para o formato da tabela `financial_transactions`
4. Exibe preview em tabela
5. No confirmar, faz `supabase.from('financial_transactions').insert(rows)`
6. Oferece download de template com headers corretos

**Mapeamento de colunas do Excel:**
- Descrição → description
- Tipo (receita/despesa) → transaction_type
- Valor → amount
- Data → transaction_date
- Vencimento → due_date
- Status (pago/pendente) → status
- Categoria → category
- Forma de Pagamento → payment_method
- Observações → notes


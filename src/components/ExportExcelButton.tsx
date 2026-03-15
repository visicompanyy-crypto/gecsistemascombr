import { useState } from "react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Download, CalendarIcon, FileSpreadsheet, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Transaction {
  description: string;
  transaction_type: string;
  amount: number;
  transaction_date: string;
  due_date?: string | null;
  payment_date?: string | null;
  status: string;
  category?: string | null;
  payment_method?: string | null;
  notes?: string | null;
  cost_centers?: { name: string } | null;
  bank_account?: string | null;
  document_number?: string | null;
  pix_key?: string | null;
  pix_recipient_name?: string | null;
  is_installment?: boolean | null;
  installment_number?: number | null;
  total_installments?: number | null;
  tags?: string[] | null;
  transaction_classification?: string | null;
}

interface TeamToolExpense {
  description: string;
  amount: number;
  expense_date: string;
  status: string;
  expense_type: string;
  entity_name: string;
  payment_method?: string | null;
  notes?: string | null;
}

interface ExportExcelButtonProps {
  transactions: Transaction[] | undefined;
  allTransactions: Transaction[] | undefined;
  teamToolExpenses: TeamToolExpense[] | undefined;
  currentMonth: Date;
  userId?: string;
}

const paymentMethodLabels: Record<string, string> = {
  pix: "PIX",
  boleto: "Boleto",
  cartao_credito: "Cartão de Crédito",
  cartao_debito: "Cartão de Débito",
  transferencia: "Transferência",
  dinheiro: "Dinheiro",
  cheque: "Cheque",
};

export function ExportExcelButton({ transactions, allTransactions, teamToolExpenses, currentMonth, userId }: ExportExcelButtonProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Sheets to include
  const [includeTransactions, setIncludeTransactions] = useState(true);
  const [includeRevenue, setIncludeRevenue] = useState(true);
  const [includeExpenses, setIncludeExpenses] = useState(true);
  const [includeTeamToolExpenses, setIncludeTeamToolExpenses] = useState(true);
  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeByCostCenter, setIncludeByCostCenter] = useState(true);

  const isAllMode = !startDate && !endDate;

  const handleOpen = () => {
    // Default to current month range
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    setStartDate(start);
    setEndDate(end);
    setOpen(true);
  };

  const filterByDateRange = <T extends { [key: string]: any }>(items: T[] | undefined, dateField: string): T[] => {
    if (!items) return [];
    return items.filter((item) => {
      const d = new Date(item[dateField]);
      if (startDate && d < startDate) return false;
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (d > endOfDay) return false;
      }
      return true;
    });
  };

  const fetchAllFromDb = async (table: string, dateField: string, selectQuery: string) => {
    const allData: any[] = [];
    let from = 0;
    const pageSize = 1000;
    while (true) {
      setExportProgress(allData.length);
      const { data, error } = await supabase
        .from(table)
        .select(selectQuery)
        .is('deleted_at', null)
        .range(from, from + pageSize - 1)
        .order(dateField, { ascending: false });
      if (error || !data || data.length === 0) break;
      allData.push(...data);
      if (data.length < pageSize) break;
      from += pageSize;
    }
    return allData;
  };

  const handleExport = async () => {
    setExporting(true);
    setExportProgress(0);

    try {
      let filteredTransactions: Transaction[];
      let filteredTeamTool: TeamToolExpense[];

      if (isAllMode && userId) {
        // Fetch ALL data from database with pagination
        const [allTx, allTte] = await Promise.all([
          fetchAllFromDb('financial_transactions', 'transaction_date', '*, cost_centers(name)'),
          fetchAllFromDb('team_tool_expenses', 'expense_date', '*'),
        ]);
        filteredTransactions = allTx as Transaction[];
        filteredTeamTool = allTte as TeamToolExpense[];
      } else {
        const source = allTransactions || transactions || [];
        filteredTransactions = filterByDateRange(source, "transaction_date");
        filteredTeamTool = filterByDateRange(teamToolExpenses, "expense_date");
      }
      const wb = XLSX.utils.book_new();

      // 1. All Transactions sheet
      if (includeTransactions && filteredTransactions.length > 0) {
        const data = filteredTransactions.map((t) => ({
          "Descrição": t.description,
          "Tipo": t.transaction_type === "receita" ? "Receita" : "Despesa",
          "Valor (R$)": t.amount,
          "Data": t.transaction_date,
          "Vencimento": t.due_date || "",
          "Data Pagamento": t.payment_date || "",
          "Status": t.status === "pago" ? "Pago" : "Pendente",
          "Categoria": t.category || "",
          "Forma de Pagamento": paymentMethodLabels[t.payment_method || ""] || t.payment_method || "",
          "Centro de Custo": t.cost_centers?.name || "",
          "Conta Bancária": t.bank_account || "",
          "Nº Documento": t.document_number || "",
          "Classificação": t.transaction_classification || "",
          "Parcelado": t.is_installment ? `${t.installment_number}/${t.total_installments}` : "Não",
          "Tags": t.tags?.join(", ") || "",
          "Chave PIX": t.pix_key || "",
          "Beneficiário PIX": t.pix_recipient_name || "",
          "Observações": t.notes || "",
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        ws["!cols"] = Array(18).fill({ wch: 18 });
        ws["!cols"][0] = { wch: 30 };
        XLSX.utils.book_append_sheet(wb, ws, "Todas as Transações");
      }

      // 2. Revenue only
      if (includeRevenue) {
        const receitas = filteredTransactions.filter((t) => t.transaction_type === "receita");
        if (receitas.length > 0) {
          const receitasPagas = receitas.filter((t) => t.status === "pago");
          const receitasPendentes = receitas.filter((t) => t.status !== "pago");
          const totalRecebido = receitasPagas.reduce((s, t) => s + Number(t.amount), 0);
          const totalPendente = receitasPendentes.reduce((s, t) => s + Number(t.amount), 0);

          const data = [
            { "": "RESUMO DE RECEITAS", " ": "" },
            { "": "Total Recebido", " ": totalRecebido },
            { "": "Total Pendente", " ": totalPendente },
            { "": "Total Geral", " ": totalRecebido + totalPendente },
            { "": "", " ": "" },
            ...receitas.map((t) => ({
              "Descrição": t.description,
              "Valor (R$)": t.amount,
              "Data": t.transaction_date,
              "Vencimento": t.due_date || "",
              "Status": t.status === "pago" ? "Pago" : "Pendente",
              "Categoria": t.category || "",
              "Centro de Custo": t.cost_centers?.name || "",
              "Forma de Pagamento": paymentMethodLabels[t.payment_method || ""] || t.payment_method || "",
            })),
          ];
          const ws = XLSX.utils.json_to_sheet(data);
          ws["!cols"] = Array(8).fill({ wch: 18 });
          XLSX.utils.book_append_sheet(wb, ws, "Receitas");
        }
      }

      // 3. Expenses only
      if (includeExpenses) {
        const despesas = filteredTransactions.filter((t) => t.transaction_type === "despesa");
        if (despesas.length > 0) {
          const despesasPagas = despesas.filter((t) => t.status === "pago");
          const despesasPendentes = despesas.filter((t) => t.status !== "pago");
          const totalPago = despesasPagas.reduce((s, t) => s + Number(t.amount), 0);
          const totalPendente = despesasPendentes.reduce((s, t) => s + Number(t.amount), 0);

          const data = [
            { "": "RESUMO DE DESPESAS", " ": "" },
            { "": "Total Pago", " ": totalPago },
            { "": "Total Pendente", " ": totalPendente },
            { "": "Total Geral", " ": totalPago + totalPendente },
            { "": "", " ": "" },
            ...despesas.map((t) => ({
              "Descrição": t.description,
              "Valor (R$)": t.amount,
              "Data": t.transaction_date,
              "Vencimento": t.due_date || "",
              "Status": t.status === "pago" ? "Pago" : "Pendente",
              "Categoria": t.category || "",
              "Centro de Custo": t.cost_centers?.name || "",
              "Forma de Pagamento": paymentMethodLabels[t.payment_method || ""] || t.payment_method || "",
            })),
          ];
          const ws = XLSX.utils.json_to_sheet(data);
          ws["!cols"] = Array(8).fill({ wch: 18 });
          XLSX.utils.book_append_sheet(wb, ws, "Despesas");
        }
      }

      // 4. Team/Tool expenses
      if (includeTeamToolExpenses && filteredTeamTool.length > 0) {
        const data = filteredTeamTool.map((e) => ({
          "Descrição": e.description,
          "Tipo": e.expense_type === "team" ? "Equipe" : "Ferramenta",
          "Entidade": e.entity_name,
          "Valor (R$)": e.amount,
          "Data": e.expense_date,
          "Status": e.status,
          "Forma de Pagamento": e.payment_method || "",
          "Observações": e.notes || "",
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        ws["!cols"] = Array(8).fill({ wch: 18 });
        XLSX.utils.book_append_sheet(wb, ws, "Equipe e Ferramentas");
      }

      // 5. Summary sheet
      if (includeSummary) {
        const receitas = filteredTransactions.filter((t) => t.transaction_type === "receita");
        const despesas = filteredTransactions.filter((t) => t.transaction_type === "despesa");
        const receitasRecebidas = receitas.filter((t) => t.status === "pago").reduce((s, t) => s + Number(t.amount), 0);
        const receitasPendentes = receitas.filter((t) => t.status !== "pago").reduce((s, t) => s + Number(t.amount), 0);
        const despesasPagas = despesas.filter((t) => t.status === "pago").reduce((s, t) => s + Number(t.amount), 0);
        const despesasPendentes = despesas.filter((t) => t.status !== "pago").reduce((s, t) => s + Number(t.amount), 0);
        const teamToolTotal = filteredTeamTool.reduce((s, e) => s + Number(e.amount), 0);

        const summaryData = [
          { "Indicador": "RELATÓRIO FINANCEIRO", "Valor (R$)": "" },
          { "Indicador": `Período: ${startDate ? format(startDate, "dd/MM/yyyy") : "—"} a ${endDate ? format(endDate, "dd/MM/yyyy") : "—"}`, "Valor (R$)": "" },
          { "Indicador": "", "Valor (R$)": "" },
          { "Indicador": "Receitas Recebidas", "Valor (R$)": receitasRecebidas },
          { "Indicador": "Receitas Pendentes", "Valor (R$)": receitasPendentes },
          { "Indicador": "Total de Receitas", "Valor (R$)": receitasRecebidas + receitasPendentes },
          { "Indicador": "", "Valor (R$)": "" },
          { "Indicador": "Despesas Pagas", "Valor (R$)": despesasPagas },
          { "Indicador": "Despesas Pendentes", "Valor (R$)": despesasPendentes },
          { "Indicador": "Total de Despesas", "Valor (R$)": despesasPagas + despesasPendentes },
          { "Indicador": "", "Valor (R$)": "" },
          { "Indicador": "Despesas Equipe/Ferramentas", "Valor (R$)": teamToolTotal },
          { "Indicador": "", "Valor (R$)": "" },
          { "Indicador": "Resultado (Receitas - Despesas)", "Valor (R$)": receitasRecebidas - despesasPagas - teamToolTotal },
          { "Indicador": "", "Valor (R$)": "" },
          { "Indicador": "Total de Transações", "Valor (R$)": filteredTransactions.length },
          { "Indicador": "Total Equipe/Ferramentas", "Valor (R$)": filteredTeamTool.length },
        ];
        const ws = XLSX.utils.json_to_sheet(summaryData);
        ws["!cols"] = [{ wch: 35 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, ws, "Resumo");
      }

      // 6. By cost center
      if (includeByCostCenter) {
        const byCostCenter: Record<string, { receitas: number; despesas: number; count: number }> = {};
        filteredTransactions.forEach((t) => {
          const name = t.cost_centers?.name || "Sem centro de custo";
          if (!byCostCenter[name]) byCostCenter[name] = { receitas: 0, despesas: 0, count: 0 };
          byCostCenter[name].count++;
          if (t.transaction_type === "receita") byCostCenter[name].receitas += Number(t.amount);
          else byCostCenter[name].despesas += Number(t.amount);
        });

        const data = Object.entries(byCostCenter).map(([name, val]) => ({
          "Centro de Custo": name,
          "Receitas (R$)": val.receitas,
          "Despesas (R$)": val.despesas,
          "Resultado (R$)": val.receitas - val.despesas,
          "Nº Transações": val.count,
        }));
        if (data.length > 0) {
          const ws = XLSX.utils.json_to_sheet(data);
          ws["!cols"] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
          XLSX.utils.book_append_sheet(wb, ws, "Por Centro de Custo");
        }
      }

      if (wb.SheetNames.length === 0) {
        toast({ title: "Nenhuma aba selecionada", description: "Selecione pelo menos uma opção para exportar.", variant: "destructive" });
        return;
      }

      const dateLabel = startDate && endDate
        ? `${format(startDate, "dd-MM-yyyy")}_a_${format(endDate, "dd-MM-yyyy")}`
        : "completo";
      XLSX.writeFile(wb, `relatorio-financeiro-${dateLabel}.xlsx`);

      toast({ title: "Exportado com sucesso!", description: `Relatório gerado com ${wb.SheetNames.length} abas.` });
      setOpen(false);
    } finally {
      setExporting(false);
    }
  };

  const checkboxItems = [
    { id: "transactions", label: "Todas as Transações", checked: includeTransactions, onChange: setIncludeTransactions },
    { id: "revenue", label: "Receitas (com resumo)", checked: includeRevenue, onChange: setIncludeRevenue },
    { id: "expenses", label: "Despesas (com resumo)", checked: includeExpenses, onChange: setIncludeExpenses },
    { id: "teamtool", label: "Equipe e Ferramentas", checked: includeTeamToolExpenses, onChange: setIncludeTeamToolExpenses },
    { id: "summary", label: "Resumo Geral", checked: includeSummary, onChange: setIncludeSummary },
    { id: "costcenter", label: "Por Centro de Custo", checked: includeByCostCenter, onChange: setIncludeByCostCenter },
  ];

  return (
    <>
      <Button
        variant="outline"
        onClick={handleOpen}
        className="gap-2 rounded-[10px] px-4 py-2.5 font-medium"
      >
        <Download className="h-4 w-4" />
        Exportar Excel
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              Exportar Relatório Excel
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            {/* Date range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Período</Label>
              <div className="grid grid-cols-2 gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("justify-start text-left font-normal text-sm", !startDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy") : "Data início"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} locale={ptBR} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("justify-start text-left font-normal text-sm", !endDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy") : "Data fim"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} locale={ptBR} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Quick date presets */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Mês atual", fn: () => { setStartDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)); setEndDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)); }},
                  { label: "Últimos 3 meses", fn: () => { const now = new Date(); setStartDate(new Date(now.getFullYear(), now.getMonth() - 2, 1)); setEndDate(now); }},
                  { label: "Ano atual", fn: () => { const now = new Date(); setStartDate(new Date(now.getFullYear(), 0, 1)); setEndDate(now); }},
                  { label: "Tudo", fn: () => { setStartDate(undefined); setEndDate(undefined); }},
                ].map((preset) => (
                  <Button key={preset.label} variant="secondary" size="sm" className="text-xs h-7" onClick={preset.fn}>
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Sheets to include */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Abas do relatório</Label>
              <div className="space-y-2">
                {checkboxItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox id={item.id} checked={item.checked} onCheckedChange={(v) => item.onChange(!!v)} />
                    <Label htmlFor={item.id} className="text-sm font-normal cursor-pointer">{item.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={handleExport} disabled={exporting} className="gap-2">
                <Download className="h-4 w-4" />
                {exporting ? "Exportando..." : "Exportar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

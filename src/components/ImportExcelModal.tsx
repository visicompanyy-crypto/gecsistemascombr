import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImportExcelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ParsedRow {
  description: string;
  transaction_type: string;
  amount: number;
  transaction_date: string;
  due_date?: string;
  status: string;
  category?: string;
  payment_method?: string;
  notes?: string;
  valid: boolean;
  errors: string[];
}

const typeMap: Record<string, string> = {
  receita: "receita",
  despesa: "despesa",
  income: "receita",
  expense: "despesa",
};

const statusMap: Record<string, string> = {
  pago: "pago",
  pendente: "pendente",
  paid: "pago",
  pending: "pendente",
};

function parseDate(val: any): string | undefined {
  if (!val) return undefined;
  // If it's a number (Excel serial date)
  if (typeof val === "number") {
    const date = XLSX.SSF.parse_date_code(val);
    if (date) {
      return `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
    }
  }
  const str = String(val).trim();
  // Try DD/MM/YYYY
  const brMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brMatch) {
    return `${brMatch[3]}-${brMatch[2].padStart(2, "0")}-${brMatch[1].padStart(2, "0")}`;
  }
  // Try YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) return str;
  return undefined;
}

function parseAmount(val: any): number | null {
  if (typeof val === "number") return Math.abs(val);
  if (!val) return null;
  const str = String(val).replace(/[R$\s]/g, "").replace(/\./g, "").replace(",", ".");
  const num = parseFloat(str);
  return isNaN(num) ? null : Math.abs(num);
}

export function ImportExcelModal({ open, onOpenChange, onSuccess }: ImportExcelModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [importing, setImporting] = useState(false);

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        "Descrição": "Exemplo receita",
        "Tipo": "receita",
        "Valor": 1500.00,
        "Data": "01/01/2025",
        "Vencimento": "05/01/2025",
        "Status": "pago",
        "Categoria": "Serviços",
        "Forma de Pagamento": "pix",
        "Observações": "",
      },
      {
        "Descrição": "Exemplo despesa",
        "Tipo": "despesa",
        "Valor": 250.50,
        "Data": "10/01/2025",
        "Vencimento": "15/01/2025",
        "Status": "pendente",
        "Categoria": "Infraestrutura",
        "Forma de Pagamento": "boleto",
        "Observações": "Nota fiscal 123",
      },
    ];
    const ws = XLSX.utils.json_to_sheet(templateData);
    ws["!cols"] = [
      { wch: 25 }, { wch: 10 }, { wch: 12 }, { wch: 12 },
      { wch: 12 }, { wch: 10 }, { wch: 18 }, { wch: 20 }, { wch: 25 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Modelo");
    XLSX.writeFile(wb, "modelo-importacao.xlsx");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, any>>(ws);

      const rows: ParsedRow[] = json.map((row) => {
        const errors: string[] = [];

        const description = String(row["Descrição"] || row["Descricao"] || row["description"] || "").trim();
        if (!description) errors.push("Descrição obrigatória");

        const rawType = String(row["Tipo"] || row["type"] || "").toLowerCase().trim();
        const transaction_type = typeMap[rawType];
        if (!transaction_type) errors.push("Tipo inválido (use receita/despesa)");

        const amount = parseAmount(row["Valor"] || row["Value"] || row["amount"]);
        if (amount === null || amount <= 0) errors.push("Valor inválido");

        const transaction_date = parseDate(row["Data"] || row["Date"] || row["transaction_date"]);
        if (!transaction_date) errors.push("Data inválida (use DD/MM/AAAA)");

        const due_date = parseDate(row["Vencimento"] || row["due_date"]);

        const rawStatus = String(row["Status"] || row["status"] || "pendente").toLowerCase().trim();
        const status = statusMap[rawStatus] || "pendente";

        const category = String(row["Categoria"] || row["category"] || "").trim() || undefined;
        const payment_method = String(row["Forma de Pagamento"] || row["payment_method"] || "").trim() || undefined;
        const notes = String(row["Observações"] || row["Observacoes"] || row["notes"] || "").trim() || undefined;

        return {
          description,
          transaction_type: transaction_type || "despesa",
          amount: amount || 0,
          transaction_date: transaction_date || "",
          due_date,
          status,
          category,
          payment_method,
          notes,
          valid: errors.length === 0,
          errors,
        };
      });

      setParsedRows(rows);
    };
    reader.readAsArrayBuffer(file);
  };

  const validRows = parsedRows.filter((r) => r.valid);
  const invalidRows = parsedRows.filter((r) => !r.valid);

  const handleImport = async () => {
    if (!user || validRows.length === 0) return;
    setImporting(true);

    try {
      const insertData = validRows.map((r) => ({
        user_id: user.id,
        description: r.description,
        transaction_type: r.transaction_type,
        amount: r.amount,
        transaction_date: r.transaction_date,
        due_date: r.due_date || null,
        status: r.status,
        category: r.category || null,
        payment_method: r.payment_method || null,
        notes: r.notes || null,
      }));

      // Insert in batches of 50
      for (let i = 0; i < insertData.length; i += 50) {
        const batch = insertData.slice(i, i + 50);
        const { error } = await supabase.from("financial_transactions").insert(batch);
        if (error) throw error;
      }

      toast({
        title: "Importação concluída!",
        description: `${validRows.length} transações importadas com sucesso.`,
      });
      onSuccess();
      handleClose();
    } catch (error: any) {
      toast({
        title: "Erro na importação",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setParsedRows([]);
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Importar Planilha Excel
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Template download */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
            <span className="text-sm text-muted-foreground">
              Baixe o modelo para preencher corretamente
            </span>
            <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="gap-2">
              <Download className="h-4 w-4" />
              Baixar Modelo
            </Button>
          </div>

          {/* File upload */}
          <div
            className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              {fileName || "Clique para selecionar o arquivo Excel"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Aceita .xlsx e .xls</p>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Preview */}
          {parsedRows.length > 0 && (
            <>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  {validRows.length} válidas
                </span>
                {invalidRows.length > 0 && (
                  <span className="flex items-center gap-1 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {invalidRows.length} com erro
                  </span>
                )}
              </div>

              <ScrollArea className="flex-1 min-h-0 max-h-[300px] border border-border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Descrição</th>
                      <th className="text-left p-2 font-medium">Tipo</th>
                      <th className="text-right p-2 font-medium">Valor</th>
                      <th className="text-left p-2 font-medium">Data</th>
                      <th className="text-left p-2 font-medium">Situação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedRows.map((row, i) => (
                      <tr key={i} className={`border-t border-border ${!row.valid ? "bg-destructive/5" : ""}`}>
                        <td className="p-2">
                          {row.valid ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          ) : (
                            <span title={row.errors.join(", ")}>
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            </span>
                          )}
                        </td>
                        <td className="p-2 truncate max-w-[200px]">{row.description || "—"}</td>
                        <td className="p-2 capitalize">{row.transaction_type}</td>
                        <td className="p-2 text-right">
                          {row.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </td>
                        <td className="p-2">{row.transaction_date || "—"}</td>
                        <td className="p-2 capitalize">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleImport}
              disabled={validRows.length === 0 || importing}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {importing ? "Importando..." : `Importar ${validRows.length} transações`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

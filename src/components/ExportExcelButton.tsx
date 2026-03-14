import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
}

interface ExportExcelButtonProps {
  transactions: Transaction[] | undefined;
  currentMonth: Date;
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

export function ExportExcelButton({ transactions, currentMonth }: ExportExcelButtonProps) {
  const { toast } = useToast();

  const handleExport = () => {
    if (!transactions || transactions.length === 0) {
      toast({
        title: "Nenhuma transação",
        description: "Não há transações para exportar neste mês.",
        variant: "destructive",
      });
      return;
    }

    const data = transactions.map((t) => ({
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
      "Observações": t.notes || "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths
    ws["!cols"] = [
      { wch: 30 }, { wch: 10 }, { wch: 15 }, { wch: 12 },
      { wch: 12 }, { wch: 14 }, { wch: 10 }, { wch: 18 },
      { wch: 20 }, { wch: 20 }, { wch: 30 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Financeiro");

    const monthName = currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }).replace(/ /g, "-");
    XLSX.writeFile(wb, `relatorio-financeiro-${monthName}.xlsx`);

    toast({
      title: "Exportado com sucesso!",
      description: `${transactions.length} transações exportadas.`,
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      className="gap-2 rounded-[10px] px-4 py-2.5 font-medium"
    >
      <Download className="h-4 w-4" />
      Exportar Excel
    </Button>
  );
}

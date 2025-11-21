import { Card } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, DollarSign } from "lucide-react";

interface FinancialSummaryCardsProps {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export function FinancialSummaryCards({
  totalReceitas,
  totalDespesas,
  saldo,
}: FinancialSummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Receitas</p>
            <h3 className="text-2xl font-bold text-green-600">{formatCurrency(totalReceitas)}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <ArrowUpIcon className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Despesas</p>
            <h3 className="text-2xl font-bold text-red-600">{formatCurrency(totalDespesas)}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <ArrowDownIcon className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Saldo</p>
            <h3 className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(saldo)}
            </h3>
          </div>
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
            saldo >= 0 ? 'bg-blue-100' : 'bg-red-100'
          }`}>
            <DollarSign className={`h-6 w-6 ${saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
          </div>
        </div>
      </Card>
    </div>
  );
}

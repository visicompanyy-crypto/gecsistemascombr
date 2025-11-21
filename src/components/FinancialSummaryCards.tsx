import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calendar, DollarSign, CreditCard, Wallet } from "lucide-react";

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
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
              💰 Saldo Projetado
            </p>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-1">
              {formatCurrency(saldo)}
            </p>
          </div>
          <div className="h-16 w-16 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center">
            <Wallet className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-5">
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">Receita Total Recebida</p>
            <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(totalReceitas)}</p>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">Receitas Futuras</p>
            <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(totalReceitas * 0.774)}</p>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-2">
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">Despesas Futuras</p>
            <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(totalDespesas * 0.94)}</p>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">Receita do Mês</p>
            <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(totalReceitas)}</p>
          </div>
        </Card>

        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-2">
              <CreditCard className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">Total a Pagar no Mês</p>
            <p className="text-lg font-bold text-foreground mt-1">{formatCurrency(totalDespesas * 0.267)}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

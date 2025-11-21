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
    <div className="space-y-6">
      <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary uppercase tracking-wide mb-2">
              Saldo Projetado
            </p>
            <p className="text-5xl font-semibold text-primary">
              {formatCurrency(saldo)}
            </p>
          </div>
          <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Wallet className="h-10 w-10 text-primary" />
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-5">
        <Card className="p-6 hover:shadow-md transition-all duration-300 bg-card shadow-sm border-border/50">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-7 w-7 text-primary" />
            </div>
            <p className="text-xs font-medium text-secondary">Receita Total Recebida</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(totalReceitas)}</p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-all duration-300 bg-card shadow-sm border-border/50">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <Calendar className="h-7 w-7 text-primary" />
            </div>
            <p className="text-xs font-medium text-secondary">Receitas Futuras</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(totalReceitas * 0.774)}</p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-all duration-300 bg-card shadow-sm border-border/50">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-14 w-14 rounded-xl bg-destructive/10 flex items-center justify-center">
              <TrendingDown className="h-7 w-7 text-destructive" />
            </div>
            <p className="text-xs font-medium text-secondary">Despesas Futuras</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(totalDespesas * 0.94)}</p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-all duration-300 bg-card shadow-sm border-border/50">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-7 w-7 text-primary" />
            </div>
            <p className="text-xs font-medium text-secondary">Receita do Mês</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(totalReceitas)}</p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-all duration-300 bg-card shadow-sm border-border/50">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-14 w-14 rounded-xl bg-warning/10 flex items-center justify-center">
              <CreditCard className="h-7 w-7 text-warning" />
            </div>
            <p className="text-xs font-medium text-secondary">Total a Pagar no Mês</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(totalDespesas * 0.267)}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

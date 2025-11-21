import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  month: string;
  receitas: number;
  despesas: number;
}

interface FinanceChartSectionProps {
  data: ChartData[];
}

export function FinanceChartSection({ data }: FinanceChartSectionProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
  };

  const chartData = data.map(item => ({
    ...item,
    name: formatMonth(item.month),
  }));

  return (
    <Card className="p-8 shadow-sm border-border/50 bg-card">
      <h3 className="text-lg font-semibold mb-6 text-secondary">Evolução Financeira</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(49, 11%, 90%)" />
          <XAxis 
            dataKey="name" 
            stroke="hsl(49, 8%, 45%)"
            style={{ fontSize: '12px', fontFamily: 'Inter' }}
          />
          <YAxis 
            tickFormatter={formatCurrency} 
            stroke="hsl(49, 8%, 45%)"
            style={{ fontSize: '12px', fontFamily: 'Inter' }}
          />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: 'hsl(0, 0%, 100%)',
              border: '1px solid hsl(49, 11%, 90%)',
              borderRadius: '0.875rem',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              fontFamily: 'Inter'
            }}
          />
          <Legend 
            wrapperStyle={{ fontFamily: 'Inter', fontSize: '14px' }}
          />
          <Line 
            type="monotone" 
            dataKey="receitas" 
            stroke="hsl(128, 42%, 40%)" 
            strokeWidth={3}
            name="Receitas"
            dot={{ fill: 'hsl(128, 42%, 40%)', r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="despesas" 
            stroke="hsl(0, 84.2%, 60.2%)" 
            strokeWidth={3}
            name="Despesas"
            dot={{ fill: 'hsl(0, 84.2%, 60.2%)', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

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
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Evolução Financeira</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="receitas" 
            stroke="hsl(128, 42%, 40%)" 
            strokeWidth={2}
            name="Receitas"
          />
          <Line 
            type="monotone" 
            dataKey="despesas" 
            stroke="hsl(0, 84.2%, 60.2%)" 
            strokeWidth={2}
            name="Despesas"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

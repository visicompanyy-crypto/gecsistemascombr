import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryData {
  [key: string]: {
    receitas: number;
    despesas: number;
  };
}

interface FinancePieChartsProps {
  data: CategoryData;
}

const COLORS = [
  'hsl(128, 42%, 40%)',  // Verde primário
  'hsl(49, 11%, 61%)',   // Bege secundário
  'hsl(128, 42%, 50%)',  // Verde mais claro
  'hsl(38, 92%, 50%)',   // Amarelo
  'hsl(199, 89%, 48%)',  // Azul
  'hsl(0, 84.2%, 60.2%)' // Vermelho
];

export function FinancePieCharts({ data }: FinancePieChartsProps) {
  const receitasData = Object.entries(data)
    .filter(([_, values]) => values.receitas > 0)
    .map(([name, values]) => ({
      name,
      value: values.receitas,
    }));

  const despesasData = Object.entries(data)
    .filter(([_, values]) => values.despesas > 0)
    .map(([name, values]) => ({
      name,
      value: values.despesas,
    }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-6">
      <Card className="p-8 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.06)] border border-border bg-card">
        <h3 className="text-lg font-semibold mb-6 text-center text-foreground">Receitas por Categoria</h3>
        {receitasData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={receitasData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {receitasData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Nenhuma receita cadastrada
          </div>
        )}
      </Card>

      <Card className="p-8 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.06)] border border-border bg-card">
        <h3 className="text-lg font-semibold mb-6 text-center text-foreground">Despesas por Categoria</h3>
        {despesasData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={despesasData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {despesasData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Nenhuma despesa cadastrada
          </div>
        )}
      </Card>
    </div>
  );
}

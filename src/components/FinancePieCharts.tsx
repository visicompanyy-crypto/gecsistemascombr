import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { useState } from 'react';

interface CategoryData {
  [key: string]: {
    receitas: number;
    despesas: number;
  };
}

interface FinancePieChartsProps {
  data: CategoryData;
}

// Paleta de cores para receitas (tons de verde)
const INCOME_COLORS = [
  'hsl(136, 42%, 40%)',  // Verde principal
  'hsl(136, 42%, 55%)',  // Verde médio
  'hsl(136, 35%, 65%)',  // Verde claro
  'hsl(160, 40%, 50%)',  // Verde azulado
  'hsl(120, 35%, 55%)',  // Verde limão
  'hsl(150, 45%, 45%)',  // Verde esmeralda
];

// Paleta de cores para despesas (tons de vermelho/laranja)
const EXPENSE_COLORS = [
  'hsl(0, 70%, 55%)',    // Vermelho principal
  'hsl(15, 80%, 55%)',   // Laranja avermelhado
  'hsl(30, 85%, 55%)',   // Laranja
  'hsl(350, 65%, 60%)',  // Rosa avermelhado
  'hsl(10, 75%, 60%)',   // Coral
  'hsl(340, 60%, 55%)',  // Magenta suave
];

interface ChartDataItem {
  name: string;
  value: number;
  percentage: number;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 8}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, index, colors }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 30;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const lineEndX = cx + (outerRadius + 10) * Math.cos(-midAngle * RADIAN);
  const lineEndY = cy + (outerRadius + 10) * Math.sin(-midAngle * RADIAN);
  
  const isLeft = x < cx;
  const textAnchor = isLeft ? 'end' : 'start';
  
  return (
    <g>
      {/* Linha conectora */}
      <path
        d={`M ${lineEndX},${lineEndY} L ${x},${y}`}
        stroke={colors[index % colors.length]}
        strokeWidth={1.5}
        fill="none"
        opacity={0.6}
      />
      {/* Círculo no final da linha */}
      <circle
        cx={x}
        cy={y}
        r={3}
        fill={colors[index % colors.length]}
        opacity={0.8}
      />
      {/* Nome do centro de custo */}
      <text
        x={x + (isLeft ? -8 : 8)}
        y={y - 6}
        textAnchor={textAnchor}
        fill="hsl(0, 0%, 29%)"
        fontSize={12}
        fontWeight={500}
        fontFamily="Inter"
      >
        {name}
      </text>
      {/* Porcentagem */}
      <text
        x={x + (isLeft ? -8 : 8)}
        y={y + 10}
        textAnchor={textAnchor}
        fill="hsl(0, 0%, 45%)"
        fontSize={11}
        fontFamily="Inter"
      >
        {(percent * 100).toFixed(1).replace('.', ',')}%
      </text>
    </g>
  );
};

const CenterLabel = ({ cx, cy, text, value }: { cx: number; cy: number; text: string; value: string }) => (
  <g>
    <text
      x={cx}
      y={cy - 8}
      textAnchor="middle"
      fill="hsl(0, 0%, 29%)"
      fontSize={14}
      fontWeight={600}
      fontFamily="Inter"
    >
      100%
    </text>
    <text
      x={cx}
      y={cy + 12}
      textAnchor="middle"
      fill="hsl(0, 0%, 45%)"
      fontSize={11}
      fontFamily="Inter"
    >
      {text}
    </text>
  </g>
);

interface DonutChartProps {
  data: ChartDataItem[];
  colors: string[];
  emptyMessage: string;
  type: 'income' | 'expense';
}

function DonutChart({ data, colors, emptyMessage, type }: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  if (data.length === 0) {
    return (
      <div className="h-[320px] flex items-center justify-center text-muted-foreground text-sm">
        {emptyMessage}
      </div>
    );
  }

  const isSingleItem = data.length === 1;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            {/* Gradientes sutis para cada fatia */}
            {colors.map((color, index) => (
              <linearGradient key={`gradient-${index}`} id={`gradient-${type}-${index}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={1} />
                <stop offset="100%" stopColor={color} stopOpacity={0.85} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={105}
            paddingAngle={data.length > 1 ? 2 : 0}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            label={!isSingleItem ? (props) => <CustomLabel {...props} colors={colors} /> : false}
            labelLine={false}
            stroke="rgba(255,255,255,0.8)"
            strokeWidth={2}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#gradient-${type}-${index})`}
                style={{ 
                  filter: activeIndex === index ? 'brightness(1.1)' : 'none',
                  transition: 'filter 0.2s ease'
                }}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number, name: string) => [formatCurrency(value), name]}
            contentStyle={{
              backgroundColor: 'hsl(0, 0%, 100%)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
              fontFamily: 'Inter',
              padding: '12px 16px',
            }}
            itemStyle={{
              color: 'hsl(0, 0%, 29%)',
              fontWeight: 500,
            }}
            labelStyle={{
              color: 'hsl(0, 0%, 45%)',
              marginBottom: '4px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Label central para item único */}
      {isSingleItem && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center -mt-1">
            <p className="text-2xl font-bold text-foreground">100%</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[100px] truncate">
              {data[0].name}
            </p>
          </div>
        </div>
      )}
      
      {/* Label central com total (quando múltiplos itens) */}
      {!isSingleItem && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center -mt-1">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(total)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function FinancePieCharts({ data }: FinancePieChartsProps) {
  const receitasData: ChartDataItem[] = Object.entries(data)
    .filter(([_, values]) => values.receitas > 0)
    .map(([name, values]) => ({
      name,
      value: values.receitas,
      percentage: 0,
    }));

  const totalReceitas = receitasData.reduce((sum, item) => sum + item.value, 0);
  receitasData.forEach(item => {
    item.percentage = totalReceitas > 0 ? (item.value / totalReceitas) * 100 : 0;
  });

  const despesasData: ChartDataItem[] = Object.entries(data)
    .filter(([_, values]) => values.despesas > 0)
    .map(([name, values]) => ({
      name,
      value: values.despesas,
      percentage: 0,
    }));

  const totalDespesas = despesasData.reduce((sum, item) => sum + item.value, 0);
  despesasData.forEach(item => {
    item.percentage = totalDespesas > 0 ? (item.value / totalDespesas) * 100 : 0;
  });

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-6">
      <Card className="p-6 rounded-2xl shadow-[0_5px_25px_rgba(0,0,0,0.06)] border border-border bg-card overflow-hidden">
        <h3 className="text-base font-semibold text-foreground text-center mb-2">
          Receitas por Centro de Custo
        </h3>
        <DonutChart 
          data={receitasData} 
          colors={INCOME_COLORS}
          emptyMessage="Nenhuma receita paga cadastrada"
          type="income"
        />
      </Card>

      <Card className="p-6 rounded-2xl shadow-[0_5px_25px_rgba(0,0,0,0.06)] border border-border bg-card overflow-hidden">
        <h3 className="text-base font-semibold text-foreground text-center mb-2">
          Despesas por Centro de Custo
        </h3>
        <DonutChart 
          data={despesasData} 
          colors={EXPENSE_COLORS}
          emptyMessage="Nenhuma despesa paga cadastrada"
          type="expense"
        />
      </Card>
    </div>
  );
}

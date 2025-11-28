import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { useState } from 'react';
import { Expand } from 'lucide-react';

interface CategoryData {
  [key: string]: {
    receitas: number;
    despesas: number;
  };
}

interface FinancePieChartsProps {
  data: CategoryData;
  currentMonth: Date;
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
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

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

const CustomLabel = ({ cx, cy, midAngle, outerRadius, percent, name, index, colors }: any) => {
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
        fill="hsl(var(--foreground))"
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
        fill="hsl(var(--muted-foreground))"
        fontSize={11}
        fontFamily="Inter"
      >
        {(percent * 100).toFixed(1).replace('.', ',')}%
      </text>
    </g>
  );
};

interface DonutChartProps {
  data: ChartDataItem[];
  colors: string[];
  emptyMessage: string;
  type: 'income' | 'expense';
  expanded?: boolean;
}

function DonutChart({ data, colors, emptyMessage, type, expanded = false }: DonutChartProps) {
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
      <div className={`${expanded ? 'h-[400px]' : 'h-[320px]'} flex items-center justify-center text-muted-foreground text-sm`}>
        {emptyMessage}
      </div>
    );
  }

  const isSingleItem = data.length === 1;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const innerRadius = expanded ? 100 : 70;
  const outerRadius = expanded ? 160 : 105;

  return (
    <div className={`relative ${expanded ? 'h-[400px]' : 'h-[320px]'}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            {/* Gradientes sutis para cada fatia */}
            {colors.map((color, index) => (
              <linearGradient key={`gradient-${index}`} id={`gradient-${type}-${expanded ? 'exp-' : ''}${index}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={1} />
                <stop offset="100%" stopColor={color} stopOpacity={0.85} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={data.length > 1 ? 2 : 0}
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            label={!isSingleItem && !expanded ? (props) => <CustomLabel {...props} colors={colors} /> : false}
            labelLine={false}
            stroke="rgba(255,255,255,0.8)"
            strokeWidth={2}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={`url(#gradient-${type}-${expanded ? 'exp-' : ''}${index})`}
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
              backgroundColor: 'hsl(var(--card))',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)',
              fontFamily: 'Inter',
              padding: '12px 16px',
            }}
            itemStyle={{
              color: 'hsl(var(--foreground))',
              fontWeight: 500,
            }}
            labelStyle={{
              color: 'hsl(var(--muted-foreground))',
              marginBottom: '4px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Label central para item único */}
      {isSingleItem && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center -mt-1">
            <p className={`${expanded ? 'text-4xl' : 'text-2xl'} font-bold text-foreground`}>100%</p>
            <p className={`${expanded ? 'text-sm' : 'text-xs'} text-muted-foreground mt-1 max-w-[100px] truncate`}>
              {data[0].name}
            </p>
          </div>
        </div>
      )}
      
      {/* Label central com total (quando múltiplos itens) */}
      {!isSingleItem && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center -mt-1">
            <p className={`${expanded ? 'text-sm' : 'text-xs'} text-muted-foreground`}>Total</p>
            <p className={`${expanded ? 'text-2xl' : 'text-lg'} font-semibold text-foreground`}>
              {formatCurrency(total)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export function FinancePieCharts({ data, currentMonth }: FinancePieChartsProps) {
  const [expandedChart, setExpandedChart] = useState<'income' | 'expense' | null>(null);

  // Safety check - ensure data is always an object
  const safeData = data || {};

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const receitasData: ChartDataItem[] = Object.entries(safeData)
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

  const despesasData: ChartDataItem[] = Object.entries(safeData)
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

  const expandedData = expandedChart === 'income' ? receitasData : despesasData;
  const expandedColors = expandedChart === 'income' ? INCOME_COLORS : EXPENSE_COLORS;
  const expandedTitle = expandedChart === 'income' ? 'Receitas' : 'Despesas';

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card className="p-6 rounded-2xl shadow-[0_5px_25px_rgba(0,0,0,0.06)] border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-foreground">
              Receitas por Centro de Custo
            </h3>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setExpandedChart('income')}
              className="h-8 w-8 hover:bg-muted"
              title="Expandir gráfico"
            >
              <Expand className="h-4 w-4" />
            </Button>
          </div>
          <DonutChart 
            data={receitasData} 
            colors={INCOME_COLORS}
            emptyMessage="Nenhuma receita paga no mês"
            type="income"
          />
        </Card>

        <Card className="p-6 rounded-2xl shadow-[0_5px_25px_rgba(0,0,0,0.06)] border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-semibold text-foreground">
              Despesas por Centro de Custo
            </h3>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setExpandedChart('expense')}
              className="h-8 w-8 hover:bg-muted"
              title="Expandir gráfico"
            >
              <Expand className="h-4 w-4" />
            </Button>
          </div>
          <DonutChart 
            data={despesasData} 
            colors={EXPENSE_COLORS}
            emptyMessage="Nenhuma despesa paga no mês"
            type="expense"
          />
        </Card>
      </div>

      {/* Modal Expandido */}
      <Dialog open={expandedChart !== null} onOpenChange={() => setExpandedChart(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <div className="p-8 animate-scale-in">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl">
                {expandedTitle} por Centro de Custo
              </DialogTitle>
              <p className="text-sm text-muted-foreground capitalize">
                {currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </p>
            </DialogHeader>
            
            {/* Gráfico Ampliado */}
            <div className="my-6">
              {expandedChart && (
                <DonutChart 
                  data={expandedData}
                  colors={expandedColors}
                  emptyMessage={`Nenhum${expandedChart === 'income' ? 'a receita' : 'a despesa'} pag${expandedChart === 'income' ? 'a' : 'a'} no mês`}
                  type={expandedChart}
                  expanded={true}
                />
              )}
            </div>
            
            {/* Lista detalhada */}
            {expandedData.length > 0 && (
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                <h4 className="font-semibold text-foreground">Detalhamento</h4>
                {expandedData.map((item, index) => (
                  <div 
                    key={index} 
                    className="flex justify-between items-center p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: expandedColors[index % expandedColors.length] }}
                      />
                      <span className="font-medium text-foreground">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{formatCurrency(item.value)}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.percentage.toFixed(1).replace('.', ',')}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
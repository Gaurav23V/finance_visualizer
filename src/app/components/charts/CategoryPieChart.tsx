'use client';

import * as React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryAggregation } from '@/lib/utils/analytics';
import { formatCurrency } from '@/lib/utils/format';

interface CategoryPieChartProps {
  data: CategoryAggregation[];
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AF19FF',
  '#FF4560',
  '#775DD0',
  '#546E7A',
  '#26a69a',
  '#D10CE8',
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className='p-2 text-sm bg-background border rounded-md shadow-md'>
        <p className='font-bold'>{payload[0].name}</p>
        <p className='text-muted-foreground'>{`Total: ${formatCurrency(
          payload[0].value
        )}`}</p>
      </div>
    );
  }
  return null;
};

interface CustomizedLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: CustomizedLabelProps) => {
  if (
    cx === undefined ||
    cy === undefined ||
    midAngle === undefined ||
    innerRadius === undefined ||
    outerRadius === undefined ||
    percent === undefined
  ) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Don't render label if percentage is too small
  if (percent < 0.05) {
    return null;
  }

  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
      className='text-xs font-semibold'
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CategoryPieChartComponent = ({ data }: CategoryPieChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>
              No expense data available for this period.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width='100%' height={350}>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill='#8884d8'
              dataKey='total'
              nameKey='category'
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout='vertical'
              align='right'
              verticalAlign='middle'
              wrapperStyle={{ right: -10 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// Memoized to avoid unnecessary re-renders when parent components update without data change
export const CategoryPieChart = React.memo(CategoryPieChartComponent);

'use client';

import * as React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BudgetSummary } from '@/lib/utils/budget';
import { formatCurrency } from '@/lib/utils/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BudgetComparisonChartProps {
  data: BudgetSummary[];
}

const BudgetComparisonChartComponent = ({ data }: BudgetComparisonChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs. Actual</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">No budget data to display for this period.</p>
        </CardContent>
      </Card>
    );
  }
  const chartData = data.map(item => ({
    name: item.category,
    Budget: item.amount,
    Spent: item.spent,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs. Actual</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={value => formatCurrency(value as number)} />
            <Tooltip
              formatter={(value, name) => [formatCurrency(value as number), name]}
              cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
            />
            <Legend />
            <Bar dataKey="Budget" fill="#3b82f6" />
            <Bar dataKey="Spent" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const BudgetComparisonChart = React.memo(BudgetComparisonChartComponent); 
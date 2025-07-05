'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyAggregation } from '@/lib/utils/analytics';
import { formatCurrency } from '@/lib/utils/format';
import React from 'react';

interface MonthlyExpensesChartProps {
  data: MonthlyAggregation[];
}

const MonthlyExpensesChartComponent = ({ data }: MonthlyExpensesChartProps) => {
  if (data.length === 0) {
    return (
      <div className='text-center text-muted-foreground'>
        No data to display.
      </div>
    );
  }

  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='month' />
        <YAxis tickFormatter={value => formatCurrency(value as number)} />
        <Tooltip
          formatter={value => [formatCurrency(value as number), 'Expenses']}
        />
        <Bar dataKey='expenses' fill='#ef4444' />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const MonthlyExpensesChart = React.memo(MonthlyExpensesChartComponent);

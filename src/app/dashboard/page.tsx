'use client';

import { useState } from 'react';
import { useDashboard } from '@/hooks/useDashboard';
import { ChartCard } from '@/app/components/charts/ChartCard';
import { MonthlyExpensesChart } from '@/app/components/charts/MonthlyExpensesChart';
import { CategoryPieChart } from '@/app/components/charts/CategoryPieChart';
import { formatCurrency } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import { CategoryBreakdownCard } from '@/app/components/dashboard/CategoryBreakdownCard';
import { RecentTransactionsCard } from '@/app/components/dashboard/RecentTransactionsCard';
// import { RecentTransactionsCard } from '@/app/components/dashboard/RecentTransactionsCard';

export type Period = 'this_month' | 'last_month' | 'last_3_months';

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>('this_month');
  const { data, isLoading, error, refetch } = useDashboard({ period });

  const monthlySummary = data?.monthlySummary || {
    totalIncome: 0,
    totalExpenses: 0,
    net: 0,
  };
  const categoryData = data?.categoryBreakdown || [];
  const monthlyChartData = data?.monthlyChartData || [];
  const recentTransactions = data?.recentTransactions || [];

  return (
    <div className='container mx-auto p-4 md:p-8'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <div className='flex space-x-2'>
          <Button
            variant={period === 'this_month' ? 'default' : 'outline'}
            onClick={() => setPeriod('this_month')}
          >
            This Month
          </Button>
          <Button
            variant={period === 'last_month' ? 'default' : 'outline'}
            onClick={() => setPeriod('last_month')}
          >
            Last Month
          </Button>
          <Button
            variant={period === 'last_3_months' ? 'default' : 'outline'}
            onClick={() => setPeriod('last_3_months')}
          >
            Last 3 Months
          </Button>
        </div>
      </div>

      {/* Top Row: Summary Cards */}
      <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
        <ChartCard
          title='Current Month Expenses'
          description='Total spending for the current month.'
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
        >
          <div className='text-4xl font-bold text-red-600'>
            {formatCurrency(monthlySummary.totalExpenses)}
          </div>
        </ChartCard>

        <ChartCard
          title='Current Month Income'
          description='Total income for the current month.'
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
        >
          <div className='text-4xl font-bold text-green-600'>
            {formatCurrency(monthlySummary.totalIncome)}
          </div>
        </ChartCard>

        <ChartCard
          title='Current Month Net'
          description='Net cash flow for the current month.'
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
        >
          <div className='text-4xl font-bold'>
            {formatCurrency(monthlySummary.net)}
          </div>
        </ChartCard>
      </div>

      {/* Middle Row: Monthly Chart and Category Breakdown */}
      <div className='mt-8 grid gap-8 lg:grid-cols-5'>
        <div className='lg:col-span-3'>
          <ChartCard
            title='Monthly Expenses'
            description='A month-over-month view of your spending.'
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
          >
            <MonthlyExpensesChart data={monthlyChartData} />
          </ChartCard>
        </div>
        <div className='lg:col-span-2'>
          <CategoryBreakdownCard
            data={categoryData}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
          />
        </div>
      </div>

      {/* Bottom Row: Pie Chart and Recent Transactions */}
      <div className='mt-8 grid gap-8 md:grid-cols-2'>
        <ChartCard
          title='Expense Categories'
          description='A breakdown of your spending by category.'
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
        >
          <CategoryPieChart data={categoryData} />
        </ChartCard>
        <div>
          <RecentTransactionsCard
            transactions={recentTransactions}
            isLoading={isLoading}
            error={error}
            onRetry={refetch}
          />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useAnalytics } from '@/hooks/useAnalytics';
import { useTransactions } from '@/hooks/useTransactions';
import { ChartCard } from '@/app/components/charts/ChartCard';
import { MonthlyExpensesChart } from '@/app/components/charts/MonthlyExpensesChart';
import { getMonthlySummary } from '@/lib/utils/analytics';
import { formatCurrency } from '@/lib/utils/format';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const {
    analyticsData,
    isLoading: isAnalyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useAnalytics();
  const {
    transactions,
    isLoading: isTransactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useTransactions();

  const monthlySummary = getMonthlySummary(transactions);

  const handleRetry = () => {
    refetchAnalytics();
    refetchTransactions();
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <ChartCard
          title="Current Month Expenses"
          description="Total spending for the current month."
          isLoading={isTransactionsLoading}
          error={transactionsError}
          onRetry={refetchTransactions}
        >
          <div className="text-4xl font-bold text-red-600">
            {formatCurrency(monthlySummary.totalExpenses)}
          </div>
        </ChartCard>

        <ChartCard
          title="Current Month Income"
          description="Total income for the current month."
          isLoading={isTransactionsLoading}
          error={transactionsError}
          onRetry={refetchTransactions}
        >
          <div className="text-4xl font-bold text-green-600">
            {formatCurrency(monthlySummary.totalIncome)}
          </div>
        </ChartCard>

        <ChartCard
          title="Current Month Net"
          description="Net cash flow for the current month."
          isLoading={isTransactionsLoading}
          error={transactionsError}
          onRetry={refetchTransactions}
        >
          <div className="text-4xl font-bold">
            {formatCurrency(monthlySummary.net)}
          </div>
        </ChartCard>
      </div>

      <div className="mt-8">
        <ChartCard
          title="Monthly Expenses"
          description="A month-over-month view of your spending."
          isLoading={isAnalyticsLoading}
          error={analyticsError}
          onRetry={refetchAnalytics}
        >
          <MonthlyExpensesChart data={analyticsData} />
        </ChartCard>
      </div>
      <div className="mt-8 text-center">
        <Link href="/transactions" passHref>
          <Button>View All Transactions</Button>
        </Link>
      </div>
    </div>
  );
} 
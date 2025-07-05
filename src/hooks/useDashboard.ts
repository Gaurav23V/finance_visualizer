'use client';

import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/types/transaction';
import { MonthlyAggregation, CategoryAggregation } from '@/lib/utils/analytics';
import { Period } from '@/app/dashboard/page';

export interface DashboardData {
  monthlySummary: {
    totalIncome: number;
    totalExpenses: number;
    net: number;
    totalBudgeted?: number;
  };
  categoryBreakdown: (CategoryAggregation & { percentage: number })[];
  monthlyChartData: MonthlyAggregation[];
  recentTransactions: Transaction[];
}

export const useDashboard = ({ period }: { period: Period }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async (fetchPeriod: Period) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/dashboard?period=${fetchPeriod}`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch dashboard data');
      }
      setData(result.data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(period);
  }, [period, fetchDashboardData]);

  return { data, isLoading, error, refetch: () => fetchDashboardData(period) };
};

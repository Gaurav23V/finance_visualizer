'use client';

import { useState, useEffect, useCallback } from 'react';
import { MonthlyAggregation } from '@/lib/utils/analytics';

export const useAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<MonthlyAggregation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics data');
      }
      setAnalyticsData(data.data);
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
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { analyticsData, isLoading, error, refetch: fetchAnalytics };
};

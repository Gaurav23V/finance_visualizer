import { NextRequest } from 'next/server';
import { getTransactionsCollection } from '@/lib/db/mongodb';
import { successResponse, databaseErrorResponse } from '@/lib/api/response';
import { formatTransactionResponse } from '@/lib/api/formatters';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Period } from '@/app/dashboard/page';
import { CategoryAggregation } from '@/lib/utils/analytics';

const getPeriodDates = (period: Period) => {
  const now = new Date();
  switch (period) {
    case 'last_month':
      const lastMonth = subMonths(now, 1);
      return {
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth),
      };
    case 'last_3_months':
      return {
        startDate: startOfMonth(subMonths(now, 2)),
        endDate: endOfMonth(now),
      };
    case 'this_month':
    default:
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
      };
  }
};

export async function GET(request: NextRequest) {
  try {
    const collection = await getTransactionsCollection();
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') as Period) || 'this_month';

    const { startDate, endDate } = getPeriodDates(period);

    const periodFilter = {
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    const dashboardData = await collection
      .aggregate([
        {
          $facet: {
            monthlySummary: [
              { $match: periodFilter },
              {
                $group: {
                  _id: null,
                  totalIncome: {
                    $sum: {
                      $cond: [{ $gt: ['$amount', 0] }, '$amount', 0],
                    },
                  },
                  totalExpenses: {
                    $sum: {
                      $cond: [{ $lt: ['$amount', 0] }, '$amount', 0],
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalIncome: 1,
                  totalExpenses: { $abs: '$totalExpenses' },
                  net: { $add: ['$totalIncome', '$totalExpenses'] },
                },
              },
            ],
            categoryBreakdown: [
              {
                $match: { ...periodFilter, amount: { $lt: 0 } },
              },
              {
                $group: {
                  _id: '$category',
                  total: { $sum: '$amount' },
                },
              },
              {
                $project: {
                  _id: 0,
                  category: '$_id',
                  total: { $abs: '$total' },
                },
              },
              { $sort: { total: -1 } },
            ],
            monthlyChartData: [
              {
                $group: {
                  _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
                  income: {
                    $sum: { $cond: [{ $gt: ['$amount', 0] }, '$amount', 0] },
                  },
                  expenses: {
                    $sum: {
                      $cond: [{ $lt: ['$amount', 0] }, { $abs: '$amount' }, 0],
                    },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  month: '$_id',
                  income: 1,
                  expenses: 1,
                },
              },
              { $sort: { month: 1 } },
            ],
            recentTransactions: [{ $sort: { date: -1 } }, { $limit: 5 }],
          },
        },
        {
          $project: {
            monthlySummary: { $arrayElemAt: ['$monthlySummary', 0] },
            categoryBreakdown: 1,
            monthlyChartData: 1,
            recentTransactions: 1,
          },
        },
      ])
      .next();

    // Add percentages to category breakdown
    const totalExpenses = dashboardData?.monthlySummary?.totalExpenses || 1;
    if (dashboardData && dashboardData.categoryBreakdown) {
      dashboardData.categoryBreakdown = dashboardData.categoryBreakdown.map(
        (cat: CategoryAggregation) => ({
          ...cat,
          percentage: (cat.total / totalExpenses) * 100,
        })
      );
    }

    if (dashboardData && dashboardData.recentTransactions) {
      dashboardData.recentTransactions = dashboardData.recentTransactions.map(
        formatTransactionResponse
      );
    }

    const defaultSummary = { totalIncome: 0, totalExpenses: 0, net: 0 };

    return successResponse({
      monthlySummary: dashboardData?.monthlySummary || defaultSummary,
      categoryBreakdown: dashboardData?.categoryBreakdown || [],
      monthlyChartData: dashboardData?.monthlyChartData || [],
      recentTransactions: dashboardData?.recentTransactions || [],
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return databaseErrorResponse('Failed to fetch dashboard data');
  }
}

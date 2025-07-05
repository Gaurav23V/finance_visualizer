import { NextRequest } from 'next/server';
import {
  getTransactionsCollection,
  getBudgetsCollection,
} from '@/lib/db/mongodb';
import {
  successResponse,
  errorResponse,
  HTTP_STATUS,
} from '@/lib/api/response';
import { calculateBudgetVsActual } from '@/lib/utils/budget';
import { generateSpendingInsights } from '@/lib/utils/insights';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get('month') || '0', 10);
    const year = parseInt(searchParams.get('year') || '0', 10);

    if (!month || !year) {
      return errorResponse(
        'Month and year are required.',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    const budgetsCollection = await getBudgetsCollection();
    const transactionsCollection = await getTransactionsCollection();

    const budgets = await budgetsCollection.find({ month, year }).toArray();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const transactions = await transactionsCollection
      .find({
        date: { $gte: startDate, $lte: endDate },
      })
      .toArray();

    // The _id in the documents from the DB needs to be stringified
    const budgetSummaries = calculateBudgetVsActual(
      budgets.map(b => ({ ...b, _id: b._id.toString() })),
      transactions.map(t => ({ ...t, _id: t._id.toString() }))
    );

    const insights = generateSpendingInsights(
      budgetSummaries,
      transactions.map(t => ({ ...t, _id: t._id.toString() }))
    );

    return successResponse({
      budgetSummaries,
      insights,
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return errorResponse('Failed to fetch analytics data');
  }
}

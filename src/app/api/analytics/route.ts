import { NextRequest } from 'next/server';
import { getTransactionsCollection } from '@/lib/db/mongodb';
import {
  successResponse,
  errorResponse,
  databaseErrorResponse,
  parseSearchParams,
} from '@/lib/api/response';
import { aggregateTransactionsByMonth } from '@/lib/utils/analytics';

export async function GET(request: NextRequest) {
  try {
    const url = request.url;
    const params = parseSearchParams(url);
    
    const dateFrom = params.dateFrom;
    const dateTo = params.dateTo;

    const collection = await getTransactionsCollection();

    const query: Record<string, unknown> = {};

    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) {
        (query.date as Record<string, unknown>).$gte = new Date(dateFrom);
      }
      if (dateTo) {
        (query.date as Record<string, unknown>).$lte = new Date(dateTo);
      }
    }

    const transactions = await collection.find(query).toArray();
    const aggregatedData = aggregateTransactionsByMonth(transactions);

    return successResponse(aggregatedData);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return databaseErrorResponse('Failed to fetch analytics data');
  }
} 
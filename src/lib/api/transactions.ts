import { Transaction } from '@/types/transaction';

const API_BASE_URL = '/api/transactions';

async function handleResponse<T>(response: Response): Promise<T> {
  const res = await response.json();
  if (!response.ok) {
    throw new Error(res.error || 'Something went wrong');
  }
  return res.data;
}

interface FetchTransactionsParams {
  month: number;
  year: number;
}

/**
 * Fetches transactions for a specific month and year.
 * @param params - The month and year to fetch transactions for.
 * @returns A promise that resolves to an array of transactions.
 */
export async function fetchTransactions({
  month,
  year,
}: FetchTransactionsParams): Promise<Transaction[]> {
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0).toISOString();
    
    const response = await fetch(`${API_BASE_URL}?dateFrom=${startDate}&dateTo=${endDate}&limit=1000`);
    const result = await handleResponse<{ transactions: Transaction[] }>(response);
    return result.transactions;
} 
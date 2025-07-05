import { Transaction, TransactionDocument } from '@/types/transaction';
import { format } from 'date-fns';

export interface MonthlyAggregation {
  month: string;
  income: number;
  expenses: number;
}

export interface CategoryAggregation {
  category: string;
  total: number;
}

export const aggregateTransactionsByMonth = (
  transactions: TransactionDocument[]
): MonthlyAggregation[] => {
  const monthlyData: { [key: string]: { income: number; expenses: number } } =
    {};

  transactions.forEach(transaction => {
    const monthKey = format(new Date(transaction.date), 'yyyy-MM');
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expenses: 0 };
    }
    if (transaction.amount > 0) {
      monthlyData[monthKey].income += transaction.amount;
    } else {
      monthlyData[monthKey].expenses += Math.abs(transaction.amount);
    }
  });

  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      ...data,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

export const aggregateExpensesByCategory = (
  transactions: Transaction[]
): CategoryAggregation[] => {
  const categoryData: { [key: string]: number } = {};

  transactions
    .filter(t => t.amount < 0) // Only consider expenses
    .forEach(transaction => {
      const category = transaction.category || 'Other';
      const amount = Math.abs(transaction.amount);

      if (!categoryData[category]) {
        categoryData[category] = 0;
      }
      categoryData[category] += amount;
    });

  return Object.entries(categoryData)
    .map(([category, total]) => ({
      category,
      total,
    }))
    .sort((a, b) => b.total - a.total); // Sort by total descending
};

export const getMonthlySummary = (
  transactions: Transaction[]
): { totalIncome: number; totalExpenses: number; net: number } => {
  const now = new Date();
  const currentMonthTransactions = transactions.filter(
    t =>
      new Date(t.date).getMonth() === now.getMonth() &&
      new Date(t.date).getFullYear() === now.getFullYear()
  );

  return currentMonthTransactions.reduce(
    (acc, transaction) => {
      if (transaction.amount > 0) {
        acc.totalIncome += transaction.amount;
      } else {
        acc.totalExpenses += Math.abs(transaction.amount);
      }
      acc.net = acc.totalIncome - acc.totalExpenses;
      return acc;
    },
    { totalIncome: 0, totalExpenses: 0, net: 0 }
  );
};

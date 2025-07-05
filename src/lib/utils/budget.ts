import { Budget } from '@/types/budget';
import { Transaction } from '@/types/transaction';
import { TransactionCategory } from '../constants/categories';

export type BudgetStatus = 'under' | 'over' | 'on-track' | 'not-started';

export interface BudgetSummary extends Budget {
  spent: number;
  remaining: number;
  percentage: number;
  status: BudgetStatus;
}

/**
 * Gets the current month and year.
 * @returns An object with the current month (1-12) and year.
 */
export function getCurrentMonthYear(): { month: number; year: number } {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}

/**
 * Calculates the percentage of a value in relation to a total.
 * @param value - The current value.
 * @param total - The total value.
 * @returns The calculated percentage.
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Determines the budget status based on spending.
 * @param spent - The amount spent.
 * @param total - The total budget amount.
 * @returns The budget status.
 */
export function getBudgetStatus(spent: number, total: number): BudgetStatus {
  if (spent <= 0) return 'not-started';
  if (spent > total) return 'over';
  const percentage = calculatePercentage(spent, total);
  if (percentage >= 90) return 'on-track';
  return 'under';
}

/**
 * Calculates budget vs. actual spending for all budgets.
 * @param budgets - An array of budgets.
 * @param transactions - An array of transactions for the same period.
 * @returns An array of budget summaries with spending information.
 */
export function calculateBudgetVsActual(
  budgets: Budget[],
  transactions: Transaction[]
): BudgetSummary[] {
  const spendingByCategory: { [key in TransactionCategory]?: number } = {};

  transactions
    .filter(t => t.amount < 0) // Only expenses
    .forEach(t => {
      const category = t.category;
      spendingByCategory[category] = (spendingByCategory[category] || 0) + Math.abs(t.amount);
    });

  return budgets.map(budget => {
    const spent = spendingByCategory[budget.category] || 0;
    const remaining = budget.amount - spent;
    const percentage = calculatePercentage(spent, budget.amount);
    const status = getBudgetStatus(spent, budget.amount);

    return {
      ...budget,
      spent,
      remaining,
      percentage,
      status,
    };
  });
} 
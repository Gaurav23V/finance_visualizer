import { BudgetSummary } from '@/lib/utils/budget';
import { Transaction } from '@/types/transaction';
import { TransactionCategory } from '../constants/categories';

export type InsightType = 'warning' | 'success' | 'info';

export interface Insight {
  type: InsightType;
  title: string;
  description: string;
  value?: number;
  category?: TransactionCategory;
}

/**
 * Generates spending insights based on budget and transaction data.
 * @param budgetSummaries - An array of budget summaries with actual spending.
 * @param transactions - An array of transactions for the same period.
 * @returns An array of generated insights.
 */
export function generateSpendingInsights(
  budgetSummaries: BudgetSummary[],
  transactions: Transaction[]
): Insight[] {
  const insights: Insight[] = [];

  // Insight 1: Categories over budget
  const overBudget = budgetSummaries.filter(b => b.status === 'over');
  if (overBudget.length > 0) {
    overBudget.forEach(b => {
      insights.push({
        type: 'warning',
        title: `${b.category} Over Budget`,
        description: `You have overspent by ${Math.abs(b.remaining).toFixed(2)} in the ${b.category} category.`,
        value: b.remaining,
        category: b.category,
      });
    });
  }

  // Insight 2: Categories under budget (potential savings)
  const underBudget = budgetSummaries.filter(
    b => b.remaining > 0 && b.spent > 0
  );
  if (underBudget.length > 0) {
    underBudget.forEach(b => {
      insights.push({
        type: 'success',
        title: `Good Job on ${b.category}!`,
        description: `You are under budget by ${b.remaining.toFixed(2)} for ${b.category}. Keep it up!`,
        value: b.remaining,
        category: b.category,
      });
    });
  }

  // Insight 3: Highest spending category vs budget
  if (budgetSummaries.length > 0) {
    const highestSpending = [...budgetSummaries].sort(
      (a, b) => b.spent - a.spent
    )[0];
    insights.push({
      type: 'info',
      title: 'Highest Spending Category',
      description: `Your highest spending was in the ${highestSpending.category} category, with a total of ${highestSpending.spent.toFixed(2)} spent.`,
      value: highestSpending.spent,
      category: highestSpending.category,
    });
  }

  // Insight 4: Overall budget utilization
  const totalBudgeted = budgetSummaries.reduce((acc, b) => acc + b.amount, 0);
  const totalSpent = budgetSummaries.reduce((acc, b) => acc + b.spent, 0);
  if (totalBudgeted > 0) {
    const utilization = Math.round((totalSpent / totalBudgeted) * 100);
    insights.push({
      type: 'info',
      title: 'Overall Budget Utilization',
      description: `You have used ${utilization}% of your total budget for the month.`,
      value: utilization,
    });
  }

  // Insight 5: Categories with spending but no budget
  const budgetedCategories = budgetSummaries.map(b => b.category);
  const spendingWithoutBudget: { [key in TransactionCategory]?: number } = {};

  transactions
    .filter(t => t.amount < 0 && !budgetedCategories.includes(t.category))
    .forEach(t => {
      spendingWithoutBudget[t.category] =
        (spendingWithoutBudget[t.category] || 0) + Math.abs(t.amount);
    });

  Object.entries(spendingWithoutBudget).forEach(([category, amount]) => {
    insights.push({
      type: 'info',
      title: 'Unbudgeted Spending',
      description: `You spent ${amount.toFixed(2)} on ${category}, which is not budgeted. Consider setting a budget for it.`,
      value: amount,
      category: category as TransactionCategory,
    });
  });

  return insights;
}

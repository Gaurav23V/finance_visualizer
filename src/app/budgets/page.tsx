'use client';

import * as React from 'react';
import { useToast } from '@/lib/hooks/use-toast';
import { Budget } from '@/types/budget';
import {
  fetchBudgets,
  createOrUpdateBudget,
  deleteBudget,
} from '@/lib/api/budgets';
import {
  calculateBudgetVsActual,
  getCurrentMonthYear,
  BudgetSummary,
} from '@/lib/utils/budget';
import { generateSpendingInsights, Insight } from '@/lib/utils/insights';
import { MonthYearSelector } from '@/app/components/ui/MonthYearSelector';
import { BudgetForm } from '@/app/components/forms/BudgetForm';
import { BudgetList } from '@/app/components/BudgetList';
import { BudgetListSkeleton } from '@/app/components/skeletons/BudgetListSkeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils/format';
import { BudgetComparisonChart } from '../components/charts/BudgetComparisonChart';
import { InsightsCard } from '../components/InsightsCard';

export default function BudgetsPage() {
  const { toast } = useToast();
  const { month: currentMonth, year: currentYear } = getCurrentMonthYear();

  const [month, setMonth] = React.useState(currentMonth);
  const [year, setYear] = React.useState(currentYear);
  const [budgets, setBudgets] = React.useState<Budget[]>([]);
  const [budgetSummaries, setBudgetSummaries] = React.useState<BudgetSummary[]>([]);
  const [insights, setInsights] = React.useState<Insight[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = React.useState<Budget | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/analytics?month=${month}&year=${year}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load data');
        }

        setBudgetSummaries(data.data.budgetSummaries);
        setInsights(data.data.insights);
        // Extracting raw budgets for the form
        setBudgets(data.data.budgetSummaries.map(({spent, remaining, percentage, status, ...budget}) => budget));

      } catch (e: any) {
        setError(e.message || 'Failed to load budget data.');
        toast({
          title: 'Error',
          description: e.message || 'Failed to load budget data.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [month, year, toast]);

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createOrUpdateBudget(data);
      toast({
        title: 'Success',
        description: `Budget for ${data.category} has been ${selectedBudget ? 'updated' : 'created'}.`,
      });
      setSelectedBudget(undefined);
      // Refresh data by re-calling loadData
      const response = await fetch(`/api/analytics?month=${month}&year=${year}`);
      const result = await response.json();
      setBudgetSummaries(result.data.budgetSummaries);
      setInsights(result.data.insights);
      setBudgets(result.data.budgetSummaries.map(({spent, remaining, percentage, status, ...budget}) => budget));
    } catch (e: any) {
      toast({
        title: 'Error',
        description: e.message || 'Failed to save budget.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (budget: Budget) => {
    setSelectedBudget(budget);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDelete = async (id: string) => {
    try {
        await deleteBudget(id);
        toast({
            title: 'Success',
            description: 'Budget has been deleted.',
        });
        setBudgets(budgets.filter(b => b._id !== id));
    } catch (e: any) {
        toast({
            title: 'Error',
            description: e.message || 'Failed to delete budget.',
            variant: 'destructive',
        });
    }
  };

  const totalBudgeted = budgetSummaries.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgetSummaries.reduce((sum, b) => sum + b.spent, 0);

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 md:mb-0">
          Manage Budgets
        </h1>
        <MonthYearSelector
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </header>

      <section className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
            <CardHeader>
                <CardTitle>Total Budgeted</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{formatCurrency(totalBudgeted)}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Remaining</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{formatCurrency(totalBudgeted - totalSpent)}</p>
            </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
        <div className="lg:col-span-3">
          <BudgetComparisonChart data={budgetSummaries} />
        </div>
        <div className="lg:col-span-2">
          <InsightsCard insights={insights} />
        </div>
      </section>

      <section className="mb-8">
        <Card>
            <CardHeader>
                <CardTitle>{selectedBudget ? 'Edit Budget' : 'Create New Budget'}</CardTitle>
            </CardHeader>
            <CardContent>
                <BudgetForm
                    onSubmit={handleFormSubmit}
                    initialData={selectedBudget}
                    isSubmitting={isSubmitting}
                    month={month}
                    year={year}
                    existingCategories={budgets.map(b => b.category)}
                />
            </CardContent>
        </Card>
      </section>

      <section>
        {loading ? (
          <BudgetListSkeleton />
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <BudgetList budgets={budgetSummaries} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </section>
    </div>
  );
} 
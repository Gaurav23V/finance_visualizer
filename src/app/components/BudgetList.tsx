'use client';

import { Budget, BudgetSummary, BudgetStatus } from '@/lib/utils/budget';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

interface BudgetListProps {
  budgets: BudgetSummary[];
  onEdit: (budget: Budget) => void;
  onDelete: (id: string) => void;
}

const statusColors: { [key in BudgetStatus]: string } = {
    'under': 'text-green-600',
    'on-track': 'text-yellow-600',
    'over': 'text-red-600',
    'not-started': 'text-gray-500',
};

const progressColors: { [key in BudgetStatus]: string } = {
    'under': 'bg-green-500',
    'on-track': 'bg-yellow-500',
    'over': 'bg-red-500',
    'not-started': 'bg-gray-300',
};

export function BudgetList({ budgets, onEdit, onDelete }: BudgetListProps) {
  if (budgets.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No budgets set for this period.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map(budget => (
        <Card key={budget._id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">{budget.category}</CardTitle>
            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(budget)}>
                    <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(budget._id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(budget.amount)}</div>
            <p className={cn("text-xs", statusColors[budget.status])}>
              {formatCurrency(budget.spent)} spent so far
            </p>
            <Progress value={budget.percentage} className="mt-4 h-2" indicatorClassName={progressColors[budget.status]} />
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-gray-500">
            <span>{budget.percentage}% used</span>
            <span>{formatCurrency(budget.remaining)} remaining</span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 
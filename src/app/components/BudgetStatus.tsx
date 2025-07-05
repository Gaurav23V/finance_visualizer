'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format';
import { Progress } from '@/components/ui/progress';

interface BudgetStatusProps {
  spent: number;
  total: number;
}

export function BudgetStatus({ spent, total }: BudgetStatusProps) {
  if (total === 0) {
    return (
        <div className="text-center p-4">
            <p className="text-sm text-muted-foreground">No budget set for this period.</p>
        </div>
    );
  }
  const percentage = Math.round((spent / total) * 100);

  let statusColor = 'bg-green-500';
  if (percentage > 100) {
    statusColor = 'bg-red-500';
  } else if (percentage > 80) {
    statusColor = 'bg-yellow-500';
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-muted-foreground">
          {formatCurrency(spent)} / {formatCurrency(total)}
        </span>
        <span className="text-sm font-bold">{percentage}%</span>
      </div>
      <Progress value={percentage > 100 ? 100 : percentage} indicatorClassName={statusColor} />
      {percentage > 100 && (
        <p className="text-xs text-red-500 mt-1 text-right">
          You are {formatCurrency(spent - total)} over budget.
        </p>
      )}
    </div>
  );
} 
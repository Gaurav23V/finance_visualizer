'use client';

import { CategoryAggregation } from '@/lib/utils/analytics';
import { formatCurrency } from '@/lib/utils/format';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ErrorMessage } from '@/app/components/ui/ErrorMessage';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryBreakdownCardProps {
  data: (CategoryAggregation & { percentage: number })[];
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function CategoryBreakdownCard({
  data,
  isLoading,
  error,
  onRetry,
}: CategoryBreakdownCardProps) {
  if (isLoading) {
    return <CategoryBreakdownSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>
            A breakdown of your spending by category.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorMessage message={error} onRetry={onRetry} />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>
            A breakdown of your spending by category.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            No expense transactions for this period.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>
          A breakdown of your spending by category.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {data.map(item => (
            <div key={item.category}>
              <div className='flex justify-between mb-1'>
                <span className='text-sm font-medium'>{item.category}</span>
                <span className='text-sm font-medium'>
                  {formatCurrency(item.total)}
                </span>
              </div>
              <div className='flex items-center'>
                <Progress value={item.percentage} className='w-[85%]' />
                <span className='text-xs text-muted-foreground ml-2'>
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CategoryBreakdownSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>
          A breakdown of your spending by category.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='space-y-2'>
              <div className='flex justify-between'>
                <Skeleton className='h-4 w-1/3' />
                <Skeleton className='h-4 w-1/4' />
              </div>
              <Skeleton className='h-2 w-full' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

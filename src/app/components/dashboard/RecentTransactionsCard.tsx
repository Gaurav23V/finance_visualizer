'use client';

import { Transaction } from '@/types/transaction';
import { formatCurrency, formatDate, getAmountColor } from '@/lib/utils/format';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { ErrorMessage } from '@/app/components/ui/ErrorMessage';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface RecentTransactionsCardProps {
  transactions: Transaction[];
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function RecentTransactionsCard({
  transactions,
  isLoading,
  error,
  onRetry,
}: RecentTransactionsCardProps) {
  if (isLoading) {
    return <RecentTransactionsSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <ErrorMessage message={error} onRetry={onRetry} />
        </CardContent>
      </Card>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activities.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>
            No transactions found for this period.
          </p>
        </CardContent>
        <CardFooter>
          <Link href='/transactions' passHref className='w-full'>
            <Button variant='outline' className='w-full'>
              Add a Transaction
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activities.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {transactions.map(t => (
            <div key={t._id} className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <div className='flex flex-col'>
                  <span className='font-medium'>{t.description}</span>
                  <span className='text-sm text-muted-foreground'>
                    {formatDate(t.date)}
                  </span>
                </div>
              </div>
              <div className='flex flex-col items-end'>
                <span className={`font-bold ${getAmountColor(t.amount)}`}>
                  {formatCurrency(t.amount)}
                </span>
                <Badge variant='secondary'>{t.category}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Link href='/transactions' passHref className='w-full'>
          <Button variant='outline' className='w-full'>
            View All
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function RecentTransactionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activities.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-3 w-24' />
                </div>
              </div>
              <div className='flex flex-col items-end space-y-2'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-3 w-16' />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className='h-10 w-full' />
      </CardFooter>
    </Card>
  );
}

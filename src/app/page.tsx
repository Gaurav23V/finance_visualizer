'use client';

import { useTransactions } from '@/hooks/useTransactions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMonthlySummary } from '@/lib/utils/analytics';
import { formatCurrency } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const { transactions, isLoading } = useTransactions();
  const monthlySummary = getMonthlySummary(transactions);

  return (
    <div className='container mx-auto p-4 md:p-8 text-center'>
      <h1 className='text-4xl font-bold mb-4'>Welcome to Finance Visualizer</h1>
      <p className='text-lg text-muted-foreground mb-8'>
        Your personal finance tracking and visualization solution.
      </p>

      {isLoading ? (
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto'>
          <Skeleton className='h-36' />
          <Skeleton className='h-36' />
          <Skeleton className='h-36' />
        </div>
      ) : transactions.length > 0 ? (
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto mb-8'>
          <Card>
            <CardHeader>
              <CardTitle>Current Month Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-bold text-green-600'>
                {formatCurrency(monthlySummary.totalIncome)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Current Month Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-bold text-red-600'>
                {formatCurrency(monthlySummary.totalExpenses)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-bold'>{transactions.length}</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className='mb-8'>
          <p className='text-muted-foreground mb-4'>
            You have no transactions yet.
          </p>
          <Link href='/transactions' passHref>
            <Button>Add Your First Transaction</Button>
          </Link>
        </div>
      )}

      <div className='space-x-4'>
        <Link href='/dashboard' passHref>
          <Button variant='outline'>Go to Dashboard</Button>
        </Link>
        <Link href='/transactions' passHref>
          <Button variant='outline'>Manage Transactions</Button>
        </Link>
      </div>
    </div>
  );
}

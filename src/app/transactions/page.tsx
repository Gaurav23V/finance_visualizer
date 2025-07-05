'use client';

import * as React from 'react';
import {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from '@/types/transaction';
import { TransactionForm } from '@/app/components/forms/TransactionForm';
import { TransactionList } from '@/app/components/TransactionList';
import { TransactionListSkeleton } from '@/app/components/skeletons/TransactionListSkeleton';
import { EditTransactionDialog } from '@/app/components/EditTransactionDialog';
import { DeleteConfirmDialog } from '@/app/components/DeleteConfirmDialog';
import { ErrorMessage } from '@/app/components/ui/ErrorMessage';

export default function TransactionsPage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const [editingTransaction, setEditingTransaction] =
    React.useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    React.useState<Transaction | null>(null);

  const fetchTransactions = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch transactions');
      }
      setTransactions(data.data.transactions);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleCreate = async (
    values: CreateTransactionRequest | UpdateTransactionRequest
  ) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create transaction');
      }
      await fetchTransactions(); // Refetch all transactions
    } catch (e: unknown) {
      if (e instanceof Error) {
        setSubmitError(e.message);
      } else {
        setSubmitError('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (values: UpdateTransactionRequest) => {
    if (!editingTransaction) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch(
        `/api/transactions/${editingTransaction._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update transaction');
      }
      await fetchTransactions(); // Refetch all transactions
      setEditingTransaction(null);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setSubmitError(e.message);
      } else {
        setSubmitError('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingTransaction) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch(
        `/api/transactions/${deletingTransaction._id}`,
        {
          method: 'DELETE',
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete transaction');
      }
      await fetchTransactions(); // Refetch all transactions
      setDeletingTransaction(null);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setSubmitError(e.message);
      } else {
        setSubmitError('An unknown error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='container mx-auto p-4 md:p-8'>
      <h1 className='text-3xl font-bold mb-8'>Transactions</h1>

      <div className='mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>Add New Transaction</h2>
        <TransactionForm
          onSubmit={handleCreate}
          isSubmitting={
            isSubmitting && !editingTransaction && !deletingTransaction
          }
        />
        {submitError && !editingTransaction && !deletingTransaction && (
          <div className='mt-4'>
            <ErrorMessage message={submitError} />
          </div>
        )}
      </div>

      <div>
        <h2 className='text-2xl font-semibold mb-4'>History</h2>
        {isLoading ? (
          <TransactionListSkeleton />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchTransactions} />
        ) : (
          <TransactionList
            transactions={transactions}
            onEdit={setEditingTransaction}
            onDelete={setDeletingTransaction}
          />
        )}
      </div>

      <EditTransactionDialog
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
        onUpdate={handleUpdate}
        isSubmitting={isSubmitting && !!editingTransaction}
        error={submitError && !!editingTransaction ? submitError : null}
      />

      <DeleteConfirmDialog
        isOpen={!!deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
        onConfirm={handleDelete}
        transaction={deletingTransaction}
        isDeleting={isSubmitting && !!deletingTransaction}
        error={submitError && !!deletingTransaction ? submitError : null}
      />
    </div>
  );
}

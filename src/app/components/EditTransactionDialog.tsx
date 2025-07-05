'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TransactionForm } from '@/app/components/forms/TransactionForm';
import { Transaction, UpdateTransactionRequest } from '@/types/transaction';
import { ErrorMessage } from '@/app/components/ui/ErrorMessage';

interface EditTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onUpdate: (values: UpdateTransactionRequest) => Promise<void>;
  isSubmitting: boolean;
  error?: string | null;
}

export function EditTransactionDialog({
  isOpen,
  onClose,
  transaction,
  onUpdate,
  isSubmitting,
  error,
}: EditTransactionDialogProps) {
  if (!transaction) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Update the details of your transaction.
          </DialogDescription>
        </DialogHeader>
        {error && <ErrorMessage message={error} />}
        <TransactionForm
          initialData={transaction}
          onSubmit={onUpdate}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}

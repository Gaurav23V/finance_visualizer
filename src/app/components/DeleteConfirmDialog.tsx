'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types/transaction';
import { LoadingSpinner } from '@/app/components/ui/LoadingSpinner';
import { ErrorMessage } from './ui/ErrorMessage';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: Transaction | null;
  isDeleting: boolean;
  error?: string | null;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  isDeleting,
  error,
}: DeleteConfirmDialogProps) {
  if (!transaction) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            transaction: <br />
            <strong>&quot;{transaction.description}&quot;</strong> for <strong>{transaction.amount}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && <ErrorMessage message={error} />}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting && <LoadingSpinner size={16} className="mr-2" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 
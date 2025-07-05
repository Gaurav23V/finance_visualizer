import { TransactionDocument, Transaction } from '@/types/transaction';
import { BudgetDocument, Budget } from '@/types/budget';

// Convert MongoDB document to API response format
export function formatTransactionResponse(
  doc: TransactionDocument | null
): Transaction | null {
  if (!doc) return null;

  return {
    ...doc,
    _id: doc._id.toString(),
    date: doc.date,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// Convert Budget MongoDB document to API response format
export function formatBudgetResponse(
  doc: BudgetDocument | null
): Budget | null {
  if (!doc) return null;

  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

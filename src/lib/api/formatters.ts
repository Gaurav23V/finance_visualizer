import { TransactionDocument, Transaction } from '@/types/transaction';

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

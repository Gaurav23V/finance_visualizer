import { ObjectId } from 'mongodb';
import { TransactionCategory } from '@/lib/constants/categories';

// Core Transaction interface for MongoDB documents
export interface Transaction {
  _id: string; // MongoDB ObjectId as string
  amount: number; // Positive for income, negative for expenses
  date: Date;
  description: string;
  category: TransactionCategory;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction document as stored in MongoDB (with ObjectId)
export interface TransactionDocument extends Omit<Transaction, '_id'> {
  _id: ObjectId;
}

// Transaction creation payload (without generated fields)
export interface CreateTransactionRequest {
  amount: number;
  date: string | Date; // Accept both string and Date for flexibility
  description: string;
  category: TransactionCategory;
}

// Transaction update payload (all fields optional except validation)
export interface UpdateTransactionRequest {
  amount?: number;
  date?: string | Date;
  description?: string;
  category?: TransactionCategory;
}

// API Response types
export interface TransactionResponse {
  success: boolean;
  data?: Transaction;
  error?: string;
}

export interface TransactionsResponse {
  success: boolean;
  data?: Transaction[];
  error?: string;
  count?: number;
}

// Query parameters for filtering transactions
export interface TransactionQueryParams {
  limit?: number;
  skip?: number;
  sortBy?: 'date' | 'amount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Transaction statistics
export interface TransactionStats {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
  averageTransaction: number;
}

// Validation error type
export interface ValidationError {
  field: string;
  message: string;
}

// Complete API error response
export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: ValidationError[];
  code?: string;
}

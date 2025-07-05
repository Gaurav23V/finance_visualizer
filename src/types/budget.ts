import { TransactionCategory } from '@/lib/constants/categories';
import { ObjectId } from 'mongodb';

// Core Budget interface for MongoDB documents
export interface Budget {
  _id: string; // MongoDB ObjectId as string
  category: TransactionCategory;
  amount: number; // The budget limit, always positive
  month: number; // 1-12
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

// Budget document as stored in MongoDB (with ObjectId)
export interface BudgetDocument extends Omit<Budget, '_id'> {
  _id: ObjectId;
}

// Budget creation/update payload
export interface CreateBudgetRequest {
  category: TransactionCategory;
  amount: number;
  month: number;
  year: number;
}

// API Response types
export interface BudgetResponse {
  success: boolean;
  data?: Budget;
  error?: string;
}

export interface BudgetsResponse {
  success: boolean;
  data?: Budget[];
  error?: string;
} 
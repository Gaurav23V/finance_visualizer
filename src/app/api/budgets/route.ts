import { NextRequest } from 'next/server';
import { getBudgetsCollection } from '@/lib/db/mongodb';
import {
  successResponse,
  databaseErrorResponse,
  parseSearchParams,
  HTTP_STATUS,
  validationErrorResponse,
  ValidationHelper,
  parseRequestBody,
  errorResponse,
} from '@/lib/api/response';
import { formatBudgetResponse } from '@/lib/api/formatters';
import { CreateBudgetRequest, BudgetDocument } from '@/types/budget';
import { TRANSACTION_CATEGORIES } from '@/lib/constants/categories';

// GET /api/budgets - Get all budgets with optional filtering
export async function GET(request: NextRequest) {
  try {
    const url = request.url;
    const params = parseSearchParams(url);
    const validator = new ValidationHelper();

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const year = params.year ? parseInt(params.year) : currentYear;
    const month = params.month ? parseInt(params.month) : currentMonth;

    // Validate year and month
    validator.isNumber(year, 'year');
    validator.isNumber(month, 'month');

    if (validator.hasErrors()) {
      return validationErrorResponse(validator.getErrors());
    }

    if (month < 1 || month > 12) {
      validator.addError('month', 'Month must be between 1 and 12');
    }

    if (year < 2000 || year > 2100) {
        validator.addError('year', 'Year must be between 2000 and 2100');
    }

    if (validator.hasErrors()) {
      return validationErrorResponse(validator.getErrors());
    }

    const collection = await getBudgetsCollection();

    // Build MongoDB query
    const query: Record<string, unknown> = {
      year,
      month,
    };

    // Execute query
    const budgets = await collection
      .find(query)
      .sort({ category: 1 }) // Sort by category name alphabetically
      .toArray();

    // Format budgets
    const formattedBudgets = budgets
      .map(formatBudgetResponse)
      .filter(b => b !== null);

    return successResponse(
      formattedBudgets,
      HTTP_STATUS.OK,
      'Budgets retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return databaseErrorResponse('Failed to fetch budgets');
  }
}

// POST /api/budgets - Create or update a budget (upsert)
export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<CreateBudgetRequest>(request);

    if (!body) {
      return errorResponse(
        'Invalid JSON in request body',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Validate request body
    const validator = new ValidationHelper();

    // Required fields
    validator.required(body.category, 'category');
    validator.required(body.amount, 'amount');
    validator.required(body.month, 'month');
    validator.required(body.year, 'year');

    // Return validation errors if any
    if (validator.hasErrors()) {
      return validationErrorResponse(validator.getErrors());
    }
    
    // Further validation
    validator.isIn(body.category, TRANSACTION_CATEGORIES, 'category');
    validator.isNumber(body.amount, 'amount');
    validator.isNumber(body.month, 'month');
    validator.isNumber(body.year, 'year');

    if (body.amount <= 0) {
      validator.addError('amount', 'Amount must be positive');
    }
    if (body.month < 1 || body.month > 12) {
      validator.addError('month', 'Month must be between 1 and 12');
    }
    if (body.year < 2000 || body.year > 2100) {
      validator.addError('year', 'Year must be between 2000 and 2100');
    }

    // Return validation errors if any
    if (validator.hasErrors()) {
      return validationErrorResponse(validator.getErrors());
    }

    const collection = await getBudgetsCollection();
    const now = new Date();

    const filter = {
      category: body.category,
      month: body.month,
      year: body.year,
    };

    const update: Omit<BudgetDocument, '_id'> = {
      ...filter,
      amount: body.amount,
      updatedAt: now,
      createdAt: now, // Will be set on insert, ignored on update
    };

    const result = await collection.updateOne(
      filter,
      { 
        $set: { amount: body.amount, updatedAt: now },
        $setOnInsert: { createdAt: now, category: body.category, month: body.month, year: body.year }
      },
      { upsert: true }
    );

    if (!result.upsertedId && result.matchedCount === 0) {
      return databaseErrorResponse('Failed to create or update budget');
    }
    
    const budgetId = result.upsertedId ? result.upsertedId : (await collection.findOne(filter))?._id;

    if (!budgetId) {
        return databaseErrorResponse(
            'Budget created/updated but could not be retrieved'
        );
    }

    const budget = await collection.findOne({ _id: budgetId });

    const httpStatus = result.upsertedId
      ? HTTP_STATUS.CREATED
      : HTTP_STATUS.OK;
    const message = result.upsertedId
      ? 'Budget created successfully'
      : 'Budget updated successfully';

    return successResponse(formatBudgetResponse(budget), httpStatus, message);

  } catch (error) {
    console.error('Error creating/updating budget:', error);
    return databaseErrorResponse('Failed to create or update budget');
  }
} 
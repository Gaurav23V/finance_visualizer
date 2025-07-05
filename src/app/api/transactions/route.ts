import { NextRequest } from 'next/server';
import { getTransactionsCollection } from '@/lib/db/mongodb';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  databaseErrorResponse,
  methodNotAllowedResponse,
  ValidationHelper,
  parseRequestBody,
  parseSearchParams,
  formatTransactionResponse,
  HTTP_STATUS,
} from '@/lib/api/response';
import {
  CreateTransactionRequest,
  TransactionDocument,
} from '@/types/transaction';

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const body = await parseRequestBody<CreateTransactionRequest>(request);

    if (!body) {
      return errorResponse(
        'Invalid JSON in request body',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Validate request body
    const validator = new ValidationHelper();

    // Required field validation
    validator.required(body.amount, 'amount');
    validator.required(body.date, 'date');
    validator.required(body.description, 'description');

    // Type validation
    if (body.amount !== undefined) {
      validator.isNumber(body.amount, 'amount');
    }

    if (body.date !== undefined) {
      validator.isValidDate(body.date, 'date');
    }

    if (body.description !== undefined) {
      validator.isString(body.description, 'description', 1, 500);
    }

    // Return validation errors if any
    if (validator.hasErrors()) {
      return validationErrorResponse(validator.getErrors());
    }

    const collection = await getTransactionsCollection();
    const now = new Date();

    // Create transaction document
    const transactionDoc: Omit<TransactionDocument, '_id'> = {
      amount: body.amount,
      date: new Date(body.date),
      description: body.description.trim(),
      createdAt: now,
      updatedAt: now,
    };

    // Insert transaction
    const result = await collection.insertOne(
      transactionDoc as TransactionDocument
    );

    if (!result.insertedId) {
      return databaseErrorResponse('Failed to create transaction');
    }

    // Fetch the created transaction
    const createdTransaction = await collection.findOne({
      _id: result.insertedId,
    });

    if (!createdTransaction) {
      return databaseErrorResponse(
        'Transaction created but could not be retrieved'
      );
    }

    // Format response
    const formattedTransaction = formatTransactionResponse(createdTransaction);

    return successResponse(
      formattedTransaction,
      HTTP_STATUS.CREATED,
      'Transaction created successfully'
    );
  } catch (error) {
    console.error('Error creating transaction:', error);
    return databaseErrorResponse('Failed to create transaction');
  }
}

// GET /api/transactions - Get all transactions with optional filtering
export async function GET(request: NextRequest) {
  try {
    const url = request.url;
    const params = parseSearchParams(url);

    // Parse query parameters with defaults
    const limit = params.limit ? parseInt(params.limit) : 50;
    const skip = params.skip ? parseInt(params.skip) : 0;
    const sortBy = (params.sortBy as 'date' | 'amount' | 'createdAt') || 'date';
    const sortOrder = (params.sortOrder as 'asc' | 'desc') || 'desc';
    const dateFrom = params.dateFrom;
    const dateTo = params.dateTo;
    const minAmount = params.minAmount
      ? parseFloat(params.minAmount)
      : undefined;
    const maxAmount = params.maxAmount
      ? parseFloat(params.maxAmount)
      : undefined;

    const collection = await getTransactionsCollection();

    // Build MongoDB query
    const query: Record<string, unknown> = {};

    // Date range filter
    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) {
        (query.date as Record<string, unknown>).$gte = new Date(dateFrom);
      }
      if (dateTo) {
        (query.date as Record<string, unknown>).$lte = new Date(dateTo);
      }
    }

    // Amount range filter
    if (minAmount !== undefined || maxAmount !== undefined) {
      query.amount = {};
      if (minAmount !== undefined) {
        (query.amount as Record<string, unknown>).$gte = minAmount;
      }
      if (maxAmount !== undefined) {
        (query.amount as Record<string, unknown>).$lte = maxAmount;
      }
    }

    // Build sort object
    const sortOrderValue = sortOrder === 'asc' ? 1 : -1;
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrderValue;

    // Execute query with pagination
    const transactions = await collection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const totalCount = await collection.countDocuments(query);

    // Format transactions
    const formattedTransactions = transactions.map(formatTransactionResponse);

    return successResponse(
      {
        transactions: formattedTransactions,
        pagination: {
          total: totalCount,
          limit: limit,
          skip: skip,
          hasMore: skip + limit < totalCount,
        },
      },
      HTTP_STATUS.OK,
      'Transactions retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return databaseErrorResponse('Failed to fetch transactions');
  }
}

// Handle unsupported methods
export async function PUT() {
  return methodNotAllowedResponse(['GET', 'POST']);
}

export async function DELETE() {
  return methodNotAllowedResponse(['GET', 'POST']);
}

export async function PATCH() {
  return methodNotAllowedResponse(['GET', 'POST']);
}

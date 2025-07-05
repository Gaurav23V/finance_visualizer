import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { getTransactionsCollection } from '@/lib/db/mongodb';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  databaseErrorResponse,
  notFoundResponse,
  invalidIdResponse,
  methodNotAllowedResponse,
  ValidationHelper,
  parseRequestBody,
  HTTP_STATUS,
} from '@/lib/api/response';
import { formatTransactionResponse } from '@/lib/api/formatters';
import {
  UpdateTransactionRequest,
  TransactionDocument,
} from '@/types/transaction';
import { TRANSACTION_CATEGORIES } from '@/lib/constants/categories';

// PUT /api/transactions/[id] - Update transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    const validator = new ValidationHelper();
    if (!validator.isValidObjectId(id, 'id')) {
      return invalidIdResponse('Invalid transaction ID format');
    }

    const body = await parseRequestBody<UpdateTransactionRequest>(request);

    if (!body) {
      return errorResponse(
        'Invalid JSON in request body',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Validate update data
    const updateValidator = new ValidationHelper();

    // At least one field must be provided for update
    if (!body.amount && !body.date && !body.description && !body.category) {
      updateValidator.addError(
        'body',
        'At least one field must be provided for update'
      );
    }

    // Type validation for provided fields
    if (body.amount !== undefined) {
      updateValidator.isNumber(body.amount, 'amount');
    }

    if (body.date !== undefined) {
      updateValidator.isValidDate(body.date, 'date');
    }

    if (body.description !== undefined) {
      updateValidator.isString(body.description, 'description', 1, 500);
    }

    if (body.category !== undefined) {
      updateValidator.isIn(body.category, TRANSACTION_CATEGORIES, 'category');
    }

    // Return validation errors if any
    if (updateValidator.hasErrors()) {
      return validationErrorResponse(updateValidator.getErrors());
    }

    const collection = await getTransactionsCollection();
    const objectId = new ObjectId(id);

    // Check if transaction exists
    const existingTransaction = await collection.findOne({ _id: objectId });

    if (!existingTransaction) {
      return notFoundResponse('Transaction not found');
    }

    // Build update object
    const updateDoc: Partial<TransactionDocument> = {
      updatedAt: new Date(),
    };

    if (body.amount !== undefined) {
      updateDoc.amount = body.amount;
    }

    if (body.date !== undefined) {
      updateDoc.date = new Date(body.date);
    }

    if (body.description !== undefined) {
      updateDoc.description = body.description.trim();
    }

    if (body.category !== undefined) {
      updateDoc.category = body.category;
    }

    // Update transaction
    const result = await collection.updateOne(
      { _id: objectId },
      { $set: updateDoc }
    );

    if (result.matchedCount === 0) {
      return notFoundResponse('Transaction not found');
    }

    if (result.modifiedCount === 0) {
      return errorResponse(
        'No changes were made to the transaction',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Fetch updated transaction
    const updatedTransaction = await collection.findOne({ _id: objectId });

    if (!updatedTransaction) {
      return databaseErrorResponse(
        'Transaction updated but could not be retrieved'
      );
    }

    // Format response
    const formattedTransaction = formatTransactionResponse(updatedTransaction);

    return successResponse(
      formattedTransaction,
      HTTP_STATUS.OK,
      'Transaction updated successfully'
    );
  } catch (error) {
    console.error('Error updating transaction:', error);
    return databaseErrorResponse('Failed to update transaction');
  }
}

// DELETE /api/transactions/[id] - Delete transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    const validator = new ValidationHelper();
    if (!validator.isValidObjectId(id, 'id')) {
      return invalidIdResponse('Invalid transaction ID format');
    }

    const collection = await getTransactionsCollection();
    const objectId = new ObjectId(id);

    // Check if transaction exists before deletion
    const existingTransaction = await collection.findOne({ _id: objectId });

    if (!existingTransaction) {
      return notFoundResponse('Transaction not found');
    }

    // Delete transaction
    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return notFoundResponse('Transaction not found');
    }

    return successResponse(
      {
        id: id,
        deleted: true,
      },
      HTTP_STATUS.OK,
      'Transaction deleted successfully'
    );
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return databaseErrorResponse('Failed to delete transaction');
  }
}

// GET /api/transactions/[id] - Get single transaction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    const validator = new ValidationHelper();
    if (!validator.isValidObjectId(id, 'id')) {
      return invalidIdResponse('Invalid transaction ID format');
    }

    const collection = await getTransactionsCollection();
    const objectId = new ObjectId(id);

    // Find transaction
    const transaction = await collection.findOne({ _id: objectId });

    if (!transaction) {
      return notFoundResponse('Transaction not found');
    }

    // Format response
    const formattedTransaction = formatTransactionResponse(transaction);

    return successResponse(
      formattedTransaction,
      HTTP_STATUS.OK,
      'Transaction retrieved successfully'
    );
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return databaseErrorResponse('Failed to fetch transaction');
  }
}

// Handle unsupported methods
export async function POST() {
  return methodNotAllowedResponse(['GET', 'PUT', 'DELETE']);
}

export async function PATCH() {
  return methodNotAllowedResponse(['GET', 'PUT', 'DELETE']);
}

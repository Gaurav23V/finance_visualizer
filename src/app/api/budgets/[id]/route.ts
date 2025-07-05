import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';
import { getBudgetsCollection } from '@/lib/db/mongodb';
import {
  successResponse,
  databaseErrorResponse,
  notFoundResponse,
  invalidIdResponse,
  ValidationHelper,
  HTTP_STATUS,
} from '@/lib/api/response';

// DELETE /api/budgets/[id] - Delete a budget
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    const validator = new ValidationHelper();
    if (!validator.isValidObjectId(id, 'id')) {
      return invalidIdResponse('Invalid budget ID format');
    }

    const collection = await getBudgetsCollection();
    const objectId = new ObjectId(id);

    // Delete the budget
    const result = await collection.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return notFoundResponse('Budget not found');
    }

    return successResponse(null, HTTP_STATUS.OK, 'Budget deleted successfully');
  } catch (error) {
    console.error('Error deleting budget:', error);
    return databaseErrorResponse('Failed to delete budget');
  }
}

import { NextResponse, NextRequest } from 'next/server';
import { ValidationError, ApiErrorResponse } from '@/types/transaction';

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error codes for consistent error handling
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  DATABASE_ERROR: 'DATABASE_ERROR',
  INVALID_ID: 'INVALID_ID',
  MISSING_FIELDS: 'MISSING_FIELDS',
  INVALID_DATE: 'INVALID_DATE',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

// Success response helper
export function successResponse<T>(
  data: T,
  status: number = HTTP_STATUS.OK,
  message?: string
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

// Error response helper
export function errorResponse(
  error: string,
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  details?: ValidationError[],
  code?: string
): NextResponse {
  const response: ApiErrorResponse = {
    success: false,
    error,
    details,
    code,
  };

  return NextResponse.json(response, { status });
}

// Validation error response
export function validationErrorResponse(
  errors: ValidationError[],
  message: string = 'Validation failed'
): NextResponse {
  return errorResponse(
    message,
    HTTP_STATUS.UNPROCESSABLE_ENTITY,
    errors,
    ERROR_CODES.VALIDATION_ERROR
  );
}

// Not found response
export function notFoundResponse(
  message: string = 'Resource not found'
): NextResponse {
  return errorResponse(
    message,
    HTTP_STATUS.NOT_FOUND,
    undefined,
    ERROR_CODES.NOT_FOUND
  );
}

// Database error response
export function databaseErrorResponse(
  message: string = 'Database operation failed'
): NextResponse {
  return errorResponse(
    message,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    undefined,
    ERROR_CODES.DATABASE_ERROR
  );
}

// Invalid ID response
export function invalidIdResponse(
  message: string = 'Invalid ID format'
): NextResponse {
  return errorResponse(
    message,
    HTTP_STATUS.BAD_REQUEST,
    undefined,
    ERROR_CODES.INVALID_ID
  );
}

// Method not allowed response
export function methodNotAllowedResponse(
  allowedMethods: string[] = []
): NextResponse {
  const response = NextResponse.json(
    {
      success: false,
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED',
    },
    { status: HTTP_STATUS.METHOD_NOT_ALLOWED }
  );

  if (allowedMethods.length > 0) {
    response.headers.set('Allow', allowedMethods.join(', '));
  }

  return response;
}

// Validation helpers
export class ValidationHelper {
  private errors: ValidationError[] = [];

  // Add validation error
  addError(field: string, message: string): void {
    this.errors.push({ field, message });
  }

  // Check if field is required
  required(value: any, field: string): boolean {
    if (value === undefined || value === null || value === '') {
      this.addError(field, `${field} is required`);
      return false;
    }
    return true;
  }

  // Validate number
  isNumber(value: any, field: string): boolean {
    if (typeof value !== 'number' || isNaN(value)) {
      this.addError(field, `${field} must be a valid number`);
      return false;
    }
    return true;
  }

  // Validate string
  isString(
    value: any,
    field: string,
    minLength?: number,
    maxLength?: number
  ): boolean {
    if (typeof value !== 'string') {
      this.addError(field, `${field} must be a string`);
      return false;
    }

    if (minLength !== undefined && value.length < minLength) {
      this.addError(
        field,
        `${field} must be at least ${minLength} characters long`
      );
      return false;
    }

    if (maxLength !== undefined && value.length > maxLength) {
      this.addError(
        field,
        `${field} must be no more than ${maxLength} characters long`
      );
      return false;
    }

    return true;
  }

  // Validate date
  isValidDate(value: any, field: string): boolean {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      this.addError(field, `${field} must be a valid date`);
      return false;
    }
    return true;
  }

  // Validate if a value is one of the allowed values
  isIn(value: any, allowedValues: readonly any[], field: string): boolean {
    if (!allowedValues.includes(value)) {
      this.addError(
        field,
        `${field} must be one of the following values: ${allowedValues.join(
          ', '
        )}`
      );
      return false;
    }
    return true;
  }

  // Validate MongoDB ObjectId format
  isValidObjectId(value: any, field: string): boolean {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (typeof value !== 'string' || !objectIdRegex.test(value)) {
      this.addError(field, `${field} must be a valid ObjectId`);
      return false;
    }
    return true;
  }

  // Check if there are validation errors
  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  // Get all validation errors
  getErrors(): ValidationError[] {
    return this.errors;
  }

  // Clear all errors
  clear(): void {
    this.errors = [];
  }
}

// Request body parser with error handling
export async function parseRequestBody<T>(
  request: Request | NextRequest
): Promise<T | null> {
  try {
    const body = await request.json();
    return body as T;
  } catch (error) {
    console.error('Failed to parse request body:', error);
    return null;
  }
}

// URL search params parser
export function parseSearchParams(url: string): Record<string, string> {
  const searchParams = new URL(url).searchParams;
  const params: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

// Convert MongoDB document to API response format
export function formatTransactionResponse(doc: any): any {
  if (!doc) return null;

  return {
    ...doc,
    _id: doc._id.toString(),
    date: doc.date.toISOString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

// Error handler wrapper for API routes (updated for NextRequest)
export function withErrorHandler(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);

      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('Database')) {
          return databaseErrorResponse(error.message);
        }
        if (error.message.includes('Invalid ID')) {
          return invalidIdResponse(error.message);
        }
        if (error.message.includes('not found')) {
          return notFoundResponse(error.message);
        }
      }

      // Default internal server error
      return errorResponse(
        'Internal server error',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        undefined,
        ERROR_CODES.INTERNAL_ERROR
      );
    }
  };
}

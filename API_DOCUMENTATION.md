# Finance Visualizer API Documentation

This document describes the REST API endpoints for the Finance Visualizer application.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API does not require authentication. This will be added in future versions.

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ], // Optional validation errors
  "code": "ERROR_CODE" // Optional error code
}
```

## Endpoints

### Health Check

#### GET /api/health

Check the system and database health status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "database": {
      "connected": true,
      "database": "finance_visualizer",
      "collections": ["transactions"]
    },
    "environment": "development",
    "version": "1.0.0"
  },
  "message": "System is healthy"
}
```

---

### Transactions

#### POST /api/transactions

Create a new transaction.

**Request Body:**
```json
{
  "amount": 100.50,
  "date": "2024-01-01T00:00:00.000Z",
  "description": "Grocery shopping"
}
```

**Validation Rules:**
- `amount`: Required, must be a number (positive for income, negative for expenses)
- `date`: Required, must be a valid date string
- `description`: Required, string between 1-500 characters

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "amount": 100.50,
    "date": "2024-01-01T00:00:00.000Z",
    "description": "Grocery shopping",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Transaction created successfully"
}
```

#### GET /api/transactions

Get all transactions with optional filtering and pagination.

**Query Parameters:**
- `limit`: Number of transactions to return (default: 50, max: 100)
- `skip`: Number of transactions to skip for pagination (default: 0)
- `sortBy`: Field to sort by (`date`, `amount`, `createdAt`) (default: `date`)
- `sortOrder`: Sort order (`asc`, `desc`) (default: `desc`)
- `dateFrom`: Filter transactions from this date (ISO string)
- `dateTo`: Filter transactions until this date (ISO string)
- `minAmount`: Filter transactions with amount >= this value
- `maxAmount`: Filter transactions with amount <= this value

**Examples:**
```
GET /api/transactions
GET /api/transactions?limit=10&skip=0
GET /api/transactions?dateFrom=2024-01-01&dateTo=2024-01-31
GET /api/transactions?minAmount=0&sortBy=amount&sortOrder=desc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "amount": 100.50,
        "date": "2024-01-01T00:00:00.000Z",
        "description": "Grocery shopping",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 50,
      "skip": 0,
      "hasMore": false
    }
  },
  "message": "Transactions retrieved successfully"
}
```

#### GET /api/transactions/[id]

Get a single transaction by ID.

**Path Parameters:**
- `id`: MongoDB ObjectId of the transaction

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "amount": 100.50,
    "date": "2024-01-01T00:00:00.000Z",
    "description": "Grocery shopping",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Transaction retrieved successfully"
}
```

#### PUT /api/transactions/[id]

Update an existing transaction.

**Path Parameters:**
- `id`: MongoDB ObjectId of the transaction

**Request Body:**
```json
{
  "amount": 150.75,
  "date": "2024-01-01T00:00:00.000Z",
  "description": "Updated grocery shopping"
}
```

**Notes:**
- All fields are optional, but at least one must be provided
- Only provided fields will be updated
- `updatedAt` timestamp is automatically set

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "amount": 150.75,
    "date": "2024-01-01T00:00:00.000Z",
    "description": "Updated grocery shopping",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:01:00.000Z"
  },
  "message": "Transaction updated successfully"
}
```

#### DELETE /api/transactions/[id]

Delete a transaction by ID.

**Path Parameters:**
- `id`: MongoDB ObjectId of the transaction

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "deleted": true
  },
  "message": "Transaction deleted successfully"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `NOT_FOUND` | Resource not found |
| `DATABASE_ERROR` | Database operation failed |
| `INVALID_ID` | Invalid MongoDB ObjectId format |
| `MISSING_FIELDS` | Required fields are missing |
| `INVALID_DATE` | Invalid date format |
| `INVALID_AMOUNT` | Invalid amount value |
| `CONNECTION_ERROR` | Database connection failed |
| `INTERNAL_ERROR` | Internal server error |

## HTTP Status Codes

| Status | Description |
|--------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 404 | Not Found - Resource not found |
| 405 | Method Not Allowed - HTTP method not supported |
| 422 | Unprocessable Entity - Validation failed |
| 500 | Internal Server Error - Server error |

## Examples

### Creating a Transaction

```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "amount": -50.25,
    "date": "2024-01-15T10:30:00.000Z",
    "description": "Coffee shop"
  }'
```

### Getting Transactions with Filters

```bash
curl "http://localhost:3000/api/transactions?dateFrom=2024-01-01&dateTo=2024-01-31&minAmount=-100&maxAmount=0&sortBy=date&sortOrder=desc&limit=10"
```

### Updating a Transaction

```bash
curl -X PUT http://localhost:3000/api/transactions/60f7b3b3b3b3b3b3b3b3b3b3 \
  -H "Content-Type: application/json" \
  -d '{
    "amount": -45.00,
    "description": "Coffee shop (updated)"
  }'
```

### Deleting a Transaction

```bash
curl -X DELETE http://localhost:3000/api/transactions/60f7b3b3b3b3b3b3b3b3b3b3
```

## Testing

Use the provided test script to verify all endpoints:

```bash
node test-api.js
```

Make sure your development server is running and your MongoDB connection is configured in `.env.local`.

## Database Schema

### Transaction Document

```typescript
interface Transaction {
  _id: string;           // MongoDB ObjectId as string
  amount: number;        // Positive for income, negative for expenses
  date: Date;           // Transaction date
  description: string;   // Transaction description
  createdAt: Date;      // Creation timestamp
  updatedAt: Date;      // Last update timestamp
}
```

## Rate Limiting

Currently, there are no rate limits implemented. This will be added in future versions for production use.

## CORS

CORS is configured to allow requests from the Next.js frontend. Additional origins can be configured as needed. 
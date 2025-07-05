import { NextRequest } from 'next/server';
import { getDatabaseHealth, testConnection } from '@/lib/db/mongodb';
import {
  successResponse,
  databaseErrorResponse,
  HTTP_STATUS,
} from '@/lib/api/response';

// GET /api/health - Health check endpoint
export async function GET(_request: NextRequest) {
  try {
    // Test database connection
    const isConnected = await testConnection();

    if (!isConnected) {
      return databaseErrorResponse('Database connection failed');
    }

    // Get detailed database health information
    const dbHealth = await getDatabaseHealth();

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbHealth,
      environment: process.env.NODE_ENV || 'unknown',
      version: process.env.npm_package_version || '1.0.0',
    };

    return successResponse(healthData, HTTP_STATUS.OK, 'System is healthy');
  } catch (error) {
    console.error('Health check failed:', error);
    return databaseErrorResponse('System health check failed');
  }
}

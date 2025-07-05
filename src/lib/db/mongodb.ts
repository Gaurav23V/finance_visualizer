import { MongoClient, Db, Collection } from 'mongodb';
import { TransactionDocument } from '@/types/transaction';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Database connection interface
export interface DatabaseConnection {
  client: MongoClient;
  db: Db;
}

// Get MongoDB client
export async function getMongoClient(): Promise<MongoClient> {
  try {
    const client = await clientPromise;
    return client;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Database connection failed');
  }
}

// Get database instance
export async function getDatabase(): Promise<Db> {
  try {
    const client = await getMongoClient();
    return client.db('finance_visualizer');
  } catch (error) {
    console.error('Failed to get database:', error);
    throw new Error('Database access failed');
  }
}

// Get transactions collection
export async function getTransactionsCollection(): Promise<
  Collection<TransactionDocument>
> {
  try {
    const db = await getDatabase();
    return db.collection<TransactionDocument>('transactions');
  } catch (error) {
    console.error('Failed to get transactions collection:', error);
    throw new Error('Collection access failed');
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const client = await getMongoClient();
    await client.db('admin').command({ ping: 1 });
    console.log('Successfully connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return false;
  }
}

// Close database connection (useful for testing)
export async function closeConnection(): Promise<void> {
  try {
    const client = await getMongoClient();
    await client.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
}

// Database health check
export async function getDatabaseHealth(): Promise<{
  connected: boolean;
  database: string;
  collections: string[];
  error?: string;
}> {
  try {
    const db = await getDatabase();
    const collections = await db.listCollections().toArray();

    return {
      connected: true,
      database: db.databaseName,
      collections: collections.map((col) => col.name),
    };
  } catch (error) {
    return {
      connected: false,
      database: '',
      collections: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Initialize database indexes for better performance
export async function initializeDatabase(): Promise<void> {
  try {
    const collection = await getTransactionsCollection();

    // Create indexes for better query performance
    await collection.createIndex({ date: -1 }); // Sort by date descending
    await collection.createIndex({ amount: 1 }); // Filter by amount
    await collection.createIndex({ createdAt: -1 }); // Sort by creation date
    await collection.createIndex({ description: 'text' }); // Text search on description

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Failed to initialize database indexes:', error);
    throw new Error('Database initialization failed');
  }
}

// Export the client promise for advanced usage
export default clientPromise;

import mongoose from 'mongoose';
import { config } from './env.js';

mongoose.set('strictQuery', true);

let connectionPromise = null;

/**
 * Ensure Mongoose is connected. Safe to call on every request and on a
 * serverless platform where the module can be reused between invocations.
 */
export async function ensureDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(config.mongoUri, {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 5,
        autoIndex: !config.isProduction,
      })
      .catch((error) => {
        // Allow the next request to retry after a failed cold-start connection.
        connectionPromise = null;
        throw error;
      });
  }

  await connectionPromise;
  return mongoose.connection;
}

export async function connectDatabase() {
  try {
    await ensureDatabase();
    console.log(`[db] Connected to MongoDB (${mongoose.connection.name})`);
  } catch (error) {
    console.error('[db] MongoDB connection failed:', error.message);
    console.error('[db] Make sure MongoDB is running or set MONGODB_URI to your Atlas cluster.');
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  connectionPromise = null;
  await mongoose.connection.close();
}

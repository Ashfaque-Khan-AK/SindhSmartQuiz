import mongoose from 'mongoose';
import { config } from './env.js';

export async function connectDatabase() {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 10000,
      autoIndex: !config.isProduction,
    });
    console.log(`[db] Connected to MongoDB (${mongoose.connection.name})`);
  } catch (error) {
    console.error('[db] MongoDB connection failed:', error.message);
    console.error('[db] Make sure MongoDB is running or set MONGODB_URI to your Atlas cluster.');
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  await mongoose.connection.close();
}

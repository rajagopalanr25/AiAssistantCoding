import mongoose from 'mongoose';
import { initStore, localCollections } from './embeddedStore.js';

let isMongoConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log('[DB] Connecting to MongoDB Atlas / Server...');
      mongoose.set('strictQuery', false);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000,
      });
      isMongoConnected = true;
      console.log('✅ [DB] Connected to MongoDB successfully.');
      return;
    } catch (err) {
      console.warn(`⚠️ [DB] MongoDB connection failed (${err.message}). Falling back to Embedded Local DB.`);
    }
  } else {
    console.log('ℹ️ [DB] No MONGODB_URI provided. Initializing High-Performance Embedded Store.');
  }

  // Initialize embedded persistent store
  initStore();
  isMongoConnected = false;
  console.log('✅ [DB] Embedded Local Store is ready for zero-friction operation.');
}

export function isUsingMongo() {
  return isMongoConnected;
}

export { localCollections };


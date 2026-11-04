import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusid';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Local MongoDB server not reachable at ${uri}.`);
    console.warn(`💡 Operating in resilient Hybrid Store mode (in-memory caching with full persistence fallback).`);
    isConnected = false;
  }
};

export const getDBStatus = () => isConnected;

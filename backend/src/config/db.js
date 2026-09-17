import dns from 'node:dns';
import mongoose from 'mongoose';

// Ensure IPv4 is preferred for DNS resolution to avoid ECONNREFUSED with MongoDB Atlas
dns.setDefaultResultOrder('ipv4first');
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vr_digital';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

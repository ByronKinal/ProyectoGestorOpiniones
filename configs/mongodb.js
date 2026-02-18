import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/opinion_system';

/**
 * Conectar a MongoDB usando Mongoose
 */
export const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongodbUri);
    console.log('✅ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

/**
 * Desconectar de MongoDB
 */
export const disconnectMongoDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting MongoDB:', error.message);
    throw error;
  }
};

export default mongoose;

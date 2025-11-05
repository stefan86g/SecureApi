import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'secure_chat',
    });
    logger.info('🗄️ MongoDB connected');
  } catch (err) {
    logger.error('❌ DB connection failed', err);
    process.exit(1);
  }
};
export default connectDB;
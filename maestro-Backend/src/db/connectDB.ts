import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdbname';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
    });
    console.log('Database connected:', mongoUri);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;


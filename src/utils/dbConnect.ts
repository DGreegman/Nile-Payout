
import mongoose from 'mongoose';
import config from '../config';

let isConnected: boolean = false;

export const dbConnect = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    await mongoose.connect(config.mongo_uri);
    isConnected = true;
    console.log('New database connection established');
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to database');
  }
};

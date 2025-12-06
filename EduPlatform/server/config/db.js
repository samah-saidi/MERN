const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Support multiple env var names and provide a sensible default for local dev
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DB_URI || 'mongodb://localhost:27017/eduplatform';

    if (!uri || typeof uri !== 'string') {
      throw new Error('MongoDB connection URI is not defined or invalid. Set MONGODB_URI in your .env');
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

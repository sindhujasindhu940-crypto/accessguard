const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error('MONGO_URI is missing in .env file');
      return;
    }

    const conn = await mongoose.connect(mongoURI, {
      dbName: 'visitor_tracking',
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    console.log('MongoDB connection failed. APIs that use DB will not work until fixed.');
  }
};

module.exports = connectDB;
const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 * @returns {Promise} MongoDB connection
 */
const connectDB = async () => {
  try {
    // Check if MONGODB_URI is provided
    if (!process.env.MONGODB_URI) {
      console.log('⚠️ MONGODB_URI not set - skipping MongoDB connection (running in smoke/test mode)');
      return { connection: { host: 'localhost (no-db)' } };
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    
    // In test/development mode, continue without DB
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.log('🔄 Continuing in smoke/test mode without database...');
      return { connection: { host: 'localhost (fallback)' } };
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;

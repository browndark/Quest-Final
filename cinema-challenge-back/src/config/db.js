const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Connect to MongoDB or In-Memory Database
 * @returns {Promise} MongoDB connection
 */
const connectDB = async () => {
  try {
    // Option 1: Use in-memory database (for testing/demo without MongoDB Atlas)
    if (process.env.USE_IN_MEMORY_DB === 'true') {
      console.log('🧪 Using MongoDB Memory Server (in-memory database)...');
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }

    // Option 2: Check if MONGODB_URI is provided
    if (!process.env.MONGODB_URI) {
      console.log('⚠️ MONGODB_URI not set - skipping MongoDB connection (running in smoke/test mode)');
      return { connection: { host: 'localhost (no-db)' } };
    }

    // Option 3: Connect to real MongoDB (Atlas or local)
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

/**
 * Disconnect and cleanup
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('Error disconnecting:', error);
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;

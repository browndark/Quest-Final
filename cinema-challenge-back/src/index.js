const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const routes = require('./routes');
const swaggerDocs = require('./config/swagger');
const { notFound, errorHandler } = require('./middleware/error');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Cinema App API',
    documentation: '/api/v1/docs' 
  });
});

// Handle Socket.IO requests with a catch-all handler (prevent 404 errors)
app.use('/socket.io', (req, res) => {
  res.status(200).json({
    message: 'Socket.IO not available',
    note: 'This API does not support WebSocket connections'
  });
});

// Initialize Swagger documentation
swaggerDocs(app);

// API Routes
app.use('/api/v1', routes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || 3000;

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api/v1`);
    console.log(`API documentation available at http://localhost:${PORT}/api/v1/docs`);
  });
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Route imports
const authRoutes = require('./routes/authRoutes');
const shopRoutes = require('./routes/shopRoutes');
const artistRoutes = require('./routes/artistRoutes');
const salesRoutes = require('./routes/sales');
const analyticsRoutes = require('./routes/analytics');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categoryRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();

const app = express();

// Enhanced debug middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  console.log('Request query:', req.query);
  console.log('Request params:', req.params);
  next();
});

// Middleware
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());
// After your middleware setup
const path = require('path');

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection with enhanced logging
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to database:',process.env.MONGODB_URI);
  console.log('Available collections:', mongoose.connection.collections);
})
.catch((err) => console.error('MongoDB connection error:', err));

// API health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Route configurations with error handling
app.use('/api/auth', authRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/products', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);

// Import and use order routes
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  console.log(`404: Endpoint not found - ${req.originalUrl}`);
  res.status(404).json({
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Start server with port fallback and error handling
const WebSocketServer = require('./websocket/websocketServer');

const startServer = async (port) => {
  try {
    await new Promise((resolve, reject) => {
      const server = app.listen(port)
        .once('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy, trying port ${port + 1}`);
            server.close();
            resolve(startServer(port + 1));
          } else {
            reject(err);
          }
        })
        .once('listening', () => {
          console.log(`Server is running on port ${port}`);
          // Initialize WebSocket server
          const wsServer = new WebSocketServer(server);
          console.log('WebSocket server is running');
          console.log('Available routes:');
          console.log('- /api/auth');
          console.log('- /api/shop');
          console.log('- /api/products');
          resolve();
        });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;
startServer(PORT);
console.log('- /api/artists');
console.log('- /api/sales');
console.log('- /api/users');
console.log('- /api/analytics');

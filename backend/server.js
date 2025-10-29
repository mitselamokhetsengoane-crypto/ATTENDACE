const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB, testConnection, getConnectionStatus } = require('./db');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection check on startup
const initializeApp = async () => {
  console.log('🚀 Starting Employee Attendance Tracker...');
  console.log('⏰', new Date().toISOString());
  console.log('🌐 Environment:', process.env.NODE_ENV || 'development');
  console.log('📍 Port:', PORT);
  
  // Test database connection first
  console.log('\n🔌 Testing PostgreSQL connection...');
  const connected = await testConnection();
  
  if (connected) {
    try {
      // Initialize database tables
      console.log('\n📊 Initializing database...');
      await initDB();
      
      // Start server
      app.listen(PORT, () => {
        console.log('\n🎉 SERVER STARTED SUCCESSFULLY!');
        console.log('══════════════════════════════════════');
        console.log(`📍 Server URL: http://localhost:${PORT}`);
        console.log(`🗂️  Database: PostgreSQL (attendance_db)`);
        console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`⏰ Started at: ${new Date().toISOString()}`);
        console.log('══════════════════════════════════════');
        console.log('\n🛣️  Available API Endpoints:');
        console.log('   GET  /health         - Health check');
        console.log('   GET  /api/db-status  - Database status');
        console.log('   GET  /api/attendance - Get all records');
        console.log('   POST /api/attendance - Add new record');
        console.log('   DELETE /api/attendance/:id - Delete record');
        console.log('══════════════════════════════════════\n');
      });

    } catch (err) {
      console.error('\n💥 DATABASE INITIALIZATION FAILED:', err.message);
      console.log('❌ Server cannot start without database');
      process.exit(1);
    }
  } else {
    console.error('\n💥 DATABASE CONNECTION FAILED');
    console.log('❌ Server cannot start without database connection');
    console.log('💡 Please check:');
    console.log('   1. Database credentials in .env file');
    console.log('   2. PostgreSQL service is running');
    console.log('   3. Database "attendance_db" exists');
    process.exit(1);
  }
};

// Routes
app.use('/api', attendanceRoutes);

// Enhanced health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = getConnectionStatus();
  
  const healthInfo = {
    status: dbStatus.isConnected ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    service: 'Employee Attendance Tracker API',
    version: '1.0.0',
    database: {
      status: dbStatus.isConnected ? 'connected' : 'disconnected',
      type: 'PostgreSQL',
      database: dbStatus.database,
      error: dbStatus.error,
      lastChecked: dbStatus.timestamp
    },
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime()
    }
  };
  
  const statusCode = dbStatus.isConnected ? 200 : 503;
  res.status(statusCode).json(healthInfo);
});

// Database status endpoint
app.get('/api/db-status', (req, res) => {
  const dbStatus = getConnectionStatus();
  res.json({
    message: dbStatus.isConnected ? 'Database connected successfully' : 'Database connection failed',
    ...dbStatus
  });
});

// Root endpoint
app.get('/', (req, res) => {
  const dbStatus = getConnectionStatus();
  
  res.json({
    message: 'Employee Attendance Tracker API',
    timestamp: new Date().toISOString(),
    status: dbStatus.isConnected ? 'Operational' : 'Database Issue',
    database: {
      status: dbStatus.isConnected ? '✅ Connected' : '❌ Disconnected',
      type: 'PostgreSQL',
      name: dbStatus.database,
      error: dbStatus.error
    },
    endpoints: {
      health: '/health',
      dbStatus: '/api/db-status',
      attendance: '/api/attendance',
      documentation: 'See README for API documentation'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error stack:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Route ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/db-status',
      'GET /api/attendance',
      'POST /api/attendance',
      'DELETE /api/attendance/:id'
    ]
  });
});

// Start the application
initializeApp();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔻 Shutting down server gracefully...');
  console.log('👋 Server stopped');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔻 Server terminated');
  process.exit(0);
});
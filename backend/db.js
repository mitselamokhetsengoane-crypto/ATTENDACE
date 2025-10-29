const { Pool } = require('pg');
require('dotenv').config();

let isConnected = false;
let connectionError = null;

console.log('🔌 Initializing PostgreSQL connection to Render...');
console.log('🌐 Environment:', process.env.NODE_ENV);
console.log('🗂️ Database:', process.env.DB_NAME);

// Create pool with Render-optimized settings
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Render PostgreSQL
  },
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  max: 10,
});

// Test database connection
const testConnection = async () => {
  try {
    console.log('🔄 Connecting to Render PostgreSQL...');
    console.log('📍 Database:', process.env.DB_NAME);
    console.log('🌐 Host:', process.env.DB_HOST);
    
    const client = await pool.connect();
    const result = await client.query('SELECT version(), current_database()');
    
    console.log('✅ PostgreSQL connected successfully!');
    console.log('🗂️ Current Database:', result.rows[0].current_database);
    console.log('☁️  Host: Render PostgreSQL');
    console.log('🐘 PostgreSQL Version:', result.rows[0].version.split(',')[0]);
    
    client.release();
    isConnected = true;
    connectionError = null;
    return true;
  } catch (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
    console.log('💡 Troubleshooting tips:');
    console.log('   1. Check if database "attendance_db" exists in Render');
    console.log('   2. Verify DATABASE_URL in environment variables');
    console.log('   3. Check if user has permissions to access attendance_db');
    isConnected = false;
    connectionError = err.message;
    return false;
  }
};

// Initialize database table
const initDB = async () => {
  let client;
  try {
    client = await pool.connect();
    
    // Create table if not exists
    const queryText = `
      CREATE TABLE IF NOT EXISTS Attendance (
        id SERIAL PRIMARY KEY,
        employeeName VARCHAR(255) NOT NULL,
        employeeID VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await client.query(queryText);
    console.log('✅ Attendance table created/verified in attendance_db');

    // Create index for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_attendance_date 
      ON Attendance(date DESC)
    `);
    console.log('✅ Database indexes created');

  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
    throw err;
  } finally {
    if (client) client.release();
  }
};

// Get connection status
const getConnectionStatus = () => {
  return {
    isConnected,
    error: connectionError,
    database: process.env.DB_NAME || 'attendance_db',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  };
};

// Graceful shutdown
process.on('beforeExit', async () => {
  console.log('🔻 Closing database connections...');
  await pool.end();
});

module.exports = { 
  pool, 
  initDB, 
  testConnection, 
  getConnectionStatus 
};
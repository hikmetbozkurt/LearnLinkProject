import pg from 'pg'
import config from './env.js'

const pool = new pg.Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: config.DB_PORT,
});

// Test the connection immediately
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release();
  } catch (err) {
    console.error('Database connection error:', err);
    console.error('Connection details:', {
      user: config.DB_USER,
      host: config.DB_HOST,
      database: config.DB_NAME,
      port: config.DB_PORT
    });
  }
};

testConnection();

// Add error handling for the pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool; 
import { Pool, PoolConfig } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const config: PoolConfig = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: {
    ca: fs.readFileSync(path.join(process.cwd(), process.env.DB_SSL_CA_PATH || '')).toString(),
    cert: fs.readFileSync(path.join(process.cwd(), process.env.DB_SSL_CERT_PATH || '')).toString(),
    key: fs.readFileSync(path.join(process.cwd(), process.env.DB_SSL_KEY_PATH || '')).toString(),
    rejectUnauthorized: false // ✅ same as sslmode='prefer' in psycopg2
  },
  max: Number(process.env.DB_MAX_CONNECTIONS),
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS),
  connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT_MS),
  keepAlive: true,

};

const pool = new Pool(config);

export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  const start = Date.now();
  try {
    await client.query('SET search_path TO system, public');
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getClient = () => pool.connect();

export default pool;

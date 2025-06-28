import { Pool, PoolConfig } from 'pg';
import * as fs from 'fs';

const config: PoolConfig = {
  host: "35.232.27.6",  // ✅ same as your Python script
  database: "utda",
  user: "utda_dbun",
  password: "XBBtp7ltj3#5rH?i",
  port: 5432,
  ssl: {
    ca: fs.readFileSync("/Users/utkarsh/Documents/GCSQL_server-ca.pem").toString(),
    cert: fs.readFileSync("/Users/utkarsh/Documents/GCSQL_client-cert.pem").toString(),
    key: fs.readFileSync("/Users/utkarsh/Documents/GCSQL_client-key.pem").toString(),
    rejectUnauthorized: false // ✅ same as sslmode='prefer' in psycopg2
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
  keepAlive: true,

};

const pool = new Pool(config);

export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  const start = Date.now();
  try {
    await client.query('SET search_path TO core');
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

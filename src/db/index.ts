import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool, PoolConfig } from 'pg';

// Define the base configuration
const poolConfig: PoolConfig = {
    connectionString: process.env.DATABASE_URL,
};

// Conditionally add SSL options if in production
if (process.env.NODE_ENV === 'production') {
    poolConfig.ssl = {
        ca: process.env.DB_CA_CERT, // Ensure DB_CA_CERT is set in your production environment
    };
}

// Create the pool with the generated configuration
const pool = new Pool(poolConfig);

export const db = drizzle(pool);
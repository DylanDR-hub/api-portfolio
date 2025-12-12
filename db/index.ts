// db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import 'dotenv/config';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: false }
});

export const db = drizzle(pool, { schema });

// On garde l'état pour ne pas faire end() plusieurs fois
let poolClosed = false;

export async function closeDb() {
    if (poolClosed) return;
    poolClosed = true;
    await pool.end();
}

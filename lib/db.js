import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema.js";

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

// One pool per server instance (reused across hot reloads in dev).
export function getDb() {
  const g = globalThis;
  if (!g.__gkDb) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set.");
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 15_000, // allows Neon to wake from idle
    });
    pool.on("error", (e) => console.error("[db] pool error:", e.message));
    g.__gkDb = { pool, db: drizzle(pool, { schema }) };
  }
  return g.__gkDb.db;
}

export async function closeDb() {
  const g = globalThis;
  if (g.__gkDb) {
    await g.__gkDb.pool.end();
    g.__gkDb = null;
  }
}

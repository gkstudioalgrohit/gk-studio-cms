#!/usr/bin/env node
// Runs automatically before every `next build`. Applies any SQL files in
// /drizzle that haven't been applied yet. Safe to run repeatedly.
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import pg from "pg";

const DIR = path.join(process.cwd(), "drizzle");

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log("[setup] DATABASE_URL is not set — skipping migrations. The site will still build using its default content.");
    return;
  }
  const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.endsWith(".sql")).sort() : [];
  if (!files.length) return console.log("[setup] No migration files found.");

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1, connectionTimeoutMillis: 15000 });
  const client = await pool.connect();
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS _migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`);
    const { rows } = await client.query("SELECT name FROM _migrations");
    const done = new Set(rows.map((r) => r.name));
    for (const file of files) {
      if (done.has(file)) continue;
      const sql = fs.readFileSync(path.join(DIR, file), "utf8");
      console.log(`[setup] Applying ${file} ...`);
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO _migrations(name) VALUES ($1)", [file]);
        await client.query("COMMIT");
      } catch (e) {
        await client.query("ROLLBACK");
        throw new Error(`Migration ${file} failed: ${e.message}`);
      }
    }
    console.log(`[setup] Database is up to date (${files.length} migration(s) checked).`);

    // Convenience for first deploy: if ADMIN_EMAIL + ADMIN_PASSWORD are set as
    // env vars and no admin exists yet, create one automatically.
    if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const { rows: existing } = await client.query("SELECT 1 FROM admin_users LIMIT 1");
      if (!existing.length) {
        const bcryptMod = await import("bcryptjs");
        const bcrypt = bcryptMod.default ?? bcryptMod;
        const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
        await client.query("INSERT INTO admin_users (id, email, name, password_hash) VALUES ($1,$2,$3,$4)", [
          crypto.randomUUID(), process.env.ADMIN_EMAIL.trim().toLowerCase(), process.env.ADMIN_NAME || "Admin", hash,
        ]);
        console.log(`[setup] Created admin account for ${process.env.ADMIN_EMAIL}.`);
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error("[setup]", e.message);
  process.exit(1); // fail the build rather than deploy with a broken schema
});

#!/usr/bin/env node
// Interactive: `npm run create-admin`
import "dotenv/config";
import readline from "node:readline/promises";
import pg from "pg";
import bcrypt from "bcryptjs";

function ask(rl, q, { hide = false } = {}) {
  if (!hide) return rl.question(q);
  return new Promise((resolve) => {
    const stdin = process.stdin;
    process.stdout.write(q);
    let input = "";
    const onData = (buf) => {
      const char = buf.toString("utf8");
      if (char === "\n" || char === "\r") {
        stdin.setRawMode?.(false);
        stdin.off("data", onData);
        process.stdout.write("\n");
        resolve(input);
        return;
      }
      if (char === "\u0003") process.exit(1); // Ctrl+C
      if (char === "\u007f") input = input.slice(0, -1);
      else input += char;
    };
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.on("data", onData);
  });
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set. Add it to .env.local first (see .env.example).");
    process.exit(1);
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const email = (await ask(rl, "Admin email: ")).trim().toLowerCase();
  const name = (await ask(rl, "Name (optional): ")).trim();
  const password = await ask(rl, "Password (min 10 characters): ", { hide: true });
  rl.close();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("That doesn't look like a valid email.");
  if (password.length < 10) throw new Error("Password must be at least 10 characters.");

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const hash = await bcrypt.hash(password, 12);
  await pool.query(
    `INSERT INTO admin_users (email, name, password_hash) VALUES ($1,$2,$3)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name`,
    [email, name, hash]
  );
  await pool.end();
  console.log(`\nDone. You can now sign in at /admin/login as ${email}.`);
}

main().catch((e) => {
  console.error("\n" + e.message);
  process.exit(1);
});

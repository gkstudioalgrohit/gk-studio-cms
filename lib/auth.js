// Server-side authentication: bcrypt password hashing, DB-backed sessions
// (only a SHA-256 hash of the token is stored) and brute-force lockout.
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { and, eq, gt, inArray, lt, ne } from "drizzle-orm";
import { getDb } from "./db.js";
import { adminUsers, sessions, loginAttempts } from "./schema.js";

export const SESSION_COOKIE = "gk_admin_session";
export const SESSION_DAYS = 30;
const DAY = 86_400_000;
const sha = (t) => crypto.createHash("sha256").update(t).digest("hex");

let _dummy;
async function dummyHash() {
  // Compared against when the email doesn't exist, so timing doesn't reveal valid emails.
  return (_dummy ??= await bcrypt.hash("not-a-real-password", 12));
}

export const hashPassword = (pw) => bcrypt.hash(pw, 12);

export function passwordProblem(pw, email = "") {
  if (typeof pw !== "string" || pw.length < 10) return "Password must be at least 10 characters.";
  if (Buffer.byteLength(pw) > 72) return "Password is too long (max 72 characters).";
  if (email && pw.toLowerCase() === email.toLowerCase()) return "Password must not be your email address.";
  return null;
}

export async function createSession(userId, userAgent = "") {
  const token = crypto.randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + SESSION_DAYS * DAY);
  await getDb().insert(sessions).values({
    id: sha(token),
    userId,
    expiresAt: expires,
    userAgent: String(userAgent).slice(0, 300),
  });
  return { token, expires };
}

export async function getUserBySessionToken(token) {
  if (!token || typeof token !== "string" || token.length > 200) return null;
  const rows = await getDb()
    .select({ id: adminUsers.id, email: adminUsers.email, name: adminUsers.name })
    .from(sessions)
    .innerJoin(adminUsers, eq(sessions.userId, adminUsers.id))
    .where(and(eq(sessions.id, sha(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return rows[0] || null;
}

export async function destroySession(token) {
  if (token) await getDb().delete(sessions).where(eq(sessions.id, sha(token)));
}

// ---- brute-force protection -------------------------------------------------
const WINDOW_MS = 15 * 60_000;
const LOCK_MS = 15 * 60_000;
const limitFor = (key) => (key.startsWith("ip:") ? 25 : 5);

async function getLock(keys) {
  const rows = await getDb().select().from(loginAttempts).where(inArray(loginAttempts.key, keys));
  const now = Date.now();
  let until = 0;
  for (const r of rows) if (r.lockedUntil && r.lockedUntil.getTime() > now) until = Math.max(until, r.lockedUntil.getTime());
  return until ? new Date(until) : null;
}

async function recordFailure(keys) {
  const db = getDb();
  for (const key of keys) {
    const now = new Date();
    const [row] = await db.select().from(loginAttempts).where(eq(loginAttempts.key, key)).limit(1);
    let count = 1;
    let windowStart = now;
    if (row && now.getTime() - row.windowStart.getTime() < WINDOW_MS) {
      count = row.count + 1;
      windowStart = row.windowStart;
    }
    const lockedUntil = count >= limitFor(key) ? new Date(now.getTime() + LOCK_MS) : null;
    await db
      .insert(loginAttempts)
      .values({ key, count, windowStart, lockedUntil })
      .onConflictDoUpdate({ target: loginAttempts.key, set: { count, windowStart, lockedUntil } });
  }
}

export async function loginWithPassword({ email, password, ip, userAgent }) {
  const db = getDb();
  const em = String(email || "").trim().toLowerCase().slice(0, 200);
  const pw = String(password || "").slice(0, 200);
  const keys = [`email:${em}`, `ip:${ip || "unknown"}`];

  const lock = await getLock(keys);
  if (lock) {
    const mins = Math.max(1, Math.ceil((lock.getTime() - Date.now()) / 60_000));
    return { ok: false, status: 429, error: `Too many failed attempts. Try again in ${mins} minute${mins > 1 ? "s" : ""}.` };
  }

  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, em)).limit(1);
  const valid = await bcrypt.compare(pw, user ? user.passwordHash : await dummyHash());
  if (!user || !valid) {
    await recordFailure(keys);
    return { ok: false, status: 401, error: "Incorrect email or password." };
  }

  await db.delete(loginAttempts).where(inArray(loginAttempts.key, keys));
  if (Math.random() < 0.05) await db.delete(sessions).where(lt(sessions.expiresAt, new Date()));
  const s = await createSession(user.id, userAgent);
  return { ok: true, token: s.token, expires: s.expires, user: { id: user.id, email: user.email, name: user.name } };
}

// ---- profile ----------------------------------------------------------------
export async function updateProfile(userId, { name, email, currentPassword, newPassword }, keepToken) {
  const db = getDb();
  const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, userId)).limit(1);
  if (!user) return { ok: false, status: 404, error: "Account not found." };

  const nextEmail = String(email ?? user.email).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) return { ok: false, status: 400, error: "Enter a valid email address." };
  const changingEmail = nextEmail !== user.email;
  const changingPw = Boolean(newPassword);

  if (changingEmail || changingPw) {
    if (!currentPassword || !(await bcrypt.compare(String(currentPassword).slice(0, 200), user.passwordHash))) {
      return { ok: false, status: 403, error: "Current password is incorrect." };
    }
  }
  const patch = { name: String(name ?? user.name).trim().slice(0, 100), email: nextEmail };
  if (changingPw) {
    const problem = passwordProblem(newPassword, nextEmail);
    if (problem) return { ok: false, status: 400, error: problem };
    patch.passwordHash = await hashPassword(newPassword);
  }
  try {
    await db.update(adminUsers).set(patch).where(eq(adminUsers.id, userId));
  } catch (e) {
    if (String(e.message).includes("unique")) return { ok: false, status: 409, error: "That email is already in use." };
    throw e;
  }
  // A password change signs out every other device.
  if (changingPw) await db.delete(sessions).where(and(eq(sessions.userId, userId), ne(sessions.id, sha(keepToken || ""))));
  return { ok: true };
}

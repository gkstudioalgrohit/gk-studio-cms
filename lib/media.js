import { z } from "zod";
import { and, count, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { getDb } from "./db.js";
import { media, siteContent } from "./schema.js";
import { AppError } from "./errors.js";
import { ALLOWED_MIMES, kindOfMime, maxBytesFor } from "./filetypes.js";
import { deleteStoredFile } from "./storage.js";

export const publicMedia = (r) => ({
  id: r.id, kind: r.kind, url: r.url, width: r.width, height: r.height, alt: r.alt, caption: r.caption,
  mime: r.mime, size: r.size, filename: r.filename, storage: r.storage, isPlaceholder: r.isPlaceholder,
  createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
});

const dim = z.number().int().min(1).max(30000).nullable().optional();
const inputSchema = z.object({
  kind: z.enum(["image", "video"]),
  storage: z.enum(["blob", "local"]),
  url: z.string().max(2000),
  pathname: z.string().max(500).nullable().optional(),
  filename: z.string().trim().min(1).max(200),
  mime: z.enum(ALLOWED_MIMES),
  size: z.number().int().min(0),
  width: dim,
  height: dim,
});

function validateInput(input) {
  const v = inputSchema.parse(input);
  if (kindOfMime(v.mime) !== v.kind) throw new AppError(400, "File type does not match its kind.");
  if (v.size > maxBytesFor(v.kind)) {
    throw new AppError(400, `${v.kind === "video" ? "Videos" : "Images"} can be at most ${maxBytesFor(v.kind) / 1048576} MB.`);
  }
  return v;
}

export async function listMedia({ q = "", kind = "", limit = 48, offset = 0 } = {}) {
  const db = getDb();
  const conds = [];
  if (kind === "image" || kind === "video") conds.push(eq(media.kind, kind));
  const term = String(q).trim().slice(0, 100).replace(/[%_\\]/g, (c) => "\\" + c);
  if (term) conds.push(or(ilike(media.filename, `%${term}%`), ilike(media.alt, `%${term}%`), ilike(media.caption, `%${term}%`)));
  const where = conds.length ? and(...conds) : undefined;
  const [{ total }] = await db.select({ total: count() }).from(media).where(where);
  const rows = await db.select().from(media).where(where).orderBy(desc(media.createdAt)).limit(Math.min(limit, 100)).offset(offset);
  return { items: rows.map(publicMedia), total };
}

export async function getMediaMap(ids) {
  const list = [...new Set((ids || []).filter(Boolean))];
  if (!list.length) return {};
  const rows = await getDb().select().from(media).where(inArray(media.id, list));
  return Object.fromEntries(rows.map((r) => [r.id, publicMedia(r)]));
}

export async function createMedia(input) {
  const v = validateInput(input);
  const [row] = await getDb().insert(media).values({ ...v, pathname: v.pathname ?? null, width: v.width ?? null, height: v.height ?? null }).returning();
  return publicMedia(row);
}

export async function updateMediaMeta(id, { alt, caption }) {
  const patch = { updatedAt: new Date() };
  if (typeof alt === "string") patch.alt = alt.trim().slice(0, 300);
  if (typeof caption === "string") patch.caption = caption.trim().slice(0, 500);
  const [row] = await getDb().update(media).set(patch).where(eq(media.id, id)).returning();
  if (!row) throw new AppError(404, "File not found.");
  return publicMedia(row);
}

// Swap the file behind an existing media record. Every place that uses it updates automatically.
export async function replaceMediaFile(id, input) {
  const db = getDb();
  const v = validateInput(input);
  const [old] = await db.select().from(media).where(eq(media.id, id)).limit(1);
  if (!old) throw new AppError(404, "File not found.");
  if (old.kind !== v.kind) throw new AppError(400, `You can only replace ${old.kind === "image" ? "an image with an image" : "a video with a video"}.`);
  const [row] = await db
    .update(media)
    .set({ ...v, pathname: v.pathname ?? null, width: v.width ?? null, height: v.height ?? null, isPlaceholder: false, updatedAt: new Date() })
    .where(eq(media.id, id))
    .returning();
  await deleteStoredFile(old); // remove the previous file (no-op for the built-in placeholders)
  return publicMedia(row);
}

const SECTION_LABELS = {
  hero: "Hero", intro: "Intro", films: "Films", photography: "Photography",
  settings: "Website settings (logo / favicon)", seo: "SEO", contact: "Contact",
};

export async function findUsage(id) {
  const rows = await getDb()
    .select({ key: siteContent.key })
    .from(siteContent)
    .where(sql`${siteContent.data}::text LIKE ${"%" + id + "%"}`);
  return rows.map((r) => SECTION_LABELS[r.key] || r.key);
}

export async function deleteMedia(id, { force = false } = {}) {
  const db = getDb();
  const [row] = await db.select().from(media).where(eq(media.id, id)).limit(1);
  if (!row) throw new AppError(404, "File not found.");
  const usage = await findUsage(id);
  if (usage.length && !force) {
    throw new AppError(409, `This file is used in: ${usage.join(", ")}. Replace it there first (or use “Replace file” to swap it everywhere).`, { usage });
  }
  await db.delete(media).where(eq(media.id, id));
  await deleteStoredFile(row);
}

export async function mediaStats() {
  const rows = await getDb().select({ kind: media.kind, isPlaceholder: media.isPlaceholder, n: count() }).from(media).groupBy(media.kind, media.isPlaceholder);
  const s = { total: 0, images: 0, videos: 0, placeholders: 0 };
  for (const r of rows) {
    s.total += r.n;
    if (r.kind === "image") s.images += r.n; else s.videos += r.n;
    if (r.isPlaceholder) s.placeholders += r.n;
  }
  return s;
}

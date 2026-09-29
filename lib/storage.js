// Where uploaded files live.
//  - Production: Vercel Blob (permanent, CDN-backed).
//  - Local development without a Blob token: files go to ./.data/uploads.
//    (Never use local storage on Vercel — its disk is temporary.)
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { del } from "@vercel/blob";

export const LOCAL_DIR = path.join(process.cwd(), ".data", "uploads");

export function storageMode() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (process.env.NODE_ENV !== "production" || process.env.GK_ALLOW_LOCAL_STORAGE === "1") return "local";
  return "none";
}

export function isTrustedBlobUrl(u) {
  try {
    const url = new URL(u);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export function safeFilename(name) {
  const base = String(name || "file").split(/[\\/]/).pop().toLowerCase();
  return base.replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^[-.]+/, "").slice(0, 100) || "file";
}

export async function saveLocalFile(buffer, filename) {
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  const stored = `${Date.now().toString(36)}-${crypto.randomBytes(4).toString("hex")}-${safeFilename(filename)}`;
  await fs.writeFile(path.join(LOCAL_DIR, stored), buffer);
  return { url: `/media/${stored}`, pathname: stored };
}

export async function readLocalFile(name) {
  if (!/^[a-z0-9._-]+$/i.test(name) || name.startsWith(".")) return null;
  try {
    return await fs.readFile(path.join(LOCAL_DIR, name));
  } catch {
    return null;
  }
}

export async function deleteStoredFile({ storage, url, pathname }) {
  try {
    if (storage === "blob") await del(url);
    else if (storage === "local" && pathname) await fs.unlink(path.join(LOCAL_DIR, path.basename(pathname)));
  } catch (e) {
    if (e?.code !== "ENOENT") console.error("[storage] could not delete file:", e?.message);
  }
}

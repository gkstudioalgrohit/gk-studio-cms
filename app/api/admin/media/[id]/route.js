import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { z } from "zod";
import { put } from "@vercel/blob";
import sizeOf from "image-size";
import { deleteMedia, replaceMediaFile, updateMediaMeta } from "@/lib/media.js";
import { safeFilename, saveLocalFile, storageMode } from "@/lib/storage.js";
import { ALLOWED_MIMES, kindOfMime, maxBytesFor, sniffMime } from "@/lib/filetypes.js";
import { withAdmin, jsonError } from "@/lib/request-auth.js";

export const runtime = "nodejs";

const metaSchema = z.object({ alt: z.string().max(300).optional(), caption: z.string().max(500).optional() });

export const PATCH = withAdmin(async (request, { params }) => {
  const body = await request.json().catch(() => ({}));
  const updated = await updateMediaMeta(params.id, metaSchema.parse(body));
  return NextResponse.json({ media: updated });
});

// Replace the file behind this media record (multipart upload). Every section
// that references this media id shows the new file immediately.
export const PUT = withAdmin(async (request, { params }) => {
  const mode = storageMode();
  if (mode === "none") return jsonError(503, "File storage is not configured yet. Add BLOB_READ_WRITE_TOKEN — see the README.");
  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") return jsonError(400, "No file received.");
  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffMime(buffer);
  if (!sniffed || !ALLOWED_MIMES.includes(sniffed)) return jsonError(400, "This file's contents don't match a supported image or video format.");
  const kind = kindOfMime(sniffed);
  if (buffer.length > maxBytesFor(kind)) return jsonError(400, `${kind === "video" ? "Videos" : "Images"} can be at most ${maxBytesFor(kind) / 1048576} MB.`);

  const filename = safeFilename(file.name);
  let dims = {};
  if (kind === "image" && sniffed !== "image/avif") {
    try { dims = sizeOf(buffer); } catch {}
  }
  let stored;
  if (mode === "blob") {
    const blob = await put(`uploads/${crypto.randomUUID()}-${filename}`, buffer, { access: "public", contentType: sniffed, addRandomSuffix: false });
    stored = { storage: "blob", url: blob.url, pathname: blob.pathname };
  } else {
    const local = await saveLocalFile(buffer, filename);
    stored = { storage: "local", url: local.url, pathname: local.pathname };
  }
  const updated = await replaceMediaFile(params.id, { kind, mime: sniffed, filename, size: buffer.length, width: dims.width, height: dims.height, ...stored });
  return NextResponse.json({ media: updated });
});

export const DELETE = withAdmin(async (request, { params }) => {
  const { searchParams } = new URL(request.url);
  await deleteMedia(params.id, { force: searchParams.get("force") === "1" });
  return NextResponse.json({ ok: true });
});

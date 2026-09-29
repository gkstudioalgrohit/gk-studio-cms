import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { put } from "@vercel/blob";
import sizeOf from "image-size";
import { createMedia, listMedia } from "@/lib/media.js";
import { safeFilename, saveLocalFile, storageMode } from "@/lib/storage.js";
import { ALLOWED_MIMES, kindOfMime, maxBytesFor, sniffMime } from "@/lib/filetypes.js";
import { withAdmin, jsonError } from "@/lib/request-auth.js";

export const runtime = "nodejs";

export const GET = withAdmin(async (request) => {
  const { searchParams } = new URL(request.url);
  const result = await listMedia({
    q: searchParams.get("q") || "",
    kind: searchParams.get("kind") || "",
    limit: Number(searchParams.get("limit")) || 48,
    offset: Number(searchParams.get("offset")) || 0,
  });
  return NextResponse.json(result);
});

function imageDims(buffer, mime) {
  if (mime === "image/avif") return {}; // avif dimension parsing is unreliable across environments
  try {
    const d = sizeOf(buffer);
    return { width: d.width, height: d.height };
  } catch {
    return {};
  }
}

export const POST = withAdmin(async (request) => {
  const mode = storageMode();
  if (mode === "none") return jsonError(503, "File storage is not configured yet. Add BLOB_READ_WRITE_TOKEN — see the README.");

  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") return jsonError(400, "No file received.");
  if (!ALLOWED_MIMES.includes(file.type)) return jsonError(400, "Unsupported file type. Use JPG, PNG, WEBP, AVIF, MP4, WEBM or MOV.");

  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffMime(buffer);
  if (!sniffed || !ALLOWED_MIMES.includes(sniffed)) {
    return jsonError(400, "This file's contents don't match a supported image or video format.");
  }
  const kind = kindOfMime(sniffed);
  if (buffer.length > maxBytesFor(kind)) return jsonError(400, `${kind === "video" ? "Videos" : "Images"} can be at most ${maxBytesFor(kind) / 1048576} MB.`);

  const filename = safeFilename(file.name);
  const dims = kind === "image" ? imageDims(buffer, sniffed) : {};

  let stored;
  if (mode === "blob") {
    const blob = await put(`uploads/${crypto.randomUUID()}-${filename}`, buffer, {
      access: "public",
      contentType: sniffed,
      addRandomSuffix: false,
    });
    stored = { storage: "blob", url: blob.url, pathname: blob.pathname };
  } else {
    const local = await saveLocalFile(buffer, filename);
    stored = { storage: "local", url: local.url, pathname: local.pathname };
  }

  const record = await createMedia({
    kind, mime: sniffed, filename, size: buffer.length, ...dims, ...stored,
  });
  return NextResponse.json({ media: record });
});

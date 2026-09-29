// Serves files saved by the local-storage fallback (lib/storage.js).
// Only reachable when BLOB_READ_WRITE_TOKEN is unset — i.e. local development.
import { readLocalFile, storageMode } from "@/lib/storage.js";

export async function GET(_request, { params }) {
  if (storageMode() !== "local") return new Response("Not found", { status: 404 });
  const buf = await readLocalFile(params.name);
  if (!buf) return new Response("Not found", { status: 404 });
  const ext = params.name.split(".").pop().toLowerCase();
  const type =
    { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime" }[ext] ||
    "application/octet-stream";
  return new Response(buf, { headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" } });
}

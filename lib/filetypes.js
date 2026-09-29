// Upload rules. The server checks the real file bytes (not just the extension).
export const IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
export const VIDEO_MIMES = ["video/mp4", "video/webm", "video/quicktime"];
export const ALLOWED_MIMES = [...IMAGE_MIMES, ...VIDEO_MIMES];
export const MAX_IMAGE_BYTES = 30 * 1024 * 1024; // 30 MB
export const MAX_VIDEO_BYTES = 500 * 1024 * 1024; // 500 MB

export const kindOfMime = (m) => (IMAGE_MIMES.includes(m) ? "image" : VIDEO_MIMES.includes(m) ? "video" : null);
export const maxBytesFor = (kind) => (kind === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES);

const ascii = (b, from, to) => String.fromCharCode(...b.slice(from, to));

// Identify a file from its first bytes. Returns a mime type or null.
export function sniffMime(buf) {
  const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && ascii(b, 1, 4) === "PNG") return "image/png";
  if (ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 12) === "WEBP") return "image/webp";
  if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return "video/webm";
  if (ascii(b, 4, 8) === "ftyp") {
    const brand = ascii(b, 8, 12);
    if (brand === "avif" || brand === "avis") return "image/avif";
    if (["heic", "heix", "hevc", "mif1", "msf1"].includes(brand)) return null; // HEIC not supported by browsers
    if (brand === "qt  ") return "video/quicktime";
    return "video/mp4";
  }
  return null;
}

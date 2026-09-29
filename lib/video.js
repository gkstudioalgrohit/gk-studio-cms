// Parses YouTube / Vimeo links into a safe embed URL. Used by admin validation
// and by the public video player, so only known providers are ever embedded.
export function parseVideoUrl(input) {
  const raw = String(input || "").trim();
  if (!raw) return null;
  let u;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;
  const host = u.hostname.toLowerCase().replace(/^(www|m|music)\./, "");
  const seg = u.pathname.split("/").filter(Boolean);

  if (host === "youtu.be" || host === "youtube.com" || host === "youtube-nocookie.com") {
    let id = "";
    if (host === "youtu.be") id = seg[0] || "";
    else if (u.searchParams.get("v")) id = u.searchParams.get("v");
    else if (["embed", "shorts", "live", "v"].includes(seg[0])) id = seg[1] || "";
    if (!/^[\w-]{11}$/.test(id)) return null;
    return { provider: "youtube", id, embedUrl: `https://www.youtube-nocookie.com/embed/${id}` };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const parts = seg[0] === "video" ? seg.slice(1) : seg;
    const id = parts[0] || "";
    if (!/^\d{5,12}$/.test(id)) return null;
    let hash = u.searchParams.get("h") || (parts[1] && /^[a-z0-9]+$/i.test(parts[1]) ? parts[1] : "");
    if (hash && !/^[a-z0-9]+$/i.test(hash)) hash = "";
    return {
      provider: "vimeo",
      id,
      hash,
      embedUrl: `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ""}`,
    };
  }
  return null;
}

export function withAutoplay(embedUrl) {
  return embedUrl + (embedUrl.includes("?") ? "&" : "?") + "autoplay=1&rel=0";
}

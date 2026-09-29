// Resolves a media id from the CMS into an <img>. Falls back to nothing if
// the id is empty/missing rather than a broken image icon.
export default function Media({ site, id, className, sizes }) {
  const m = site.media[id];
  if (!m || m.kind !== "image") return null;
  return <img src={m.url} alt={m.alt || ""} className={className} width={m.width || undefined} height={m.height || undefined} loading="lazy" sizes={sizes} />;
}

"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/admin-api.js";

const fmtSize = (n) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);
const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

export default function MediaLibraryPage() {
  const [items, setItems] = useState([]);
  const [kind, setKind] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const fileRef = useRef(null);

  function refresh() {
    setLoading(true);
    api(`/media?kind=${kind}&q=${encodeURIComponent(q)}&limit=100`).then((d) => setItems(d.items)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }
  useEffect(refresh, [kind]);

  async function onUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true); setError("");
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        await api("/media", { method: "POST", body: fd });
      }
      refresh();
    } catch (e2) {
      setError(e2.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Media Library</h1>
      <p style={{ color: "#8c8880", fontSize: 14, marginBottom: 20 }}>Upload, search, and manage every photo and video. Replacing a file here updates it everywhere it's used.</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <input className="gk-field" style={{ maxWidth: 260 }} placeholder="Search filename, alt or caption…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && refresh()} />
        <select className="gk-field" style={{ maxWidth: 160 }} value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="">All types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
        <button className="gk-btn gk-btn-outline" onClick={refresh}>Search</button>
        <button className="gk-btn gk-btn-primary" onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? "Uploading…" : "Upload files"}</button>
        <input ref={fileRef} type="file" multiple hidden accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime" onChange={onUpload} />
      </div>

      {error && <p style={{ color: "#b3311f", fontSize: 13.5, marginBottom: 12 }}>{error}</p>}
      {loading ? (
        <p style={{ color: "#8c8880" }}>Loading…</p>
      ) : items.length === 0 ? (
        <p style={{ color: "#8c8880" }}>No files yet.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
          {items.map((m) => (
            <button key={m.id} onClick={() => setSelected(m)} className="gk-card" style={{ padding: 0, overflow: "hidden", textAlign: "left", cursor: "pointer" }}>
              <div style={{ aspectRatio: "4/3", background: "#f0efe9", position: "relative" }}>
                {m.kind === "video" ? <video src={m.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted /> : <img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                {m.isPlaceholder && <span style={{ position: "absolute", top: 6, left: 6, background: "#b08d57", color: "#fff", fontSize: 10, padding: "2px 6px", borderRadius: 4 }}>Placeholder</span>}
              </div>
              <div style={{ padding: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.filename}</p>
                <p style={{ fontSize: 10.5, color: "#8c8880" }}>{m.width ? `${m.width}×${m.height} · ` : ""}{fmtSize(m.size)}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && <MediaDetail media={selected} onClose={() => setSelected(null)} onChanged={() => { refresh(); setSelected(null); }} />}
    </div>
  );
}

function MediaDetail({ media, onClose, onChanged }) {
  const [alt, setAlt] = useState(media.alt);
  const [caption, setCaption] = useState(media.caption);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const replaceRef = useRef(null);

  async function saveMeta() {
    setBusy(true); setError("");
    try { await api(`/media/${media.id}`, { method: "PATCH", body: JSON.stringify({ alt, caption }) }); onChanged(); }
    catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function replaceFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setError("");
    try {
      const fd = new FormData(); fd.append("file", file);
      await api(`/media/${media.id}`, { method: "PUT", body: fd });
      onChanged();
    } catch (e2) { setError(e2.message); } finally { setBusy(false); }
  }
  async function del(force) {
    setBusy(true); setError("");
    try { await api(`/media/${media.id}${force ? "?force=1" : ""}`, { method: "DELETE" }); onChanged(); }
    catch (e) {
      if (e.message.includes("used in") && !force) {
        if (confirm(`${e.message}\n\nDelete anyway and remove it from those sections?`)) return del(true);
      } else setError(e.message);
    } finally { setBusy(false); }
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,19,16,.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} className="gk-card" style={{ width: "100%", maxWidth: 520, maxHeight: "86vh", overflowY: "auto", padding: 20 }}>
        <div style={{ aspectRatio: "16/10", background: "#f0efe9", borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
          {media.kind === "video" ? <video src={media.url} controls style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <img src={media.url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />}
        </div>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{media.filename}</p>
        <p style={{ fontSize: 11.5, color: "#8c8880", marginBottom: 14 }}>
          {media.width ? `${media.width}×${media.height} · ` : ""}{fmtSize(media.size)} · uploaded {media.createdAt ? fmtDate(media.createdAt) : "—"}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          <div><label className="gk-label">Alt text</label><input className="gk-field" value={alt} onChange={(e) => setAlt(e.target.value)} /></div>
          <div><label className="gk-label">Caption</label><input className="gk-field" value={caption} onChange={(e) => setCaption(e.target.value)} /></div>
        </div>

        {error && <p style={{ color: "#b3311f", fontSize: 13, marginBottom: 10 }}>{error}</p>}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="gk-btn gk-btn-primary" onClick={saveMeta} disabled={busy}>Save details</button>
          <button className="gk-btn gk-btn-outline" onClick={() => replaceRef.current?.click()} disabled={busy}>Replace file</button>
          <input ref={replaceRef} type="file" hidden accept={media.kind === "video" ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp,image/avif"} onChange={replaceFile} />
          <button className="gk-btn gk-btn-danger" onClick={() => del(false)} disabled={busy}>Delete</button>
          <button className="gk-btn gk-btn-outline" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/admin-api.js";

// A slot that shows the currently chosen image/video and opens a library
// modal (with an upload tab) to pick or replace it. This is the "Replace Image"
// workflow the whole homepage CMS is built around.
export default function MediaPicker({ mediaId, kind, onChange, label }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!mediaId) { setCurrent(null); return; }
    api(`/media?kind=${kind}&limit=100`).then((d) => {
      if (!cancelled) setCurrent(d.items.find((m) => m.id === mediaId) || null);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [mediaId, kind]);

  return (
    <div>
      {label && <label className="gk-label">{label}</label>}
      <div style={{ border: "1px dashed #d8d5cd", borderRadius: 10, padding: 12, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 88, height: 66, borderRadius: 6, overflow: "hidden", background: "#f0efe9", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {current ? (
            current.kind === "video" ? <video src={current.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted /> : <img src={current.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 11, color: "#aaa6a6" }}>None</span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{current?.filename || "No file selected"}</p>
          {current?.isPlaceholder && <p style={{ fontSize: 11.5, color: "#b08d57" }}>Placeholder — replace with a real {kind}</p>}
        </div>
        <button type="button" className="gk-btn gk-btn-outline" onClick={() => setOpen(true)}>{current ? "Replace" : "Choose"}</button>
        {current && (
          <button type="button" className="gk-btn gk-btn-outline" onClick={() => onChange(null)} aria-label="Remove">✕</button>
        )}
      </div>
      {open && (
        <LibraryModal
          kind={kind}
          onClose={() => setOpen(false)}
          onPick={(m) => { onChange(m.id); setOpen(false); }}
        />
      )}
    </div>
  );
}

function LibraryModal({ kind, onClose, onPick }) {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  function refresh(query = q) {
    setLoading(true);
    api(`/media?kind=${kind}&q=${encodeURIComponent(query)}&limit=100`).then((d) => setItems(d.items)).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }
  useEffect(() => { refresh(""); }, [kind]);

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { media } = await api("/media", { method: "POST", body: fd });
      onPick(media);
    } catch (e2) {
      setError(e2.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(20,19,16,.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} className="gk-card" style={{ width: "100%", maxWidth: 720, maxHeight: "82vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e6e4df", display: "flex", gap: 12, alignItems: "center" }}>
          <strong style={{ fontSize: 15 }}>Choose {kind}</strong>
          <input className="gk-field" placeholder="Search…" value={q} onChange={(e) => { setQ(e.target.value); refresh(e.target.value); }} style={{ flex: 1 }} />
          <button className="gk-btn gk-btn-primary" onClick={() => fileRef.current?.click()} disabled={uploading}>{uploading ? "Uploading…" : "Upload new"}</button>
          <input ref={fileRef} type="file" hidden accept={kind === "video" ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp,image/avif"} onChange={onUpload} />
          <button className="gk-btn gk-btn-outline" onClick={onClose}>Close</button>
        </div>
        {error && <p style={{ color: "#b3311f", fontSize: 13, padding: "8px 20px" }}>{error}</p>}
        <div style={{ padding: 16, overflowY: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
          {loading && <p style={{ color: "#8c8880" }}>Loading…</p>}
          {!loading && items.length === 0 && <p style={{ color: "#8c8880" }}>No {kind}s yet — upload one above.</p>}
          {items.map((m) => (
            <button key={m.id} onClick={() => onPick(m)} style={{ border: "1px solid #e6e4df", borderRadius: 8, overflow: "hidden", cursor: "pointer", background: "#fff", padding: 0 }}>
              <div style={{ aspectRatio: "4/3", background: "#f0efe9" }}>
                {m.kind === "video" ? <video src={m.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted /> : <img src={m.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <p style={{ fontSize: 11, padding: "4px 6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.filename}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

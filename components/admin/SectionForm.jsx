"use client";
import { useEffect, useState, useCallback } from "react";
import { getSection, saveSection } from "@/lib/admin-api.js";
import SaveBar from "./SaveBar";

// Shared load/edit/dirty-check/save lifecycle for every homepage-section editor.
export default function SectionForm({ sectionKey, title, description, children }) {
  const [data, setData] = useState(null);
  const [original, setOriginal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const load = useCallback(() => {
    setError(""); setData(null);
    getSection(sectionKey).then((d) => { setData(d); setOriginal(d); }).catch((e) => setError(e.message));
  }, [sectionKey]);
  useEffect(load, [load]);

  const dirty = data && original && JSON.stringify(data) !== JSON.stringify(original);

  async function onSave() {
    setSaving(true); setError(""); setSaved(false);
    try {
      const result = await saveSection(sectionKey, data);
      setData(result); setOriginal(result); setSaved(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (error && !data) {
    return (
      <div className="gk-card" style={{ padding: 20, color: "#b3311f" }}>
        Couldn't load this section: {error}. <button className="gk-btn gk-btn-outline" style={{ marginLeft: 8 }} onClick={load}>Retry</button>
      </div>
    );
  }
  if (!data) return <p style={{ color: "#8c8880" }}>Loading…</p>;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>{title}</h1>
        {description && <p style={{ color: "#8c8880", fontSize: 14, marginTop: 4 }}>{description}</p>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 760 }}>
        {children(data, (patch) => setData((d) => ({ ...d, ...patch })), setData)}
      </div>
      <SaveBar dirty={dirty} saving={saving} error={error} saved={saved} onSave={onSave} onReset={() => { setData(original); setError(""); setSaved(false); }} />
    </div>
  );
}

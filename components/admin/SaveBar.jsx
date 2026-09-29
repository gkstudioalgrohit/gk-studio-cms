export default function SaveBar({ dirty, saving, error, saved, onSave, onReset }) {
  return (
    <div style={{ position: "sticky", bottom: 0, display: "flex", alignItems: "center", gap: 12, padding: "14px 0", background: "linear-gradient(to top, #fafaf9 70%, transparent)" }}>
      <button className="gk-btn gk-btn-primary" disabled={!dirty || saving} onClick={onSave}>
        {saving ? "Saving…" : "Save changes"}
      </button>
      {dirty && !saving && (
        <button className="gk-btn gk-btn-outline" onClick={onReset}>Discard</button>
      )}
      {error && <span style={{ color: "#b3311f", fontSize: 13.5 }}>{error}</span>}
      {saved && !dirty && !error && <span style={{ color: "#3f7a3f", fontSize: 13.5 }}>Saved ✓ — live on the website now</span>}
    </div>
  );
}

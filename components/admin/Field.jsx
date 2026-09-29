export function Field({ label, hint, children }) {
  return (
    <div>
      {label && <label className="gk-label">{label}</label>}
      {children}
      {hint && <p style={{ fontSize: 12, color: "#8c8880", marginTop: 6 }}>{hint}</p>}
    </div>
  );
}
export function Input(props) { return <input className="gk-field" {...props} />; }
export function Textarea(props) { return <textarea className="gk-field" rows={4} {...props} />; }
export function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13.5, cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

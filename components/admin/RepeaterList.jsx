"use client";
// Add / remove / reorder for a list of items (films, testimonials, nav links...).
// Reordering uses explicit Up/Down controls rather than drag-and-drop — simpler
// to use correctly on both desktop and mobile, and the resulting order is what
// the public site renders either way.
export default function RepeaterList({ items, onChange, renderItem, newItem, addLabel = "Add item", max = 24, empty }) {
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const update = (i, patch) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, newItem()]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {items.length === 0 && empty && <p style={{ color: "#8c8880", fontSize: 13.5 }}>{empty}</p>}
      {items.map((item, i) => (
        <div key={item.id ?? i} className="gk-card" style={{ padding: 16, position: "relative" }}>
          <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 4 }}>
            <button type="button" className="gk-btn gk-btn-outline" style={{ padding: "4px 8px" }} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">↑</button>
            <button type="button" className="gk-btn gk-btn-outline" style={{ padding: "4px 8px" }} disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down">↓</button>
            <button type="button" className="gk-btn gk-btn-danger" style={{ padding: "4px 8px" }} onClick={() => remove(i)} aria-label="Remove">✕</button>
          </div>
          <div style={{ paddingRight: 90 }}>{renderItem(item, (patch) => update(i, patch), i)}</div>
        </div>
      ))}
      {items.length < max && (
        <button type="button" className="gk-btn gk-btn-outline" style={{ alignSelf: "flex-start" }} onClick={add}>+ {addLabel}</button>
      )}
    </div>
  );
}

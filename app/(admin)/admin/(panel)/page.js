import Link from "next/link";
import { hasDatabase } from "@/lib/db.js";
import { mediaStats } from "@/lib/media.js";
import { storageMode } from "@/lib/storage.js";

const QUICK = [
  { href: "/admin/media", label: "Upload photos or videos" },
  { href: "/admin/hero", label: "Edit the hero section" },
  { href: "/admin/films", label: "Edit films" },
  { href: "/admin/stories", label: "Add a wedding story" },
];

export default async function DashboardPage() {
  const db = hasDatabase();
  const stats = db ? await mediaStats().catch(() => null) : null;
  const mode = storageMode();

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Overview</h1>
      <p style={{ color: "#8c8880", fontSize: 14, marginBottom: 28 }}>Everything here updates the live website immediately when you save.</p>

      {(!db || mode === "none") && (
        <div className="gk-card" style={{ padding: 18, marginBottom: 24, borderColor: "#f0d3ce", background: "#fdf6f5" }}>
          <p style={{ fontWeight: 600, marginBottom: 4 }}>Setup needed</p>
          {!db && <p style={{ fontSize: 13.5 }}>No database is connected yet — content is showing defaults. Add <code>DATABASE_URL</code> in your Vercel project settings.</p>}
          {db && mode === "none" && <p style={{ fontSize: 13.5 }}>No file storage is connected — uploads are disabled. Add <code>BLOB_READ_WRITE_TOKEN</code> (Vercel Storage → Blob).</p>}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 32 }}>
        <StatCard label="Media files" value={stats?.total ?? "—"} />
        <StatCard label="Photos" value={stats?.images ?? "—"} />
        <StatCard label="Videos" value={stats?.videos ?? "—"} />
        <StatCard label="Placeholders left" value={stats?.placeholders ?? "—"} hint={stats?.placeholders ? "Replace these with real photos" : undefined} />
      </div>

      <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Quick actions</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {QUICK.map((q) => (
          <Link key={q.href} href={q.href} className="gk-btn gk-btn-outline">{q.label}</Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="gk-card" style={{ padding: 16 }}>
      <p style={{ fontSize: 26, fontWeight: 700 }}>{value}</p>
      <p style={{ fontSize: 12.5, color: "#8c8880" }}>{label}</p>
      {hint && <p style={{ fontSize: 11, color: "#b08d57", marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

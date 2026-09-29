"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Sign in failed.");
      router.replace("/admin");
      router.refresh();
    } catch (e2) {
      setError(e2.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <form onSubmit={onSubmit} className="gk-card" style={{ width: "100%", maxWidth: 380, padding: 32 }}>
        <p style={{ fontSize: 12, letterSpacing: "0.08em", color: "#b08d57", fontWeight: 700, marginBottom: 6 }}>GK STUDIO</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>Admin sign in</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="gk-label">Email</label>
            <input className="gk-field" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="gk-label">Password</label>
            <input className="gk-field" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>

        {error && <p style={{ color: "#b3311f", fontSize: 13.5, marginTop: 16 }}>{error}</p>}

        <button className="gk-btn gk-btn-primary" style={{ width: "100%", marginTop: 22, padding: "11px 0" }} disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/admin-api.js";
import { Field, Input } from "@/components/admin/Field";

export default function ProfileAdminPage() {
  const [me, setMe] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    api("/me").then((d) => { setMe(d.user); setName(d.user.name || ""); setEmail(d.user.email); });
  }, []);

  async function onSave(e) {
    e.preventDefault();
    setSaving(true); setError(""); setOk(false);
    try {
      await api("/profile", { method: "POST", body: JSON.stringify({ name, email, currentPassword: currentPassword || undefined, newPassword: newPassword || undefined }) });
      setOk(true); setCurrentPassword(""); setNewPassword("");
    } catch (e2) {
      setError(e2.message);
    } finally {
      setSaving(false);
    }
  }

  if (!me) return <p style={{ color: "#8c8880" }}>Loading…</p>;

  return (
    <div style={{ maxWidth: 480 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Admin Profile</h1>
      <p style={{ color: "#8c8880", fontSize: 14, marginBottom: 24 }}>Changing your email or password requires your current password, and signs you out on other devices.</p>

      <form onSubmit={onSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <div style={{ borderTop: "1px solid #e6e4df", paddingTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Current password" hint="Required only if you change your email or set a new password."><Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></Field>
          <Field label="New password" hint="Leave blank to keep your current password."><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></Field>
        </div>
        {error && <p style={{ color: "#b3311f", fontSize: 13.5 }}>{error}</p>}
        {ok && <p style={{ color: "#3f7a3f", fontSize: 13.5 }}>Saved.</p>}
        <button className="gk-btn gk-btn-primary" style={{ alignSelf: "flex-start" }} disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
      </form>
    </div>
  );
}

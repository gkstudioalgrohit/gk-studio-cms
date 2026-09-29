"use client";
import { useEffect, useState } from "react";
import { getSection, saveSection } from "@/lib/admin-api.js";
import RepeaterList from "@/components/admin/RepeaterList";
import SaveBar from "@/components/admin/SaveBar";
import { Field, Input } from "@/components/admin/Field";
import { newId } from "@/lib/schemas.js";

const LinkRow = (link, update) => (
  <div style={{ display: "flex", gap: 12 }}>
    <Field label="Label"><Input value={link.label} onChange={(e) => update({ label: e.target.value })} /></Field>
    <Field label="Link" hint="https://..., /path, #section, mailto: or tel:"><Input value={link.href} onChange={(e) => update({ href: e.target.value })} /></Field>
  </div>
);

// Nav + footer link Iive in two sections but are edited on one page since
// they're the same kind of thing and usually change together.
export default function NavigationAdminPage() {
  const [nav, setNav] = useState(null);
  const [footer, setFooter] = useState(null);
  const [origNav, setOrigNav] = useState(null);
  const [origFooter, setOrigFooter] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function load() {
    setError("");
    Promise.all([getSection("nav"), getSection("footer")])
      .then(([n, f]) => { setNav(n); setOrigNav(n); setFooter(f); setOrigFooter(f); })
      .catch((e) => setError(e.message));
  }
  useEffect(load, []);

  const dirty = nav && footer && (JSON.stringify(nav) !== JSON.stringify(origNav) || JSON.stringify(footer) !== JSON.stringify(origFooter));

  async function onSave() {
    setSaving(true); setError(""); setSaved(false);
    try {
      const [n, f] = await Promise.all([saveSection("nav", nav), saveSection("footer", footer)]);
      setNav(n); setOrigNav(n); setFooter(f); setOrigFooter(f); setSaved(true);
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  }

  if (!nav || !footer) return <p style={{ color: "#8c8880" }}>{error || "Loading…"}</p>;

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Navigation & Footer</h1>
      <p style={{ color: "#8c8880", fontSize: 14, marginBottom: 24 }}>Links that don't lead anywhere yet (like Blogs or FAQ) are automatically hidden on the website until there's content for them.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 760 }}>
        <section>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Left navigation links</h2>
          <RepeaterList items={nav.left} onChange={(left) => setNav({ ...nav, left })} newItem={() => ({ label: "", href: "" })} addLabel="Add link" max={8} renderItem={LinkRow} />
        </section>
        <section>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Right navigation links</h2>
          <RepeaterList items={nav.right} onChange={(right) => setNav({ ...nav, right })} newItem={() => ({ label: "", href: "" })} addLabel="Add link" max={8} renderItem={LinkRow} />
        </section>
        <section>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Footer locations</h2>
          <Field hint="Comma-separated, shown at the top of the footer.">
            <Input value={footer.locations.join(", ")} onChange={(e) => setFooter({ ...footer, locations: e.target.value.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 10) })} />
          </Field>
        </section>
        <section>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Footer links</h2>
          <RepeaterList items={footer.links} onChange={(links) => setFooter({ ...footer, links })} newItem={() => ({ label: "", href: "" })} addLabel="Add link" max={14} renderItem={LinkRow} />
        </section>
      </div>

      <SaveBar dirty={dirty} saving={saving} error={error} saved={saved} onSave={onSave} onReset={() => { setNav(origNav); setFooter(origFooter); setError(""); setSaved(false); }} />
    </div>
  );
}

"use client";
import SectionForm from "@/components/admin/SectionForm";
import MediaPicker from "@/components/admin/MediaPicker";
import { Field, Input, Textarea } from "@/components/admin/Field";

function PageSeoFields({ page, update, name }) {
  return (
    <div className="gk-card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{ fontWeight: 700, fontSize: 13.5 }}>{name}</p>
      <Field label="Page title override" hint="Leave blank to use the global title above."><Input value={page.title} onChange={(e) => update({ title: e.target.value })} /></Field>
      <Field label="Page description override"><Textarea rows={2} value={page.description} onChange={(e) => update({ description: e.target.value })} /></Field>
      <MediaPicker label="Social share image override" kind="image" mediaId={page.ogMediaId} onChange={(id) => update({ ogMediaId: id })} />
      <Field label="Canonical URL override" hint="Only needed in special cases — leave blank normally."><Input value={page.canonical} onChange={(e) => update({ canonical: e.target.value })} /></Field>
    </div>
  );
}

export default function SeoAdminPage() {
  return (
    <SectionForm sectionKey="seo" title="SEO & Sharing" description="Controls what shows up in Google and when the site is shared on social media.">
      {(data, set) => (
        <>
          <Field label="Website title" hint="Used in the browser tab and search results."><Input value={data.title} onChange={(e) => set({ title: e.target.value })} /></Field>
          <Field label="Meta description"><Textarea rows={3} value={data.description} onChange={(e) => set({ description: e.target.value })} /></Field>
          <Field label="Keywords (optional)"><Input value={data.keywords} onChange={(e) => set({ keywords: e.target.value })} /></Field>
          <Field label="Social share title (Open Graph)" hint="Leave blank to reuse the website title."><Input value={data.ogTitle} onChange={(e) => set({ ogTitle: e.target.value })} /></Field>
          <Field label="Social share description"><Textarea rows={2} value={data.ogDescription} onChange={(e) => set({ ogDescription: e.target.value })} /></Field>
          <MediaPicker label="Default social share image" kind="image" mediaId={data.ogMediaId} onChange={(id) => set({ ogMediaId: id })} />

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p className="gk-label">Per-page overrides</p>
            <PageSeoFields name="Homepage" page={data.pages.home} update={(p) => set({ pages: { ...data.pages, home: { ...data.pages.home, ...p } } })} />
            <PageSeoFields name="Stories index" page={data.pages.stories} update={(p) => set({ pages: { ...data.pages, stories: { ...data.pages.stories, ...p } } })} />
          </div>
        </>
      )}
    </SectionForm>
  );
}

"use client";
import SectionForm from "@/components/admin/SectionForm";
import RepeaterList from "@/components/admin/RepeaterList";
import MediaPicker from "@/components/admin/MediaPicker";
import { Field, Input } from "@/components/admin/Field";
import { newId } from "@/lib/schemas.js";

export default function PhotographyAdminPage() {
  return (
    <SectionForm sectionKey="photography" title="Photography" description="The three-up photo showcase on the homepage.">
      {(data, set) => (
        <>
          <Field label="Eyebrow label"><Input value={data.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} /></Field>
          <Field label="Section title"><Input value={data.title} onChange={(e) => set({ title: e.target.value })} /></Field>
          <div style={{ display: "flex", gap: 12 }}>
            <Field label="Button label"><Input value={data.buttonLabel} onChange={(e) => set({ buttonLabel: e.target.value })} /></Field>
            <Field label="Button link"><Input value={data.buttonHref} onChange={(e) => set({ buttonHref: e.target.value })} placeholder="https:// or /path — left as /stories by default" /></Field>
          </div>

          <RepeaterList
            items={data.items}
            onChange={(items) => set({ items })}
            addLabel="Add photo"
            max={12}
            newItem={() => ({ id: newId(), mediaId: null, alt: "", title: "", subtitle: "", href: "" })}
            renderItem={(item, update) => (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <MediaPicker label="Photo" kind="image" mediaId={item.mediaId} onChange={(id) => update({ mediaId: id })} />
                <div style={{ display: "flex", gap: 12 }}>
                  <Field label="Title"><Input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="WEDDING STORY 01" /></Field>
                  <Field label="Location / subtitle"><Input value={item.subtitle} onChange={(e) => update({ subtitle: e.target.value })} placeholder="GOA" /></Field>
                </div>
                <Field label="Link (optional)" hint="e.g. to a wedding story once you've published one"><Input value={item.href} onChange={(e) => update({ href: e.target.value })} /></Field>
              </div>
            )}
          />
        </>
      )}
    </SectionForm>
  );
}

"use client";
import SectionForm from "@/components/admin/SectionForm";
import RepeaterList from "@/components/admin/RepeaterList";
import { Field, Input, Textarea, Toggle } from "@/components/admin/Field";
import { newId } from "@/lib/schemas.js";

export default function TestimonialsAdminPage() {
  return (
    <SectionForm sectionKey="testimonials" title="Testimonials" description="Real client reviews only — this section is hidden on the website until you add at least one.">
      {(data, set) => (
        <>
          <Toggle label="Show this section (once it has at least one published testimonial)" checked={data.enabled} onChange={(v) => set({ enabled: v })} />
          <Field label="Heading"><Textarea rows={2} value={data.title} onChange={(e) => set({ title: e.target.value })} /></Field>
          <RepeaterList
            items={data.items}
            onChange={(items) => set({ items })}
            addLabel="Add testimonial"
            max={24}
            empty="No testimonials yet — add your first real client review."
            newItem={() => ({ id: newId(), name: "", text: "", tag: "", published: false })}
            renderItem={(t, update) => (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Field label="Client name"><Input value={t.name} onChange={(e) => update({ name: e.target.value })} placeholder="e.g. Amara & Vikram" /></Field>
                <Field label="Review"><Textarea rows={3} value={t.text} onChange={(e) => update({ text: e.target.value })} /></Field>
                <Field label="Tag shown under the review" hint="e.g. COUPLE NAME — CITY"><Input value={t.tag} onChange={(e) => update({ tag: e.target.value })} /></Field>
                <Toggle label="Published (visible on the website)" checked={t.published} onChange={(v) => update({ published: v })} />
              </div>
            )}
          />
        </>
      )}
    </SectionForm>
  );
}

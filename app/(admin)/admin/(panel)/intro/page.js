"use client";
import SectionForm from "@/components/admin/SectionForm";
import MediaPicker from "@/components/admin/MediaPicker";
import { Field, Input, Textarea } from "@/components/admin/Field";

export default function IntroAdminPage() {
  return (
    <SectionForm sectionKey="intro" title="About / Intro" description="The introduction section just below the hero.">
      {(data, set) => (
        <>
          <Field label="Heading" hint="Use a new line for each line break shown on the site.">
            <Textarea rows={4} value={data.heading} onChange={(e) => set({ heading: e.target.value })} />
          </Field>
          <Field label="Paragraph"><Textarea rows={5} value={data.copy} onChange={(e) => set({ copy: e.target.value })} /></Field>
          <MediaPicker label="Image" kind="image" mediaId={data.mediaId} onChange={(id) => set({ mediaId: id })} />
          <Field label="Image alt text"><Input value={data.alt} onChange={(e) => set({ alt: e.target.value })} /></Field>
        </>
      )}
    </SectionForm>
  );
}

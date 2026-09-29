"use client";
import SectionForm from "@/components/admin/SectionForm";
import { Field, Input } from "@/components/admin/Field";

export default function SocialAdminPage() {
  return (
    <SectionForm sectionKey="social" title="Social Links" description="Used in the footer and anywhere else the website links to your profiles.">
      {(data, set) => (
        <>
          <Field label="Instagram" hint="Full URL, e.g. https://www.instagram.com/gkstudio_/"><Input value={data.instagram} onChange={(e) => set({ instagram: e.target.value })} /></Field>
          <Field label="Facebook"><Input value={data.facebook} onChange={(e) => set({ facebook: e.target.value })} /></Field>
          <Field label="YouTube"><Input value={data.youtube} onChange={(e) => set({ youtube: e.target.value })} /></Field>
        </>
      )}
    </SectionForm>
  );
}

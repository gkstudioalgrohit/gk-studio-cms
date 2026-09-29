"use client";
import SectionForm from "@/components/admin/SectionForm";
import { Field, Input, Toggle } from "@/components/admin/Field";

function TagsInput({ label, value, onChange, max }) {
  return (
    <Field label={label} hint={`Comma-separated, up to ${max}. Shown in capitals on the site.`}>
      <Input value={value.join(", ")} onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean).slice(0, max))} />
    </Field>
  );
}

export default function FeaturesAdminPage() {
  return (
    <SectionForm sectionKey="features" title="Featured / Press Marks" description="The scrolling row of words between the intro and the films section.">
      {(data, set) => (
        <>
          <Toggle label="Show this section" checked={data.enabled} onChange={(v) => set({ enabled: v })} />
          <TagsInput label="Top row" value={data.rowA} onChange={(rowA) => set({ rowA })} max={12} />
          <Field label="Center label"><Input value={data.label} onChange={(e) => set({ label: e.target.value })} /></Field>
          <TagsInput label="Bottom row" value={data.rowB} onChange={(rowB) => set({ rowB })} max={12} />
        </>
      )}
    </SectionForm>
  );
}

"use client";
import SectionForm from "@/components/admin/SectionForm";
import RepeaterList from "@/components/admin/RepeaterList";
import { Field, Input, Textarea, Toggle } from "@/components/admin/Field";
import { newId } from "@/lib/schemas.js";

export default function ContactAdminPage() {
  return (
    <SectionForm sectionKey="contact" title="Contact Information" description="Shown in the footer and used for the mailto / WhatsApp / call links across the site.">
      {(data, set) => (
        <>
          <Field label="Business name"><Input value={data.businessName} onChange={(e) => set({ businessName: e.target.value })} /></Field>
          <Field label="Address"><Textarea rows={2} value={data.address} onChange={(e) => set({ address: e.target.value })} /></Field>
          <Field label="Email"><Input type="email" value={data.email} onChange={(e) => set({ email: e.target.value })} /></Field>
          <Field label="Google Maps link (optional)"><Input value={data.mapsUrl} onChange={(e) => set({ mapsUrl: e.target.value })} /></Field>

          <div>
            <p className="gk-label" style={{ marginBottom: 10 }}>Phone numbers</p>
            <RepeaterList
              items={data.phones}
              onChange={(phones) => set({ phones })}
              addLabel="Add phone number"
              max={6}
              newItem={() => ({ id: newId(), label: "", number: "", whatsapp: false })}
              renderItem={(p, update) => (
                <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
                  <Field label="Label" hint="e.g. India, USA"><Input value={p.label} onChange={(e) => update({ label: e.target.value })} /></Field>
                  <Field label="Number"><Input value={p.number} onChange={(e) => update({ number: e.target.value })} placeholder="+91 75350 50804" /></Field>
                  <Toggle label="Link opens WhatsApp" checked={p.whatsapp} onChange={(v) => update({ whatsapp: v })} />
                </div>
              )}
            />
          </div>
        </>
      )}
    </SectionForm>
  );
}

"use client";
import SectionForm from "@/components/admin/SectionForm";
import MediaPicker from "@/components/admin/MediaPicker";
import { Field, Input, Textarea } from "@/components/admin/Field";

export default function SettingsAdminPage() {
  return (
    <SectionForm sectionKey="settings" title="Website Settings" description="Global brand basics used across the site.">
      {(data, set) => (
        <>
          <Field label="Website name"><Input value={data.siteName} onChange={(e) => set({ siteName: e.target.value })} /></Field>
          <Field label="Website URL" hint="Your live domain once connected, e.g. https://gkstudio.co.in — used for SEO tags and the sitemap."><Input value={data.websiteUrl} onChange={(e) => set({ websiteUrl: e.target.value })} /></Field>
          <div style={{ display: "flex", gap: 12 }}>
            <Field label="Logo text"><Input value={data.logoText} onChange={(e) => set({ logoText: e.target.value })} /></Field>
            <Field label="Logo subtitle"><Input value={data.logoSub} onChange={(e) => set({ logoSub: e.target.value })} /></Field>
          </div>
          <MediaPicker label="Logo image (optional — text logo is used if none is set)" kind="image" mediaId={data.logoMediaId} onChange={(id) => set({ logoMediaId: id })} />
          <MediaPicker label="Favicon (optional)" kind="image" mediaId={data.faviconMediaId} onChange={(id) => set({ faviconMediaId: id })} />
          <Field label="Footer text (optional)"><Textarea rows={2} value={data.footerText} onChange={(e) => set({ footerText: e.target.value })} /></Field>
          <Field label="Copyright text (optional)"><Input value={data.copyright} onChange={(e) => set({ copyright: e.target.value })} /></Field>
        </>
      )}
    </SectionForm>
  );
}

"use client";
import SectionForm from "@/components/admin/SectionForm";
import MediaPicker from "@/components/admin/MediaPicker";
import { Field, Input, Toggle } from "@/components/admin/Field";

export default function HeroAdminPage() {
  return (
    <SectionForm sectionKey="hero" title="Hero Section" description="The full-width image or video at the very top of the homepage.">
      {(data, set) => (
        <>
          <MediaPicker label="Hero image" kind="image" mediaId={data.mediaId} onChange={(id) => set({ mediaId: id })} />
          <Field label="Image alt text" hint="Describes the image for screen readers and search engines."><Input value={data.alt} onChange={(e) => set({ alt: e.target.value })} /></Field>

          <div style={{ borderTop: "1px solid #e6e4df", paddingTop: 16 }}>
            <p className="gk-label" style={{ marginBottom: 10 }}>Optional hero video (shown instead of the image if set)</p>
            <MediaPicker label="Background video" kind="video" mediaId={data.videoMediaId} onChange={(id) => set({ videoMediaId: id })} />
            {data.videoMediaId && (
              <div style={{ marginTop: 12 }}>
                <MediaPicker label="Poster image (shown while video loads)" kind="image" mediaId={data.posterMediaId} onChange={(id) => set({ posterMediaId: id })} />
                <div style={{ display: "flex", gap: 18, marginTop: 12 }}>
                  <Toggle label="Autoplay" checked={data.autoplay} onChange={(v) => set({ autoplay: v })} />
                  <Toggle label="Muted" checked={data.muted} onChange={(v) => set({ muted: v })} />
                  <Toggle label="Loop" checked={data.loop} onChange={(v) => set({ loop: v })} />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </SectionForm>
  );
}

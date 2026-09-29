"use client";
import SectionForm from "@/components/admin/SectionForm";
import RepeaterList from "@/components/admin/RepeaterList";
import MediaPicker from "@/components/admin/MediaPicker";
import { Field, Input } from "@/components/admin/Field";
import { newId } from "@/lib/schemas.js";

export default function FilmsAdminPage() {
  return (
    <SectionForm sectionKey="films" title="Films" description="The three-up film showcase on the homepage.">
      {(data, set) => (
        <>
          <Field label="Eyebrow label"><Input value={data.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} /></Field>
          <Field label="Section title"><Input value={data.title} onChange={(e) => set({ title: e.target.value })} /></Field>
          <div style={{ display: "flex", gap: 12 }}>
            <Field label="Button label"><Input value={data.buttonLabel} onChange={(e) => set({ buttonLabel: e.target.value })} /></Field>
            <Field label="Button link"><Input value={data.buttonHref} onChange={(e) => set({ buttonHref: e.target.value })} placeholder="https:// or /path" /></Field>
          </div>

          <RepeaterList
            items={data.items}
            onChange={(items) => set({ items })}
            addLabel="Add film"
            max={12}
            newItem={() => ({ id: newId(), mediaId: null, alt: "", title: "", subtitle: "", videoKind: "none", videoUrl: "", videoMediaId: null })}
            renderItem={(film, update) => (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <MediaPicker label="Thumbnail image" kind="image" mediaId={film.mediaId} onChange={(id) => update({ mediaId: id })} />
                <div style={{ display: "flex", gap: 12 }}>
                  <Field label="Title"><Input value={film.title} onChange={(e) => update({ title: e.target.value })} placeholder="FILM 01" /></Field>
                  <Field label="Location / subtitle"><Input value={film.subtitle} onChange={(e) => update({ subtitle: e.target.value })} placeholder="JAIPUR, INDIA" /></Field>
                </div>
                <Field label="Video">
                  <select className="gk-field" value={film.videoKind} onChange={(e) => update({ videoKind: e.target.value })}>
                    <option value="none">No video (image only, for now)</option>
                    <option value="youtube">YouTube link</option>
                    <option value="vimeo">Vimeo link</option>
                    <option value="upload">Uploaded video file</option>
                  </select>
                </Field>
                {(film.videoKind === "youtube" || film.videoKind === "vimeo") && (
                  <Field label={`${film.videoKind === "youtube" ? "YouTube" : "Vimeo"} URL`}>
                    <Input value={film.videoUrl} onChange={(e) => update({ videoUrl: e.target.value })} placeholder={film.videoKind === "youtube" ? "https://youtu.be/..." : "https://vimeo.com/..."} />
                  </Field>
                )}
                {film.videoKind === "upload" && <MediaPicker label="Video file" kind="video" mediaId={film.videoMediaId} onChange={(id) => update({ videoMediaId: id })} />}
              </div>
            )}
          />
        </>
      )}
    </SectionForm>
  );
}

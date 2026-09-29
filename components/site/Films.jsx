"use client";
import { useState } from "react";
import Reveal from "./Reveal";
import PlayButton from "./PlayButton";
import VideoLightbox from "./VideoLightbox";
import { parseVideoUrl } from "@/lib/video.js";

const sideClass = (i, total) => (total === 3 ? (i === 1 ? "tri-center" : "tri-side") : "tri-side");

export default function Films({ site }) {
  const { films } = site.sections;
  const [open, setOpen] = useState(null);
  if (!films.enabled || films.items.length === 0) return null;

  function videoFor(item) {
    if (item.videoKind === "upload") {
      const m = site.media[item.videoMediaId];
      return m?.kind === "video" ? { kind: "file", url: m.url } : null;
    }
    if (item.videoKind === "youtube" || item.videoKind === "vimeo") {
      const p = parseVideoUrl(item.videoUrl);
      return p ? { kind: "embed", embedUrl: p.embedUrl } : null;
    }
    return null;
  }

  return (
    <section className="showcase" id="films">
      <Reveal className="showcase-head">
        {films.eyebrow && <div className="eyebrow">{films.eyebrow}</div>}
        <h2 className="showcase-title">{films.title}</h2>
        {films.buttonLabel && (
          <a href={films.buttonHref || "#"} className="btn-outline" target={films.buttonHref?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
            {films.buttonLabel}
          </a>
        )}
      </Reveal>

      <Reveal className="triptych triptych-films">
        {films.items.map((item, i) => {
          const video = videoFor(item);
          return (
            <div className={`tri-item ${sideClass(i, films.items.length)}`} key={item.id}>
              {site.media[item.mediaId] && <img src={site.media[item.mediaId].url} alt={item.alt || site.media[item.mediaId].alt || ""} />}
              <PlayButton label={`Play ${item.title || "film"}`} onOpen={() => video && setOpen({ title: item.title, video })} />
              {(item.title || item.subtitle) && (
                <div className="tri-caption">
                  {item.title && <span className="tri-title">{item.title}</span>}
                  {item.subtitle && <span className="tri-sub">{item.subtitle}</span>}
                </div>
              )}
            </div>
          );
        })}
      </Reveal>

      <VideoLightbox film={open} onClose={() => setOpen(null)} />
    </section>
  );
}

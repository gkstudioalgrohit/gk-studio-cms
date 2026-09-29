"use client";
import { useEffect } from "react";
import { withAutoplay } from "@/lib/video.js";

// Shown when a film's play button is clicked. `film.video` is null for films
// with no video attached yet (button then just gives the original tactile
// feedback, same as the un-wired original site).
export default function VideoLightbox({ film, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!film) return null;
  const v = film.video;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={film.title}
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(10,10,10,0.92)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 960 }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#000" }}>
          {v?.kind === "embed" ? (
            <iframe
              src={withAutoplay(v.embedUrl)}
              title={film.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            />
          ) : v?.kind === "file" ? (
            <video src={v.url} controls autoPlay style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
          ) : null}
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{ marginTop: 16, color: "#fff", background: "transparent", border: "1px solid rgba(255,255,255,.4)", borderRadius: 6, padding: "8px 18px", fontSize: 13, cursor: "pointer" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

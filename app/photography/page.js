"use client";
import { useState } from "react";
import MediaPlaceholder from "@/components/MediaPlaceholder";
import Reveal from "@/components/Reveal";

const categories = ["All", "Weddings", "Pre-weddings", "Destination weddings", "Editorial"];

// Placeholder gallery items — replace `tone` blocks with real photos and set
// each item's real `category`.
const items = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  category: categories[(i % 4) + 1],
  tone: i % 4,
  tall: i % 3 === 0,
}));

export default function PhotographyPage() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState(null);

  const visible = items.filter((it) => active === "All" || it.category === active);

  return (
    <section className="max-w-content mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-24">
      <Reveal>
        <h1 className="font-serif italic text-4xl md:text-6xl mb-4">Photography</h1>
        <p className="text-stone max-w-lg mb-10">
          An editorial archive spanning weddings, pre-weddings, and destination
          celebrations across India and abroad.
        </p>
      </Reveal>

      <div className="flex flex-wrap gap-6 mb-12 text-sm">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`pb-1 border-b transition-colors ${
              active === c ? "border-charcoal text-charcoal" : "border-transparent text-stone hover:text-charcoal"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="columns-2 md:columns-3 gap-5 [column-fill:_balance]">
        {visible.map((it) => (
          <button
            key={it.id}
            onClick={() => setLightbox(it)}
            className="mb-5 block w-full break-inside-avoid"
          >
            <MediaPlaceholder
              label={`${it.category} — replace with photo`}
              tone={it.tone}
              ratio={it.tall ? "aspect-[3/4]" : "aspect-square"}
            />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/95 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <div className="max-w-3xl w-full">
            <MediaPlaceholder
              label={`${lightbox.category} — full size`}
              tone={lightbox.tone}
              ratio="aspect-[4/5]"
            />
            <p className="text-ivory/70 text-sm mt-4 text-center">Tap anywhere to close</p>
          </div>
        </div>
      )}
    </section>
  );
}

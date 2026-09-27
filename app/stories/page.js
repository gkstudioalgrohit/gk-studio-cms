import Link from "next/link";
import MediaPlaceholder from "@/components/MediaPlaceholder";
import Reveal from "@/components/Reveal";
import { stories } from "@/lib/data";

export const metadata = {
  title: "Stories",
  description: "Long-form wedding stories from GK Studio.",
};

export default function StoriesPage() {
  return (
    <section className="max-w-content mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-24">
      <Reveal>
        <h1 className="font-serif italic text-4xl md:text-6xl mb-4">Stories</h1>
        <p className="text-stone max-w-lg mb-16">
          Long-form pieces on the weddings we've shot — the details you don't
          see in a highlight reel.
        </p>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-14">
        {stories.map((s, i) => (
          <Reveal key={s.slug} delay={i * 80}>
            <Link href={`/stories/${s.slug}`} className="group block">
              <MediaPlaceholder label={s.couple} tone={i} ratio="aspect-[16/10]" />
              <p className="font-serif italic text-2xl mt-5">{s.couple}</p>
              <p className="text-sm text-stone mt-1 mb-3">{s.location} · {s.date}</p>
              <p className="text-stone leading-relaxed">{s.excerpt}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

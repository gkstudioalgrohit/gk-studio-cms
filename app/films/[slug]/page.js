import Link from "next/link";
import { notFound } from "next/navigation";
import MediaPlaceholder from "@/components/MediaPlaceholder";
import { films } from "@/lib/data";

export function generateStaticParams() {
  return films.map((f) => ({ slug: f.slug }));
}

export function generateMetadata({ params }) {
  const film = films.find((f) => f.slug === params.slug);
  if (!film) return {};
  return {
    title: `${film.couple} — ${film.location}`,
    description: film.story,
  };
}

export default function FilmDetail({ params }) {
  const index = films.findIndex((f) => f.slug === params.slug);
  if (index === -1) notFound();
  const film = films[index];
  const prev = films[(index - 1 + films.length) % films.length];
  const next = films[(index + 1) % films.length];

  return (
    <article className="pt-24 md:pt-28">
      {/* Replace with the actual film — <video controls poster="..."> or an
          embedded player (e.g. Vimeo/YouTube private link). */}
      <div className="max-w-content mx-auto px-6 md:px-10">
        <MediaPlaceholder
          label={`Replace with full film — ${film.couple}`}
          tone={index}
          ratio="aspect-video"
        />
      </div>

      <div className="max-w-content mx-auto px-6 md:px-10 py-16 grid md:grid-cols-[1fr_1.6fr] gap-12">
        <div>
          <p className="text-sm text-stone mb-1">{film.type}</p>
          <h1 className="font-serif italic text-4xl mb-4">{film.couple}</h1>
          <p className="text-sm text-stone">{film.location} · {film.year}</p>
        </div>
        <p className="text-stone leading-relaxed max-w-2xl">{film.story}</p>
      </div>

      <div className="border-t border-charcoal/15">
        <div className="max-w-content mx-auto px-6 md:px-10 py-8 flex justify-between text-sm">
          <Link href={`/films/${prev.slug}`} className="hover:text-stone transition-colors">
            ← {prev.couple}
          </Link>
          <Link href="/films" className="text-stone hover:text-charcoal transition-colors">
            All films
          </Link>
          <Link href={`/films/${next.slug}`} className="hover:text-stone transition-colors">
            {next.couple} →
          </Link>
        </div>
      </div>
    </article>
  );
}

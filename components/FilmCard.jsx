import Link from "next/link";
import MediaPlaceholder from "./MediaPlaceholder";

export default function FilmCard({ film, tone = 0 }) {
  return (
    <Link href={`/films/${film.slug}`} className="group block">
      <div className="overflow-hidden">
        <div className="transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          <MediaPlaceholder
            label={`Replace with film still — ${film.couple}`}
            tone={tone}
            ratio="aspect-[16/10]"
          />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <div>
          <p className="font-serif italic text-xl">{film.couple}</p>
          <p className="text-sm text-stone mt-1">{film.location} · {film.year}</p>
        </div>
        <span className="text-sm text-stone group-hover:text-charcoal transition-colors">
          Watch →
        </span>
      </div>
    </Link>
  );
}

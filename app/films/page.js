import FilmCard from "@/components/FilmCard";
import Reveal from "@/components/Reveal";
import { films } from "@/lib/data";

export const metadata = {
  title: "Films",
  description: "An editorial portfolio of wedding films by GK Studio.",
};

export default function FilmsPage() {
  return (
    <section className="max-w-content mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-24">
      <Reveal>
        <h1 className="font-serif italic text-4xl md:text-6xl mb-4">Films</h1>
        <p className="text-stone max-w-lg mb-16">
          Full wedding films, edited as short-form stories — each one built around
          the specific rhythm of that celebration.
        </p>
      </Reveal>
      <div className="grid md:grid-cols-2 gap-10 md:gap-14">
        {films.map((film, i) => (
          <Reveal key={film.slug} delay={i * 80}>
            <FilmCard film={film} tone={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

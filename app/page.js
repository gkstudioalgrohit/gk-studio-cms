import Link from "next/link";
import MediaPlaceholder from "@/components/MediaPlaceholder";
import Reveal from "@/components/Reveal";
import FilmCard from "@/components/FilmCard";
import Testimonials from "@/components/Testimonials";
import { films, stories } from "@/lib/data";
import { site } from "@/lib/site.config";

export default function Home() {
  return (
    <>
      {/* HERO — replace the placeholder div below with a <video autoPlay muted
          loop playsInline> once you have a hero film. Keep it under ~8MB and
          add a poster image for slow connections. */}
      <section className="relative h-[100svh] w-full overflow-hidden bg-charcoal flex items-end">
        <div className="absolute inset-0 bg-gradient-to-br from-[#161513] via-[#3a352c] to-[#8b7355]/70" />
        <div className="absolute inset-0 bg-black/30" />
        <span className="absolute top-24 left-6 md:left-10 text-[11px] tracking-wide text-ivory/70">
          Replace this section with your hero wedding film
        </span>
        <div className="relative z-10 max-w-content w-full mx-auto px-6 md:px-10 pb-16 md:pb-20 text-ivory">
          <h1 className="font-serif italic font-light text-4xl sm:text-5xl md:text-7xl leading-[1.05] max-w-3xl">
            {site.tagline}
          </h1>
          <div className="mt-8 flex items-center gap-6">
            <Link
              href="/films"
              className="border border-ivory/60 px-6 py-3 text-sm hover:bg-ivory hover:text-charcoal transition-colors"
            >
              Explore our stories
            </Link>
            <span className="text-sm text-ivory/70 hidden sm:inline">{site.locations}</span>
          </div>
        </div>
      </section>

      {/* FEATURED FILMS */}
      <section className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-32">
        <Reveal>
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="font-serif text-3xl md:text-4xl">Featured films</h2>
            <Link href="/films" className="text-sm text-stone hover:text-charcoal transition-colors">
              View all
            </Link>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-10 md:gap-14">
          {films.slice(0, 4).map((film, i) => (
            <Reveal key={film.slug} delay={i * 80}>
              <FilmCard film={film} tone={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* PHOTOGRAPHY MASONRY TEASER */}
      <section className="max-w-content mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <Reveal>
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="font-serif text-3xl md:text-4xl">Photography</h2>
            <Link href="/photography" className="text-sm text-stone hover:text-charcoal transition-colors">
              View gallery
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-5">
          <Reveal className="col-span-2 md:col-span-4"><MediaPlaceholder label="Editorial portrait" tone={0} ratio="aspect-[4/3]" /></Reveal>
          <Reveal className="col-span-1 md:col-span-2" delay={80}><MediaPlaceholder label="Detail shot" tone={1} /></Reveal>
          <Reveal className="col-span-1 md:col-span-2" delay={120}><MediaPlaceholder label="Candid" tone={2} /></Reveal>
          <Reveal className="col-span-2 md:col-span-4" delay={160}><MediaPlaceholder label="Ceremony" tone={3} ratio="aspect-[4/3]" /></Reveal>
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="bg-charcoal text-ivory">
        <div className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <MediaPlaceholder label="Studio / behind the scenes" tone={2} ratio="aspect-[4/5]" />
          </Reveal>
          <Reveal delay={100}>
            <p className="font-serif italic text-2xl md:text-3xl leading-snug mb-6">
              We treat a wedding the way a documentary crew treats a subject —
              present, patient, and rarely in the way.
            </p>
            <p className="text-ivory/70 mb-8 max-w-md">
              GK Studio has spent nine years photographing and filming weddings
              across India and abroad, working in a style built on restraint
              rather than spectacle.
            </p>
            <Link href="/about" className="text-sm border-b border-ivory/50 pb-1 hover:border-ivory transition-colors">
              More about the studio
            </Link>
          </Reveal>
        </div>
      </section>

      {/* FEATURED STORIES */}
      <section className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-32">
        <Reveal>
          <h2 className="font-serif text-3xl md:text-4xl mb-12">Featured stories</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-10">
          {stories.map((s, i) => (
            <Reveal key={s.slug} delay={i * 80}>
              <Link href={`/stories/${s.slug}`} className="group block">
                <MediaPlaceholder label={s.couple} tone={i + 1} ratio="aspect-[4/5]" />
                <p className="font-serif italic text-xl mt-4">{s.couple}</p>
                <p className="text-sm text-stone mt-1 mb-3">{s.location}</p>
                <p className="text-sm text-stone leading-relaxed">{s.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-content mx-auto px-6 md:px-10 pb-24 md:pb-32">
        <Reveal>
          <h2 className="font-serif text-3xl md:text-4xl mb-12">What couples say</h2>
        </Reveal>
        <Testimonials />
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-charcoal/15">
        <div className="max-w-content mx-auto px-6 md:px-10 py-24 md:py-32 text-center">
          <Reveal>
            <h2 className="font-serif italic text-4xl md:text-6xl mb-8">
              Let's create something unforgettable.
            </h2>
            <Link
              href="/contact"
              className="inline-block border border-charcoal px-8 py-4 text-sm hover:bg-charcoal hover:text-ivory transition-colors"
            >
              Start your inquiry
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

import MediaPlaceholder from "@/components/MediaPlaceholder";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site.config";

export const metadata = {
  title: "About",
  description: "The philosophy, approach, and team behind GK Studio.",
};

const sections = [
  {
    title: "Our philosophy",
    text: "A wedding is one of the few days in a family's life that gets remembered on purpose. Our job is to make sure what gets remembered is true — not staged, not performed for the camera, just observed well.",
  },
  {
    title: "Our approach",
    text: "We spend time with a couple before the wedding day itself, so that by the time we're shooting, we're not strangers with cameras. That familiarity is what lets people forget we're there.",
  },
  {
    title: "Photography",
    text: "Shot primarily in available light, with a documentary bias — we direct only when it genuinely helps a moment, never to manufacture one.",
  },
  {
    title: "Films",
    text: "Each film is edited as its own short story, built around the specific rhythm of that wedding rather than a fixed template.",
  },
  {
    title: "Destination weddings",
    text: `We regularly shoot across ${site.locations}, and build every destination proposal around travel logistics, local light conditions, and the couple's specific itinerary.`,
  },
  {
    title: "Team",
    text: "A small core team of photographers and cinematographers, scaled up with trusted second shooters for larger, multi-day celebrations.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-32 md:pt-40 pb-24">
      <section className="max-w-content mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-12 items-center mb-24 md:mb-32">
        <Reveal>
          <h1 className="font-serif italic text-4xl md:text-6xl leading-tight">
            A studio built on watching closely.
          </h1>
        </Reveal>
        <Reveal delay={100}>
          <MediaPlaceholder label="Team / studio portrait" tone={1} ratio="aspect-[4/5]" />
        </Reveal>
      </section>

      <section className="max-w-content mx-auto px-6 md:px-10 divide-y divide-charcoal/15 border-t border-charcoal/15">
        {sections.map((s, i) => (
          <Reveal key={s.title} delay={i * 60}>
            <div className="grid md:grid-cols-[1fr_2fr] gap-6 py-12">
              <h2 className="font-serif text-2xl">{s.title}</h2>
              <p className="text-stone leading-relaxed max-w-2xl">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </section>
    </div>
  );
}

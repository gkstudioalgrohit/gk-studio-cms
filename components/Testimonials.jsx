import { testimonials } from "@/lib/data";
import Reveal from "./Reveal";

export default function Testimonials() {
  return (
    <div className="grid md:grid-cols-3 gap-10">
      {testimonials.map((t, i) => (
        <Reveal key={t.couple} delay={i * 100}>
          <blockquote className="h-full flex flex-col justify-between">
            <p className="font-serif italic text-xl md:text-2xl leading-snug">
              "{t.quote}"
            </p>
            <footer className="mt-6 text-sm text-stone">
              {t.couple} — {t.location}
            </footer>
          </blockquote>
        </Reveal>
      ))}
    </div>
  );
}

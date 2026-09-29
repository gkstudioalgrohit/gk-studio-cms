import Reveal from "./Reveal";

export default function Testimonials({ section }) {
  const items = section.items.filter((t) => t.published && t.text);
  if (!section.enabled || items.length === 0) return null; // never shows empty/placeholder cards

  return (
    <section className="testimonials">
      <Reveal className="testimonials-head">
        <div className="eyebrow">{section.eyebrow}</div>
        <h2 className="testimonials-title">
          {section.title.split("\n").map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </h2>
      </Reveal>
      <Reveal className="testimonial-row">
        {items.map((t) => (
          <div className="t-card" key={t.id}>
            <div className="t-bubble">
              <span className="t-from">{t.name}</span>
              <p>{t.text}</p>
            </div>
            {t.tag && <div className="t-tag">{t.tag}</div>}
          </div>
        ))}
      </Reveal>
    </section>
  );
}

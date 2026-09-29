import Reveal from "./Reveal";

export default function Features({ section }) {
  if (!section.enabled || (!section.rowA.length && !section.rowB.length)) return null;
  return (
    <section className="features">
      {section.rowA.length > 0 && (
        <Reveal className="mark-row">
          {section.rowA.map((m, i) => <span className="mark" key={i}>{m}</span>)}
        </Reveal>
      )}
      {section.label && <Reveal className="features-label">{section.label}</Reveal>}
      {section.rowB.length > 0 && (
        <Reveal className="mark-row">
          {section.rowB.map((m, i) => <span className="mark" key={i}>{m}</span>)}
        </Reveal>
      )}
    </section>
  );
}

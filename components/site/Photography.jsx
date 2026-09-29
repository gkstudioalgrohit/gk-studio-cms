import Reveal from "./Reveal";

const sideClass = (i, total) => (total === 3 ? (i === 1 ? "tri-center" : "tri-side") : "tri-side");

export default function Photography({ site }) {
  const { photography } = site.sections;
  if (!photography.enabled || photography.items.length === 0) return null;

  return (
    <section className="showcase" id="photography">
      <Reveal className="showcase-head">
        {photography.eyebrow && <div className="eyebrow">{photography.eyebrow}</div>}
        <h2 className="showcase-title">{photography.title}</h2>
        {photography.buttonLabel && (
          <a href={photography.buttonHref || "#"} className="btn-outline">{photography.buttonLabel}</a>
        )}
      </Reveal>

      <Reveal className="triptych triptych-photo">
        {photography.items.map((item, i) => {
          const img = site.media[item.mediaId];
          const Wrap = item.href ? "a" : "div";
          return (
            <Wrap className={`tri-item ${sideClass(i, photography.items.length)}`} key={item.id} {...(item.href ? { href: item.href } : {})}>
              {img && <img src={img.url} alt={item.alt || img.alt || ""} />}
              {(item.title || item.subtitle) && (
                <div className="tri-caption">
                  {item.title && <span className="tri-title">{item.title}</span>}
                  {item.subtitle && <span className="tri-sub">{item.subtitle}</span>}
                </div>
              )}
            </Wrap>
          );
        })}
      </Reveal>
    </section>
  );
}

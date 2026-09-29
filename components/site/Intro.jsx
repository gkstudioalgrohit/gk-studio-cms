import Reveal from "./Reveal";
import Media from "./Media";

export default function Intro({ site }) {
  const { intro } = site.sections;
  if (!intro.heading && !intro.copy) return null;
  return (
    <section className="intro">
      <Reveal as="div" className="intro-text">
        <h2 className="intro-heading">
          {intro.heading.split("\n").map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </h2>
        {intro.copy && <p className="intro-copy">{intro.copy}</p>}
      </Reveal>
      <Reveal className="intro-image-wrap">
        <Media site={site} id={intro.mediaId} className="intro-image" />
      </Reveal>
    </section>
  );
}

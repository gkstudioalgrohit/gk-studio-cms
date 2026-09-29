import Nav from "./Nav";
import Reveal from "./Reveal";

export default function Hero({ site }) {
  const { hero } = site.sections;
  const image = site.media[hero.mediaId];
  const video = site.media[hero.videoMediaId];
  const poster = site.media[hero.posterMediaId] || image;

  return (
    <header className="hero" id="top">
      <Nav site={site} isHome />
      <Reveal className="hero-image-wrap">
        {video?.kind === "video" ? (
          <video
            className="hero-image"
            src={video.url}
            poster={poster?.url}
            autoPlay={hero.autoplay}
            muted={hero.muted}
            loop={hero.loop}
            playsInline
            controls={!hero.autoplay}
          />
        ) : image ? (
          <img className="hero-image" src={image.url} alt={hero.alt || image.alt || ""} />
        ) : null}
      </Reveal>
    </header>
  );
}

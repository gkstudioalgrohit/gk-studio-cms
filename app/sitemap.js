import { films, stories } from "@/lib/data";

const base = "https://www.gkstudio.co.in"; // TODO: update once your domain is live

export default function sitemap() {
  const staticRoutes = ["", "/films", "/photography", "/stories", "/about", "/contact", "/faq"].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
    })
  );

  const filmRoutes = films.map((f) => ({
    url: `${base}/films/${f.slug}`,
    lastModified: new Date(),
  }));

  const storyRoutes = stories.map((s) => ({
    url: `${base}/stories/${s.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...filmRoutes, ...storyRoutes];
}

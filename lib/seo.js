export function baseUrl(site) {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || site?.sections?.settings?.websiteUrl || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}
const abs = (base, url) => (/^https?:\/\//i.test(url) ? url : base + url);

export function buildMetadata(site, { pageKey, path = "/", fallbackTitle } = {}) {
  const base = baseUrl(site);
  const { seo, settings } = site.sections;
  const page = (pageKey && seo.pages?.[pageKey]) || {};
  const title = page.title || seo.title || fallbackTitle || settings.siteName || "GK Studio";
  const description = page.description || seo.description || undefined;
  const ogMedia = site.media[page.ogMediaId || seo.ogMediaId];
  const images = ogMedia?.kind === "image" ? [{ url: abs(base, ogMedia.url), width: ogMedia.width || undefined, height: ogMedia.height || undefined, alt: ogMedia.alt || title }] : undefined;
  return {
    title,
    description,
    keywords: seo.keywords || undefined,
    alternates: { canonical: page.canonical || abs(base, path) },
    openGraph: { title: seo.ogTitle || title, description: seo.ogDescription || description, url: abs(base, path), siteName: settings.siteName || undefined, type: "website", images },
    twitter: { card: images ? "summary_large_image" : "summary", title: seo.ogTitle || title, description: seo.ogDescription || description, images: images?.map((i) => i.url) },
  };
}

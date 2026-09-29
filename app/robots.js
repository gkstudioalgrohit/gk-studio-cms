import { getSite } from "@/lib/content.js";
import { baseUrl } from "@/lib/seo.js";

export default async function robots() {
  const site = await getSite();
  const base = baseUrl(site);
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin" }],
    sitemap: `${base}/sitemap.xml`,
  };
}

import { getSite } from "@/lib/content.js";
import { baseUrl } from "@/lib/seo.js";
import { getDb, hasDatabase } from "@/lib/db.js";
import { weddingStories } from "@/lib/schema.js";
import { eq } from "drizzle-orm";

export default async function sitemap() {
  const site = await getSite();
  const base = baseUrl(site);
  const routes = [{ url: `${base}/`, lastModified: new Date() }];

  if (hasDatabase()) {
    try {
      const rows = await getDb().select({ slug: weddingStories.slug, updatedAt: weddingStories.updatedAt }).from(weddingStories).where(eq(weddingStories.published, true));
      for (const r of rows) routes.push({ url: `${base}/stories/${r.slug}`, lastModified: r.updatedAt });
      if (rows.length) routes.push({ url: `${base}/stories`, lastModified: new Date() });
    } catch (e) {
      console.error("[sitemap] could not load stories:", e.message);
    }
  }
  return routes;
}

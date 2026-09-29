// Public-site content reader. Cached, and refreshed instantly when the admin saves
// (the admin API calls revalidateTag("site")).
import { unstable_cache } from "next/cache";
import { inArray } from "drizzle-orm";
import { getDb, hasDatabase } from "./db.js";
import { media, siteContent } from "./schema.js";
import { SEED, PLACEHOLDER_MEDIA } from "./seed.js";
import { SECTION_KEYS, collectMediaRefs, parseSection } from "./schemas.js";
import { publicMedia } from "./media.js";

function buildSections(stored) {
  const sections = {};
  for (const key of SECTION_KEYS) {
    try {
      sections[key] = parseSection(key, stored[key] ?? SEED[key]);
    } catch (e) {
      console.error(`[content] invalid stored data for "${key}", using defaults:`, e.message);
      sections[key] = parseSection(key, SEED[key]);
    }
  }
  return sections;
}

// What the site shows before a database is connected = exactly the original design.
export function defaultSite() {
  return {
    sections: buildSections({}),
    media: Object.fromEntries(PLACEHOLDER_MEDIA.map((m) => [m.id, publicMedia({ ...m, size: 0, caption: "", createdAt: null })])),
    flags: { hasStories: false, hasFaq: false },
  };
}

async function loadSite() {
  const db = getDb();
  const rows = await db.select().from(siteContent);
  const sections = buildSections(Object.fromEntries(rows.map((r) => [r.key, r.data])));
  const ids = [...new Set(collectMediaRefs(sections).map((r) => r.id))];
  const mediaRows = ids.length ? await db.select().from(media).where(inArray(media.id, ids)) : [];
  return {
    sections,
    media: Object.fromEntries(mediaRows.map((r) => [r.id, publicMedia(r)])),
    flags: { hasStories: false, hasFaq: false },
  };
}

const cachedSite = unstable_cache(loadSite, ["gk-site-data-v1"], { tags: ["site"], revalidate: 3600 });

export async function getSite() {
  if (!hasDatabase()) return defaultSite();
  try {
    return await cachedSite();
  } catch (e) {
    // Errors are not cached, so the site recovers as soon as the database does.
    console.error("[content] database unavailable, showing default content:", e.message);
    return defaultSite();
  }
}

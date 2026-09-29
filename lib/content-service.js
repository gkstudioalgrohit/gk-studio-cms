// Reading/writing editable sections (no Next.js imports so scripts can reuse it).
import { eq, inArray, desc } from "drizzle-orm";
import { getDb } from "./db.js";
import { media, siteContent } from "./schema.js";
import { AppError } from "./errors.js";
import { SEED } from "./seed.js";
import { collectMediaRefs, parseSection, sectionSchemas } from "./schemas.js";

export async function getSectionData(key) {
  if (!sectionSchemas[key]) throw new AppError(404, "Unknown section.");
  const [row] = await getDb().select().from(siteContent).where(eq(siteContent.key, key)).limit(1);
  try {
    return parseSection(key, row ? row.data : SEED[key]);
  } catch {
    return parseSection(key, SEED[key]);
  }
}

export async function saveSection(key, data) {
  if (!sectionSchemas[key]) throw new AppError(404, "Unknown section.");
  const parsed = parseSection(key, data); // throws a readable ZodError if anything is invalid

  const refs = collectMediaRefs(parsed);
  if (refs.length) {
    const ids = [...new Set(refs.map((r) => r.id))];
    const rows = await getDb().select({ id: media.id, kind: media.kind }).from(media).where(inArray(media.id, ids));
    const kinds = Object.fromEntries(rows.map((r) => [r.id, r.kind]));
    for (const r of refs) {
      if (!kinds[r.id]) throw new AppError(400, "One of the selected files no longer exists. Please choose it again.");
      if (kinds[r.id] !== r.kind) throw new AppError(400, `A selected file must be ${r.kind === "video" ? "a video" : "an image"}.`);
    }
  }

  await getDb()
    .insert(siteContent)
    .values({ key, data: parsed, updatedAt: new Date() })
    .onConflictDoUpdate({ target: siteContent.key, set: { data: parsed, updatedAt: new Date() } });
  return parsed;
}

export async function recentSectionUpdates(limit = 6) {
  const rows = await getDb().select({ key: siteContent.key, updatedAt: siteContent.updatedAt }).from(siteContent).orderBy(desc(siteContent.updatedAt)).limit(limit);
  return rows;
}

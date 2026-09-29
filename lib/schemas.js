// Validation + defaults for every editable website section.
// Every admin save is parsed through these schemas on the server.
import { z } from "zod";
import { parseVideoUrl } from "./video.js";

export const newId = () =>
  globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

const text = (max = 300) => z.string().trim().max(max).default("");
const id = z.string().trim().min(1).max(64).default(newId);
const mediaId = z
  .preprocess((v) => (v === "" || v === undefined ? null : v), z.string().uuid().nullable())
  .default(null);

// Links: only https://, /path, #anchor, mailto: and tel: are allowed (blocks javascript: URLs).
const href = z
  .string()
  .trim()
  .max(2000)
  .default("")
  .refine(
    (v) => v === "" || /^(https?:\/\/[^\s]+|\/(?!\/)[^\s]*|#[^\s]*|mailto:[^\s]+|tel:[^\s]+)$/i.test(v),
    { message: "Links must start with https://, /, #, mailto: or tel:" }
  );
const webUrl = z
  .string()
  .trim()
  .max(2000)
  .default("")
  .refine((v) => v === "" || /^https?:\/\/[^\s]+$/i.test(v), { message: "Must be a full web address starting with https://" });
const email = z
  .string()
  .trim()
  .max(200)
  .default("")
  .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), { message: "Enter a valid email address" });
const stringList = (max, len) =>
  z.array(text(len)).max(max).default([]).transform((a) => a.filter(Boolean));

const link = z.object({ label: text(80), href });
const linkList = (max) => z.array(link).max(max).default([]);

const filmItem = z
  .object({
    id,
    mediaId,
    alt: text(200),
    title: text(120),
    subtitle: text(120),
    videoKind: z.enum(["none", "youtube", "vimeo", "upload"]).default("none"),
    videoUrl: z.string().trim().max(2000).default(""),
    videoMediaId: mediaId,
  })
  .superRefine((v, ctx) => {
    if (v.videoKind === "youtube" || v.videoKind === "vimeo") {
      const p = parseVideoUrl(v.videoUrl);
      if (!p || p.provider !== v.videoKind) {
        ctx.addIssue({
          code: "custom",
          path: ["videoUrl"],
          message: `Enter a valid ${v.videoKind === "youtube" ? "YouTube" : "Vimeo"} link`,
        });
      }
    }
    if (v.videoKind === "upload" && !v.videoMediaId) {
      ctx.addIssue({ code: "custom", path: ["videoMediaId"], message: "Choose an uploaded video" });
    }
  });

const seoPage = z.object({ title: text(120), description: text(320), ogMediaId: mediaId, canonical: webUrl });

export const sectionSchemas = {
  settings: z.object({
    siteName: text(100),
    websiteUrl: webUrl,
    logoText: text(60),
    logoSub: text(60),
    logoMediaId: mediaId,
    faviconMediaId: mediaId,
    footerText: text(600),
    copyright: text(200),
  }),
  contact: z.object({
    businessName: text(120),
    address: text(400),
    email,
    mapsUrl: webUrl,
    phones: z
      .array(z.object({ id, label: text(40), number: text(40), whatsapp: z.boolean().default(false) }))
      .max(6)
      .default([])
      .transform((a) => a.filter((p) => p.number)),
  }),
  social: z.object({ instagram: webUrl, facebook: webUrl, youtube: webUrl }),
  hero: z.object({
    mediaId,
    alt: text(200),
    videoMediaId: mediaId,
    posterMediaId: mediaId,
    autoplay: z.boolean().default(true),
    muted: z.boolean().default(true),
    loop: z.boolean().default(true),
    heading: text(200),
    subheading: text(500),
    cta1Label: text(60),
    cta1Href: href,
    cta2Label: text(60),
    cta2Href: href,
  }),
  intro: z.object({ heading: text(400), copy: text(3000), mediaId, alt: text(200) }),
  features: z.object({
    enabled: z.boolean().default(true),
    rowA: stringList(12, 40),
    label: text(40),
    rowB: stringList(12, 40),
  }),
  films: z.object({
    enabled: z.boolean().default(true),
    eyebrow: text(60),
    title: text(300),
    buttonLabel: text(60),
    buttonHref: href,
    items: z.array(filmItem).max(12).default([]),
  }),
  photography: z.object({
    enabled: z.boolean().default(true),
    eyebrow: text(60),
    title: text(300),
    buttonLabel: text(60),
    buttonHref: href,
    items: z
      .array(z.object({ id, mediaId, alt: text(200), title: text(120), subtitle: text(120), href }))
      .max(12)
      .default([]),
  }),
  testimonials: z.object({
    enabled: z.boolean().default(true),
    eyebrow: text(60),
    title: text(200),
    items: z
      .array(z.object({ id, name: text(120), text: text(2000), tag: text(120), published: z.boolean().default(true) }))
      .max(24)
      .default([]),
  }),
  nav: z.object({ left: linkList(8), right: linkList(8) }),
  footer: z.object({ locations: stringList(10, 80), links: linkList(14) }),
  seo: z.object({
    title: text(120),
    description: text(320),
    keywords: text(400),
    ogTitle: text(120),
    ogDescription: text(320),
    ogMediaId: mediaId,
    pages: z.object({ home: seoPage.default({}), stories: seoPage.default({}) }).default({}),
  }),
};

export const SECTION_KEYS = Object.keys(sectionSchemas);

export function parseSection(key, data) {
  const schema = sectionSchemas[key];
  if (!schema) throw new Error(`Unknown section: ${key}`);
  return schema.parse(data ?? {});
}
export const defaultSection = (key) => parseSection(key, {});

// Finds every media reference inside a section, with the media kind it must have.
export function collectMediaRefs(obj, out = []) {
  if (Array.isArray(obj)) obj.forEach((v) => collectMediaRefs(v, out));
  else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      if (/mediaid$/i.test(k) && typeof v === "string") {
        out.push({ id: v, kind: k === "videoMediaId" ? "video" : "image" });
      } else collectMediaRefs(v, out);
    }
  }
  return out;
}

// Turns Zod errors into one readable message for the admin UI.
export function formatZodError(err) {
  const issues = err?.issues || [];
  return issues
    .slice(0, 4)
    .map((i) => `${i.path.length ? i.path.join(" › ") + ": " : ""}${i.message}`)
    .join(" · ");
}

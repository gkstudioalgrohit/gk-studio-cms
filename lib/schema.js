// Database schema (Drizzle ORM / PostgreSQL).
// Big files never live in the database: `media` only stores metadata + a URL.
import { pgTable, text, uuid, timestamp, integer, bigint, boolean, jsonb } from "drizzle-orm/pg-core";

const ts = (name) => timestamp(name, { withTimezone: true });

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull().default(""),
  passwordHash: text("password_hash").notNull(),
  createdAt: ts("created_at").notNull().defaultNow(),
});

// Only a SHA-256 hash of the session token is stored, never the token itself.
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => adminUsers.id, { onDelete: "cascade" }),
  expiresAt: ts("expires_at").notNull(),
  createdAt: ts("created_at").notNull().defaultNow(),
  userAgent: text("user_agent"),
});

// Brute-force protection (per email and per IP).
export const loginAttempts = pgTable("login_attempts", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  windowStart: ts("window_start").notNull().defaultNow(),
  lockedUntil: ts("locked_until"),
});

export const media = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  kind: text("kind").notNull(), // 'image' | 'video'
  storage: text("storage").notNull(), // 'blob' | 'local' | 'static'
  url: text("url").notNull(),
  pathname: text("pathname"),
  filename: text("filename").notNull(),
  mime: text("mime").notNull(),
  size: bigint("size", { mode: "number" }).notNull().default(0),
  width: integer("width"),
  height: integer("height"),
  alt: text("alt").notNull().default(""),
  caption: text("caption").notNull().default(""),
  isPlaceholder: boolean("is_placeholder").notNull().default(false),
  createdAt: ts("created_at").notNull().defaultNow(),
  updatedAt: ts("updated_at").notNull().defaultNow(),
});

// One row per editable website section (hero, intro, films, footer, ...).
// The shape of `data` is validated by lib/schemas.js before every save.
export const siteContent = pgTable("site_content", {
  key: text("key").primaryKey(),
  data: jsonb("data").notNull(),
  updatedAt: ts("updated_at").notNull().defaultNow(),
});

// Wedding Stories (Stage 2). gallery/videos are ordered JSON arrays of
// { mediaId, caption } / { kind, url|mediaId, poster } — validated in lib/story-schema.js.
export const weddingStories = pgTable("wedding_stories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  coupleNames: text("couple_names").notNull().default(""),
  title: text("title").notNull().default(""),
  location: text("location").notNull().default(""),
  weddingDate: text("wedding_date").notNull().default(""), // free-form (e.g. "February 2026")
  category: text("category").notNull().default(""),
  description: text("description").notNull().default(""), // sanitized HTML from the rich text editor
  coverMediaId: uuid("cover_media_id").references(() => media.id, { onDelete: "set null" }),
  heroMediaId: uuid("hero_media_id").references(() => media.id, { onDelete: "set null" }),
  gallery: jsonb("gallery").notNull().default([]),
  videos: jsonb("videos").notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  seoTitle: text("seo_title").notNull().default(""),
  seoDescription: text("seo_description").notNull().default(""),
  ogMediaId: uuid("og_media_id").references(() => media.id, { onDelete: "set null" }),
  createdAt: ts("created_at").notNull().defaultNow(),
  updatedAt: ts("updated_at").notNull().defaultNow(),
});

# GK Studio — Website + Admin Panel

A wedding photography & films website for GK Studio, with a full admin panel /
CMS to manage it — no code edits needed for day-to-day changes. Built with
Next.js (App Router), PostgreSQL (via Drizzle ORM), and Vercel Blob for media.

The public design is unchanged from the original static site — same layout,
typography, spacing, and animations. Everything that used to be hard-coded in
`index.html` now lives in the database and is edited at `/admin`.

## What's editable from `/admin`

Hero (image or video), the about/intro section, featured/press marks, films
(with YouTube/Vimeo/uploaded video), photography, testimonials, navigation and
footer links, social links, contact details, SEO (global and per-page), and
website settings (name, logo, favicon). Wedding Stories (full case-study pages
at `/stories/[slug]`) are the next stage of this project — the database table
exists but the admin UI for it isn't built yet.

## 1. Install dependencies

```bash
npm install
```

## 2. Set up free hosted services

You need two free accounts. Neither requires a credit card at the free tier.

**Database — [Neon](https://neon.tech) (Postgres)**
Free plan: 0.5 GB storage, 100 compute-hours/month, no time limit. Create a
project, copy the connection string it gives you (starts with `postgres://`).

**File storage — Vercel Blob**
In your Vercel project: Storage tab → Create Database → Blob. Free (Hobby)
plan: 1 GB storage, 10 GB transfer/month. Copy the `BLOB_READ_WRITE_TOKEN` it
gives you.

If you outgrow either free tier, both offer pay-as-you-go upgrades — you'll
get an email warning before anything is disabled.

## 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in `DATABASE_URL` and
`BLOB_READ_WRITE_TOKEN` from step 2. See the comments in that file for what
each variable does.

## 4. Create your admin account and run migrations

```bash
npm run setup          # applies database migrations (also runs automatically on build)
npm run create-admin   # interactive — prompts for email, name, password
```

## 5. Run the development server

```bash
npm run dev
```

Visit `http://localhost:3000` for the site, `http://localhost:3000/admin/login` to sign in.

Without `BLOB_READ_WRITE_TOKEN` set, local uploads are saved to disk
automatically (`.data/uploads`) so you can test without a Blob account —
**this fallback never runs in production**, only in local dev.

## 6. Deploy to Vercel

1. Push this project to a GitHub repo.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the environment variables from step 3 in the project's Settings →
   Environment Variables (same values as `.env.local`).
4. Deploy. Migrations run automatically as part of the build.
5. Run `npm run create-admin` once, pointed at your production `DATABASE_URL`
   (or set `ADMIN_EMAIL` / `ADMIN_PASSWORD` as one-time env vars before the
   first deploy — see `.env.example`).

## Managing media

`/admin/media` is the library: upload, search, filter by type, edit alt text
and captions, replace a file in place (everywhere it's used updates
automatically), or delete it. Every homepage section that uses an image or
video picks it from this same library via a "Replace" button.

## Security

Passwords are hashed with bcrypt and never logged. Sessions are server-side
(a random token, only its hash is stored) with a 30-day expiry. Failed logins
are rate-limited (5 attempts per 15 minutes per account, 25 per IP) with a
15-minute lockout. All `/admin/*` pages and `/api/admin/*` routes require a
valid session; write requests also check the request's origin to block
cross-site submissions. Uploaded files are validated by their actual content
(not just the filename extension) and size-limited (30 MB images, 500 MB
videos).

## Project structure

```
app/(site)/       Public website (uses site.css — the original stylesheet, untouched)
app/(admin)/       Admin panel (Tailwind-based, scoped so it never affects the public site)
app/api/admin/     Admin API routes (all protected)
components/site/   Public site components
components/admin/  Admin panel components
lib/               Database schema, auth, validation, media, content services
drizzle/           SQL migrations (applied automatically by scripts/setup.mjs)
scripts/           setup.mjs (migrations), create-admin.mjs (CLI)
public/placeholder/  The original placeholder photos, shown until you upload real ones
```

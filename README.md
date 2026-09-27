# GK Studio — Website

A luxury wedding photography & cinematography site for GK Studio, built with
Next.js (App Router), React, and Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import the repo at https://vercel.com/new.
3. No environment variables are required for the current build. Deploy.

## What to replace before launch

**Brand details** — `lib/site.config.js`
Email and WhatsApp number are pre-filled with the values you gave; update
here if they change. Nothing else in the code needs to be touched.

**Content** — `lib/data.js`
Placeholder couples, films, stories, testimonials, and FAQs. Replace with
your real projects — the site rebuilds each detail page automatically from
this file.

**Photos & films** — every `<MediaPlaceholder ... />` in:
- `app/page.js` (homepage)
- `app/films/page.js`, `app/films/[slug]/page.js`
- `app/photography/page.js`
- `app/stories/page.js`, `app/stories/[slug]/page.js`
- `app/about/page.js`
- `components/FilmCard.jsx`

Swap each one for a real `<img>` (or `next/image`, once your photos live in
`/public` or a CDN) or a `<video>` tag. The hero section in `app/page.js` is
built for a full-screen looping video — see the comment there.

**Contact form** — `components/ContactForm.jsx`
Currently just confirms submission in the UI. Wire the `handleSubmit`
function to a form backend (Formspree, Resend, a Next.js API route, etc.) so
inquiries actually reach your inbox.

**Domain** — update the URL in `app/layout.js` (`metadataBase`),
`app/sitemap.js`, and `app/robots.js` once you have a live domain.

## Structure

```
app/            Routes (App Router)
components/     Shared UI components
lib/            Site config + placeholder content
public/         Static assets
```

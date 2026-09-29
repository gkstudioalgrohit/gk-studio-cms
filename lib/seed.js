// Starting content for the CMS = what the current website already shows,
// with GK Studio's real business details. Nothing here is invented:
//  - testimonials are EMPTY (the old ones were "[Sample testimonial…]" placeholders)
//  - the "+1 (000) 000-0000" USA number is NOT included
//  - Mumbai / Hyderabad / Surat and hello@gkstudio.in are NOT included
// The 8 stock JPGs are registered as PLACEHOLDER media so the site looks complete
// until you upload real photos. The admin panel flags them clearly.

const P = (n) => `00000000-0000-4000-8000-00000000000${n}`;

export const PLACEHOLDER_MEDIA = [
  { id: P(1), file: "hero.jpg", width: 760, height: 1140, alt: "Wedding couple, hero image" },
  { id: P(2), file: "intro.jpg", width: 900, height: 1000, alt: "Black and white wedding ceremony moment" },
  { id: P(3), file: "film-01.jpg", width: 700, height: 760, alt: "Film 01" },
  { id: P(4), file: "film-02.jpg", width: 900, height: 980, alt: "Film 02" },
  { id: P(5), file: "film-03.jpg", width: 700, height: 760, alt: "Film 03" },
  { id: P(6), file: "photo-01.jpg", width: 760, height: 820, alt: "Wedding story 01" },
  { id: P(7), file: "photo-02.jpg", width: 900, height: 990, alt: "Wedding story 02" },
  { id: P(8), file: "photo-03.jpg", width: 760, height: 820, alt: "Wedding story 03" },
].map((m) => ({
  ...m,
  kind: "image",
  storage: "static",
  url: `/placeholder/${m.file}`,
  filename: m.file,
  mime: "image/jpeg",
  isPlaceholder: true,
}));

const film = (n, mediaId, title, subtitle) => ({
  id: `film-${n}`, mediaId, alt: `Film 0${n}`, title, subtitle, videoKind: "none", videoUrl: "", videoMediaId: null,
});
const photo = (n, mediaId, title, subtitle) => ({
  id: `photo-${n}`, mediaId, alt: `Wedding story 0${n}`, title, subtitle, href: "",
});

export const SEED = {
  settings: {
    siteName: "GK STUDIO",
    websiteUrl: "https://gkstudio.co.in",
    logoText: "GK STUDIO",
    logoSub: "Films",
    logoMediaId: null,
    faviconMediaId: null,
    footerText: "",
    copyright: "",
  },
  contact: {
    businessName: "GK STUDIO",
    address: "A2, Bhagwati Palace, Samad Road, Aligarh 202001",
    email: "gkstudio.alg@gmail.com",
    mapsUrl: "",
    // Kept from the existing site / your earlier message — please confirm in Admin → Contact.
    phones: [{ id: "phone-india", label: "India", number: "+91 75350 50804", whatsapp: true }],
  },
  social: {
    instagram: "https://www.instagram.com/gkstudio_/",
    facebook: "https://www.facebook.com/theGKstudio",
    youtube: "https://www.youtube.com/@GKSTUDIOALIGARH",
  },
  hero: { mediaId: P(1), alt: "Wedding couple, hero image" },
  intro: {
    heading: "Redefining the way\nweddings are\nphotographed, filmed,\nand felt, forever.",
    copy:
      "We approach every wedding as a story worth telling with care — attentive to light, gesture, and the small unscripted moments that hold the most meaning. Our work stays quiet on the day and lasting long after it.",
    mediaId: P(2),
    alt: "Black and white wedding ceremony moment",
  },
  features: {
    enabled: true,
    rowA: ["FEATURED", "PRESS", "EDITORIAL", "AWARDS", "PUBLISHED", "RECOGNIZED"],
    label: "FEATURES",
    rowB: ["SPOTLIGHT", "MENTIONED", "SELECTED", "HONORED", "CELEBRATED"],
  },
  films: {
    enabled: true,
    eyebrow: "FILMS",
    title: "Films that feel — every frame, a living memory.",
    buttonLabel: "VIEW ALL",
    buttonHref: "https://www.youtube.com/@GKSTUDIOALIGARH", // was a dead "#" link
    items: [
      film(1, P(3), "FILM 01", "JAIPUR, INDIA"),
      film(2, P(4), "FILM 02", "UDAIPUR, INDIA"),
      film(3, P(5), "FILM 03", "DOHA, QATAR"),
    ],
  },
  photography: {
    enabled: true,
    eyebrow: "PHOTOGRAPHY",
    title: "The art of stillness — every frame felt, every story timeless.",
    buttonLabel: "VIEW ALL",
    buttonHref: "/stories", // hidden automatically until a story is published
    items: [
      photo(1, P(6), "WEDDING STORY 01", "GOA"),
      photo(2, P(7), "WEDDING STORY 02", "HYDERABAD"),
      photo(3, P(8), "WEDDING STORY 03", "UDAIPUR"),
    ],
  },
  testimonials: { enabled: true, eyebrow: "TESTIMONIALS", title: "Words from\nfamilies.", items: [] },
  nav: {
    left: [
      { label: "Photography", href: "#photography" },
      { label: "Editorial", href: "/stories?category=editorial" },
      { label: "Films", href: "#films" },
    ],
    right: [
      { label: "Blogs", href: "/stories" },
      { label: "FAQ", href: "#faq" },
      { label: "Get in touch", href: "#contact" },
    ],
  },
  footer: {
    locations: ["Aligarh"],
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Get in touch", href: "#contact" },
      { label: "Photography", href: "#photography" },
      { label: "Editorial", href: "/stories?category=editorial" },
      { label: "Films", href: "#films" },
      { label: "Blogs", href: "/stories" },
    ],
  },
  seo: {
    title: "GK Studio — Luxury Wedding Photography & Films",
    description: "GK Studio is a wedding photography and films studio based in Aligarh, India.",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogMediaId: null,
    pages: { home: {}, stories: { title: "Stories — GK Studio" } },
  },
};

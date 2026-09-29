export const lines = (t) => String(t || "").split(/\r?\n/);
export const isExternal = (h) => /^https?:\/\//i.test(h);

// Links that would lead to a page with no content yet are hidden (no dead links).
export function linkVisible(href, flags) {
  if (/^\/stories(\/|\?|$)/.test(href)) return Boolean(flags.hasStories);
  if (href === "#faq") return Boolean(flags.hasFaq);
  return true;
}

// On inner pages, "#films" must become "/#films".
export const resolveHref = (href, isHome) => (!isHome && href.startsWith("#") && href !== "#top" ? `/${href}` : !isHome && href === "#top" ? "/" : href);

export const waLink = (number) => `https://wa.me/${String(number).replace(/\D/g, "")}`;
export const telLink = (number) => `tel:${String(number).replace(/[^\d+]/g, "")}`;

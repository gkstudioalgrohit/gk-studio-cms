import { linkVisible, resolveHref, telLink, waLink } from "@/lib/site-helpers.js";

export default function Footer({ site, isHome }) {
  const { footer, settings, contact, social } = site.sections;
  const links = footer.links.filter((l) => linkVisible(l.href, site.flags));

  return (
    <footer className="site-footer" id="contact">
      {footer.locations.length > 0 && (
        <div className="footer-cities">
          {footer.locations.map((city, i) => (
            <span key={i}>
              {i > 0 && <span className="dot">•</span>}
              {city}
            </span>
          ))}
        </div>
      )}

      <div className="footer-mid">
        <a href="#top" className="footer-logo">
          <span className="logo-mark">{settings.logoText}</span>
          {settings.logoSub && <span className="logo-sub">{settings.logoSub}</span>}
        </a>
        <div className="footer-contact">
          {contact.email && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
          {social.instagram && (
            <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="insta-icon" aria-label="Instagram">
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1"></circle></svg>
            </a>
          )}
          {contact.phones.map((p) => (
            <a key={p.id} href={p.whatsapp ? waLink(p.number) : telLink(p.number)}>
              {p.label ? `${p.label}: ` : ""}{p.number}
            </a>
          ))}
        </div>
      </div>

      {links.length > 0 && (
        <nav className="footer-links">
          {links.map((l, i) => (
            <a key={i} href={resolveHref(l.href, isHome)}>{l.label}</a>
          ))}
        </nav>
      )}
    </footer>
  );
}

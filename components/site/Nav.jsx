import { linkVisible, resolveHref } from "@/lib/site-helpers.js";

export default function Nav({ site, isHome }) {
  const { nav, settings } = site.sections;
  const left = nav.left.filter((l) => linkVisible(l.href, site.flags));
  const right = nav.right.filter((l) => linkVisible(l.href, site.flags));
  return (
    <nav className="nav">
      <ul className="nav-left">
        {left.map((l, i) => (
          <li key={i}><a href={resolveHref(l.href, isHome)}>{l.label}</a></li>
        ))}
      </ul>
      <div className="nav-center">
        <a href="#top" className="logo">
          <span className="logo-mark">{settings.logoText}</span>
          {settings.logoSub && <span className="logo-sub">{settings.logoSub}</span>}
        </a>
      </div>
      <ul className="nav-right">
        {right.map((l, i) => (
          <li key={i}><a href={resolveHref(l.href, isHome)}>{l.label}</a></li>
        ))}
      </ul>
    </nav>
  );
}

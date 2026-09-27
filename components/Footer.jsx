import Link from "next/link";
import { site } from "@/lib/site.config";

export default function Footer() {
  return (
    <footer
      className="border-t border-charcoal/15 bg-ivory text-charcoal"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="max-w-content mx-auto px-6 md:px-10 py-14 grid gap-10 md:grid-cols-4 text-sm">
        <div className="md:col-span-2">
          <p className="font-serif italic text-2xl mb-3">{site.name}</p>
          <p className="text-stone max-w-sm">{site.tagline}</p>
        </div>
        <div>
          <p className="text-stone mb-3">Studio</p>
          <ul className="space-y-2">
            <li><Link href="/films" className="hover:opacity-70">Films</Link></li>
            <li><Link href="/photography" className="hover:opacity-70">Photography</Link></li>
            <li><Link href="/stories" className="hover:opacity-70">Stories</Link></li>
            <li><Link href="/about" className="hover:opacity-70">About</Link></li>
            <li><Link href="/faq" className="hover:opacity-70">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-stone mb-3">Contact</p>
          <ul className="space-y-2">
            <li><a href={`mailto:${site.email}`} className="hover:opacity-70">{site.email}</a></li>
            <li>{site.whatsappDisplay}</li>
            <li><a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-70">{site.instagram}</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-content mx-auto px-6 md:px-10 pb-8 text-xs text-stone flex flex-wrap justify-between gap-2">
        <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        <span>{site.locations}</span>
      </div>
    </footer>
  );
}

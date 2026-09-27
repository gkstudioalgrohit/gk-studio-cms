"use client";
import Link from "next/link";
import { useState } from "react";
import { site } from "@/lib/site.config";

const links = [
  { href: "/films", label: "Films" },
  { href: "/photography", label: "Photography" },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 inset-x-0 z-50" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="max-w-content mx-auto flex items-center justify-between px-6 md:px-10 py-5">
        <Link href="/" className="font-serif italic text-lg md:text-xl tracking-tight text-charcoal mix-blend-difference text-ivory">
          {site.name}
        </Link>

        <nav className="hidden md:flex gap-10 text-sm text-ivory mix-blend-difference">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:opacity-70 transition-opacity">
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden text-ivory mix-blend-difference text-sm tracking-wide"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-charcoal text-ivory flex flex-col items-center justify-center gap-8 z-50">
          <button
            className="absolute top-6 right-6 text-sm tracking-wide"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            Close
          </button>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-serif italic text-3xl"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

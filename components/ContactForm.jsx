"use client";
import { useState } from "react";
import { site } from "@/lib/site.config";

const fieldClass =
  "w-full bg-transparent border-b border-charcoal/25 py-3 text-charcoal placeholder:text-stone focus:outline-none focus:border-charcoal transition-colors";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire this up to your email service / form backend of choice
    // (e.g. Formspree, Resend, a serverless API route). For now this just
    // confirms submission in the UI.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="font-serif italic text-2xl">
        Thank you — we'll reply within 48 hours at the email you shared.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 md:grid-cols-2">
      <input className={fieldClass} placeholder="Your name" required />
      <input className={fieldClass} type="email" placeholder="Email" required />
      <input className={fieldClass} placeholder="WhatsApp number" />
      <input className={fieldClass} type="date" placeholder="Wedding date" />
      <input className={fieldClass} placeholder="Wedding location" />
      <input className={fieldClass} placeholder="Number of days" />
      <input className={fieldClass} placeholder="Type of event (wedding, pre-wedding...)" />
      <input className={fieldClass} placeholder="Estimated guest count" />
      <textarea
        className={`${fieldClass} md:col-span-2 min-h-[120px] resize-none`}
        placeholder="Tell us about your wedding"
      />
      <button
        type="submit"
        className="md:col-span-2 justify-self-start mt-2 border border-charcoal px-8 py-3 text-sm hover:bg-charcoal hover:text-ivory transition-colors"
      >
        Send inquiry
      </button>
      <p className="md:col-span-2 text-xs text-stone">
        Prefer to write directly? {site.email} · {site.whatsappDisplay}
      </p>
    </form>
  );
}

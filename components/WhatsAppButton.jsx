import { site } from "@/lib/site.config";

export default function WhatsAppButton({ className = "" }) {
  const num = site.whatsapp.replace(/\D/g, "");
  return (
    <a
      href={`https://wa.me/${num}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 border border-charcoal/30 px-5 py-3 text-sm hover:bg-charcoal hover:text-ivory transition-colors ${className}`}
    >
      WhatsApp us
    </a>
  );
}

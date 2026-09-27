import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import { site } from "@/lib/site.config";

export const metadata = {
  title: "Contact",
  description: "Start your wedding photography and film inquiry with GK Studio.",
};

export default function ContactPage() {
  return (
    <section className="max-w-content mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-24">
      <div className="grid md:grid-cols-[1fr_1.4fr] gap-16">
        <div>
          <h1 className="font-serif italic text-4xl md:text-5xl mb-6">
            Tell us about your wedding.
          </h1>
          <p className="text-stone leading-relaxed mb-8 max-w-sm">
            Share a few details below and we'll reply within 48 hours with
            availability and a tailored proposal.
          </p>
          <div className="space-y-3 text-sm text-stone mb-8">
            <p>{site.email}</p>
            <p>{site.whatsappDisplay}</p>
            <p>{site.locations}</p>
          </div>
          <WhatsAppButton />
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

import FAQAccordion from "@/components/FAQAccordion";
import { faqs } from "@/lib/data";

export const metadata = {
  title: "FAQ",
  description: "Answers to common questions about booking GK Studio.",
};

export default function FAQPage() {
  return (
    <section className="max-w-content mx-auto px-6 md:px-10 pt-32 md:pt-40 pb-24">
      <h1 className="font-serif italic text-4xl md:text-6xl mb-4">FAQ</h1>
      <p className="text-stone max-w-lg mb-14">
        Common questions about booking, travel, and what to expect.
      </p>
      <FAQAccordion items={faqs} />
    </section>
  );
}

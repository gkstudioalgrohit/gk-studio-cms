import { getSite } from "@/lib/content.js";
import { buildMetadata } from "@/lib/seo.js";
import Hero from "@/components/site/Hero";
import Intro from "@/components/site/Intro";
import Features from "@/components/site/Features";
import Films from "@/components/site/Films";
import Photography from "@/components/site/Photography";
import Testimonials from "@/components/site/Testimonials";
import Footer from "@/components/site/Footer";
import Grain from "@/components/site/Grain";

export async function generateMetadata() {
  const site = await getSite();
  return buildMetadata(site, { pageKey: "home", path: "/" });
}

export default async function HomePage() {
  const site = await getSite();
  return (
    <>
      <Hero site={site} />
      <Intro site={site} />
      <Features section={site.sections.features} />
      <Films site={site} />
      <Photography site={site} />
      <Testimonials section={site.sections.testimonials} />
      <Footer site={site} isHome />
      <Grain />
    </>
  );
}

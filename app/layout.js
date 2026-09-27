import { Fraunces, Work_Sans } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/lib/site.config";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  weight: ["300", "400", "600"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-worksans",
  weight: ["300", "400", "500"],
});

export const metadata = {
  metadataBase: new URL("https://www.gkstudio.co.in"),
  title: {
    default: `${site.name} — Luxury Wedding Photography & Films`,
    template: `%s — ${site.name}`,
  },
  description: `${site.tagline} Luxury wedding photography and cinematography across ${site.locations}.`,
  openGraph: {
    title: `${site.name} — Luxury Wedding Photography & Films`,
    description: site.tagline,
    url: "https://www.gkstudio.co.in",
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Luxury Wedding Photography & Films`,
    description: site.tagline,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`}>
      <body className="font-sans antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

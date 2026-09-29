// Root layout. Deliberately minimal — the public site and the admin panel each
// bring their own CSS (site.css vs admin.css) via their own nested layouts,
// so neither one leaks into the other.
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

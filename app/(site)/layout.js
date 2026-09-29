import "./site.css";

// No <html>/<body> here — the root layout (app/layout.js) already provides
// those once for the whole app, shared with the admin panel.
export default function SiteLayout({ children }) {
  return children;
}

"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { group: "Dashboard", items: [{ href: "/admin", label: "Overview" }] },
  {
    group: "Website",
    items: [
      { href: "/admin/hero", label: "Hero Section" },
      { href: "/admin/intro", label: "About / Intro" },
      { href: "/admin/features", label: "Featured Marks" },
      { href: "/admin/films", label: "Films" },
      { href: "/admin/photography", label: "Photography" },
      { href: "/admin/testimonials", label: "Testimonials" },
      { href: "/admin/navigation", label: "Navigation & Footer" },
    ],
  },
  { group: "Media", items: [{ href: "/admin/media", label: "Media Library" }] },
  { group: "Stories", items: [{ href: "/admin/stories", label: "Wedding Stories" }] },
  { group: "Social & Contact", items: [{ href: "/admin/social", label: "Social Links" }, { href: "/admin/contact", label: "Contact Info" }] },
  { group: "SEO", items: [{ href: "/admin/seo", label: "SEO & Sharing" }] },
  { group: "Settings", items: [{ href: "/admin/settings", label: "Website Settings" }, { href: "/admin/profile", label: "Admin Profile" }] },
];

export default function Sidebar({ admin }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <aside style={{ width: 232, flexShrink: 0, borderRight: "1px solid #e6e4df", background: "#fff", padding: "22px 16px", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100dvh", overflowY: "auto" }}>
      <div style={{ padding: "0 8px 20px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.08em", color: "#b08d57", fontWeight: 700 }}>GK STUDIO</p>
        <p style={{ fontSize: 13, color: "#8c8880" }}>Admin panel</p>
      </div>

      <nav style={{ flex: 1 }}>
        {NAV.map((g) => (
          <div key={g.group} style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "#aaa6a0", padding: "0 8px 6px", fontWeight: 700 }}>{g.group}</p>
            <ul style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {g.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      style={{ display: "block", padding: "8px 10px", borderRadius: 7, fontSize: 13.5, fontWeight: active ? 600 : 500, background: active ? "#f2ede3" : "transparent", color: active ? "#15151a" : "#4a463e" }}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div style={{ borderTop: "1px solid #e6e4df", paddingTop: 14, marginTop: 10 }}>
        <p style={{ fontSize: 12.5, fontWeight: 600, padding: "0 8px" }}>{admin.name || admin.email}</p>
        <p style={{ fontSize: 11.5, color: "#8c8880", padding: "0 8px 10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{admin.email}</p>
        <button className="gk-btn gk-btn-outline" style={{ width: "100%" }} onClick={logout}>Log out</button>
      </div>
    </aside>
  );
}

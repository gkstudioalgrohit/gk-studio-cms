import { requireAdminPage } from "@/lib/request-auth.js";
import Sidebar from "@/components/admin/Sidebar";

export default async function PanelLayout({ children }) {
  const admin = await requireAdminPage();
  return (
    <div style={{ display: "flex", minHeight: "100dvh" }}>
      <Sidebar admin={admin} />
      <main style={{ flex: 1, minWidth: 0, padding: "28px 32px 60px" }}>{children}</main>
    </div>
  );
}

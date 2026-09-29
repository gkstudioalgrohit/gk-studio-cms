import "./admin.css";

export const metadata = { title: "Admin — GK Studio", robots: { index: false, follow: false } };

export default function AdminGroupLayout({ children }) {
  return <div className="gk-admin">{children}</div>;
}

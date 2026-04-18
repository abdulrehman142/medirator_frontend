import type { ReactNode } from "react";
import AdminFooter from "./AdminFooter";
import AdminNavbar, { type AdminNavLink } from "./AdminNavbar";

interface AdminLayoutProps {
  children: ReactNode;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  navLinks: AdminNavLink[];
  footerLinks: AdminNavLink[];
}

const AdminLayout = ({
  children,
  darkMode,
  setDarkMode,
  navLinks,
  footerLinks,
}: AdminLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminNavbar darkMode={darkMode} setDarkMode={setDarkMode} links={navLinks} />
      <main className="flex-1">{children}</main>
      <AdminFooter darkMode={darkMode} setDarkMode={setDarkMode} links={footerLinks} />
    </div>
  );
};

export default AdminLayout;

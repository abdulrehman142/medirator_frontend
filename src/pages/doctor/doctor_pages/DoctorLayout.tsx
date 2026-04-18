import type { ReactNode } from "react";
import DoctorFooter from "./DoctorFooter";
import DoctorNavbar, { type DoctorNavLink } from "./DoctorNavbar";

interface DoctorLayoutProps {
  children: ReactNode;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  navLinks: DoctorNavLink[];
  footerLinks: DoctorNavLink[];
}

const DoctorLayout = ({
  children,
  darkMode,
  setDarkMode,
  navLinks,
  footerLinks,
}: DoctorLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <DoctorNavbar darkMode={darkMode} setDarkMode={setDarkMode} links={navLinks} />
      <main className="flex-1">{children}</main>
      <DoctorFooter darkMode={darkMode} setDarkMode={setDarkMode} links={footerLinks} />
    </div>
  );
};

export default DoctorLayout;

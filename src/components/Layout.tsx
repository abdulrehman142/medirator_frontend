import React, { type ReactNode, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  showNavbar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, darkMode, setDarkMode, showNavbar = true }) => {
  const location = useLocation();

  const isDashboardPage = useMemo(
    () => location.pathname.includes("/dashboard"),
    [location.pathname]
  );

  const shouldShowNavbar = useMemo(
    () => showNavbar && !isDashboardPage,
    [showNavbar, isDashboardPage]
  );

  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowNavbar && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}
      <main className="flex-1">{children}</main>
      {!isDashboardPage && <Footer darkMode={darkMode} setDarkMode={setDarkMode} />}
    </div>
  );
};

export default Layout;

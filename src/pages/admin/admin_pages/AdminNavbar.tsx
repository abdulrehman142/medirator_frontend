import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import mediratorLogo from "/medirator_images/mediratorlogo.png";
import logoutImg from "/medirator_images/logout.png";
import sunIcon from "/medirator_images/lightmode.svg";
import moonIcon from "/medirator_images/darkmode.svg";
import dropdownArrowLight from "/medirator_images/dropdown.png";
import dropdownArrowDark from "/medirator_images/ddropdown.png";

import { useAuth } from "../../../context/AuthContext";

export interface AdminNavLink {
  label: string;
  path: string;
  children?: Array<{
    label: string;
    path: string;
    icon: string;
  }>;
}

interface AdminNavbarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  links: AdminNavLink[];
}

interface ToggleIconProps {
  darkMode: boolean;
  onClick: () => void;
}

const ToggleIcon = ({ darkMode, onClick }: ToggleIconProps) => {
  const [hovered, setHovered] = useState(false);
  const icon = darkMode ? moonIcon : sunIcon;

  return (
    <div
      className={`p-2 rounded cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center ${
        hovered ? "bg-gray-200 dark:bg-[#0B3C5D]" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <img src={icon} alt="Toggle Dark Mode" className="w-6 h-6 pointer-events-none" loading="lazy" />
    </div>
  );
};

const AdminNavbar = ({ darkMode, setDarkMode, links }: AdminNavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isManagementDropdownOpen, setIsManagementDropdownOpen] = useState(false);
  const [isManagementHovered, setIsManagementHovered] = useState(false);
  const managementDropdownRef = useRef<HTMLDivElement>(null);

  const isManagementActive =
    location.pathname.includes("/admin/pages/doctor-management") ||
    location.pathname.includes("/admin/pages/patient-management") ||
    isManagementDropdownOpen;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (managementDropdownRef.current && !managementDropdownRef.current.contains(event.target as Node)) {
        setIsManagementDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex dark:bg-black bg-white items-center justify-between pl-2 md:pl-4 flex-wrap md:flex-nowrap">
        <div className="flex items-center">
          <div className="flex">
            <div className="flex items-center p-2">
              <img src={mediratorLogo} alt="Medirator Logo" className="h-8 w-8" loading="lazy" />
              <div className="font-eczar font-bold dark:text-white text-[#0B3C5D] text-xl md:text-2xl ml-1">
                Medirator
              </div>
            </div>

            <div className="hidden lg:flex p-6 relative">
              {links.map((item) => (
                item.children ? (
                  <div key={item.path} className="relative" ref={managementDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsManagementDropdownOpen((prev) => !prev)}
                      onMouseEnter={() => setIsManagementHovered(true)}
                      onMouseLeave={() => setIsManagementHovered(false)}
                      className="group flex items-center justify-center rounded p-2 m-2 font-ibm-plex-mono font-medium text-sm transition-all duration-200 whitespace-nowrap hover:bg-[#0B3C5D] dark:hover:bg-[#0B3C5D] dark:text-white text-black"
                    >
                      <span className="flex items-center gap-2 group-hover:text-white">
                        {item.label}
                        <img
                          src={isManagementActive || isManagementHovered ? dropdownArrowLight : dropdownArrowDark}
                          alt="Dropdown"
                          className={`h-3 w-3 transition-transform duration-200 ${
                            isManagementDropdownOpen ? "rotate-180" : ""
                          }`}
                          loading="lazy"
                        />
                      </span>
                    </button>

                    {isManagementDropdownOpen && (
                      <div
                        className={`absolute left-0 mt-2 flex flex-col shadow-lg rounded-md p-2 border-2 z-50 ${
                          darkMode ? "bg-black border-[#0B3C5D]" : "bg-[#0B3C5D] border-[#0B3C5D]"
                        }`}
                      >
                        {item.children.map((child) => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            onClick={() => {
                              setIsManagementDropdownOpen(false);
                            }}
                            className={`border-[#0B3C5D] m-1 rounded-md transition-all duration-200 cursor-pointer flex items-center gap-2 px-3 py-2 w-48 ${
                              darkMode
                                ? "bg-[#0B3C5D] hover:bg-gray-800 text-white hover:text-white"
                                : "bg-white hover:bg-gray-800 text-black hover:text-white"
                            }`}
                          >
                            <img
                              src={child.icon}
                              alt={child.label}
                              className="w-6 h-6 object-cover rounded flex-shrink-0"
                              loading="lazy"
                            />
                            <div className="font-ibm-plex-mono text-sm truncate text-inherit">{child.label}</div>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="group flex items-center justify-center rounded p-2 m-2 font-ibm-plex-mono font-medium text-sm transition-all duration-200 whitespace-nowrap hover:bg-[#0B3C5D] dark:hover:bg-[#0B3C5D] dark:text-white text-black"
                  >
                    <span className="flex items-center group-hover:text-white">{item.label}</span>
                  </NavLink>
                )
              ))}
            </div>
          </div>
        </div>

        <div className="hidden md:flex gap-2 relative ml-auto mr-4 items-center">
          <ToggleIcon darkMode={darkMode} onClick={() => setDarkMode(!darkMode)} />
          <button
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="bg-white border rounded-2xl border-[#0B3C5D] dark:bg-black hover:text-white dark:text-white hover:bg-[#0B3C5D] dark:hover:bg-gray-800 text-black p-2 px-4 text-sm transition-all duration-300 flex items-center gap-2"
          >
            <img src={logoutImg} alt="Logout" className="w-5 h-5 object-cover rounded" loading="lazy" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;

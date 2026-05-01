import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import mediratorLogo from "/medirator_images/mediratorlogo.png";
import logoutImg from "/medirator_images/logout.png";
import expandIcon from "/medirator_images/expand.gif";
import dropdownArrowLight from "/medirator_images/dropdown.png";
import dropdownArrowDark from "/medirator_images/ddropdown.png";
import languageIcon from "/medirator_images/langauge.png";
import sunIcon from "/medirator_images/lightmode.svg";
import moonIcon from "/medirator_images/darkmode.svg";

import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";

export interface DoctorNavLink {
  label: string;
  path: string;
}

interface DoctorNavbarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  links: DoctorNavLink[];
}

interface SocialIconProps {
  darkMode: boolean;
  lightImg: string;
  lightHover: string;
  darkImg: string;
  darkHover: string;
  alt: string;
  onClick?: () => void;
  hoverClassName?: string;
  iconSizeClassName?: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({
  darkMode,
  lightImg,
  lightHover,
  darkImg,
  darkHover,
  alt,
  onClick,
  hoverClassName,
  iconSizeClassName,
}) => {
  const [hovered, setHovered] = useState(false);
  const src = darkMode ? (hovered ? darkHover : darkImg) : hovered ? lightHover : lightImg;

  return (
    <div
      className={`p-2 rounded cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center ${
        hoverClassName ?? "hover:bg-[#0B3C5D] dark:hover:bg-[#0B3C5D]"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className={`${iconSizeClassName ?? "w-5 h-5"} pointer-events-none`}
        loading="lazy"
      />
    </div>
  );
};

const DoctorNavbar = ({ darkMode, setDarkMode, links }: DoctorNavbarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const { language, setLanguage, t } = useLanguage();
  const languageOptions = [
    { code: "en", label: t("navbar", "english", "English") },
    { code: "ur", label: t("navbar", "urdu", "Urdu") },
  ] as const;
  const activeLanguage = languageOptions.find((option) => option.code === language);

  const profileMenuToggleClassName = useMemo(
    () =>
      "group flex items-center justify-center rounded p-2 m-2 font-ibm-plex-mono font-medium text-sm transition-all duration-200 whitespace-nowrap hover:bg-[#0B3C5D] dark:hover:bg-[#0B3C5D] dark:text-white text-black",
    [],
  );

  const profileMenuClassName = useMemo(
    () =>
      `flex flex-col shadow-lg rounded-md p-2 border-2 ${darkMode ? "bg-black border-[#0B3C5D]" : "bg-[#0B3C5D] border-[#0B3C5D]"}`,
    [darkMode],
  );

  const profileMenuItemClassName = useMemo(
    () =>
      `border-[#0B3C5D] m-1 rounded-md transition-all duration-200 cursor-pointer flex items-center gap-2 px-3 py-2 w-48 ${
        darkMode
          ? "bg-[#0B3C5D] hover:bg-gray-800 text-white hover:text-white"
          : "bg-white hover:bg-gray-800 text-black hover:text-white"
      }`,
    [darkMode],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExpandFullscreen = () => {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  };

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

            <div className="hidden lg:flex p-6 relative items-center">
              {links.map((item) => (
                item.label === t("navbar", "profile", "Profile") ? (
                  <div key={item.path} ref={profileMenuRef} className="relative inline-flex">
                    <button
                      type="button"
                      onClick={() => setIsProfileMenuOpen((current) => !current)}
                      className={profileMenuToggleClassName}
                    >
                      <span className="flex items-center group-hover:text-white">{t("navbar", "profile", "Profile")}</span>
                      <img
                        src={darkMode ? dropdownArrowLight : dropdownArrowDark}
                        alt="Dropdown"
                        className={`h-3 w-3 ml-1 mt-0.5 transition-all duration-200 ${
                          isProfileMenuOpen ? "rotate-180" : ""
                        }`}
                        loading="lazy"
                      />
                    </button>

                    {isProfileMenuOpen && (
                      <div className={`absolute top-full left-0 mt-1 z-50 ${profileMenuClassName}`}>
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            navigate("/doctor/pages/auth-profile");
                          }}
                          className={profileMenuItemClassName}
                        >
                          {t("navbar", "myProfile", "My Profile")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            navigate("/doctor/pages/patient-management");
                          }}
                          className={profileMenuItemClassName}
                        >
                          {t("navbar", "patientProfile", "Patient Profile")}
                        </button>
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

          <div className="hidden md:flex items-center p-4 m-4">
            <SocialIcon
              darkMode={darkMode}
              lightImg={sunIcon}
              lightHover={sunIcon}
              darkImg={moonIcon}
              darkHover={moonIcon}
              alt="Toggle Dark Mode"
              onClick={() => setDarkMode(!darkMode)}
              hoverClassName="hover:bg-gray-200 dark:hover:bg-[#0B3C5D]"
              iconSizeClassName="w-6 h-6"
            />
          </div>
        </div>

        <div className="hidden md:flex gap-1 relative ml-auto mr-4">
          <div className="relative" ref={languageDropdownRef}>
            <button
              onClick={() => setIsLanguageDropdownOpen((prev) => !prev)}
              className="bg-white border-2 border-[#0B3C5D] text-[#0B3C5D] shadow-sm hover:shadow-md dark:bg-[#0B3C5D] dark:text-white dark:border-white/20 dark:hover:bg-[#123f5e] p-2 px-3 text-sm transition-all duration-300 inline-flex items-center gap-3 min-w-[180px] justify-between whitespace-nowrap rounded-2xl"
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B3C5D] dark:bg-white/10 shrink-0">
                  <img src={languageIcon} alt="Language" className="h-4 w-4 object-contain" loading="lazy" />
                </span>
                <span className="min-w-0 text-left leading-tight">
                  <span className="block text-[11px] uppercase tracking-[0.18em] opacity-70">
                    {t("navbar", "language", "Language")}
                  </span>
                  <span className="block truncate font-medium">{activeLanguage?.label ?? "English"}</span>
                </span>
              </span>
              <img
                src={darkMode ? dropdownArrowLight : dropdownArrowDark}
                alt="Language Dropdown"
                className={`h-3 w-3 flex-shrink-0 transition-all duration-200 ${
                  isLanguageDropdownOpen ? "rotate-180" : ""
                }`}
                loading="lazy"
              />
            </button>

            {isLanguageDropdownOpen && (
              <div
                className={`absolute right-0 mt-2 z-50 flex flex-col shadow-lg rounded-2xl p-2 border-2 min-w-[180px] ${
                  darkMode ? "bg-[#071621] border-white/10" : "bg-white border-[#0B3C5D]"
                }`}
              >
                {languageOptions.map((option) => (
                  <button
                    key={option.code}
                    onClick={() => {
                      setLanguage(option.code);
                      setIsLanguageDropdownOpen(false);
                    }}
                    className={`m-1 rounded-xl transition-all duration-200 cursor-pointer text-left px-3 py-2 font-ibm-plex-mono text-sm border ${
                      language === option.code
                        ? darkMode
                          ? "bg-white/10 text-white border-white/20"
                          : "bg-[#0B3C5D] text-white border-[#0B3C5D]"
                        : darkMode
                          ? "bg-[#0B3C5D] hover:bg-white/10 text-white border-white/10"
                          : "bg-[#f5f8fb] hover:bg-[#0B3C5D] text-black hover:text-white border-[#d2dee8]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleExpandFullscreen}
            className="bg-white border rounded-2xl border-[#0B3C5D] dark:bg-black hover:text-white dark:text-white hover:bg-[#0B3C5D] dark:hover:bg-gray-800 text-black p-2 px-4 text-sm transition-all duration-300 inline-flex items-center gap-2 whitespace-nowrap"
          >
            <img src={expandIcon} alt="Full Screen" className="w-5 h-5 object-cover rounded" loading="lazy" />
            {t("navbar", "expand", "Expand")}
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
            className="bg-white border rounded-2xl border-[#0B3C5D] dark:bg-black hover:text-white dark:text-white hover:bg-[#0B3C5D] dark:hover:bg-gray-800 text-black p-2 px-4 text-sm transition-all duration-300 inline-flex items-center gap-2 whitespace-nowrap"
          >
            <img src={logoutImg} alt="Logout" className="w-5 h-5 object-cover rounded" loading="lazy" />
            {t("navbar", "logout", "Logout")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorNavbar;

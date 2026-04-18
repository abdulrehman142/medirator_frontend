import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import mediratorLogo from "/medirator_images/mediratorlogo.png";
import dropdownArrowLight from "/medirator_images/dropdown.png";
import dropdownArrowDark from "/medirator_images/ddropdown.png";
import register from "/medirator_images/register.png";
import login from "/medirator_images/login.png";
import logoutImg from "/medirator_images/logout.png";
import instagram from "/medirator_images/instaicon.png";
import youtube from "/medirator_images/youtubeicon.svg";
import discord from "/medirator_images/discordicon.png";
import wdiscord from "/medirator_images/wdiscordicon.png";
import sunIcon from "/medirator_images/lightmode.svg";
import moonIcon from "/medirator_images/darkmode.svg";




// 🟢 Light mode social icons







// ⚫ Dark mode social icons


import "../index.css";
import Dropdown from "../components/Dropdown";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
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

const Navbar = ({ darkMode, setDarkMode }: NavbarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const socialIconSizeClassName = "w-6 h-6 ";
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
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
              <div className="font-eczar font-bold  dark:text-white text-[#0B3C5D] text-xl md:text-2xl ml-1">
                Medirator
              </div>
            </div>

            {/* 🟣 Middle: Nav Links - Hidden on mobile */}
            <div className="hidden lg:flex p-6 relative">
              {[
                { name: "Home", href: "/" },
                { name: "Services", href: "/services" },
                { name: "How it works", href: "/how-it-works" },
                { name: "About Us", href: "/about" },
                { name: "FAQs", href: "/faqs" },
                { name: "Medibot", href: "/medibot" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative"
                  ref={item.name === "Services" ? dropdownRef : null}
                >
                  {item.name === "Services" ? (
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="group flex items-center justify-center hover:bg-[#0B3C5D] rounded p-2 m-2 font-ibm-plex-mono font-medium text-sm dark:text-white text-black transition-all duration-200 whitespace-nowrap cursor-pointer"
                    >
                      <span className="flex items-center group-hover:text-white">
                        {item.name}
                        <img
                          src={darkMode ? dropdownArrowLight : dropdownArrowDark}
                          alt="Dropdown"
                          className={`h-3 w-3 ml-1 mt-0.5 group-hover:brightness-0 group-hover:invert transition-all duration-200 ${
                            isDropdownOpen ? "rotate-180" : ""
                          }`}
                          loading="lazy"
                        />
                      </span>
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className="group flex items-center justify-center hover:bg-[#0B3C5D] dark:hover:bg-[#0B3C5D] rounded p-2 m-2 font-ibm-plex-mono font-medium text-sm dark:text-white text-black transition-all duration-200 whitespace-nowrap"
                    >
                      <span className="flex items-center group-hover:text-white">{item.name}</span>
                    </Link>
                  )}
                  {item.name === "Services" && isDropdownOpen && (
                    <div className="absolute top-full left-0 z-50 mt-1">
                      <Dropdown darkMode={darkMode} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center p-4 m-4">
            <div className="flex gap-1">
              <a
                href="https://www.instagram.com/mediratorinfo2026/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon
                  darkMode={darkMode}
                  lightImg={instagram}
                  lightHover={instagram}
                  darkImg={instagram}
                  darkHover={instagram}
                  alt="Instagram"
                  hoverClassName="hover:bg-gray-200 dark:hover:bg-[#0B3C5D]"
                  iconSizeClassName="w-5 h-5"
                />
              </a>
              <a
                href="https://www.youtube.com/@Medirator"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon
                  darkMode={darkMode}
                  lightImg={youtube}
                  lightHover={youtube}
                  darkImg={youtube}
                  darkHover={youtube}
                  alt="YouTube"
                  hoverClassName="hover:bg-gray-200 dark:hover:bg-[#0B3C5D]"
                  iconSizeClassName={socialIconSizeClassName}
                />
              </a>
              <a
                href="https://discord.gg/vVDHBGH5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon
                  darkMode={darkMode}
                  lightImg={discord}
                  lightHover={discord}
                  darkImg={wdiscord}
                  darkHover={wdiscord}
                  alt="Discord"
                  hoverClassName="hover:bg-gray-200 dark:hover:bg-[#0B3C5D]"
                  iconSizeClassName={socialIconSizeClassName}
                />
              </a>
              <SocialIcon
                darkMode={darkMode}
                lightImg={sunIcon}
                lightHover={sunIcon}
                darkImg={moonIcon}
                darkHover={moonIcon}
                alt="Toggle Dark Mode"
                onClick={() => setDarkMode(!darkMode)}
                hoverClassName="hover:bg-gray-200 dark:hover:bg-[#0B3C5D]"
                iconSizeClassName={socialIconSizeClassName}
              />
            </div>
          </div>
        </div>

        <div className="hidden md:flex gap-1 relative ml-auto mr-4">
          {!isAuthenticated && (
            <>
              <button
                onClick={() => navigate("/register")}
                style={{ cursor: "pointer" }}
                className="bg-[#0B3C5D] dark:bg-black border-4 border-[#0B3C5D] hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-2xl transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <img
                  src={register}
                  alt="Register"
                  className="w-4 h-4 object-cover rounded"
                  loading="lazy"
                />
                Register
              </button>

              <button
                onClick={() => navigate("/login")}
                style={{ cursor: "pointer" }}
                className="bg-[#0B3C5D] dark:bg-black border-4 border-[#0B3C5D] hover:bg-gray-800  text-white text-sm px-4 py-2 rounded-2xl transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <img
                  src={login}
                  alt="Login"
                  className="w-5 h-5 object-cover rounded"
                  loading="lazy"
                />
                Login
              </button>
            </>
          )}

          {isAuthenticated && user?.role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              style={{ cursor: "pointer" }}
              className="bg-white dark:bg-black border-4 border-[#0B3C5D] hover:bg-[#0B3C5D] hover:text-white dark:text-white text-[#0B3C5D] text-sm px-4 py-2 rounded-2xl transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              Admin Panel
            </button>
          )}

          {isAuthenticated && user?.role === "doctor" && (
            <button
              onClick={() => navigate("/doctor")}
              style={{ cursor: "pointer" }}
              className="bg-white dark:bg-black border-4 border-[#0B3C5D] hover:bg-[#0B3C5D] hover:text-white dark:text-white text-[#0B3C5D] text-sm px-4 py-2 rounded-2xl transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              Doctor Panel
            </button>
          )}

          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              style={{ cursor: "pointer" }}
              className="bg-white border rounded-2xl border-[#0B3C5D] dark:bg-black hover:text-white dark:text-white hover:bg-[#0B3C5D] dark:hover:bg-gray-800 text-black p-2 px-4 text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <img src={logoutImg} alt="Logout" className="w-5 h-5 object-cover rounded" loading="lazy" />
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import mediratorLogo from "/medirator_images/mediratorlogo.png";
import instagram from "/medirator_images/instaicon.png";
import youtube from "/medirator_images/youtubeicon.svg";
import discord from "/medirator_images/discordicon.png";
import wdiscord from "/medirator_images/wdiscordicon.png";
import logoutImg from "/medirator_images/logout.png";
import expandIcon from "/medirator_images/expand.gif";
import sunIcon from "/medirator_images/lightmode.svg";
import moonIcon from "/medirator_images/darkmode.svg";

import { useAuth } from "../../../context/AuthContext";

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
  const socialIconSizeClassName = "w-6 h-6 ";

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

            <div className="hidden lg:flex p-6 relative">
              {links.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className="group flex items-center justify-center rounded p-2 m-2 font-ibm-plex-mono font-medium text-sm transition-all duration-200 whitespace-nowrap hover:bg-[#0B3C5D] dark:hover:bg-[#0B3C5D] dark:text-white text-black"
                >
                  <span className="flex items-center group-hover:text-white">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center p-4 m-4">
            <div className="flex gap-1">
              <a href="https://www.instagram.com/mediratorinfo2026/" target="_blank" rel="noopener noreferrer">
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
              <a href="https://www.youtube.com/@Medirator" target="_blank" rel="noopener noreferrer">
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
              <a href="https://discord.gg/vVDHBGH5" target="_blank" rel="noopener noreferrer">
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
          <button
            onClick={handleExpandFullscreen}
            className="bg-white border rounded-2xl border-[#0B3C5D] dark:bg-black hover:text-white dark:text-white hover:bg-[#0B3C5D] dark:hover:bg-gray-800 text-black p-2 px-4 text-sm transition-all duration-300 flex items-center gap-2"
          >
            <img src={expandIcon} alt="Full Screen" className="w-5 h-5 object-cover rounded" loading="lazy" />
            Expand
          </button>
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

export default DoctorNavbar;

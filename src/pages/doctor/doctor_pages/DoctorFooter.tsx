import React, { useState } from "react";
import { Link } from "react-router-dom";

import instagram from "/medirator_images/instaicon.png";
import youtube from "/medirator_images/youtubeicon.svg";
import discord from "/medirator_images/discordicon.png";
import wdiscord from "/medirator_images/wdiscordicon.png";
import sunIcon from "/medirator_images/sun.png";
import moonIcon from "/medirator_images/moon.jpg";

interface DoctorFooterLink {
  label: string;
  path: string;
}

interface DoctorFooterProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  links: DoctorFooterLink[];
}

interface SocialIconProps {
  darkMode: boolean;
  lightImg: string;
  lightHover: string;
  darkImg: string;
  darkHover: string;
  alt: string;
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

const DoctorFooter = ({ darkMode, setDarkMode, links }: DoctorFooterProps) => {
  const navLinkClass =
    "py-2 px-4  hover:text-white hover:bg-[#0B3C5D] dark:hover:bg-[#0B3C5D] rounded w-max transition-all duration-200";
  const socialIconSizeClassName = "w-6 h-6 ";

  const firstColumn = links.slice(0, 3);
  const secondColumn = links.slice(3, 5);
  const thirdColumn = links.slice(5,6);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="w-full bg-[#FFFFFF] dark:bg-black px-5">
        <div className="xl:mx-8 flex flex-col xl:flex-row justify-between items-stretch">
          <div className="font-ibm-plex-mono dark:text-[#FFFFFF] text-black flex flex-col xl:flex-row font-medium m-2">
            <div className="flex flex-col p-1 m-0 xl:m-4">
              {firstColumn.map((item) => (
                <Link key={item.path} to={item.path} className={navLinkClass}>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col p-1 m-0 xl:m-4">
              {secondColumn.map((item) => (
                <Link key={item.path} to={item.path} className={navLinkClass}>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex flex-col p-1 m-0 xl:m-4">
              {thirdColumn.map((item) => (
                <Link key={item.path} to={item.path} className={navLinkClass}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-start xl:justify-between items-start xl:items-end mx-0 xl:m-2 gap-y-6">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-10 h-6 rounded-full flex items-center transition-colors duration-300 m-4 ${
                darkMode ? "bg-black" : "bg-[#F5F5F5]"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 rounded-full transform transition-transform duration-300 ${
                  darkMode ? "translate-x-[16px] bg-[#484C5B]" : "translate-x-0 bg-gray-200"
                }`}
              ></div>
              <img
                src={darkMode ? sunIcon : moonIcon}
                alt="Mode Icon"
                className={`absolute w-3 h-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? "left-1" : "right-1"
                }`}
                loading="lazy"
              />
            </button>

            <div className="m-2 flex flex-col">
              <div className="flex xl:justify-end gap-x-4">
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
              </div>

              <div className="font-ibm-plex-mono dark:text-[#FFFFFF] text-[#0B3C5D] text-base leading-[32px] break-words whitespace-normal m-2 p-0">
                Wellness, effortless with Medirator.
              </div>
            </div>
          </div>
        </div>

        <div className="mx-0 xl:mx-10 flex flex-col xl:flex-row justify-between items-start gap-y-4">
          <div className="text-[#250843] mx-4 xl:mx-6">
            <p className="text-sm font-ibm-plex-mono dark:text-[#FFFFFF] text-[#250843]">
              © 2025 Medirator All Rights Reserved.
            </p>
          </div>

          <div className="flex flex-row justify-between items-start mx-2 gap-y-4 mb-6 xl:mb-0">
            <Link
              to="/privacy-policy"
              className="hover:underline text-[#0B3C5D] text-xs block mx-2 font-ibm-plex-mono dark:text-[#FFFFFF]"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="hover:underline text-[#0B3C5D] text-xs block mx-2 font-ibm-plex-mono dark:text-[#FFFFFF]"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-[#FFFFFF] dark:bg-black">
        <h1 className="tracking-tight font-jersey text-[#0B3C5D] dark:text-white xl:text-[90px] text-[91.03px] text-center xl:leading-[180.24px] leading-[56.9px]">
          Medirator-Your Custom Healthcare Assistant
        </h1>
      </div>
    </div>
  );
};

export default DoctorFooter;

import React, { useState } from "react";

interface SocialIconProps {
  darkMode: boolean;
  lightImg: string;
  lightHover: string;
  darkImg: string;
  darkHover: string;
  alt: string;
  onClick?: () => void;
}

const SocialIcon: React.FC<SocialIconProps> = ({
  darkMode,
  lightImg,
  lightHover,
  darkImg,
  darkHover,
  alt,
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);

  const src = darkMode ? (hovered ? darkHover : darkImg) : hovered ? lightHover : lightImg;

  return (
    <div
      className="p-2 rounded cursor-pointer transition-all duration-300 hover:bg-[#0B3C5D] dark:hover:bg-[#0B3C5D] hover:scale-110 flex items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <img src={src} alt={alt} className="w-5 h-5 pointer-events-none" loading="lazy" />
    </div>
  );
};

export default SocialIcon;

import { useEffect, useState } from "react";

import Complaints from "../../Complaints";
import stethoscopeImg from "/medirator_images/stethoscope.jpg";
import medicalrecordsImg from "/medirator_images/medicalrecords.jpg";
import medicinesImg from "/medirator_images/medicines.jpg";
import phoneImg from "/medirator_images/phone.png";
import RoleReviews from "../../../components/RoleReviews";
import { useLanguage } from "../../../context/LanguageContext";
interface HomePageProps {
  darkMode?: boolean;
}

const HomePage = ({ darkMode = false }: HomePageProps) => {
  const { t } = useLanguage();
  const [imageIndex, setImageIndex] = useState(0);

  const heroImages = [medicalrecordsImg, stethoscopeImg, medicinesImg];

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="bg-white dark:bg-black">
        <div className="flex flex-col md:flex-row text-white transition-all duration-500 min-h-screen md:min-h-screen min-h-auto">
          <div className="flex flex-col p-4 md:p-10 flex-1 justify-center md:justify-center">
            <div className="font-ibm-plex-mono text-black dark:text-white font-bold text-3xl md:text-5xl py-2 md:py-4">
              {t("doctor", "homeHeroLine1", "Smart Care")}
              <br /> {t("doctor", "homeHeroLine2", "Starts Here")}
            </div>
            <div className="font-ibm-plex-mono text-black dark:text-white text-base md:text-xl py-2 md:py-4">
              {t("doctor", "homeHeroLine3", "Track patient data, assess")}
              <br /> {t("doctor", "homeHeroLine4", "risks, and deliver")}
              <br /> {t("doctor", "homeHeroLine5", "better outcomes.")}
            </div>
            <div className="bg-[#0B3C5D] border-2 border-[#0B3C5D] dark:bg-black rounded-full flex items-center w-fit">
              <a
                href="tel:03225455658"
                className="bg-[#0B3C5D] p-2 m-2 md:m-2 border-2 rounded-4xl border-[#0B3C5D] dark:hover:bg-[#0B3C5D] dark:bg-black rounded hover:bg-gray-800 flex items-center justify-center transition-all duration-200 cursor-pointer"
              >
                <img
                  src={phoneImg}
                  alt={t("doctor", "phoneAlt", "phone")}
                  className="w-7 h-7"
                  loading="lazy"
                />
              </a>
            </div>
          </div>

          <div className="hidden md:flex flex-1 h-screen">
            <div className="relative w-full h-full rounded-l-full overflow-hidden shadow-2xl">
              {heroImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={t("doctor", "heroImageAlt", "hero image")}
                  loading="lazy"
                  className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                    idx === imageIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}

              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {heroImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === imageIndex
                        ? "bg-white w-6"
                        : "bg-white opacity-50"
                    }`}
                    aria-label={t("doctor", "goToImageAria", `Go to image ${idx + 1}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Complaints darkMode={darkMode} />

      <RoleReviews role="doctor" title={t("doctor", "reviewsTitle", "Doctors Speak for Us!")} seedReviews={doctorSeedReviews} />
    </div>
  );
};

export default HomePage;

const doctorSeedReviews = [
  {
    id: "doctor-seed-1",
    name: "Sana Ahmed",
    text: "Doctor workflow tools are responsive and make patient review much faster during busy shifts.",
    date: "12-01-2026 11:20",
    rating: 5,
  },
  {
    id: "doctor-seed-2",
    name: "Adeel Khan",
    text: "The patient management flow keeps follow-ups organized and reduces missed tasks.",
    date: "03-02-2026 16:45",
    rating: 5,
  },
  {
    id: "doctor-seed-3",
    name: "Hira Malik",
    text: "Prescription and appointment shortcuts help me stay focused on care instead of navigation.",
    date: "18-03-2026 09:12",
    rating: 5,
  },
  {
    id: "doctor-seed-4",
    name: "Hamza Riaz",
    text: "The visualizer gives a clear snapshot of patient trends before consultations.",
    date: "27-04-2026 13:58",
    rating: 5,
  },
  {
    id: "doctor-seed-5",
    name: "Mariam Noor",
    text: "Home page access to the doctor tools makes my daily routine much smoother.",
    date: "09-05-2026 18:33",
    rating: 5,
  },
  {
    id: "doctor-seed-6",
    name: "Usman Qureshi",
    text: "The interface is simple, which helps when switching quickly between patients.",
    date: "22-06-2026 10:10",
    rating: 5,
  },
];

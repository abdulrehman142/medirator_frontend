import searchIcon from "/medirator_images/searchicon.png";
import phoneImg from "/medirator_images/phone.png";
import stethoscopeImg from "/medirator_images/stethoscope.jpg";
import medicalrecordsImg from "/medirator_images/medicalrecords.jpg";
import medicinesImg from "/medirator_images/medicines.jpg";
import historyImg from "/medirator_images/history.png";
import saltsImg from "/medirator_images/salts.png";
import healthrisksImg from "/medirator_images/healthrisks.png";
import appointmentsImg from "/medirator_images/appointment.png";
import testresultsImg from "/medirator_images/testresults.png";
import visualizerImg from "/medirator_images/dashboard.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";



const Hero = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const allServices = [
    { name: t("navbar", "familyHistory", "Family History"), route: "/family-history", image: historyImg },
    { name: t("navbar", "salts", "Salts"), route: "/salts", image: saltsImg },
    { name: t("navbar", "healthRisks", "Health Risks"), route: "/health-risks", image: healthrisksImg },
    { name: t("navbar", "appointments", "Appointments"), route: "/appointments", image: appointmentsImg },
    { name: t("navbar", "reportAnalysis", "Report Analysis"), route: "/report-analysis", image: testresultsImg },
    { name: t("navbar", "visualizer", "Visualizer"), route: "/visualizer", image: visualizerImg },
  ];

  const filteredServices =
    search.trim() === ""
      ? []
      : allServices.filter((service) =>
          service.name.toLowerCase().includes(search.toLowerCase())
        );

  // Hero section images carousel
  const heroImages = [medicalrecordsImg, stethoscopeImg, medicinesImg];

  // Auto-scroll images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleSelectService = (route: string, name: string) => {
    setSearch(name);
    setShowSuggestions(false);
    navigate(route);
  };

  // Function to render your editable box
  const renderEditableBox = (id: string, text: string, setText: (val: string) => void) => {
    const placeholder = t("hero", "searchPlaceholder", "Search for services...");

    return (
      <div className="relative w-full">
        <input
          id={id}
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => {
            setIsFocused(id);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setIsFocused(null);
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          placeholder={placeholder}
          className={`font-ibm-plex-mono ml-4 mr-4 mt-2 p-2 m-2 text-base outline-none transition-all duration-200 focus:outline-none rounded-2xl w-full ${
            isFocused === id
              ? "bg-gray-800 text-white dark:bg-gray-800 dark:text-white placeholder:text-white"
              : "bg-white text-black dark:bg-[#0B3C5D] dark:text-white placeholder:text-gray-400 dark:placeholder:text-white"
          }`}
        />

        {showSuggestions && filteredServices.length > 0 && (
          <div className="flex flex-col shadow-lg rounded-md p-2 border-2 absolute top-full left-0 right-0 mt-1 z-50 max-h-64 overflow-y-auto bg-[#0B3C5D] dark:bg-black border-[#0B3C5D] dark:border-[#0B3C5D]">
            {filteredServices.slice(0, 8).map((service, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectService(service.route, service.name)}
                className="border-[#0B3C5D] m-1 rounded-md transition-all duration-200 cursor-pointer flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#0B3C5D] text-black dark:text-white hover:bg-gray-800 hover:text-white"
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-6 h-6 object-cover rounded"
                  loading="lazy"
                />
                <div className="font-ibm-plex-mono text-sm truncate">{service.name}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleSend = () => {
    if (search.trim() !== "") {
      const selectedService = allServices.find(
        (service) => service.name.toLowerCase() === search.toLowerCase()
      );

      if (selectedService) {
        navigate(selectedService.route);
      } else if (filteredServices.length > 0) {
        navigate(filteredServices[0].route);
      } else {
        navigate("/services");
      }
      setShowSuggestions(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black">
      <div className="flex flex-col md:flex-row text-white transition-all duration-500 min-h-screen md:min-h-screen min-h-auto">
        <div className="flex flex-col p-4 md:p-10 flex-1 justify-center md:justify-center">
          {/* Hero Heading */}
          <div className="font-ibm-plex-mono text-black  dark:text-white font-bold text-3xl md:text-5xl py-2 md:py-4">
            {t("hero", "headingLine1", "Our doctors")}<br/>
             {t("hero", "headingLine2", "will take")}<br/>
              {t("hero", "headingLine3", "it from here")}<br/>
          </div>
          <div className="font-ibm-plex-mono text-black dark:text-white text-base md:text-xl py-2 md:py-4">
            {t("hero", "subtitle", "Compassionate care meets clinical excellence.")}
          </div>
          {/* Editable Box + Button */}
          <div className="bg-[#0B3C5D] border-4 border-[#0B3C5D] dark:bg-black rounded-full py-3 px-4 md:px-6 flex items-center w-fit">
            {renderEditableBox("editableDiv1", search, setSearch)}

            <button
              onClick={handleSend}
              className="p-2 m-2 ml-8 bg-white dark:bg-[#0B3C5D]  text-white font-ibm-plex-mono rounded-2xl hover:bg-gray-200 dark:hover:bg-[#0B3C5D] transition-all duration-200"
            >
              <img
                src={searchIcon}
                alt="search"
                className="h-6 w-6"
                loading="lazy"
              />
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center p-2 m-2 gap-2">
            <button
              onClick={() => navigate("/appointments")}
              className="text-white p-3 m-2 md:m-3 mx-4 md:mx-8 px-6 md:px-8 border-4 rounded-4xl border-[#0B3C5D] transition-all duration-200 text-sm bg-[#0B3C5D] dark:hover:bg-[#0B3C5D] dark:bg-black rounded hover:bg-gray-800 w-full md:w-auto"
            >
              {t("hero", "bookNow", "Book Now")}
            </button>
            <a
              href="tel:03225455658"
              className="bg-[#0B3C5D] p-2 m-2 md:m-2 border-4 rounded-4xl border-[#0B3C5D] dark:hover:bg-[#0B3C5D] dark:bg-black rounded hover:bg-gray-800 flex items-center justify-center transition-all duration-200 cursor-pointer"
            >
              <img
                src={phoneImg}
                alt="phone"
                className="w-7 h-7"
                loading="lazy"
              />
            </a>
          </div>
        </div>

        {/* Right Side Image Carousel - Full Height and Half Width */}
        <div className="hidden md:flex flex-1 h-screen">
          <div className="relative w-full h-full rounded-l-full overflow-hidden shadow-2xl">
            {heroImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`hero-${idx}`}
                loading="lazy"
                className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
                  idx === imageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}

            {/* Image indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === imageIndex ? "bg-white w-6" : "bg-white opacity-50"
                  }`}
                  aria-label={`${t("hero", "ariaGoToImage", "Go to image")} ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

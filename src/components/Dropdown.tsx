import historyImg from "/medirator_images/history.png";
import saltsImg from "/medirator_images/salts.png";
import healthrisksImg from "/medirator_images/healthrisks.png";
import appointmentsImg from "/medirator_images/appointment.png";
import testresultsImg from "/medirator_images/testresults.png";
import visualizerImg from "/medirator_images/dashboard.png";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";










interface DropdownProps {
  darkMode: boolean;
}

const Dropdown = ({ darkMode }: DropdownProps) => {
  const { t } = useLanguage();
  const services = [
    { name: t("navbar", "familyHistory", "Family History"), img: historyImg, route: "/family-history" },
    { name: t("navbar", "salts", "Salts"), img: saltsImg, route: "/salts" },
    { name: t("navbar", "healthRisks", "Health Risks"), img: healthrisksImg, route: "/health-risks" },
    { name: t("navbar", "appointments", "Appointments"), img: appointmentsImg, route: "/appointments" },
    { name: t("navbar", "reportAnalysis", "Report Analysis"), img: testresultsImg, route: "/report-analysis" },
    { name: t("navbar", "visualizer", "Visualizer"), img: visualizerImg, route: "/visualizer" },
  ];

  return (
    <div
      className={`flex flex-col shadow-lg rounded-md p-2 border-2 ${
        darkMode ? "bg-black border-[#0B3C5D]" : "bg-[#0B3C5D] border-[#0B3C5D]"
      }`}
    >
      {services.map((service, index) => (
        <Link
          to={service.route}
          key={index}
          className={`border-[#0B3C5D] m-1 rounded-md transition-all duration-200 cursor-pointer flex items-center gap-2 px-3 py-2 w-48 ${
            darkMode
              ? "bg-[#0B3C5D] hover:bg-gray-800 text-white hover:text-white"
              : "bg-white hover:bg-gray-800 text-black hover:text-white"
          }`}
        >
          <img
            src={service.img}
            alt={service.name}
            className="w-6 h-6 object-cover rounded flex-shrink-0"
            loading="lazy"
          />
          <div className="font-ibm-plex-mono text-sm truncate">{service.name}</div>
        </Link>
      ))}
    </div>
  );
};

export default Dropdown;

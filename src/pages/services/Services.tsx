import historyImg from "/medirator_images/history.png";
import saltsImg from "/medirator_images/salts.png";
import healthrisksImg from "/medirator_images/healthrisks.png";
import appointmentsImg from "/medirator_images/appointment.png";
import testresultsImg from "/medirator_images/testresults.png";
import visualizerImg from "/medirator_images/dashboard.png";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";








interface ServicesProps {
  darkMode?: boolean;
}

const Services = ({ darkMode = false }: ServicesProps) => {
  const { t } = useLanguage();
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="p-4 md:p-10 bg-white dark:bg-black min-h-screen font-mono">
        <div className="flex flex-col text-center">
          <div className="font-bold text-3xl md:text-5xl text-[#0B3C5D] dark:text-white p-1 m-1">
            {t("servicesPage", "title", "Services")}
          </div>
          <div className="text-sm md:text-md text-[#8e8e93] dark:text-gray-400 p-1 m-1">
            {t("servicesPage", "subtitle", "Choose from our wide range of services")}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-wrap justify-center gap-4 md:gap-15 p-2 m-2 w-full">
            <Link to="/family-history">
              <button className="group flex flex-col items-center rounded-2xl justify-center hover:bg-[#0B3C5D]  dark:hover:bg-[#0B3C5D] p-2 rounded transition-colors">
                <img
                  src={historyImg}
                  alt={"family history"}
                  className="w-16 md:w-20 h-16 md:h-20 object-cover rounded flex-shrink-0"
                  loading="lazy"
                />
                <div className="text-center text-base md:text-xl text-[#231212] group-hover:text-white dark:text-white">
                  {t("navbar", "familyHistory", "Family History")}
                </div>
              </button>
            </Link>
            <Link to="/salts">
              <button className="group flex flex-col items-center rounded-2xl justify-center hover:bg-[#0B3C5D]  dark:hover:bg-[#0B3C5D] p-2 rounded transition-colors">
                <img
                  src={saltsImg}
                  alt={"salts"}
                  className="w-16 md:w-20 h-16 md:h-20 object-cover rounded flex-shrink-0"
                  loading="lazy"
                />
                <div className="text-center text-base md:text-xl text-[#231212] group-hover:text-white dark:text-white">
                  {t("navbar", "salts", "Salts")}
                </div>
              </button>
            </Link>
            <Link to="/health-risks">
              <button className="group flex flex-col items-center rounded-2xl justify-center hover:bg-[#0B3C5D]  dark:hover:bg-[#0B3C5D] p-2 rounded transition-colors">
                <img
                  src={healthrisksImg}
                  alt={"health risks"}
                  className="w-16 md:w-20 h-16 md:h-20 object-cover rounded flex-shrink-0"
                  loading="lazy"
                />
                <div className="text-center text-base md:text-xl text-[#231212] group-hover:text-white dark:text-white">
                  {t("navbar", "healthRisks", "Health Risks")}
                </div>
              </button>
            </Link>
            <Link to="/appointments">
              <button className="group flex flex-col items-center rounded-2xl justify-center hover:bg-[#0B3C5D] dark:hover:bg-[#0B3C5D] p-2 rounded transition-colors">
                <img
                  src={appointmentsImg}
                  alt={"appointments"}
                  className="w-16 md:w-20 h-16 md:h-20 object-cover rounded flex-shrink-0"
                  loading="lazy"
                />
                <div className="text-center text-base md:text-xl text-[#231212] group-hover:text-white dark:text-white">
                  {t("navbar", "appointments", "Appointments")}
                </div>
              </button>
            </Link>
            <Link to="/report-analysis">
              <button className="group flex flex-col items-center rounded-2xl justify-center hover:bg-[#0B3C5D]  dark:hover:bg-[#0B3C5D] p-2 rounded transition-colors">
                <img
                  src={testresultsImg}
                  alt={"report analysis"}
                  className="w-16 md:w-20 h-16 md:h-20 object-cover rounded flex-shrink-0"
                  loading="lazy"
                />
                <div className="text-center text-base md:text-xl text-[#231212] group-hover:text-white dark:text-white">
                  {t("navbar", "reportAnalysis", "Report Analysis")}
                </div>
              </button>
            </Link>
          </div>
          <div className="flex gap-4 md:gap-20 p-2 m-2 w-full justify-center flex-wrap">
            <Link to="/visualizer">
              <button className="group flex flex-col items-center rounded-2xl justify-center p-2 m-2 hover:bg-[#0B3C5D]  dark:hover:bg-[#0B3C5D] rounded transition-colors">
                <img
                  src={visualizerImg}
                  alt={"visualizer"}
                  className="w-16 md:w-20 h-16 md:h-20 object-cover rounded flex-shrink-0"
                  loading="lazy"
                />
                <div className="text-center text-base md:text-xl text-[#231212] group-hover:text-white dark:text-white">
                  {t("navbar", "visualizer", "Visualizer")}
                </div>
              </button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Services;
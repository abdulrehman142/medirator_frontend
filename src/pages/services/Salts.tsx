
import saltsImg from "/medirator_images/salts.png";
import { Link } from "react-router-dom";
interface SaltsProps {
  darkMode?: boolean;
}

const Salts = ({ darkMode = false }: SaltsProps) => {
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-6 shadow-md">
        <div>
          <h2 className="text-5xl font-bold">Salts</h2>
          <p className="mt-2">
            Medirator helps you understand medicine salts <br />
            with clear composition details, usage guidance, <br />
            and practical references for safer decisions.
          </p>
        </div>
        <img src={saltsImg} alt="Salts" className="h-70 w-70" loading="lazy" />
      </div>

      <div className="bg-white dark:bg-black px-6 py-8">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border-2 border-[#0B3C5D] p-5 bg-[#F7FAFC] dark:bg-[#0B3C5D]/20">
            <h3 className="text-2xl text-center font-bold text-[#0B3C5D] dark:text-white">Past Salts</h3>
            <div className="flex justify-center mt-5">
              <Link
                to="/salts/past"
                className="inline-flex px-4 py-2 rounded-xl bg-[#0B3C5D] text-white hover:bg-gray-800 transition-colors"
              >
                View Patient Past Salts
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#0B3C5D] p-5 bg-[#F7FAFC] dark:bg-[#0B3C5D]/20">
            <h3 className="text-2xl text-center font-bold text-[#0B3C5D] dark:text-white">Current Salts</h3>
            <div className="flex justify-center mt-5">
              <Link
                to="/salts/current"
                className="inline-flex px-4 py-2 rounded-xl bg-[#0B3C5D] text-white hover:bg-gray-800 transition-colors"
              >
                View Patient Current Salts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Salts;

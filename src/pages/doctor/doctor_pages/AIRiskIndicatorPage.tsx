import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import dashboardImg from "/medirator_images/dashboard.png";
import healthRisksImg from "/medirator_images/healthrisks.png";

import DoctorPatientDropdown from "../../../components/DoctorPatientDropdown";
import { useDoctorPatient } from "../../../context/DoctorPatientContext";

interface AIRiskIndicatorPageProps {
  darkMode?: boolean;
}

const AIRiskIndicatorPage = ({ darkMode = false }: AIRiskIndicatorPageProps) => {
  const navigate = useNavigate();
  const { selectedPatient } = useDoctorPatient();

  const riskProfile = useMemo(() => {
    const profiles: Record<string, { score: number; level: string; trend: string; factors: string[]; history: number[] }> = {
      "PT-240318-07": {
        score: 78,
        level: "High",
        trend: "Worsening",
        factors: ["BP high", "Sugar levels", "Age factor"],
        history: [52, 58, 63, 66, 71, 74, 78],
      },
      "PT-240402-11": {
        score: 61,
        level: "Moderate",
        trend: "Stable",
        factors: ["Fasting glucose", "Medication timing", "Follow-up gap"],
        history: [42, 48, 53, 55, 57, 60, 61],
      },
      "PT-240215-03": {
        score: 49,
        level: "Moderate",
        trend: "Improving",
        factors: ["Asthma triggers", "Seasonal flare-ups", "Inhaler adherence"],
        history: [58, 55, 53, 52, 51, 50, 49],
      },
    };

    return profiles[selectedPatient.id] ?? profiles["PT-240318-07"];
  }, [selectedPatient.id]);

  const riskScore = riskProfile.score;
  const riskLevel = riskProfile.level;
  const trend = riskProfile.trend;

  const contributingFactors = riskProfile.factors;
  const riskHistory = riskProfile.history;

  const scoreClassName = useMemo(() => {
    if (riskScore >= 70) {
      return "bg-red-600";
    }

    if (riskScore >= 40) {
      return "bg-yellow-500";
    }

    return "bg-green-600";
  }, [riskScore]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">
            AI Risk Indicator
          </h2>
          <p className="text-sm md:text-base text-center md:text-left ml-0 md:ml-5 md:pl-5 mt-2 text-gray-200">
            Current patient: {selectedPatient.name} ({selectedPatient.id})
          </p>
          <div className="ml-0 md:ml-5 md:pl-5 mt-3">
            <DoctorPatientDropdown darkMode={darkMode} />
          </div>
        </div>
        <img src={healthRisksImg} alt="AI Risk Indicator Banner" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="flex flex-col md:flex-row dark:text-white justify-between items-start dark:bg-black font-sans gap-4 md:gap-0">
        <div className="w-full md:w-[34%] p-2 md:p-6 m-2 md:m-4 self-stretch">
          <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl shadow p-4 md:p-6 h-full">
            <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Risk Overview</h3>

            <div className="mt-4 flex items-center gap-4">
              <div className={`h-20 w-20 rounded-full ${scoreClassName} flex items-center justify-center text-white text-2xl font-bold`}>
                {riskScore}%
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Risk Level</div>
                <div className="text-2xl font-bold text-[#0B3C5D] dark:text-white">{riskLevel}</div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">Trend: {trend}</div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">For {selectedPatient.name}</div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-base font-semibold text-[#0B3C5D] dark:text-white">Contributing Factors</h4>
              <ul className="mt-3 space-y-2">
                {contributingFactors.map((factor) => (
                  <li key={factor} className="rounded-2xl border border-[#0B3C5D] p-2 text-sm text-black dark:text-white">
                    {factor}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="text-base font-semibold text-[#0B3C5D] dark:text-white">Why this risk?</h4>
              <p className="mt-2 rounded-2xl border border-[#0B3C5D] p-3 text-sm text-black dark:text-white leading-relaxed">
                The score is elevated for {selectedPatient.name} because the latest indicators for this patient still
                point to active monitoring needs, and the model is keeping the current care pathway in view.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl m-2 md:m-4 px-3 md:px-4 md:px-8 py-6 md:py-8 relative z-10">
          <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl shadow p-4 md:p-8 space-y-6">
            <section>
              <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Mini Graph</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Risk over time</p>
              <div className="mt-4 flex items-end gap-2 h-40 rounded-2xl border border-[#0B3C5D] p-4 bg-white dark:bg-black">
                {riskHistory.map((point, index) => (
                  <div key={`${point}-${index}`} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div
                      className={`w-full max-w-10 rounded-t-md ${scoreClassName} opacity-${50 + index * 5}`}
                      style={{ height: `${point}%` }}
                    />
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{point}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#0B3C5D] p-4 text-sm text-black dark:text-white">
                <h4 className="text-base font-semibold text-[#0B3C5D] dark:text-white">Current Status</h4>
                <p className="mt-2 leading-relaxed">
                  {selectedPatient.name} is currently being tracked as a {riskLevel.toLowerCase()}-risk patient. The
                  system recommends close monitoring and timely intervention to reduce the risk of escalation.
                </p>
              </div>

              <div className="rounded-2xl border border-[#0B3C5D] p-4 text-sm text-black dark:text-white">
                <h4 className="text-base font-semibold text-[#0B3C5D] dark:text-white">Suggested Next Step</h4>
                <p className="mt-2 leading-relaxed">
                  Review the visual trend for {selectedPatient.name}, verify medications, and compare against the latest
                  patient profile before the next consultation.
                </p>
              </div>
            </section>

            <div className="pt-2 md:pt-4 pb-1 flex justify-center items-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 bg-white border rounded-2xl border-[#0B3C5D] dark:bg-black hover:text-white dark:text-white hover:bg-[#0B3C5D] dark:hover:bg-gray-800 text-black px-5 py-2.5 text-sm transition-all duration-300"
                onClick={() => navigate("/doctor/pages/visualizer")}
              >
                <img src={dashboardImg} alt="Visualizer" className="h-4 w-4 object-contain" loading="lazy" />
                Open Visualizer
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

export default AIRiskIndicatorPage;

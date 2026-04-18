import healthRisksImg from "/medirator_images/healthrisks.png";

interface HealthRisksProps {
  darkMode?: boolean;
}

const HealthRisks = ({ darkMode = false }: HealthRisksProps) => {
  const aiPredictedRisks = [
    {
      condition: "Hypertension",
      riskLevel: "High",
      probability: "78%",
      confidence: "92%",
      recommendation: "Monitor blood pressure daily and schedule a cardiology follow-up.",
    },
    {
      condition: "Type 2 Diabetes",
      riskLevel: "Moderate",
      probability: "56%",
      confidence: "88%",
      recommendation: "Track fasting glucose weekly and review diet/exercise plan.",
    },
    {
      condition: "Vitamin D Deficiency",
      riskLevel: "Moderate",
      probability: "61%",
      confidence: "85%",
      recommendation: "Consider lab recheck and continue prescribed supplementation.",
    },
  ];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-6  shadow-md">
        <div>
          <h2 className="text-5xl font-bold">Health Risks</h2>
          <p className="mt-2">
            Medirator highlights possible health risk signals <br />
            from your records so you can act early, plan follow-ups, <br />
            and stay proactive about your well-being.
          </p>
        </div>
        <img src={healthRisksImg} alt="Health Risks" className="h-70 w-70" loading="lazy" />
      </div>

      <div className="bg-white dark:bg-black px-6 py-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {aiPredictedRisks.map((risk) => (
              <div
                key={risk.condition}
                className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-semibold text-[#0B3C5D] dark:text-white">{risk.condition}</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      risk.riskLevel === "High"
                        ? "bg-red-700 text-white"
                        : risk.riskLevel === "Moderate"
                          ? "bg-amber-400 text-black"
                          : "bg-emerald-700 text-white"
                    }`}
                  >
                    {risk.riskLevel}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="text-[#4B5563] dark:text-gray-300">
                    Probability: <span className="font-semibold text-[#0B3C5D] dark:text-white">{risk.probability}</span>
                  </div>
                  <div className="text-[#4B5563] dark:text-gray-300">
                    AI Confidence: <span className="font-semibold text-[#0B3C5D] dark:text-white">{risk.confidence}</span>
                  </div>
                  <div className="text-[#4B5563] dark:text-gray-300">
                    Recommendation:
                    <div className="mt-1 text-[#0B3C5D] dark:text-white">{risk.recommendation}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRisks;

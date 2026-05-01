import { useEffect, useState } from "react";
import healthRisksImg from "/medirator_images/healthrisks.png";
import { aiApi } from "../../api/aiApi";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

interface HealthRisksProps {
  darkMode?: boolean;
}

const HealthRisks = ({ darkMode = false }: HealthRisksProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [aiPredictedRisks, setAiPredictedRisks] = useState<
    Array<{
      condition: string;
      riskLevel: string;
      probability: string;
      confidence: string;
      recommendation: string;
    }>
  >([]);

  useEffect(() => {
    const loadRisk = async () => {
      try {
        const response = await aiApi.riskScore({ patient_id: user?.id ?? "me" });
        const nextRisk = {
          condition: response.condition ?? t("services", "compositeRisk", "Composite Risk"),
          riskLevel: response.level,
          probability: response.probability ?? `${response.score}%`,
          confidence: response.confidence ?? t("services", "notAvailable", "N/A"),
          recommendation:
            response.recommendation ?? t("services", "reviewClinicalPlan", "Review clinical plan and monitor vitals."),
        };

        setAiPredictedRisks([nextRisk]);
        setApiError(null);
      } catch {
        setApiError(t("services", "noAvailableData", "No available data."));
      }
    };

    void loadRisk();
  }, [user?.email]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-6  shadow-md">
        <div>
          <h2 className="text-5xl font-bold">{t("navbar", "healthRisks", "Health Risks")}</h2>
          <p className="mt-2">
            {t("services", "healthRisksIntro1", "Medirator highlights possible health risk signals")} <br />
            {t("services", "healthRisksIntro2", "from your records so you can act early, plan follow-ups,")} <br />
            {t("services", "healthRisksIntro3", "and stay proactive about your well-being.")}
          </p>
        </div>
        <img src={healthRisksImg} alt={t("navbar", "healthRisks", "Health Risks")} className="h-70 w-70" loading="lazy" />
      </div>

      <div className="bg-white dark:bg-black px-6 py-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {apiError && (
            <div className="mb-4 rounded-2xl border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
              {apiError}
            </div>
          )}

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
                    {t("services", "probability", "Probability")}:{" "}
                    <span className="font-semibold text-[#0B3C5D] dark:text-white">{risk.probability}</span>
                  </div>
                  <div className="text-[#4B5563] dark:text-gray-300">
                    {t("services", "aiConfidence", "AI Confidence")}:{" "}
                    <span className="font-semibold text-[#0B3C5D] dark:text-white">{risk.confidence}</span>
                  </div>
                  <div className="text-[#4B5563] dark:text-gray-300">
                    {t("services", "recommendationLabel", "Recommendation")}:
                    <div className="mt-1 text-[#0B3C5D] dark:text-white">{risk.recommendation}</div>
                  </div>
                </div>
              </div>
            ))}

            {aiPredictedRisks.length === 0 && !apiError && (
              <div className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-5 text-sm text-[#4B5563] dark:text-gray-300">
                {t("services", "noRiskPrediction", "No AI risk prediction is available for this patient yet.")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRisks;

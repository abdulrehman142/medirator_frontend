
import saltsImg from "/medirator_images/salts.png";
import { useEffect, useState } from "react";
import { clinicalApi } from "../../api/clinicalApi";
import { useLanguage } from "../../context/LanguageContext";

interface SaltItem {
  name: string;
  dose: string;
  frequency: string;
  period?: string;
  startedOn?: string;
}

interface SaltsProps {
  darkMode?: boolean;
}

const Salts = ({ darkMode = false }: SaltsProps) => {
  const { t } = useLanguage();
  const [currentSalts, setCurrentSalts] = useState<SaltItem[]>([]);
  const [pastSalts, setPastSalts] = useState<SaltItem[]>([]);
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [pastError, setPastError] = useState<string | null>(null);

  useEffect(() => {
    const loadSalts = async () => {
      // Load current salts
      try {
        const currentMedications = await clinicalApi.listCurrentMedications();
        if (currentMedications.length > 0) {
          setCurrentSalts(
            currentMedications.slice(0, 12).map((item) => ({
              name: item.medication_name,
              dose: item.dosage,
              frequency: item.instructions,
              startedOn: new Date(item.start_date ?? item.created_at).toLocaleDateString(),
            })),
          );
        }
        setCurrentError(null);
      } catch {
        setCurrentError(t("services", "noCurrentSalts", "No available data for current salts."));
        setCurrentSalts([]);
      }

      // Load past salts
      try {
        const pastMedications = await clinicalApi.listPastMedications();
        if (pastMedications.length > 0) {
          setPastSalts(
            pastMedications.slice(0, 12).map((item) => ({
              name: item.medication_name,
              dose: item.dosage,
              frequency: item.instructions,
              period: `${new Date(item.start_date ?? item.created_at).toLocaleDateString()} - ${new Date(
                item.end_date ?? item.updated_at,
              ).toLocaleDateString()}`,
            })),
          );
        }
        setPastError(null);
      } catch {
        setPastError(t("services", "noPastSalts", "No available data for past salts."));
        setPastSalts([]);
      }
    };

    void loadSalts();
  }, [t]);

  const SaltCard = ({ salt, type }: { salt: SaltItem; type: "current" | "past" }) => (
    <div className="rounded-xl border border-[#0B3C5D]/30 dark:border-white/20 bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-4">
      <div className="font-semibold text-[#0B3C5D] dark:text-white">{salt.name}</div>
      <div className="text-sm text-[#4B5563] dark:text-gray-300 mt-1">
        {salt.dose} • {salt.frequency}
      </div>
      <div className="text-xs mt-2 text-[#6B7280] dark:text-gray-400">
        {type === "current" ? `${t("services", "startedOn", "Started on")}: ${salt.startedOn}` : salt.period}
      </div>
    </div>
  );

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-6 shadow-md">
        <div>
          <h2 className="text-5xl font-bold">{t("navbar", "salts", "Salts")}</h2>
        </div>
        <img src={saltsImg} alt={t("navbar", "salts", "Salts")} className="h-70 w-70" loading="lazy" />
      </div>

      <div className="bg-white dark:bg-black px-6 py-8 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Salts Section - Left Box */}
            <div className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-6">
              <h3 className="text-3xl font-bold text-[#0B3C5D] dark:text-white mb-2">{t("services", "currentSaltsTitle", "Current Salts")}</h3>
              {currentError && (
                <div className="mb-4 rounded-2xl border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
                  {currentError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {currentSalts.map((salt) => (
                  <SaltCard key={`current-${salt.name}-${salt.startedOn}`} salt={salt} type="current" />
                ))}
                {currentSalts.length === 0 && !currentError && (
                  <div className="rounded-xl border border-[#0B3C5D]/30 dark:border-white/20 bg-white dark:bg-[#0B3C5D]/10 p-4 text-sm text-[#4B5563] dark:text-gray-300">
                    {t("services", "noCurrentSaltsAvailable", "No current salts available.")}
                  </div>
                )}
              </div>
            </div>

            {/* Past Salts Section - Right Box */}
            <div className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-6">
              <h3 className="text-3xl font-bold text-[#0B3C5D] dark:text-white mb-2">{t("services", "pastSaltsTitle", "Past Salts")}</h3>

              {pastError && (
                <div className="mb-4 rounded-2xl border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
                  {pastError}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {pastSalts.map((salt) => (
                  <SaltCard key={`past-${salt.name}-${salt.period}`} salt={salt} type="past" />
                ))}
                {pastSalts.length === 0 && !pastError && (
                  <div className="rounded-xl border border-[#0B3C5D]/30 dark:border-white/20 bg-white dark:bg-[#0B3C5D]/10 p-4 text-sm text-[#4B5563] dark:text-gray-300">
                    {t("services", "noPastSaltsAvailable", "No past salts available.")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Salts;

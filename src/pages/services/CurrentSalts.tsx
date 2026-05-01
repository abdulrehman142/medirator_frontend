import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clinicalApi } from "../../api/clinicalApi";

interface CurrentSaltsProps {
  darkMode?: boolean;
}

const CurrentSalts = ({ darkMode = false }: CurrentSaltsProps) => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [patientCurrentSalts, setPatientCurrentSalts] = useState<
    Array<{ name: string; dose: string; frequency: string; startedOn: string }>
  >([]);

  useEffect(() => {
    const loadCurrentSalts = async () => {
      try {
        const medications = await clinicalApi.listCurrentMedications();
        if (medications.length === 0) {
          setPatientCurrentSalts([]);
          return;
        }

        setPatientCurrentSalts(
          medications.slice(0, 12).map((item) => ({
            name: item.medication_name,
            dose: item.dosage,
            frequency: item.instructions,
            startedOn: new Date(item.start_date ?? item.created_at).toLocaleDateString(),
          })),
        );
        setApiError(null);
      } catch {
        setApiError("No available data.");
      }
    };

    void loadCurrentSalts();
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="bg-white dark:bg-black px-6 py-8 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/salts")}
              className="rounded-2xl border border-[#0B3C5D] bg-white px-4 py-2 text-sm font-medium text-black transition-all duration-300 hover:bg-[#0B3C5D] hover:text-white dark:bg-black dark:text-white dark:hover:bg-gray-800"
            >
              Back
            </button>
          </div>
          {apiError && (
            <div className="mb-4 rounded-2xl border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
              {apiError}
            </div>
          )}

          <h2 className="text-4xl font-bold text-[#0B3C5D] dark:text-white">Patient Current Salts</h2>
          <p className="mt-2 text-[#4B5563] dark:text-gray-300">
            Active salts with ongoing dose and frequency details for current treatment.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {patientCurrentSalts.map((salt) => (
              <div
                key={`${salt.name}-${salt.startedOn}`}
                className="rounded-xl border border-[#0B3C5D]/30 dark:border-white/20 bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-4"
              >
                <div className="font-semibold text-[#0B3C5D] dark:text-white">{salt.name}</div>
                <div className="text-sm text-[#4B5563] dark:text-gray-300 mt-1">
                  {salt.dose} • {salt.frequency}
                </div>
                <div className="text-xs mt-2 text-[#6B7280] dark:text-gray-400">
                  Started on: {salt.startedOn}
                </div>
              </div>
            ))}
            {patientCurrentSalts.length === 0 && !apiError && (
              <div className="rounded-xl border border-[#0B3C5D]/30 dark:border-white/20 bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-4 text-sm text-[#4B5563] dark:text-gray-300">
                No current salts have been set by the doctor yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentSalts;

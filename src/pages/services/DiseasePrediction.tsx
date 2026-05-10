import { useEffect, useMemo, useState } from "react";

import { diseasePredictionApi } from "../../api/diseasePredictionApi";
import { useLanguage } from "../../context/LanguageContext";
import { predictSymptoms, type SymptomPredictionResponse } from "../../services/api";
import diseasePredictionImg from "/medirator_images/predictive.png";

interface DiseasePredictionProps {
  darkMode?: boolean;
}

const DiseasePrediction = ({ darkMode = false }: DiseasePredictionProps) => {
  const { t } = useLanguage();
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPredicting, setIsPredicting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [prediction, setPrediction] =
    useState<SymptomPredictionResponse | null>(null);

  useEffect(() => {
    const loadSymptoms = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const response = await diseasePredictionApi.getSymptoms();
        setSymptoms(response.symptoms || []);
      } catch (error) {
        console.error("Failed to load symptoms:", error);
        setApiError(
          t(
            "services",
            "failedToLoadSymptoms",
            "Failed to load symptoms. Please try again.",
          ),
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSymptoms();
  }, [t]);

  const filteredSymptoms = useMemo(() => {
    if (!searchQuery.trim()) {
      return symptoms;
    }

    const query = searchQuery.toLowerCase();
    return symptoms.filter((symptom) => symptom.toLowerCase().includes(query));
  }, [symptoms, searchQuery]);

  const handleSymptomToggle = (symptom: string) => {
    const nextSelected = new Set(selectedSymptoms);
    if (nextSelected.has(symptom)) {
      nextSelected.delete(symptom);
    } else {
      nextSelected.add(symptom);
    }

    setSelectedSymptoms(nextSelected);
    setPrediction(null);
  };

  const handleRemoveSymptom = (symptom: string) => {
    const nextSelected = new Set(selectedSymptoms);
    nextSelected.delete(symptom);
    setSelectedSymptoms(nextSelected);
    setPrediction(null);
  };

  const handlePredictDisease = async () => {
    if (selectedSymptoms.size === 0) {
      setApiError(
        t("services", "selectSymptoms", "Please select at least one symptom."),
      );
      return;
    }

    setIsPredicting(true);
    setApiError(null);
    setPrediction(null);

    try {
      const response = await predictSymptoms(Array.from(selectedSymptoms).join(", "));
      setPrediction(response);
    } catch (error) {
      console.error("Prediction failed:", error);
      setApiError("AI service is currently unavailable. Please try again.");
    } finally {
      setIsPredicting(false);
    }
  };

  const handleClearAll = () => {
    setSelectedSymptoms(new Set());
    setSearchQuery("");
    setPrediction(null);
    setApiError(null);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col items-center justify-between gap-6 bg-[#0B3C5D] p-4 text-white shadow-md md:flex-row dark:bg-black">
        <div>
          <h2 className="ml-0 text-center text-3xl font-bold md:ml-5 md:pl-5 md:text-left md:text-5xl">
            Symptom Predictor
          </h2>
          <p className="ml-0 mt-2 text-center text-sm text-gray-200 md:ml-5 md:pl-5 md:text-left md:text-base">
            Select your symptoms and let our AI help identify potential diseases.
          </p>
        </div>
        <img
          src={diseasePredictionImg}
          alt="Disease Prediction"
          className="h-40 w-40 md:h-70 md:w-70"
          loading="lazy"
        />
      </div>

      <div className="min-h-screen bg-white px-6 py-8 dark:bg-black">
        <div className="mx-auto max-w-6xl">
          {apiError && (
            <div className="mb-4 rounded-2xl border border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-300">
              {apiError}
            </div>
          )}

          {isLoading && (
            <div className="mb-4 rounded-2xl border border-[#0B3C5D] bg-[#F7FAFC] px-4 py-3 text-sm text-[#0B3C5D] dark:border-white dark:bg-white/5 dark:text-white">
              {t("auth", "loading", "Loading symptoms...")}
            </div>
          )}

          {!isLoading && symptoms.length > 0 && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] p-5 shadow-sm dark:bg-[#0B3C5D]/20">
                  <div className="mb-4">
                    <h3 className="mb-3 text-xl font-semibold text-[#0B3C5D] dark:text-white">
                      {t("services", "selectSymptoms", "Select Symptoms")}
                    </h3>
                    <p className="text-sm text-[#6B7280] dark:text-gray-400">
                      {symptoms.length} symptoms available
                    </p>
                  </div>

                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder={t(
                        "services",
                        "searchSymptoms",
                        "Search symptoms...",
                      )}
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="w-full rounded-lg border border-[#E6E9EE] bg-white px-4 py-2 text-[#0B3C5D] placeholder-gray-400 dark:border-white/10 dark:bg-black/20 dark:text-white"
                    />
                  </div>

                  <div className="mb-4 max-h-96 overflow-y-auto rounded-lg border border-[#E6E9EE] bg-white p-4 dark:border-white/10 dark:bg-black/20">
                    {filteredSymptoms.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {filteredSymptoms.map((symptom) => (
                          <label
                            key={symptom}
                            className="flex cursor-pointer items-center gap-2 rounded p-2 transition-colors hover:bg-[#F0F4F8] dark:hover:bg-white/5"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSymptoms.has(symptom)}
                              onChange={() => handleSymptomToggle(symptom)}
                              className="h-4 w-4 cursor-pointer rounded border-[#E6E9EE] accent-[#0B3C5D]"
                            />
                            <span className="break-words text-sm text-[#0B3C5D] dark:text-white">
                              {symptom}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center text-[#6B7280] dark:text-gray-400">
                        {t(
                          "services",
                          "noSymptomsFound",
                          "No symptoms found matching your search.",
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-[#6B7280] dark:text-gray-400">
                    {t("services", "symptomsSelected", "Selected")} {selectedSymptoms.size}{" "}
                    {t("services", "symptoms", "symptoms")}
                  </div>
                </div>
              </div>

              <div className="space-y-4 lg:col-span-1">
                <div className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] p-5 shadow-sm dark:bg-[#0B3C5D]/20">
                  <h3 className="mb-3 text-lg font-semibold text-[#0B3C5D] dark:text-white">
                    {t("services", "selectedSymptoms", "Selected Symptoms")}
                  </h3>

                  {selectedSymptoms.size > 0 ? (
                    <div className="max-h-48 space-y-2 overflow-y-auto">
                      {Array.from(selectedSymptoms).map((symptom) => (
                        <div
                          key={symptom}
                          className="flex items-center justify-between gap-2 rounded-lg bg-[#0B3C5D] px-3 py-2 text-sm text-white"
                        >
                          <span className="break-words">{symptom}</span>
                          <button
                            onClick={() => handleRemoveSymptom(symptom)}
                            className="ml-auto flex-shrink-0 font-bold text-white hover:text-red-200"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm italic text-[#6B7280] dark:text-gray-400">
                      {t("services", "noSymptomSelected", "No symptoms selected")}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handlePredictDisease}
                    disabled={selectedSymptoms.size === 0 || isPredicting}
                    className="flex w-full items-center justify-center rounded-lg bg-[#0B3C5D] px-4 py-3 font-semibold text-white transition-colors hover:bg-[#082a47] disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    <img
                      src={diseasePredictionImg}
                      alt="Predict"
                      className="mr-2 inline-block h-5 w-5"
                      loading="lazy"
                    />
                    {isPredicting
                      ? t("auth", "loading", "Predicting...")
                      : t("services", "predictDisease", "Predict Disease")}
                  </button>

                  {selectedSymptoms.size > 0 && (
                    <button
                      onClick={handleClearAll}
                      disabled={isPredicting}
                      className="w-full rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-[#0B3C5D] transition-colors hover:bg-gray-400 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    >
                      {t("services", "clearAll", "Clear All")}
                    </button>
                  )}
                </div>

                {prediction && (
                  <div className="rounded-2xl border-2 border-green-500 bg-green-50 p-5 shadow-sm dark:bg-green-950/20">
                    <h3 className="mb-2 text-lg font-semibold text-green-700 dark:text-green-300">
                      {t("services", "prediction", "Prediction")}
                    </h3>
                    <pre className="overflow-x-auto rounded-2xl bg-white p-4 text-sm leading-6 text-gray-800 dark:bg-black/30 dark:text-gray-100">
                      {JSON.stringify(prediction, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {!isLoading && symptoms.length === 0 && (
            <div className="rounded-2xl border-2 border-amber-500 bg-amber-50 p-6 text-center dark:bg-amber-950/20">
              <p className="text-amber-700 dark:text-amber-300">
                {t(
                  "services",
                  "noSymptomsAvailable",
                  "Disease prediction models are not available at the moment.",
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseasePrediction;

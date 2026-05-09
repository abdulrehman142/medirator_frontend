import { useEffect, useState, useMemo } from "react";
import {
  diseasePredictionApi,
  type DiseasePredictionResponse,
} from "../../api/diseasePredictionApi";
import { useLanguage } from "../../context/LanguageContext";
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
  const [isPrediciting, setIsPredicting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [prediction, setPrediction] =
    useState<DiseasePredictionResponse | null>(null);

  // Load symptoms on mount
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

  // Filter symptoms based on search query
  const filteredSymptoms = useMemo(() => {
    if (!searchQuery.trim()) {
      return symptoms;
    }
    const query = searchQuery.toLowerCase();
    return symptoms.filter((symptom) => symptom.toLowerCase().includes(query));
  }, [symptoms, searchQuery]);

  const handleSymptomToggle = (symptom: string) => {
    const newSelected = new Set(selectedSymptoms);
    if (newSelected.has(symptom)) {
      newSelected.delete(symptom);
    } else {
      newSelected.add(symptom);
    }
    setSelectedSymptoms(newSelected);
    setPrediction(null); // Clear previous prediction when symptoms change
  };

  const handleRemoveSymptom = (symptom: string) => {
    const newSelected = new Set(selectedSymptoms);
    newSelected.delete(symptom);
    setSelectedSymptoms(newSelected);
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
      const response = await diseasePredictionApi.predictDisease({
        symptoms: Array.from(selectedSymptoms),
      });
      setPrediction(response);
    } catch (error) {
      console.error("Prediction failed:", error);
      setApiError(
        error instanceof Error
          ? error.message
          : t(
              "services",
              "predictionFailed",
              "Disease prediction failed. Please try again.",
            ),
      );
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
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">
            Symptom Predictor
          </h2>
          <p className="text-sm md:text-base text-center md:text-left ml-0 md:ml-5 md:pl-5 mt-2 text-gray-200">
            Select your symptoms and let our AI help identify potential
            diseases.
          </p>
        </div>
        <img
          src={diseasePredictionImg}
          alt="Disease Prediction"
          className="h-40 md:h-70 w-40 md:w-70"
          loading="lazy"
        />
      </div>

      <div className="bg-white dark:bg-black px-6 py-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Error Message */}
          {apiError && (
            <div className="mb-4 rounded-2xl border border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-300">
              {apiError}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mb-4 rounded-2xl border border-[#0B3C5D] bg-[#F7FAFC] px-4 py-3 text-sm text-[#0B3C5D] dark:border-white dark:bg-white/5 dark:text-white">
              {t("auth", "loading", "Loading symptoms...")}
            </div>
          )}

          {!isLoading && symptoms.length > 0 && (
            <>
              {/* Main Content */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left Column - Symptom Selection */}
                <div className="lg:col-span-2">
                  <div className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] p-5 shadow-sm dark:bg-[#0B3C5D]/20">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-[#0B3C5D] dark:text-white mb-3">
                        {t("services", "selectSymptoms", "Select Symptoms")}
                      </h3>
                      <p className="text-sm text-[#6B7280] dark:text-gray-400">
                        {symptoms.length} symptoms available
                      </p>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder={t(
                          "services",
                          "searchSymptoms",
                          "Search symptoms...",
                        )}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-[#E6E9EE] rounded-lg bg-white dark:bg-black/20 dark:border-white/10 dark:text-white text-[#0B3C5D] placeholder-gray-400"
                      />
                    </div>

                    {/* Symptoms List */}
                    <div className="mb-4 rounded-lg border border-[#E6E9EE] dark:border-white/10 bg-white dark:bg-black/20 p-4 max-h-96 overflow-y-auto">
                      {filteredSymptoms.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {filteredSymptoms.map((symptom) => (
                            <label
                              key={symptom}
                              className="flex items-center gap-2 p-2 rounded hover:bg-[#F0F4F8] dark:hover:bg-white/5 cursor-pointer transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={selectedSymptoms.has(symptom)}
                                onChange={() => handleSymptomToggle(symptom)}
                                className="w-4 h-4 rounded border-[#E6E9EE] cursor-pointer accent-[#0B3C5D]"
                              />
                              <span className="text-sm text-[#0B3C5D] dark:text-white break-words">
                                {symptom}
                              </span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-[#6B7280] dark:text-gray-400">
                          {t(
                            "services",
                            "noSymptomsFound",
                            "No symptoms found matching your search.",
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-[#6B7280] dark:text-gray-400">
                      {t("services", "symptomsSelected", "Selected")}{" "}
                      {selectedSymptoms.size}{" "}
                      {t("services", "symptoms", "symptoms")}
                    </div>
                  </div>
                </div>

                {/* Right Column - Selected & Prediction */}
                <div className="lg:col-span-1 space-y-4">
                  {/* Selected Symptoms */}
                  <div className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] p-5 shadow-sm dark:bg-[#0B3C5D]/20">
                    <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white mb-3">
                      {t("services", "selectedSymptoms", "Selected Symptoms")}
                    </h3>

                    {selectedSymptoms.size > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {Array.from(selectedSymptoms).map((symptom) => (
                          <div
                            key={symptom}
                            className="flex items-center justify-between gap-2 bg-[#0B3C5D] text-white px-3 py-2 rounded-lg text-sm"
                          >
                            <span className="break-words">{symptom}</span>
                            <button
                              onClick={() => handleRemoveSymptom(symptom)}
                              className="text-white hover:text-red-200 font-bold ml-auto flex-shrink-0"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-[#6B7280] dark:text-gray-400 italic">
                        {t(
                          "services",
                          "noSymptomSelected",
                          "No symptoms selected",
                        )}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={handlePredictDisease}
                      disabled={selectedSymptoms.size === 0 || isPrediciting}
                      className="w-full bg-[#0B3C5D] hover:bg-[#082a47] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <img
                        src={diseasePredictionImg}
                        alt="Predict"
                        className="inline-block w-5 h-5 mr-2"
                        loading="lazy"
                      />
                      {isPrediciting
                        ? t("auth", "loading", "Predicting...")
                        : t("services", "predictDisease", "Predict Disease")}
                    </button>

                    {selectedSymptoms.size > 0 && (
                      <button
                        onClick={handleClearAll}
                        disabled={isPrediciting}
                        className="w-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 disabled:cursor-not-allowed text-[#0B3C5D] dark:text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        {t("services", "clearAll", "Clear All")}
                      </button>
                    )}
                  </div>

                  {/* Prediction Result */}
                  {prediction && (
                    <div className="rounded-2xl border-2 border-green-500 bg-green-50 dark:bg-green-950/20 p-5 shadow-sm">
                      <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">
                        {t("services", "prediction", "Prediction")}
                      </h3>

                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium text-green-600 dark:text-green-400">
                            {t(
                              "services",
                              "predictedDisease",
                              "Predicted Disease",
                            )}
                          </div>
                          <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                            {prediction.predicted_disease}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-green-600 dark:text-green-400">
                            {t("services", "confidence", "Confidence")}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-grow bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all"
                                style={{ width: `${prediction.confidence}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-green-700 dark:text-green-300">
                              {prediction.confidence.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-green-600 dark:text-green-400">
                          Matched: {prediction.valid_count}/
                          {prediction.input_count} symptoms
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {!isLoading && symptoms.length === 0 && (
            <div className="rounded-2xl border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-6 text-center">
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

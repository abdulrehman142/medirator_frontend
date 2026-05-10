import { useState } from "react";

import { predictSymptoms, type SymptomPredictionResponse } from "../../services/api";
import diseasePredictionImg from "/medirator_images/predictive.png";

interface DiseasePredictionProps {
  darkMode?: boolean;
}

const DiseasePrediction = ({ darkMode = false }: DiseasePredictionProps) => {
  const [symptomsInput, setSymptomsInput] = useState("");
  const [isPredicting, setIsPredicting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [prediction, setPrediction] =
    useState<SymptomPredictionResponse | null>(null);

  const handlePredictSymptoms = async () => {
    const trimmedSymptoms = symptomsInput.trim();

    if (!trimmedSymptoms) {
      setApiError("Please enter your symptoms.");
      return;
    }

    setIsPredicting(true);
    setApiError(null);
    setPrediction(null);

    try {
      const response = await predictSymptoms(trimmedSymptoms);
      setPrediction(response);
    } catch (error) {
      console.error("Prediction failed:", error);
      setApiError("AI service is currently unavailable. Please try again.");
    } finally {
      setIsPredicting(false);
    }
  };

  const handleClearAll = () => {
    setSymptomsInput("");
    setPrediction(null);
    setApiError(null);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col items-center justify-between gap-6 bg-[#0B3C5D] px-6 py-8 text-white shadow-md md:flex-row dark:bg-black">
        <div className="max-w-2xl">
          <h2 className="text-center text-3xl font-bold md:text-left md:text-5xl">
            Symptom Predictor
          </h2>
          <p className="mt-3 text-center text-sm text-gray-200 md:text-left md:text-base">
            Enter your symptoms and get a real-time prediction from the Render backend.
          </p>
        </div>
        <img
          src={diseasePredictionImg}
          alt="Disease Prediction"
          className="h-36 w-36 md:h-56 md:w-56"
          loading="lazy"
        />
      </div>

      <div className="min-h-screen bg-white px-6 py-8 dark:bg-black">
        <div className="mx-auto max-w-4xl space-y-6">
          {apiError && (
            <div className="rounded-2xl border border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-300">
              {apiError}
            </div>
          )}

          {isPredicting && (
            <div className="rounded-2xl border border-[#0B3C5D] bg-[#F7FAFC] px-4 py-3 text-sm text-[#0B3C5D] dark:border-white dark:bg-white/5 dark:text-white">
              Processing...
            </div>
          )}

          <div className="rounded-3xl border-2 border-[#0B3C5D] bg-[#F7FAFC] p-6 shadow-sm dark:bg-[#0B3C5D]/20">
            <label className="mb-3 block text-lg font-semibold text-[#0B3C5D] dark:text-white">
              Enter Symptoms
            </label>

            <textarea
              value={symptomsInput}
              onChange={(event) => setSymptomsInput(event.target.value)}
              placeholder="Example: fever, cough, headache, body aches"
              rows={6}
              className="w-full rounded-2xl border border-[#E6E9EE] bg-white px-4 py-3 text-[#0B3C5D] placeholder-gray-400 outline-none transition focus:border-[#0B3C5D] dark:border-white/10 dark:bg-black/20 dark:text-white"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handlePredictSymptoms}
                disabled={isPredicting}
                className="inline-flex items-center justify-center rounded-xl bg-[#0B3C5D] px-5 py-3 font-semibold text-white transition hover:bg-[#082a47] disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isPredicting ? "Processing..." : "Predict Symptoms"}
              </button>

              <button
                onClick={handleClearAll}
                disabled={isPredicting && !symptomsInput}
                className="inline-flex items-center justify-center rounded-xl bg-gray-200 px-5 py-3 font-semibold text-[#0B3C5D] transition hover:bg-gray-300 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
          </div>

          {prediction && (
            <div className="rounded-3xl border-2 border-green-500 bg-green-50 p-6 shadow-sm dark:bg-green-950/20">
              <h3 className="mb-4 text-lg font-semibold text-green-700 dark:text-green-300">
                Prediction Result
              </h3>
              <pre className="overflow-x-auto rounded-2xl bg-white p-4 text-sm leading-6 text-gray-800 dark:bg-black/30 dark:text-gray-100">
                {JSON.stringify(prediction, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseasePrediction;
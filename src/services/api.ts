export type SymptomPredictionResponse = Record<string, unknown>;

const mlBaseURL =
  import.meta.env.VITE_ML_API_BASE_URL ??
  "https://medirator-backend.onrender.com";

const predictUrl = new URL("/ml/predict", mlBaseURL).toString();

export async function predictSymptoms(
  input: string,
): Promise<SymptomPredictionResponse> {
  const response = await fetch(predictUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ symptoms: input }),
  });

  if (!response.ok) {
    throw new Error("Prediction request failed");
  }

  return response.json();
}
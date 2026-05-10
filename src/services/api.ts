import { http } from "../api/http";

export interface SymptomPredictionResponse {
  status: string;
  prediction: string;
  confidence: number;
  details: unknown;
}

export async function predictSymptoms(
  input: string,
): Promise<SymptomPredictionResponse> {
  const { data } = await http.post<SymptomPredictionResponse>("/ml/predict", {
    input,
  });

  return data;
}
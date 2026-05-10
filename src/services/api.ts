import { http } from "../api/http";

export type SymptomPredictionResponse = Record<string, unknown>;

export async function predictSymptoms(
  input: string,
): Promise<SymptomPredictionResponse> {
  const { data } = await http.post<SymptomPredictionResponse>("/ml/predict", {
    input,
  });

  return data;
}
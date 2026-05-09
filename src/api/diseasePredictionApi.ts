import { http } from "./http";

export interface DiseasePredictionRequest {
  symptoms: string[];
}

export interface DiseasePredictionResponse {
  predicted_disease: string;
  confidence: number;
  matched_symptoms: string[];
  input_count: number;
  valid_count: number;
}

export interface SymptomListResponse {
  symptoms: string[];
  count: number;
}

export const diseasePredictionApi = {
  async getSymptoms(): Promise<SymptomListResponse> {
    const { data } = await http.get<SymptomListResponse>(
      "/symptom-predictor/symptoms",
    );
    return data;
  },

  async predictDisease(
    request: DiseasePredictionRequest,
  ): Promise<DiseasePredictionResponse> {
    const { data } = await http.post<DiseasePredictionResponse>(
      "/symptom-predictor/predict-disease",
      request,
    );
    return data;
  },
};

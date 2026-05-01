import { http } from "./http";
import { getStoredLanguage, type SupportedLanguageCode } from "../i18n";

export interface RiskScoreRequest {
  patient_id: string;
  lang?: SupportedLanguageCode;
}

export interface RiskScoreResponse {
  score: number;
  level: string;
  trend: string;
  factors: string[];
  history: number[];
  probability?: string;
  confidence?: string;
  recommendation?: string;
  condition?: string;
}

export const aiApi = {
  async riskScore(payload: RiskScoreRequest): Promise<RiskScoreResponse> {
    const { data } = await http.post<RiskScoreResponse>("/ai/risk-score", {
      ...payload,
      lang: payload.lang ?? getStoredLanguage(),
    });
    return data;
  },
};

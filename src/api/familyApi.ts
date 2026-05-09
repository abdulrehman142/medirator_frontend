import { http } from "./http";

export interface FamilyRiskMemberPayload {
  relation: string;
  disease: string;
  name?: string;
  age?: number | null;
}

export interface FamilyRiskAnalysisResponse {
  ml_prediction: number;
  risk_percentage: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  reasons: string[];
  risks?: Array<{
    disease: string;
    risk_level: "LOW" | "MEDIUM" | "HIGH";
    risk: number;
    risk_percentage: number; // numeric 0-100
    linked_family_members: string[];
  }>;
}

export const familyApi = {
  async analyzeFamilyRisk(
    payload: FamilyRiskMemberPayload[],
  ): Promise<FamilyRiskAnalysisResponse> {
    const { data } = await http.post<FamilyRiskAnalysisResponse>(
      "/family/analyze",
      payload,
    );
    return data;
  },
};

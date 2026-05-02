import { axiosInstance } from "./http";

export interface FamilyMemberEntry {
  relation: string;
  age: number;
  disease: string;
}

export interface RiskAnalysisRequest {
  family_members: FamilyMemberEntry[];
  symptom_description: string;
}

export interface FamilyRiskResult {
  genetic_risk_percentage: number;
  risk_level: "Low" | "Medium" | "High";
  explanation: string;
}

export interface SymptomRiskResult {
  predicted_disease: string;
  confidence: number;
  explanation: string;
}

export interface CombinedRiskReport {
  id: string | null;
  patient_id: string;
  created_at: string;
  family_history_analysis: FamilyRiskResult;
  symptom_analysis: SymptomRiskResult;
  overall_risk_score: number;
  genetic_contribution: number;
  symptom_contribution: number;
  most_likely_disease: string;
  final_interpretation: string;
}

export interface DiseasesListResponse {
  diseases: string[];
}

export const riskAnalysisApi = {
  /**
   * Run AI Risk Analysis for a patient
   */
  async runAnalysis(request: RiskAnalysisRequest): Promise<CombinedRiskReport> {
    const response = await axiosInstance.post<CombinedRiskReport>(
      "/risk-analysis/analyze",
      request
    );
    return response.data;
  },

  /**
   * Get the latest risk assessment report for a patient
   */
  async getLatestReport(patientId?: string): Promise<CombinedRiskReport> {
    const params = patientId ? { patient_id: patientId } : undefined;
    const response = await axiosInstance.get<CombinedRiskReport>(
      "/risk-analysis/report",
      { params }
    );
    return response.data;
  },

  /**
   * Get the list of standardized diseases for dropdown
   */
  async getDiseases(): Promise<DiseasesListResponse> {
    const response = await axiosInstance.get<DiseasesListResponse>(
      "/risk-analysis/diseases"
    );
    return response.data;
  },
};

import { http } from "./http";
import {
  extractList,
  mapDoctor,
  mapPatient,
} from "./adminApiHelpers";

export interface DashboardMetrics {
  total_users: number;
  total_appointments: number;
  active_doctors: number;
}

export interface AdminAnalyticsResponse {
  totals: {
    total_doctors: number;
    total_patients: number;
    active_doctors: number;
    total_appointments: number;
  };
  patient_growth: Array<{ label: string; value: number }>;
  appointment_trends: Array<{ label: string; value: number }>;
  peak_usage_times: Array<{ hour: number; label: string; count: number }>;
  most_active_doctors: Array<{ doctor_id: string; name: string; completed_appointments: number }>;
  recent_activity: string[];
  alerts: string[];
}

export interface AdminDoctor {
  id: string;
  name: string;
  specialization: string;
  status: "Active" | "Suspended";
  verification: "Approved" | "Pending" | "Rejected";
}

export interface AdminPatient {
  id: string;
  user_id?: string;
  name: string;
  age: number;
  status: "Active" | "Inactive";
  flagged_critical: boolean;
  family_history: string;
  gender?: string;
  phone?: string;
  blood_group?: string;
  allergies?: string;
  chronic_diseases?: string;
  emergency_contact?: string;
}

export interface SecurityEvent {
  id: string;
  user: string;
  role: string;
  status: "Success" | "Failed";
  ip: string;
  time: string;
}

export interface AIModel {
  id: string;
  name: string;
  version: string;
  status: "Active" | "Inactive";
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  specificity: number;
  auc: number;
  latencyMs: number;
  performance: string;
  lastTrained: string;
  logs: string[];
}

export const adminApi = {
  async metrics(): Promise<DashboardMetrics> {
    const { data } = await http.get<DashboardMetrics>("/admin/metrics");
    return data;
  },

  async insights(): Promise<Record<string, number>> {
    const { data } = await http.get<Record<string, number>>("/admin/insights");
    return data;
  },

  async analytics(): Promise<AdminAnalyticsResponse> {
    const { data } = await http.get<AdminAnalyticsResponse>("/admin/analytics");
    return data;
  },

  async listDoctors(): Promise<AdminDoctor[]> {
    const { data } = await http.get<unknown>("/admin/doctors");
    const rows = extractList(data, ["doctors", "results", "items", "data"]);
    return rows.map(mapDoctor);
  },

  async updateDoctor(doctorId: string, payload: Partial<AdminDoctor>): Promise<AdminDoctor> {
    const requestPayload = {
      ...payload,
      status: payload.status,
      doctor_status: payload.status,
      verification: payload.verification,
      verification_status: payload.verification,
    };

    const { data } = await http.patch<unknown>(`/admin/doctors/${doctorId}`, requestPayload);
    const rows = extractList(data, ["doctor", "doctors", "results", "items", "data"]);
    if (rows.length > 0) {
      return mapDoctor(rows[0]);
    }

    return mapDoctor(data);
  },

  async listPatients(): Promise<AdminPatient[]> {
    const { data } = await http.get<unknown>("/admin/patients");
    const rows = extractList(data, ["patients", "results", "items", "data"]);
    return rows.map(mapPatient);
  },

  async deletePatient(patientId: string): Promise<void> {
    await http.delete(`/admin/patients/${patientId}`);
  },

  async listAiModels(): Promise<AIModel[]> {
    const { data } = await http.get<AIModel[]>("/admin/ai-models");
    return data;
  },

  async setAiModelStatus(modelId: string, status: "Active" | "Inactive"): Promise<void> {
    await http.patch(`/admin/ai-models/${modelId}/status`, { status });
  },
};

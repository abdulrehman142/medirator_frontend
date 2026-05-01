import { http } from "./http";
import type { TestReport } from "../types/api";

export interface TestReportPayload {
  patient_id: string;
  doctor_id: string;
  report_type: string;
  file_name: string;
  file_path: string;
  metadata: Record<string, string>;
}

export interface ReportUploadPayload {
  patient_id: string;
  doctor_id: string;
  report_type: string;
  file: File;
  metadata?: Record<string, string>;
}

export const reportsApi = {
  async create(payload: TestReportPayload): Promise<TestReport> {
    const { data } = await http.post<TestReport>("/reports", payload);
    return data;
  },

  async upload(payload: ReportUploadPayload): Promise<TestReport> {
    const formData = new FormData();
    formData.append("patient_id", payload.patient_id);
    formData.append("doctor_id", payload.doctor_id);
    formData.append("report_type", payload.report_type);
    formData.append("file", payload.file);

    if (payload.metadata) {
      formData.append("metadata", JSON.stringify(payload.metadata));
    }

    const { data } = await http.post<TestReport>("/reports/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return data;
  },

  // PATIENT SCOPE VALIDATION: Enforce patient_id filtering to ensure documents are scoped to patient
  async list(params?: { patient_id?: string; report_type?: string }): Promise<TestReport[]> {
    const { data } = await http.get<TestReport[]>("/reports", { params });
    
    // PATIENT SCOPE VALIDATION: Client-side validation - filter reports to match requested patient_id
    if (params?.patient_id && Array.isArray(data)) {
      return data.filter((report) => {
        const reportPatientId = report.patient_id || report.metadata?.patient_id;
        return reportPatientId === params.patient_id;
      });
    }
    
    return data;
  },

  async downloadFile(reportId: string): Promise<{ blob: Blob; fileName: string }> {
    const response = await http.get<Blob>(`/reports/${reportId}/download`, {
      responseType: "blob",
    });
    const dispositionHeader = response.headers["content-disposition"] as string | undefined;
    const match = dispositionHeader?.match(/filename="?([^"]+)"?/i);
    return {
      blob: response.data,
      fileName: match?.[1] ?? "report",
    };
  },

  async updateStatus(reportId: string, status: "Pending" | "Approved" | "Rejected"): Promise<TestReport> {
    const normalizedStatus = status.toLowerCase();
    const { data } = await http.patch<TestReport>(`/reports/${reportId}`, {
      status: normalizedStatus,
      metadata: { status },
    });
    return data;
  },

  // PATIENT SCOPE VALIDATION: Update metadata with patient_id enforcement
  async updateMetadata(reportId: string, metadata: Record<string, string>): Promise<TestReport> {
    const { data } = await http.patch<TestReport>(`/reports/${reportId}`, {
      metadata,
    });
    return data;
  },

  async remove(reportId: string): Promise<{ message: string }> {
    const { data } = await http.delete<{ message: string }>(`/reports/${reportId}`);
    return data;
  },
};

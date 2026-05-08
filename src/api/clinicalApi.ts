import { http } from "./http";

export interface MedicalHistoryPayload {
  patient_id: string;
  diagnosis: string;
  chronic_conditions: string[];
  allergies: string[];
}

export interface ClinicalNotePayload {
  patient_id: string;
  doctor_id: string;
  note: string;
}

export interface PrescriptionPayload {
  patient_id: string;
  doctor_id: string;
  medication: string;
  dosage: string;
  instructions: string;
}

export interface TimelineItem {
  id: string;
  record_type: string;
  patient_id: string;
  doctor_id?: string;
  summary: string;
  created_at: string;
}

export interface MedicationItem {
  id: string;
  patient_id: string;
  doctor_id: string;
  medication_name: string;
  dosage: string;
  instructions: string;
  status: "current" | "past" | "inactive";
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
}

export const clinicalApi = {
  upsertHistory(payload: MedicalHistoryPayload) {
    return http.put("/clinical/family-history", payload);
  },

  createNote(payload: ClinicalNotePayload) {
    return http.post("/clinical/notes", payload);
  },

  deleteNote(noteId: string) {
    return http.delete(`/clinical/notes/${noteId}`);
  },

  createPrescription(payload: PrescriptionPayload) {
    return http.post("/clinical/prescriptions", payload);
  },

  async timeline(patientId: string): Promise<TimelineItem[]> {
    const { data } = await http.get<TimelineItem[]>(`/clinical/timeline/${patientId}`);
    return data;
  },

  async listCurrentMedications(patientId?: string): Promise<MedicationItem[]> {
    const { data } = await http.get<MedicationItem[]>("/clinical/medications/current", {
      params: patientId ? { patient_id: patientId } : undefined,
    });
    return data;
  },

  async listPastMedications(patientId?: string): Promise<MedicationItem[]> {
    const { data } = await http.get<MedicationItem[]>("/clinical/medications/past", {
      params: patientId ? { patient_id: patientId } : undefined,
    });
    return data;
  },

  async createMedication(payload: {
    patient_id: string;
    doctor_id: string;
    medication_name: string;
    dosage: string;
    instructions: string;
    status?: "current" | "past" | "inactive";
    start_date?: string;
    end_date?: string;
  }): Promise<MedicationItem> {
    const { data } = await http.post<MedicationItem>("/clinical/medications", payload);
    return data;
  },

  async updateMedication(
    medicationId: string,
    payload: { status?: "current" | "past" | "inactive"; dosage?: string; instructions?: string; end_date?: string },
  ): Promise<MedicationItem> {
    const { data } = await http.patch<MedicationItem>(`/clinical/medications/${medicationId}`, payload);
    return data;
  },

  async records(patientId: string): Promise<Record<string, unknown>> {
    const { data } = await http.get<Record<string, unknown>>(`/clinical/records/${patientId}`);
    return data;
  },

  async myRecords(): Promise<Record<string, unknown>> {
    const { data } = await http.get<Record<string, unknown>>("/clinical/records/me");
    return data;
  },
};

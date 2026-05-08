export type Role = "patient" | "doctor" | "admin";

export interface TokenPair {
  access_token: string;
  refresh_token?: string;
  token_type: "bearer";
}

export interface UserPublic {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  is_active: boolean;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  reason: string;
  scheduled_for: string;
  status: "scheduled" | "rescheduled" | "canceled" | "completed";
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface TestReport {
  id: string;
  patient_id: string;
  doctor_id: string;
  report_type: string;
  file_name: string;
  file_path: string;
  metadata: Record<string, string>;
  created_at: string;
}

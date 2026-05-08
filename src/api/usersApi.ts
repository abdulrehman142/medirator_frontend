import { http } from "./http";

import type { UserPublic } from "../types/api";

export interface UserUpdatePayload {
  full_name?: string;
}

export interface PatientProfile {
  user_id: string;
  age?: number;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
  blood_group?: string;
  allergies?: string[];
  chronic_diseases?: string[];
  emergency_contact?: string;
  family_history?: string;
  medical_history?: string;
  family_tree?: Array<{
    id: string;
    relationship: string;
    name: string;
    age: string;
    disease: string;
    displayName: string;
  }>;
}

export interface DoctorProfile {
  user_id: string;
  specialization?: string;
  license_number?: string;
  years_of_experience?: number;
  phone?: string;
}

export interface RegisteredDoctor {
  id: string;
  display_id?: string;
  name: string;
  specialization?: string;
  status?: string;
  verification?: string;
}

export interface RegisteredPatient {
  id: string;
  display_id?: string;
  name: string;
  age?: number;
  gender?: string;
  phone?: string;
  blood_group?: string;
  allergies?: string[];
  chronic_diseases?: string[];
  emergency_contact?: string;
  family_history?: string;
  medical_history?: string;
}

export interface DoctorPatientProfileView {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  contact?: string;
  blood_group?: string;
  allergies?: string;
  chronic_diseases?: string;
  emergency_contact?: string;
  family_history?: string;
  medical_history?: string;
  family_tree?: Array<{
    id: string;
    relationship: string;
    name: string;
    age: string;
    disease: string;
    displayName: string;
  }>;
  doctor_notes?: Array<Record<string, unknown>>;
  uploaded_documents?: Array<Record<string, unknown>>;
}

export const usersApi = {
  async me(): Promise<UserPublic> {
    const { data } = await http.get<UserPublic>("/users/me");
    return data;
  },

  async updateMe(payload: UserUpdatePayload): Promise<UserPublic> {
    const { data } = await http.patch<UserPublic>("/users/me", payload);
    return data;
  },

  async getMyPatientProfile(): Promise<PatientProfile | null> {
    const { data } = await http.get<PatientProfile | null>("/users/patients/me");
    return data;
  },

  async upsertMyPatientProfile(payload: PatientProfile): Promise<PatientProfile> {
    const { data } = await http.put<PatientProfile>("/users/patients/me", payload);
    return data;
  },

  async getMyDoctorProfile(): Promise<DoctorProfile | null> {
    const { data } = await http.get<DoctorProfile | null>("/users/doctors/me");
    return data;
  },

  async upsertMyDoctorProfile(payload: DoctorProfile): Promise<DoctorProfile> {
    const { data } = await http.put<DoctorProfile>("/users/doctors/me", payload);
    return data;
  },

  async listRegisteredDoctors(): Promise<RegisteredDoctor[]> {
    const { data } = await http.get<RegisteredDoctor[]>("/users/doctors");
    return data;
  },

  async listRegisteredPatients(): Promise<RegisteredPatient[]> {
    const { data } = await http.get<RegisteredPatient[]>("/users/patients");
    return data;
  },

  async getPatientProfileForDoctor(patientUserId: string): Promise<DoctorPatientProfileView | null> {
    const { data } = await http.get<DoctorPatientProfileView | null>(`/users/patients/${patientUserId}/profile`);
    return data;
  },
};

import { http } from "./http";
import type { Appointment } from "../types/api";

export interface AppointmentCreatePayload {
  patient_id: string;
  doctor_id: string;
  reason: string;
  scheduled_for: string;
}

export interface AppointmentUpdatePayload {
  scheduled_for?: string;
  status?: "scheduled" | "rescheduled" | "canceled" | "completed";
  notes?: string;
}

export const appointmentsApi = {
  async create(payload: AppointmentCreatePayload): Promise<Appointment> {
    const { data } = await http.post<Appointment>("/appointments", payload);
    return data;
  },

  async update(id: string, payload: AppointmentUpdatePayload): Promise<Appointment> {
    const { data } = await http.patch<Appointment>(`/appointments/${id}`, payload);
    return data;
  },

  async list(params?: { start?: string; end?: string }): Promise<Appointment[]> {
    const { data } = await http.get<Appointment[]>("/appointments", { params });
    return data;
  },
};

/**
 * Admin API Helper Functions
 * Utility functions for data normalization and transformation in admin API
 */

import type { AdminDoctor, AdminPatient } from "./adminApi";

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const toStringValue = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return "";
};

export const toNumberValue = (value: unknown, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
};

export const toBooleanValue = (value: unknown, fallback = false) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1" || normalized === "yes") {
      return true;
    }
    if (normalized === "false" || normalized === "0" || normalized === "no") {
      return false;
    }
  }

  return fallback;
};

export const toTextList = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    const normalized = value
      .map((item) => (typeof item === "string" ? item.trim() : String(item).trim()))
      .filter((item) => item.length > 0);
    return normalized.length > 0 ? normalized.join(", ") : undefined;
  }
  const text = toStringValue(value);
  return text || undefined;
};

export const toObjectIdLike = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = value.trim();
  return /^[a-fA-F0-9]{24}$/.test(normalized) ? normalized : undefined;
};

export const calculateAgeFromDateOfBirth = (value: unknown) => {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const dateOfBirth = new Date(value);
  if (Number.isNaN(dateOfBirth.getTime())) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDifference = today.getMonth() - dateOfBirth.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
};

export const extractList = (payload: unknown, keys: string[]): unknown[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isRecord(payload)) {
    return [];
  }

  for (const key of keys) {
    const value = payload[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
};

export const normalizeDoctorStatus = (value: unknown): AdminDoctor["status"] => {
  const normalized = String(value ?? "").toLowerCase();
  return normalized === "active" ? "Active" : "Suspended";
};

export const normalizeDoctorVerification = (value: unknown): AdminDoctor["verification"] => {
  const normalized = String(value ?? "").toLowerCase();

  if (normalized === "approved" || normalized === "verified") {
    return "Approved";
  }

  if (normalized === "rejected") {
    return "Rejected";
  }

  return "Pending";
};

export const mapDoctor = (raw: unknown): AdminDoctor => {
  const doctor = isRecord(raw) ? raw : {};
  return {
    id: toStringValue(doctor.id, doctor.doctor_id, doctor.user_id) || "Unknown",
    name: toStringValue(doctor.name, doctor.full_name, doctor.doctor_name) || "Unnamed doctor",
    specialization: toStringValue(doctor.specialization, doctor.speciality, doctor.department) || "Not specified",
    status: normalizeDoctorStatus(doctor.status),
    verification: normalizeDoctorVerification(doctor.verification),
  };
};

export const normalizePatientStatus = (value: unknown): AdminPatient["status"] => {
  const normalized = String(value ?? "").toLowerCase();

  if (normalized === "active") {
    return "Active";
  }

  return "Inactive";
};

export const mapPatient = (raw: unknown): AdminPatient => {
  const patient = isRecord(raw) ? raw : {};
  const ageFromDateOfBirth = calculateAgeFromDateOfBirth(
    patient.date_of_birth ?? patient.dateOfBirth ?? patient.dob ?? patient.birth_date,
  );

  return {
    id:
      toStringValue(
        patient.id,
        patient.patient_id,
        patient.patientId,
        patient.patientID,
        patient.patient_no,
        patient.patientNumber,
        patient.user_id,
      ) || "Unknown",
    user_id: toObjectIdLike(patient.user_id) ?? toObjectIdLike(patient.userId),
    name:
      toStringValue(
        patient.name,
        patient.full_name,
        patient.fullName,
        patient.patient_name,
        patient.patientName,
      ) || "Unnamed patient",
    age: toNumberValue(patient.age ?? patient.patient_age ?? patient.years_of_age ?? ageFromDateOfBirth, 0),
    status: normalizePatientStatus(patient.status),
    flagged_critical: toBooleanValue(patient.flagged_critical, toBooleanValue(patient.is_critical, false)),
    family_history: toStringValue(patient.family_history, patient.familyHistory, patient.medical_history, patient.medicalHistory) || "No history recorded.",
    gender: toStringValue(patient.gender, patient.sex) || undefined,
    phone: toStringValue(patient.phone, patient.phone_number, patient.contact_number) || undefined,
    blood_group: toStringValue(patient.blood_group, patient.bloodGroup) || undefined,
    allergies: toTextList(patient.allergies),
    chronic_diseases: toTextList(patient.chronic_diseases ?? patient.chronicDiseases),
    emergency_contact: toStringValue(patient.emergency_contact, patient.emergencyContact) || undefined,
  };
};

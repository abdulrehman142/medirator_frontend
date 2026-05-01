import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { usersApi } from "../api/usersApi";
import { toPatientDisplayId } from "../utils/idDisplay";

export interface DoctorPatientRecord {
  id: string;
  displayId: string;
  name: string;
  age: string;
  gender: string;
  contact: string;
  bloodGroup: string;
  allergies: string;
  chronicDiseases: string;
  emergencyContact: string;
  medicalHistory: string;
  doctorNotes: string[];
  // PATIENT SCOPE: uploadedDocuments are STRICTLY scoped to this patient
  // Each document in this array must have a corresponding patient_id in metadata
  // and can ONLY be accessed by operations on this specific patient
  uploadedDocuments: Array<{
    id?: string;
    title: string;
    type: string;
    summary: string;
    metadata?: Record<string, string>;
    doctorNote?: string;
  }>;
}

const emptyPatient: DoctorPatientRecord = {
  id: "",
  displayId: "",
  name: "No registered patients available",
  age: "-",
  gender: "Not specified",
  contact: "Not specified",
  bloodGroup: "Not specified",
  allergies: "Not recorded",
  chronicDiseases: "Not recorded",
  emergencyContact: "Not recorded",
  medicalHistory: "Not recorded",
  doctorNotes: [],
  uploadedDocuments: [],
};

const toStringValue = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return "";
};

const toAgeString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }

    if (typeof value === "string" && value.trim().length > 0 && !Number.isNaN(Number(value))) {
      return String(Number(value));
    }
  }

  return "-";
};

const calculateAgeFromDateOfBirth = (value: unknown) => {
  if (typeof value !== "string" || !value.trim()) {
    return "-";
  }

  const dateOfBirth = new Date(value);
  if (Number.isNaN(dateOfBirth.getTime())) {
    return "-";
  }

  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDifference = today.getMonth() - dateOfBirth.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())) {
    age -= 1;
  }

  return age >= 0 ? String(age) : "-";
};

const buildPatientRecord = (
  patientId: string,
  displayId: string,
  name: string,
  age: number,
  medicalHistory: string,
  details?: {
    gender?: string;
    phone?: string;
    bloodGroup?: string;
    allergies?: string;
    chronicDiseases?: string;
    emergencyContact?: string;
  },
): DoctorPatientRecord => {
  return {
    id: patientId,
    displayId: toPatientDisplayId(displayId || patientId),
    name,
    age: String(age),
    gender: details?.gender ?? "Not specified",
    contact: details?.phone ?? "Not specified",
    bloodGroup: details?.bloodGroup ?? "Not specified",
    allergies: details?.allergies ?? "Not recorded",
    chronicDiseases: details?.chronicDiseases ?? (medicalHistory || "Not recorded"),
    emergencyContact: details?.emergencyContact ?? "Not recorded",
    medicalHistory: medicalHistory || "Not recorded",
    // PATIENT SCOPE: These arrays are initially empty for each patient
    // and are populated separately during hydration for the selected patient
    doctorNotes: [],
    uploadedDocuments: [],
  };
};

const normalizeRegisteredPatient = (patient: {
  id?: string;
  user_id?: string;
  patient_id?: string;
  display_id?: string;
  patientId?: string;
  patientID?: string;
  name?: string;
  full_name?: string;
  patient_name?: string;
  fullName?: string;
  age?: number | string;
  patient_age?: number | string;
  years_of_age?: number | string;
  date_of_birth?: string;
  dateOfBirth?: string;
  dob?: string;
  birth_date?: string;
  gender?: string;
  phone?: string;
  blood_group?: string;
  bloodGroup?: string;
  allergies?: string[];
  chronic_diseases?: string[];
  chronicDiseases?: string[];
  emergency_contact?: string;
  emergencyContact?: string;
  medical_history?: string;
  medicalHistory?: string;
}) =>
  buildPatientRecord(
    toStringValue(patient.id, patient.user_id, patient.patient_id, patient.patientId, patient.patientID),
    toStringValue(patient.display_id, patient.patient_id, patient.patientId, patient.patientID, patient.id),
    toStringValue(patient.name, patient.full_name, patient.patient_name, patient.fullName) || "Unnamed patient",
    Number(
      toAgeString(
        patient.age,
        patient.patient_age,
        patient.years_of_age,
        calculateAgeFromDateOfBirth(
          patient.date_of_birth ?? patient.dateOfBirth ?? patient.dob ?? patient.birth_date,
        ),
      ),
    ) || 0,
    patient.medical_history ?? patient.medicalHistory ?? "",
    {
      gender: patient.gender,
      phone: patient.phone,
      bloodGroup: toStringValue(patient.blood_group, patient.bloodGroup),
      allergies: (patient.allergies ?? []).join(", "),
      chronicDiseases: (patient.chronic_diseases ?? patient.chronicDiseases ?? []).join(", "),
      emergencyContact: toStringValue(patient.emergency_contact, patient.emergencyContact),
    },
  );

interface DoctorPatientContextValue {
  patients: DoctorPatientRecord[];
  setPatients: Dispatch<SetStateAction<DoctorPatientRecord[]>>;
  selectedPatientId: string;
  setSelectedPatientId: Dispatch<SetStateAction<string>>;
  selectedPatient: DoctorPatientRecord;
  selectPatientById: (patientId: string) => void;
}

const DoctorPatientContext = createContext<DoctorPatientContextValue | null>(null);

export const DoctorPatientProvider = ({ children }: { children: ReactNode }) => {
  const [patients, setPatients] = useState<DoctorPatientRecord[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState("");

  useEffect(() => {
    const loadRegisteredPatients = async () => {
      try {
        const response = await usersApi.listRegisteredPatients();
        const nextPatients = Array.isArray(response)
          ? response
              .map(normalizeRegisteredPatient)
              .filter((patient) => patient.id.trim().length > 0)
          : [];
        setPatients(nextPatients);
        setSelectedPatientId((current) => (nextPatients.some((patient) => patient.id === current) ? current : nextPatients[0]?.id ?? ""));
      } catch {
        setPatients([]);
        setSelectedPatientId("");
      }
    };

    void loadRegisteredPatients();
  }, []);

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === selectedPatientId) ?? patients[0] ?? emptyPatient,
    [patients, selectedPatientId],
  );

  const selectPatientById = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  return (
    <DoctorPatientContext.Provider
      value={{
        patients,
        setPatients,
        selectedPatientId,
        setSelectedPatientId,
        selectedPatient,
        selectPatientById,
      }}
    >
      {children}
    </DoctorPatientContext.Provider>
  );
};

export const useDoctorPatient = () => {
  const context = useContext(DoctorPatientContext);

  if (!context) {
    throw new Error("useDoctorPatient must be used within a DoctorPatientProvider");
  }

  return context;
};

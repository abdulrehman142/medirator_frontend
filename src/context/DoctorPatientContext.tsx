import type { Dispatch, ReactNode, SetStateAction } from "react";
import { createContext, useContext, useMemo, useState } from "react";

export interface DoctorPatientRecord {
  id: string;
  name: string;
  age: string;
  gender: string;
  contact: string;
  bloodGroup: string;
  allergies: string;
  chronicDiseases: string;
  emergencyContact: string;
  doctorNotes: string[];
  uploadedDocuments: Array<{
    title: string;
    type: string;
    summary: string;
  }>;
}

const initialPatients: DoctorPatientRecord[] = [
  {
    id: "PT-240318-07",
    name: "Ayesha Khan",
    age: "32",
    gender: "Female",
    contact: "+92 300 1234567",
    bloodGroup: "B+",
    allergies: "Penicillin, Dust",
    chronicDiseases: "Hypertension",
    emergencyContact: "Imran Khan (+92 301 9876543)",
    doctorNotes: [
      "BP remains stable this week; continue current antihypertensive plan.",
      "Recommend low-sodium diet and 30 minutes daily walk.",
      "Follow-up suggested in 14 days with home BP log.",
    ],
    uploadedDocuments: [
      {
        title: "CBC Report",
        type: "Report",
        summary: "Complete blood count review from 12 Mar 2026 with no urgent abnormalities.",
      },
      {
        title: "Chest Scan",
        type: "Scan",
        summary: "Chest scan from 03 Feb 2026 showing no acute chest findings.",
      },
      {
        title: "ECG Summary",
        type: "Report",
        summary: "ECG summary from 27 Jan 2026 with normal rhythm interpretation.",
      },
    ],
  },
  {
    id: "PT-240402-11",
    name: "Hassan Ali",
    age: "45",
    gender: "Male",
    contact: "+92 302 2223344",
    bloodGroup: "A-",
    allergies: "None known",
    chronicDiseases: "Type 2 Diabetes",
    emergencyContact: "Amina Ali (+92 312 6655443)",
    doctorNotes: [
      "Fasting sugar elevated; monitor post-prandial readings for 1 week.",
      "Medication adherence improved since last visit.",
    ],
    uploadedDocuments: [
      {
        title: "HbA1c Report",
        type: "Report",
        summary: "HbA1c report from 04 Apr 2026 showing elevated sugar control markers.",
      },
      {
        title: "Kidney Function Test",
        type: "Report",
        summary: "Kidney function test from 02 Apr 2026 for diabetes monitoring.",
      },
    ],
  },
  {
    id: "PT-240215-03",
    name: "Sara Iqbal",
    age: "28",
    gender: "Female",
    contact: "+92 333 9988776",
    bloodGroup: "O+",
    allergies: "Peanuts",
    chronicDiseases: "Asthma",
    emergencyContact: "Bilal Iqbal (+92 321 7722110)",
    doctorNotes: [
      "Inhaler usage technique reviewed and corrected.",
      "Avoid known triggers and keep rescue inhaler available.",
    ],
    uploadedDocuments: [
      {
        title: "Pulmonary Function Test",
        type: "Report",
        summary: "Pulmonary function test from 15 Feb 2026 supporting asthma follow-up.",
      },
      {
        title: "Allergy Panel",
        type: "Report",
        summary: "Allergy panel from 11 Feb 2026 confirming peanut sensitivity.",
      },
    ],
  },
];

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
  const [patients, setPatients] = useState<DoctorPatientRecord[]>(initialPatients);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatients[0].id);

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === selectedPatientId) ?? patients[0],
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

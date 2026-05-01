import patientImg from "/medirator_images/patient.png";
import testResultsImg from "/medirator_images/testresults.png";
import editIcon from "/medirator_images/edit.png";
import deleteIcon from "/medirator_images/delete.png";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import DoctorPatientDropdown from "../../../components/DoctorPatientDropdown";
import { useDoctorPatient } from "../../../context/DoctorPatientContext";
import { clinicalApi } from "../../../api/clinicalApi";
import { reportsApi } from "../../../api/reportsApi";
import { usersApi } from "../../../api/usersApi";
import { useLanguage } from "../../../context/LanguageContext";

interface PatientProfilePageProps {
  darkMode?: boolean;
}

const PatientProfilePage = ({ darkMode = false }: PatientProfilePageProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { patients, setPatients, selectedPatient, selectedPatientId, selectPatientById } = useDoctorPatient();
  const [selectedDocumentTitle, setSelectedDocumentTitle] = useState<string>("");
  const [downloadingDocumentId, setDownloadingDocumentId] = useState<string | null>(null);
  const [reportNoteDraft, setReportNoteDraft] = useState("");
  const [savingReportNoteId, setSavingReportNoteId] = useState<string | null>(null);
  const [deletingReportNoteId, setDeletingReportNoteId] = useState<string | null>(null);
  const [noteActionError, setNoteActionError] = useState<string | null>(null);
  const [isEditingReportNote, setIsEditingReportNote] = useState(false);
  const [hydratedProfile, setHydratedProfile] = useState<{
    name: string;
    age: string;
    gender: string;
    contact: string;
    patientId: string;
    bloodGroup: string;
    allergies: string;
    chronicDiseases: string;
    emergencyContact: string;
    medicalHistory: string;
  } | null>(null);
  const [hasSavedFamilyTree, setHasSavedFamilyTree] = useState(false);

  const selectedDocument = useMemo(
    () => selectedPatient.uploadedDocuments.find((document) => document.title === selectedDocumentTitle),
    [selectedDocumentTitle, selectedPatient.uploadedDocuments],
  );

  const medicalInfo = useMemo(
    () => [
      { label: "Blood Group", value: hydratedProfile?.bloodGroup ?? selectedPatient.bloodGroup },
      { label: "Allergies", value: hydratedProfile?.allergies ?? selectedPatient.allergies },
      { label: "Chronic Diseases", value: hydratedProfile?.chronicDiseases ?? selectedPatient.chronicDiseases },
      { label: "Emergency Contact", value: hydratedProfile?.emergencyContact ?? selectedPatient.emergencyContact },
      { label: "Family History", value: hydratedProfile?.medicalHistory ?? selectedPatient.medicalHistory },
    ],
    [hydratedProfile, selectedPatient],
  );

  const basicInfo = useMemo(
    () => [
      { label: "Name", value: hydratedProfile?.name ?? selectedPatient.name },
      { label: "Age", value: hydratedProfile?.age ?? selectedPatient.age },
      { label: "Gender", value: hydratedProfile?.gender ?? selectedPatient.gender },
      { label: "Contact", value: hydratedProfile?.contact ?? selectedPatient.contact },
      { label: "Patient ID", value: hydratedProfile?.patientId ?? selectedPatient.displayId ?? selectedPatient.id },
    ],
    [hydratedProfile, selectedPatient],
  );

  const sectionCardClassName =
    "h-full rounded-3xl border-2 border-[#0B3C5D]/80 bg-white/95 dark:bg-[#070d14] shadow-lg shadow-[#0B3C5D]/10 p-4 md:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0B3C5D]/15";

  const infoItemClassName =
    "rounded-2xl border border-[#0B3C5D]/60 bg-white dark:bg-black/40 p-2.5 text-sm text-black dark:text-white";

  // PATIENT SCOPE VALIDATION: Helper function to verify document belongs to current patient
  const isDocumentForCurrentPatient = (documentId: string): boolean => {
    return selectedPatient.uploadedDocuments.some((doc) => doc.id === documentId);
  };

  // PATIENT SCOPE VALIDATION: Only allow opening documents that belong to current patient
  const handleOpenDocument = (documentTitle: string) => {
    const document = selectedPatient.uploadedDocuments.find((doc) => doc.title === documentTitle);
    if (!document) {
      setNoteActionError("Document not found for this patient.");
      return;
    }
    setSelectedDocumentTitle(documentTitle);
    setNoteActionError(null);
  };

  const handleSaveReportNote = async () => {
    const reportId = selectedDocument?.id;
    if (!reportId) {
      return;
    }
    
    // PATIENT SCOPE VALIDATION: Ensure document belongs to selected patient
    if (!selectedDocument || !selectedPatient.id || !isDocumentForCurrentPatient(reportId)) {
      setNoteActionError("Invalid patient or document selection. Access denied.");
      return;
    }

    setSavingReportNoteId(reportId);
    setNoteActionError(null);
    try {
      const updatedReport = await reportsApi.updateMetadata(reportId, {
        ...(selectedDocument.metadata ?? {}),
        doctor_note: reportNoteDraft.trim(),
        // Store patient_id in metadata to ensure cross-reference and prevent data leakage
        patient_id: selectedPatient.id,
      });
      
      // PATIENT SCOPE VALIDATION: Only update documents for the current patient
      setPatients((currentPatients) =>
        currentPatients.map((patient) => {
          if (patient.id !== selectedPatient.id) {
            return patient;
          }
          return {
            ...patient,
            uploadedDocuments: patient.uploadedDocuments.map((doc) =>
              doc.id !== reportId
                ? doc
                : {
                    ...doc,
                    metadata: updatedReport.metadata,
                    doctorNote: updatedReport.metadata?.doctor_note ?? "",
                  },
            ),
          };
        }),
      );
      setReportNoteDraft("");
      setIsEditingReportNote(false);
    } catch {
      setNoteActionError("No available data.");
    } finally {
      setSavingReportNoteId(null);
    }
  };

  const handleEditReportNote = () => {
    setReportNoteDraft(selectedDocument?.doctorNote ?? "");
    setNoteActionError(null);
    setIsEditingReportNote(true);
  };

  const handleDeleteReportNote = async () => {
    const reportId = selectedDocument?.id;
    if (!reportId) {
      return;
    }
    
    // PATIENT SCOPE VALIDATION: Ensure document belongs to current patient
    if (!isDocumentForCurrentPatient(reportId) || !selectedPatient.id) {
      setNoteActionError("Document does not belong to this patient. Access denied.");
      return;
    }

    setDeletingReportNoteId(reportId);
    setNoteActionError(null);
    try {
      const nextMetadata = { ...(selectedDocument.metadata ?? {}) };
      delete nextMetadata.doctor_note;
      // Ensure patient_id is preserved in metadata
      nextMetadata.patient_id = selectedPatient.id;
      
      const updatedReport = await reportsApi.updateMetadata(reportId, nextMetadata);
      
      // PATIENT SCOPE VALIDATION: Only update documents for the current patient
      setPatients((currentPatients) =>
        currentPatients.map((patient) => {
          if (patient.id !== selectedPatient.id) {
            return patient;
          }
          return {
            ...patient,
            uploadedDocuments: patient.uploadedDocuments.map((doc) =>
              doc.id !== reportId
                ? doc
                : {
                    ...doc,
                    metadata: updatedReport.metadata,
                    doctorNote: "",
                  },
            ),
          };
        }),
      );
      setReportNoteDraft("");
      setIsEditingReportNote(false);
    } catch {
      setNoteActionError("No available data.");
    } finally {
      setDeletingReportNoteId(null);
    }
  };

  const handleDownloadDocument = async (documentId: string) => {
    if (!documentId) {
      return;
    }
    
    // PATIENT SCOPE VALIDATION: Ensure document belongs to current patient before download
    if (!isDocumentForCurrentPatient(documentId)) {
      setNoteActionError("Cannot download: Document does not belong to this patient.");
      return;
    }

    setDownloadingDocumentId(documentId);
    try {
      const { blob, fileName } = await reportsApi.downloadFile(documentId);
      const objectUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(objectUrl);
    } catch {
      setNoteActionError("Failed to download document.");
    } finally {
      setDownloadingDocumentId(null);
    }
  };

  useEffect(() => {
    const requestedPatient = searchParams.get("patient");

    if (!requestedPatient) {
      return;
    }

    const matchedPatient =
      patients.find((patient) => patient.id === requestedPatient) ||
      patients.find((patient) => patient.name === requestedPatient);

    if (matchedPatient && matchedPatient.id !== selectedPatientId) {
      selectPatientById(matchedPatient.id);
    }
  }, [patients, searchParams, selectPatientById, selectedPatientId]);

  useEffect(() => {
    setSelectedDocumentTitle("");
    setHasSavedFamilyTree(false);
    setNoteActionError(null);
    setIsEditingReportNote(false);
  }, [selectedPatient.id]);

  useEffect(() => {
    setReportNoteDraft(selectedDocument?.doctorNote ?? "");
    setIsEditingReportNote(false);
  }, [selectedDocument?.doctorNote, selectedDocument?.id]);

  useEffect(() => {
    const hydratePatientArtifacts = async () => {
      if (!selectedPatient.id) {
        return;
      }
      try {
        const [profileResult, recordsResult, reportsResult] = await Promise.allSettled([
          usersApi.getPatientProfileForDoctor(selectedPatient.id),
          clinicalApi.records(selectedPatient.id),
          reportsApi.list({ patient_id: selectedPatient.id }),
        ]);

        const profile = profileResult.status === "fulfilled" ? profileResult.value : null;
        const backendTreeCount = profile?.family_tree?.length ?? 0;
        let localTreeCount = 0;
        try {
          const rawLocalTree = localStorage.getItem(`medirator_family_history_${selectedPatient.id}`);
          if (rawLocalTree) {
            const parsedLocalTree = JSON.parse(rawLocalTree) as unknown[];
            localTreeCount = Array.isArray(parsedLocalTree) ? parsedLocalTree.length : 0;
          }
        } catch {
          localTreeCount = 0;
        }
        setHasSavedFamilyTree(backendTreeCount > 0 || localTreeCount > 0);
        const recordsSnapshot = recordsResult.status === "fulfilled" ? recordsResult.value : {};
        const reports = reportsResult.status === "fulfilled" ? reportsResult.value : [];

        const medicalHistorySnapshot =
          (((recordsSnapshot.family_history as Record<string, unknown> | undefined) ??
            (recordsSnapshot.medical_history as Record<string, unknown> | undefined))?.diagnosis as string | undefined) ??
          "";
        const chronicFromSnapshot =
          ((((recordsSnapshot.family_history as Record<string, unknown> | undefined) ??
            (recordsSnapshot.medical_history as Record<string, unknown> | undefined))?.chronic_conditions as string[] | undefined) ?? []).join(", ");
        const allergiesFromSnapshot =
          ((((recordsSnapshot.family_history as Record<string, unknown> | undefined) ??
            (recordsSnapshot.medical_history as Record<string, unknown> | undefined))?.allergies as string[] | undefined) ?? []).join(", ");
        
        // PATIENT SCOPE VALIDATION: Filter reports to ensure they belong to current patient only
        const validReports = reports.filter((report) => {
          // Accept reports that belong to the current patient
          // Check both report.patient_id and metadata.patient_id for consistency
          const reportPatientId = (report.patient_id as string) || (report.metadata?.patient_id as string);
          return reportPatientId === selectedPatient.id;
        });
        
        const nextDocuments = validReports.map((report) => ({
          id: report.id,
          title: report.file_name || report.report_type,
          type: report.report_type,
          summary: `${report.file_name || report.report_type}`,
          metadata: { ...report.metadata, patient_id: selectedPatient.id },
          doctorNote: report.metadata?.doctor_note ?? "",
        }));
        setPatients((currentPatients) =>
          currentPatients.map((patient) =>
            patient.id !== selectedPatient.id
              ? patient
              : {
                  ...patient,
                  name: profile?.name ?? patient.name,
                  age: profile?.age ? String(profile.age) : patient.age,
                  gender: profile?.gender ?? patient.gender,
                  contact: profile?.contact ?? patient.contact,
                  bloodGroup: profile?.blood_group ?? patient.bloodGroup,
                  allergies: profile?.allergies ?? (allergiesFromSnapshot || patient.allergies),
                  chronicDiseases: profile?.chronic_diseases ?? (chronicFromSnapshot || patient.chronicDiseases),
                  emergencyContact: profile?.emergency_contact ?? patient.emergencyContact,
                  medicalHistory: profile?.family_history ?? profile?.medical_history ?? (medicalHistorySnapshot || patient.medicalHistory),
                  doctorNotes: patient.doctorNotes,
                  uploadedDocuments: nextDocuments,
                },
          ),
        );
        setHydratedProfile({
          name: profile?.name ?? selectedPatient.name,
          age: profile?.age ? String(profile.age) : selectedPatient.age,
          gender: profile?.gender ?? selectedPatient.gender,
          contact: profile?.contact ?? selectedPatient.contact,
          patientId: profile?.id ?? selectedPatient.displayId ?? selectedPatient.id,
          bloodGroup: profile?.blood_group ?? selectedPatient.bloodGroup,
          allergies: profile?.allergies ?? (allergiesFromSnapshot || selectedPatient.allergies),
          chronicDiseases: profile?.chronic_diseases ?? (chronicFromSnapshot || selectedPatient.chronicDiseases),
          emergencyContact: profile?.emergency_contact ?? selectedPatient.emergencyContact,
          medicalHistory: profile?.family_history ?? profile?.medical_history ?? (medicalHistorySnapshot || selectedPatient.medicalHistory),
        });
      } catch {
        // keep existing context values if hydration fails
        setHydratedProfile(null);
      }
    };
    void hydratePatientArtifacts();
  }, [selectedPatient.id, setPatients]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">
            Patient Profile
          </h2>
          <div className="ml-0 md:ml-5 md:pl-5 mt-3">
            <DoctorPatientDropdown darkMode={darkMode} />
          </div>
        </div>
        <img src={patientImg} alt="Banner" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="flex flex-col dark:text-white justify-between items-start bg-gradient-to-b from-slate-50 to-white dark:from-[#060b12] dark:to-black font-sans gap-5 md:gap-4 px-2 md:px-3 pb-6">
        <div className="w-full max-w-6xl mx-auto px-3 md:px-8 py-6 md:py-8 relative z-10">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              <section className={sectionCardClassName}>
                <h2 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Basic Info</h2>
                <ul className="mt-3 space-y-2">
                  {basicInfo.map((item) => (
                    <li key={item.label} className={infoItemClassName}>
                      <span className="font-semibold">{item.label}:</span> {item.value}
                    </li>
                  ))}
                </ul>
              </section>

              <section className={sectionCardClassName}>
                <h2 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Medical Info</h2>
                <ul className="mt-3 space-y-2">
                  {medicalInfo.map((item) => {
                    const isMedicalHistory = item.label === "Family History";
                    const medicalHistoryValue = String(item.value ?? "").trim();
                    const isNotRecordedValue = [
                      "not recorded",
                      "none",
                      "not available",
                      "no available data.",
                    ].includes(medicalHistoryValue.toLowerCase());
                    const shouldShowFamilyTreeButton = isMedicalHistory && (!medicalHistoryValue || isNotRecordedValue);
                    return (
                      <li key={item.label} className={infoItemClassName}>
                        <span className="font-semibold">{item.label}:</span>{" "}
                        {shouldShowFamilyTreeButton ? (
                          hasSavedFamilyTree ? (
                            <button
                              type="button"
                              onClick={() => navigate(`/doctor/pages/family-tree?patient=${selectedPatient.id}`)}
                              className="inline-flex items-center gap-2 rounded-2xl border border-[#0B3C5D] bg-white px-3 py-1.5 text-xs font-medium text-black transition-all duration-300 hover:bg-[#0B3C5D] hover:text-white dark:bg-black dark:text-white dark:hover:bg-gray-800"
                            >
                              View Family Tree
                            </button>
                          ) : (
                            "No tree exists"
                          )
                        ) : (
                          item.value
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              <section className={sectionCardClassName}>
                <h2 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Doctor Notes</h2>
                <div className="mt-3 rounded-2xl border border-[#0B3C5D]/70 p-3 bg-white dark:bg-black/50">
                  <select
                    value={selectedDocumentTitle}
                    onChange={(event) => setSelectedDocumentTitle(event.target.value)}
                    className="w-full rounded-2xl border border-[#0B3C5D]/70 bg-white dark:bg-black px-3 py-2 text-sm text-black dark:text-white focus:outline-none"
                  >
                    <option value="">Select uploaded document</option>
                    {selectedPatient.uploadedDocuments.map((doc) => (
                      <option key={doc.title} value={doc.title}>
                        {doc.title}
                      </option>
                    ))}
                  </select>
                  {(selectedDocument?.doctorNote && !isEditingReportNote) ? null : (
                    <>
                      <textarea
                        value={reportNoteDraft}
                        onChange={(event) => setReportNoteDraft(event.target.value)}
                        className="mt-3 w-full min-h-[84px] rounded-2xl border border-[#0B3C5D]/70 bg-white dark:bg-black p-3 text-sm text-black dark:text-white focus:outline-none"
                        placeholder="Write note for selected document"
                        disabled={!selectedDocument?.id}
                      />
                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => void handleSaveReportNote()}
                          disabled={!selectedDocument?.id || savingReportNoteId === selectedDocument.id}
                          className="rounded-2xl border border-[#0B3C5D] bg-[#0B3C5D] px-4 py-2 text-xs font-medium text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                        >
                          {selectedDocument?.id && savingReportNoteId === selectedDocument.id ? "Sending..." : "Send"}
                        </button>
                      </div>
                    </>
                  )}
                  {selectedDocument?.doctorNote ? (
                    <div className="mt-3 rounded-2xl border border-[#0B3C5D]/50 bg-white dark:bg-black p-3">
                      <p className="text-sm text-black dark:text-white">{selectedDocument.doctorNote}</p>
                      <div className="mt-3 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleEditReportNote}
                          className="inline-flex items-center gap-1 rounded-2xl border border-[#0B3C5D] px-3 py-1 text-xs font-medium transition-all duration-300 bg-white dark:bg-black text-black dark:text-white hover:bg-[#0B3C5D] hover:text-white"
                        >
                          <img src={editIcon} alt="Edit" className="h-3.5 w-3.5 object-contain" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteReportNote()}
                          disabled={deletingReportNoteId === selectedDocument.id}
                          className="inline-flex items-center gap-1 rounded-2xl border border-red-600 px-3 py-1 text-xs font-medium transition-all duration-300 bg-white dark:bg-black text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-700 disabled:opacity-50"
                        >
                          <img src={deleteIcon} alt="Delete" className="h-3.5 w-3.5 object-contain" />
                          {deletingReportNoteId === selectedDocument.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {noteActionError ? (
                    <p className="mt-2 text-xs text-amber-700 dark:text-amber-300">{noteActionError}</p>
                  ) : null}
                </div>
              </section>

              <section className={sectionCardClassName}>
                <h2 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">{t("auth", "uploadedDocuments", "Uploaded Documents")}</h2>
                <ul className="mt-3 space-y-2">
                  {selectedPatient.uploadedDocuments.map((doc) => {
                    const isSelected = doc.title === selectedDocument?.title;

                    return (
                      <li
                        key={doc.title}
                        className={`w-full rounded-2xl border p-2.5 text-left text-sm transition-all duration-200 ${
                          isSelected
                            ? "border-[#0B3C5D] bg-[#0B3C5D] text-white shadow-md"
                            : "border-[#0B3C5D]/70 bg-white dark:bg-black/40 text-black dark:text-white hover:bg-[#0B3C5D]/5 dark:hover:bg-[#0B3C5D]/20"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => handleOpenDocument(doc.title)}
                            className="inline-flex items-center gap-2 text-left"
                          >
                            <img src={testResultsImg} alt="Document" className="h-5 w-5 object-contain" />
                            <span className="font-semibold">{doc.title}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDownloadDocument(doc.id ?? "")}
                            disabled={downloadingDocumentId === doc.id}
                            className="rounded-2xl border border-[#0B3C5D] bg-white px-3 py-1 text-xs font-medium text-black transition-all duration-300 hover:bg-[#0B3C5D] hover:text-white disabled:opacity-50 dark:bg-black dark:text-white dark:hover:bg-gray-800"
                          >
                            {downloadingDocumentId === doc.id ? t("auth", "downloading", "Downloading...") : t("auth", "download", "Download")}
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PatientProfilePage;

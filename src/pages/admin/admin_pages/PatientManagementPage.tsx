import { useEffect, useMemo, useState } from "react";
import patientImg from "/medirator_images/patient.png";
import { adminApi } from "../../../api/adminApi";
import { reportsApi } from "../../../api/reportsApi";
import { usersApi } from "../../../api/usersApi";
import { useLanguage } from "../../../context/LanguageContext";
import type { TestReport } from "../../../types/api";

interface PatientManagementPageProps {
  darkMode?: boolean;
}

interface PatientRecord {
  id: string;
  user_id?: string;
  name: string;
  age: number;
  status: "Active" | "Inactive";
  gender?: string;
  phone?: string;
  blood_group?: string;
  allergies?: string;
  chronic_diseases?: string;
  emergency_contact?: string;
  family_history?: string;
}

interface PatientArtifacts {
  reports: TestReport[];
}

const normalizePatient = (patient: {
  id?: string;
  user_id?: string;
  name?: string;
  age?: number;
  status?: "Active" | "Inactive";
  gender?: string;
  phone?: string;
  blood_group?: string;
  allergies?: string;
  chronic_diseases?: string;
  emergency_contact?: string;
  family_history?: string;
}): PatientRecord => ({
  id: patient.id ?? "Unknown",
  user_id: patient.user_id,
  name: patient.name ?? "Unnamed patient",
  age: patient.age ?? 0,
  status: patient.status ?? "Inactive",
  gender: patient.gender,
  phone: patient.phone,
  blood_group: patient.blood_group,
  allergies: patient.allergies,
  chronic_diseases: patient.chronic_diseases,
  emergency_contact: patient.emergency_contact,
  family_history: patient.family_history,
});

const toLowerText = (value: string | undefined | null) => (value ?? "").toLowerCase();

const asText = (value: unknown, fallback = "N/A") => {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : fallback;
  }
  if (Array.isArray(value)) {
    const normalized = value
      .map((item) => (typeof item === "string" ? item.trim() : String(item).trim()))
      .filter((item) => item.length > 0);
    return normalized.length > 0 ? normalized.join(", ") : fallback;
  }
  return fallback;
};

const isObjectIdLike = (value: string | undefined) => Boolean(value && /^[a-fA-F0-9]{24}$/.test(value.trim()));

const PatientManagementPage = ({ darkMode = false }: PatientManagementPageProps) => {
  const { t } = useLanguage();
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [selectedViewMode, setSelectedViewMode] = useState<"profile" | null>(null);
  const [pendingDeletePatientId, setPendingDeletePatientId] = useState<string | null>(null);
  const [patientArtifacts, setPatientArtifacts] = useState<PatientArtifacts | null>(null);
  const [loadingArtifacts, setLoadingArtifacts] = useState(false);
  const [downloadingDocumentId, setDownloadingDocumentId] = useState<string | null>(null);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        const response = await adminApi.listPatients();
        const nextPatients = Array.isArray(response) ? response.map(normalizePatient) : [];
        setPatients(nextPatients);
        setApiError(null);
      } catch {
        setApiError("No available data.");
      }
    };

    void loadPatients();
  }, []);

  useEffect(() => {
    const selectedPatientId = selectedPatient?.id;
    const selectedPatientUserId = selectedPatient?.user_id;
    if (!selectedPatient || !selectedPatientId || selectedViewMode !== "profile") {
      setPatientArtifacts(null);
      return;
    }

    const loadArtifacts = async () => {
      setLoadingArtifacts(true);
      const candidateIds = [selectedPatientUserId, selectedPatientId].filter(
        (value): value is string => Boolean(value && isObjectIdLike(value)),
      );

      let resolvedPatientUserId: string | null = null;

      for (const candidateId of candidateIds) {
        try {
          const profile = await usersApi.getPatientProfileForDoctor(candidateId);
          if (profile) {
            resolvedPatientUserId = candidateId;
            break;
          }
        } catch {
          // try next candidate id
        }
      }

      if (!resolvedPatientUserId) {
        resolvedPatientUserId = selectedPatientUserId ?? null;
      }

      let nextReports: TestReport[] = [];
      if (resolvedPatientUserId) {
        const reportsResult = await Promise.allSettled([reportsApi.list({ patient_id: resolvedPatientUserId })]);
        nextReports = reportsResult[0].status === "fulfilled" ? reportsResult[0].value : [];
      } else {
        // Fallback for legacy rows missing raw user_id in admin list response.
        const reportsResult = await Promise.allSettled([reportsApi.list()]);
        const allReports = reportsResult[0].status === "fulfilled" ? reportsResult[0].value : [];
        const reportPatientIds = new Set(candidateIds);
        nextReports = allReports.filter((report) => reportPatientIds.has(report.patient_id));
      }

      setPatientArtifacts({
        reports: nextReports,
      });
      setLoadingArtifacts(false);
    };

    void loadArtifacts();
  }, [selectedPatient?.id, selectedPatient?.user_id, selectedViewMode]);

  const handleDownloadDocument = async (documentId: string) => {
    if (!documentId) {
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
    } finally {
      setDownloadingDocumentId(null);
    }
  };

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        toLowerText(patient.name).includes(searchQuery.toLowerCase()) ||
        toLowerText(patient.id).includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || patient.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [patients, searchQuery, statusFilter]);

  const viewPatientProfile = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setSelectedViewMode("profile");
  };

  const deletePatient = (patientId: string) => {
    setPatients((current) => current.filter((patient) => patient.id !== patientId));

    void adminApi
      .deletePatient(patientId)
      .then(() => setApiError(null))
      .catch(() => setApiError("Patient delete not confirmed by server."));

    if (selectedPatient?.id === patientId) {
      setSelectedPatient(null);
    }
  };

  const confirmDeletePatient = () => {
    if (!pendingDeletePatientId) {
      return;
    }

    deletePatient(pendingDeletePatientId);
    setPendingDeletePatientId(null);
  };

  const statusBadgeClassName = (status: PatientRecord["status"]) => {
    if (status === "Active") {
      return "border-green-600 text-green-700 dark:text-green-400";
    }

    return "border-yellow-600 text-yellow-700 dark:text-yellow-400";
  };

  const statusFilterOptions: Array<"All" | "Active" | "Inactive"> = [
    "All",
    "Active",
    "Inactive",
  ];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">Patient Management</h2>
        </div>
        <img src={patientImg} alt="Patient Management" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="dark:bg-black px-3 md:px-6 py-6 space-y-4 font-sans">
        {apiError && (
          <div className="rounded-2xl border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
            {apiError}
          </div>
        )}

        <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row gap-2 w-full md:max-w-2xl">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name or ID"
                className="flex-1 rounded-2xl border border-[#0B3C5D] px-4 py-2 bg-white dark:bg-black text-black dark:text-white"
              />
              <div className="relative inline-flex self-start">
                <div
                  className={`flex flex-col shadow-lg rounded-md p-1 border-2 ${
                    darkMode ? "bg-black border-[#0B3C5D]" : "bg-[#0B3C5D] border-[#0B3C5D]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setIsStatusFilterOpen((current) => !current)}
                    className={`border-[#0B3C5D] m-1 rounded-md transition-all duration-200 cursor-pointer flex items-center justify-between gap-2 px-3 py-2 w-40 text-sm ${
                      darkMode
                        ? "bg-[#0B3C5D] hover:bg-gray-800 text-white hover:text-white"
                        : "bg-white hover:bg-gray-800 text-black hover:text-white"
                    }`}
                  >
                    <span>{statusFilter === "All" ? "All Status" : statusFilter}</span>
                    <span className="text-xs">{isStatusFilterOpen ? "▲" : "▼"}</span>
                  </button>
                </div>

                {isStatusFilterOpen && (
                  <div
                    className={`absolute top-full left-0 mt-1 z-30 flex flex-col shadow-lg rounded-md p-1 border-2 ${
                      darkMode ? "bg-black border-[#0B3C5D]" : "bg-[#0B3C5D] border-[#0B3C5D]"
                    }`}
                  >
                    {statusFilterOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setStatusFilter(option);
                          setIsStatusFilterOpen(false);
                        }}
                        className={`border-[#0B3C5D] m-1 rounded-md transition-all duration-200 cursor-pointer px-3 py-2 w-40 text-left text-sm ${
                          darkMode
                            ? "bg-[#0B3C5D] hover:bg-gray-800 text-white hover:text-white"
                            : "bg-white hover:bg-gray-800 text-black hover:text-white"
                        } ${statusFilter === option ? "ring-2 ring-white/40" : ""}`}
                      >
                        {option === "All" ? "All Status" : option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-[#0B3C5D]">
            <table className="w-full min-w-[760px] text-sm text-black dark:text-white">
              <thead className="bg-[#0B3C5D] text-white">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Age</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-t border-[#0B3C5D]/40 bg-white dark:bg-black">
                    <td className="px-4 py-3">{patient.name}</td>
                    <td className="px-4 py-3">{patient.id}</td>
                    <td className="px-4 py-3">{patient.age}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-3 py-1 text-xs ${statusBadgeClassName(patient.status)}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => viewPatientProfile(patient)}
                          className="rounded-2xl border border-[#0B3C5D] px-3 py-1.5"
                        >
                          View Profile
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDeletePatientId(patient.id)}
                          className="rounded-2xl border border-red-600 text-red-600 px-3 py-1.5"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {selectedPatient && (
          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6 text-black dark:text-white">
            {selectedPatient && selectedViewMode === "profile" ? (
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Patient Profile</h3>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="rounded-2xl border border-[#0B3C5D] p-3">Name: {selectedPatient.name}</div>
                  <div className="rounded-2xl border border-[#0B3C5D] p-3">ID: {selectedPatient.id}</div>
                  <div className="rounded-2xl border border-[#0B3C5D] p-3">Age: {selectedPatient.age}</div>
                  <div className="rounded-2xl border border-[#0B3C5D] p-3">Status: {selectedPatient.status}</div>
                  <div className="rounded-2xl border border-[#0B3C5D] p-3">Gender: {selectedPatient.gender || "N/A"}</div>
                  <div className="rounded-2xl border border-[#0B3C5D] p-3">Phone: {selectedPatient.phone || "N/A"}</div>
                  <div className="rounded-2xl border border-[#0B3C5D] p-3">Blood Group: {selectedPatient.blood_group || "N/A"}</div>
                  <div className="rounded-2xl border border-[#0B3C5D] p-3">Allergies: {selectedPatient.allergies || "N/A"}</div>
                  <div className="rounded-2xl border border-[#0B3C5D] p-3">Chronic Diseases: {selectedPatient.chronic_diseases || "N/A"}</div>
                  <div className="rounded-2xl border border-[#0B3C5D] p-3">Emergency Contact: {selectedPatient.emergency_contact || "N/A"}</div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
                  <section className="rounded-2xl border border-[#0B3C5D] p-3">
                    <h4 className="font-semibold text-[#0B3C5D] dark:text-white">{t("auth", "uploadedDocuments", "Uploaded Documents")}</h4>
                    {loadingArtifacts ? (
                      <p className="mt-2 text-xs">{t("auth", "loading", "Loading...")}</p>
                    ) : patientArtifacts?.reports.length ? (
                      <ul className="mt-2 space-y-2">
                        {patientArtifacts.reports.map((report) => (
                          <li key={report.id} className="rounded-xl border border-[#0B3C5D]/40 p-2">
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-medium">{asText(report.file_name, "Unnamed document")}</p>
                              <button
                                type="button"
                                onClick={() => void handleDownloadDocument(report.id)}
                                disabled={downloadingDocumentId === report.id}
                                className="rounded-2xl border border-[#0B3C5D] bg-white px-3 py-1 text-xs font-medium text-black transition-all duration-300 hover:bg-[#0B3C5D] hover:text-white disabled:opacity-50 dark:bg-black dark:text-white dark:hover:bg-gray-800"
                              >
                                {downloadingDocumentId === report.id ? t("auth", "downloading", "Downloading...") : t("auth", "download", "Download")}
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs">No available data</p>
                    )}
                  </section>
                </div>
              </div>
            ) : null}
          </section>
        )}

        {pendingDeletePatientId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-5 shadow-2xl text-black dark:text-white">
              <h3 className="text-xl font-bold text-[#0B3C5D] dark:text-white">Delete patient record?</h3>
              <p className="mt-3 text-sm">
                This will permanently remove the patient from management records. Do you want to continue?
              </p>
              <div className="mt-5 flex flex-wrap gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setPendingDeletePatientId(null)}
                  className="rounded-2xl border border-[#0B3C5D] px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeletePatient}
                  className="rounded-2xl border border-red-600 bg-red-600 text-white px-4 py-2 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientManagementPage;

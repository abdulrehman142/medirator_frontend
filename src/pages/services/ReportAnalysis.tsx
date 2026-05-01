import { useEffect, useState } from "react";
import testResultsImg from "/medirator_images/testresults.png";
import deleteIcon from "/medirator_images/delete.png";
import uploadIcon from "/medirator_images/upload.svg";
import { reportsApi } from "../../api/reportsApi";
import type { TestReport } from "../../types/api";
import { useAuth } from "../../context/AuthContext";
import { usersApi } from "../../api/usersApi";
import { useLanguage } from "../../context/LanguageContext";

interface ReportAnalysisProps {
  darkMode?: boolean;
}

interface UiReport {
  id: string;
  fileName: string;
  date: string;
  doctorNote: string;
}

const normalizeDoctorOption = (doctor: {
  id?: string;
  display_id?: string;
  name?: string;
  specialization?: string;
}) => ({
  id: doctor.id ?? "",
  displayId: doctor.display_id ?? "",
  name: doctor.name ?? "Unnamed doctor",
  specialization: doctor.specialization ?? "Not specified",
});

const mapReport = (report: TestReport): UiReport => ({
  id: report.id,
  fileName: report.file_name,
  date: new Date(report.created_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
  doctorNote: report.metadata?.doctor_note ?? "",
});

const ReportAnalysis = ({ darkMode = false }: ReportAnalysisProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [reports, setReports] = useState<UiReport[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [availableDoctors, setAvailableDoctors] = useState<Array<{ id: string; displayId: string; name: string; specialization: string }>>(
    [],
  );
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const reportType = "Lab Report";
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await reportsApi.list({ patient_id: user?.id });

        setReports(response.map(mapReport));
        setApiError(null);
      } catch {
        setApiError(t("auth", "noAvailableData", "No available data."));
      } finally {
        setLoading(false);
      }
    };

    const loadDoctors = async () => {
      try {
        const response = await usersApi.listRegisteredDoctors();
        const nextDoctors = Array.isArray(response) ? response.map(normalizeDoctorOption).filter((doctor) => doctor.id) : [];
        setAvailableDoctors(nextDoctors);
        setSelectedDoctorId(nextDoctors[0]?.id ?? "");
      } catch {
        setAvailableDoctors([]);
        setSelectedDoctorId("");
      }
    };

    void loadReports();
    void loadDoctors();
  }, [user?.id]);

  const handleUpload = async () => {
    if (!user?.id) {
      setApiError(t("auth", "loginAgainBeforeUploading", "Please login again before uploading reports."));
      return;
    }

    if (!selectedFile) {
      setApiError(t("auth", "chooseFileToUpload", "Choose a PDF or image file to upload."));
      return;
    }

    if (!selectedDoctorId) {
      setApiError(t("auth", "selectDoctorToShare", "Select a registered doctor to share this report with."));
      return;
    }

    setUploading(true);
    setApiError(null);

    try {
      await reportsApi.upload({
        patient_id: user.id,
        doctor_id: selectedDoctorId,
        report_type: reportType,
        file: selectedFile,
        metadata: {
          status: "Pending",
          original_file_name: selectedFile.name,
          mime_type: selectedFile.type,
        },
      });
    } catch {
      try {
        await reportsApi.create({
          patient_id: user.id,
          doctor_id: selectedDoctorId,
          report_type: reportType,
          file_name: selectedFile.name,
          file_path: `/uploads/${selectedFile.name}`,
          metadata: {
            status: "Pending",
            original_file_name: selectedFile.name,
            mime_type: selectedFile.type,
          },
        });
      } catch {
        setApiError(t("auth", "reportUploadFailed", "Report upload failed. The backend needs a file upload endpoint."));
        setUploading(false);
        return;
      }
    }

    setSelectedFile(null);
    setUploading(false);

    const refreshed = await reportsApi.list({ patient_id: user.id });
    setReports(refreshed.map(mapReport));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    setDeletingReportId(reportId);
    try {
      await reportsApi.remove(reportId);
      setReports((current) => current.filter((report) => report.id !== reportId));
      setApiError(null);
    } catch {
      setApiError(t("auth", "noAvailableData", "No available data."));
    } finally {
      setDeletingReportId(null);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-6 shadow-md">
        <div>
          <h2 className="text-5xl font-bold">{t("auth", "reportAnalysis", "Report Analysis")}</h2>
        </div>
        <img src={testResultsImg} alt={t("auth", "reportAnalysis", "Report Analysis")} className="h-70 w-70" loading="lazy" />
      </div>

      <div className="bg-white dark:bg-black px-6 py-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {apiError && (
            <div className="mb-4 rounded-2xl border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
              {apiError}
            </div>
          )}

          <section className="mt-6 rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <div className="mx-auto w-full max-w-3xl">
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                className={`rounded-3xl border-2 border-dashed px-4 py-10 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-[#0B3C5D] bg-[#0B3C5D]/10"
                    : "border-[#0B3C5D]/30 bg-[#EEF1F7] dark:bg-[#0B3C5D]/10"
                }`}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 dark:bg-black/40">
                  <img src={uploadIcon} alt="Upload" className="h-9 w-9 object-contain opacity-80" />
                </div>
                <input
                  id="report-upload-input"
                  type="file"
                  accept="application/pdf,image/*"
                  className="hidden"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                />
                <label
                  htmlFor="report-upload-input"
                  className="mx-auto mt-2 inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-[#0B3C5D] bg-[#0B3C5D] px-8 py-3 text-base font-semibold text-white shadow-md transition-all duration-300 hover:opacity-90"
                >
                  <img src={uploadIcon} alt="Upload icon" className="h-5 w-5 object-contain brightness-0 invert" />
                  Upload
                </label>
                {selectedFile && (
                  <p className="mt-3 text-sm text-[#0B3C5D] dark:text-white">{t("auth", "selected", "Selected:")} {selectedFile.name}</p>
                )}
              </div>

              <label className="mt-5 block text-sm font-semibold text-[#0B3C5D] dark:text-white">
                {t("auth", "sendToDoctor", "Send to doctor")}
                <select
                  value={selectedDoctorId}
                  onChange={(event) => setSelectedDoctorId(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black px-4 py-3 text-sm focus:outline-none"
                >
                  <option value="">{t("auth", "selectDoctor", "Select doctor")}</option>
                  {availableDoctors.length === 0 && (
                    <option value="" disabled>
                      {t("auth", "noRegisteredDoctors", "No registered doctors available")}
                    </option>
                  )}
                  {availableDoctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.displayId || doctor.id}) - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="rounded-2xl border border-[#0B3C5D] bg-[#0B3C5D] px-10 py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                >
                  {uploading ? t("auth", "uploading", "Uploading...") : t("auth", "uploadReport", "Upload Report")}
                </button>
              </div>
            </div>
          </section>

          <div className="mt-6">
            <div className="mb-2 text-xs font-semibold text-[#0B3C5D] dark:text-white">{t("auth", "uploadedDocumentHistory", "Uploaded Document History")}</div>
            <div className="grid grid-cols-1 gap-5">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-2xl border-2 border-[#0B3C5D]/30 dark:border-white/20 bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-5"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div>
                      <h4 className="text-xl font-semibold text-[#0B3C5D] dark:text-white">{report.fileName}</h4>
                      <div className="mt-3 text-sm text-[#4B5563] dark:text-gray-300">Date: {report.date}</div>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => void handleDeleteReport(report.id)}
                          disabled={deletingReportId === report.id}
                          className="inline-flex items-center gap-2 rounded-2xl border border-red-600 px-3 py-2 text-xs font-medium transition-all duration-300 bg-white dark:bg-black text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-700 disabled:opacity-50"
                        >
                          <img src={deleteIcon} alt="Delete" className="h-3.5 w-3.5 object-contain" />
                          {deletingReportId === report.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                    <div className="pl-0 lg:pl-4">
                      <h5 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">{t("auth", "doctorNotes", "Doctor Notes")}</h5>
                      <p className="mt-2 text-sm text-[#4B5563] dark:text-gray-300">{report.doctorNote || t("auth", "underReview", "Under review")}</p>
                    </div>
                  </div>
                </div>
              ))}
              {reports.length === 0 && !apiError && (
                <div className="rounded-2xl border-2 border-[#0B3C5D]/30 dark:border-white/20 bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-5 text-sm text-[#4B5563] dark:text-gray-300">
                  {loading ? t("auth", "loadingReports", "Loading reports...") : t("auth", "noReportsFound", "No reports found for this patient.")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysis;

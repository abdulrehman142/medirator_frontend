import { useEffect, useMemo, useState } from "react";
import testResultsImg from "/medirator_images/testresults.png";
import downloadIcon from "/medirator_images/download.png";
import deleteIcon from "/medirator_images/delete.png";
import { adminApi } from "../../../api/adminApi";
import { reportsApi } from "../../../api/reportsApi";
import { toPatientDisplayId } from "../../../utils/idDisplay";
import { useLanguage } from "../../../context/LanguageContext";

interface TestReportManagementPageProps {
  darkMode?: boolean;
}

interface ReportRecord {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
}

const TestReportManagementPage = ({ darkMode = false }: TestReportManagementPageProps) => {
  const { t } = useLanguage();
  const [apiError, setApiError] = useState<string | null>(null);
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [patientNameMap, setPatientNameMap] = useState<Record<string, string>>({});

  const filteredReports = useMemo(
    () =>
      reports.filter(
        (report) =>
          report.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.patientId.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [reports, searchQuery],
  );

  const downloadReport = async (report: ReportRecord) => {
    setDownloadingId(report.id);
    try {
      const { blob, fileName } = await reportsApi.downloadFile(report.id);
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
      setApiError(null);
    } catch {
      setApiError("Download failed.");
    } finally {
      setDownloadingId(null);
    }
  };

  const deleteReport = async (reportId: string) => {
    setDeletingId(reportId);
    try {
      await reportsApi.remove(reportId);
      setReports((current) => current.filter((report) => report.id !== reportId));
      setApiError(null);
    } catch {
      setApiError("Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const loadPatientNames = async () => {
      try {
        const patients = await adminApi.listPatients();
        const nextMap: Record<string, string> = {};
        for (const patient of patients) {
          if (patient.user_id) {
            nextMap[patient.user_id] = patient.name;
          }
          nextMap[patient.id] = patient.name;
        }
        setPatientNameMap(nextMap);
      } catch {
        setPatientNameMap({});
      }
    };
    void loadPatientNames();
  }, []);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await reportsApi.list();
        if (response.length === 0) {
          return;
        }

        setReports(
          response.map((report) => ({
            id: report.id,
            patientName:
              patientNameMap[report.patient_id] ??
              report.metadata?.patient_name ??
              toPatientDisplayId(report.patient_id),
            patientId: toPatientDisplayId(report.patient_id),
            date: report.created_at.slice(0, 10),
          })),
        );
        setApiError(null);
      } catch {
        setApiError("No available data.");
      }
    };
    void loadReports();
  }, [patientNameMap]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">Test Report Management</h2>
        </div>
        <img src={testResultsImg} alt="Test Report Management" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="dark:bg-black px-3 md:px-6 py-6 space-y-4 font-sans text-black dark:text-white">
        {apiError && (
          <div className="rounded-2xl border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
            {apiError}
          </div>
        )}

        <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Reports List</h3>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search reports"
              className="rounded-2xl border border-[#0B3C5D] px-4 py-2 bg-white dark:bg-black"
            />
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-[#0B3C5D]">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-[#0B3C5D] text-white">
                <tr>
                  <th className="text-left px-4 py-3">Patient Name</th>
                  <th className="text-left px-4 py-3">Patient ID</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="border-t border-[#0B3C5D]/40">
                    <td className="px-4 py-3">{report.patientName}</td>
                    <td className="px-4 py-3">{report.patientId}</td>
                    <td className="px-4 py-3">{report.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => downloadReport(report)}
                          disabled={downloadingId === report.id}
                          className="inline-flex items-center gap-1 rounded-2xl border border-[#0B3C5D] px-3 py-1.5 disabled:opacity-50"
                        >
                          <img src={downloadIcon} alt={t("auth", "download", "Download")} className="h-3.5 w-3.5 object-contain" />
                          {downloadingId === report.id ? t("auth", "downloading", "Downloading...") : t("auth", "download", "Download")}
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteReport(report.id)}
                          disabled={deletingId === report.id}
                          className="inline-flex items-center gap-1 rounded-2xl border border-red-600 text-red-600 px-3 py-1.5 disabled:opacity-50"
                        >
                          <img src={deleteIcon} alt="Delete" className="h-3.5 w-3.5 object-contain" />
                          {deletingId === report.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TestReportManagementPage;

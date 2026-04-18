import { useMemo, useState } from "react";
import testResultsImg from "/medirator_images/testresults.png";

interface TestReportManagementPageProps {
  darkMode?: boolean;
}

interface ReportRecord {
  id: string;
  patientName: string;
  patientId: string;
  testType: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

const TestReportManagementPage = ({ darkMode = false }: TestReportManagementPageProps) => {
  const [reports, setReports] = useState<ReportRecord[]>([
    {
      id: "RP-101",
      patientName: "Ayesha Khan",
      patientId: "PT-240318-07",
      testType: "CBC",
      date: "2026-04-17",
      status: "Pending",
    },
    {
      id: "RP-102",
      patientName: "Hassan Ali",
      patientId: "PT-240402-11",
      testType: "HbA1c",
      date: "2026-04-16",
      status: "Approved",
    },
    {
      id: "RP-103",
      patientName: "Sara Iqbal",
      patientId: "PT-240215-03",
      testType: "Pulmonary Function",
      date: "2026-04-15",
      status: "Rejected",
    },
  ]);
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [testType, setTestType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReports = useMemo(
    () =>
      reports.filter(
        (report) =>
          report.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.testType.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [reports, searchQuery],
  );

  const uploadReport = () => {
    if (!patientName.trim() || !patientId.trim() || !testType.trim()) {
      return;
    }

    const nextReport: ReportRecord = {
      id: `RP-${100 + reports.length + 1}`,
      patientName: patientName.trim(),
      patientId: patientId.trim(),
      testType: testType.trim(),
      date: new Date().toISOString().slice(0, 10),
      status: "Pending",
    };

    setReports((current) => [nextReport, ...current]);
    setPatientName("");
    setPatientId("");
    setTestType("");
  };

  const updateStatus = (reportId: string, status: "Approved" | "Rejected") => {
    setReports((current) => current.map((report) => (report.id === reportId ? { ...report, status } : report)));
  };

  const downloadReport = (report: ReportRecord) => {
    const content = [
      "Test Report",
      `Report ID: ${report.id}`,
      `Patient: ${report.patientName}`,
      `Patient ID: ${report.patientId}`,
      `Test Type: ${report.testType}`,
      `Date: ${report.date}`,
      `Status: ${report.status}`,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${report.id}-report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">Test Report Management</h2>
          <p className="text-sm md:text-base text-center md:text-left ml-0 md:ml-5 md:pl-5 mt-2 text-gray-200">
            Upload, review, and approve reports with patient-linked record tracking.
          </p>
        </div>
        <img src={testResultsImg} alt="Test Report Management" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="dark:bg-black px-3 md:px-6 py-6 space-y-4 font-sans text-black dark:text-white">
        <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Upload Report</h3>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-2">
            <input
              value={patientName}
              onChange={(event) => setPatientName(event.target.value)}
              placeholder="Patient name"
              className="rounded-2xl border border-[#0B3C5D] px-4 py-2 bg-white dark:bg-black"
            />
            <input
              value={patientId}
              onChange={(event) => setPatientId(event.target.value)}
              placeholder="Patient ID"
              className="rounded-2xl border border-[#0B3C5D] px-4 py-2 bg-white dark:bg-black"
            />
            <input
              value={testType}
              onChange={(event) => setTestType(event.target.value)}
              placeholder="Test type"
              className="rounded-2xl border border-[#0B3C5D] px-4 py-2 bg-white dark:bg-black"
            />
            <button type="button" onClick={uploadReport} className="rounded-2xl border border-[#0B3C5D] px-4 py-2">
              Upload Report
            </button>
          </div>
        </section>

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
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-[#0B3C5D] text-white">
                <tr>
                  <th className="text-left px-4 py-3">Patient Name</th>
                  <th className="text-left px-4 py-3">Patient ID</th>
                  <th className="text-left px-4 py-3">Test Type</th>
                  <th className="text-left px-4 py-3">Date</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="border-t border-[#0B3C5D]/40">
                    <td className="px-4 py-3">{report.patientName}</td>
                    <td className="px-4 py-3">{report.patientId}</td>
                    <td className="px-4 py-3">{report.testType}</td>
                    <td className="px-4 py-3">{report.date}</td>
                    <td className="px-4 py-3">{report.status}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => downloadReport(report)}
                          className="rounded-2xl border border-[#0B3C5D] px-3 py-1.5"
                        >
                          View/Download
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(report.id, "Approved")}
                          className="rounded-2xl border border-green-600 text-green-700 px-3 py-1.5"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => updateStatus(report.id, "Rejected")}
                          className="rounded-2xl border border-red-600 text-red-600 px-3 py-1.5"
                        >
                          Reject
                        </button>
                        <div className="rounded-2xl border border-[#0B3C5D] px-3 py-1.5 text-xs">
                          Linked: {report.patientId}
                        </div>
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

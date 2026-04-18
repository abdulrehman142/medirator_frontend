
import testResultsImg from "/medirator_images/testresults.png";

interface TestResultsProps {
  darkMode?: boolean;
}

const TestResults = ({ darkMode = false }: TestResultsProps) => {
  const reports = [
    {
      testName: "Complete Blood Count (CBC)",
      date: "21 Feb 2026",
      status: "Normal",
      keyFinding: "Hemoglobin 13.4 g/dL",
    },
    {
      testName: "Fasting Blood Glucose",
      date: "18 Feb 2026",
      status: "Attention",
      keyFinding: "Glucose 118 mg/dL",
    },
    {
      testName: "Lipid Profile",
      date: "11 Feb 2026",
      status: "Normal",
      keyFinding: "LDL 94 mg/dL",
    },
    {
      testName: "Vitamin D",
      date: "04 Feb 2026",
      status: "Low",
      keyFinding: "Vitamin D 22 ng/mL",
    },
  ];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-6 shadow-md">
        <div>
          <h2 className="text-5xl font-bold">Test Reports</h2>
          <p className="mt-2">Access all lab and medical test results.</p>
        </div>
        <img src={testResultsImg} alt="Test Results" className="h-70 w-70" loading="lazy" />
      </div>

      <div className="bg-white dark:bg-black px-6 py-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-[#0B3C5D] dark:text-white">Recent Reports</h3>
          <p className="mt-2 text-[#4B5563] dark:text-gray-300">
            Review your latest lab reports with quick status highlights and key values.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {reports.map((report) => (
              <div
                key={`${report.testName}-${report.date}`}
                className="rounded-2xl border-2 border-[#0B3C5D]/30 dark:border-white/20 bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-xl font-semibold text-[#0B3C5D] dark:text-white">{report.testName}</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      report.status === "Normal"
                        ? "bg-emerald-700 text-white"
                        : report.status === "Attention"
                          ? "bg-amber-400 text-black"
                          : "bg-red-700 text-white"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>

                <div className="mt-3 text-sm text-[#4B5563] dark:text-gray-300">Date: {report.date}</div>
                <div className="mt-2 text-sm text-[#4B5563] dark:text-gray-300">Key finding:</div>
                <div className="text-[#0B3C5D] dark:text-white font-medium">{report.keyFinding}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResults;

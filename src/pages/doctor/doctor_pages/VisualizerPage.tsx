import { useEffect, useMemo, useState } from "react";

import dashboardImg from "/medirator_images/dashboard.png";
import downloadIcon from "/medirator_images/download.png";

import DoctorPatientDropdown from "../../../components/DoctorPatientDropdown";
import { useDoctorPatient } from "../../../context/DoctorPatientContext";
import { clinicalApi } from "../../../api/clinicalApi";

interface VisualizerPageProps {
  darkMode?: boolean;
}

type TimeFilter = "week" | "month" | "year";

interface VitalPoint {
  label: string;
  bloodPressure: number;
  sugar: number;
  heartRate: number;
}

const filterData: Record<TimeFilter, VitalPoint[]> = {
  week: [
    { label: "Mon", bloodPressure: 124, sugar: 118, heartRate: 74 },
    { label: "Tue", bloodPressure: 128, sugar: 122, heartRate: 79 },
    { label: "Wed", bloodPressure: 136, sugar: 132, heartRate: 85 },
    { label: "Thu", bloodPressure: 130, sugar: 126, heartRate: 81 },
    { label: "Fri", bloodPressure: 126, sugar: 120, heartRate: 76 },
    { label: "Sat", bloodPressure: 122, sugar: 114, heartRate: 72 },
    { label: "Sun", bloodPressure: 120, sugar: 112, heartRate: 71 },
  ],
  month: [
    { label: "W1", bloodPressure: 132, sugar: 128, heartRate: 82 },
    { label: "W2", bloodPressure: 128, sugar: 124, heartRate: 80 },
    { label: "W3", bloodPressure: 124, sugar: 120, heartRate: 77 },
    { label: "W4", bloodPressure: 122, sugar: 116, heartRate: 74 },
  ],
  year: [
    { label: "Q1", bloodPressure: 138, sugar: 136, heartRate: 86 },
    { label: "Q2", bloodPressure: 132, sugar: 128, heartRate: 81 },
    { label: "Q3", bloodPressure: 126, sugar: 122, heartRate: 77 },
    { label: "Q4", bloodPressure: 122, sugar: 116, heartRate: 73 },
  ],
};

const thresholds = {
  bloodPressure: 130,
  sugar: 126,
  heartRate: 100,
};

const treatmentComparison = {
  before: {
    bloodPressure: 138,
    sugar: 136,
    heartRate: 86,
  },
  after: {
    bloodPressure: 122,
    sugar: 116,
    heartRate: 73,
  },
};

interface TrendCardProps {
  title: string;
  values: number[];
  labels: string[];
  unit: string;
  abnormalThreshold: number;
}

const TrendCard = ({ title, values, labels, unit, abnormalThreshold }: TrendCardProps) => {
  const maxValue = Math.max(...values, abnormalThreshold);

  return (
    <div className="rounded-2xl border border-[#0B3C5D] p-4 bg-white dark:bg-black">
      <h3 className="text-base md:text-lg font-semibold text-[#0B3C5D] dark:text-white">{title}</h3>
      <div className="mt-3 flex items-end gap-2 h-40 border border-[#0B3C5D] rounded-2xl p-3 bg-white dark:bg-black">
        {values.map((value, index) => {
          const barHeight = `${Math.max(14, (value / maxValue) * 100)}%`;
          const isAbnormal = value > abnormalThreshold;

          return (
            <div key={`${title}-${labels[index]}`} className="flex-1 h-full flex flex-col justify-end items-center gap-2">
              <div
                className={`w-full max-w-8 rounded-t-md ${isAbnormal ? "bg-red-600" : "bg-[#0B3C5D]"}`}
                style={{ height: barHeight }}
                title={`${labels[index]}: ${value}${unit}`}
              />
              <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">{labels[index]}</div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Red bars indicate abnormal values above {abnormalThreshold}
        {unit}.
      </p>
    </div>
  );
};

const VisualizerPage = ({ darkMode = false }: VisualizerPageProps) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");
  const { selectedPatient } = useDoctorPatient();
  const [recordsSummary, setRecordsSummary] = useState<{ total: number; timeline: string[] } | null>(null);

  const patientAdjustment = useMemo(() => {
    switch (selectedPatient.id) {
      case "PT-240402-11":
        return { bp: -6, sugar: -4, heart: -3 };
      case "PT-240215-03":
        return { bp: -10, sugar: -12, heart: -5 };
      default:
        return { bp: 0, sugar: 0, heart: 0 };
    }
  }, [selectedPatient.id]);

  const patientFilterData = useMemo(() => {
    const applyAdjustment = (points: VitalPoint[]): VitalPoint[] =>
      points.map((point) => ({
        ...point,
        bloodPressure: point.bloodPressure + patientAdjustment.bp,
        sugar: point.sugar + patientAdjustment.sugar,
        heartRate: point.heartRate + patientAdjustment.heart,
      }));

    return {
      week: applyAdjustment(filterData.week),
      month: applyAdjustment(filterData.month),
      year: applyAdjustment(filterData.year),
    };
  }, [patientAdjustment]);

  const data = patientFilterData[timeFilter];
  const labels = data.map((point) => point.label);

  const bloodPressureValues = data.map((point) => point.bloodPressure);
  const sugarValues = data.map((point) => point.sugar);
  const heartRateValues = data.map((point) => point.heartRate);

  const abnormalSummary = useMemo(() => {
    const bpCount = bloodPressureValues.filter((value) => value > thresholds.bloodPressure).length;
    const sugarCount = sugarValues.filter((value) => value > thresholds.sugar).length;
    const heartCount = heartRateValues.filter((value) => value > thresholds.heartRate).length;

    return {
      bpCount,
      sugarCount,
      heartCount,
      total: bpCount + sugarCount + heartCount,
    };
  }, [bloodPressureValues, sugarValues, heartRateValues]);

  const handleDownloadReport = () => {
    const reportLines = [
      "Visualizer Report",
      `Filter: ${timeFilter}`,
      "",
      "Blood Pressure:",
      ...data.map((point) => `${point.label}: ${point.bloodPressure}`),
      "",
      "Sugar Levels:",
      ...data.map((point) => `${point.label}: ${point.sugar}`),
      "",
      "Heart Rate:",
      ...data.map((point) => `${point.label}: ${point.heartRate}`),
      "",
      `Abnormal Values Detected: ${abnormalSummary.total}`,
    ];

    const blob = new Blob([reportLines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "visualizer-report.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const load = async () => {
      if (!selectedPatient.id) {
        setRecordsSummary(null);
        return;
      }
      try {
        const records = await clinicalApi.records(selectedPatient.id);
        const timeline = (records.timeline as Array<{ summary?: string }>) ?? [];
        setRecordsSummary({ total: timeline.length, timeline: timeline.slice(0, 5).map((item) => item.summary ?? "") });
      } catch {
        setRecordsSummary(null);
      }
    };
    void load();
  }, [selectedPatient.id]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 md:p-6 shadow-md gap-4">
        <div className="flex-1">
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">
            Visualizer
          </h2>
          <div className="ml-0 md:ml-5 md:pl-5 mt-3">
            <DoctorPatientDropdown darkMode={darkMode} />
          </div>
        </div>
        <img src={dashboardImg} alt="Visualizer" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="dark:bg-black px-3 md:px-6 py-6 space-y-4 font-sans">
        <div className="flex justify-center items-center -mt-2 md:-mt-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTimeFilter("week")}
              className={`rounded-2xl border px-4 py-2 text-sm transition-all duration-300 ${
                timeFilter === "week"
                  ? "bg-[#0B3C5D] border-[#0B3C5D] text-white"
                  : "bg-white border-[#0B3C5D] text-black dark:bg-black dark:text-white hover:bg-[#0B3C5D] hover:text-white"
              }`}
            >
              Last week
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter("month")}
              className={`rounded-2xl border px-4 py-2 text-sm transition-all duration-300 ${
                timeFilter === "month"
                  ? "bg-[#0B3C5D] border-[#0B3C5D] text-white"
                  : "bg-white border-[#0B3C5D] text-black dark:bg-black dark:text-white hover:bg-[#0B3C5D] hover:text-white"
              }`}
            >
              Last month
            </button>
            <button
              type="button"
              onClick={() => setTimeFilter("year")}
              className={`rounded-2xl border px-4 py-2 text-sm transition-all duration-300 ${
                timeFilter === "year"
                  ? "bg-[#0B3C5D] border-[#0B3C5D] text-white"
                  : "bg-white border-[#0B3C5D] text-black dark:bg-black dark:text-white hover:bg-[#0B3C5D] hover:text-white"
              }`}
            >
              Last year
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TrendCard
            title="Blood Pressure Trends"
            values={bloodPressureValues}
            labels={labels}
            unit=" mmHg"
            abnormalThreshold={thresholds.bloodPressure}
          />
          <TrendCard
            title="Sugar Levels"
            values={sugarValues}
            labels={labels}
            unit=" mg/dL"
            abnormalThreshold={thresholds.sugar}
          />
          <TrendCard
            title="Heart Rate"
            values={heartRateValues}
            labels={labels}
            unit=" bpm"
            abnormalThreshold={thresholds.heartRate}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl shadow p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Before vs After Treatment</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Comparison for {selectedPatient.name}</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-[#0B3C5D] p-3 text-sm text-black dark:text-white">
                <div className="font-semibold">Before Treatment</div>
                <div className="mt-1">Blood Pressure: {treatmentComparison.before.bloodPressure + patientAdjustment.bp} mmHg</div>
                <div>Sugar: {treatmentComparison.before.sugar + patientAdjustment.sugar} mg/dL</div>
                <div>Heart Rate: {treatmentComparison.before.heartRate + patientAdjustment.heart} bpm</div>
              </div>
              <div className="rounded-2xl border border-[#0B3C5D] p-3 text-sm text-black dark:text-white">
                <div className="font-semibold">After Treatment</div>
                <div className="mt-1">Blood Pressure: {treatmentComparison.after.bloodPressure + patientAdjustment.bp} mmHg</div>
                <div>Sugar: {treatmentComparison.after.sugar + patientAdjustment.sugar} mg/dL</div>
                <div>Heart Rate: {treatmentComparison.after.heartRate + patientAdjustment.heart} bpm</div>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl shadow p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Abnormal Value Highlights</h3>
            <ul className="mt-4 space-y-2 text-sm text-black dark:text-white">
              <li className="rounded-2xl border border-[#0B3C5D] p-3">Blood pressure abnormalities: {abnormalSummary.bpCount}</li>
              <li className="rounded-2xl border border-[#0B3C5D] p-3">Sugar abnormalities: {abnormalSummary.sugarCount}</li>
              <li className="rounded-2xl border border-[#0B3C5D] p-3">Heart rate abnormalities: {abnormalSummary.heartCount}</li>
              <li className="rounded-2xl border border-red-600 bg-red-50 dark:bg-red-950/20 p-3 text-red-700 dark:text-red-300">
                Total abnormal values: {abnormalSummary.total}
              </li>
              <li className="rounded-2xl border border-[#0B3C5D] p-3">Timeline records: {recordsSummary?.total ?? 0}</li>
            </ul>
          </section>
        </div>

        <div className="pt-2 md:pt-4 pb-2 md:pb-4 flex justify-center items-center">
          <button
            type="button"
            className="bg-white border rounded-2xl border-[#0B3C5D] dark:bg-black hover:text-white dark:text-white hover:bg-[#0B3C5D] dark:hover:bg-gray-800 text-black px-5 py-2.5 text-sm transition-all duration-300 inline-flex items-center"
            onClick={handleDownloadReport}
          >
            <img src={downloadIcon} alt="Download" className="w-4 h-4 object-contain mr-2" loading="lazy" />
            Download report
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualizerPage;

import { useEffect, useState } from "react";
import visualizerImg from "/medirator_images/dashboard.png";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { clinicalApi } from "../../api/clinicalApi";
import { useLanguage } from "../../context/LanguageContext";


interface VisualizerProps {
  darkMode?: boolean;
}

const Visualizer = ({ darkMode = false }: VisualizerProps) => {
  const { t } = useLanguage();
  const [chartView, setChartView] = useState<"weekly" | "monthly">("monthly");
  const [activeRiskIndex, setActiveRiskIndex] = useState(0);
  const [snapshot, setSnapshot] = useState<{
    appointments: number;
    reports: number;
    medicationsCurrent: number;
    timelineItems: string[];
    risks: Array<{ title: string; value: number; color: string }>;
  } | null>(null);

  const kpiCards = [
    { label: t("services", "totalAppointments", "Total Appointments"), value: String(snapshot?.appointments ?? 0), change: t("services", "fromPatientRecords", "From patient records") },
    { label: t("services", "totalReports", "Total Reports"), value: String(snapshot?.reports ?? 0), change: t("services", "fromPatientRecords", "From patient records") },
    { label: t("services", "currentSaltsTitle", "Current Salts"), value: String(snapshot?.medicationsCurrent ?? 0), change: t("services", "activeMedications", "Active medications") },
    { label: t("services", "timelineItems", "Timeline Items"), value: String(snapshot?.timelineItems.length ?? 0), change: t("services", "recordedEvents", "Recorded events") },
  ];

  const monthlyBarData = [
    { label: t("services", "jan", "Jan"), bloodPressure: 138, glucose: 126 },
    { label: t("services", "feb", "Feb"), bloodPressure: 134, glucose: 122 },
    { label: t("services", "mar", "Mar"), bloodPressure: 132, glucose: 119 },
    { label: t("services", "apr", "Apr"), bloodPressure: 130, glucose: 117 },
    { label: t("services", "may", "May"), bloodPressure: 129, glucose: 115 },
    { label: t("services", "jun", "Jun"), bloodPressure: 128, glucose: 112 },
  ];

  const weeklyBarData = [
    { label: t("services", "mon", "Mon"), bloodPressure: 130, glucose: 114 },
    { label: t("services", "tue", "Tue"), bloodPressure: 128, glucose: 112 },
    { label: t("services", "wed", "Wed"), bloodPressure: 129, glucose: 113 },
    { label: t("services", "thu", "Thu"), bloodPressure: 127, glucose: 110 },
    { label: t("services", "fri", "Fri"), bloodPressure: 126, glucose: 109 },
    { label: t("services", "sat", "Sat"), bloodPressure: 128, glucose: 111 },
    { label: t("services", "sun", "Sun"), bloodPressure: 127, glucose: 108 },
  ];

  const activityComparison = [
    { metric: t("services", "appointmentsMetric", "Appointments"), current: 8, target: 10 },
    { metric: t("services", "testsCompletedMetric", "Tests Completed"), current: 5, target: 6 },
    { metric: t("services", "hydrationGoalsMetric", "Hydration Goals"), current: 22, target: 28 },
    { metric: t("services", "exerciseDaysMetric", "Exercise Days"), current: 17, target: 20 },
  ];

  const correlationPoints = [
    { day: t("services", "mon", "Mon"), sleepHours: 6.2, glucose: 122, risk: 58 },
    { day: t("services", "tue", "Tue"), sleepHours: 6.8, glucose: 118, risk: 52 },
    { day: t("services", "wed", "Wed"), sleepHours: 7.1, glucose: 114, risk: 46 },
    { day: t("services", "thu", "Thu"), sleepHours: 7.4, glucose: 111, risk: 42 },
    { day: t("services", "fri", "Fri"), sleepHours: 7.8, glucose: 108, risk: 37 },
    { day: t("services", "sat", "Sat"), sleepHours: 8.1, glucose: 105, risk: 32 },
    { day: t("services", "sun", "Sun"), sleepHours: 7.6, glucose: 109, risk: 39 },
  ];

  const riskOverview = snapshot?.risks?.length
    ? snapshot.risks
    : [
        { title: t("services", "cardiacRisk", "Cardiac Risk"), value: 28, color: "#22C55E" },
        { title: t("services", "diabetesRisk", "Diabetes Risk"), value: 42, color: "#EAB308" },
        { title: t("services", "stressRisk", "Stress Risk"), value: 56, color: "#F97316" },
      ];
  const activeBarData = chartView === "monthly" ? monthlyBarData : weeklyBarData;
  const maxBarValue = Math.max(...activeBarData.map((item) => Math.max(item.bloodPressure, item.glucose)));
  const tooltipContentStyle = {
    backgroundColor: darkMode ? "#111827" : "#ffffff",
    borderRadius: "12px",
    border: "1px solid #0B3C5D",
    color: darkMode ? "#F9FAFB" : "#111827",
  };
  const tooltipLabelStyle = {
    color: darkMode ? "#F9FAFB" : "#111827",
    fontWeight: 600,
  };
  const tooltipItemStyle = {
    color: darkMode ? "#F9FAFB" : "#111827",
  };

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const records = await clinicalApi.myRecords();
        const appointments = (records.appointments as Array<unknown>) ?? [];
        const reports = (records.reports as Array<unknown>) ?? [];
        const medicationsCurrent = (records.medications_current as Array<unknown>) ?? [];
        const timeline = (records.timeline as Array<{ summary?: string }>) ?? [];
        const risksRaw = (records.risk_assessments as Array<{ summary?: string; score?: number }>) ?? [];
        const risks = risksRaw.slice(0, 3).map((risk, index) => ({
          title: risk.summary ?? t("services", "riskFallback", `Risk ${index + 1}`),
          value: Math.max(0, Math.min(100, Math.round(Number(risk.score ?? 0)))),
          color: ["#22C55E", "#EAB308", "#F97316"][index % 3],
        }));
        setSnapshot({
          appointments: appointments.length,
          reports: reports.length,
          medicationsCurrent: medicationsCurrent.length,
          timelineItems: timeline.map((item) => item.summary ?? "").filter(Boolean),
          risks,
        });
      } catch {
        setSnapshot(null);
      }
    };
    void loadRecords();
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-6 shadow-md">
        <div>
          <h2 className="text-5xl font-bold">{t("navbar", "visualizer", "Visualizer")}</h2>
        </div>
        <img src={visualizerImg} alt={t("navbar", "visualizer", "Visualizer")} className="h-70 w-70" loading="lazy" />
      </div>

      <div className="bg-white dark:bg-black min-h-screen px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <p className="text-sm text-[#6B7280] dark:text-gray-300">{card.label}</p>
                <p className="mt-2 text-2xl font-bold text-[#0B3C5D] dark:text-white">{card.value}</p>
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">{card.change}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-5 transition-all duration-300 hover:shadow-lg">
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <h3 className="text-xl font-bold text-[#0B3C5D] dark:text-white">{t("services", "vitalsTrend", "Vitals Trend")}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setChartView("weekly")}
                    className={`px-3 py-1 rounded-2xl text-sm border border-[#0B3C5D] transition-all duration-200 ${
                      chartView === "weekly"
                        ? "bg-[#0B3C5D] text-white"
                        : "bg-white dark:bg-black text-[#0B3C5D] dark:text-white hover:bg-[#0B3C5D] hover:text-white"
                    }`}
                  >
                    {t("services", "weekly", "Weekly")}
                  </button>
                  <button
                    onClick={() => setChartView("monthly")}
                    className={`px-3 py-1 rounded-2xl text-sm border border-[#0B3C5D] transition-all duration-200 ${
                      chartView === "monthly"
                        ? "bg-[#0B3C5D] text-white"
                        : "bg-white dark:bg-black text-[#0B3C5D] dark:text-white hover:bg-[#0B3C5D] hover:text-white"
                    }`}
                  >
                    {t("services", "monthly", "Monthly")}
                  </button>
                </div>
              </div>
              <p className="text-sm mt-1 text-[#6B7280] dark:text-gray-300">
                {t("services", "vitalsSubtitle", "Interactive comparison of blood pressure and glucose values.")}
              </p>

              <div className="h-80 mt-5">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activeBarData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#475569" : "#CBD5E1"} />
                    <XAxis dataKey="label" stroke={darkMode ? "#E5E7EB" : "#0B3C5D"} />
                    <YAxis stroke={darkMode ? "#E5E7EB" : "#0B3C5D"} />
                    <Tooltip
                      contentStyle={tooltipContentStyle}
                      labelStyle={tooltipLabelStyle}
                      itemStyle={tooltipItemStyle}
                    />
                    <Legend />
                    <Bar dataKey="bloodPressure" name={t("services", "bloodPressure", "Blood Pressure")} fill="#0B3C5D" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="glucose" name={t("services", "glucose", "Glucose")} fill="#38BDF8" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-5 rounded-xl border border-[#0B3C5D]/30 dark:border-white/20 bg-white dark:bg-black/30 p-3">
                <p className="text-sm font-semibold text-[#0B3C5D] dark:text-white">{t("services", "detailedBreakdown", "Detailed Breakdown")}</p>
                <div className="mt-3 space-y-2">
                  {activeBarData.map((item) => (
                    <div key={item.label} className="grid grid-cols-12 gap-2 items-center">
                      <span className="col-span-2 text-xs font-semibold text-[#0B3C5D] dark:text-gray-200">
                        {item.label}
                      </span>
                      <div className="col-span-4 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div
                          className="h-full bg-[#0B3C5D]"
                          style={{ width: `${Math.round((item.bloodPressure / maxBarValue) * 100)}%` }}
                        />
                      </div>
                      <div className="col-span-4 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div
                          className="h-full bg-[#38BDF8]"
                          style={{ width: `${Math.round((item.glucose / maxBarValue) * 100)}%` }}
                        />
                      </div>
                      <span className="col-span-2 text-[10px] text-right text-[#6B7280] dark:text-gray-300">
                        {item.bloodPressure}/{item.glucose}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-xs">
                    <span className="flex items-center gap-2 text-[#0B3C5D] dark:text-gray-200">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#0B3C5D]" /> {t("services", "bloodPressure", "Blood Pressure")}
                    </span>
                  <span className="flex items-center gap-2 text-[#0B3C5D] dark:text-gray-200">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#38BDF8]" /> {t("services", "glucose", "Glucose")}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-5 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-xl font-bold text-[#0B3C5D] dark:text-white">{t("services", "riskDistribution", "Risk Distribution")}</h3>
              <p className="text-sm mt-1 text-[#6B7280] dark:text-gray-300">{t("services", "hoverSlicesHint", "Hover slices to inspect category weight.")}</p>

              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={tooltipContentStyle}
                      labelStyle={tooltipLabelStyle}
                      itemStyle={tooltipItemStyle}
                    />
                    <Pie
                      data={riskOverview}
                      dataKey="value"
                      nameKey="title"
                      cx="50%"
                      cy="48%"
                      outerRadius={88}
                      innerRadius={50}
                      paddingAngle={2}
                      onMouseEnter={(_, index) => setActiveRiskIndex(index)}
                    >
                      {riskOverview.map((entry, index) => (
                        <Cell
                          key={entry.title}
                          fill={entry.color}
                          stroke={index === activeRiskIndex ? "#0B3C5D" : "transparent"}
                          strokeWidth={index === activeRiskIndex ? 3 : 1}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                {riskOverview.map((risk) => (
                  <div key={risk.title} className="inline-flex items-center gap-2 text-[#0B3C5D] dark:text-white whitespace-nowrap">
                    <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: risk.color }} />
                    <span>{risk.title}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 text-sm text-[#0B3C5D] dark:text-white font-semibold whitespace-nowrap">
                {riskOverview[activeRiskIndex].title}: {riskOverview[activeRiskIndex].value}%
              </div>

              <div className="mt-4 space-y-3">
                {riskOverview.map((risk) => (
                  <div key={risk.title}>
                    <div className="flex justify-between text-sm font-medium text-[#0B3C5D] dark:text-white">
                      <span>{risk.title}</span>
                      <span>{risk.value}%</span>
                    </div>
                    <div className="mt-1 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div className="h-full" style={{ width: `${risk.value}%`, backgroundColor: risk.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-5 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-xl font-bold text-[#0B3C5D] dark:text-white">{t("services", "careActivityVsTarget", "Care Activity vs Target")}</h3>
              <p className="text-sm mt-1 text-[#6B7280] dark:text-gray-300">{t("services", "monthlyCareGoals", "Progress against monthly care goals.")}</p>

              <div className="mt-5 space-y-4">
                {activityComparison.map((item) => {
                  const progress = Math.min(100, Math.round((item.current / item.target) * 100));
                  return (
                    <div key={item.metric}>
                      <div className="flex justify-between text-sm text-[#0B3C5D] dark:text-white">
                        <span>{item.metric}</span>
                        <span>
                          {item.current}/{item.target}
                        </span>
                      </div>
                      <div className="mt-1 h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div className="h-full bg-[#0B3C5D]" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-5 transition-all duration-300 hover:shadow-lg">
              <h3 className="text-xl font-bold text-[#0B3C5D] dark:text-white">{t("services", "sleepVsGlucose", "Sleep vs Glucose (Scatter)")}</h3>
              <p className="text-sm mt-1 text-[#6B7280] dark:text-gray-300">
                {t("services", "scatterHint", "Each point shows one day; larger bubbles indicate higher risk score.")}
              </p>

              <div className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 14, left: 26, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#475569" : "#CBD5E1"} />
                    <XAxis
                      type="number"
                      dataKey="sleepHours"
                      name={t("services", "sleep", "Sleep")}
                      domain={[5.5, 8.5]}
                      tickFormatter={(value) => `${value}h`}
                      stroke={darkMode ? "#E5E7EB" : "#0B3C5D"}
                    />
                    <YAxis
                      type="number"
                      dataKey="glucose"
                      name={t("services", "glucose", "Glucose")}
                      domain={[100, 125]}
                      tickFormatter={(value) => `${value}`}
                      stroke={darkMode ? "#E5E7EB" : "#0B3C5D"}
                    />
                    <ZAxis type="number" dataKey="risk" range={[90, 520]} name="Risk" unit="%" />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      contentStyle={tooltipContentStyle}
                      labelStyle={tooltipLabelStyle}
                      itemStyle={tooltipItemStyle}
                      formatter={(value, name) => {
                        if (name === "Sleep") return [`${value} h`, name];
                        if (name === "Glucose") return [`${value} mg/dL`, name];
                        if (name === "Risk") return [`${value}%`, name];
                        return [value, name];
                      }}
                      labelFormatter={(_, payload) => {
                        if (!payload || !payload.length) return "";
                        return `${t("services", "dayLabel", "Day")}: ${payload[0].payload.day}`;
                      }}
                    />
                    <Scatter name={t("services", "dailyCorrelation", "Daily Correlation")} data={correlationPoints} fill="#0B3C5D" fillOpacity={0.9} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#0B3C5D] dark:text-white">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#0B3C5D]" /> {t("services", "dailyCorrelation", "Daily Correlation")}
                </span>
                <span className="text-[#6B7280] dark:text-gray-300">{t("services", "xAxisSleep", "X-axis: Sleep (hours)")}</span>
                <span className="text-[#6B7280] dark:text-gray-300">{t("services", "yAxisGlucose", "Y-axis: Glucose (mg/dL)")}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-5 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-xl font-bold text-[#0B3C5D] dark:text-white">{t("services", "clinicalSnapshot", "Clinical Snapshot")}</h3>
            <p className="text-sm mt-1 text-[#6B7280] dark:text-gray-300">{t("services", "recentHighlights", "Recent highlights from patient records.")}</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {(snapshot?.timelineItems?.length
                ? snapshot.timelineItems
                : [
                    t("services", "snapshot1", "Latest CBC report is within normal range."),
                    t("services", "snapshot2", "Blood pressure trend is improving steadily."),
                    t("services", "snapshot3", "Medication adherence remained above 90% this month."),
                    t("services", "snapshot4", "Next physician appointment is scheduled in 5 days."),
                    t("services", "snapshot5", "Hydration and activity goals need slight improvement."),
                  ]
              ).map((insight) => (
                <div
                  key={insight}
                  className="rounded-xl border border-[#0B3C5D]/30 dark:border-white/20 bg-white dark:bg-black/30 px-3 py-2 text-sm text-[#374151] dark:text-gray-200"
                >
                  {insight}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;

import { useEffect, useState } from "react";
import visualizerImg from "/medirator_images/dashboard.png";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { appointmentsApi } from "../../api/appointmentsApi";
import { reportsApi } from "../../api/reportsApi";
import { clinicalApi } from "../../api/clinicalApi";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

interface VisualizerProps {
  darkMode?: boolean;
}

const Visualizer = ({ darkMode = false }: VisualizerProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    appointments: number;
    reports: number;
  }>({ appointments: 0, reports: 0 });
  const [monthlyData, setMonthlyData] = useState<
    Array<{ month: string; appointments: number; reports: number }>
  >([]);
  const [medDurations, setMedDurations] = useState<
    Array<{ name: string; avgCurrent?: number; avgPast?: number }>
  >([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setApiError(null);

      try {
        const [appointments, reports] = await Promise.all([
          appointmentsApi.list(),
          reportsApi.list(user?.id ? { patient_id: user.id } : undefined),
        ]);

        const now = new Date();
        const monthly = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const month = date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
          const apptCount = appointments.filter((appointment) => {
            const scheduledDate = new Date(
              appointment.scheduled_for || appointment.created_at || "",
            );
            return (
              scheduledDate.getMonth() === date.getMonth() &&
              scheduledDate.getFullYear() === date.getFullYear()
            );
          }).length;
          const reportCount = reports.filter((report) => {
            const createdDate = new Date(report.created_at || "");
            return (
              createdDate.getMonth() === date.getMonth() &&
              createdDate.getFullYear() === date.getFullYear()
            );
          }).length;
          monthly.push({
            month,
            appointments: apptCount,
            reports: reportCount,
          });
        }
        setMonthlyData(monthly);

        setSummary({
          appointments: appointments.length,
          reports: reports.length,
        });

        // Load medication durations (salts)
        try {
          const [currentMeds, pastMeds] = await Promise.all([
            clinicalApi.listCurrentMedications(user?.id),
            clinicalApi.listPastMedications(user?.id),
          ]);

          const msPerDay = 1000 * 60 * 60 * 24;
          const now = new Date();

          const map = new Map<
            string,
            {
              curTotal: number;
              curCount: number;
              pastTotal: number;
              pastCount: number;
            }
          >();

          (currentMeds || []).forEach((m: any) => {
            const name = (m.medication_name || "Unknown").toString();
            const start = m.start_date
              ? new Date(m.start_date)
              : new Date(m.created_at || now.toISOString());
            const end = now;
            const days = Math.max(
              0,
              Math.ceil((end.getTime() - start.getTime()) / msPerDay),
            );
            const cur = map.get(name) ?? {
              curTotal: 0,
              curCount: 0,
              pastTotal: 0,
              pastCount: 0,
            };
            cur.curTotal += days;
            cur.curCount += 1;
            map.set(name, cur);
          });

          (pastMeds || []).forEach((m: any) => {
            const name = (m.medication_name || "Unknown").toString();
            const start = m.start_date
              ? new Date(m.start_date)
              : new Date(m.created_at || now.toISOString());
            const end = m.end_date
              ? new Date(m.end_date)
              : new Date(m.updated_at || now.toISOString());
            const days = Math.max(
              0,
              Math.ceil((end.getTime() - start.getTime()) / msPerDay),
            );
            const cur = map.get(name) ?? {
              curTotal: 0,
              curCount: 0,
              pastTotal: 0,
              pastCount: 0,
            };
            cur.pastTotal += days;
            cur.pastCount += 1;
            map.set(name, cur);
          });

          const arr: Array<{
            name: string;
            avgCurrent?: number;
            avgPast?: number;
          }> = [];
          for (const [name, v] of map.entries()) {
            arr.push({
              name,
              avgCurrent: v.curCount
                ? Math.round(v.curTotal / v.curCount)
                : undefined,
              avgPast: v.pastCount
                ? Math.round(v.pastTotal / v.pastCount)
                : undefined,
            });
          }

          // sort by combined presence and take top 12
          arr.sort(
            (a, b) =>
              (b.avgCurrent || 0) +
              (b.avgPast || 0) -
              ((a.avgCurrent || 0) + (a.avgPast || 0)),
          );
          setMedDurations(arr.slice(0, 12));
        } catch (err) {
          // ignore med load errors

          console.error("Failed loading medications for visualizer:", err);
        }
      } catch (error) {
        console.error("Failed to load visualizer data:", error);
        setApiError(t("services", "noAvailableData", "No available data."));
        setSummary({ appointments: 0, reports: 0 });
        setMonthlyData([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [t, user?.id]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-6 shadow-md">
        <div>
          <h2 className="text-5xl font-bold">
            {t("navbar", "visualizer", "Visualizer")}
          </h2>
        </div>
        <img
          src={visualizerImg}
          alt={t("navbar", "visualizer", "Visualizer")}
          className="h-70 w-70"
          loading="lazy"
        />
      </div>

      <div className="bg-white dark:bg-black min-h-screen px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {isLoading && (
            <div className="rounded-2xl border border-[#0B3C5D] bg-[#F7FAFC] px-4 py-3 text-sm text-[#0B3C5D] dark:border-white dark:bg-white/5 dark:text-white">
              {t("auth", "loading", "Loading...")}
            </div>
          )}

          {apiError && (
            <div className="rounded-2xl border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
              {apiError}
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <p className="text-sm text-[#6B7280] dark:text-gray-300">
                Total Appointments
              </p>
              <p className="text-2xl font-bold text-[#0B3C5D] dark:text-white">
                {summary.appointments}
              </p>
            </div>
            <div className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <p className="text-sm text-[#6B7280] dark:text-gray-300">
                Total Reports
              </p>
              <p className="text-2xl font-bold text-[#0B3C5D] dark:text-white">
                {summary.reports}
              </p>
            </div>
          </div>

          {/* Medication Durations (Salts) */}
          {medDurations.length > 0 && (
            <div className="rounded-2xl border-2 border-[#0B3C5D] bg-white dark:bg-black p-6">
              <h3 className="text-xl font-semibold text-[#0B3C5D] dark:text-white mb-4">
                Medication Duration (days) — Current vs Past
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={medDurations} margin={{ left: 0, right: 20 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#475569" : "#CBD5E1"}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={darkMode ? "#E5E7EB" : "#0B3C5D"}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke={darkMode ? "#E5E7EB" : "#0B3C5D"} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="avgCurrent"
                    name="Avg Current (days)"
                    fill="#10B981"
                  />
                  <Bar
                    dataKey="avgPast"
                    name="Avg Past (days)"
                    fill="#06B6D4"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl border-2 border-[#0B3C5D] bg-white dark:bg-black p-6">
              <h3 className="text-xl font-semibold text-[#0B3C5D] dark:text-white mb-4">
                Appointments Over Time
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#475569" : "#CBD5E1"}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={darkMode ? "#E5E7EB" : "#0B3C5D"}
                  />
                  <YAxis stroke={darkMode ? "#E5E7EB" : "#0B3C5D"} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? "#111827" : "#ffffff",
                      borderRadius: "12px",
                      border: "1px solid #0B3C5D",
                      color: darkMode ? "#F9FAFB" : "#111827",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="appointments"
                    name="Appointments"
                    fill="#0B3C5D"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl border-2 border-[#0B3C5D] bg-white dark:bg-black p-6">
              <h3 className="text-xl font-semibold text-[#0B3C5D] dark:text-white mb-4">
                Test Reports Uploaded
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={darkMode ? "#475569" : "#CBD5E1"}
                  />
                  <XAxis
                    dataKey="month"
                    stroke={darkMode ? "#E5E7EB" : "#0B3C5D"}
                  />
                  <YAxis stroke={darkMode ? "#E5E7EB" : "#0B3C5D"} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="reports"
                    name="Uploaded Reports"
                    fill="#38BDF8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;

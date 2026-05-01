import { useEffect, useMemo, useState } from "react";
import adminImg from "/medirator_images/admin.png";
import { adminApi } from "../../../api/adminApi";

interface AdminHomePageProps {
  darkMode?: boolean;
}

interface AdminDoctorSnapshot {
  id: string;
  name: string;
  specialization: string;
  status: "Active" | "Suspended";
}

interface AdminPatientSnapshot {
  id: string;
  name: string;
  status: "Active" | "Inactive";
}

const AdminHomePage = ({ darkMode = false }: AdminHomePageProps) => {
  const [metrics, setMetrics] = useState<{ total_users: number; total_appointments: number; active_doctors: number } | null>(null);
  const [insights, setInsights] = useState<Record<string, number>>({});
  const [doctors, setDoctors] = useState<AdminDoctorSnapshot[]>([]);
  const [patients, setPatients] = useState<AdminPatientSnapshot[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<{
    recent_activity: string[];
    alerts: string[];
    totals: { total_doctors: number; total_patients: number; total_appointments: number; active_doctors: number };
  } | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const [metricsResp, insightsResp, doctorResp, patientResp, analyticsResp] = await Promise.allSettled([
        adminApi.metrics(),
        adminApi.insights(),
        adminApi.listDoctors(),
        adminApi.listPatients(),
        adminApi.analytics(),
      ]);

      const resolvedMetrics = metricsResp.status === "fulfilled" ? metricsResp.value : null;
      const resolvedInsights = insightsResp.status === "fulfilled" ? insightsResp.value : {};
      const resolvedDoctors = doctorResp.status === "fulfilled" && Array.isArray(doctorResp.value) ? doctorResp.value : [];
      const resolvedPatients = patientResp.status === "fulfilled" && Array.isArray(patientResp.value) ? patientResp.value : [];
      const resolvedAnalytics = analyticsResp.status === "fulfilled" ? analyticsResp.value : null;

      setMetrics(resolvedMetrics);
      setInsights(resolvedInsights);
      setDoctors(resolvedDoctors);
      setPatients(resolvedPatients);
      setAnalytics(resolvedAnalytics);

      const hasAnyData =
        Boolean(resolvedMetrics) ||
        resolvedDoctors.length > 0 ||
        resolvedPatients.length > 0 ||
        Boolean(resolvedAnalytics) ||
        Object.keys(resolvedInsights).length > 0;

      if (!hasAnyData) {
        setApiError("No available data.");
        return;
      }
      setApiError(null);
    };

    void loadDashboard();
  }, []);

  const overviewCards = useMemo(
    () => [
      {
        label: "Total Doctors",
        value: String(
          analytics?.totals.total_doctors ??
            (doctors.length || metrics?.active_doctors || 0),
        ),
      },
      {
        label: "Total Patients",
        value: String(
          analytics?.totals.total_patients ??
            (patients.length || (metrics ? Math.max(0, metrics.total_users - metrics.active_doctors) : 0)),
        ),
      },
      {
        label: "Appointments",
        value: String(analytics?.totals.total_appointments ?? metrics?.total_appointments ?? 0),
      },
      { label: "Active AI Models", value: String(insights.active_models ?? 0) },
    ],
    [analytics, doctors.length, insights.active_models, metrics, patients.length],
  );

  const recentActivity = analytics?.recent_activity ?? [];
  const alerts = analytics?.alerts ?? [];

  const systemRunning = true;

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">Admin Dashboard</h2>
        </div>
        <img src={adminImg} alt="Admin Dashboard" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="dark:bg-black px-3 md:px-6 py-6 space-y-4 font-sans">
        {apiError && (
          <div className="rounded-2xl border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
            {apiError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {overviewCards.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black p-4 shadow text-black dark:text-white"
            >
              <div className="text-xs text-gray-500 dark:text-gray-400">{item.label}</div>
              <div className="mt-2 text-2xl font-bold text-[#0B3C5D] dark:text-white">{item.value}</div>
            </div>
          ))}

          <div className="rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black p-4 shadow text-black dark:text-white">
            <div className="text-xs text-gray-500 dark:text-gray-400">System Status</div>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#0B3C5D] px-3 py-1 text-sm">
              <span>{systemRunning ? "🟢" : "🔴"}</span>
              <span className="font-semibold">{systemRunning ? "Running" : "Issues"}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Recent Activity</h3>
            <ul className="mt-4 space-y-2">
              {recentActivity.map((activity) => (
                <li key={activity} className="rounded-2xl border border-[#0B3C5D] p-3 text-sm text-black dark:text-white">
                  {activity}
                </li>
              ))}
              {recentActivity.length === 0 && (
                <li className="rounded-2xl border border-[#0B3C5D] p-3 text-sm text-black dark:text-white">
                  No recent activity yet.
                </li>
              )}
            </ul>
          </section>

          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Alerts</h3>
            <ul className="mt-4 space-y-2">
              {alerts.map((alert) => (
                <li
                  key={alert}
                  className="rounded-2xl border border-red-500 bg-red-50 dark:bg-red-950/20 p-3 text-sm text-red-700 dark:text-red-300"
                >
                  {alert}
                </li>
              ))}
              {alerts.length === 0 && (
                <li className="rounded-2xl border border-[#0B3C5D] p-3 text-sm text-black dark:text-white">No alerts.</li>
              )}
            </ul>
          </section>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">All Doctors</h3>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-[#0B3C5D]">
              <table className="w-full min-w-[520px] text-sm text-black dark:text-white">
                <thead className="bg-[#0B3C5D] text-white">
                  <tr>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Specialization</th>
                    <th className="text-left px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doctor) => (
                    <tr key={doctor.id} className="border-t border-[#0B3C5D]/40">
                      <td className="px-4 py-3">{doctor.name}</td>
                      <td className="px-4 py-3">{doctor.specialization}</td>
                      <td className="px-4 py-3">{doctor.status}</td>
                    </tr>
                  ))}
                  {!doctors.length ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                        No doctors available.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">All Patients</h3>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-[#0B3C5D]">
              <table className="w-full min-w-[520px] text-sm text-black dark:text-white">
                <thead className="bg-[#0B3C5D] text-white">
                  <tr>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-left px-4 py-3">Patient ID</th>
                    <th className="text-left px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} className="border-t border-[#0B3C5D]/40">
                      <td className="px-4 py-3">{patient.name}</td>
                      <td className="px-4 py-3">{patient.id}</td>
                      <td className="px-4 py-3">{patient.status}</td>
                    </tr>
                  ))}
                  {!patients.length ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center text-gray-500">
                        No patients available.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;

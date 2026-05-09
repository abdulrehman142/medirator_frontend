import { useEffect, useMemo, useState } from "react";
import dashboardImg from "/medirator_images/dashboard.png";
import { adminApi } from "../../../api/adminApi";
import type { DashboardMetrics } from "../../../api/adminApi";
import { useLanguage } from "../../../context/LanguageContext";

interface SystemAnalyticsPageProps {
  darkMode?: boolean;
}

const SystemAnalyticsPage = ({
  darkMode = false,
}: SystemAnalyticsPageProps) => {
  const { t } = useLanguage();
  const [apiError, setApiError] = useState<string | null>(null);
  const [dashboardMetrics, setDashboardMetrics] =
    useState<DashboardMetrics | null>(null);
  const [analytics, setAnalytics] = useState<{
    totals: {
      total_doctors: number;
      total_patients: number;
      total_appointments: number;
      total_completed_appointments?: number;
      active_doctors: number;
    };
    patient_growth: Array<{ label: string; value: number }>;
    appointment_trends: Array<{ label: string; value: number }>;
    completed_appointment_trends?: Array<{ label: string; value: number }>;
    most_active_doctors: Array<{
      doctor_id: string;
      name: string;
      completed_appointments: number;
    }>;
    peak_usage_times: Array<{ hour: number; label: string; count: number }>;
    recent_activity: string[];
  } | null>(null);

  const numberFormatter = useMemo(() => new Intl.NumberFormat(), []);
  const formatNumber = (value: number) => numberFormatter.format(value);

  useEffect(() => {
    const load = async () => {
      try {
        const [metrics, analyticsResp] = await Promise.all([
          adminApi.metrics(),
          adminApi.analytics(),
        ]);
        console.log("Analytics response:", analyticsResp);
        setDashboardMetrics(metrics);
        setAnalytics(analyticsResp);
        setApiError(null);
      } catch {
        setApiError(t("admin", "noAvailableData", "No available data."));
      }
    };

    void load();
  }, [t]);

  const analyticsData = useMemo(() => {
    if (!analytics) {
      return null;
    }

    const completedTrends = analytics.completed_appointment_trends || [];
    const completedValues = completedTrends.map(
      (item) => Number(item.value) || 0,
    );

    return {
      labels: analytics.patient_growth.map((item) => item.label),
      patientGrowth: analytics.patient_growth.map(
        (item) => Number(item.value) || 0,
      ),
      appointments: analytics.appointment_trends.map(
        (item) => Number(item.value) || 0,
      ),
      completedAppointments: completedValues,
      completedLabels: completedTrends.map((item) => item.label),
    };
  }, [analytics]);

  const mostActiveDoctors =
    analytics?.most_active_doctors?.map((doctor) => ({
      name: doctor.name,
      completedAppointments: doctor.completed_appointments,
    })) ?? [];

  const recentActivity = analytics?.recent_activity ?? [];

  const renderBars = (
    values: number[],
    colorClassName: string,
    labels?: string[],
  ) => {
    if (!values || values.length === 0 || !analyticsData) {
      return (
        <div className="flex h-full w-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
          {t("admin", "noAvailableData", "No available data.")}
        </div>
      );
    }

    const numericValues = values.map((v) => Number(v) || 0);
    const maxValue = Math.max(...numericValues, 1);
    const displayLabels = labels || analyticsData.labels;

    return numericValues.map((value, index) => {
      const heightPercent =
        isFinite(value) && isFinite(maxValue) ? (value / maxValue) * 100 : 0;
      return (
        <div
          key={`${value}-${index}`}
          className="flex-1 flex flex-col items-center justify-end h-full gap-2"
        >
          <div className="w-full max-w-10 h-full flex items-end rounded-t-md border border-[#0B3C5D]/30 overflow-hidden">
            <div
              className={`w-full ${colorClassName}`}
              style={{ height: `${Math.max(heightPercent, 0)}%` }}
            />
          </div>
          <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">
            {displayLabels[index] ?? ""}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">
            {t("admin", "systemAnalyticsTitle", "System Analytics")}
          </h2>
        </div>
        <img
          src={dashboardImg}
          alt={t("admin", "systemAnalyticsTitle", "System Analytics")}
          className="h-40 md:h-70 w-40 md:w-70"
          loading="lazy"
        />
      </div>

      <div className="dark:bg-black px-3 md:px-6 py-6 space-y-4 font-sans text-black dark:text-white">
        {apiError && (
          <div className="rounded-2xl border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
            {apiError}
          </div>
        )}

        {dashboardMetrics && analytics && (
          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">
              {t("admin", "liveSnapshot", "Live Snapshot")}
            </h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl border border-[#0B3C5D] p-4 bg-[#f8fafc] dark:bg-[#0b1221]">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t("admin", "totalUsers", "Total users")}
                </div>
                <div className="mt-2 text-3xl font-bold text-[#0B3C5D] dark:text-white">
                  {formatNumber(dashboardMetrics.total_users)}
                </div>
              </div>
              <div className="rounded-2xl border border-[#0B3C5D] p-4 bg-[#f8fafc] dark:bg-[#0b1221]">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t("admin", "totalAppointments", "Total appointments")}
                </div>
                <div className="mt-2 text-3xl font-bold text-[#0B3C5D] dark:text-white">
                  {formatNumber(dashboardMetrics.total_appointments)}
                </div>
              </div>
              <div className="rounded-2xl border border-[#0B3C5D] p-4 bg-[#f8fafc] dark:bg-[#0b1221]">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t("admin", "activeDoctors", "Active doctors")}
                </div>
                <div className="mt-2 text-3xl font-bold text-[#0B3C5D] dark:text-white">
                  {formatNumber(dashboardMetrics.active_doctors)}
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl border border-[#0B3C5D] p-4 bg-[#f8fafc] dark:bg-[#0b1221]">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t("admin", "totalDoctors", "Total doctors")}
                </div>
                <div className="mt-2 text-3xl font-bold text-[#0B3C5D] dark:text-white">
                  {formatNumber(analytics.totals.total_doctors)}
                </div>
              </div>
              <div className="rounded-2xl border border-[#0B3C5D] p-4 bg-[#f8fafc] dark:bg-[#0b1221]">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t("admin", "totalPatients", "Total patients")}
                </div>
                <div className="mt-2 text-3xl font-bold text-[#0B3C5D] dark:text-white">
                  {formatNumber(analytics.totals.total_patients)}
                </div>
              </div>
              <div className="rounded-2xl border border-[#0B3C5D] p-4 bg-[#f8fafc] dark:bg-[#0b1221]">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t(
                    "admin",
                    "completedAppointments",
                    "Completed appointments",
                  )}
                </div>
                <div className="mt-2 text-3xl font-bold text-[#0B3C5D] dark:text-white">
                  {formatNumber(
                    analytics.totals.total_completed_appointments || 0,
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">
                {t("admin", "patientGrowth", "Patient Growth")}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("admin", "recent7Days", "Last 7 days")}
              </span>
            </div>
            <div className="mt-4 h-44 flex items-end gap-2">
              {analyticsData ? (
                renderBars(analyticsData.patientGrowth, "bg-[#0B3C5D]")
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t("admin", "noAvailableData", "No available data.")}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">
                {t("admin", "appointmentTrends", "Appointments Registered")}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t("admin", "recent7Days", "Last 7 days")}
              </span>
            </div>
            <div className="mt-4 h-44 flex items-end gap-2">
              {analyticsData ? (
                renderBars(analyticsData.appointments, "bg-green-600")
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t("admin", "noAvailableData", "No available data.")}
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 'Appointments Completed' graph removed per request; showing other analytics instead. */}

          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">
              {t("admin", "mostActiveDoctors", "Most Active Doctors")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {mostActiveDoctors.map((doctor) => (
                <li
                  key={doctor.name}
                  className="rounded-2xl border border-[#0B3C5D] p-3 flex items-center justify-between"
                >
                  <span>{doctor.name}</span>
                  <span>
                    {doctor.completedAppointments}{" "}
                    {t("admin", "appointmentsLabel", "appointments")}
                  </span>
                </li>
              ))}
              {mostActiveDoctors.length === 0 && (
                <li className="rounded-2xl border border-[#0B3C5D] p-3">
                  {t("admin", "noDoctorActivityYet", "No doctor activity yet.")}
                </li>
              )}
            </ul>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">
              {t("admin", "recentActivity", "Recent Activity")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {recentActivity.map((activity, index) => (
                <li
                  key={index}
                  className="rounded-2xl border border-[#0B3C5D] p-3"
                >
                  {activity}
                </li>
              ))}
              {recentActivity.length === 0 && (
                <li className="rounded-2xl border border-[#0B3C5D] p-3">
                  {t("admin", "noAvailableData", "No available data.")}
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalyticsPage;

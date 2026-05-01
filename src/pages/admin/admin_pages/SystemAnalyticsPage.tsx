import { useEffect, useMemo, useState } from "react";
import dashboardImg from "/medirator_images/dashboard.png";
import { adminApi } from "../../../api/adminApi";
import { useLanguage } from "../../../context/LanguageContext";

interface SystemAnalyticsPageProps {
  darkMode?: boolean;
}

type AnalyticsFilter = "daily" | "weekly" | "monthly";

const SystemAnalyticsPage = ({ darkMode = false }: SystemAnalyticsPageProps) => {
  const { t } = useLanguage();
  const [analyticsFilter, setAnalyticsFilter] = useState<AnalyticsFilter>("weekly");
  const [apiError, setApiError] = useState<string | null>(null);
  const [metricSnapshot, setMetricSnapshot] = useState<{ totalUsers: number; totalAppointments: number; activeDoctors: number } | null>(null);
  const [analytics, setAnalytics] = useState<{
    patient_growth: Array<{ label: string; value: number }>;
    appointment_trends: Array<{ label: string; value: number }>;
    most_active_doctors: Array<{ name: string; completed_appointments: number }>;
    peak_usage_times: Array<{ label: string; count: number }>;
    totals: { total_doctors: number; total_patients: number; total_appointments: number; active_doctors: number };
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [metrics, analyticsResp] = await Promise.all([adminApi.metrics(), adminApi.analytics()]);
        setMetricSnapshot({
          totalUsers: analyticsResp.totals.total_doctors + analyticsResp.totals.total_patients,
          totalAppointments: metrics.total_appointments,
          activeDoctors: metrics.active_doctors,
        });
        setAnalytics(analyticsResp);
        setApiError(null);
      } catch {
        setApiError(t("admin", "noAvailableData", "No available data."));
      }
    };

    void load();
  }, [t]);

  const analyticsData = useMemo(() => {
    if (analytics?.patient_growth?.length && analytics?.appointment_trends?.length) {
      return {
        labels: analytics.patient_growth.map((item) => item.label),
        patientGrowth: analytics.patient_growth.map((item) => item.value),
        appointments: analytics.appointment_trends.map((item) => item.value),
        aiUsage: analytics.appointment_trends.map((item) => item.value),
      };
    }
    return {
      labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
      patientGrowth: [42, 48, 50, 56, 58, 62],
      appointments: [420, 446, 470, 498, 520, 544],
      aiUsage: [210, 224, 236, 248, 260, 273],
    };
  }, [analytics]);

  const mostActiveDoctors =
    analytics?.most_active_doctors?.map((doctor) => ({
      name: doctor.name,
      completedAppointments: doctor.completed_appointments,
    })) ?? [];

  const peakUsageTimes = analytics?.peak_usage_times?.map((slot) => `${slot.label} (${slot.count})`) ?? [];

  const renderBars = (values: number[], colorClassName: string) => {
    const maxValue = Math.max(...values);

    return values.map((value, index) => (
      <div key={`${value}-${index}`} className="flex-1 flex flex-col items-center justify-end h-full gap-2">
        <div className="w-full max-w-10 h-full flex items-end rounded-t-md border border-[#0B3C5D]/30 overflow-hidden">
          <div className={`w-full ${colorClassName}`} style={{ height: `${(value / maxValue) * 100}%` }} />
        </div>
        <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">{analyticsData.labels[index]}</div>
      </div>
    ));
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">
            {t("admin", "systemAnalyticsTitle", "System Analytics")}
          </h2>
        </div>
        <img src={dashboardImg} alt={t("admin", "systemAnalyticsTitle", "System Analytics")} className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="dark:bg-black px-3 md:px-6 py-6 space-y-4 font-sans text-black dark:text-white">
        {apiError && (
          <div className="rounded-2xl border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
            {apiError}
          </div>
        )}

        {metricSnapshot && (
          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">{t("admin", "liveSnapshot", "Live Snapshot")}</h3>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl border border-[#0B3C5D] p-3">
                {t("admin", "totalUsers", "Total users")} : {metricSnapshot.totalUsers}
              </div>
              <div className="rounded-2xl border border-[#0B3C5D] p-3">
                {t("admin", "totalAppointments", "Total appointments")} : {metricSnapshot.totalAppointments}
              </div>
              <div className="rounded-2xl border border-[#0B3C5D] p-3">
                {t("admin", "activeDoctors", "Active doctors")} : {metricSnapshot.activeDoctors}
              </div>
            </div>
          </section>
        )}

        <div className="flex justify-center items-center">
          <div className="inline-flex flex-wrap justify-center gap-2 rounded-full border border-[#0B3C5D]/30 bg-white/90 dark:bg-black/80 p-2 shadow-md">
            {(["daily", "weekly", "monthly"] as AnalyticsFilter[]).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setAnalyticsFilter(filter)}
                className={`rounded-full border px-6 py-2 text-sm transition-all duration-300 ${
                  analyticsFilter === filter
                    ? "bg-[#0B3C5D] border-[#0B3C5D] text-white"
                    : "bg-white border-[#0B3C5D] text-black dark:bg-black dark:text-white hover:bg-[#0B3C5D] hover:text-white"
                }`}
              >
                {t("admin", filter, filter[0].toUpperCase() + filter.slice(1))}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">{t("admin", "patientGrowth", "Patient Growth")}</h3>
            <div className="mt-4 h-44 flex items-end gap-2">{renderBars(analyticsData.patientGrowth, "bg-[#0B3C5D]")}</div>
          </section>

          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">{t("admin", "appointmentTrends", "Appointment Trends")}</h3>
            <div className="mt-4 h-44 flex items-end gap-2">{renderBars(analyticsData.appointments, "bg-green-600")}</div>
          </section>

          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">{t("admin", "aiUsageStats", "AI Usage Stats")}</h3>
            <div className="mt-4 h-44 flex items-end gap-2">{renderBars(analyticsData.aiUsage, "bg-yellow-500")}</div>
          </section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">{t("admin", "mostActiveDoctors", "Most Active Doctors")}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {mostActiveDoctors.map((doctor) => (
                <li key={doctor.name} className="rounded-2xl border border-[#0B3C5D] p-3 flex items-center justify-between">
                  <span>{doctor.name}</span>
                  <span>
                    {doctor.completedAppointments} {t("admin", "appointmentsLabel", "appointments")}
                  </span>
                </li>
              ))}
              {mostActiveDoctors.length === 0 && (
                <li className="rounded-2xl border border-[#0B3C5D] p-3">{t("admin", "noDoctorActivityYet", "No doctor activity yet.")}</li>
              )}
            </ul>
          </section>

          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">{t("admin", "peakSystemUsageTimes", "Peak System Usage Times")}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {peakUsageTimes.map((slot) => (
                <li key={slot} className="rounded-2xl border border-[#0B3C5D] p-3">
                  {slot}
                </li>
              ))}
              {peakUsageTimes.length === 0 && (
                <li className="rounded-2xl border border-[#0B3C5D] p-3">{t("admin", "noPeakUsageDataYet", "No peak usage data yet.")}</li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalyticsPage;

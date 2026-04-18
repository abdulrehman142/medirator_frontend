import { useMemo, useState } from "react";
import dashboardImg from "/medirator_images/dashboard.png";

interface SystemAnalyticsPageProps {
  darkMode?: boolean;
}

type AnalyticsFilter = "daily" | "weekly" | "monthly";

const SystemAnalyticsPage = ({ darkMode = false }: SystemAnalyticsPageProps) => {
  const [analyticsFilter, setAnalyticsFilter] = useState<AnalyticsFilter>("weekly");

  const analyticsData = useMemo(() => {
    if (analyticsFilter === "daily") {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        patientGrowth: [16, 20, 18, 24, 21, 26, 22],
        appointments: [110, 128, 120, 142, 138, 150, 132],
        aiUsage: [68, 72, 70, 75, 77, 79, 76],
      };
    }

    if (analyticsFilter === "monthly") {
      return {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        patientGrowth: [180, 194, 210, 225, 232, 246],
        appointments: [1800, 1920, 2050, 2140, 2230, 2360],
        aiUsage: [900, 980, 1040, 1110, 1185, 1230],
      };
    }

    return {
      labels: ["W1", "W2", "W3", "W4", "W5", "W6"],
      patientGrowth: [42, 48, 50, 56, 58, 62],
      appointments: [420, 446, 470, 498, 520, 544],
      aiUsage: [210, 224, 236, 248, 260, 273],
    };
  }, [analyticsFilter]);

  const mostActiveDoctors = [
    { name: "Dr. Sana Ahmed", completedAppointments: 86 },
    { name: "Dr. Ali Raza", completedAppointments: 79 },
    { name: "Dr. Areeba Khan", completedAppointments: 74 },
  ];

  const peakUsageTimes = ["09:00 - 11:00", "13:00 - 15:00", "19:00 - 21:00"];

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
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">System Analytics</h2>
          <p className="text-sm md:text-base text-center md:text-left ml-0 md:ml-5 md:pl-5 mt-2 text-gray-200">
            Big-picture insights across growth, appointments, and AI engagement.
          </p>
        </div>
        <img src={dashboardImg} alt="System Analytics" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="dark:bg-black px-3 md:px-6 py-6 space-y-4 font-sans text-black dark:text-white">
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
                {filter[0].toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">Patient Growth</h3>
            <div className="mt-4 h-44 flex items-end gap-2">{renderBars(analyticsData.patientGrowth, "bg-[#0B3C5D]")}</div>
          </section>

          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">Appointment Trends</h3>
            <div className="mt-4 h-44 flex items-end gap-2">{renderBars(analyticsData.appointments, "bg-green-600")}</div>
          </section>

          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">AI Usage Stats</h3>
            <div className="mt-4 h-44 flex items-end gap-2">{renderBars(analyticsData.aiUsage, "bg-yellow-500")}</div>
          </section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">Most Active Doctors</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {mostActiveDoctors.map((doctor) => (
                <li key={doctor.name} className="rounded-2xl border border-[#0B3C5D] p-3 flex items-center justify-between">
                  <span>{doctor.name}</span>
                  <span>{doctor.completedAppointments} appointments</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">Peak System Usage Times</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {peakUsageTimes.map((slot) => (
                <li key={slot} className="rounded-2xl border border-[#0B3C5D] p-3">
                  {slot}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SystemAnalyticsPage;

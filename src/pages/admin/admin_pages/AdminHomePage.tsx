import adminImg from "/medirator_images/admin.png";

interface AdminHomePageProps {
  darkMode?: boolean;
}

const AdminHomePage = ({ darkMode = false }: AdminHomePageProps) => {
  const overviewCards = [
    { label: "Total Doctors", value: "128" },
    { label: "Total Patients", value: "2,540" },
    { label: "Appointments Today", value: "186" },
    { label: "Active AI Models", value: "4" },
  ];

  const recentActivity = [
    "12 new patient accounts registered in the last 2 hours.",
    "18 test reports were generated and linked to patient records.",
    "Dr. Sana Ahmed profile verified and activated.",
    "AI model v3.4 drift check completed successfully.",
  ];

  const alerts = [
    "3 failed admin login attempts from unusual IP range.",
    "Report approval queue has 24 pending submissions.",
    "High memory usage detected on analytics worker node.",
  ];

  const systemRunning = true;

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">Admin Dashboard</h2>
          <p className="text-sm md:text-base text-center md:text-left ml-0 md:ml-5 md:pl-5 mt-2 text-gray-200">
            Central overview of system operations, activity, and critical alerts.
          </p>
        </div>
        <img src={adminImg} alt="Admin Dashboard" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="dark:bg-black px-3 md:px-6 py-6 space-y-4 font-sans">
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
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;

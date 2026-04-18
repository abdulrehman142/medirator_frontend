import { useState } from "react";
import dataSecurityImg from "/medirator_images/datasecurity.png";

interface SecurityMonitoringPageProps {
  darkMode?: boolean;
}

interface SecurityLog {
  id: string;
  user: string;
  role: string;
  status: "Success" | "Failed";
  ip: string;
  time: string;
}

const SecurityMonitoringPage = ({ darkMode = false }: SecurityMonitoringPageProps) => {
  const [logs, setLogs] = useState<SecurityLog[]>([
    { id: "LG-1", user: "admin@medirator.com", role: "Admin", status: "Success", ip: "10.0.1.20", time: "09:14" },
    { id: "LG-2", user: "dr.sana@medirator.com", role: "Doctor", status: "Success", ip: "10.0.3.41", time: "09:28" },
    { id: "LG-3", user: "unknown.user", role: "Unknown", status: "Failed", ip: "221.14.91.2", time: "09:34" },
    { id: "LG-4", user: "admin@medirator.com", role: "Admin", status: "Failed", ip: "221.14.91.2", time: "09:35" },
  ]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  const suspiciousAlerts = [
    "Repeated failed logins from IP 221.14.91.2",
    "Access attempt to restricted endpoint without token",
    "Multiple password reset requests for same account",
  ];

  const failedAttempts = logs.filter((log) => log.status === "Failed").length;

  const blockUser = (user: string) => {
    if (blockedUsers.includes(user)) {
      return;
    }

    setBlockedUsers((current) => [...current, user]);
  };

  const resetPassword = (user: string) => {
    setLogs((current) => [
      {
        id: `LG-${current.length + 1}`,
        user,
        role: "System",
        status: "Success",
        ip: "Internal",
        time: "Now",
      },
      ...current,
    ]);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">Security Monitoring</h2>
          <p className="text-sm md:text-base text-center md:text-left ml-0 md:ml-5 md:pl-5 mt-2 text-gray-200">
            Track login activity, suspicious behavior, failed access, and account safety controls.
          </p>
        </div>
        <img src={dataSecurityImg} alt="Security Monitoring" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="dark:bg-black px-3 md:px-6 py-6 space-y-4 font-sans text-black dark:text-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black p-4">
            <div className="text-xs text-gray-500 dark:text-gray-400">Failed Login Attempts</div>
            <div className="mt-2 text-2xl font-bold text-[#0B3C5D] dark:text-white">{failedAttempts}</div>
          </div>
          <div className="rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black p-4">
            <div className="text-xs text-gray-500 dark:text-gray-400">Suspicious Alerts</div>
            <div className="mt-2 text-2xl font-bold text-[#0B3C5D] dark:text-white">{suspiciousAlerts.length}</div>
          </div>
          <div className="rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black p-4">
            <div className="text-xs text-gray-500 dark:text-gray-400">Blocked Users</div>
            <div className="mt-2 text-2xl font-bold text-[#0B3C5D] dark:text-white">{blockedUsers.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Login Activity Logs</h3>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-[#0B3C5D]">
              <table className="w-full min-w-[620px] text-sm">
                <thead className="bg-[#0B3C5D] text-white">
                  <tr>
                    <th className="text-left px-4 py-3">User</th>
                    <th className="text-left px-4 py-3">Role</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">IP</th>
                    <th className="text-left px-4 py-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-t border-[#0B3C5D]/40">
                      <td className="px-4 py-3">{log.user}</td>
                      <td className="px-4 py-3">{log.role}</td>
                      <td className="px-4 py-3">{log.status}</td>
                      <td className="px-4 py-3">{log.ip}</td>
                      <td className="px-4 py-3">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Suspicious Activity Alerts</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {suspiciousAlerts.map((alert) => (
                <li key={alert} className="rounded-2xl border border-red-500 bg-red-50 dark:bg-red-950/20 p-3 text-red-700 dark:text-red-300">
                  {alert}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Account Actions</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {logs.map((log) => (
              <div key={`action-${log.id}`} className="rounded-2xl border border-[#0B3C5D] p-3 text-sm">
                <div className="font-semibold">{log.user}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => blockUser(log.user)}
                    className="rounded-2xl border border-red-600 text-red-600 px-3 py-1.5"
                    disabled={blockedUsers.includes(log.user)}
                  >
                    {blockedUsers.includes(log.user) ? "Blocked" : "Block User"}
                  </button>
                  <button
                    type="button"
                    onClick={() => resetPassword(log.user)}
                    className="rounded-2xl border border-[#0B3C5D] px-3 py-1.5"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SecurityMonitoringPage;

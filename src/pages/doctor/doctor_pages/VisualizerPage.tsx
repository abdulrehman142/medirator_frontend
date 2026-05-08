import { useEffect, useMemo, useState } from "react";

import dashboardImg from "/medirator_images/dashboard.png";

import { appointmentsApi } from "../../../api/appointmentsApi";
import { toPatientDisplayId } from "../../../utils/idDisplay";

interface VisualizerPageProps {
  darkMode?: boolean;
}

interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  reason: string;
  scheduled_for: string;
  status: "scheduled" | "rescheduled" | "canceled" | "completed";
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

const VisualizerPage = ({ darkMode = false }: VisualizerPageProps) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const metrics = useMemo(() => {
    const totalAppointments = appointments.length;
    const uniquePatients = new Set(appointments.map(a => a.patient_id)).size;
    const completedAppointments = appointments.filter(a => a.status === 'completed').length;
    const pendingAppointments = appointments.filter(a => ['scheduled', 'rescheduled'].includes(a.status)).length;

    return {
      totalAppointments,
      uniquePatients,
      completedAppointments,
      pendingAppointments,
    };
  }, [appointments]);

  const appointmentTrends = useMemo(() => {
    const now = new Date();
    const months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        month: date.getMonth(),
        year: date.getFullYear(),
      });
    }

    const trends = months.map(({ label, month, year }) => {
      const count = appointments.filter(a => {
        const date = new Date(a.scheduled_for);
        return date.getMonth() === month && date.getFullYear() === year;
      }).length;
      return { label, count };
    });

    return trends;
  }, [appointments]);

  const recentAppointments = useMemo(() => {
    return appointments
      .sort((a, b) => new Date(b.scheduled_for).getTime() - new Date(a.scheduled_for).getTime())
      .slice(0, 5);
  }, [appointments]);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await appointmentsApi.list();
        setAppointments(data);
      } catch (error) {
        console.error('Failed to load appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    void loadAppointments();
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 md:p-6 shadow-md gap-4">
        <div className="flex-1">
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">
            Visualizer
          </h2>
        </div>
        <img src={dashboardImg} alt="Dashboard" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="dark:bg-black px-3 md:px-6 py-6 space-y-4 font-sans">
        {loading ? (
          <div className="text-center py-8">Loading dashboard data...</div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl p-4 text-center">
                <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">Total Appointments</h3>
                <p className="text-2xl font-bold text-[#0B3C5D] dark:text-white">{metrics.totalAppointments}</p>
              </div>
              <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl p-4 text-center">
                <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">Patients</h3>
                <p className="text-2xl font-bold text-[#0B3C5D] dark:text-white">{metrics.uniquePatients}</p>
              </div>
              <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl p-4 text-center">
                <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">Completed</h3>
                <p className="text-2xl font-bold text-[#0B3C5D] dark:text-white">{metrics.completedAppointments}</p>
              </div>
              <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl p-4 text-center">
                <h3 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">Pending</h3>
                <p className="text-2xl font-bold text-[#0B3C5D] dark:text-white">{metrics.pendingAppointments}</p>
              </div>
            </div>

            {/* Appointment Trends Chart */}
            <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl p-4">
              <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white mb-4">Appointment Trends (Last 6 Months)</h3>
              <div className="flex items-end gap-2 h-40">
                {appointmentTrends.map((trend) => {
                  const maxCount = Math.max(...appointmentTrends.map(t => t.count));
                  const barHeight = maxCount > 0 ? `${Math.max(14, (trend.count / maxCount) * 100)}%` : '14px';
                  return (
                    <div key={trend.label} className="flex-1 h-full flex flex-col justify-end items-center gap-2">
                      <div
                        className="w-full max-w-8 rounded-t-md bg-[#0B3C5D]"
                        style={{ height: barHeight }}
                        title={`${trend.label}: ${trend.count}`}
                      />
                      <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">{trend.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Appointments */}
            <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl p-4">
              <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white mb-4">Recent Appointments</h3>
              <div className="space-y-2">
                {recentAppointments.length > 0 ? (
                  recentAppointments.map((appointment) => (
                    <div key={appointment.id} className="border border-[#0B3C5D] rounded-2xl p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-[#0B3C5D] dark:text-white">{appointment.reason}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Patient: {toPatientDisplayId(appointment.patient_id)} | {new Date(appointment.scheduled_for).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No recent appointments</p>
                )}
              </div>
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default VisualizerPage;

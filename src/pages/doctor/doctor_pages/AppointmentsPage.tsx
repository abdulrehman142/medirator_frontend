import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import appointmentImg from "/medirator_images/appointment.png";

interface AppointmentsPageProps {
  darkMode?: boolean;
}

type AppointmentStatus = "Confirmed" | "Pending" | "Cancelled" | "Completed" | "Missed";
type AppointmentFilter = "today" | "week";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
}

const initialUpcomingAppointments: Appointment[] = [
  { id: "AP-101", patientName: "Ayesha Khan", date: "2026-04-18", time: "09:00 AM", status: "Confirmed" },
  { id: "AP-102", patientName: "Hassan Ali", date: "2026-04-18", time: "11:30 AM", status: "Pending" },
  { id: "AP-103", patientName: "Sara Iqbal", date: "2026-04-20", time: "03:00 PM", status: "Confirmed" },
  { id: "AP-104", patientName: "Bilal Hussain", date: "2026-04-22", time: "10:15 AM", status: "Pending" },
];

const initialPastAppointments: Appointment[] = [
  { id: "AP-091", patientName: "Zainab Fatima", date: "2026-04-12", time: "09:30 AM", status: "Completed" },
  { id: "AP-090", patientName: "Imran Shah", date: "2026-04-11", time: "01:00 PM", status: "Missed" },
  { id: "AP-089", patientName: "Maryam Noor", date: "2026-04-10", time: "02:45 PM", status: "Completed" },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const AppointmentsPage = ({ darkMode = false }: AppointmentsPageProps) => {
  const navigate = useNavigate();
  const [appointmentFilter, setAppointmentFilter] = useState<AppointmentFilter>("today");
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>(initialUpcomingAppointments);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>(initialPastAppointments);
  const [patientNameInput, setPatientNameInput] = useState("");
  const [dateInput, setDateInput] = useState("2026-04-18");
  const [timeInput, setTimeInput] = useState("09:00");
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);
  const [editDateInput, setEditDateInput] = useState("");
  const [editTimeInput, setEditTimeInput] = useState("");

  const filteredUpcomingAppointments = useMemo(() => {
    if (appointmentFilter === "today") {
      return upcomingAppointments.filter((appointment) => appointment.date === "2026-04-18");
    }

    return upcomingAppointments;
  }, [appointmentFilter, upcomingAppointments]);

  const statusBadgeClass = (status: AppointmentStatus) => {
    if (status === "Confirmed" || status === "Completed") {
      return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
    }

    if (status === "Pending") {
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
    }

    if (status === "Missed") {
      return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    }

    return "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200";
  };

  const formatTimeTo12Hour = (value: string) => {
    const [hourPart, minutePart] = value.split(":");
    const hour = Number(hourPart);
    const suffix = hour >= 12 ? "PM" : "AM";
    const normalizedHour = hour % 12 === 0 ? 12 : hour % 12;

    return `${normalizedHour}:${minutePart} ${suffix}`;
  };

  const handleScheduleAppointment = () => {
    const trimmedPatientName = patientNameInput.trim();

    if (!trimmedPatientName || !dateInput || !timeInput) {
      return;
    }

    const now = Date.now();
    const nextAppointment: Appointment = {
      id: `AP-${now}`,
      patientName: trimmedPatientName,
      date: dateInput,
      time: formatTimeTo12Hour(timeInput),
      status: "Pending",
    };

    setUpcomingAppointments((current) => [nextAppointment, ...current]);
    setPatientNameInput("");
    setTimeInput("09:00");
  };

  const handleReschedule = (appointmentId: string) => {
    const selectedAppointment = upcomingAppointments.find((appointment) => appointment.id === appointmentId);

    if (!selectedAppointment) {
      return;
    }

    setEditingAppointmentId(appointmentId);
    setEditDateInput(selectedAppointment.date);

    const [timeValue, suffix] = selectedAppointment.time.split(" ");
    const [hourPart, minutePart] = timeValue.split(":");
    const hour = Number(hourPart);
    const normalizedHour = suffix === "PM" && hour !== 12 ? hour + 12 : suffix === "AM" && hour === 12 ? 0 : hour;
    setEditTimeInput(`${String(normalizedHour).padStart(2, "0")}:${minutePart}`);
  };

  const handleSaveReschedule = (appointmentId: string) => {
    if (!editDateInput || !editTimeInput) {
      return;
    }

    setUpcomingAppointments((current) =>
      current.map((appointment) =>
        appointment.id === appointmentId
          ? {
              ...appointment,
              date: editDateInput,
              time: formatTimeTo12Hour(editTimeInput),
              status: "Pending",
            }
          : appointment,
      ),
    );

    setEditingAppointmentId(null);
    setEditDateInput("");
    setEditTimeInput("");
  };

  const handleCancelRescheduleEdit = () => {
    setEditingAppointmentId(null);
    setEditDateInput("");
    setEditTimeInput("");
  };

  const handleCancel = (appointmentId: string) => {
    setUpcomingAppointments((current) =>
      current.map((appointment) =>
        appointment.id === appointmentId
          ? {
              ...appointment,
              status: "Cancelled",
            }
          : appointment,
      ),
    );
  };

  const handleStartConsultation = (appointmentId: string) => {
    const selectedAppointment = upcomingAppointments.find((appointment) => appointment.id === appointmentId);

    if (!selectedAppointment) {
      return;
    }

    setUpcomingAppointments((current) => current.filter((appointment) => appointment.id !== appointmentId));
    setPastAppointments((current) => [{ ...selectedAppointment, status: "Completed" }, ...current]);
  };

  const handleOpenPatientProfile = (appointment: Appointment) => {
    navigate(`/doctor/pages/patient-management?patient=${encodeURIComponent(appointment.patientName)}`);
  };

  const calendarCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const appointment of upcomingAppointments) {
      const day = new Date(`${appointment.date}T00:00:00`).getDay();
      const dayIndex = day === 0 ? 6 : day - 1;
      const key = weekDays[dayIndex];
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return counts;
  }, [upcomingAppointments]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">
            Appointments
          </h2>
          <p className="text-sm md:text-base text-center md:text-left ml-0 md:ml-5 md:pl-5 mt-2 text-gray-200">
            Clear and manageable appointment board for upcoming and past consultations.
          </p>
        </div>
        <img src={appointmentImg} alt="Banner" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="dark:bg-black px-3 md:px-6 py-6 space-y-4 font-sans">
        <div className="flex justify-center items-center -mt-1 md:-mt-2">
          <div className="inline-flex flex-wrap justify-center gap-2 rounded-full border border-[#0B3C5D]/30 bg-white/90 dark:bg-black/80 p-2 shadow-md backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setAppointmentFilter("today")}
              className={`rounded-full border px-6 py-2 text-sm transition-all duration-300 ${
                appointmentFilter === "today"
                  ? "bg-[#0B3C5D] border-[#0B3C5D] text-white"
                  : "bg-white border-[#0B3C5D] text-black dark:bg-black dark:text-white hover:bg-[#0B3C5D] hover:text-white"
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setAppointmentFilter("week")}
              className={`rounded-full border px-6 py-2 text-sm transition-all duration-300 ${
                appointmentFilter === "week"
                  ? "bg-[#0B3C5D] border-[#0B3C5D] text-white"
                  : "bg-white border-[#0B3C5D] text-black dark:bg-black dark:text-white hover:bg-[#0B3C5D] hover:text-white"
              }`}
            >
              Week
            </button>
          </div>
        </div>

        <section className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl shadow p-4 md:p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Weekly Summary</h3>
          </div>
          <div className="mt-5 flex justify-center">
            <div className="w-full max-w-5xl rounded-2xl border border-[#0B3C5D]/30 bg-gradient-to-b from-white to-[#f8fbff] dark:from-black dark:to-[#07101a] p-4 md:p-6">
              <div className="flex items-end justify-between gap-2 h-56 md:h-64">
                {weekDays.map((day) => {
              const count = calendarCounts.get(day) ?? 0;
                  const fillHeight = `${Math.max(12, count * 30)}%`;

              return (
                    <div key={day} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
                      <div className="flex items-end justify-center h-full w-full max-w-12 rounded-t-2xl border border-[#0B3C5D]/20 bg-white/70 dark:bg-black/40 overflow-hidden">
                        <div
                          className={`w-full rounded-t-2xl ${count > 0 ? "bg-[#0B3C5D]" : "bg-gray-200 dark:bg-gray-700"}`}
                          style={{ height: fillHeight }}
                        />
                      </div>
                      <div className="text-sm font-semibold text-[#0B3C5D] dark:text-white">{day}</div>
                      <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">{count}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0B3C5D]" />
                  Scheduled appointments
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
                  No appointments
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl shadow p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Upcoming Appointments</h3>
            <div className="mt-4 space-y-3">
              {filteredUpcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-2xl border border-[#0B3C5D] p-3 bg-white dark:bg-black text-sm text-black dark:text-white"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold">{appointment.patientName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {appointment.date} • {appointment.time}
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {editingAppointmentId === appointment.id ? (
                      <div className="w-full rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black p-3 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="date"
                            value={editDateInput}
                            onChange={(event) => setEditDateInput(event.target.value)}
                            className="rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black px-3 py-2 text-sm text-black dark:text-white"
                          />
                          <input
                            type="time"
                            value={editTimeInput}
                            onChange={(event) => setEditTimeInput(event.target.value)}
                            className="rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black px-3 py-2 text-sm text-black dark:text-white"
                          />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="rounded-2xl border border-[#0B3C5D] bg-[#0B3C5D] text-white px-3 py-1.5 text-xs hover:opacity-90 transition-all duration-300"
                            onClick={() => handleSaveReschedule(appointment.id)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="rounded-2xl border border-[#0B3C5D] px-3 py-1.5 text-xs hover:bg-[#0B3C5D] hover:text-white transition-all duration-300"
                            onClick={handleCancelRescheduleEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="rounded-2xl border border-[#0B3C5D] px-3 py-1.5 text-xs hover:bg-[#0B3C5D] hover:text-white transition-all duration-300"
                        onClick={() => handleReschedule(appointment.id)}
                      >
                        Reschedule
                      </button>
                    )}
                    <button
                      type="button"
                      className="rounded-2xl border border-red-600 text-red-600 px-3 py-1.5 text-xs hover:bg-red-600 hover:text-white transition-all duration-300"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded-2xl border border-[#0B3C5D] bg-[#0B3C5D] text-white px-3 py-1.5 text-xs hover:opacity-90 transition-all duration-300"
                      onClick={() => handleStartConsultation(appointment.id)}
                    >
                      Start consultation
                    </button>
                    <button
                      type="button"
                      className="rounded-2xl border border-[#0B3C5D] px-3 py-1.5 text-xs hover:bg-[#0B3C5D] hover:text-white transition-all duration-300"
                      onClick={() => handleOpenPatientProfile(appointment)}
                    >
                      Open Patient Profile
                    </button>
                  </div>
                </div>
              ))}
              {filteredUpcomingAppointments.length === 0 && (
                <div className="rounded-2xl border border-[#0B3C5D] p-3 text-sm text-gray-500 dark:text-gray-400">
                  No appointments in this filter.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl shadow p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Past Appointments</h3>
            <div className="mt-4 space-y-3">
              {pastAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-2xl border border-[#0B3C5D] p-3 bg-white dark:bg-black text-sm text-black dark:text-white"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold">{appointment.patientName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {appointment.date} • {appointment.time}
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl shadow p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">➕ Schedule Appointment</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              value={patientNameInput}
              onChange={(event) => setPatientNameInput(event.target.value)}
              placeholder="Patient name"
              className="rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black px-3 py-2 text-sm text-black dark:text-white"
            />
            <input
              type="date"
              value={dateInput}
              onChange={(event) => setDateInput(event.target.value)}
              className="rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black px-3 py-2 text-sm text-black dark:text-white"
            />
            <input
              type="time"
              value={timeInput}
              onChange={(event) => setTimeInput(event.target.value)}
              className="rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black px-3 py-2 text-sm text-black dark:text-white"
            />
            <button
              type="button"
              onClick={handleScheduleAppointment}
              className="rounded-2xl border border-[#0B3C5D] bg-[#0B3C5D] text-white px-4 py-2 text-sm hover:opacity-90 transition-all duration-300"
            >
              Schedule appointment
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AppointmentsPage;

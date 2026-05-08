import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentsApi } from "../../../api/appointmentsApi";
import type { Appointment as ApiAppointment } from "../../../types/api";

import appointmentImg from "/medirator_images/appointment.png";
import { useDoctorPatient } from "../../../context/DoctorPatientContext";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";

interface AppointmentsPageProps {
  darkMode?: boolean;
}

type AppointmentStatus = "Confirmed" | "Pending" | "Cancelled" | "Completed" | "Missed";
type AppointmentFilter = "today" | "week";

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  patientDisplayId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
}

const initialUpcomingAppointments: Appointment[] = [];

const initialPastAppointments: Appointment[] = [];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const formatIsoToDate = (isoDateTime: string) => {
  const date = new Date(isoDateTime);
  return date.toISOString().slice(0, 10);
};

const formatIsoTo12Hour = (isoDateTime: string) => {
  const date = new Date(isoDateTime);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${normalizedHours}:${minutes} ${suffix}`;
};

const mapApiStatusToUiStatus = (status: ApiAppointment["status"]): AppointmentStatus => {
  if (status === "completed") {
    return "Completed";
  }

  if (status === "canceled") {
    return "Cancelled";
  }

  if (status === "rescheduled") {
    return "Pending";
  }

  return "Confirmed";
};

const mapApiAppointment = (appointment: ApiAppointment): Appointment => ({
  id: appointment.id,
  patientName: appointment.patient_id,
  patientId: appointment.patient_id,
  patientDisplayId: appointment.patient_id,
  date: formatIsoToDate(appointment.scheduled_for),
  time: formatIsoTo12Hour(appointment.scheduled_for),
  status: mapApiStatusToUiStatus(appointment.status),
});

const AppointmentsPage = ({ darkMode = false }: AppointmentsPageProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { patients } = useDoctorPatient();
  const todayDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [appointmentFilter, setAppointmentFilter] = useState<AppointmentFilter>("today");
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>(initialUpcomingAppointments);
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>(initialPastAppointments);
  const [apiError, setApiError] = useState<string | null>(null);
  const [patientIdInput, setPatientIdInput] = useState("");
  const [dateInput, setDateInput] = useState(todayDate);
  const [timeInput, setTimeInput] = useState("09:00");
  const [editingAppointmentId, setEditingAppointmentId] = useState<string | null>(null);
  const [editDateInput, setEditDateInput] = useState("");
  const [editTimeInput, setEditTimeInput] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const response = await appointmentsApi.list();

        if (response.length === 0) {
          return;
        }

        const mappedAppointments = response.map((apiAppointment) => {
          const mapped = mapApiAppointment(apiAppointment);
          const matchedPatient = patients.find((patient) => patient.id === apiAppointment.patient_id);
          return {
            ...mapped,
            patientName: matchedPatient?.name ?? mapped.patientName,
            patientDisplayId: matchedPatient?.displayId ?? mapped.patientDisplayId,
          };
        });
        const nextUpcoming = mappedAppointments.filter(
          (appointment) => appointment.status !== "Completed" && appointment.status !== "Cancelled",
        );
        const nextPast = mappedAppointments.filter(
          (appointment) => appointment.status === "Completed" || appointment.status === "Cancelled",
        );

        setUpcomingAppointments(nextUpcoming);
        setPastAppointments(nextPast);
        setApiError(null);
      } catch {
        setApiError("No available data.");
      }
    };

    void loadAppointments();
  }, [patients]);

  const filteredUpcomingAppointments = useMemo(() => {
    if (appointmentFilter === "today") {
      return upcomingAppointments.filter((appointment) => appointment.date === todayDate);
    }

    return upcomingAppointments;
  }, [appointmentFilter, upcomingAppointments, todayDate]);

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

  const handleScheduleAppointment = async () => {
    const selectedPatient = patients.find((patient) => patient.id === patientIdInput);

    if (!selectedPatient || !dateInput || !timeInput || !user?.id) {
      return;
    }

    try {
      await appointmentsApi.create({
        patient_id: selectedPatient.id,
        doctor_id: user.id,
        reason: "Doctor scheduled appointment",
        scheduled_for: `${dateInput}T${timeInput}:00`,
      });
      const response = await appointmentsApi.list();
      const mappedAppointments = response.map((apiAppointment) => {
        const mapped = mapApiAppointment(apiAppointment);
        const matchedPatient = patients.find((patient) => patient.id === apiAppointment.patient_id);
        return {
          ...mapped,
          patientName: matchedPatient?.name ?? mapped.patientName,
          patientDisplayId: matchedPatient?.displayId ?? mapped.patientDisplayId,
        };
      });
      setUpcomingAppointments(mappedAppointments.filter((appointment) => appointment.status !== "Completed" && appointment.status !== "Cancelled"));
      setPastAppointments(mappedAppointments.filter((appointment) => appointment.status === "Completed" || appointment.status === "Cancelled"));
      setPatientIdInput("");
      setTimeInput("09:00");
      setApiError(null);
    } catch {
      setApiError("Unable to schedule appointment on server.");
    }
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

  const handleSaveReschedule = async (appointmentId: string) => {
    if (!editDateInput || !editTimeInput) {
      return;
    }

    try {
      await appointmentsApi.update(appointmentId, {
        scheduled_for: `${editDateInput}T${editTimeInput}:00`,
        status: "rescheduled",
      });
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
      setApiError(null);
    } catch {
      setApiError("Unable to reschedule appointment.");
    }

    setEditingAppointmentId(null);
    setEditDateInput("");
    setEditTimeInput("");
  };

  const handleCancelRescheduleEdit = () => {
    setEditingAppointmentId(null);
    setEditDateInput("");
    setEditTimeInput("");
  };

  const handleCancel = async (appointmentId: string) => {
    try {
      await appointmentsApi.update(appointmentId, { status: "canceled" });
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
      setApiError(null);
    } catch {
      setApiError("Unable to cancel appointment.");
    }
  };

  const handleStartConsultation = async (appointmentId: string) => {
    const selectedAppointment = upcomingAppointments.find((appointment) => appointment.id === appointmentId);

    if (!selectedAppointment) {
      return;
    }

    try {
      await appointmentsApi.update(appointmentId, { status: "completed" });
      setUpcomingAppointments((current) => current.filter((appointment) => appointment.id !== appointmentId));
      setPastAppointments((current) => [{ ...selectedAppointment, status: "Completed" }, ...current]);
      setApiError(null);
    } catch {
      setApiError("Unable to mark appointment as completed.");
    }
  };

  const handleOpenPatientProfile = (appointment: Appointment) => {
    navigate(`/doctor/pages/patient-management?patient=${encodeURIComponent(appointment.patientId)}`);
  };

  const selectedPatient = useMemo(
    () => patients.find((patient) => patient.id === patientIdInput) ?? null,
    [patientIdInput, patients],
  );

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
        </div>
        <img src={appointmentImg} alt="Banner" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="dark:bg-black px-3 md:px-6 py-6 space-y-4 font-sans">
        {apiError && (
          <div className="rounded-2xl border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
            {apiError}
          </div>
        )}

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
                        {appointment.patientDisplayId} • {appointment.date} • {appointment.time}
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
                  {t("auth", "noAppointmentsInThisFilter", "No appointments in this filter.")}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl shadow p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">{t("auth", "pastAppointments", "Past Appointments")}</h3>
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
                        {appointment.patientDisplayId} • {appointment.date} • {appointment.time}
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
            <select
              value={patientIdInput}
              onChange={(event) => setPatientIdInput(event.target.value)}
              className="rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black px-3 py-2 text-sm text-black dark:text-white"
            >
              <option value="">Select registered patient</option>
              {patients.length === 0 && <option value="" disabled>No registered patients available</option>}
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} - {patient.displayId}
                </option>
              ))}
            </select>
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
              disabled={!selectedPatient}
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

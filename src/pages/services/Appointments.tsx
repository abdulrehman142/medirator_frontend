import appointmentsImg from "/medirator_images/appointment.png";
import React, { useEffect, useMemo, useState } from "react";
import { appointmentsApi } from "../../api/appointmentsApi";
import { usersApi } from "../../api/usersApi";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";


interface AppointmentsProps {
  darkMode?: boolean;
}

interface DoctorOption {
  id: string;
  displayId?: string;
  name: string;
  specialization: string;
}

const normalizeDoctorOption = (doctor: {
  id?: string;
  name?: string;
  specialization?: string;
  display_id?: string;
}) => ({
  id: doctor.id ?? "",
  displayId: doctor.display_id,
  name: doctor.name ?? "Unnamed doctor",
  specialization: doctor.specialization ?? "Not specified",
});

const Appointments = ({ darkMode = false }: AppointmentsProps) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [doctorOptions, setDoctorOptions] = useState<DoctorOption[]>([]);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [allAppointments, setAllAppointments] = useState<
    Array<{ id: string; reason: string; date: string; status: string; doctorId: string }>
  >([]);
  const [dismissedRejectedIds, setDismissedRejectedIds] = useState<string[]>([]);

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  useEffect(() => {
    const loadPatient = async () => {
      try {
        const [me, patientProfile] = await Promise.all([usersApi.me(), usersApi.getMyPatientProfile()]);
        setName(me.full_name);
        setEmail(me.email);
        setPhone(patientProfile?.phone ?? "");
      } catch {
        // Keep the form editable even if profile hydration fails.
      }
    };

    const loadDoctors = async () => {
      try {
        const response = await usersApi.listRegisteredDoctors();
        const nextDoctors = Array.isArray(response) ? response.map(normalizeDoctorOption).filter((doctor) => doctor.id) : [];
        setDoctorOptions(nextDoctors);
        setDoctorId((current) => current || nextDoctors[0]?.id || "");
      } catch {
        setDoctorOptions([]);
        setDoctorId("");
      } finally {
        setLoadingDoctors(false);
      }
    };

    const loadAppointments = async () => {
      try {
        const response = await appointmentsApi.list();
        setAllAppointments(
          response.map((appointment) => ({
            id: appointment.id,
            reason: appointment.reason,
            date: new Date(appointment.scheduled_for).toLocaleDateString(),
            status: appointment.status,
            doctorId: appointment.doctor_id,
          })),
        );
      } catch {
        setAllAppointments([]);
      }
    };

    void loadPatient();
    void loadDoctors();
    void loadAppointments();
  }, []);

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    const key = `medirator_dismissed_rejected_${user.id}`;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) {
        setDismissedRejectedIds(parsed);
      }
    } catch {
      setDismissedRejectedIds([]);
    }
  }, [user?.id]);

  const dateOptions = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      value: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    };
  });

  const toIsoDateTime = (date: string, time24Hour: string) => {
    return `${date}T${time24Hour}:00`;
  };

  const selectedDoctor = useMemo(
    () => doctorOptions.find((doctor) => doctor.id === doctorId) ?? null,
    [doctorId, doctorOptions],
  );

  const doctorInfoById = useMemo(() => {
    const map = new Map<string, { name: string; displayId?: string }>();
    for (const doctor of doctorOptions) {
      map.set(doctor.id, { name: doctor.name, displayId: doctor.displayId });
    }
    return map;
  }, [doctorOptions]);

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !appointmentDate ||
      !appointmentTime ||
      !doctorId.trim() ||
      !reason.trim()
    ) {
      setError(t("auth", "appointmentDetailsRequired", "Please fill all appointment details."));
      setLoading(false);
      return;
    }

    if (!user?.id) {
      setError(t("auth", "loginAgainMissingIdentity", "Please login again. User identity is missing."));
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError(t("auth", "invalidEmail", "Please enter a valid email address."));
      setLoading(false);
      return;
    }

    try {
      await appointmentsApi.create({
        patient_id: user.id,
        doctor_id: doctorId.trim(),
        reason: reason.trim(),
        scheduled_for: toIsoDateTime(appointmentDate, appointmentTime),
      });

      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setAppointmentDate("");
      setAppointmentTime("");
      setDoctorId("");
      setReason("");
      const refreshed = await appointmentsApi.list();
      setAllAppointments(
        refreshed.map((appointment) => ({
          id: appointment.id,
          reason: appointment.reason,
          date: new Date(appointment.scheduled_for).toLocaleDateString(),
          status: appointment.status,
          doctorId: appointment.doctor_id,
        })),
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : t("auth", "appointmentFailed", "Failed to book appointment. Please try again later.");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row dark:text-white justify-between items-center dark:bg-black font-sans gap-4 md:gap-0">
        <div className="w-full md:w-[34%] flex flex-col items-center justify-center text-center p-2 md:p-6 m-2 md:m-4">
          <img
            src={appointmentsImg}
            alt="Appointment"
            className="h-24 w-24 md:h-32 md:w-32 object-contain mb-3 md:mb-4"
            loading="lazy"
          />
          <div className="text-xl text-[#0B3C5D] dark:text-white md:text-2xl font-bold">
            {t("auth", "bookYourAppointment", "Book your appointment")}
          </div>
          <div className="p-2 m-2 text-sm text-[#8e8e93] md:text-base">
            {t("auth", "appointmentIntroLine1", "Choose a date and time to schedule your visit")}
            <br /> with the right doctor quickly and easily.
          </div>
        </div>

        <div className="w-full max-w-4xl m-2 md:m-4 px-3 md:px-4 md:px-8 py-6 md:py-8 relative z-10">
          <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl shadow p-4 md:p-8">
            {allAppointments
              .filter((item) => item.status === "canceled" && !dismissedRejectedIds.includes(item.id))
              .map((item) => (
                <div
                  key={item.id}
                  className="mb-3 rounded-2xl border border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-300"
                >
                  {t("auth", "appointmentRejected", "Appointment rejected/declined:")} {item.reason} ({item.date})
                  <button
                    type="button"
                    className="ml-3 underline"
                    onClick={() => {
                      if (!user?.id) return;
                      const next = [...dismissedRejectedIds, item.id];
                      setDismissedRejectedIds(next);
                      localStorage.setItem(`medirator_dismissed_rejected_${user.id}`, JSON.stringify(next));
                    }}
                  >
                    {t("auth", "dismiss", "Dismiss")}
                  </button>
                </div>
              ))}
            {error && <div className="mb-4 text-red-500 text-sm md:text-base">{error}</div>}
            {success && (
              <div className="mb-4 text-green-600 text-sm md:text-base">
                {t("auth", "appointmentBookedSuccessfully", "Appointment booked successfully.")}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm text-black dark:text-white mb-1">
                    {t("auth", "patientName", "Patient Name")}
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-2xl border-[#0B3C5D] p-2 bg-white dark:bg-black text-black dark:text-white focus:outline-none text-sm"
                    placeholder={t("auth", "fullNamePlaceholder", "Full name")}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm text-black dark:text-white mb-1">
                    {t("auth", "email", "Email")}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded-2xl border-[#0B3C5D] bg-white dark:bg-black text-black dark:text-white focus:outline-none text-sm"
                    placeholder={t("auth", "emailPlaceholder", "you@example.com")}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm text-black dark:text-white mb-1">
                    {t("auth", "phone", "Phone")}
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border rounded-2xl border-[#0B3C5D] bg-white dark:bg-black text-black dark:text-white focus:outline-none text-sm"
                    placeholder={t("auth", "phonePlaceholder", "03XXXXXXXXX")}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm text-black dark:text-white mb-1">
                    {t("auth", "registeredDoctor", "Registered Doctor")}
                  </label>
                  <select
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="w-full p-2 border rounded-2xl border-[#0B3C5D] bg-white dark:bg-black text-black dark:text-white focus:outline-none text-sm"
                    required
                    disabled={loadingDoctors}
                  >
                    <option value="">{loadingDoctors ? t("auth", "loadingDoctors", "Loading doctors...") : t("auth", "selectDoctor", "Select doctor")}</option>
                    {!loadingDoctors && doctorOptions.length === 0 && (
                      <option value="" disabled>
                        {t("auth", "noRegisteredDoctors", "No registered doctors available")}
                      </option>
                    )}
                    {doctorOptions.map((doctorOption) => (
                      <option key={doctorOption.id} value={doctorOption.id}>
                        {doctorOption.name} ({doctorOption.displayId ?? doctorOption.id}) - {doctorOption.specialization}
                      </option>
                    ))}
                  </select>
                  {selectedDoctor && (
                    <p className="mt-2 text-xs text-[#6B7280] dark:text-gray-400">
                      {t("auth", "bookingWith", "Booking with")} {selectedDoctor.name} ({selectedDoctor.displayId ?? selectedDoctor.id})
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm text-black dark:text-white mb-1">
                    {t("auth", "appointmentDate", "Appointment Date")}
                  </label>
                  <select
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full p-2 border rounded-2xl border-[#0B3C5D] bg-white dark:bg-black text-black dark:text-white focus:outline-none text-sm"
                    required
                  >
                    <option value="">{t("auth", "selectDate", "Select date")}</option>
                    {dateOptions.map((dateOption) => (
                      <option key={dateOption.value} value={dateOption.value}>
                        {dateOption.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm text-black dark:text-white mb-1">
                    {t("auth", "appointmentTime", "Appointment Time")}
                  </label>
                  <input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full p-2 border rounded-2xl border-[#0B3C5D] bg-white dark:bg-black text-black dark:text-white focus:outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm text-black dark:text-white mb-1">
                    {t("auth", "reasonForVisit", "Reason for Visit")}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 border rounded-2xl border-[#0B3C5D] bg-white dark:bg-black text-black dark:text-white min-h-[100px] md:min-h-[160px] focus:outline-none text-sm"
                  placeholder={t("auth", "describeYourConcern", "Describe your concern")}
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white border rounded-2xl border-[#0B3C5D] dark:bg-black hover:text-white dark:text-white hover:bg-[#0B3C5D] dark:hover:bg-gray-800 text-black p-2 px-4 w-full md:w-auto text-sm disabled:opacity-50"
                >
                  {loading ? t("auth", "booking", "Booking...") : t("auth", "bookAppointment", "Book Appointment")}
                </button>
                <div className="text-xs md:text-sm text-black dark:text-gray-300 text-center md:text-right">
                  {t("auth", "needHelp", "Need help?")} <a href="mailto:mediratorinfo@gmail.com" className="underline">mediratorinfo@gmail.com</a>
                </div>
              </div>
            </form>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-[#0B3C5D] p-4">
                <h4 className="font-semibold text-[#0B3C5D] dark:text-white">{t("auth", "currentAppointments", "Current Appointments")}</h4>
                <ul className="mt-2 space-y-2 text-sm">
                  {allAppointments
                    .filter((item) => item.status === "scheduled" || item.status === "rescheduled")
                    .map((item) => (
                      <li key={item.id} className="rounded-xl border border-[#0B3C5D] p-2">
                        {item.reason} - {item.date}
                        <div className="mt-1 text-xs text-[#4B5563] dark:text-gray-300">
                          Doctor: {doctorInfoById.get(item.doctorId)?.name ?? "No available data"}{" "}
                          ({doctorInfoById.get(item.doctorId)?.displayId ?? item.doctorId})
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-[#0B3C5D] p-4">
                <h4 className="font-semibold text-[#0B3C5D] dark:text-white">{t("auth", "pastAppointments", "Past Appointments")}</h4>
                <ul className="mt-2 space-y-2 text-sm">
                  {allAppointments
                    .filter((item) => item.status === "completed" || item.status === "canceled")
                    .map((item) => (
                      <li key={item.id} className="rounded-xl border border-[#0B3C5D] p-2">
                        {item.reason} - {item.date} ({item.status === "canceled" ? t("auth", "rejected", "Rejected") : t("auth", "completed", "Completed")})
                        <div className="mt-1 text-xs text-[#4B5563] dark:text-gray-300">
                          Doctor: {doctorInfoById.get(item.doctorId)?.name ?? "No available data"}{" "}
                          ({doctorInfoById.get(item.doctorId)?.displayId ?? item.doctorId})
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;

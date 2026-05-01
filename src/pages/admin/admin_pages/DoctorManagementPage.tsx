import { useEffect, useMemo, useState } from "react";
import doctorImg from "/medirator_images/doctor.png";
import { adminApi } from "../../../api/adminApi";
import { useLanguage } from "../../../context/LanguageContext";

interface DoctorManagementPageProps {
  darkMode?: boolean;
}

interface DoctorRecord {
  id: string;
  name: string;
  specialization: string;
  status: "Active" | "Suspended";
  verification: "Approved" | "Pending" | "Rejected";
}

const normalizeDoctor = (doctor: {
  id?: string;
  name?: string;
  specialization?: string;
  status?: "Active" | "Suspended";
  verification?: "Approved" | "Pending" | "Rejected";
}): DoctorRecord => ({
  id: doctor.id ?? "Unknown",
  name: doctor.name ?? "Unnamed doctor",
  specialization: doctor.specialization ?? "Not specified",
  status: doctor.status ?? "Suspended",
  verification: doctor.verification ?? "Pending",
});

const toLowerText = (value: string | undefined | null) => (value ?? "").toLowerCase();

const DoctorManagementPage = ({ darkMode = false }: DoctorManagementPageProps) => {
  const { t } = useLanguage();
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<DoctorRecord[]>([]);
  const [newDoctorName, setNewDoctorName] = useState("");
  const [newDoctorSpecialization, setNewDoctorSpecialization] = useState("");

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await adminApi.listDoctors();
        setDoctors(Array.isArray(response) ? response.map(normalizeDoctor) : []);
        setApiError(null);
      } catch {
        setApiError(t("admin", "noAvailableData", "No available data."));
      }
    };

    void loadDoctors();
  }, [t]);

  const refreshDoctors = async () => {
    const response = await adminApi.listDoctors();
    setDoctors(Array.isArray(response) ? response.map(normalizeDoctor) : []);
  };

  const filteredDoctors = useMemo(
    () => doctors.filter((doctor) => toLowerText(doctor.name).includes(searchQuery.toLowerCase())),
    [doctors, searchQuery],
  );

  const addDoctor = () => {
    if (!newDoctorName.trim() || !newDoctorSpecialization.trim()) {
      return;
    }

    const nextId = `DR-${200 + doctors.length}`;

    setDoctors((current) => [
      ...current,
      {
        id: nextId,
        name: newDoctorName.trim(),
        specialization: newDoctorSpecialization.trim(),
        status: "Active",
        verification: "Pending",
      },
    ]);
    setNewDoctorName("");
    setNewDoctorSpecialization("");
  };

  const updateDoctor = async (doctorId: string, changes: Partial<DoctorRecord>) => {
    try {
      await adminApi.updateDoctor(doctorId, changes);
      await refreshDoctors();
      setApiError(null);
    } catch {
      setApiError(t("admin", "doctorUpdateFailed", "Doctor update not confirmed by server."));
    }
  };

  const approveDoctor = (doctorId: string) => {
    void updateDoctor(doctorId, {
      verification: "Approved",
      status: "Active",
    });
  };

  const rejectDoctor = (doctorId: string) => {
    void updateDoctor(doctorId, {
      verification: "Rejected",
      status: "Suspended",
    });
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">{t("admin", "doctorManagementTitle", "Doctor Management")}</h2>
          
        </div>
        <img src={doctorImg} alt={t("admin", "doctorManagementTitle", "Doctor Management")} className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="dark:bg-black px-3 md:px-6 py-6 space-y-4 font-sans text-black dark:text-white">
        {apiError && (
          <div className="rounded-2xl border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
            {apiError}
          </div>
        )}

        <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
            <input
              value={newDoctorName}
              onChange={(event) => setNewDoctorName(event.target.value)}
              placeholder={t("admin", "doctorNamePlaceholder", "Doctor name")}
              className="rounded-2xl border border-[#0B3C5D] px-4 py-2 bg-white dark:bg-black"
            />
            <input
              value={newDoctorSpecialization}
              onChange={(event) => setNewDoctorSpecialization(event.target.value)}
              placeholder={t("admin", "specializationPlaceholder", "Specialization")}
              className="rounded-2xl border border-[#0B3C5D] px-4 py-2 bg-white dark:bg-black"
            />
            <button type="button" onClick={addDoctor} className="rounded-2xl border border-[#0B3C5D] px-4 py-2">
              {t("admin", "addNewDoctor", "Add New Doctor")}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
          <div className="flex justify-between gap-2 flex-col md:flex-row md:items-center">
            <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">{t("admin", "doctorAccounts", "Doctor Accounts")}</h3>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("admin", "searchDoctor", "Search doctor")}
              className="rounded-2xl border border-[#0B3C5D] px-4 py-2 bg-white dark:bg-black"
            />
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-[#0B3C5D]">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-[#0B3C5D] text-white">
                <tr>
                  <th className="text-left px-4 py-3">{t("admin", "name", "Name")}</th>
                  <th className="text-left px-4 py-3">{t("admin", "specialization", "Specialization")}</th>
                  <th className="text-left px-4 py-3">{t("admin", "status", "Status")}</th>
                  <th className="text-left px-4 py-3">{t("admin", "verification", "Verification")}</th>
                  <th className="text-left px-4 py-3">{t("admin", "actions", "Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="border-t border-[#0B3C5D]/40">
                      <td className="px-4 py-3">{doctor.name}</td>
                      <td className="px-4 py-3">{doctor.specialization}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs ${
                            doctor.status === "Active"
                              ? "border-green-600 text-green-700 dark:text-green-400"
                              : "border-yellow-600 text-yellow-700 dark:text-yellow-400"
                          }`}
                        >
                          {doctor.status === "Active"
                            ? t("admin", "activeStatus", "Active")
                            : t("admin", "suspendedStatus", "Suspended")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs ${
                            doctor.verification === "Approved"
                              ? "border-green-600 text-green-700 dark:text-green-400"
                              : doctor.verification === "Rejected"
                                ? "border-red-600 text-red-600 dark:text-red-400"
                                : "border-yellow-600 text-yellow-700 dark:text-yellow-400"
                          }`}
                        >
                          {doctor.verification === "Approved"
                            ? t("admin", "approvedStatus", "Approved")
                            : doctor.verification === "Rejected"
                              ? t("admin", "rejectedStatus", "Rejected")
                              : t("admin", "pendingStatus", "Pending")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => approveDoctor(doctor.id)}
                            disabled={doctor.verification === "Approved"}
                            className={`rounded-2xl border px-3 py-1.5 ${
                              doctor.verification === "Approved"
                                ? "border-gray-400 text-gray-400 cursor-not-allowed"
                                : "border-green-600 text-green-700"
                            }`}
                          >
                            {t("admin", "approve", "Approve")}
                          </button>
                          <button
                            type="button"
                            onClick={() => rejectDoctor(doctor.id)}
                            disabled={doctor.verification === "Rejected"}
                            className={`rounded-2xl border px-3 py-1.5 ${
                              doctor.verification === "Rejected"
                                ? "border-gray-400 text-gray-400 cursor-not-allowed"
                                : "border-red-600 text-red-600"
                            }`}
                          >
                            {t("admin", "reject", "Reject")}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              void updateDoctor(doctor.id, {
                                status: doctor.status === "Active" ? "Suspended" : "Active",
                              })
                            }
                            className="rounded-2xl border border-[#0B3C5D] px-3 py-1.5"
                          >
                            {doctor.status === "Active"
                              ? t("admin", "suspend", "Suspend")
                              : t("admin", "activate", "Activate")}
                          </button>
                        </div>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorManagementPage;

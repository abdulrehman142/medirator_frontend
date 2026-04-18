import { useMemo, useState } from "react";
import doctorImg from "/medirator_images/doctor.png";

interface DoctorManagementPageProps {
  darkMode?: boolean;
}

interface DoctorRecord {
  id: string;
  name: string;
  specialization: string;
  status: "Active" | "Suspended";
  verification: "Approved" | "Pending" | "Rejected";
  role: "Doctor" | "Senior Doctor" | "Supervisor";
}

const DoctorManagementPage = ({ darkMode = false }: DoctorManagementPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openRoleDropdownId, setOpenRoleDropdownId] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<DoctorRecord[]>([
    {
      id: "DR-101",
      name: "Dr. Sana Ahmed",
      specialization: "Cardiology",
      status: "Active",
      verification: "Approved",
      role: "Senior Doctor",
    },
    {
      id: "DR-102",
      name: "Dr. Ali Raza",
      specialization: "Endocrinology",
      status: "Active",
      verification: "Pending",
      role: "Doctor",
    },
    {
      id: "DR-103",
      name: "Dr. Hina Malik",
      specialization: "Pulmonology",
      status: "Suspended",
      verification: "Rejected",
      role: "Doctor",
    },
  ]);
  const [newDoctorName, setNewDoctorName] = useState("");
  const [newDoctorSpecialization, setNewDoctorSpecialization] = useState("");

  const filteredDoctors = useMemo(
    () => doctors.filter((doctor) => doctor.name.toLowerCase().includes(searchQuery.toLowerCase())),
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
        role: "Doctor",
      },
    ]);
    setNewDoctorName("");
    setNewDoctorSpecialization("");
  };

  const updateDoctor = (doctorId: string, changes: Partial<DoctorRecord>) => {
    setDoctors((current) => current.map((doctor) => (doctor.id === doctorId ? { ...doctor, ...changes } : doctor)));
  };

  const approveDoctor = (doctorId: string) => {
    updateDoctor(doctorId, {
      verification: "Approved",
      status: "Active",
    });
  };

  const rejectDoctor = (doctorId: string) => {
    updateDoctor(doctorId, {
      verification: "Rejected",
      status: "Suspended",
    });
  };

  const roleOptions: Array<DoctorRecord["role"]> = ["Doctor", "Senior Doctor", "Supervisor"];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">Doctor Management</h2>
          <p className="text-sm md:text-base text-center md:text-left ml-0 md:ml-5 md:pl-5 mt-2 text-gray-200">
            Manage doctor accounts, verification workflow, and role-based permissions.
          </p>
        </div>
        <img src={doctorImg} alt="Doctor Management" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="dark:bg-black px-3 md:px-6 py-6 space-y-4 font-sans text-black dark:text-white">
        <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2">
            <input
              value={newDoctorName}
              onChange={(event) => setNewDoctorName(event.target.value)}
              placeholder="Doctor name"
              className="rounded-2xl border border-[#0B3C5D] px-4 py-2 bg-white dark:bg-black"
            />
            <input
              value={newDoctorSpecialization}
              onChange={(event) => setNewDoctorSpecialization(event.target.value)}
              placeholder="Specialization"
              className="rounded-2xl border border-[#0B3C5D] px-4 py-2 bg-white dark:bg-black"
            />
            <button type="button" onClick={addDoctor} className="rounded-2xl border border-[#0B3C5D] px-4 py-2">
              Add New Doctor
            </button>
          </div>
        </section>

        <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
          <div className="flex justify-between gap-2 flex-col md:flex-row md:items-center">
            <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Doctor Accounts</h3>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search doctor"
              className="rounded-2xl border border-[#0B3C5D] px-4 py-2 bg-white dark:bg-black"
            />
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-[#0B3C5D]">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-[#0B3C5D] text-white">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Specialization</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Verification</th>
                  <th className="text-left px-4 py-3">Role</th>
                  <th className="text-left px-4 py-3">Actions</th>
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
                        {doctor.status}
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
                        {doctor.verification}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative inline-flex">
                        <div
                          className={`flex flex-col shadow-lg rounded-md p-1 border-2 ${
                            darkMode ? "bg-black border-[#0B3C5D]" : "bg-[#0B3C5D] border-[#0B3C5D]"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenRoleDropdownId((current) => (current === doctor.id ? null : doctor.id))
                            }
                            className={`border-[#0B3C5D] m-1 rounded-md transition-all duration-200 cursor-pointer flex items-center justify-between gap-2 px-3 py-2 w-40 text-sm ${
                              darkMode
                                ? "bg-[#0B3C5D] hover:bg-gray-800 text-white hover:text-white"
                                : "bg-white hover:bg-gray-800 text-black hover:text-white"
                            }`}
                          >
                            <span className="truncate">{doctor.role}</span>
                            <span className="text-xs">{openRoleDropdownId === doctor.id ? "▲" : "▼"}</span>
                          </button>
                        </div>

                        {openRoleDropdownId === doctor.id && (
                          <div
                            className={`absolute top-full left-0 mt-1 z-30 flex flex-col shadow-lg rounded-md p-1 border-2 ${
                              darkMode ? "bg-black border-[#0B3C5D]" : "bg-[#0B3C5D] border-[#0B3C5D]"
                            }`}
                          >
                            {roleOptions.map((roleOption) => (
                              <button
                                key={`${doctor.id}-${roleOption}`}
                                type="button"
                                onClick={() => {
                                  updateDoctor(doctor.id, { role: roleOption });
                                  setOpenRoleDropdownId(null);
                                }}
                                className={`border-[#0B3C5D] m-1 rounded-md transition-all duration-200 cursor-pointer px-3 py-2 w-40 text-left text-sm ${
                                  darkMode
                                    ? "bg-[#0B3C5D] hover:bg-gray-800 text-white hover:text-white"
                                    : "bg-white hover:bg-gray-800 text-black hover:text-white"
                                } ${doctor.role === roleOption ? "ring-2 ring-white/40" : ""}`}
                              >
                                {roleOption}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
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
                          Approve
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
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateDoctor(doctor.id, {
                              status: doctor.status === "Active" ? "Suspended" : "Active",
                            })
                          }
                          className="rounded-2xl border border-[#0B3C5D] px-3 py-1.5"
                        >
                          {doctor.status === "Active" ? "Suspend" : "Activate"}
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

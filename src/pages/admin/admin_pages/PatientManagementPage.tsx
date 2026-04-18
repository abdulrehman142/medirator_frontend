import { useMemo, useState } from "react";
import patientImg from "/medirator_images/patient.png";

interface PatientManagementPageProps {
  darkMode?: boolean;
}

interface PatientRecord {
  id: string;
  name: string;
  age: number;
  status: "Active" | "Inactive" | "Critical";
  flaggedCritical: boolean;
  medicalHistory: string;
}

const PatientManagementPage = ({ darkMode = false }: PatientManagementPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive" | "Critical">("All");
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [patients, setPatients] = useState<PatientRecord[]>([
    {
      id: "PT-240318-07",
      name: "Ayesha Khan",
      age: 32,
      status: "Active",
      flaggedCritical: false,
      medicalHistory: "Hypertension under monitoring; weekly BP checks.",
    },
    {
      id: "PT-240402-11",
      name: "Hassan Ali",
      age: 45,
      status: "Critical",
      flaggedCritical: true,
      medicalHistory: "Type 2 diabetes with elevated sugar trend.",
    },
    {
      id: "PT-240215-03",
      name: "Sara Iqbal",
      age: 28,
      status: "Active",
      flaggedCritical: false,
      medicalHistory: "Asthma care plan with inhaler adherence follow-up.",
    },
    {
      id: "PT-240501-09",
      name: "Bilal Hussain",
      age: 51,
      status: "Inactive",
      flaggedCritical: false,
      medicalHistory: "Missed last two appointments; account temporarily inactive.",
    },
  ]);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [selectedViewMode, setSelectedViewMode] = useState<"profile" | "history" | null>(null);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [pendingDeletePatientId, setPendingDeletePatientId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || patient.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [patients, searchQuery, statusFilter]);

  const startEdit = (patient: PatientRecord) => {
    setEditingPatientId(patient.id);
    setEditName(patient.name);
    setEditAge(String(patient.age));
  };

  const saveEdit = () => {
    if (!editingPatientId || !editName.trim() || !editAge.trim()) {
      return;
    }

    setPatients((current) =>
      current.map((patient) =>
        patient.id === editingPatientId
          ? { ...patient, name: editName.trim(), age: Number(editAge) || patient.age }
          : patient,
      ),
    );
    setEditingPatientId(null);
  };

  const viewPatientProfile = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setSelectedViewMode("profile");
  };

  const viewMedicalHistory = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setSelectedViewMode("history");
  };

  const deletePatient = (patientId: string) => {
    setPatients((current) => current.filter((patient) => patient.id !== patientId));

    if (selectedPatient?.id === patientId) {
      setSelectedPatient(null);
    }
  };

  const toggleCriticalFlag = (patientId: string) => {
    setPatients((current) =>
      current.map((patient) =>
        patient.id === patientId
          ? {
              ...patient,
              flaggedCritical: !patient.flaggedCritical,
              status: !patient.flaggedCritical ? "Critical" : "Active",
            }
          : patient,
      ),
    );
  };

  const confirmDeletePatient = () => {
    if (!pendingDeletePatientId) {
      return;
    }

    deletePatient(pendingDeletePatientId);
    setPendingDeletePatientId(null);
  };

  const statusBadgeClassName = (status: PatientRecord["status"]) => {
    if (status === "Active") {
      return "border-green-600 text-green-700 dark:text-green-400";
    }

    return "border-yellow-600 text-yellow-700 dark:text-yellow-400";
  };

  const statusFilterOptions: Array<"All" | "Active" | "Inactive" | "Critical"> = [
    "All",
    "Active",
    "Inactive",
    "Critical",
  ];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">Patient Management</h2>
          <p className="text-sm md:text-base text-center md:text-left ml-0 md:ml-5 md:pl-5 mt-2 text-gray-200">
            Manage patient records, profiles, history, and critical care flagging.
          </p>
        </div>
        <img src={patientImg} alt="Patient Management" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="dark:bg-black px-3 md:px-6 py-6 space-y-4 font-sans">
        <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex flex-col sm:flex-row gap-2 w-full md:max-w-2xl">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name or ID"
                className="flex-1 rounded-2xl border border-[#0B3C5D] px-4 py-2 bg-white dark:bg-black text-black dark:text-white"
              />
              <div className="relative inline-flex self-start">
                <div
                  className={`flex flex-col shadow-lg rounded-md p-1 border-2 ${
                    darkMode ? "bg-black border-[#0B3C5D]" : "bg-[#0B3C5D] border-[#0B3C5D]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setIsStatusFilterOpen((current) => !current)}
                    className={`border-[#0B3C5D] m-1 rounded-md transition-all duration-200 cursor-pointer flex items-center justify-between gap-2 px-3 py-2 w-40 text-sm ${
                      darkMode
                        ? "bg-[#0B3C5D] hover:bg-gray-800 text-white hover:text-white"
                        : "bg-white hover:bg-gray-800 text-black hover:text-white"
                    }`}
                  >
                    <span>{statusFilter === "All" ? "All Status" : statusFilter}</span>
                    <span className="text-xs">{isStatusFilterOpen ? "▲" : "▼"}</span>
                  </button>
                </div>

                {isStatusFilterOpen && (
                  <div
                    className={`absolute top-full left-0 mt-1 z-30 flex flex-col shadow-lg rounded-md p-1 border-2 ${
                      darkMode ? "bg-black border-[#0B3C5D]" : "bg-[#0B3C5D] border-[#0B3C5D]"
                    }`}
                  >
                    {statusFilterOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setStatusFilter(option);
                          setIsStatusFilterOpen(false);
                        }}
                        className={`border-[#0B3C5D] m-1 rounded-md transition-all duration-200 cursor-pointer px-3 py-2 w-40 text-left text-sm ${
                          darkMode
                            ? "bg-[#0B3C5D] hover:bg-gray-800 text-white hover:text-white"
                            : "bg-white hover:bg-gray-800 text-black hover:text-white"
                        } ${statusFilter === option ? "ring-2 ring-white/40" : ""}`}
                      >
                        {option === "All" ? "All Status" : option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-[#0B3C5D]">
            <table className="w-full min-w-[760px] text-sm text-black dark:text-white">
              <thead className="bg-[#0B3C5D] text-white">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">ID</th>
                  <th className="text-left px-4 py-3">Age</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-t border-[#0B3C5D]/40 bg-white dark:bg-black">
                    <td className="px-4 py-3">{patient.name}</td>
                    <td className="px-4 py-3">{patient.id}</td>
                    <td className="px-4 py-3">{patient.age}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-3 py-1 text-xs ${statusBadgeClassName(patient.status)}`}>
                        {patient.flaggedCritical ? "Critical" : patient.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => viewPatientProfile(patient)}
                          className="rounded-2xl border border-[#0B3C5D] px-3 py-1.5"
                        >
                          View Profile
                        </button>
                        <button
                          type="button"
                          onClick={() => startEdit(patient)}
                          className="rounded-2xl border border-[#0B3C5D] px-3 py-1.5"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDeletePatientId(patient.id)}
                          className="rounded-2xl border border-red-600 text-red-600 px-3 py-1.5"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => viewMedicalHistory(patient)}
                          className="rounded-2xl border border-[#0B3C5D] px-3 py-1.5"
                        >
                          Medical History
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleCriticalFlag(patient.id)}
                          className="rounded-2xl border border-yellow-600 text-yellow-700 px-3 py-1.5"
                        >
                          {patient.flaggedCritical ? "Unflag Critical" : "Flag Critical"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {(selectedPatient || editingPatientId) && (
          <section className="rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-4 md:p-6 text-black dark:text-white">
            {selectedPatient && selectedViewMode === "profile" ? (
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Patient Profile</h3>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="rounded-2xl border border-[#0B3C5D] p-3">Name: {selectedPatient.name}</div>
                  <div className="rounded-2xl border border-[#0B3C5D] p-3">ID: {selectedPatient.id}</div>
                  <div className="rounded-2xl border border-[#0B3C5D] p-3">Age: {selectedPatient.age}</div>
                  <div className="rounded-2xl border border-[#0B3C5D] p-3">Status: {selectedPatient.status}</div>
                </div>
              </div>
            ) : null}

            {selectedPatient && selectedViewMode === "history" ? (
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Medical History</h3>
                <div className="mt-3 rounded-2xl border border-[#0B3C5D] p-3 text-sm">{selectedPatient.medicalHistory}</div>
              </div>
            ) : null}

            {editingPatientId ? (
              <div className="mt-4">
                <h4 className="text-base font-semibold text-[#0B3C5D] dark:text-white">Edit Patient</h4>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    className="rounded-2xl border border-[#0B3C5D] px-3 py-2 bg-white dark:bg-black"
                    placeholder="Name"
                  />
                  <input
                    value={editAge}
                    onChange={(event) => setEditAge(event.target.value)}
                    className="rounded-2xl border border-[#0B3C5D] px-3 py-2 bg-white dark:bg-black"
                    placeholder="Age"
                  />
                  <button type="button" onClick={saveEdit} className="rounded-2xl border border-[#0B3C5D] px-3 py-2">
                    Save Changes
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        )}

        {pendingDeletePatientId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-5 shadow-2xl text-black dark:text-white">
              <h3 className="text-xl font-bold text-[#0B3C5D] dark:text-white">Delete patient record?</h3>
              <p className="mt-3 text-sm">
                This will permanently remove the patient from management records. Do you want to continue?
              </p>
              <div className="mt-5 flex flex-wrap gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setPendingDeletePatientId(null)}
                  className="rounded-2xl border border-[#0B3C5D] px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeletePatient}
                  className="rounded-2xl border border-red-600 bg-red-600 text-white px-4 py-2 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientManagementPage;

import { useMemo, useState } from "react";

import { useDoctorPatient } from "../context/DoctorPatientContext";

interface DoctorPatientDropdownProps {
  darkMode: boolean;
}

const DoctorPatientDropdown = ({ darkMode }: DoctorPatientDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { patients, selectedPatient, selectPatientById } = useDoctorPatient();

  const dropdownClassName = useMemo(
    () =>
      `inline-flex w-fit flex-col self-start shadow-lg rounded-md p-2 border-2 ${
        darkMode ? "bg-black border-[#0B3C5D]" : "bg-[#0B3C5D] border-[#0B3C5D]"
      }`,
    [darkMode],
  );

  const toggleButtonClassName = useMemo(
    () =>
      `border-[#0B3C5D] m-1 rounded-md transition-all duration-200 cursor-pointer flex items-center justify-between gap-2 px-3 py-2 w-48 ${
        darkMode
          ? "bg-[#0B3C5D] hover:bg-gray-800 text-white hover:text-white"
          : "bg-white hover:bg-gray-800 text-black hover:text-white"
      }`,
    [darkMode],
  );

  const itemClassName = useMemo(
    () =>
      `border-[#0B3C5D] m-1 rounded-md transition-all duration-200 cursor-pointer flex items-center gap-2 px-3 py-2 w-48 ${
        darkMode
          ? "bg-[#0B3C5D] hover:bg-gray-800 text-white hover:text-white"
          : "bg-white hover:bg-gray-800 text-black hover:text-white"
      }`,
    [darkMode],
  );

  return (
    <div className={dropdownClassName}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={toggleButtonClassName}
      >
        <div className="font-ibm-plex-mono text-sm truncate text-left">{selectedPatient.name}</div>
        <span className="text-xs opacity-80">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="mt-1">
          {patients.map((patient) => (
            <button
              key={patient.id}
              type="button"
              onClick={() => {
                selectPatientById(patient.id);
                setIsOpen(false);
              }}
              className={`${itemClassName} ${patient.id === selectedPatient.id ? "ring-2 ring-white/40" : ""}`}
            >
              <div className="font-ibm-plex-mono text-sm truncate">{patient.name}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPatientDropdown;
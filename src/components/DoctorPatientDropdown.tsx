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
        disabled={patients.length === 0}
      >
        <div className="flex flex-col items-start text-left min-w-0">
          <div className="font-ibm-plex-mono text-sm truncate w-40">{selectedPatient.name}</div>
          <div className="text-[10px] opacity-80 truncate w-40">{selectedPatient.displayId}</div>
        </div>
        <span className="text-xs opacity-80">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="mt-1">
          {patients.length === 0 && (
            <div className="m-1 w-48 rounded-md bg-white px-3 py-2 text-sm text-black dark:bg-[#0B3C5D] dark:text-white">
              No registered patients
            </div>
          )}
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
              <div className="flex flex-col items-start min-w-0">
                <div className="font-ibm-plex-mono text-sm truncate w-40">{patient.name}</div>
                <div className="text-[10px] opacity-80 truncate w-40">{patient.displayId}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorPatientDropdown;
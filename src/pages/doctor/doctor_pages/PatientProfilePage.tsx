import patientImg from "/medirator_images/patient.png";
import deleteIcon from "/medirator_images/delete.png";
import editIcon from "/medirator_images/edit.png";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import DoctorPatientDropdown from "../../../components/DoctorPatientDropdown";
import { useDoctorPatient } from "../../../context/DoctorPatientContext";

interface PatientProfilePageProps {
  darkMode?: boolean;
}

const PatientProfilePage = ({ darkMode = false }: PatientProfilePageProps) => {
  const [searchParams] = useSearchParams();
  const { patients, setPatients, selectedPatient, selectedPatientId, selectPatientById } = useDoctorPatient();
  const [notesDraft, setNotesDraft] = useState("");
  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [selectedDocumentTitle, setSelectedDocumentTitle] = useState<string>(
    selectedPatient.uploadedDocuments[0]?.title ?? "",
  );
  const [pendingDeleteNoteIndex, setPendingDeleteNoteIndex] = useState<number | null>(null);

  const selectedDocument = useMemo(
    () =>
      selectedPatient.uploadedDocuments.find((document) => document.title === selectedDocumentTitle) ??
      selectedPatient.uploadedDocuments[0],
    [selectedDocumentTitle, selectedPatient.uploadedDocuments],
  );

  const medicalInfo = useMemo(
    () => [
      { label: "Blood Group", value: selectedPatient.bloodGroup },
      { label: "Allergies", value: selectedPatient.allergies },
      { label: "Chronic Diseases", value: selectedPatient.chronicDiseases },
      { label: "Emergency Contact", value: selectedPatient.emergencyContact },
    ],
    [selectedPatient],
  );

  const basicInfo = useMemo(
    () => [
      { label: "Name", value: selectedPatient.name },
      { label: "Age", value: selectedPatient.age },
      { label: "Gender", value: selectedPatient.gender },
      { label: "Contact", value: selectedPatient.contact },
      { label: "Patient ID", value: selectedPatient.id },
    ],
    [selectedPatient],
  );

  const iconButtonClassName =
    "inline-flex items-center gap-2 bg-white border rounded-2xl border-[#0B3C5D] dark:bg-black hover:text-white dark:text-white hover:bg-[#0B3C5D] dark:hover:bg-gray-800 text-black px-4 py-2 text-sm transition-all duration-300";

  const noteActionButtonClassName =
    "inline-flex items-center justify-center gap-2 min-w-[112px] rounded-2xl border px-4 py-2 text-sm transition-all duration-300";

  const noteEditButtonClassName =
    `${noteActionButtonClassName} border-[#0B3C5D] bg-white text-black dark:bg-black dark:text-white hover:bg-[#0B3C5D] hover:text-white dark:hover:bg-gray-800`;

  const noteDeleteButtonClassName =
    `${noteActionButtonClassName} border-red-600 bg-white text-red-600 dark:bg-black dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-700`;

  const iconImageClassName = "h-4 w-4 object-contain";

  const sectionCardClassName =
    "h-full rounded-3xl border-2 border-[#0B3C5D]/80 bg-white/95 dark:bg-[#070d14] shadow-lg shadow-[#0B3C5D]/10 p-4 md:p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0B3C5D]/15";

  const infoItemClassName =
    "rounded-2xl border border-[#0B3C5D]/60 bg-white dark:bg-black/40 p-2.5 text-sm text-black dark:text-white";

  const handleAddNote = () => {
    const trimmedNote = notesDraft.trim();

    if (!trimmedNote) {
      return;
    }

    setPatients((currentPatients) =>
      currentPatients.map((patient) =>
        patient.id !== selectedPatient.id
          ? patient
          : {
              ...patient,
              doctorNotes: [trimmedNote, ...patient.doctorNotes],
            },
      ),
    );
    setNotesDraft("");
  };

  const handleStartEditNote = (noteIndex: number) => {
    setEditingNoteIndex(noteIndex);
    setEditDraft(selectedPatient.doctorNotes[noteIndex]);
  };

  const handleSaveNote = () => {
    if (editingNoteIndex === null || !editDraft.trim()) {
      return;
    }

    setPatients((currentPatients) =>
      currentPatients.map((patient) => {
        if (patient.id !== selectedPatient.id) {
          return patient;
        }

        return {
          ...patient,
          doctorNotes: patient.doctorNotes.map((note, noteIndex) =>
            noteIndex === editingNoteIndex ? editDraft.trim() : note,
          ),
        };
      }),
    );
    setEditingNoteIndex(null);
    setEditDraft("");
  };

  const handleDeleteNote = (noteIndex: number) => {
    setPatients((currentPatients) =>
      currentPatients.map((patient) => {
        if (patient.id !== selectedPatient.id) {
          return patient;
        }

        return {
          ...patient,
          doctorNotes: patient.doctorNotes.filter((_, index) => index !== noteIndex),
        };
      }),
    );

    if (editingNoteIndex === noteIndex) {
      setEditingNoteIndex(null);
      setEditDraft("");
    }
  };

  const handleConfirmDeleteNote = () => {
    if (pendingDeleteNoteIndex === null) {
      return;
    }

    handleDeleteNote(pendingDeleteNoteIndex);
    setPendingDeleteNoteIndex(null);
  };

  const handleOpenDocument = (documentTitle: string) => {
    setSelectedDocumentTitle(documentTitle);
  };

  useEffect(() => {
    const requestedPatient = searchParams.get("patient");

    if (!requestedPatient) {
      return;
    }

    const matchedPatient =
      patients.find((patient) => patient.id === requestedPatient) ||
      patients.find((patient) => patient.name === requestedPatient);

    if (matchedPatient && matchedPatient.id !== selectedPatientId) {
      selectPatientById(matchedPatient.id);
    }
  }, [patients, searchParams, selectPatientById, selectedPatientId]);

  useEffect(() => {
    setSelectedDocumentTitle(selectedPatient.uploadedDocuments[0]?.title ?? "");
    setEditingNoteIndex(null);
    setEditDraft("");
    setNotesDraft("");
    setPendingDeleteNoteIndex(null);
  }, [selectedPatient.id]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">
            Patient Profile
          </h2>
          <p className="text-sm md:text-base text-center md:text-left ml-0 md:ml-5 md:pl-5 mt-2 text-gray-200">
            Select a patient here, then use AI Risk, Prescription, or Visualizer for the same patient.
          </p>
          <div className="ml-0 md:ml-5 md:pl-5 mt-3">
            <DoctorPatientDropdown darkMode={darkMode} />
          </div>
        </div>
        <img src={patientImg} alt="Banner" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="flex flex-col dark:text-white justify-between items-start bg-gradient-to-b from-slate-50 to-white dark:from-[#060b12] dark:to-black font-sans gap-5 md:gap-4 px-2 md:px-3 pb-6">
        <div className="w-full max-w-6xl mx-auto px-3 md:px-8 py-6 md:py-8 relative z-10">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              <section className={sectionCardClassName}>
                <h2 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Basic Info</h2>
                <ul className="mt-3 space-y-2">
                  {basicInfo.map((item) => (
                    <li key={item.label} className={infoItemClassName}>
                      <span className="font-semibold">{item.label}:</span> {item.value}
                    </li>
                  ))}
                </ul>
              </section>

              <section className={sectionCardClassName}>
                <h2 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Medical Info</h2>
                <ul className="mt-3 space-y-2">
                  {medicalInfo.map((item) => (
                    <li key={item.label} className={infoItemClassName}>
                      <span className="font-semibold">{item.label}:</span> {item.value}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              <section className={sectionCardClassName}>
                <h2 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Doctor Notes</h2>
                <div className="mt-3 rounded-2xl border border-[#0B3C5D]/70 p-3 bg-white dark:bg-black/50">
                  <textarea
                    value={notesDraft}
                    onChange={(event) => setNotesDraft(event.target.value)}
                    className="w-full min-h-[90px] rounded-2xl border border-[#0B3C5D]/70 bg-white dark:bg-black p-3 text-sm text-black dark:text-white focus:outline-none"
                    placeholder="Add a new doctor note"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleAddNote}
                      className="bg-white border rounded-2xl border-[#0B3C5D] dark:bg-black hover:text-white dark:text-white hover:bg-[#0B3C5D] dark:hover:bg-gray-800 text-black px-4 py-2 text-sm transition-all duration-300"
                    >
                      Add Notes
                    </button>
                  </div>
                </div>
                <ul className="mt-3 space-y-2">
                  {selectedPatient.doctorNotes.map((note, noteIndex) => (
                    <li
                      key={`${selectedPatient.id}-${noteIndex}`}
                      className="rounded-2xl border border-[#0B3C5D]/70 bg-white dark:bg-black/40 p-2.5 text-sm text-black dark:text-white"
                    >
                      {editingNoteIndex === noteIndex ? (
                        <div className="space-y-2">
                          <textarea
                            value={editDraft}
                            onChange={(event) => setEditDraft(event.target.value)}
                            className="w-full min-h-[84px] rounded-2xl border border-[#0B3C5D]/70 bg-white dark:bg-black p-3 text-sm text-black dark:text-white focus:outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleSaveNote}
                              className="inline-flex items-center gap-2 bg-[#0B3C5D] border rounded-2xl border-[#0B3C5D] text-white px-4 py-2 text-sm transition-all duration-300"
                            >
                              <img src={editIcon} alt="Edit" className={iconImageClassName} />
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingNoteIndex(null);
                                setEditDraft("");
                              }}
                              className={iconButtonClassName}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <span className="flex-1">{note}</span>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEditNote(noteIndex)}
                              className={noteEditButtonClassName}
                            >
                              <img src={editIcon} alt="Edit" className={iconImageClassName} />
                              Update
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDeleteNoteIndex(noteIndex)}
                              className={noteDeleteButtonClassName}
                            >
                              <img src={deleteIcon} alt="Delete" className={iconImageClassName} />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>

              <section className={sectionCardClassName}>
                <h2 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Uploaded Documents</h2>
                <ul className="mt-3 space-y-2">
                  {selectedPatient.uploadedDocuments.map((doc) => {
                    const isSelected = doc.title === selectedDocument?.title;

                    return (
                      <li key={doc.title}>
                        <button
                          type="button"
                          onClick={() => handleOpenDocument(doc.title)}
                          className={`w-full rounded-2xl border p-2.5 text-left text-sm transition-all duration-200 ${
                            isSelected
                              ? "border-[#0B3C5D] bg-[#0B3C5D] text-white shadow-md"
                              : "border-[#0B3C5D]/70 bg-white dark:bg-black/40 text-black dark:text-white hover:bg-[#0B3C5D]/5 dark:hover:bg-[#0B3C5D]/20"
                          }`}
                        >
                          <div className="font-semibold">{doc.title}</div>
                          <div className={`text-xs ${isSelected ? "text-gray-100" : "text-gray-500 dark:text-gray-400"}`}>
                            {doc.type}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {selectedDocument && (
                  <div className="mt-4 rounded-2xl border border-[#0B3C5D]/70 p-4 text-sm text-black dark:text-white bg-white dark:bg-black/50">
                    <div className="font-semibold text-[#0B3C5D] dark:text-white">Opened Document</div>
                    <div className="mt-2">{selectedDocument.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedDocument.type}</div>
                    <p className="mt-3 leading-relaxed">{selectedDocument.summary}</p>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>

      {pendingDeleteNoteIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-5 shadow-2xl">
            <h3 className="text-xl font-bold text-[#0B3C5D] dark:text-white">Delete note?</h3>
            <p className="mt-3 text-sm text-black dark:text-white">
              This will permanently remove the selected doctor note. Do you want to continue?
            </p>
            <div className="mt-5 flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                onClick={() => setPendingDeleteNoteIndex(null)}
                className={iconButtonClassName}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteNote}
                className="inline-flex items-center gap-2 bg-[#0B3C5D] border rounded-2xl border-[#0B3C5D] text-white px-4 py-2 text-sm transition-all duration-300 hover:bg-red-700 hover:border-red-700"
              >
                <img src={deleteIcon} alt="Delete" className={iconImageClassName} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientProfilePage;

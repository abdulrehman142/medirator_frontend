import { jsPDF } from "jspdf";
import { useEffect, useMemo, useState } from "react";

import editIcon from "/medirator_images/edit.png";
import downloadIcon from "/medirator_images/download.png";
import saltsImg from "/medirator_images/salts.png";
import printIcon from "/medirator_images/print.png";

import DoctorPatientDropdown from "../../../components/DoctorPatientDropdown";
import { useDoctorPatient } from "../../../context/DoctorPatientContext";

interface PrescriptionPageProps {
  darkMode?: boolean;
}

interface PrescriptionRecord {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  createdAt: string;
}

const seedActivePrescription: PrescriptionRecord = {
  id: "active-1",
  medicineName: "Atorvastatin",
  dosage: "10mg",
  frequency: "Once at night",
  duration: "30 days",
  createdAt: "Today",
};

const seedPastPrescriptions: PrescriptionRecord[] = [
  {
    id: "past-1",
    medicineName: "Ibuprofen",
    dosage: "400mg",
    frequency: "Three times a day",
    duration: "3 days",
    createdAt: "Last week",
  },
  {
    id: "past-2",
    medicineName: "Vitamin D",
    dosage: "1000 IU",
    frequency: "Once a day",
    duration: "14 days",
    createdAt: "Two weeks ago",
  },
];

const PrescriptionPage = ({ darkMode = false }: PrescriptionPageProps) => {
  const { selectedPatient } = useDoctorPatient();
  const [prescriptionStore, setPrescriptionStore] = useState<Record<string, { current: PrescriptionRecord[]; past: PrescriptionRecord[] }>>({
    "PT-240318-07": {
      current: [seedActivePrescription],
      past: seedPastPrescriptions,
    },
    "PT-240402-11": {
      current: [
        {
          id: "active-2",
          medicineName: "Metformin",
          dosage: "500mg",
          frequency: "Twice a day",
          duration: "30 days",
          createdAt: "Today",
        },
      ],
      past: [
        {
          id: "past-3",
          medicineName: "Gliclazide",
          dosage: "80mg",
          frequency: "Once a day",
          duration: "14 days",
          createdAt: "Last month",
        },
      ],
    },
    "PT-240215-03": {
      current: [
        {
          id: "active-3",
          medicineName: "Salbutamol Inhaler",
          dosage: "2 puffs",
          frequency: "As needed",
          duration: "14 days",
          createdAt: "Today",
        },
      ],
      past: [
        {
          id: "past-4",
          medicineName: "Montelukast",
          dosage: "10mg",
          frequency: "Once a day",
          duration: "30 days",
          createdAt: "Two weeks ago",
        },
      ],
    },
  });
  const [formValues, setFormValues] = useState<Omit<PrescriptionRecord, "id" | "createdAt">>({
    medicineName: "",
    dosage: "",
    frequency: "",
    duration: "",
  });
  const [editTarget, setEditTarget] = useState<{ id: string; source: "current" | "past" } | null>(null);

  const currentPrescriptions = prescriptionStore[selectedPatient.id]?.current ?? [seedActivePrescription];
  const pastPrescriptions = prescriptionStore[selectedPatient.id]?.past ?? seedPastPrescriptions;

  const isFormComplete =
    formValues.medicineName.trim().length > 0 &&
    formValues.dosage.trim().length > 0 &&
    formValues.frequency.trim().length > 0 &&
    formValues.duration.trim().length > 0;

  const startNewPrescription = () => {
    setFormValues({
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
    });
    setEditTarget(null);
  };

  const savePrescription = () => {
    if (!isFormComplete) {
      return;
    }

    const now = new Date();
    const createdAt = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const nextPrescription: PrescriptionRecord = {
      id: `${now.getTime()}`,
      ...formValues,
      createdAt,
    };

    setPrescriptionStore((currentStore) => {
      const patientStore = currentStore[selectedPatient.id] ?? { current: [seedActivePrescription], past: seedPastPrescriptions };

      if (editTarget) {
        const nextCurrent =
          editTarget.source === "current"
            ? patientStore.current.map((prescription) =>
                prescription.id === editTarget.id
                  ? {
                      ...prescription,
                      ...formValues,
                      createdAt,
                    }
                  : prescription,
              )
            : patientStore.current;

        const nextPast =
          editTarget.source === "past"
            ? patientStore.past.map((prescription) =>
                prescription.id === editTarget.id
                  ? {
                      ...prescription,
                      ...formValues,
                      createdAt,
                    }
                  : prescription,
              )
            : patientStore.past;

        return {
          ...currentStore,
          [selectedPatient.id]: {
            current: nextCurrent,
            past: nextPast,
          },
        };
      }

      return {
        ...currentStore,
        [selectedPatient.id]: {
          ...patientStore,
          current: [...patientStore.current, nextPrescription],
        },
      };
    });

    setEditTarget(null);
    setFormValues({
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
    });
  };

  const loadForEdit = (prescription: PrescriptionRecord, source: "current" | "past") => {
    setFormValues({
      medicineName: prescription.medicineName,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration,
    });
    setEditTarget({ id: prescription.id, source });
  };

  const latestPrescription = currentPrescriptions[currentPrescriptions.length - 1] ?? null;

  useEffect(() => {
    setFormValues({
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
    });
    setEditTarget(null);
  }, [selectedPatient.id]);

  const buildPrescriptionPdf = (prescription: PrescriptionRecord) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Prescription", 20, 20);

    doc.setFontSize(12);
    doc.text(`Patient: ${selectedPatient.name} (${selectedPatient.id})`, 20, 32);
    doc.text(`Medicine: ${prescription.medicineName}`, 20, 44);
    doc.text(`Dosage: ${prescription.dosage}`, 20, 56);
    doc.text(`Frequency: ${prescription.frequency}`, 20, 68);
    doc.text(`Duration: ${prescription.duration}`, 20, 80);
    doc.text(`Created: ${prescription.createdAt}`, 20, 92);

    return doc;
  };

  const downloadPrescriptionPdf = (prescription: PrescriptionRecord) => {
    const doc = buildPrescriptionPdf(prescription);
    doc.save("prescription.pdf");
  };

  const printPrescriptionPdf = (prescription: PrescriptionRecord) => {
    const doc = buildPrescriptionPdf(prescription);
    doc.save("prescription.pdf");
  };

  const iconButtonClassName =
    "inline-flex items-center gap-2 bg-white border rounded-2xl border-[#0B3C5D] dark:bg-black hover:text-white dark:text-white hover:bg-[#0B3C5D] dark:hover:bg-gray-800 text-black px-4 py-2 text-sm transition-all duration-300";

  const iconImageClassName = "h-4 w-4 object-contain";

  const patientContextLabel = useMemo(
    () => `${selectedPatient.name} (${selectedPatient.id})`,
    [selectedPatient.id, selectedPatient.name],
  );

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 md:p-6 shadow-md gap-4">
        <div className="flex-1">
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">
            Prescription
          </h2>
          <p className="text-sm md:text-base text-center md:text-left ml-0 md:ml-5 md:pl-5 mt-2 text-gray-200">
            Fast prescription workflow for the active patient record.
          </p>
          <div className="ml-0 md:ml-5 md:pl-5 mt-3 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm text-white">
            For patient: {patientContextLabel}
          </div>
          <div className="ml-0 md:ml-5 md:pl-5 mt-3">
            <DoctorPatientDropdown darkMode={darkMode} />
          </div>
        </div>
        <img src={saltsImg} alt="Prescription" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="dark:text-white dark:bg-black font-sans px-3 md:px-6 py-6 space-y-6">
        <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 items-start">
          <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl shadow p-4 md:p-6 self-start">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Create Prescription</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Enter the medicine, dosage, frequency, and duration.
                </p>
              </div>
              <button
                type="button"
                className="bg-white border rounded-2xl border-[#0B3C5D] dark:bg-black hover:text-white dark:text-white hover:bg-[#0B3C5D] dark:hover:bg-gray-800 text-black px-4 py-2 text-sm transition-all duration-300"
                onClick={startNewPrescription}
              >
                Create
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2 text-sm text-black dark:text-white">
                <span>Medicine name</span>
                <input
                  value={formValues.medicineName}
                  onChange={(event) => setFormValues((current) => ({ ...current, medicineName: event.target.value }))}
                  placeholder="Type medicine name"
                  className="w-full rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-[#0B3C5D]"
                />
              </label>

              <label className="space-y-2 text-sm text-black dark:text-white">
                <span>Dosage</span>
                <input
                  value={formValues.dosage}
                  onChange={(event) => setFormValues((current) => ({ ...current, dosage: event.target.value }))}
                  placeholder="e.g. 500mg"
                  className="w-full rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-[#0B3C5D]"
                />
              </label>

              <label className="space-y-2 text-sm text-black dark:text-white">
                <span>Frequency</span>
                <input
                  value={formValues.frequency}
                  onChange={(event) => setFormValues((current) => ({ ...current, frequency: event.target.value }))}
                  placeholder="e.g. Twice a day"
                  className="w-full rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-[#0B3C5D]"
                />
              </label>

              <label className="space-y-2 text-sm text-black dark:text-white">
                <span>Duration</span>
                <input
                  value={formValues.duration}
                  onChange={(event) => setFormValues((current) => ({ ...current, duration: event.target.value }))}
                  placeholder="e.g. 7 days"
                  className="w-full rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black px-4 py-3 text-black dark:text-white outline-none focus:ring-2 focus:ring-[#0B3C5D]"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm transition ${
                  isFormComplete
                    ? "bg-[#0B3C5D] text-white hover:opacity-90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400"
                }`}
                onClick={savePrescription}
                disabled={!isFormComplete}
              >
                {editTarget ? <img src={editIcon} alt="Edit" className={iconImageClassName} /> : null}
                {editTarget ? "Edit" : "Save"}
              </button>
              <button
                type="button"
                className={iconButtonClassName}
                onClick={() => {
                  if (latestPrescription) {
                    downloadPrescriptionPdf(latestPrescription);
                  }
                }}
                disabled={!latestPrescription}
              >
                <img src={downloadIcon} alt="Download" className={iconImageClassName} />
                Download
              </button>
              <button
                type="button"
                className={iconButtonClassName}
                onClick={() => {
                  if (latestPrescription) {
                    printPrescriptionPdf(latestPrescription);
                  }
                }}
                disabled={!latestPrescription}
              >
                <img src={printIcon} alt="Print" className={iconImageClassName} />
                Print
              </button>
            </div>
          </div>

          <div className="space-y-4 self-start">
            <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl shadow p-4 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">
                    Current Prescriptions
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Tied to {patientContextLabel}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {currentPrescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="rounded-2xl border border-[#0B3C5D] p-4 bg-white dark:bg-black text-sm text-black dark:text-white"
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <div className="font-semibold">{prescription.medicineName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{prescription.createdAt}</div>
                      </div>
                      <button
                        type="button"
                        className={iconButtonClassName}
                        onClick={() => loadForEdit(prescription, "current")}
                      >
                        <img src={editIcon} alt="Edit" className={iconImageClassName} />
                        Edit
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div>Dosage: {prescription.dosage}</div>
                      <div>Frequency: {prescription.frequency}</div>
                      <div>Duration: {prescription.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl shadow p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-[#0B3C5D] dark:text-white">Past Prescriptions</h3>
              <div className="mt-4 space-y-3">
                {pastPrescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className="rounded-2xl border border-[#0B3C5D] p-4 bg-white dark:bg-black text-sm text-black dark:text-white"
                  >
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <div className="font-semibold">{prescription.medicineName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{prescription.createdAt}</div>
                      </div>
                      <button
                        type="button"
                        className={iconButtonClassName}
                        onClick={() => loadForEdit(prescription, "past")}
                      >
                        <img src={editIcon} alt="Edit" className={iconImageClassName} />
                        Edit
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div>Dosage: {prescription.dosage}</div>
                      <div>Frequency: {prescription.frequency}</div>
                      <div>Duration: {prescription.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrescriptionPage;

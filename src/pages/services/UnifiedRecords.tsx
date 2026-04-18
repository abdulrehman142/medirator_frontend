
import unifiedRecordsImg from "/medirator_images/records.png";

interface UnifiedRecordsProps {
  darkMode?: boolean;
}

const UnifiedRecords = ({ darkMode = false }: UnifiedRecordsProps) => {
  const unifiedSections = [
    {
      title: "Medical History",
      items: ["Type 2 Diabetes (since 2022)", "Seasonal Allergy", "Family history: Hypertension"],
    },
    {
      title: "Salts (Current)",
      items: ["Metformin 500 mg - Twice daily", "Losartan 50 mg - Once daily"],
    },
    {
      title: "Salts (Past)",
      items: ["Amoxicillin 500 mg", "Cetirizine 10 mg", "Omeprazole 20 mg"],
    },
    {
      title: "Appointments",
      items: ["Cardiology Follow-up - 06 Mar 2026", "General Physician - 18 Mar 2026"],
    },
    {
      title: "Test Reports",
      items: ["CBC - Normal", "Fasting Glucose - Attention", "Vitamin D - Low"],
    },
    {
      title: "AI Health Risks",
      items: ["Hypertension risk: High", "Diabetes progression risk: Moderate"],
    },
    {
      title: "Data Security",
      items: ["2-factor authentication enabled", "Last secure login: Today"],
    },
    {
      title: "Visualizer Summary",
      items: ["Blood pressure trend available", "Glucose trend available"],
    },
  ];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-6  shadow-md">
        <div>
          <h2 className="text-5xl font-bold">Unified Records</h2>
          <p className="mt-2">View everything in one unified platform.</p>
        </div>
        <img src={unifiedRecordsImg} alt="Unified Records" className="h-70 w-70" loading="lazy" />
      </div>

      <div className="bg-white dark:bg-black px-6 py-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-[#0B3C5D] dark:text-white">Patient Unified Overview</h3>
          <p className="mt-2 text-[#4B5563] dark:text-gray-300">
            All important patient information is consolidated here for quick review and better care decisions.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {unifiedSections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-5"
              >
                <h4 className="text-xl font-semibold text-[#0B3C5D] dark:text-white">{section.title}</h4>
                <ul className="mt-3 space-y-2 text-[#4B5563] dark:text-gray-300 text-sm">
                  {section.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedRecords;

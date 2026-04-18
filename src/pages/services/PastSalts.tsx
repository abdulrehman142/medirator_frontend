interface PastSaltsProps {
  darkMode?: boolean;
}

const PastSalts = ({ darkMode = false }: PastSaltsProps) => {
  const patientPastSalts = [
    { name: "Amoxicillin", dose: "500 mg", frequency: "Twice daily", period: "Jan 2024 - Feb 2024" },
    { name: "Cetirizine", dose: "10 mg", frequency: "Once at night", period: "Mar 2024 - Apr 2024" },
    { name: "Omeprazole", dose: "20 mg", frequency: "Once daily", period: "May 2024 - Jun 2024" },
  ];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="bg-white dark:bg-black px-6 py-8 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-[#0B3C5D] dark:text-white">Patient Past Salts</h2>
          <p className="mt-2 text-[#4B5563] dark:text-gray-300">
            Previously used salts and discontinued medications for patient history review.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {patientPastSalts.map((salt) => (
              <div
                key={`${salt.name}-${salt.period}`}
                className="rounded-xl border border-[#0B3C5D]/30 dark:border-white/20 bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-4"
              >
                <div className="font-semibold text-[#0B3C5D] dark:text-white">{salt.name}</div>
                <div className="text-sm text-[#4B5563] dark:text-gray-300 mt-1">
                  {salt.dose} • {salt.frequency}
                </div>
                <div className="text-xs mt-2 text-[#6B7280] dark:text-gray-400">{salt.period}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastSalts;

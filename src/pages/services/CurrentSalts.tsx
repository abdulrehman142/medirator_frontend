interface CurrentSaltsProps {
  darkMode?: boolean;
}

const CurrentSalts = ({ darkMode = false }: CurrentSaltsProps) => {
  const patientCurrentSalts = [
    { name: "Metformin", dose: "500 mg", frequency: "Twice daily", startedOn: "12 Jan 2025" },
    { name: "Losartan", dose: "50 mg", frequency: "Once daily", startedOn: "02 Feb 2025" },
    { name: "Vitamin D3", dose: "1000 IU", frequency: "Once daily", startedOn: "18 Feb 2025" },
  ];

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="bg-white dark:bg-black px-6 py-8 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-[#0B3C5D] dark:text-white">Patient Current Salts</h2>
          <p className="mt-2 text-[#4B5563] dark:text-gray-300">
            Active salts with ongoing dose and frequency details for current treatment.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {patientCurrentSalts.map((salt) => (
              <div
                key={`${salt.name}-${salt.startedOn}`}
                className="rounded-xl border border-[#0B3C5D]/30 dark:border-white/20 bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-4"
              >
                <div className="font-semibold text-[#0B3C5D] dark:text-white">{salt.name}</div>
                <div className="text-sm text-[#4B5563] dark:text-gray-300 mt-1">
                  {salt.dose} • {salt.frequency}
                </div>
                <div className="text-xs mt-2 text-[#6B7280] dark:text-gray-400">
                  Started on: {salt.startedOn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentSalts;

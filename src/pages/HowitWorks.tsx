import hiw from "/medirator_images/howitworks.png";

const HowitWorks = () => {
  return (
    <div className="dark:text-white dark:bg-black font-sans leading-relaxed">
      {/* Big Yellow Box */}
      <div className="flex justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-6 mb-6 shadow-md">
        <div className="">
          <h2 className="text-5xl font-bold ">How it Works</h2>
          <p className="mt-2">
            Medirator is designed to make healthcare <br />
            management simple, proactive, and <br />
            secure for patients and <br />
            families.
          </p>
        </div>
        <img src={hiw} alt="Banner" className="h-70 w-70" loading="lazy" />
      </div>
      <div className="flex flex-col items-center">
        <div className="flex flex-col w-100 p-2 m-2 items-center">
          <div className="text-[#5a6872] text-center border-2 dark:text-white rounded-full p-2 m-2 w-12 h-12">
            1
          </div>
          <div className="text-center text-xl font-bold p-1 m-1">Choose a Service</div>
          <div className="text-center text-[#5a6872] dark:text-white p-1 m-1">
            Browse healthcare services on Medirator such as Medical History, Salts, Health
            Risks, Appointments, Test Results, Unified Records, Data Security, and Visualizer.
          </div>
        </div>
        <div className="flex flex-col w-100 p-2 m-2 items-center">
          <div className="text-[#5a6872] text-center border-2 dark:text-white rounded-full p-2 m-2 w-12 h-12">
            2
          </div>
          <div className="text-center text-xl font-bold p-1 m-1">Add and Organize Your Data</div>
          <div className="text-center text-[#5a6872] dark:text-white p-1 m-1">
            Store your health information in one place — including medical history, salts,
            prescriptions, and test results — so nothing is scattered or lost.
          </div>
        </div>
        <div className="flex flex-col w-100 p-2 m-2 items-center">
          <div className="text-[#5a6872] text-center border-2 dark:text-white rounded-full p-2 m-2 w-12 h-12">
            3
          </div>
          <div className="text-center text-xl font-bold p-1 m-1">Get Smart Insights</div>
          <div className="text-center text-[#5a6872] dark:text-white p-1 m-1">
            Medirator uses explainable AI to highlight potential health risks early and support better
            discussions with doctors.
          </div>
        </div>
        <div className="flex flex-col w-100 p-2 m-2 items-center">
          <div className="text-[#5a6872] text-center border-2 dark:text-white rounded-full p-2 m-2 w-12 h-12">
            4
          </div>
          <div className="text-center text-xl font-bold p-1 m-1">Manage Appointments and Care</div>
          <div className="text-center text-[#5a6872] dark:text-white p-1 m-1">
            Track appointments, follow-up plans, and test updates in one place to keep your care
            journey smooth and consistent.
          </div>
        </div>
        <div className="flex flex-col w-100 p-2 m-2 items-center">
          <div className="text-[#5a6872] text-center dark:text-white border-2 rounded-full p-2 m-2 w-12 h-12">
            5
          </div>
          <div className="text-center text-xl font-bold p-1 m-1">Stay Protected and Informed</div>
          <div className="text-center text-[#5a6872] dark:text-white p-1 m-1">
            With unified records, secure access, and clear guidance, Medirator helps you stay informed
            and in control of your health.
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowitWorks;

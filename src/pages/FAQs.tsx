import helpImg from "/medirator_images/help.png";
import { useState } from "react";


const FAQs = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const faqData = [
    {
      id: 1,
      question: "What is Medirator?",
      answer:
        "Medirator is a digital healthcare assistant that helps you manage your medical history, salts information, health risks, appointments, test results, and records in one secure place.",
    },
    {
      id: 2,
      question: "How do I use Medirator services?",
      answer:
        "Open the app, choose a feature such as Medical History or Appointments, and follow the guided steps. You can also use the search bar on the home page to jump directly to a service.",
    },
    {
      id: 3,
      question: "Is my health data secure on Medirator?",
      answer:
        "Yes. Medirator applies privacy and security controls including protected access and secure handling of sensitive information.",
    },
    {
      id: 4,
      question: "Can Medirator help me track medications and salts?",
      answer:
        "Yes. The Salts and related record features help you track your medication information and avoid duplication issues.",
    },
    {
      id: 5,
      question: "Can I manage appointments in Medirator?",
      answer:
        "Yes. You can view, organize, and update appointment-related information from the Appointments section.",
    },
    {
      id: 6,
      question: "How does Medirator support proactive care?",
      answer:
        "Medirator includes Health Risks support to help identify concerns early so you can plan timely follow-up with healthcare professionals.",
    },
    {
      id: 7,
      question: "Can I access all my records in one place?",
      answer:
        "Yes. Unified Records brings your key health information together to make it easier to review and share when needed.",
    },
    {
      id: 8,
      question: "Is Medirator easy to use for non-technical users?",
      answer:
        "Yes. Medirator is designed with simple navigation and Visualizer support so both patients and families can use it comfortably.",
    },
    {
      id: 9,
      question: "Which services are available?",
      answer:
        "Medirator offers: Medical History, Salts, Health Risks, Appointments, Test Results, Unified Records, Data Security, and Visualizer.",
    },
  ];

  const toggleFAQ = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="dark:text-white dark:bg-black font-mono leading-relaxed">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 md:p-6 mb-6 shadow-md gap-4">
        <div className="">
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">
            FAQs
          </h2>
        </div>
        <img src={helpImg} alt="Banner" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      {/* FAQ Container */}
      <div className="max-w-4xl mx-auto px-3 md:px-4 py-6 md:py-8">
        <div className="space-y-3 md:space-y-4">
          {faqData.map((faq) => (
            <div
              key={faq.id}
              className="group border-2 border-gray-300 dark:border-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl  dark:hover:border-gray-500"
            >
              {/* Question - Clickable Header */}
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex items-center justify-between bg-white dark:bg-[#0B3C5D] p-3 md:p-4 group-hover:bg-gray-800 dark:group-hover:bg-gray-800  transition-all duration-300 cursor-pointer"
              >
                <span className="text-sm md:text-lg font-semibold text-[#0B3C5D] group-hover:text-white dark:text-white transition-all duration-300 text-left">
                  {faq.question}
                </span>
                <span
                  className={`ml-2 md:ml-4 flex-shrink-0 text-[#0B3C5D] group-hover:text-white dark:text-white dark:group-hover:text-white transform transition-all duration-500 text-sm md:text-base ${
                    expandedId === faq.id
                      ? "rotate-180 scale-125"
                      : "scale-100 group-hover:scale-110"
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* Answer - Collapsible Content with Smooth Animation */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  expandedId === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-3 md:p-4 border-2 border-gray-300">
                  <p className="text-sm md:text-base text-black dark:text-white">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;

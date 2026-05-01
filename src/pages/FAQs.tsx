import helpImg from "/medirator_images/help.png";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";


const FAQs = () => {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const faqData = [
    {
      id: 1,
      question: t("faq", "question1", "What is Medirator?"),
      answer: t(
        "faq",
        "answer1",
        "Medirator is a digital healthcare assistant that helps you manage your family history, salts information, health risks, appointments, test reports, and records in one secure place."
      ),
    },
    {
      id: 2,
      question: t("faq", "question2", "How do I use Medirator services?"),
      answer: t(
        "faq",
        "answer2",
        "Open the app, choose a feature such as Family History or Appointments, and follow the guided steps. You can also use the search bar on the home page to jump directly to a service."
      ),
    },
    {
      id: 3,
      question: t("faq", "question3", "Is my health data secure on Medirator?"),
      answer: t(
        "faq",
        "answer3",
        "Yes. Medirator applies privacy and security controls including protected access and secure handling of sensitive information."
      ),
    },
    {
      id: 4,
      question: t("faq", "question4", "Can Medirator help me track medications and salts?"),
      answer: t(
        "faq",
        "answer4",
        "Yes. The Salts and related record features help you track your medication information and avoid duplication issues."
      ),
    },
    {
      id: 5,
      question: t("faq", "question5", "Can I manage appointments in Medirator?"),
      answer: t(
        "faq",
        "answer5",
        "Yes. You can view, organize, and update appointment-related information from the Appointments section."
      ),
    },
    {
      id: 6,
      question: t("faq", "question6", "How does Medirator support proactive care?"),
      answer: t(
        "faq",
        "answer6",
        "Medirator includes Health Risks support to help identify concerns early so you can plan timely follow-up with healthcare professionals."
      ),
    },
    {
      id: 7,
      question: t("faq", "question7", "Can I access all my records in one place?"),
      answer: t(
        "faq",
        "answer7",
        "Yes. Medirator brings your key health information together to make it easier to review and share when needed."
      ),
    },
    {
      id: 8,
      question: t("faq", "question8", "Is Medirator easy to use for non-technical users?"),
      answer: t(
        "faq",
        "answer8",
        "Yes. Medirator is designed with simple navigation and Visualizer support so both patients and families can use it comfortably."
      ),
    },
    {
      id: 9,
      question: t("faq", "question9", "Which services are available?"),
      answer: t(
        "faq",
        "answer9",
        "Medirator offers: Family History, Salts, Health Risks, Appointments, Test Reports, and Visualizer."
      ),
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
            {t("faq", "title", "FAQs")}
          </h2>
        </div>
        <img src={helpImg} alt={t("faq", "bannerAlt", "Banner")} className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
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

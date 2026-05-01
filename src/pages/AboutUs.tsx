import au from "/medirator_images/aboutus-bg.png";
import dau from "/medirator_images/darkabout-us.png";
import reliability from "/medirator_images/reliability.png";
import experience from "/medirator_images/experience.png";
import trust from "/medirator_images/trust.png";
import accessibility from "/medirator_images/accesibility.png";
import { useLanguage } from "../context/LanguageContext";
const AboutUs = () => {
  const { t } = useLanguage();
  return (
    <div className="font-sans leading-relaxed bg-white dark:bg-black text-black dark:text-white">
      <div className="p-6">
        <img
          src={au}
          alt="About Us Banner"
          className="block dark:hidden w-full"
          loading="lazy"
        />
        <img
          src={dau}
          alt="About Us Banner"
          className="hidden dark:block w-full"
          loading="lazy"
        />
      </div>
      <div className="p-6 dark:bg-black dark:text-white">
        <h1 className="text-3xl font-bold mb-6">{t("auth", "aboutMedirator", "About Medirator")}</h1>

        <p className="mb-4 leading-relaxed">
          {t("auth", "aboutIntro1", "We are a next-generation AI-powered healthcare platform dedicated to making healthcare smarter, safer, and more accessible.")}
        </p>

        <p className="mb-4 leading-relaxed">
          {t("auth", "aboutIntro2", "Our platform brings together complete patient records, doctor information, medical tests, and appointments into a unified system designed for predictive and preventive care.")}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("auth", "aiPoweredClinicalIntelligence", "AI-Powered Clinical Intelligence")}</h2>
        <p className="mb-4 leading-relaxed">
          {t("auth", "aboutClinicalParagraph", "Unlike traditional healthcare systems that store only basic patient data in fragmented silos, Medirator provides intelligent insights using explainable AI to help doctors identify potential health risks early and make informed decisions.")}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("auth", "comprehensiveCareManagement", "Comprehensive Care Management")}</h2>
        <p className="mb-4 leading-relaxed">
          {t("auth", "aboutCareParagraph", "Medirator also supports comprehensive medication management, including detailed information about medicines, salts, and pharmaceutical companies, reducing the risk of duplication and harmful interactions.")}
        </p>

        <p className="mb-4 leading-relaxed">
          {t("auth", "aboutPatientsParagraph", "Patients benefit from user-friendly and adaptive interfaces that simplify medical data, making it easier to understand their own health history.")}
        </p>

        <ul className="list-disc pl-6 mb-4 leading-relaxed">
          <li>Family History</li>
          <li>Salts and medication tracking</li>
          <li>Health Risks insights</li>
            <li>Appointments and Test Reports management</li>
          <li>Visualizer for clear health data insights</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("auth", "privacyAndSecurity", "Privacy and Security")}</h2>
        <p className="mb-4 leading-relaxed">
          {t("auth", "aboutPrivacyParagraph", "We follow a privacy-first approach. Sensitive health information is protected with secure access controls and responsible data handling.")}
        </p>

        <ul className="list-disc pl-6 mb-4 leading-relaxed">
          <li>Protected user accounts</li>
          <li>Controlled access to sensitive data</li>
          <li>Continuous security and reliability improvements</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("auth", "ourMission", "Our Mission")}</h2>
        <p className="mb-4 leading-relaxed">
          {t("auth", "aboutMissionParagraph", "At the core of our mission is proactive healthcare — leveraging technology and AI to improve patient safety, reduce doctors’ workload, and provide a seamless healthcare experience for everyone.")}
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">{t("auth", "whatWeStandFor", "What We Stand For")}</h2>
        <p className="mb-4 leading-relaxed">
          {t("auth", "aboutStandForParagraph", "We combine innovation, security, and accessibility to redefine how healthcare is delivered.")}
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">{t("auth", "coreServices", "Core Services")}</h3>
        <ul className="list-disc pl-6 mb-4 leading-relaxed">
          <li>Family History</li>
          <li>Salts</li>
          <li>Health Risks</li>
          <li>Appointments</li>
            <li>Test Reports</li>
            <li>Security</li>
          <li>Visualizer</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">{t("auth", "userExperienceFocus", "User Experience Focus")}</h3>
        <p className="mb-4 leading-relaxed">{t("auth", "weDesignMediratorToBe", "We design Medirator to be:")}</p>

        <ul className="list-disc pl-6 mb-4 leading-relaxed">
          <li>Simple for everyday use</li>
          <li>Reliable for long-term record keeping</li>
          <li>Clear for both patients and family members</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">{t("auth", "ourCommitment", "Our Commitment")}</h3>
        <ul className="list-disc pl-6 mb-4 leading-relaxed">
          <li>Secure health data handling</li>
          <li>Patient-centered feature design</li>
          <li>Continuous product improvement based on user needs</li>
        </ul>
      </div>
      <div className="flex flex-wrap justify-between gap-4 p-6 dark:bg-black bg-white">
        <div className="flex flex-col items-center w-70 h-70 bg-[#f4f4f5] dark:bg-[#1a1a1a] rounded-2xl">
          <div className="mt-4">
            <img
              src={reliability}
              alt="Supervised service"
              className="h-20 w-20"
              loading="lazy"
            />
          </div>
          <div className="mt-2 font-bold text-2xl dark:text-white">{t("auth", "reliableHealthData", "Reliable Health Data")}</div>
          <div className="text-center text-[#94a2b3] dark:text-gray-300 p-4">
            {t("auth", "reliableHealthDataDesc", "We prioritize structured and dependable health information so users can trust what they see in the app.")}
          </div>
        </div>
        <div className="flex flex-col items-center w-70 h-70 bg-[#f4f4f5] dark:bg-[#1a1a1a] rounded-2xl">
          <div className="mt-4">
            <img
              src={experience}
              alt="Supervised service"
              className="h-20 w-20"
              loading="lazy"
            />
          </div>
          <div className="mt-2 font-bold text-2xl dark:text-white">{t("auth", "guidedExperience", "Guided Experience")}</div>
          <div className="text-center text-[#94a2b3] dark:text-gray-300 p-4">
            {t("auth", "guidedExperienceDesc", "Visualizer is built into Medirator so users can understand health trends and progress with clarity and confidence.")}
          </div>
        </div>
        <div className="flex flex-col items-center w-70 h-70 bg-[#f4f4f5] dark:bg-[#1a1a1a] rounded-2xl">
          <div className="mt-4">
            <img
              src={trust}
              alt="Supervised service"
              className="h-20 w-20"
              loading="lazy"
            />
          </div>
          <div className="mt-2 font-bold text-2xl dark:text-white">{t("auth", "trustedPlatform", "Trusted Platform")}</div>
          <div className="text-center text-[#94a2b3] dark:text-gray-300 p-4">
            {t("auth", "trustedPlatformDesc", "Medirator keeps records, reports, and appointments unified for dependable healthcare management.")}
          </div>
        </div>
        <div className="flex flex-col items-center w-70 h-70 bg-[#f4f4f5] dark:bg-[#1a1a1a] rounded-2xl">
          <div className="mt-4">
            <img
              src={accessibility}
              alt="Supervised service"
              className="h-20 w-20"
              loading="lazy"
            />
          </div>
          <div className="mt-2 font-bold text-2xl dark:text-white">{t("auth", "accessibleForEveryone", "Accessible for Everyone")}</div>
          <div className="text-center text-[#94a2b3] dark:text-gray-300 p-4">
            {t("auth", "accessibleForEveryoneDesc", "We focus on a simple and inclusive interface so patients and families from all backgrounds can use Medirator with ease.")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

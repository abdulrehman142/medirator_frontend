import tc from "/medirator_images/termsCondition.svg";
import { useLanguage } from "../context/LanguageContext";

const TermsAndConditions = () => {
  const { t } = useLanguage();

  const eligibilityItems = [
    t("legal", "termsEligibility1", "You must provide accurate and up-to-date account information."),
    t("legal", "termsEligibility2", "You are responsible for maintaining the confidentiality of your login credentials."),
    t("legal", "termsEligibility3", "You must promptly notify us if you suspect unauthorized account access."),
    t("legal", "termsEligibility4", "If you use Medirator on behalf of another person (e.g., dependent), you confirm you are authorized to do so."),
  ];

  const serviceItems = [
    t("legal", "termsService1", "Store and view personal health information you choose to upload."),
    t("legal", "termsService2", "Track appointments, reports, and medication-related details."),
    t("legal", "termsService3", "Receive reminders, educational content, and health-related insights."),
    t("legal", "termsService4", "Risk indicators and recommendations are informational and are not a diagnosis or treatment plan."),
    t("legal", "termsService5", "In emergencies, contact local emergency services or a licensed healthcare professional immediately."),
  ];

  const responsibilityItems = [
    t("legal", "termsResp1", "Use the platform lawfully and ethically."),
    t("legal", "termsResp2", "Do not upload false, misleading, or harmful medical information."),
    t("legal", "termsResp3", "Do not attempt to disrupt, reverse engineer, or misuse the platform."),
    t("legal", "termsResp4", "Consult licensed medical professionals for clinical decisions."),
  ];

  const privacyItems = [
    t("legal", "termsPrivacy1", "We collect and process personal and health-related information as described in our Privacy Policy."),
    t("legal", "termsPrivacy2", "By using the platform, you consent to the collection and processing of your data for account management, platform features, and service improvement."),
    t("legal", "termsPrivacy3", "You may request account and data deletion through app settings or by contacting mediratorinfo@gmail.com."),
  ];

  const ipItems = [
    t("legal", "termsIp1", "All platform content, branding, and software are owned by or licensed to Medirator."),
    t("legal", "termsIp2", "You may not copy, distribute, or commercially use platform content without permission."),
  ];

  const paymentItems = [
    t("legal", "termsPayment1", "Some features may require paid subscriptions or service fees."),
    t("legal", "termsPayment2", "Applicable fees, billing cycle, and renewal terms will be shown before payment."),
    t("legal", "termsPayment3", "Unless required by law, paid fees are non-refundable after successful activation."),
  ];

  const availabilityItems = [
    t("legal", "termsAvailability1", "We may modify, suspend, or discontinue features at any time."),
    t("legal", "termsAvailability2", "Scheduled maintenance or technical issues may temporarily affect availability."),
    t("legal", "termsAvailability3", "We may release updates to improve security, performance, and usability."),
  ];

  const medicalAdviceItems = [
    t("legal", "termsMedical1", "Medirator does not provide direct medical diagnosis, prescriptions, or treatment."),
    t("legal", "termsMedical2", "Information shown in the app is for organizational and informational use and should be verified with healthcare professionals."),
  ];

  const liabilityItems = [
    t("legal", "termsLiability1", "To the maximum extent permitted by law, Medirator is not liable for indirect, consequential, or incidental damages resulting from platform use."),
    t("legal", "termsLiability2", "You remain responsible for healthcare decisions made without consulting licensed professionals."),
  ];

  return (
    <div className="dark:text-white dark:bg-black font-sans leading-relaxed">
      <div className="flex justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-6 mb-6 shadow-md gap-4">
        <div>
          <h2 className="text-5xl font-bold">{t("legal", "termsTitle", "Terms & Conditions")}</h2>
          <p className="mt-2">
            {t(
              "legal",
              "termsHeroText",
              "All the terms and conditions of Medirator are listed below. Please feel free to contact us in case of any confusion."
            )}
          </p>
        </div>
        <img src={tc} alt={t("legal", "termsTitle", "Terms & Conditions")} className="h-70 w-70" loading="lazy" />
      </div>

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">{t("legal", "termsPageTitle", "Medirator Terms & Conditions")}</h1>

        <p className="mb-4">
          {t(
            "legal",
            "termsIntro",
            "Welcome to Medirator. By accessing or using our healthcare application, website, or related services, you agree to these Terms & Conditions. If you do not agree, please stop using the platform. For support, contact us at"
          )}{" "}
          <a href="mailto:mediratorinfo@gmail.com" className="underline">
            mediratorinfo@gmail.com
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("legal", "termsSection1Title", "1. About Medirator")}</h2>
        <p className="mb-4">{t("legal", "termsAboutBody", "Medirator is a digital healthcare platform that helps patients manage records, appointments, medication information, and related health workflows. Medirator is a technology platform and does not replace professional medical judgment or emergency medical services.")}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("legal", "termsSection2Title", "2. Eligibility and Accounts")}</h2>
        <ul className="list-disc list-inside mb-4">
          {eligibilityItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("legal", "termsSection3Title", "3. Scope of Healthcare App Services")}</h2>
        <ul className="list-disc list-inside mb-4">
          {serviceItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("legal", "termsSection4Title", "4. User Responsibilities")}</h2>
        <ul className="list-disc list-inside mb-4">
          {responsibilityItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("legal", "termsSection5Title", "5. Privacy and Health Data")}</h2>
        <ul className="list-disc list-inside mb-4">
          {privacyItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("legal", "termsSection6Title", "6. Intellectual Property")}</h2>
        <ul className="list-disc list-inside mb-4">
          {ipItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("legal", "termsSection7Title", "7. Payments and Subscriptions (If Applicable)")}</h2>
        <ul className="list-disc list-inside mb-4">
          {paymentItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("legal", "termsSection8Title", "8. Availability and Updates")}</h2>
        <ul className="list-disc list-inside mb-4">
          {availabilityItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("legal", "termsSection9Title", "9. Disclaimer of Medical Advice")}</h2>
        <ul className="list-disc list-inside mb-4">
          {medicalAdviceItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("legal", "termsSection10Title", "10. Limitation of Liability")}</h2>
        <ul className="list-disc list-inside mb-4">
          {liabilityItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("legal", "termsSection11Title", "11. Account Suspension or Termination")}</h2>
        <p className="mb-4">{t("legal", "termsSuspensionBody", "We may suspend or terminate accounts that violate these terms, misuse platform features, or create security or legal risks.")}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">{t("legal", "termsSection12Title", "12. Changes to Terms")}</h2>
        <p className="mb-4">{t("legal", "termsChangesBody", "Medirator reserves the right to revise these terms at any time. Users are encouraged to review the terms regularly.")}</p>

        <p className="mt-6">{t("legal", "termsClosing", "By continuing to use Medirator, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.")}</p>
      </div>
    </div>
  );
};

export default TermsAndConditions;

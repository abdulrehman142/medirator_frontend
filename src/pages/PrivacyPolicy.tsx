import tc from "/medirator_images/termsCondition.svg";
import { useLanguage } from "../context/LanguageContext";

const PrivacyPolicy = () => {
  const { t } = useLanguage();

  const collectionItems = [
    t("legal", "privacyCollectionName", "Name"),
    t("legal", "privacyCollectionPhone", "Phone Number"),
    t("legal", "privacyCollectionEmail", "Email Address"),
    t("legal", "privacyCollectionProfile", "Date of birth, gender, and profile details (if provided)"),
    t("legal", "privacyCollectionMedical", "Medical history, allergies, medications, lab reports, and appointment notes (if provided)"),
    t("legal", "privacyCollectionDevice", "Device information, app usage data, and diagnostic logs"),
  ];

  const usageItems = [
    t("legal", "privacyUseAccount", "Create and manage user accounts"),
    t("legal", "privacyUseRecords", "Enable health record organization and patient-facing features"),
    t("legal", "privacyUseAlerts", "Provide reminders, alerts, and care-related notifications"),
    t("legal", "privacyUseQuality", "Improve platform safety, reliability, and performance"),
    t("legal", "privacyUseCompliance", "Comply with legal, regulatory, and security obligations"),
  ];

  const deletionItems = [
    t("legal", "privacyDeleteApp", "The in-app Delete Account option"),
    t("legal", "privacyDeleteEmail", "Email: mediratorinfo@gmail.com"),
    t("legal", "privacyDeleteForm", "Contact Form: https://medirator.com/contact-us"),
  ];

  const locationItems = [
    t("legal", "privacyLocation1", "Improve address convenience for healthcare scheduling features"),
    t("legal", "privacyLocation2", "Enable region-specific health support experiences"),
    t("legal", "privacyLocation3", "Enhance fraud detection and account protection"),
  ];

  return (
    <div className="dark:text-white dark:bg-black font-sans leading-relaxed">
      <div className="flex justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-6 mb-6 shadow-md gap-4">
        <div>
          <h2 className="text-5xl font-bold">{t("legal", "privacyTitle", "Privacy Policy")}</h2>
          <p className="mt-2">
            {t(
              "legal",
              "privacyHeroText",
              "By accessing or using the Platform, you agree to this Policy. If you do not agree to this policy, please do not access or use the platform."
            )}
          </p>
        </div>
        <img src={tc} alt={t("legal", "privacyTitle", "Privacy Policy")} className="h-70 w-70" loading="lazy" />
      </div>

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">{t("legal", "privacyTitle", "Privacy Policy")}</h1>

        <p className="mb-4">
          {t(
            "legal",
            "privacyIntro1",
            "This Privacy Policy explains how Medirator collects, uses, stores, and protects personal and health-related information when you use our healthcare application and website."
          )}
        </p>

        <p className="mb-4">
          {t(
            "legal",
            "privacyIntro2",
            "This Privacy Policy explains how Medirator collects, uses, discloses, and protects your personal information when you use the Medirator mobile application or website (Platform). By accessing or using the Platform, you agree to the terms of this Privacy Policy and the Medirator User Agreement. If you are using Medirator on behalf of a minor or dependent, you confirm you are legally authorized to do so."
          )}
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          {t("legal", "privacySection1Title", "1. Collection and Use of Personal Information")}
        </h2>

        <h3 className="text-xl font-semibold mt-4 mb-2">
          {t("legal", "privacyCollectSubtitle", "a) Information We Collect")}
        </h3>
        <p className="mb-4">
          {t(
            "legal",
            "privacyCollectBody",
            "Medirator may collect the following information from users who create an account or use the Platform:"
          )}
        </p>
        <ul className="list-disc ml-6 mb-4">
          {collectionItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mt-4 mb-2">
          {t("legal", "privacyUseSubtitle", "b) How We Use Your Information")}
        </h3>
        <p className="mb-4">{t("legal", "privacyUseBody", "Medirator uses this information to:")}</p>
        <ul className="list-disc ml-6 mb-4">
          {usageItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="text-xl font-semibold mt-4 mb-2">
          {t("legal", "privacyDeleteSubtitle", "c) Data Deletion Requests")}
        </h3>
        <p className="mb-4">{t("legal", "privacyDeleteBody", "Users may request deletion of their personal data via:")}</p>
        <ul className="list-disc ml-6 mb-4">
          {deletionItems.map((item) => {
            if (item.includes("@")) {
              return (
                <li key={item}>
                  <a href="mailto:mediratorinfo@gmail.com" className="underline">
                    mediratorinfo@gmail.com
                  </a>
                </li>
              );
            }
            if (item.includes("contact-us")) {
              return (
                <li key={item}>
                  <a href="https://medirator.com/contact-us" className="underline">
                    https://medirator.com/contact-us
                  </a>
                </li>
              );
            }
            return <li key={item}>{item}</li>;
          })}
        </ul>
        <p className="mb-4">{t("legal", "privacyDeleteAfterBody", "When deletion is requested, we remove or anonymize data except where retention is required by law, security, fraud prevention, or legitimate operational purposes.")}</p>

        <h3 className="text-xl font-semibold mt-4 mb-2">
          {t("legal", "privacySocialLoginsTitle", "d) Unlinking Social Logins")}
        </h3>
        <p className="mb-4">
          {t("legal", "privacySocialLoginsBody", "Users who signed in using Google or Facebook can unlink their accounts via the account settings. All linked data will be deleted.")}
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-2">
          {t("legal", "privacyLocationTitle", "e) Optional Location Data")}
        </h3>
        <p className="mb-4">{t("legal", "privacyLocationBody", "If you grant permission, Medirator may use location data to:")}</p>
        <ul className="list-disc ml-6 mb-4">
          {locationItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          {t("legal", "privacyCookiesTitle", "2. Cookies and Anonymous Identifiers")}
        </h2>
        <p className="mb-4">{t("legal", "privacyCookiesBody", "The Platform may use cookies and similar technologies to remember preferences, secure sessions, analyze traffic, and improve user experience.")}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          {t("legal", "privacyProtectTitle", "3. Protecting Your Personal Information")}
        </h2>
        <p className="mb-4">{t("legal", "privacyProtectBody", "We use technical and organizational safeguards such as encryption, secure storage, access controls, and monitoring to reduce unauthorized access, use, or disclosure risks.")}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          {t("legal", "privacySharingTitle", "4. Third-Party Sharing")}
        </h2>
        <p className="mb-4">{t("legal", "privacySharingBody", "We do not sell personal or health data. We may share limited information with trusted service providers (e.g., infrastructure, analytics, customer support) under contractual privacy and security obligations.")}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          {t("legal", "privacyMarketingTitle", "5. Marketing")}
        </h2>
        <p className="mb-4">{t("legal", "privacyMarketingBody", "You may receive updates, feature notices, and health-related platform announcements by email, SMS, or push notifications. You can opt out of marketing communications, but essential account and security communications cannot be disabled.")}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          {t("legal", "privacyAdministrativeTitle", "6. Administrative Communications")}
        </h2>
        <p className="mb-4">{t("legal", "privacyAdministrativeBody", "We may send important notices regarding account activity, security events, policy updates, and service continuity. These communications are required for safe platform use.")}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          {t("legal", "privacyAccessTitle", "7. Accessing and Updating Personal Information")}
        </h2>
        <p className="mb-4">{t("legal", "privacyAccessBody", "You may access, edit, or delete your personal information unless retention is required by law. Deletion may not be immediate in backup or disaster-recovery systems. Requests can be made via")}{" "}
          <strong>
            <a href="mailto:mediratorinfo@gmail.com" className="underline">
              mediratorinfo@gmail.com
            </a>
          </strong>
          .
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          {t("legal", "privacyConcernsTitle", "8. Privacy Concerns")}
        </h2>
        <p className="mb-4">{t("legal", "privacyConcernsBody", "If you have concerns about how Medirator handles your data, you can contact us via email or the contact form. For formal complaints, Medirator will follow up accordingly.")}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          {t("legal", "privacyRetentionTitle", "9. Data Retention")}
        </h2>
        <p className="mb-4">{t("legal", "privacyRetentionBody", "We retain personal and health-related data only for as long as necessary to provide platform services, meet legal obligations, resolve disputes, and enforce agreements.")}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          {t("legal", "privacyChildrenTitle", "10. Children and Dependents")}
        </h2>
        <p className="mb-4">{t("legal", "privacyChildrenBody", "If data is submitted for a minor or dependent, the submitting user confirms they are an authorized parent, guardian, or legal representative.")}</p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          {t("legal", "privacyChangesTitle", "11. Changes to This Policy")}
        </h2>
        <p className="mb-4">{t("legal", "privacyChangesBody", "We may update this Privacy Policy from time to time. Updated versions will be posted on this page with effect from the date of publication.")}</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

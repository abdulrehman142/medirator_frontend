import tc from "/medirator_images/termsCondition.svg";
// (no local state required; dark mode is handled globally)

const TermsAndConditions = () => {
  return (
    <div className="dark:text-white dark:bg-black font-sans">
      <div className="flex justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-6 mb-6 shadow-md">
        <div className="">
          <h2 className="text-5xl font-bold ">Terms & Conditions</h2>
          <p className="mt-2">
            All the terms and conditions of Medirator are listed below. Please
            <br /> feel free to contact us in case of any confusion.
          </p>
        </div>
        <img src={tc} alt="Banner" className="h-70 w-70" loading="lazy" />
      </div>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Medirator Terms & Conditions</h1>

        <p className="mb-4">
          Welcome to Medirator. By accessing or using our healthcare application, website, or related
          services, you agree to these Terms & Conditions. If you do not agree, please stop using the
          platform. For support, contact us at{" "}
          <a href="mailto:mediratorinfo@gmail.com" className="underline">
            mediratorinfo@gmail.com
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. About Medirator</h2>
        <p className="mb-4">
          Medirator is a digital healthcare platform that helps patients manage records, appointments,
          medication information, and related health workflows. Medirator is a technology platform and
          does not replace professional medical judgment or emergency medical services.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. Eligibility and Accounts</h2>
        <ul className="list-disc list-inside mb-4">
          <li>You must provide accurate and up-to-date account information.</li>
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
          <li>You must promptly notify us if you suspect unauthorized account access.</li>
          <li>
            If you use Medirator on behalf of another person (e.g., dependent), you confirm you are
            authorized to do so.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. Scope of Healthcare App Services</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Store and view personal health information you choose to upload.</li>
          <li>Track appointments, reports, and medication-related details.</li>
          <li>Receive reminders, educational content, and health-related insights.</li>
          <li>
            Risk indicators and recommendations are informational and are not a diagnosis or treatment
            plan.
          </li>
          <li>
            In emergencies, contact local emergency services or a licensed healthcare professional
            immediately.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. User Responsibilities</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Use the platform lawfully and ethically.</li>
          <li>Do not upload false, misleading, or harmful medical information.</li>
          <li>Do not attempt to disrupt, reverse engineer, or misuse the platform.</li>
          <li>Consult licensed medical professionals for clinical decisions.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Privacy and Health Data</h2>
        <ul className="list-disc list-inside mb-4">
          <li>
            We collect and process personal and health-related information as described in our Privacy
            Policy.
          </li>
          <li>
            By using the platform, you consent to the collection and processing of your data for
            account management, platform features, and service improvement.
          </li>
          <li>
            You may request account and data deletion through app settings or by contacting{" "}
            <a href="mailto:mediratorinfo@gmail.com" className="underline">
              mediratorinfo@gmail.com
            </a>
            .
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Intellectual Property</h2>
        <ul className="list-disc list-inside mb-4">
          <li>All platform content, branding, and software are owned by or licensed to Medirator.</li>
          <li>You may not copy, distribute, or commercially use platform content without permission.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. Payments and Subscriptions (If Applicable)</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Some features may require paid subscriptions or service fees.</li>
          <li>Applicable fees, billing cycle, and renewal terms will be shown before payment.</li>
          <li>Unless required by law, paid fees are non-refundable after successful activation.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">8. Availability and Updates</h2>
        <ul className="list-disc list-inside mb-4">
          <li>We may modify, suspend, or discontinue features at any time.</li>
          <li>Scheduled maintenance or technical issues may temporarily affect availability.</li>
          <li>We may release updates to improve security, performance, and usability.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">9. Disclaimer of Medical Advice</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Medirator does not provide direct medical diagnosis, prescriptions, or treatment.</li>
          <li>
            Information shown in the app is for organizational and informational use and should be
            verified with healthcare professionals.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">10. Limitation of Liability</h2>
        <ul className="list-disc list-inside mb-4">
          <li>
            To the maximum extent permitted by law, Medirator is not liable for indirect,
            consequential, or incidental damages resulting from platform use.
          </li>
          <li>
            You remain responsible for healthcare decisions made without consulting licensed
            professionals.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">11. Account Suspension or Termination</h2>
        <p className="mb-4">
          We may suspend or terminate accounts that violate these terms, misuse platform features, or
          create security or legal risks.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">12. Changes to Terms</h2>
        <p className="mb-4">
          Medirator reserves the right to revise these terms at any time. Users are encouraged to
          review the terms regularly.
        </p>

        <p className="mt-6">
          By continuing to use Medirator, you acknowledge that you have read, understood, and agreed
          to these Terms & Conditions.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;

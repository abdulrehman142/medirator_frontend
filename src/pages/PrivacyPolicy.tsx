import tc from "/medirator_images/termsCondition.svg";

const PrivacyPolicy = () => {
  return (
    <div className="dark:text-white dark:bg-black font-sans leading-relaxed">
      {/* Big Yellow Box */}
      <div className="flex justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-6 mb-6 shadow-md">
        <div className="">
          <h2 className="text-5xl font-bold ">Privacy Policy</h2>
          <p className="mt-2">
            By accessing or using the Platform, you agree to this Policy. If you do
            <br /> not agree to this policy, please do not access or use the platform.
          </p>
        </div>
        <img src={tc} alt="Banner" className="h-70 w-70" loading="lazy" />
      </div>
      <div className="p-6 ">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

        <p className="mb-4">
          This Privacy Policy explains how Medirator collects, uses, stores, and protects personal and
          health-related information when you use our healthcare application and website.
        </p>

        <p className="mb-4">
          This Privacy Policy explains how <strong>Medirator</strong> collects, uses, discloses, and
          protects your personal information when you use the Medirator mobile application or website
          (“Platform”). By accessing or using the Platform, you agree to the terms of this Privacy
          Policy and the Medirator User Agreement. If you are using Medirator on behalf of a minor or
          dependent, you confirm you are legally authorized to do so.
        </p>

        {/* 1. Collection and Use of Personal Information */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">
          1. Collection and Use of Personal Information
        </h2>

        <h3 className="text-xl font-semibold mt-4 mb-2">a) Information We Collect</h3>
        <p className="mb-4">
          Medirator may collect the following information from users who create an account or use the
          Platform:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Name</li>
          <li>Phone Number</li>
          <li>Email Address</li>
          <li>Date of birth, gender, and profile details (if provided)</li>
          <li>Medical history, allergies, medications, lab reports, and appointment notes (if provided)</li>
          <li>Device information, app usage data, and diagnostic logs</li>
        </ul>

        <h3 className="text-xl font-semibold mt-4 mb-2">b) How We Use Your Information</h3>
        <p className="mb-4">Medirator uses this information to:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>Create and manage user accounts</li>
          <li>Enable health record organization and patient-facing features</li>
          <li>Provide reminders, alerts, and care-related notifications</li>
          <li>Improve platform safety, reliability, and performance</li>
          <li>Comply with legal, regulatory, and security obligations</li>
        </ul>

        <h3 className="text-xl font-semibold mt-4 mb-2">c) Data Deletion Requests</h3>
        <p className="mb-4">Users may request deletion of their personal data via:</p>
        <ul className="list-disc ml-6 mb-4">
          <li>The in-app Delete Account option</li>
          <li>
            Email:{" "}
            <a href="mailto:mediratorinfo@gmail.com" className="underline">
              mediratorinfo@gmail.com
            </a>
          </li>
          <li>
            Contact Form:{" "}
            <a href="https://medirator.com/contact-us" className="underline">
              https://medirator.com/contact-us
            </a>
          </li>
        </ul>
        <p className="mb-4">
          When deletion is requested, we remove or anonymize data except where retention is required by
          law, security, fraud prevention, or legitimate operational purposes.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-2">d) Unlinking Social Logins</h3>
        <p className="mb-4">
          Users who signed in using Google or Facebook can unlink their accounts via the account
          settings. All linked data will be deleted.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-2">e) Optional Location Data</h3>
        <p className="mb-4">
          If you grant permission, Medirator may use location data to:
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li>Improve address convenience for healthcare scheduling features</li>
          <li>Enable region-specific health support experiences</li>
          <li>Enhance fraud detection and account protection</li>
        </ul>

        {/* 2. Cookies and Anonymous Identifiers */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">2. Cookies and Anonymous Identifiers</h2>
        <p className="mb-4">
          The Platform may use cookies and similar technologies to remember preferences, secure
          sessions, analyze traffic, and improve user experience.
        </p>

        {/* 3. Protecting Personal Information */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">
          3. Protecting Your Personal Information
        </h2>
        <p className="mb-4">
          We use technical and organizational safeguards such as encryption, secure storage, access
          controls, and monitoring to reduce unauthorized access, use, or disclosure risks.
        </p>

        {/* 4. Third-Party Sharing */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">4. Third-Party Sharing</h2>
        <p className="mb-4">
          We do not sell personal or health data. We may share limited information with trusted service
          providers (e.g., infrastructure, analytics, customer support) under contractual privacy and
          security obligations.
        </p>

        {/* 5. Marketing */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">5. Marketing</h2>
        <p className="mb-4">
          You may receive updates, feature notices, and health-related platform announcements by email,
          SMS, or push notifications. You can opt out of marketing communications, but essential
          account and security communications cannot be disabled.
        </p>

        {/* 6. Administrative Communications */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">6. Administrative Communications</h2>
        <p className="mb-4">
          We may send important notices regarding account activity, security events, policy updates,
          and service continuity. These communications are required for safe platform use.
        </p>

        {/* 7. Accessing and Updating Personal Information */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">
          7. Accessing and Updating Personal Information
        </h2>
        <p className="mb-4">
          You may access, edit, or delete your personal information unless retention is required by
          law. Deletion may not be immediate in backup or disaster-recovery systems. Requests can be
          made via{" "}
          <strong>
            <a href="mailto:mediratorinfo@gmail.com" className="underline">
              mediratorinfo@gmail.com
            </a>
          </strong>
          .
        </p>

        {/* 8. Privacy Concerns */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">8. Privacy Concerns</h2>
        <p className="mb-4">
          If you have concerns about how Medirator handles your data, you can contact us via email or
          the contact form. For formal complaints, Medirator will follow up accordingly.
        </p>

        {/* 9. Data Retention */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">9. Data Retention</h2>
        <p className="mb-4">
          We retain personal and health-related data only for as long as necessary to provide platform
          services, meet legal obligations, resolve disputes, and enforce agreements.
        </p>

        {/* 10. Children and Dependents */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">10. Children and Dependents</h2>
        <p className="mb-4">
          If data is submitted for a minor or dependent, the submitting user confirms they are an
          authorized parent, guardian, or legal representative.
        </p>

        {/* 11. Changes to This Policy */}
        <h2 className="text-2xl font-semibold mt-6 mb-2">11. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Updated versions will be posted on this
          page with effect from the date of publication.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

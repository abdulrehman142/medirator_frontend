import RolePageTemplate from "../../../components/RolePageTemplate";
import testResultsImg from "/medirator_images/testresults.png";

interface NotesReportsPageProps {
  darkMode?: boolean;
}

const NotesReportsPage = ({ darkMode = false }: NotesReportsPageProps) => {
  return (
    <RolePageTemplate
      darkMode={darkMode}
      title="Doctor Notes & Reports"
      subtitle="Clinical notes, report uploads, and patient summary export tools."
      imageSrc={testResultsImg}
      imageAlt="Notes and Reports"
      checklist={[
        "Add doctor notes",
        "Upload and view reports",
        "Download patient summary",
        "Track note revisions",
      ]}
      highlights={[
        "Critical note pinning",
        "Report integrity indicator",
        "Reminder and follow-up alerts",
      ]}
    />
  );
};

export default NotesReportsPage;

import "./index.css";
import { useState, Suspense, lazy } from "react";
import type { Dispatch, SetStateAction } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import DoctorLayout from "./pages/doctor/doctor_pages/DoctorLayout";
import AdminLayout from "./pages/admin/admin_pages/AdminLayout";
import { DoctorPatientProvider } from "./context/DoctorPatientContext";

const Medibot = lazy(() => import("./pages/Medibot"));
const HowitWorks = lazy(() => import("./pages/HowitWorks"));
const FAQs = lazy(() => import("./pages/FAQs"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/Terms&Conditions"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Services = lazy(() => import("./pages/services/Services"));
const MedicalHistory = lazy(() => import("./pages/services/MedicalHistory"));
const Salts = lazy(() => import("./pages/services/Salts"));
const PastSalts = lazy(() => import("./pages/services/PastSalts"));
const CurrentSalts = lazy(() => import("./pages/services/CurrentSalts"));
const HealthRisks = lazy(() => import("./pages/services/HealthRisks"));
const Appointments = lazy(() => import("./pages/services/Appointments"));
const TestResults = lazy(() => import("./pages/services/TestResults"));
const UnifiedRecords = lazy(() => import("./pages/services/UnifiedRecords"));
const DataSecurity = lazy(() => import("./pages/services/DataSecurity"));
const Visualizer = lazy(() => import("./pages/services/Visualizer"));
const DoctorHomePage = lazy(() => import("./pages/doctor/doctor_pages/HomePage"));
const DoctorPatientProfilePage = lazy(() => import("./pages/doctor/doctor_pages/PatientProfilePage"));
const DoctorAppointmentsPage = lazy(() => import("./pages/doctor/doctor_pages/AppointmentsPage"));
const DoctorPrescriptionPage = lazy(() => import("./pages/doctor/doctor_pages/PrescriptionPage"));
const DoctorAIRiskIndicatorPage = lazy(() => import("./pages/doctor/doctor_pages/AIRiskIndicatorPage"));
const DoctorVisualizerPage = lazy(() => import("./pages/doctor/doctor_pages/VisualizerPage"));
const DoctorNotesReportsPage = lazy(() => import("./pages/doctor/doctor_pages/NotesReportsPage"));
const AdminHomePage = lazy(() => import("./pages/admin/admin_pages/AdminHomePage"));
const AdminDoctorManagementPage = lazy(() => import("./pages/admin/admin_pages/DoctorManagementPage"));
const AdminPatientManagementPage = lazy(() => import("./pages/admin/admin_pages/PatientManagementPage"));
const AdminSystemAnalyticsPage = lazy(() => import("./pages/admin/admin_pages/SystemAnalyticsPage"));
const AdminAIModelManagementPage = lazy(() => import("./pages/admin/admin_pages/AIModelManagementPage"));
const AdminSecurityMonitoringPage = lazy(() => import("./pages/admin/admin_pages/SecurityMonitoringPage"));
const AdminTestReportManagementPage = lazy(() => import("./pages/admin/admin_pages/TestReportManagementPage"));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3C5D] dark:border-white"></div>
      <p className="mt-4 text-[#0B3C5D] dark:text-white">Loading...</p>
    </div>
  </div>
);

const AppLayoutWrapper = ({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
      <Outlet />
    </Layout>
  );
};

const DoctorLayoutWrapper = ({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
}) => {
  const doctorNavLinks = [
    { label: "Home", path: "/doctor/pages/home" },
    { label: "Patient Profile", path: "/doctor/pages/patient-management" },
    { label: "AI Risk Indicator", path: "/doctor/pages/ai-decision-support" },
    { label: "Prescription", path: "/doctor/pages/prescription-medication" },
    { label: "Visualizer", path: "/doctor/pages/visualizer" },
    { label: "Appointments", path: "/doctor/pages/appointment-management" },
  ];

  const doctorFooterLinks = [
    { label: "Home", path: "/doctor/pages/home" },
    { label: "Patient Profile", path: "/doctor/pages/patient-management" },
    { label: "AI Risk Indicator", path: "/doctor/pages/ai-decision-support" },
    { label: "Prescription", path: "/doctor/pages/prescription-medication" },
    { label: "Visualizer", path: "/doctor/pages/visualizer" },
    { label: "Appointments", path: "/doctor/pages/appointment-management" },
  ];

  return (
    <DoctorPatientProvider>
      <DoctorLayout
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        navLinks={doctorNavLinks}
        footerLinks={doctorFooterLinks}
      >
        <Outlet />
      </DoctorLayout>
    </DoctorPatientProvider>
  );
};

const AdminLayoutWrapper = ({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
}) => {
  const adminNavLinks = [
    { label: "Home", path: "/admin/pages/home" },
    {
      label: "Management",
      path: "/admin/pages/management",
      children: [
        { label: "Doctor", path: "/admin/pages/doctor-management", icon: "/medirator_images/doctor.png" },
        { label: "Patient", path: "/admin/pages/patient-management", icon: "/medirator_images/patient.png" },
      ],
    },
    { label: "System Analytics", path: "/admin/pages/system-analytics" },
    { label: "AI Model Management", path: "/admin/pages/ai-model-management" },
    { label: "Security Monitoring", path: "/admin/pages/security-monitoring" },
    { label: "Test Report Management", path: "/admin/pages/test-report-management" },
  ];

  const adminFooterLinks = [
    { label: "Home", path: "/admin/pages/home" },
   {
      label: "Management",
      path: "/admin/pages/management",
      children: [
        { label: "Doctor", path: "/admin/pages/doctor-management", icon: "/medirator_images/doctor.png" },
        { label: "Patient", path: "/admin/pages/patient-management", icon: "/medirator_images/patient.png" },
      ],
    },
    { label: "System Analytics", path: "/admin/pages/system-analytics" },
    { label: "AI Model Management", path: "/admin/pages/ai-model-management" },
    { label: "Security Monitoring", path: "/admin/pages/security-monitoring" },
    { label: "Test Report Management", path: "/admin/pages/test-report-management" },
  ];

  return (
    <AdminLayout
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      navLinks={adminNavLinks}
      footerLinks={adminFooterLinks}
    >
      <Outlet />
    </AdminLayout>
  );
};

const AppRouter = ({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route element={<AdminLayoutWrapper darkMode={darkMode} setDarkMode={setDarkMode} />}>
              <Route path="/admin" element={<Navigate to="/admin/pages/home" replace />} />
              <Route path="/admin/pages/home" element={<AdminHomePage darkMode={darkMode} />} />
              <Route path="/admin/pages/management" element={<Navigate to="/admin/pages/doctor-management" replace />} />
              <Route
                path="/admin/pages/doctor-management"
                element={<AdminDoctorManagementPage darkMode={darkMode} />}
              />
              <Route
                path="/admin/pages/patient-management"
                element={<AdminPatientManagementPage darkMode={darkMode} />}
              />
              <Route
                path="/admin/pages/system-analytics"
                element={<AdminSystemAnalyticsPage darkMode={darkMode} />}
              />
              <Route
                path="/admin/pages/ai-model-management"
                element={<AdminAIModelManagementPage darkMode={darkMode} />}
              />
              <Route
                path="/admin/pages/security-monitoring"
                element={<AdminSecurityMonitoringPage darkMode={darkMode} />}
              />
              <Route
                path="/admin/pages/test-report-management"
                element={<AdminTestReportManagementPage darkMode={darkMode} />}
              />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
            <Route element={<DoctorLayoutWrapper darkMode={darkMode} setDarkMode={setDarkMode} />}>
              <Route path="/doctor" element={<Navigate to="/doctor/pages/home" replace />} />
              <Route path="/doctor/pages/home" element={<DoctorHomePage darkMode={darkMode} />} />
              <Route path="/doctor/pages/auth-profile" element={<Navigate to="/doctor/pages/home" replace />} />
              <Route
                path="/doctor/pages/patient-management"
                element={<DoctorPatientProfilePage darkMode={darkMode} />}
              />
              <Route
                path="/doctor/pages/appointment-management"
                element={<DoctorAppointmentsPage darkMode={darkMode} />}
              />
              <Route
                path="/doctor/pages/prescription-medication"
                element={<DoctorPrescriptionPage darkMode={darkMode} />}
              />
              <Route
                path="/doctor/pages/ai-decision-support"
                element={<DoctorAIRiskIndicatorPage darkMode={darkMode} />}
              />
              <Route
                path="/doctor/pages/visualizer"
                element={<DoctorVisualizerPage darkMode={darkMode} />}
              />
              <Route path="/doctor/pages/notes-reports" element={<DoctorNotesReportsPage darkMode={darkMode} />} />
            </Route>
          </Route>

          <Route element={<AppLayoutWrapper darkMode={darkMode} setDarkMode={setDarkMode} />}>
            <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
              <Route path="/services" element={<Services darkMode={darkMode} />} />
              <Route path="/medical-history" element={<MedicalHistory darkMode={darkMode} />} />
              <Route path="/salts" element={<Salts darkMode={darkMode} />} />
              <Route path="/salts/past" element={<PastSalts darkMode={darkMode} />} />
              <Route path="/salts/current" element={<CurrentSalts darkMode={darkMode} />} />
              <Route path="/health-risks" element={<HealthRisks darkMode={darkMode} />} />
              <Route path="/appointments" element={<Appointments darkMode={darkMode} />} />
              <Route path="/test-results" element={<TestResults darkMode={darkMode} />} />
              <Route path="/unified-records" element={<UnifiedRecords darkMode={darkMode} />} />
              <Route path="/data-security" element={<DataSecurity darkMode={darkMode} />} />
              <Route path="/visualizer" element={<Visualizer darkMode={darkMode} />} />
            </Route>
            <Route path="/help-and-guidance" element={<Visualizer darkMode={darkMode} />} />
            <Route path="/how-it-works" element={<HowitWorks />} />
            <Route path="/medibot" element={<Medibot />} />
            <Route path="/contact" element={<Medibot />} />
            <Route path="/login" element={<Login darkMode={darkMode} />} />
            <Route path="/register" element={<Register darkMode={darkMode} />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsConditions />} />
            <Route path="/about" element={<AboutUs />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <Router>
        <AppRouter darkMode={darkMode} setDarkMode={setDarkMode} />
      </Router>
    </div>
  );
};

export default App;

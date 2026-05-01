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
import { LanguageProvider } from "./context/LanguageContext";
import { useLanguage } from "./context/LanguageContext";

const Medibot = lazy(() => import("./pages/Medibot"));
const HowitWorks = lazy(() => import("./pages/HowitWorks"));
const FAQs = lazy(() => import("./pages/FAQs"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/Terms&Conditions"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Services = lazy(() => import("./pages/services/Services"));
const FamilyHistory = lazy(() => import("./pages/services/FamilyHistory"));
const Salts = lazy(() => import("./pages/services/Salts"));
const HealthRisks = lazy(() => import("./pages/services/HealthRisks"));
const Appointments = lazy(() => import("./pages/services/Appointments"));
const ReportAnalysis = lazy(() => import("./pages/services/ReportAnalysis"));
const Visualizer = lazy(() => import("./pages/services/Visualizer"));
const PatientProfile = lazy(() => import("./pages/PatientProfile"));
const DoctorHomePage = lazy(() => import("./pages/doctor/doctor_pages/HomePage"));
const DoctorProfilePage = lazy(() => import("./pages/doctor/doctor_pages/DoctorProfilePage"));
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
const AdminTestReportManagementPage = lazy(() => import("./pages/admin/admin_pages/TestReportManagementPage"));

const LoadingSpinner = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B3C5D] dark:border-white"></div>
        <p className="mt-4 text-[#0B3C5D] dark:text-white">{t("auth", "loading", "Loading...")}</p>
      </div>
    </div>
  );
};

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
  const { t } = useLanguage();
  const doctorNavLinks = [
    { label: t("navbar", "home", "Home"), path: "/doctor/pages/home" },
    { label: t("navbar", "profile", "Profile"), path: "/doctor/pages/auth-profile" },
    { label: t("navbar", "aiRiskIndicator", "AI Risk Indicator"), path: "/doctor/pages/ai-decision-support" },
    { label: t("navbar", "prescription", "Prescription"), path: "/doctor/pages/prescription-medication" },
    { label: t("navbar", "visualizer", "Visualizer"), path: "/doctor/pages/visualizer" },
    { label: t("navbar", "appointments", "Appointments"), path: "/doctor/pages/appointment-management" },
  ];

  const doctorFooterLinks = [
    { label: t("navbar", "home", "Home"), path: "/doctor/pages/home" },
    { label: t("navbar", "profile", "Profile"), path: "/doctor/pages/auth-profile" },
    { label: t("navbar", "aiRiskIndicator", "AI Risk Indicator"), path: "/doctor/pages/ai-decision-support" },
    { label: t("navbar", "prescription", "Prescription"), path: "/doctor/pages/prescription-medication" },
    { label: t("navbar", "visualizer", "Visualizer"), path: "/doctor/pages/visualizer" },
    { label: t("navbar", "appointments", "Appointments"), path: "/doctor/pages/appointment-management" },
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
  const { t } = useLanguage();
  const adminNavLinks = [
    { label: t("navbar", "home", "Home"), path: "/admin/pages/home" },
    {
      label: t("navbar", "management", "Management"),
      path: "/admin/pages/management",
      children: [
        { label: t("auth", "doctor", "Doctor"), path: "/admin/pages/doctor-management", icon: "/medirator_images/doctor.png" },
        { label: t("auth", "patient", "Patient"), path: "/admin/pages/patient-management", icon: "/medirator_images/patient.png" },
      ],
    },
    { label: t("navbar", "systemAnalytics", "System Analytics"), path: "/admin/pages/system-analytics" },
    { label: t("navbar", "aiModelManagement", "AI Model Management"), path: "/admin/pages/ai-model-management" },
    { label: t("navbar", "testReportManagement", "Test Report Management"), path: "/admin/pages/test-report-management" },
  ];

  const adminFooterLinks = [
    { label: t("navbar", "home", "Home"), path: "/admin/pages/home" },
   {
      label: t("navbar", "management", "Management"),
      path: "/admin/pages/management",
      children: [
        { label: t("auth", "doctor", "Doctor"), path: "/admin/pages/doctor-management", icon: "/medirator_images/doctor.png" },
        { label: t("auth", "patient", "Patient"), path: "/admin/pages/patient-management", icon: "/medirator_images/patient.png" },
      ],
    },
    { label: t("navbar", "systemAnalytics", "System Analytics"), path: "/admin/pages/system-analytics" },
    { label: t("navbar", "aiModelManagement", "AI Model Management"), path: "/admin/pages/ai-model-management" },
    { label: t("navbar", "testReportManagement", "Test Report Management"), path: "/admin/pages/test-report-management" },
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
                path="/admin/pages/test-report-management"
                element={<AdminTestReportManagementPage darkMode={darkMode} />}
              />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["doctor"]} />}>
            <Route element={<DoctorLayoutWrapper darkMode={darkMode} setDarkMode={setDarkMode} />}>
              <Route path="/doctor" element={<Navigate to="/doctor/pages/home" replace />} />
              <Route path="/doctor/pages/home" element={<DoctorHomePage darkMode={darkMode} />} />
              <Route path="/doctor/pages/auth-profile" element={<DoctorProfilePage darkMode={darkMode} />} />
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
              <Route path="/doctor/pages/family-tree" element={<FamilyHistory darkMode={darkMode} />} />
            </Route>
          </Route>

          <Route element={<AppLayoutWrapper darkMode={darkMode} setDarkMode={setDarkMode} />}>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
              <Route path="/services" element={<Services darkMode={darkMode} />} />
              <Route path="/family-history" element={<FamilyHistory darkMode={darkMode} />} />
              <Route path="/medical-history" element={<Navigate to="/family-history" replace />} />
              <Route path="/salts" element={<Salts darkMode={darkMode} />} />
              <Route path="/health-risks" element={<HealthRisks darkMode={darkMode} />} />
              <Route path="/appointments" element={<Appointments darkMode={darkMode} />} />
              <Route path="/report-analysis" element={<ReportAnalysis darkMode={darkMode} />} />
              <Route path="/test-reports" element={<Navigate to="/report-analysis" replace />} />
              <Route path="/test-results" element={<Navigate to="/report-analysis" replace />} />
              <Route path="/profile" element={<PatientProfile darkMode={darkMode} />} />
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
      <LanguageProvider>
        <Router>
          <AppRouter darkMode={darkMode} setDarkMode={setDarkMode} />
        </Router>
      </LanguageProvider>
    </div>
  );
};

export default App;

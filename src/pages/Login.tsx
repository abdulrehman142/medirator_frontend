import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import dropdownArrowLight from "/medirator_images/dropdown.png";
import dropdownArrowDark from "/medirator_images/ddropdown.png";
import loginImage from "/medirator_images/login.png";
import patient from "/medirator_images/patient.png";
import doctor from "/medirator_images/doctor.png";
import admin from "/medirator_images/admin.png";






import {
  useAuth,
  type UserRole,
} from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

interface LoginProps {
  darkMode?: boolean;
}

const Login = ({ darkMode = false }: LoginProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { loginWithCredentials } = useAuth();
  const [role, setRole] = useState<UserRole>("patient");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);

  const roleOptions = [
    { value: "patient" as const, label: t("auth", "patient", "Patient"), icon: patient },
    { value: "doctor" as const, label: t("auth", "doctor", "Doctor"), icon: doctor },
    { value: "admin" as const, label: t("auth", "admin", "Admin"), icon: admin },
  ];

  const selectedRole = roleOptions.find((option) => option.value === role) ?? roleOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (!role || !email.trim() || !password.trim()) {
      setError(t("auth", "loginDetailsRequired", "Please fill all login details."));
      setLoading(false);
      return;
    }

    if (role !== "admin" && !validateEmail(email)) {
      setError(t("auth", "invalidEmail", "Please enter a valid email address."));
      setLoading(false);
      return;
    }

    try {
      const loginResult = await loginWithCredentials({
        email,
        password,
        role: role as UserRole,
      });

      if (!loginResult.ok) {
        setError(loginResult.error ?? t("auth", "loginFailed", "Login failed. Please try again."));
        setLoading(false);
        return;
      }

      setSuccess(true);
      setEmail("");
      setPassword("");

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "doctor") {
        navigate("/doctor", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch {
      setError(t("auth", "loginFailed", "Login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row dark:text-white justify-between dark:bg-black font-sans gap-4 md:gap-0">
        <div className="flex flex-col justify-center items-center text-center p-2 md:p-6 m-2 md:m-4">
          <img
            src={loginImage}
            alt="Login"
            className="h-20 w-20 object-contain mb-3 md:mb-4 mx-auto"
            loading="lazy"
          />
          <div className="text-xl text-[#0B3C5D] dark:text-white md:text-2xl font-bold">
            {t("auth", "loginTitle", "Welcome back")}
          </div>
          <div className="p-2 m-2 text-sm text-[#8e8e93] md:text-base">
            {t("auth", "loginSubtitle", "Login to access your healthcare dashboard, records, appointments, and insights.")}
          </div>
        </div>

        <div className="w-full max-w-4xl m-2 md:m-4 px-3 md:px-4 md:px-8 py-6 md:py-8 relative z-10">
          <div className="bg-white dark:bg-black border-4 border-[#0B3C5D] rounded-2xl shadow p-4 md:p-8">
            {error && <div className="mb-4 text-red-500 text-sm md:text-base">{error}</div>}
            {success && <div className="mb-4 text-green-600 text-sm md:text-base">{t("auth", "loginSuccess", "Login successful.")}</div>}

            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm text-black dark:text-white mb-1">{t("auth", "role", "Role")}</label>
                <div className="relative" ref={roleDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsRoleDropdownOpen((prev) => !prev)}
                    className="w-full p-2 border rounded-2xl border-[#0B3C5D] bg-white dark:bg-black text-black dark:text-white text-sm flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <img src={selectedRole.icon} alt={selectedRole.label} className="w-5 h-5 object-cover rounded" loading="lazy" />
                      {selectedRole.label}
                    </span>
                    <img
                      src={darkMode ? dropdownArrowLight : dropdownArrowDark}
                      alt="Dropdown"
                      className={`h-3 w-3 transition-transform duration-200 ${isRoleDropdownOpen ? "rotate-180" : ""}`}
                      loading="lazy"
                    />
                  </button>

                  {isRoleDropdownOpen && (
                    <div
                      className={`absolute left-0 mt-2 w-full flex flex-col shadow-lg rounded-2xl p-2 border-2 z-50 ${
                        darkMode ? "bg-black border-[#0B3C5D]" : "bg-white border-[#0B3C5D]"
                      }`}
                    >
                      {roleOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setRole(option.value);
                            setIsRoleDropdownOpen(false);
                          }}
                          className={`border border-[#0B3C5D] m-1 rounded-2xl transition-all duration-200 cursor-pointer flex items-center gap-2 px-3 py-2 w-full text-sm ${
                            darkMode
                              ? "bg-black hover:bg-gray-800 text-white"
                              : "bg-white hover:bg-[#0B3C5D] text-black hover:text-white"
                          }`}
                        >
                          <img src={option.icon} alt={option.label} className="w-5 h-5 object-cover rounded" loading="lazy" />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm text-black dark:text-white mb-1">{t("auth", "email", "Email")}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-2xl border-[#0B3C5D] bg-white dark:bg-black text-black dark:text-white focus:outline-none text-sm"
                  placeholder={t("auth", "emailPlaceholder", "you@example.com")}
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm text-black dark:text-white mb-1">{t("auth", "password", "Password")}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded-2xl border-[#0B3C5D] bg-white dark:bg-black text-black dark:text-white focus:outline-none text-sm"
                  placeholder={t("auth", "enterPassword", "Enter your password")}
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white border rounded-2xl border-[#0B3C5D] dark:bg-black hover:text-white dark:text-white hover:bg-[#0B3C5D] dark:hover:bg-gray-800 text-black p-2 px-4 w-full md:w-auto text-sm disabled:opacity-50"
                >
                  {loading ? t("auth", "signingIn", "Signing in...") : t("auth", "loginButton", "Login")}
                </button>
                <div className="text-xs md:text-sm text-black dark:text-gray-300 text-center md:text-right">
                  {t("auth", "secureAccess", "Secure access for patient, doctor, and admin accounts.")}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

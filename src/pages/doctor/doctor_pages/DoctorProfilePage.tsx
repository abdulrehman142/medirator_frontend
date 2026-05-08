import { useCallback, useEffect, useState } from "react";

import doctorImg from "/medirator_images/doctor.png";
import editIcon from "/medirator_images/edit.png";
import { usersApi } from "../../../api/usersApi";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";

interface DoctorProfilePageProps {
  darkMode?: boolean;
}

interface StoredDoctorProfile {
  fullName: string;
  email: string;
  doctorId: string;
  age: string;
  specialization: string;
}

const formatDoctorId = (value: string) => {
  const compact = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const padded = (compact + "00000000").slice(0, 8);
  return `DR-${padded.slice(0, 4)}-${padded.slice(4, 8)}`;
};

const DoctorProfilePage = ({ darkMode = false }: DoctorProfilePageProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [age, setAge] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const storageKey = user?.id ? `medirator_doctor_profile_${user.id}` : null;

  const readStoredProfile = useCallback((): StoredDoctorProfile | null => {
    if (!storageKey) {
      return null;
    }

    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        return null;
      }

      return JSON.parse(raw) as StoredDoctorProfile;
    } catch {
      return null;
    }
  }, [storageKey]);

  const writeStoredProfile = useCallback(
    (profile: StoredDoctorProfile) => {
      if (!storageKey) {
        return;
      }

      localStorage.setItem(storageKey, JSON.stringify(profile));
    },
    [storageKey],
  );

  useEffect(() => {
    const loadProfile = async () => {
      const storedProfile = readStoredProfile();

      try {
        const [me, doctorProfile] = await Promise.all([usersApi.me(), usersApi.getMyDoctorProfile()]);
        const nextDoctorId = formatDoctorId(me.id || storedProfile?.doctorId || "");

        const nextProfile: StoredDoctorProfile = {
          fullName: me.full_name || storedProfile?.fullName || "",
          email: me.email || storedProfile?.email || "",
          doctorId: nextDoctorId,
          age: storedProfile?.age || "",
          specialization: doctorProfile?.specialization || storedProfile?.specialization || "",
        };

        setFullName(nextProfile.fullName);
        setEmail(nextProfile.email);
        setDoctorId(nextProfile.doctorId);
        setAge(nextProfile.age);
        setSpecialization(nextProfile.specialization);
        setPhone(doctorProfile?.phone ?? "");

        writeStoredProfile(nextProfile);
      } catch {
        if (storedProfile) {
          setFullName(storedProfile.fullName);
          setEmail(storedProfile.email);
          setDoctorId(storedProfile.doctorId);
          setAge(storedProfile.age);
          setSpecialization(storedProfile.specialization);
          setMessage(t("doctor", "profileLoaded", "Profile loaded from saved data."));
        } else {
          setMessage(t("doctor", "noAvailableData", "No available data."));
        }
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [readStoredProfile, t, writeStoredProfile]);

  const handleSave = async () => {
    if (!user?.id) {
      setMessage(t("doctor", "signInAgainBeforeSave", "Please sign in again before saving your profile."));
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const updatedMe = await usersApi.updateMe({ full_name: fullName.trim() });
      const updatedDoctorProfile = await usersApi.upsertMyDoctorProfile({
        user_id: user.id,
        specialization: specialization.trim() || undefined,
        phone: phone.trim() || undefined,
      });

      const nextProfile: StoredDoctorProfile = {
        fullName: updatedMe.full_name || fullName.trim(),
        email: updatedMe.email || email,
        doctorId: doctorId || formatDoctorId(user.id),
        age,
        specialization: updatedDoctorProfile?.specialization || specialization,
      };

      setFullName(nextProfile.fullName);
      setEmail(nextProfile.email);
      setDoctorId(nextProfile.doctorId);
      setAge(nextProfile.age);
      setSpecialization(nextProfile.specialization);

      writeStoredProfile(nextProfile);
      setMessage(t("doctor", "profileUpdated", "Profile updated successfully."));
      setEditMode(false);
    } catch {
      setMessage(t("doctor", "profileSaveFailed", "Unable to save doctor profile right now. Please try again later."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">{t("doctor", "myProfileTitle", "My Profile")}</h2>
        </div>
        <img src={doctorImg} alt={t("doctor", "doctorProfileAlt", "Doctor Profile")} className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="bg-white dark:bg-black min-h-screen px-3 md:px-6 py-6 text-black dark:text-white">
        <div className="max-w-6xl mx-auto space-y-4">
          {message && (
            <div className="rounded-2xl border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
              {message}
            </div>
          )}

          <section className="rounded-3xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-5 md:p-8 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-[#4B5563] dark:text-gray-300">{loading ? t("doctor", "loadingProfile", "Loading your profile...") : ""}</div>
              <button
                type="button"
                onClick={editMode ? handleSave : () => setEditMode(true)}
                disabled={editMode && saving}
                className="inline-flex w-fit rounded-2xl border border-[#0B3C5D] bg-[#0B3C5D] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50 items-center justify-center gap-2 whitespace-nowrap"
              >
                {!editMode && <img src={editIcon} alt={t("doctor", "edit", "Edit")} className="w-4 h-4 object-cover rounded" loading="lazy" />}
                {editMode ? t("doctor", "saveChanges", "Save Changes") : t("doctor", "edit", "Edit")}
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-[#0B3C5D]/40 bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-4 min-h-28 flex flex-col justify-center">
                <div className="text-xs text-[#6B7280] dark:text-gray-400 uppercase tracking-wide">{t("doctor", "fullName", "Full Name")}</div>
                <div className="mt-1 text-base md:text-lg font-semibold break-words text-[#0B3C5D] dark:text-white">{fullName || "N/A"}</div>
              </div>
              <div className="rounded-xl border border-[#0B3C5D]/40 bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-4 min-h-28 flex flex-col justify-center">
                <div className="text-xs text-[#6B7280] dark:text-gray-400 uppercase tracking-wide">{t("auth", "email", "Email")}</div>
                <div className="mt-1 text-base md:text-lg font-semibold break-words text-[#0B3C5D] dark:text-white">{email || "N/A"}</div>
              </div>
              <div className="rounded-xl border border-[#0B3C5D]/40 bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-4 min-h-28 flex flex-col justify-center">
                <div className="text-xs text-[#6B7280] dark:text-gray-400 uppercase tracking-wide">{t("doctor", "doctorId", "Doctor ID")}</div>
                <div className="mt-1 text-base md:text-lg font-semibold break-words text-[#0B3C5D] dark:text-white">{doctorId || "N/A"}</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-2 text-sm">
                <span className="font-semibold">{t("doctor", "name", "Name")}</span>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  disabled={!editMode}
                  className="w-full rounded-md border-2 border-[#0B3C5D] bg-white dark:bg-black px-4 py-3 text-black dark:text-white focus:outline-none disabled:opacity-60"
                  placeholder={t("doctor", "enterFullName", "Enter your full name")}
                />
              </label>
              <label className="space-y-2 text-sm">
                <span className="font-semibold">{t("doctor", "age", "Age")}</span>
                <input
                  type="number"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  disabled={!editMode}
                  className="w-full rounded-md border-2 border-[#0B3C5D] bg-white dark:bg-black px-4 py-3 text-black dark:text-white focus:outline-none disabled:opacity-60"
                  placeholder={t("doctor", "enterAge", "Enter your age")}
                  min="0"
                />
              </label>
              <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-semibold">{t("doctor", "specialization", "Specialization")}</span>
                <input
                  value={specialization}
                  onChange={(event) => setSpecialization(event.target.value)}
                  disabled={!editMode}
                  className="w-full rounded-md border-2 border-[#0B3C5D] bg-white dark:bg-black px-4 py-3 text-black dark:text-white focus:outline-none disabled:opacity-60"
                  placeholder={t("doctor", "enterSpecialization", "Enter your specialization")}
                />
              </label>
            </div>

          </section>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilePage;
import { useCallback, useEffect, useState } from "react";

import patientImg from "/medirator_images/patient.png";
import editIcon from "/medirator_images/edit.png";
import { usersApi } from "../api/usersApi";
import { useAuth } from "../context/AuthContext";

interface PatientProfilePageProps {
  darkMode?: boolean;
}

const PatientProfile = ({ darkMode = false }: PatientProfilePageProps) => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [patientId, setPatientId] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [allergies, setAllergies] = useState("");
  const [chronicDiseases, setChronicDiseases] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const storageKey = user?.id ? `medirator_patient_profile_${user.id}` : null;

  interface StoredPatientProfile {
    fullName: string;
    email: string;
    patientId: string;
    age: string;
    gender: string;
    phone: string;
    bloodGroup: string;
    allergies: string;
    chronicDiseases: string;
    emergencyContact: string;
  }

  const formatPatientId = (value: string) => {
    const compact = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const padded = (compact + "00000000").slice(0, 8);
    return `PAT-${padded.slice(0, 4)}-${padded.slice(4, 8)}`;
  };

  const parseList = (value: string) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const isComplete =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    patientId.trim().length > 0 &&
    age.trim().length > 0 &&
    gender.trim().length > 0 &&
    phone.trim().length > 0 &&
    bloodGroup.trim().length > 0 &&
    allergies.trim().length > 0 &&
    chronicDiseases.trim().length > 0 &&
    emergencyContact.trim().length > 0;

  const displayValue = (value: string) => value || "N/A";

  const readStoredProfile = useCallback((): StoredPatientProfile | null => {
    if (!storageKey) {
      return null;
    }

    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as StoredPatientProfile;
      return parsed;
    } catch {
      return null;
    }
  }, [storageKey]);

  const writeStoredProfile = useCallback(
    (profile: StoredPatientProfile) => {
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
        const [me, patientProfile] = await Promise.all([usersApi.me(), usersApi.getMyPatientProfile()]);

        const nextFullName = me.full_name || storedProfile?.fullName || "";
        const nextEmail = me.email || storedProfile?.email || "";
        const nextPatientId = formatPatientId(me.id || storedProfile?.patientId || "");

        setFullName(nextFullName);
        setEmail(nextEmail);
        setPatientId(nextPatientId);
        setAge(patientProfile?.age?.toString() ?? storedProfile?.age ?? "");
        setGender(patientProfile?.gender ?? storedProfile?.gender ?? "");
        setPhone(patientProfile?.phone ?? storedProfile?.phone ?? "");
        setBloodGroup(patientProfile?.blood_group ?? storedProfile?.bloodGroup ?? "");
        setAllergies(patientProfile?.allergies?.join(", ") ?? storedProfile?.allergies ?? "");
        setChronicDiseases(patientProfile?.chronic_diseases?.join(", ") ?? storedProfile?.chronicDiseases ?? "");
        setEmergencyContact(patientProfile?.emergency_contact ?? storedProfile?.emergencyContact ?? "");

        writeStoredProfile({
          fullName: nextFullName,
          email: nextEmail,
          patientId: nextPatientId,
          age: patientProfile?.age?.toString() ?? storedProfile?.age ?? "",
          gender: patientProfile?.gender ?? storedProfile?.gender ?? "",
          phone: patientProfile?.phone ?? storedProfile?.phone ?? "",
          bloodGroup: patientProfile?.blood_group ?? storedProfile?.bloodGroup ?? "",
          allergies: patientProfile?.allergies?.join(", ") ?? storedProfile?.allergies ?? "",
          chronicDiseases:
            patientProfile?.chronic_diseases?.join(", ") ?? storedProfile?.chronicDiseases ?? "",
          emergencyContact: patientProfile?.emergency_contact ?? storedProfile?.emergencyContact ?? "",
        });
      } catch {
        if (storedProfile) {
          setFullName(storedProfile.fullName);
          setEmail(storedProfile.email);
          setPatientId(storedProfile.patientId);
          setAge(storedProfile.age);
          setGender(storedProfile.gender);
          setPhone(storedProfile.phone);
          setBloodGroup(storedProfile.bloodGroup);
          setAllergies(storedProfile.allergies);
          setChronicDiseases(storedProfile.chronicDiseases);
          setEmergencyContact(storedProfile.emergencyContact);
          setMessage("Profile loaded from saved data.");
        } else {
          setMessage("No available data.");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [user?.id, readStoredProfile, writeStoredProfile]);

  const handleSave = async () => {
    if (!user?.id) {
      setMessage("Please sign in again before saving your profile.");
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const [updatedMe, updatedPatientProfile] = await Promise.all([
        usersApi.updateMe({ full_name: fullName.trim() }),
        usersApi.upsertMyPatientProfile({
          user_id: user.id,
          age: age.trim() ? Number(age) : undefined,
          gender: gender.trim() || undefined,
          phone: phone.trim() || undefined,
          blood_group: bloodGroup.trim() || undefined,
          allergies: parseList(allergies),
          chronic_diseases: parseList(chronicDiseases),
          emergency_contact: emergencyContact.trim() || undefined,
        }),
      ]);

      const nextProfile: StoredPatientProfile = {
        fullName: updatedMe.full_name || fullName.trim(),
        email: updatedMe.email || email,
        patientId: patientId || formatPatientId(user.id),
        age: updatedPatientProfile?.age?.toString() || age,
        gender: updatedPatientProfile?.gender || gender,
        phone: updatedPatientProfile?.phone || phone,
        bloodGroup: updatedPatientProfile?.blood_group || bloodGroup,
        allergies: updatedPatientProfile?.allergies?.join(", ") || allergies,
        chronicDiseases: updatedPatientProfile?.chronic_diseases?.join(", ") || chronicDiseases,
        emergencyContact: updatedPatientProfile?.emergency_contact || emergencyContact,
      };

      setFullName(nextProfile.fullName);
      setEmail(nextProfile.email);
      setPatientId(nextProfile.patientId);
      setAge(nextProfile.age);
      setGender(nextProfile.gender);
      setPhone(nextProfile.phone);
      setBloodGroup(nextProfile.bloodGroup);
      setAllergies(nextProfile.allergies);
      setChronicDiseases(nextProfile.chronicDiseases);
      setEmergencyContact(nextProfile.emergencyContact);

      writeStoredProfile(nextProfile);

      setMessage("Profile updated successfully.");
      setEditMode(false);
    } catch {
      setMessage("Unable to save profile right now. Please try again later.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-4 shadow-md gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold ml-0 md:ml-5 md:pl-5 text-center md:text-left">
            Patient Profile
          </h2>
          <p className="text-sm md:text-base text-center md:text-left ml-0 md:ml-5 md:pl-5 mt-2 text-gray-200">
            Update the details the doctor sees for this patient account.
          </p>
        </div>
        <img src={patientImg} alt="Patient Profile" className="h-40 md:h-70 w-40 md:w-70" loading="lazy" />
      </div>

      <div className="bg-white dark:bg-black min-h-screen px-3 md:px-6 py-6 text-black dark:text-white">
        <div className="w-full max-w-none mx-auto space-y-4">
          {message && (
            <div className="rounded-2xl border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
              {message}
            </div>
          )}

          <section className="w-full rounded-3xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-5 md:p-8 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-[#4B5563] dark:text-gray-300">
                {loading ? "Loading your profile..." : ""}
              </div>
            </div>

            <div className="mt-2 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-3 items-start">
              <div className="rounded-2xl border border-[#0B3C5D]/70 bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-xl border border-[#0B3C5D]/40 bg-white dark:bg-black p-4 min-h-28 flex flex-col justify-center">
                    <div className="text-xs text-[#6B7280] dark:text-gray-400 uppercase tracking-wide">Full Name</div>
                    <div className="mt-1 text-base md:text-lg font-semibold break-words text-[#0B3C5D] dark:text-white">{displayValue(fullName)}</div>
                  </div>
                  <div className="rounded-xl border border-[#0B3C5D]/40 bg-white dark:bg-black p-4 min-h-28 flex flex-col justify-center">
                    <div className="text-xs text-[#6B7280] dark:text-gray-400 uppercase tracking-wide">Email</div>
                    <div className="mt-1 text-base md:text-lg font-semibold break-words text-[#0B3C5D] dark:text-white">{displayValue(email)}</div>
                  </div>
                  <div className="rounded-xl border border-[#0B3C5D]/40 bg-white dark:bg-black p-4 min-h-28 flex flex-col justify-center">
                    <div className="text-xs text-[#6B7280] dark:text-gray-400 uppercase tracking-wide">Patient ID</div>
                    <div className="mt-1 text-base md:text-lg font-semibold break-words text-[#0B3C5D] dark:text-white">{displayValue(patientId)}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-4 flex items-center justify-center lg:justify-end lg:pt-4">
                <button
                  type="button"
                  onClick={editMode ? handleSave : () => setEditMode(true)}
                  disabled={editMode && (!isComplete || saving)}
                  className="inline-flex w-fit rounded-2xl border border-[#0B3C5D] bg-[#0B3C5D] px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50 items-center justify-center gap-2 whitespace-nowrap"
                >
                  {!editMode && (
                    <img src={editIcon} alt="Edit" className="w-4 h-4 object-cover rounded" loading="lazy" />
                  )}
                  {editMode ? "Save Changes" : "Edit"}
                </button>
              </div>

              <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-semibold">Full Name</span>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  disabled={!editMode}
                  className="w-full rounded-md border-2 border-[#0B3C5D] bg-white dark:bg-black px-4 py-3 text-black dark:text-white focus:outline-none disabled:opacity-60"
                  placeholder="Enter your full name"
                />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-semibold">Age</span>
                <input
                  type="number"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  disabled={!editMode}
                  className="w-full rounded-md border-2 border-[#0B3C5D] bg-white dark:bg-black px-4 py-3 text-black dark:text-white focus:outline-none disabled:opacity-60"
                  placeholder="Enter your age"
                  min="0"
                />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-semibold">Gender</span>
                <select
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                  disabled={!editMode}
                  className="w-full rounded-md border-2 border-[#0B3C5D] bg-white dark:bg-black px-4 py-3 text-black dark:text-white focus:outline-none disabled:opacity-60"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-semibold">Contact</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  disabled={!editMode}
                  className="w-full rounded-md border-2 border-[#0B3C5D] bg-white dark:bg-black px-4 py-3 text-black dark:text-white focus:outline-none disabled:opacity-60"
                  placeholder="03XXXXXXXXX"
                />
              </label>

              <label className="space-y-2 text-sm">
                <span className="font-semibold">Blood Group</span>
                <select
                  value={bloodGroup}
                  onChange={(event) => setBloodGroup(event.target.value)}
                  disabled={!editMode}
                  className="w-full rounded-md border-2 border-[#0B3C5D] bg-white dark:bg-black px-4 py-3 text-black dark:text-white focus:outline-none disabled:opacity-60"
                >
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </label>

              <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-semibold">Allergies</span>
                <textarea
                  value={allergies}
                  onChange={(event) => setAllergies(event.target.value)}
                  disabled={!editMode}
                  className="w-full min-h-[96px] rounded-md border-2 border-[#0B3C5D] bg-white dark:bg-black px-4 py-3 text-black dark:text-white focus:outline-none disabled:opacity-60"
                  placeholder="Separate multiple allergies with commas"
                />
              </label>

              <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-semibold">Chronic Diseases</span>
                <textarea
                  value={chronicDiseases}
                  onChange={(event) => setChronicDiseases(event.target.value)}
                  disabled={!editMode}
                  className="w-full min-h-[96px] rounded-md border-2 border-[#0B3C5D] bg-white dark:bg-black px-4 py-3 text-black dark:text-white focus:outline-none disabled:opacity-60"
                  placeholder="Separate multiple chronic diseases with commas"
                />
              </label>

              <label className="space-y-2 text-sm md:col-span-2">
                <span className="font-semibold">Emergency Contact</span>
                <input
                  value={emergencyContact}
                  onChange={(event) => setEmergencyContact(event.target.value)}
                  disabled={!editMode}
                  className="w-full rounded-md border-2 border-[#0B3C5D] bg-white dark:bg-black px-4 py-3 text-black dark:text-white focus:outline-none disabled:opacity-60"
                  placeholder="Name and phone number"
                />
              </label>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
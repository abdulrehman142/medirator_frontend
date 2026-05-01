import { useEffect, useMemo, useState } from "react";
import medicalHistory from "/medirator_images/history.png";
import editIcon from "/medirator_images/edit.png";
import deleteIcon from "/medirator_images/delete.png";
import expandIcon from "/medirator_images/expand.gif";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usersApi } from "../../api/usersApi";

interface FamilyHistoryProps {
  darkMode?: boolean;
}

interface FamilyMemberRecord {
  id: string;
  relationship: string;
  name: string;
  age: string;
  disease: string;
  displayName: string;
}

const RELATIONSHIP_OPTIONS = [
  "GrandFather(Father Side)",
  "GrandFather(Mother Side)",
  "GrandMother(Father Side)",
  "GrandMother(Mother Side)",
  "Father",
  "Mother",
  "You",
  "Sister",
  "Brother",
];

const normalizeLabel = (value: string) => value.trim().toLowerCase();

const isUniqueRelationship = (value: string) =>
  normalizeLabel(value) !== "sister" && normalizeLabel(value) !== "brother";

const FamilyHistory = ({ darkMode = false }: FamilyHistoryProps) => {
  type Gender = "male" | "female";
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientFromQuery = searchParams.get("patient")?.trim() ?? "";
  const isDoctorView = Boolean(patientFromQuery);
  const legacyFamilyStorageKey = !isDoctorView && user?.id ? `medirator_family_history_${user.id}` : null;
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberRecord[]>([]);
  const [relationship, setRelationship] = useState("GrandFather(Father Side)");
  const [memberName, setMemberName] = useState("");
  const [memberAge, setMemberAge] = useState("");
  const [memberDisease, setMemberDisease] = useState("");
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [siblingStartIndex, setSiblingStartIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [message, setMessage] = useState<string | null>(null);
  const normalizeMember = (member: Partial<FamilyMemberRecord>, index: number): FamilyMemberRecord => ({
    id: member.id ?? `${Date.now()}-${index}`,
    relationship: member.relationship ?? "",
    name: member.name ?? member.displayName ?? "",
    age: member.age ?? "",
    disease: member.disease ?? "",
    displayName: member.displayName ?? member.name ?? member.relationship ?? "Family Member",
  });

  const handleExpandFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    void document.documentElement.requestFullscreen();
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    const onResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (!message) {
      return;
    }
    const timeoutId = window.setTimeout(() => {
      setMessage(null);
    }, 5000);
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [message]);

  const PersonCard = ({
    name,
    age,
    disease,
    gender,
    imageSrc,
    className,
  }: {
    name: string;
    age: string;
    disease: string;
    gender: Gender;
    imageSrc: string;
    className: string;
  }) => (
    <div
      className={`absolute w-[180px] min-h-[170px] bg-[#0B3C5D] dark:bg-black border-4 border-[#0B3C5D] rounded-md shadow-sm px-2 py-2 ${className}`}
    >
      <div className="flex flex-col items-center justify-center h-full gap-1">
        <img
          src={imageSrc}
          alt={name}
          className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 object-cover"
          loading="lazy"
        />
        <div className="mt-1 text-sm font-semibold text-white text-center break-words leading-tight">{name}</div>
        <div className="text-[11px] uppercase tracking-wide text-white">{gender}</div>
        <div className="text-[11px] text-white text-center">Age: {age}</div>
        <div className="text-[11px] text-white text-center break-words leading-tight w-full">Disease: {disease}</div>
      </div>
    </div>
  );

  const genderImages = {
    male: "/medirator_images/male.png",
    female: "/medirator_images/female.png",
  };

  useEffect(() => {
    const hydrateTree = async () => {
      try {
        if (isDoctorView && patientFromQuery) {
          const patientProfile = await usersApi.getPatientProfileForDoctor(patientFromQuery);
          let tree = (patientProfile?.family_tree ?? []).map((member, index) => normalizeMember(member, index));
          if (tree.length === 0) {
            try {
              const rawLocalTree = localStorage.getItem(`medirator_family_history_${patientFromQuery}`);
              if (rawLocalTree) {
                const parsedLocalTree = JSON.parse(rawLocalTree) as Array<Partial<FamilyMemberRecord>>;
                tree = Array.isArray(parsedLocalTree)
                  ? parsedLocalTree.map((member, index) => normalizeMember(member, index))
                  : [];
              }
            } catch {
              tree = [];
            }
          }
          setFamilyMembers(tree);
          setIsEditMode(false);
          return;
        }

        const myProfile = await usersApi.getMyPatientProfile();
        const tree = (myProfile?.family_tree ?? []).map((member, index) => normalizeMember(member, index));
        if (tree.length > 0) {
          setFamilyMembers(tree);
          setIsEditMode(false);
          return;
        }

        if (legacyFamilyStorageKey) {
          const rawLegacyTree = localStorage.getItem(legacyFamilyStorageKey);
          if (rawLegacyTree) {
            const parsedLegacyTree = JSON.parse(rawLegacyTree) as Array<Partial<FamilyMemberRecord>>;
            const migratedTree = Array.isArray(parsedLegacyTree)
              ? parsedLegacyTree.map((member, index) => normalizeMember(member, index))
              : [];
            if (migratedTree.length > 0 && user?.id) {
              setFamilyMembers(migratedTree);
              setIsEditMode(false);
              await usersApi.upsertMyPatientProfile({
                user_id: user.id,
                age: myProfile?.age,
                date_of_birth: myProfile?.date_of_birth,
                gender: myProfile?.gender,
                phone: myProfile?.phone,
                blood_group: myProfile?.blood_group,
                allergies: myProfile?.allergies,
                chronic_diseases: myProfile?.chronic_diseases,
                emergency_contact: myProfile?.emergency_contact,
                family_history: myProfile?.family_history ?? myProfile?.medical_history,
                family_tree: migratedTree,
              });
              setMessage("Family tree saved.");
              return;
            }
          }
        }

        setFamilyMembers([]);
        setIsEditMode(true);
      } catch {
        setFamilyMembers([]);
        setIsEditMode(!isDoctorView);
        setMessage("No available data.");
      }
    };
    void hydrateTree();
  }, [isDoctorView, patientFromQuery, legacyFamilyStorageKey, user?.id]);

  const resetForm = () => {
    setEditingMemberId(null);
    setMemberName("");
    setMemberAge("");
    setMemberDisease("");
  };

  const handleUpsertMember = () => {
    if (!memberName.trim() || !memberAge.trim() || !memberDisease.trim()) {
      setMessage("Please add name, age, and disease.");
      return;
    }
    setFamilyMembers((current) => {
      const working = editingMemberId ? current.filter((member) => member.id !== editingMemberId) : current;
      const relationshipCount = current.filter(
        (member) => member.id !== editingMemberId && normalizeLabel(member.relationship) === normalizeLabel(relationship),
      ).length;
      if (isUniqueRelationship(relationship) && relationshipCount > 0) {
        setMessage(`${relationship} is unique and already exists in the tree.`);
        return current;
      }

      const nextCount = relationshipCount + 1;
      const numberedLabel =
        normalizeLabel(relationship) === "sister" || normalizeLabel(relationship) === "brother"
          ? `${relationship} ${nextCount}`
          : relationship;
      const finalLabel = memberName.trim() || numberedLabel;

      setMessage(null);
      const nextMember: FamilyMemberRecord = {
        id: editingMemberId ?? `${Date.now()}-${current.length}`,
        relationship,
        displayName: finalLabel,
        name: memberName.trim(),
        age: memberAge.trim(),
        disease: memberDisease.trim(),
      };
      return [...working, nextMember];
    });
    resetForm();
  };

  const handleEditMember = (member: FamilyMemberRecord) => {
    setIsEditMode(true);
    setEditingMemberId(member.id);
    setRelationship(member.relationship);
    setMemberName(member.name);
    setMemberAge(member.age);
    setMemberDisease(member.disease);
    setMessage(null);
  };

  const handleDeleteMember = (memberId: string) => {
    setFamilyMembers((current) => current.filter((member) => member.id !== memberId));
    if (editingMemberId === memberId) {
      resetForm();
    }
    setMessage("Member removed from tree.");
  };

  const saveTree = async () => {
    if (!user?.id || isDoctorView) {
      setMessage("Please sign in again before saving.");
      return;
    }
    try {
      const currentProfile = await usersApi.getMyPatientProfile();
      await usersApi.upsertMyPatientProfile({
        user_id: user.id,
        age: currentProfile?.age,
        date_of_birth: currentProfile?.date_of_birth,
        gender: currentProfile?.gender,
        phone: currentProfile?.phone,
        blood_group: currentProfile?.blood_group,
        allergies: currentProfile?.allergies,
        chronic_diseases: currentProfile?.chronic_diseases,
        emergency_contact: currentProfile?.emergency_contact,
        family_history: currentProfile?.family_history ?? currentProfile?.medical_history,
        family_tree: familyMembers,
      });
      setMessage("Family tree saved.");
      setIsEditMode(false);
      setEditingMemberId(null);
    } catch {
      setMessage("No available data.");
    }
  };

  const relationMap = useMemo(() => {
    const map = new Map<string, FamilyMemberRecord[]>();
    for (const member of familyMembers) {
      const key = normalizeLabel(member.relationship);
      const existing = map.get(key) ?? [];
      existing.push(member);
      map.set(key, existing);
    }
    return map;
  }, [familyMembers]);

  const completedUniqueRelationships = useMemo(() => {
    const completed = new Set<string>();
    for (const member of familyMembers) {
      if (member.id === editingMemberId) continue;
      if (!isUniqueRelationship(member.relationship)) continue;
      if ((member.name ?? "").trim() && (member.age ?? "").trim() && (member.disease ?? "").trim()) {
        completed.add(normalizeLabel(member.relationship));
      }
    }
    return completed;
  }, [familyMembers, editingMemberId]);

  const availableRelationshipOptions = useMemo(
    () =>
      RELATIONSHIP_OPTIONS.filter((option) => {
        if (!isUniqueRelationship(option)) return true;
        return !completedUniqueRelationships.has(normalizeLabel(option));
      }),
    [completedUniqueRelationships],
  );

  useEffect(() => {
    if (!availableRelationshipOptions.includes(relationship)) {
      setRelationship(availableRelationshipOptions[0] ?? "Sister");
    }
  }, [availableRelationshipOptions, relationship]);

  const labelFor = (key: string, fallback: string) => {
    const list = relationMap.get(normalizeLabel(key)) ?? [];
    return list[0]?.displayName ?? fallback;
  };

  const ageFor = (key: string, fallback: string) => {
    const list = relationMap.get(normalizeLabel(key)) ?? [];
    return list[0]?.age ?? fallback;
  };

  const diseaseFor = (key: string, fallback: string) => {
    const list = relationMap.get(normalizeLabel(key)) ?? [];
    return list[0]?.disease ?? fallback;
  };

  const templatePeople = {
    grandFatherFatherSide: {
      name: labelFor("GrandFather(Father Side)", "GF (Father Side)"),
      age: ageFor("GrandFather(Father Side)", "-"),
      disease: diseaseFor("GrandFather(Father Side)", "-"),
      gender: "male" as Gender,
      imageSrc: genderImages.male,
    },
    grandMotherFatherSide: {
      name: labelFor("GrandMother(Father Side)", "GrandMother(Father Side)"),
      age: ageFor("GrandMother(Father Side)", "-"),
      disease: diseaseFor("GrandMother(Father Side)", "-"),
      gender: "female" as Gender,
      imageSrc: genderImages.female,
    },
    grandFatherMotherSide: {
      name: labelFor("GrandFather(Mother Side)", "GF (Mother Side)"),
      age: ageFor("GrandFather(Mother Side)", "-"),
      disease: diseaseFor("GrandFather(Mother Side)", "-"),
      gender: "male" as Gender,
      imageSrc: genderImages.male,
    },
    grandMotherMotherSide: {
      name: labelFor("GrandMother(Mother Side)", "GM (Mother Side)"),
      age: ageFor("GrandMother(Mother Side)", "-"),
      disease: diseaseFor("GrandMother(Mother Side)", "-"),
      gender: "female" as Gender,
      imageSrc: genderImages.female,
    },
    father: {
      name: labelFor("Father", "Father"),
      age: ageFor("Father", "-"),
      disease: diseaseFor("Father", "-"),
      gender: "male" as Gender,
      imageSrc: genderImages.male,
    },
    mother: {
      name: labelFor("Mother", "Mother"),
      age: ageFor("Mother", "-"),
      disease: diseaseFor("Mother", "-"),
      gender: "female" as Gender,
      imageSrc: genderImages.female,
    },
    you: { name: "You", age: "-", disease: "-", gender: "male" as Gender, imageSrc: genderImages.male },
  };

  const siblingPool = useMemo(() => {
    const brothers = relationMap.get(normalizeLabel("Brother")) ?? [];
    const sisters = relationMap.get(normalizeLabel("Sister")) ?? [];
    return [...brothers, ...sisters];
  }, [relationMap]);

  const youMember = useMemo(() => {
    const list = relationMap.get(normalizeLabel("You")) ?? [];
    return list[0];
  }, [relationMap]);

  const visibleSiblingPool = useMemo(
    () => siblingPool.slice(siblingStartIndex, siblingStartIndex + 2),
    [siblingPool, siblingStartIndex],
  );

  const siblingCards = [
    {
      name: visibleSiblingPool[0]?.name ?? "Sibling 1",
      age: visibleSiblingPool[0]?.age ?? "-",
      disease: visibleSiblingPool[0]?.disease ?? "-",
      gender:
        normalizeLabel(visibleSiblingPool[0]?.relationship ?? "") === "brother"
          ? ("male" as Gender)
          : ("female" as Gender),
      imageSrc: normalizeLabel(visibleSiblingPool[0]?.relationship ?? "") === "brother" ? genderImages.male : genderImages.female,
    },
    {
      name: visibleSiblingPool[1]?.name ?? "Sibling 2",
      age: visibleSiblingPool[1]?.age ?? "-",
      disease: visibleSiblingPool[1]?.disease ?? "-",
      gender:
        normalizeLabel(visibleSiblingPool[1]?.relationship ?? "") === "brother"
          ? ("male" as Gender)
          : ("female" as Gender),
      imageSrc: normalizeLabel(visibleSiblingPool[1]?.relationship ?? "") === "brother" ? genderImages.male : genderImages.female,
    },
  ];

  const fitScale = useMemo(() => {
    if (!isFullscreen) return 1;
    const widthScale = (viewport.width - 56) / 1360;
    const heightScale = (viewport.height - 220) / 940;
    return Math.max(0.45, Math.min(widthScale, heightScale, 1));
  }, [isFullscreen, viewport.height, viewport.width]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-6">
        <div className="">
          <h2 className="text-5xl font-bold ">Family History</h2>
          <p className="mt-2">
            Medirator keeps your complete family history <br />
            organized with prior information so you can <br />
            review past conditions, treatments, and reports <br />
            whenever needed.
          </p>
        </div>
        <img src={medicalHistory} alt="Family History" className="h-70 w-70" loading="lazy" />
      </div>

      <div className="bg-white dark:bg-black px-3 md:px-6 py-6 text-black dark:text-white min-h-screen">
        <div className="w-full max-w-7xl mx-auto space-y-4">
          <div className="flex justify-between gap-2">
            <div>
              {isDoctorView ? (
                <button
                  type="button"
                  onClick={() => navigate("/doctor/pages/patient-management")}
                  className="bg-white border rounded-2xl border-[#0B3C5D] dark:bg-black hover:text-white dark:text-white hover:bg-[#0B3C5D] dark:hover:bg-gray-800 text-black p-2 px-4 text-sm transition-all duration-300"
                >
                  Back
                </button>
              ) : null}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExpandFullscreen}
                className="bg-white border rounded-2xl border-[#0B3C5D] dark:bg-black hover:text-white dark:text-white hover:bg-[#0B3C5D] dark:hover:bg-gray-800 text-black p-2 px-4 text-sm transition-all duration-300 flex items-center gap-2"
              >
                <img src={expandIcon} alt="Full Screen" className="w-5 h-5 object-cover rounded" loading="lazy" />
                Expand
              </button>
              {!isEditMode && !isDoctorView ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditMode(true);
                    setMessage(null);
                  }}
                  className="rounded-2xl border border-[#0B3C5D] bg-[#0B3C5D] px-4 py-2 text-sm text-white"
                >
                  <span className="inline-flex items-center gap-2">
                    <img src={editIcon} alt="Edit" className="w-4 h-4 object-cover rounded" loading="lazy" />
                    Edit
                  </span>
                </button>
              ) : !isDoctorView ? (
                <button
                  type="button"
                  onClick={() => {
                    void saveTree();
                  }}
                  className="rounded-2xl border border-gray-500 px-4 py-2 text-sm"
                >
                  Save
                </button>
              ) : null}
            </div>
          </div>
          {message && (
            <div className="rounded-2xl border border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
              {message}
            </div>
          )}

          <section className="rounded-3xl border-4 border-[#0B3C5D] bg-white dark:bg-black p-5 md:p-8 shadow-lg">
            <div className={`grid grid-cols-1 ${isEditMode ? "lg:grid-cols-[1fr_320px]" : ""} gap-6 items-start`}>
              <div
                className={
                  isFullscreen
                    ? "bg-white dark:bg-black h-[calc(100vh-220px)] overflow-hidden flex items-start justify-center"
                    : "bg-white dark:bg-black overflow-x-auto"
                }
              >
                <div
                  className={`relative w-[1360px] h-[940px] ${isFullscreen ? "origin-top" : "mx-auto min-w-[1360px]"}`}
                  style={isFullscreen ? { transform: `scale(${fitScale})` } : undefined}
                >
                  <div className="absolute h-[2px] bg-[#0B3C5D] w-[280px] top-[215px] left-[120px]" />
                  <div className="absolute h-[2px] bg-[#0B3C5D] w-[280px] top-[215px] left-[960px]" />
                  <div className="absolute w-[2px] h-[110px] bg-[#0B3C5D] top-[215px] left-[260px]" />
                  <div className="absolute w-[2px] h-[110px] bg-[#0B3C5D] top-[215px] left-[1100px]" />
                  <div className="absolute text-[#0B3C5D] text-xs top-[320px] left-[255px]">▼</div>
                  <div className="absolute text-[#0B3C5D] text-xs top-[320px] left-[1095px]">▼</div>

                  <div className="absolute h-[2px] bg-[#0B3C5D] w-[440px] top-[550px] left-[470px]" />
                  <div className="absolute w-[2px] h-[86px] bg-[#0B3C5D] top-[550px] left-[690px]" />
                  <div className="absolute text-[#0B3C5D] text-xs top-[632px] left-[685px]">▼</div>
                  <div className="absolute w-[2px] h-[86px] bg-[#0B3C5D] top-[550px] left-[530px]" />
                  <div className="absolute text-[#0B3C5D] text-xs top-[632px] left-[525px]">▼</div>
                  <div className="absolute w-[2px] h-[86px] bg-[#0B3C5D] top-[550px] left-[850px]" />
                  <div className="absolute text-[#0B3C5D] text-xs top-[632px] left-[845px]">▼</div>

                  <PersonCard name={templatePeople.grandFatherFatherSide.name} age={templatePeople.grandFatherFatherSide.age} disease={templatePeople.grandFatherFatherSide.disease} gender={templatePeople.grandFatherFatherSide.gender} imageSrc={templatePeople.grandFatherFatherSide.imageSrc} className="top-[120px] left-[20px]" />
                  <PersonCard name={templatePeople.grandMotherFatherSide.name} age={templatePeople.grandMotherFatherSide.age} disease={templatePeople.grandMotherFatherSide.disease} gender={templatePeople.grandMotherFatherSide.gender} imageSrc={templatePeople.grandMotherFatherSide.imageSrc} className="top-[120px] left-[300px]" />
                  <PersonCard name={templatePeople.grandFatherMotherSide.name} age={templatePeople.grandFatherMotherSide.age} disease={templatePeople.grandFatherMotherSide.disease} gender={templatePeople.grandFatherMotherSide.gender} imageSrc={templatePeople.grandFatherMotherSide.imageSrc} className="top-[120px] left-[860px]" />
                  <PersonCard name={templatePeople.grandMotherMotherSide.name} age={templatePeople.grandMotherMotherSide.age} disease={templatePeople.grandMotherMotherSide.disease} gender={templatePeople.grandMotherMotherSide.gender} imageSrc={templatePeople.grandMotherMotherSide.imageSrc} className="top-[120px] left-[1140px]" />

                  <PersonCard name={templatePeople.father.name} age={templatePeople.father.age} disease={templatePeople.father.disease} gender={templatePeople.father.gender} imageSrc={templatePeople.father.imageSrc} className="top-[340px] left-[170px]" />
                  <PersonCard name={templatePeople.mother.name} age={templatePeople.mother.age} disease={templatePeople.mother.disease} gender={templatePeople.mother.gender} imageSrc={templatePeople.mother.imageSrc} className="top-[340px] left-[970px]" />

                  <PersonCard name={siblingCards[0].name} age={siblingCards[0].age} disease={siblingCards[0].disease} gender={siblingCards[0].gender} imageSrc={siblingCards[0].imageSrc} className="top-[650px] left-[440px]" />
                  <PersonCard
                    name={youMember?.name ?? templatePeople.you.name}
                    age={youMember?.age ?? templatePeople.you.age}
                    disease={youMember?.disease ?? templatePeople.you.disease}
                    gender={templatePeople.you.gender}
                    imageSrc={templatePeople.you.imageSrc}
                    className="top-[650px] left-[600px]"
                  />
                  <PersonCard name={siblingCards[1].name} age={siblingCards[1].age} disease={siblingCards[1].disease} gender={siblingCards[1].gender} imageSrc={siblingCards[1].imageSrc} className="top-[650px] left-[760px]" />
                  {siblingPool.length > 2 && (
                    <div className="absolute top-[840px] left-[560px] flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSiblingStartIndex((current) => Math.max(0, current - 2))}
                        className="inline-flex items-center justify-center rounded-2xl border border-[#0B3C5D] px-3 py-1.5 text-xs font-medium transition-all duration-300 bg-white dark:bg-black text-black dark:text-white hover:bg-[#0B3C5D] hover:text-white"
                      >
                        Prev Siblings
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSiblingStartIndex((current) =>
                            current + 2 < siblingPool.length ? current + 2 : current,
                          )
                        }
                        className="inline-flex items-center justify-center rounded-2xl border border-[#0B3C5D] px-3 py-1.5 text-xs font-medium transition-all duration-300 bg-white dark:bg-black text-black dark:text-white hover:bg-[#0B3C5D] hover:text-white"
                      >
                        Next Siblings
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {isEditMode && !isDoctorView ? <div className="rounded-2xl border border-[#0B3C5D]/60 p-4 bg-white dark:bg-black">
                <h4 className="text-lg font-semibold text-[#0B3C5D] dark:text-white">Add New Member</h4>
                <div className="mt-3 space-y-3">
                  <label className="block text-sm">
                    <span className="font-semibold">Relationship</span>
                    <select
                      value={relationship}
                      onChange={(event) => setRelationship(event.target.value)}
                      className="mt-1 w-full rounded-md border-2 border-[#0B3C5D] bg-white dark:bg-black px-3 py-2"
                    >
                      {availableRelationshipOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block text-sm">
                    <span className="font-semibold">Name</span>
                    <input
                      value={memberName}
                      onChange={(event) => setMemberName(event.target.value)}
                      placeholder="Enter name"
                      className="mt-1 w-full rounded-md border-2 border-[#0B3C5D] bg-white dark:bg-black px-3 py-2"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="font-semibold">Age</span>
                    <input
                      value={memberAge}
                      onChange={(event) => setMemberAge(event.target.value)}
                      placeholder="Enter age or dead"
                      className="mt-1 w-full rounded-md border-2 border-[#0B3C5D] bg-white dark:bg-black px-3 py-2"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="font-semibold">Disease</span>
                    <input
                      value={memberDisease}
                      onChange={(event) => setMemberDisease(event.target.value)}
                      placeholder="Enter disease"
                      className="mt-1 w-full rounded-md border-2 border-[#0B3C5D] bg-white dark:bg-black px-3 py-2"
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleUpsertMember}
                      className="rounded-2xl border border-[#0B3C5D] px-4 py-2 text-sm"
                    >
                      {editingMemberId ? "Update" : "Add"}
                    </button>
                    {editingMemberId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="rounded-2xl border border-gray-400 px-4 py-2 text-sm"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        void saveTree();
                      }}
                      className="rounded-2xl border border-[#0B3C5D] bg-[#0B3C5D] px-4 py-2 text-sm text-white"
                    >
                      Save Tree
                    </button>
                  </div>
                </div>
                <div className="mt-5 space-y-2 max-h-56 overflow-auto border-t border-[#0B3C5D]/30 pt-3">
                  {familyMembers.map((member) => (
                    <div key={member.id} className="rounded-xl border border-[#0B3C5D]/40 p-2 text-xs">
                      <div className="font-semibold">
                        {member.relationship}: {member.name}
                      </div>
                      <div>Age: {member.age} | Disease: {member.disease}</div>
                      <div className="mt-1 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditMember(member)}
                          className="inline-flex items-center gap-1 rounded-2xl border border-[#0B3C5D] px-3 py-1 text-xs font-medium transition-all duration-300 bg-white dark:bg-black text-black dark:text-white hover:bg-[#0B3C5D] hover:text-white"
                        >
                          <img src={editIcon} alt="Edit" className="h-3.5 w-3.5 object-contain" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMember(member.id)}
                          className="inline-flex items-center gap-1 rounded-2xl border border-red-600 px-3 py-1 text-xs font-medium transition-all duration-300 bg-white dark:bg-black text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-700"
                        >
                          <img src={deleteIcon} alt="Delete" className="h-3.5 w-3.5 object-contain" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div> : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FamilyHistory;

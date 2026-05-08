export interface FamilyTreeMember {
  relation?: string;
  relationship?: string;
  name?: string;
  age?: string;
  disease?: string;
  displayName?: string;
}

const normalizeRelation = (relation: string): string => {
  const normalized = relation.toLowerCase().trim();

  if (normalized.includes("grandfather")) {
    if (normalized.includes("father") || normalized.includes("paternal")) return "paternal_grandfather";
    if (normalized.includes("mother") || normalized.includes("maternal")) return "maternal_grandfather";
  }

  if (normalized.includes("grandmother")) {
    if (normalized.includes("father") || normalized.includes("paternal")) return "paternal_grandmother";
    if (normalized.includes("mother") || normalized.includes("maternal")) return "maternal_grandmother";
  }

  if (normalized.includes("father") && !normalized.includes("grandfather")) return "father";
  if (normalized.includes("mother") && !normalized.includes("grandmother")) return "mother";
  if (normalized.includes("brother")) return "brother";
  if (normalized.includes("sister")) return "sister";
  if (normalized.includes("son")) return "son";
  if (normalized.includes("daughter")) return "daughter";

  return normalized.replace(/\s+/g, "_");
};

export const buildFamilyRiskPayload = (members: FamilyTreeMember[]) =>
  members.map((member) => ({
    relation: normalizeRelation(member.relationship ?? member.relation ?? ""),
    disease: (member.disease ?? "").trim() || "none",
    name: member.name?.trim() || member.displayName?.trim() || undefined,
    age: member.age ? Number(member.age) || null : null,
  }));
const compactId = (value: string) => value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

export const toPatientDisplayId = (value: string) => {
  if (!value) return value;
  if (value.startsWith("PAT-")) return value;
  const compact = compactId(value);
  const padded = (compact + "00000000").slice(0, 8);
  return `PAT-${padded.slice(0, 4)}-${padded.slice(4, 8)}`;
};

export const toDoctorDisplayId = (value: string) => {
  if (!value) return value;
  if (value.startsWith("DR-")) return value;
  const compact = compactId(value);
  const padded = (compact + "00000000").slice(0, 8);
  return `DR-${padded.slice(0, 4)}-${padded.slice(4, 8)}`;
};

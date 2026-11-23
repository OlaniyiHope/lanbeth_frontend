export const SEXUALITY_OPTIONS = [
  "Heterosexual",
  "Homosexual",
  "Bisexual",
  "Pansexual",
  "Asexual",
  "Prefer not to say",
  "Other",
];

export const DNAR_OPTIONS = ["Resuscitate", "Do not Resuscitate"];
export const OXYGEN_OPTIONS = ["Yes", "No"];
export const TEAM_INVOLVEMENT_OPTIONS = ["Dietician", "Hen", "Physio", "SALT", "Social Worker"];

export const DOCUMENT_VIEWERS = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Staff" },
];

export const emptyAdmission = {
  startDate: "",
  banding: "",
  authorityCategory: "",
  funeralArrangements: "",
  funeralDirector: "",
  team: "",
  defaultShiftRun: "",
};
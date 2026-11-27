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
export const BASE_LANGUAGES = [
  "English", "Welsh", "Polish", "Punjabi", "Urdu", "Bengali", "Gujarati", "Hindi",
  "Arabic", "French", "Portuguese", "Spanish", "Yoruba", "Igbo", "Twi", "Somali",
  "Chinese (Mandarin)", "Chinese (Cantonese)", "British Sign Language (BSL)",
];

// Builds the dropdown list: the standard languages, then any languages
// already saved on other clients or added in this form, then "Other".
export function buildLanguageOptions(extra = []) {
  const baseLower = BASE_LANGUAGES.map((l) => l.toLowerCase());
  const extras = [
    ...new Set(extra.map((l) => String(l).trim()).filter(Boolean)),
  ]
    .filter((l) => !baseLower.includes(l.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  return [...BASE_LANGUAGES, ...extras, "Other"];
}

// Base list first, then any extra names not already in it (case-insensitive), sorted.
export function mergeOptions(base, extra = []) {
  const baseLower = base.map((x) => x.toLowerCase());
  const extras = [...new Set(extra.map((x) => String(x).trim()).filter(Boolean))]
    .filter((x) => !baseLower.includes(x.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
  return [...base, ...extras];
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Users,
  HeartPulse,
  Plus,
  CalendarClock,
  UploadCloud,
  FileText,
  Trash2,
  Camera,
  ClipboardPlus,
  ClipboardList,
  Landmark,
  Pill,
  Stethoscope
} from "lucide-react";
import { useData } from "../../../context/DataContext.jsx";
import "./AddClient.css";
import {
  SEXUALITY_OPTIONS, DNAR_OPTIONS, OXYGEN_OPTIONS,
  TEAM_INVOLVEMENT_OPTIONS, DOCUMENT_VIEWERS, emptyAdmission, buildLanguageOptions, mergeOptions
} from "./clientFormOptions.js";
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Tea", "Supper"];
const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
// const LANGUAGES = [
//   "English",
//   "Welsh",
//   "Polish",
//   "Punjabi",
//   "Urdu",
//   "Bengali",
//   "Gujarati",
//   "Hindi",
//   "Arabic",
//   "French",
//   "Portuguese",
//   "Spanish",
//   "Yoruba",
//   "Igbo",
//   "Twi",
//   "Somali",
//   "Chinese (Mandarin)",
//   "Chinese (Cantonese)",
//   "British Sign Language (BSL)",
//   "Other",
// ];
const RELIGIONS = [
  "No religion",
  "Christian",
  "Buddhist",
  "Hindu",
  "Jewish",
  "Muslim",
  "Sikh",
  "Other religion",
  "Prefer not to say",
];
const DOCUMENT_TYPES = [
  "Care Plan",
  "Identity Document",
  "Medication Record",
  "Assessment",
  "Support Plan",
  "Consent Form",
  "Risk Assessment",
  "Training Record",
  "Other",
];

const todayISO = () => new Date().toISOString().slice(0, 10);

const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";
const RECORD_TYPES = [
  "Scan (MRI / CT / Ultrasound)",
  "X-Ray",
  "Blood Test",
  "Urine / Stool Test",
  "ECG",
  "Hospital Discharge Report",
  "Specialist Report",
  "Care Assessment",
  "Other",
];

const ETHNICITIES = [
  "White British",
  "White Irish",
  "White - Other",
  "Mixed / Multiple ethnic groups",
  "Asian / Asian British - Indian",
  "Asian / Asian British - Pakistani",
  "Asian / Asian British - Bangladeshi",
  "Asian / Asian British - Chinese",
  "Asian / Asian British - Other",
  "Black / African / Caribbean / Black British",
  "Other ethnic group",
  "Prefer not to say",
];
const PROFESSIONAL_TYPES = [
  "Dentist",
  "Social Worker",
  "GP",
  "Pharmacy",
  "Optician",
  "Health Care Assessment",
  "Placing Local Authority",
  "College / University",
  "Training / College / Personal Tutor",
];

// Only these get "Surgery Address" and "Registered Date"
const REGISTERED_TYPES = ["Dentist", "GP", "Pharmacy", "Optician"];

const emptyProfessional = {
  name: "",
  phone: "",
  email: "",
  address: "",
  postCode: "",
  surgeryAddress: "",
  registeredDate: "",
};
const UK_REGIONS = [
  "North East England",
  "North West England",
  "Yorkshire and the Humber",
  "East Midlands",
  "West Midlands",
  "East of England",
  "Greater London",
  "South East England",
  "South West England",
  "Wales",
  "Scotland",
  "Northern Ireland",
];

const ACTIVITIES = [
  "Gardening",
  "Walking",
  "Reading",
  "Listening to music",
  "Watching TV / films",
  "Cooking / baking",
  "Arts and crafts",
  "Puzzles / board games",
  "Football",
  "Singing / dancing",
  "Praying / attending worship",
  "Visiting family and friends",
  "Shopping",
  "Pet therapy",
  "Other",
];  
const ADMISSION_FIELDS = [
  { key: "startDate", label: "Start Date", type: "date" },
  { key: "banding", label: "Banding" },
  { key: "authorityCategory", label: "Authority / Category" },
  { key: "funeralArrangements", label: "Funeral Arrangements" },
  { key: "funeralDirector", label: "Funeral Director" },
  { key: "team", label: "Team" },
  { key: "defaultShiftRun", label: "Default Shift Run" },
];
// const emptyClient = {
//   name: "",
//   email: "",
//   phone: "",
//   keySafeCode: "",
//    localAuthorityNo: "", 
//   dateOfBirth: "",
//   address: "",
//   postCode: "",
//   region: "",
//   maritalStatus: "",
//   religion: "",
//   ethnicity: "",
//   sex: "",
//   communicationPreference: "",
//   otherLanguage: "",
//   familyMemberName: "",
//   relationship: "",
//   nextOfKinName: "",
//   nextOfKinPhone: "",
//    councilServiceUserId: "",
//   councilCareProviderId: "",
//   serviceType: "",
//   serviceLevel: "",
//   medicalHistory: "",
//   allergies: "",
//   favouriteActivities: "",
//   dailyCare: { bedtime: "", bathTime: "" },
// };
const emptyClient = {
  name: "",
  email: "",
  phone: "",
  keySafeCode: "",
  localAuthorityNo: "",
  dateOfBirth: "",
  address: "",
  postCode: "",
  region: "",
  maritalStatus: "",
  religion: "",
  ethnicity: "",
  sex: "",
  pronoun: "",
  sexuality: "",
  nhsNumber: "",
  chiNumber: "",
  niNumber: "",
  familyMemberName: "",
  relationship: "",
  nextOfKinName: "",
  nextOfKinPhone: "",
  emergencyEmails: [""],
  emergencyAddresses: [""],
  councilServiceUserId: "",
  councilCareProviderId: "",
  serviceType: "",
  serviceLevel: "",
  medicalHistory: "",
  allergies: "",
  dnar: "",
  oxygen: "",
  onCatheter: "No",
  teamInvolvement: [],
  favouriteActivities: "",
  dailyCare: { bedtime: "", bathTime: "" },
};
function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function AddClient() {
  const nav = useNavigate();
 const { data, createClient } = useData();
  const [values, setValues] = useState(emptyClient);
  const [documents, setDocuments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [meals, setMeals] = useState([]);
  const [photo, setPhoto] = useState("");
const [records, setRecords] = useState([]);
const [activities, setActivities] = useState([]);
const [showOtherActivity, setShowOtherActivity] = useState(false);
const [otherActivity, setOtherActivity] = useState("");
const [languages, setLanguages] = useState([{ id: makeId(), value: "", other: "" }]);
const [customLanguages, setCustomLanguages] = useState([]);

const savedLanguages = (data?.clients || []).flatMap((c) => c.languages || []);
const languageOptions = buildLanguageOptions([...savedLanguages, ...customLanguages]);
const [customTeam, setCustomTeam] = useState([]);
const [newTeamName, setNewTeamName] = useState("");
const [teamError, setTeamError] = useState("");

const savedTeam = (data?.clients || []).flatMap((c) => c.medicalHealth?.teamInvolvement || []);
const teamOptions = mergeOptions(TEAM_INVOLVEMENT_OPTIONS, [...savedTeam, ...customTeam]);

const addTeamMember = () => {
  const name = newTeamName.trim();
  if (!name) {
    setTeamError("Type the team member's name first.");
    return;
  }
  // Use the existing spelling if it's already in the list
  const existing = teamOptions.find((t) => t.toLowerCase() === name.toLowerCase());
  const finalName = existing || name;

  if (!teamOptions.includes(finalName)) {
    setCustomTeam((list) => [...list, finalName]);
  }
  // Tick it straight away
  setValues((v) => ({
    ...v,
    teamInvolvement: v.teamInvolvement.includes(finalName)
      ? v.teamInvolvement
      : [...v.teamInvolvement, finalName],
  }));
  setNewTeamName("");
  setTeamError("");
};
const addCustomLanguage = (rowId, typed) => {
  const name = (typed || "").trim();
  if (!name) {
    setError("Type the language name first.");
    return;
  }
  // Use the existing spelling if it's already in the list
  const existing = languageOptions.find((l) => l.toLowerCase() === name.toLowerCase());
  const finalName = existing && existing !== "Other" ? existing : name;

  if (!languageOptions.includes(finalName)) {
    setCustomLanguages((list) => [...list, finalName]);
  }
  updateLanguage(rowId, "value", finalName);
  setError("");
};

const [healthFields, setHealthFields] = useState([]);
const [newHealthFieldName, setNewHealthFieldName] = useState("");
const [healthFieldError, setHealthFieldError] = useState("");

const addHealthField = () => {
  const label = newHealthFieldName.trim();
  if (!label) {
    setHealthFieldError("Type a name for the new field first.");
    return;
  }
  if (healthFields.some((f) => f.label.toLowerCase() === label.toLowerCase())) {
    setHealthFieldError(`A field called "${label}" already exists.`);
    return;
  }
  setHealthFields((list) => [...list, { id: makeId(), label, value: "" }]);
  setNewHealthFieldName("");
  setHealthFieldError("");
};

const updateHealthField = (id, value) =>
  setHealthFields((list) => list.map((f) => (f.id === id ? { ...f, value } : f)));

const removeHealthField = (id) =>
  setHealthFields((list) => list.filter((f) => f.id !== id));
const updateLanguage = (id, field, value) =>
  setLanguages((list) => list.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
const addLanguage = () =>
  setLanguages((list) => [...list, { id: makeId(), value: "", other: "" }]);
const removeLanguage = (id) =>
  setLanguages((list) => list.filter((l) => l.id !== id));
const addActivity = (value) => {
  if (!value) return;
  if (value === "Other") {
    setShowOtherActivity(true);
    return;
  }
  setActivities((a) => (a.includes(value) ? a : [...a, value]));
};
const [admission, setAdmission] = useState({ ...emptyAdmission, extraFields: [] });
const [newFieldName, setNewFieldName] = useState("");
const [fieldError, setFieldError] = useState("");

const updateAdmission = (field, value) =>
  setAdmission((a) => ({ ...a, [field]: value }));

const addAdmissionField = () => {
  const label = newFieldName.trim();
  if (!label) {
    setFieldError("Type a name for the new field first.");
    return;
  }

  const takenNames = [
    ...ADMISSION_FIELDS.map((f) => f.label),
    ...(admission.extraFields || []).map((f) => f.label),
  ].map((name) => name.toLowerCase());

  if (takenNames.includes(label.toLowerCase())) {
    setFieldError(`A field called "${label}" already exists.`);
    return;
  }

  setAdmission((a) => ({
    ...a,
    extraFields: [...(a.extraFields || []), { id: makeId(), label, value: "" }],
  }));
  setNewFieldName("");
  setFieldError("");
};

const updateAdmissionField = (id, value) =>
  setAdmission((a) => ({
    ...a,
    extraFields: a.extraFields.map((f) => (f.id === id ? { ...f, value } : f)),
  }));

const removeAdmissionField = (id) =>
  setAdmission((a) => ({
    ...a,
    extraFields: a.extraFields.filter((f) => f.id !== id),
  }));
const addOtherActivity = () => {
  const value = otherActivity.trim();
  if (!value) return;
  setActivities((a) => (a.includes(value) ? a : [...a, value]));
  setOtherActivity("");
  setShowOtherActivity(false);
};

const removeActivity = (value) =>
  setActivities((a) => a.filter((x) => x !== value));
const addRecord = () =>
  setRecords((r) => [
    ...r,
    { id: makeId(), type: "", dateOfAssessment: "",  file: null },
  ]);

const updateRecord = (id, field, value) =>
  setRecords((r) => r.map((rec) => (rec.id === id ? { ...rec, [field]: value } : rec)));

const removeRecord = (id) => setRecords((r) => r.filter((rec) => rec.id !== id));
const handlePhoto = async (file) => {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    setError("Please choose an image file (JPG or PNG).");
    return;
  }
  try {
    setPhoto(await resizeImage(file));
    setError("");
  } catch {
    setError("Could not read that image. Try another one.");
  }
};
//   const [professionals, setProfessionals] = useState(() =>
//   Object.fromEntries(
//     PROFESSIONAL_TYPES.map((t) => [t, { ...emptyProfessional }])
//   )
// );
const [professionals, setProfessionals] = useState([]);

const addProfessional = () =>
  setProfessionals((p) => [
    ...p,
    { id: makeId(), role: "", name: "", phone: "", email: "", address: "", postCode: "", registeredDate: "" },
  ]);
const updateProfessional = (id, field, value) =>
  setProfessionals((p) => p.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
const removeProfessional = (id) =>
  setProfessionals((p) => p.filter((x) => x.id !== id));
// const updateProfessional = (type, field, value) => {
//   setProfessionals((p) => ({ ...p, [type]: { ...p[type], [field]: value } }));
// };
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }));
  };

  const updateNested = (section, field, value) => {
    setValues((v) => ({ ...v, [section]: { ...v[section], [field]: value } }));
  };
const toggleDocViewer = (docId, role) =>
  setDocuments((docs) =>
    docs.map((d) =>
      d.id !== docId
        ? d
        : {
            ...d,
            visibleTo: d.visibleTo.includes(role)
              ? d.visibleTo.filter((r) => r !== role)
              : [...d.visibleTo, role],
          }
    )
  );
  // ---------- Documents ----------
const handleFiles = (fileList) => {
  const files = Array.from(fileList || []);
  if (!files.length) return;
const next = files.map((file) => ({
  id: makeId(),
  file,
  name: file.name,
  url: URL.createObjectURL(file),
  title: file.name.replace(/\.[^/.]+$/, ""),
  documentType: "Other",
  uploadedAt: todayISO(),
  visibleTo: DOCUMENT_VIEWERS.map((v) => v.value),
}));
  setDocuments((docs) => [...docs, ...next]);
};

const updateDocument = (id, field, value) =>
  setDocuments((docs) => docs.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  const removeDocument = (id) => {
    setDocuments((docs) => {
      const target = docs.find((d) => d.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return docs.filter((d) => d.id !== id);
    });
  };

  // ---------- Medications ----------
  const addMedication = () => {
    setMedications((meds) => [
      ...meds,
      { id: makeId(), name: "", dosage: "", time: "", date: "", instructions: "" },
    ]);
  };

  const updateMedication = (id, field, value) => {
    setMedications((meds) =>
      meds.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const removeMedication = (id) => {
    setMedications((meds) => meds.filter((m) => m.id !== id));
  };

  // ---------- Meals (multi-entry: add one per Breakfast, Lunch, Dinner...) ----------
  const addMeal = () => {
    setMeals((m) => [
      ...m,
      { id: makeId(), type: "", description: "", time: "", day: "Monday" },
    ]);
  };

  const updateMeal = (id, field, value) => {
    setMeals((m) => m.map((meal) => (meal.id === id ? { ...meal, [field]: value } : meal)));
  };

  const removeMeal = (id) => {
    setMeals((m) => m.filter((meal) => meal.id !== id));
  };

  const updateListItem = (key, index, value) =>
  setValues((v) => ({ ...v, [key]: v[key].map((x, i) => (i === index ? value : x)) }));
const addListItem = (key) =>
  setValues((v) => ({ ...v, [key]: [...v[key], ""] }));
const removeListItem = (key, index) =>
  setValues((v) => ({ ...v, [key]: v[key].filter((_, i) => i !== index) }));
function resizeImage(file, max = 256) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
  const submit = async (e) => {
    e.preventDefault();
    if (!values.name.trim() || !values.email.trim() || !values.phone.trim()) {
      setError("Full name, email address, and phone number are required.");
      return;
    }
    if (!values.nextOfKinName.trim() || !values.nextOfKinPhone.trim()) {
      setError("Next of kin name and phone number are required.");
      return;
    }
  // NEW: replaces the two old language checks
  const languageList = languages
    .map((l) => (l.value === "Other" ? l.other.trim() : l.value))
    .filter(Boolean);
  if (!languageList.length) {
    setError("At least one language is required.");
    return;
  }

for (const rec of records) {
  if (!rec.type || !rec.dateOfAssessment || !rec.file) {
    setError("Each medical record needs a type, a date of assessment and a file.");
    return;
  }

}
for (const doc of documents) {
  if (!doc.title.trim()) {
    setError(`Please give a title to "${doc.name}".`);
    return;
  }
}
    setError("");

//     const payload = {
//       fullName: values.name,
//       email: values.email,
//       phone: values.phone,
//       keySafeCode: values.keySafeCode,
//       localAuthorityNo: values.localAuthorityNo.trim() || undefined,
//       dateOfBirth: values.dateOfBirth || undefined,
//       address: values.address,
//       postCode: values.postCode,
//       region: values.region,
//       maritalStatus: values.maritalStatus,
//       councilServiceUserId: values.councilServiceUserId.trim() || undefined,
// councilCareProviderId: values.councilCareProviderId.trim() || undefined,
// serviceType: values.serviceType.trim() || undefined,
// serviceLevel: values.serviceLevel.trim() || undefined,
//       profilePhoto: photo || undefined,
//       religion: values.religion,
//       pronoun: values.pronoun,
//       ethnicity: values.ethnicity || undefined,
//       gender: values.sex === "Other" ? undefined : values.sex,
// communicationPreference:
//   values.communicationPreference === "Other"
//     ? values.otherLanguage
//     : values.communicationPreference,
//       medicalHistory: values.medicalHistory,
//       allergies: values.allergies,
//       favoriteActivities: activities.join(", "),
//       dailyCare: values.dailyCare,
//       emergencyContact: {
//         familyMemberName: values.familyMemberName,
//         relationship: values.relationship,
//         nextOfKinName: values.nextOfKinName,
//         nextOfKinPhone: values.nextOfKinPhone,
//       },
//   //     professionals: PROFESSIONAL_TYPES
//   // .filter((t) => professionals[t].name.trim())
//   // .map((t) => ({
//   //   role: t,
//   //   ...professionals[t],
//   //   registeredDate: professionals[t].registeredDate || undefined,
//   // })),
//   professionals: professionals
//   .filter((p) => p.role && p.name.trim())
//   .map(({ id, ...rest }) => ({
//     ...rest,
//     registeredDate: rest.registeredDate || undefined,
//   })),
//       foodIntake: meals
//         .filter((m) => m.type)
//         .map(({ id, type, description, time, day }) => ({
//           mealType: type,
//           mealDescription: description,
//           mealTime: time,
//           mealDay: day,
//         })),
//       medications: medications
//         .filter((m) => m.name.trim())
//         .map(({ id, ...rest }) => rest),
//     };
const payload = {
  fullName: values.name,
  email: values.email,
  phone: values.phone,
  keySafeCode: values.keySafeCode,
  localAuthorityNo: values.localAuthorityNo.trim() || undefined,
  dateOfBirth: values.dateOfBirth || undefined,
  address: values.address,
  postCode: values.postCode,
  region: values.region,
  maritalStatus: values.maritalStatus,
  religion: values.religion,
  ethnicity: values.ethnicity || undefined,
  gender: values.sex === "Other" ? undefined : values.sex,
  pronoun: values.pronoun || undefined,
  sexuality: values.sexuality || undefined,
  dnar: values.dnar || undefined,
  nhsNumber: values.nhsNumber.trim() || undefined,
  chiNumber: values.chiNumber.trim() || undefined,
  niNumber: values.niNumber.trim() || undefined,
  languages: languageList,
  communicationPreference: languageList[0],
  councilServiceUserId: values.councilServiceUserId.trim() || undefined,
  councilCareProviderId: values.councilCareProviderId.trim() || undefined,
  serviceType: values.serviceType.trim() || undefined,
  serviceLevel: values.serviceLevel.trim() || undefined,
  profilePhoto: photo || undefined,
  medicalHistory: values.medicalHistory,
  allergies: values.allergies,
  favoriteActivities: values.favouriteActivities,
  // medicalHealth: {
  //   oxygen: values.oxygen,
  //   onCatheter: values.onCatheter === "Yes",
  //   teamInvolvement: values.teamInvolvement,
  // },
  medicalHealth: {
  oxygen: values.oxygen || undefined,
  onCatheter: values.onCatheter === "Yes",
  teamInvolvement: values.teamInvolvement,
  customFields: healthFields
    .filter((f) => f.label.trim())
    .map(({ label, value }) => ({ label, value })),
},
  // admission: {
  //   ...admission,
  //   extraFields: (admission.extraFields || [])
  //     .filter((f) => f.label.trim())
  //     .map(({ label, value }) => ({ label, value })),
  // },
  admission: {
  startDate: admission.startDate || undefined,
  banding: admission.banding || undefined,
  authorityCategory: admission.authorityCategory || undefined,
  funeralArrangements: admission.funeralArrangements || undefined,
  funeralDirector: admission.funeralDirector || undefined,
  team: admission.team || undefined,
  defaultShiftRun: admission.defaultShiftRun || undefined,
  extraFields: (admission.extraFields || [])
    .filter((f) => f.label.trim())
    .map(({ label, value }) => ({ label, value })),
},
  dailyCare: values.dailyCare,
  emergencyContact: {
    familyMemberName: values.familyMemberName,
    relationship: values.relationship,
    nextOfKinName: values.nextOfKinName,
    nextOfKinPhone: values.nextOfKinPhone,
    emails: values.emergencyEmails.filter((e) => e.trim()),
    addresses: values.emergencyAddresses.filter((a) => a.trim()),
  },
  professionals: professionals
    .filter((p) => p.role && p.name.trim())
    .map(({ id, ...rest }) => ({ ...rest, registeredDate: rest.registeredDate || undefined })),
  foodIntake: meals
    .filter((m) => m.type)
    .map(({ id, type, description, time, day }) => ({
      mealType: type,
      mealDescription: description,
      mealTime: time,
      mealDay: day,
    })),
  medications: medications
    .filter((m) => m.name.trim())
    .map(({ id, ...rest }) => rest),
};
try {
  setSubmitting(true);
  const created = await createClient(payload);

  const token = localStorage.getItem("lanbeth-auth-token");
  const base = (import.meta.env.VITE_API_URL || "http://localhost:5001").replace(/\/$/, "");
  const failed = [];

  for (const rec of records) {
    try {
      const fd = new FormData();
      fd.append("documentType", "Medical Record");
      fd.append("title", rec.type);
      fd.append("dateOfAssessment", rec.dateOfAssessment);
    
      fd.append("file", rec.file);

      const res = await fetch(`${base}/api/clients/${created._id}/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error();
    } catch {
      failed.push(rec.file.name);
    }
  }
for (const doc of documents) {
  try {
    const fd = new FormData();
    fd.append("documentType", doc.documentType);
    fd.append("title", doc.title.trim());
    fd.append("uploadedAt", doc.uploadedAt);
    fd.append("file", doc.file);
fd.append("visibleTo", JSON.stringify(doc.visibleTo));
    const res = await fetch(`${base}/api/clients/${created._id}/documents`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) throw new Error();
  } catch {
    failed.push(doc.name);
  }
}
  if (failed.length) {
    window.alert(
      `The client was created, but these files failed to upload: ${failed.join(", ")}. ` +
        `You can upload them from the client's Document tab.`
    );
  }
  nav(`/admin/client-profile/${created.clientId}`);
} catch (err) {
  setError(err.message || "Failed to create client.");
} finally {
  setSubmitting(false);
}
  };

  return (
    <div className="add-client-page">
      <div className="page-head">
        <button className="icon-btn" onClick={() => nav(-1)} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="eyebrow">LANBETHCARE</div>
          <h1>Add New Client</h1>
          <p>Create a new client profile and care record.</p>
        </div>
      </div>

      <form className="client-form" onSubmit={submit}>

        
        <FormSection
          icon={<User size={16} />}
          title="Personal Information"
          desc="Core identity and contact details for this client."
        >
          <div className="photo-upload">
  <div className="photo-circle">
    {photo ? (
      <img src={photo} alt="Client preview" />
    ) : (
      <span>{getInitials(values.name) || <Camera size={22} />}</span>
    )}
  </div>
  <div className="photo-actions">
    <label className="outline small photo-btn">
      <Camera size={14} />
      {photo ? "Change Photo" : "Upload Photo"}
      <input
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handlePhoto(e.target.files[0])}
      />
    </label>
    {photo && (
      <button type="button" className="medication-remove" onClick={() => setPhoto("")}>
        <Trash2 size={13} /> Remove
      </button>
    )}
    <small className="field-hint">JPG or PNG. It is resized automatically.</small>
  </div>
</div>
{values.localAuthorityNo.trim() && (
  <div className="local-authority-badge">
    LA No: <strong>{values.localAuthorityNo.trim()}</strong>
  </div>
)}
          <div className="form-grid">
            
            <Field label="Full Name" required>
              <input
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. John Anderson"
              />
            </Field>
            <Field label="Email Address" required>
              <input
                type="email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="john.anderson@email.com"
              />
            </Field>
            <Field label="Phone Number" required>
              <input
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+44 7700 900123"
              />
            </Field>
            <Field label="Key Safe Code">
              <input
                value={values.keySafeCode}
                onChange={(e) => update("keySafeCode", e.target.value)}
                placeholder="e.g. 4821"
              />
            </Field>
            <Field label="Local Authority ID No.">
  <input
    value={values.localAuthorityNo}
    onChange={(e) => update("localAuthorityNo", e.target.value)}
    placeholder="e.g. LA-2026-00123"
  />
</Field>
            <Field label="Date of Birth" required>
              <input
                type="date"
                value={values.dateOfBirth}
                onChange={(e) => update("dateOfBirth", e.target.value)}
              />
            </Field>
            <Field label="Sex" required>
              <select value={values.sex} onChange={(e) => update("sex", e.target.value)}>
                <option value="">Select...</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="pronoun">
  <select value={values.pronoun} onChange={(e) => update("pronoun", e.target.value)}>
    <option value="">Select...</option>
    <option value="He">He</option>
    <option value="She">She</option>
    <option value="They">They</option>
  </select>
</Field>
<Field label="Sexuality">
  <select value={values.sexuality} onChange={(e) => update("sexuality", e.target.value)}>
    <option value="">Select...</option>
    {SEXUALITY_OPTIONS.map((s) => (
      <option key={s}>{s}</option>
    ))}
  </select>
</Field>
<Field label="NHS/HSC No">
  <input value={values.nhsNumber} onChange={(e) => update("nhsNumber", e.target.value)} />
</Field>
<Field label="CHI Number">
  <input value={values.chiNumber} onChange={(e) => update("chiNumber", e.target.value)} />
</Field>
<Field label="NI No">
  <input value={values.niNumber} onChange={(e) => update("niNumber", e.target.value)} />
</Field>
            <Field label="Address" wide required>
              <input
                value={values.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="123 Oak Street, London"
              />
            </Field>
            <Field label="Post Code" required>
              <input
                value={values.postCode}
                onChange={(e) => update("postCode", e.target.value)}
                placeholder="e.g. SW9 0AB"
              />
            </Field>
            <Field label="Region" required>
              <select value={values.region} onChange={(e) => update("region", e.target.value)}>
                <option value="">Select...</option>
                {UK_REGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Marital Status">
              <select
                value={values.maritalStatus}
                onChange={(e) => update("maritalStatus", e.target.value)}
              >
                <option value="">Select...</option>
                <option>Single</option>
                <option>Married</option>
                <option>Widowed</option>
                <option>Divorced</option>
              </select>
            </Field>
            <Field label="Religion" required>
              <select value={values.religion} onChange={(e) => update("religion", e.target.value)}>
                <option value="">Select...</option>
                {RELIGIONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Ethnicity" hint="Optional">
              <select value={values.ethnicity} onChange={(e) => update("ethnicity", e.target.value)}>
                <option value="">Select... (optional)</option>
                {ETHNICITIES.map((e2) => (
                  <option key={e2}>{e2}</option>
                ))}
              </select>
            </Field>
       {/* <Field label="Language Preference" required>
  <select
    value={values.communicationPreference}
    onChange={(e) => update("communicationPreference", e.target.value)}
  >
    <option value="">Select...</option>
    {LANGUAGES.map((lang) => (
      <option key={lang} value={lang}>
        {lang}
      </option>
    ))}
  </select>
</Field> */}
<div className="form-subhead" style={{ gridColumn: "1 / -1" }}>Language Preference</div>
{languages.map((l, i) => (
  <div className="form-grid" key={l.id} style={{ gridColumn: "1 / -1" }}>
    <Field label={i === 0 ? "Language" : `Language ${i + 1}`} required={i === 0}>
      <select value={l.value} onChange={(e) => updateLanguage(l.id, "value", e.target.value)}>
        <option value="">Select...</option>
        {languageOptions.map((lang) => (
          <option key={lang} value={lang}>
            {lang === "Other" ? "Other (add a new language)" : lang}
          </option>
        ))}
      </select>
    </Field>

    {l.value === "Other" && (
      <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <Field label="New language name">
            <input
              value={l.other}
              onChange={(e) => updateLanguage(l.id, "other", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomLanguage(l.id, l.other);
                }
              }}
              placeholder="e.g. Tamil"
            />
          </Field>
        </div>
        <button
          type="button"
          className="outline small"
          onClick={() => addCustomLanguage(l.id, l.other)}
        >
          <Plus size={14} /> Add to list
        </button>
      </div>
    )}

    {languages.length > 1 && (
      <button type="button" className="medication-remove" onClick={() => removeLanguage(l.id)}>
        <Trash2 size={13} /> Remove
      </button>
    )}
  </div>
))}
<button type="button" className="outline small" onClick={addLanguage}>
  <Plus size={14} /> Add Language
</button>

          </div>
        </FormSection>

        <FormSection
          icon={<Users size={16} />}
          title="Name"
          desc="Who to reach in the event of an emergency."
        >
          <div className="form-grid">
            <Field label="Name">
              <input
                value={values.familyMemberName}
                onChange={(e) => update("familyMemberName", e.target.value)}
              />
            </Field>
            <Field label="Relationship">
              <input
                value={values.relationship}
                onChange={(e) => update("relationship", e.target.value)}
                placeholder="e.g. Daughter"
              />
            </Field>
            <Field label="Next of Kin Name" required>
              <input
                value={values.nextOfKinName}
                onChange={(e) => update("nextOfKinName", e.target.value)}
              />
            </Field>
            <Field label="Next of Kin Phone" required>
              <input
                value={values.nextOfKinPhone}
                onChange={(e) => update("nextOfKinPhone", e.target.value)}
                placeholder="+44 7700 987654"
              />
            </Field>
            {values.emergencyAddresses.map((addr, i) => (
  <Field key={`addr-${i}`} label={i === 0 ? "Address" : `Address ${i + 1}`} wide>
    <div style={{ display: "flex", gap: 8 }}>
      <input value={addr} onChange={(e) => updateListItem("emergencyAddresses", i, e.target.value)} />
      {i > 0 && (
        <button type="button" className="medication-remove" onClick={() => removeListItem("emergencyAddresses", i)}>
          <Trash2 size={13} />
        </button>
      )}
    </div>
  </Field>
))}
<button type="button" className="outline small" onClick={() => addListItem("emergencyAddresses")}>
  <Plus size={14} /> Add Address
</button>

{values.emergencyEmails.map((mail, i) => (
  <Field key={`mail-${i}`} label={i === 0 ? "Email" : `Email ${i + 1}`} wide>
    <div style={{ display: "flex", gap: 8 }}>
      <input type="email" value={mail} onChange={(e) => updateListItem("emergencyEmails", i, e.target.value)} />
      {i > 0 && (
        <button type="button" className="medication-remove" onClick={() => removeListItem("emergencyEmails", i)}>
          <Trash2 size={13} />
        </button>
      )}
    </div>
  </Field>
))}
<button type="button" className="outline small" onClick={() => addListItem("emergencyEmails")}>
  <Plus size={14} /> Add Email
</button>
          </div>
        </FormSection>
        <FormSection
  icon={<Landmark size={16} />}
  title="Council"
  desc="Council reference numbers and the service this client receives."
>
  <div className="form-grid">
    <Field label="Council: Service User ID">
      <input
        value={values.councilServiceUserId}
        onChange={(e) => update("councilServiceUserId", e.target.value)}
        placeholder="e.g. SU-004521"
      />
    </Field>
    <Field label="Council: Care Provider ID">
      <input
        value={values.councilCareProviderId}
        onChange={(e) => update("councilCareProviderId", e.target.value)}
        placeholder="e.g. CP-00918"
      />
    </Field>
    <Field label="Service Type">
      <input
        value={values.serviceType}
        onChange={(e) => update("serviceType", e.target.value)}
        placeholder="e.g. Domiciliary care"
      />
    </Field>
    <Field label="Service Level">
      <input
        value={values.serviceLevel}
        onChange={(e) => update("serviceLevel", e.target.value)}
        placeholder="e.g. Level 2"
      />
    </Field>
  </div>
</FormSection>
{/* <FormSection
  icon={<Stethoscope size={16} />}
  title="Professionals Around the Individual"
  desc="Details of the professionals involved in this client's care. Leave blank any that don't apply."
>
  {PROFESSIONAL_TYPES.map((type) => {
    const pro = professionals[type];
    const hasRegistration = REGISTERED_TYPES.includes(type);
    return (
      <div key={type} style={{ marginBottom: 24 }}>
        <div className="form-subhead">{type}</div>
        <div className="form-grid">
          <Field label="Name">
            <input
              value={pro.name}
              onChange={(e) => updateProfessional(type, "name", e.target.value)}
              placeholder={`${type} name`}
            />
          </Field>
          <Field label="Phone">
            <input
              value={pro.phone}
              onChange={(e) => updateProfessional(type, "phone", e.target.value)}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={pro.email}
              onChange={(e) => updateProfessional(type, "email", e.target.value)}
            />
          </Field>
          <Field label="Post Code">
            <input
              value={pro.postCode}
              onChange={(e) => updateProfessional(type, "postCode", e.target.value)}
            />
          </Field>
          <Field label="Address" wide>
            <input
              value={pro.address}
              onChange={(e) => updateProfessional(type, "address", e.target.value)}
            />
          </Field>
          {hasRegistration && (
            <>
              <Field label="Surgery Address" wide>
                <input
                  value={pro.surgeryAddress}
                  onChange={(e) =>
                    updateProfessional(type, "surgeryAddress", e.target.value)
                  }
                />
              </Field>
              <Field label="Registered Date">
                <input
                  type="date"
                  value={pro.registeredDate}
                  onChange={(e) =>
                    updateProfessional(type, "registeredDate", e.target.value)
                  }
                />
              </Field>
            </>
          )}
        </div>
      </div>
    );
  })}
</FormSection> */}
<FormSection
  icon={<Stethoscope size={16} />}
  title="Professionals Around the Individual"
  desc="Add each professional involved in this client's care."
>
  {professionals.length === 0 && (
    <p className="section-empty">No professionals added yet.</p>
  )}

  {professionals.map((p) => (
    <div className="medication-row" key={p.id}>
      <div className="form-grid">
        <Field label="Type" required>
          <select value={p.role} onChange={(e) => updateProfessional(p.id, "role", e.target.value)}>
            <option value="">Select...</option>
            {PROFESSIONAL_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Name">
          <input value={p.name} onChange={(e) => updateProfessional(p.id, "name", e.target.value)} />
        </Field>
        <Field label="Phone">
          <input value={p.phone} onChange={(e) => updateProfessional(p.id, "phone", e.target.value)} />
        </Field>
        <Field label="Email">
          <input type="email" value={p.email} onChange={(e) => updateProfessional(p.id, "email", e.target.value)} />
        </Field>
        <Field label="Post Code">
          <input value={p.postCode} onChange={(e) => updateProfessional(p.id, "postCode", e.target.value)} />
        </Field>
        <Field label="Address" wide>
          <input value={p.address} onChange={(e) => updateProfessional(p.id, "address", e.target.value)} />
        </Field>
        {REGISTERED_TYPES.includes(p.role) && (
          <Field label="Registered Date">
            <input type="date" value={p.registeredDate} onChange={(e) => updateProfessional(p.id, "registeredDate", e.target.value)} />
          </Field>
        )}
      </div>
      <button type="button" className="medication-remove" onClick={() => removeProfessional(p.id)}>
        <Trash2 size={13} /> Remove
      </button>
    </div>
  ))}

  <button type="button" className="outline small" onClick={addProfessional}>
    <Plus size={14} /> Add Professional
  </button>
</FormSection>
<FormSection
  icon={<ClipboardList size={16} />}
  title="Admission"
  desc="Fixed admission fields are always shown. To add another, type a field name below and click Add Field."
>
  <div className="form-grid">
    {ADMISSION_FIELDS.map(({ key, label, type }) => (
      <Field key={key} label={label}>
        <input
          type={type || "text"}
          value={admission[key] || ""}
          onChange={(e) => updateAdmission(key, e.target.value)}
        />
      </Field>
    ))}

    {(admission.extraFields || []).map((f) => (
      <div
        key={f.id}
        style={{ gridColumn: "1 / -1", display: "flex", gap: 8, alignItems: "flex-end" }}
      >
        <div style={{ flex: 1 }}>
          <Field label={f.label}>
            <input
              value={f.value}
              onChange={(e) => updateAdmissionField(f.id, e.target.value)}
            />
          </Field>
        </div>
        <button
          type="button"
          className="medication-remove"
          onClick={() => removeAdmissionField(f.id)}
          aria-label={`Remove ${f.label}`}
        >
          <Trash2 size={13} /> Remove
        </button>
      </div>
    ))}
  </div>

  <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
    <div style={{ flex: 1, minWidth: 220 }}>
      <Field label="New field name">
        <input
          value={newFieldName}
          onChange={(e) => {
            setNewFieldName(e.target.value);
            setFieldError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // stop Enter from submitting the whole form
              addAdmissionField();
            }
          }}
          placeholder="e.g. Ward Number"
        />
      </Field>
    </div>
    <button type="button" className="outline small" onClick={addAdmissionField}>
      <Plus size={14} /> Add Field
    </button>
  </div>

  {fieldError && <div className="form-error" style={{ marginTop: 8 }}>{fieldError}</div>}
</FormSection>
        <FormSection
          icon={<HeartPulse size={16} />}
          title="Medical Information"
          desc="A brief history and any known allergies the care team should be aware of."
        >
          <div className="form-grid">
            <Field label="Medical History" wide>
              <textarea
                rows={4}
                value={values.medicalHistory}
                onChange={(e) => update("medicalHistory", e.target.value)}
                placeholder="Relevant conditions, past procedures, or notes for the care team..."
              />
            </Field>
            <Field label="Allergies" wide hint="Separate multiple allergies with commas">
              <input
                value={values.allergies}
                onChange={(e) => update("allergies", e.target.value)}
                placeholder="e.g. Penicillin, Peanuts"
              />
            </Field>
            <Field label="DNAR / Respect">
  <select value={values.dnar} onChange={(e) => update("dnar", e.target.value)}>
    <option value="">Select...</option>
    {DNAR_OPTIONS.map((d) => (
      <option key={d}>{d}</option>
    ))}
  </select>
</Field>
<Field label="Oxygen">
  <select value={values.oxygen} onChange={(e) => update("oxygen", e.target.value)}>
    <option value="">Select...</option>
    {OXYGEN_OPTIONS.map((o) => (
      <option key={o}>{o}</option>
    ))}
  </select>
</Field>
<Field label="On Catheter">
  <select value={values.onCatheter} onChange={(e) => update("onCatheter", e.target.value)}>
    <option value="No">No</option>
    <option value="Yes">Yes</option>
  </select>
</Field>
<div className="field wide">
  <span>Team Involvement</span>
  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
    {teamOptions.map((t) => (
      <label key={t} style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input
          type="checkbox"
          checked={values.teamInvolvement.includes(t)}
          onChange={() =>
            setValues((v) => ({
              ...v,
              teamInvolvement: v.teamInvolvement.includes(t)
                ? v.teamInvolvement.filter((x) => x !== t)
                : [...v.teamInvolvement, t],
            }))
          }
        />
        {t}
      </label>
    ))}
  </div>

  {healthFields.map((f) => (
  <div key={f.id} style={{ gridColumn: "1 / -1", display: "flex", gap: 8, alignItems: "flex-end" }}>
    <div style={{ flex: 1 }}>
      <Field label={f.label}>
        <input value={f.value} onChange={(e) => updateHealthField(f.id, e.target.value)} />
      </Field>
    </div>
    <button
      type="button"
      className="medication-remove"
      onClick={() => removeHealthField(f.id)}
      aria-label={`Remove ${f.label}`}
    >
      <Trash2 size={13} /> Remove
    </button>
  </div>
))}

<div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, alignItems: "flex-end", flexWrap: "wrap" }}>
  <div style={{ flex: 1, minWidth: 220 }}>
    <Field label="New health field name">
      <input
        value={newHealthFieldName}
        onChange={(e) => {
          setNewHealthFieldName(e.target.value);
          setHealthFieldError("");
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addHealthField();
          }
        }}
        placeholder="e.g. Mobility"
      />
    </Field>
  </div>
  <button type="button" className="outline small" onClick={addHealthField}>
    <Plus size={14} /> Add Field
  </button>
  {healthFieldError && (
    <div className="form-error" style={{ width: "100%" }}>{healthFieldError}</div>
  )}
</div>

  <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
    <div style={{ flex: 1, minWidth: 220 }}>
      <Field label="Add team member">
        <input
          value={newTeamName}
          onChange={(e) => {
            setNewTeamName(e.target.value);
            setTeamError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // stop Enter from submitting the form
              addTeamMember();
            }
          }}
          placeholder="e.g. Podiatrist"
        />
      </Field>
    </div>
    <button type="button" className="outline small" onClick={addTeamMember}>
      <Plus size={14} /> Add
    </button>
  </div>
  {teamError && <div className="form-error" style={{ marginTop: 8 }}>{teamError}</div>}
</div>
          </div>
        </FormSection>
<FormSection
  icon={<ClipboardPlus size={16} />}
  title="Medical Records"
desc="Upload scans, test results and assessments, with the date of each record."
>
  {records.length === 0 && (
    <p className="section-empty">No medical records added yet.</p>
  )}

  {records.map((rec) => (
    <div className="medication-row" key={rec.id}>
      <div className="form-grid">
        <Field label="Record Type" required>
          <select value={rec.type} onChange={(e) => updateRecord(rec.id, "type", e.target.value)}>
            <option value="">Select...</option>
            {RECORD_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Date" required>
          <input
            type="date"
            value={rec.dateOfAssessment}
            onChange={(e) => updateRecord(rec.id, "dateOfAssessment", e.target.value)}
          />
        </Field>
        {/* <Field label="Expiry Date" hint="Optional">
          <input
            type="date"
            value={rec.expiryDate}
            onChange={(e) => updateRecord(rec.id, "expiryDate", e.target.value)}
          />
        </Field> */}
        <Field label="Record File" required>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={(e) => updateRecord(rec.id, "file", e.target.files[0] || null)}
          />
        </Field>
      </div>
      <button type="button" className="medication-remove" onClick={() => removeRecord(rec.id)}>
        <Trash2 size={13} />
        Remove
      </button>
    </div>
  ))}

  <button type="button" className="outline small" onClick={addRecord}>
    <Plus size={14} />
    Add Medical Record
  </button>
</FormSection>
        <FormSection
          icon={<CalendarClock size={16} />}
          title="Daily Care & Nutrition"
          desc="Routine, meal plan, and the activities this client enjoys."
        >
          <div className="form-subhead">Daily Care Schedule</div>
          <div className="form-grid">
            <Field label="Bedtime">
              <input
                type="time"
                value={values.dailyCare.bedtime}
                onChange={(e) => updateNested("dailyCare", "bedtime", e.target.value)}
              />
            </Field>
            <Field label="Bath Time">
              <input
                type="time"
                value={values.dailyCare.bathTime}
                onChange={(e) => updateNested("dailyCare", "bathTime", e.target.value)}
              />
            </Field>
          </div>

          <div className="form-subhead">Current Food Intake Plan</div>

          {meals.length === 0 && (
            <p className="section-empty">No meals added yet. Add one entry per meal (breakfast, lunch, etc).</p>
          )}

          {meals.map((meal) => (
            <div className="medication-row" key={meal.id}>
              <div className="form-grid">
                <Field label="Meal Type">
                  <select
                    value={meal.type}
                    onChange={(e) => updateMeal(meal.id, "type", e.target.value)}
                  >
                    <option value="">Select...</option>
                    {MEAL_TYPES.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Meal Description">
                  <input
                    value={meal.description}
                    onChange={(e) => updateMeal(meal.id, "description", e.target.value)}
                    placeholder="e.g. Soft diet, low sodium"
                  />
                </Field>
                <Field label="Meal Time">
                  <input
                    type="time"
                    value={meal.time}
                    onChange={(e) => updateMeal(meal.id, "time", e.target.value)}
                  />
                </Field>
                <Field label="Day">
                  <select
                    value={meal.day}
                    onChange={(e) => updateMeal(meal.id, "day", e.target.value)}
                  >
                    {WEEKDAYS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <button type="button" className="medication-remove" onClick={() => removeMeal(meal.id)}>
                <Trash2 size={13} />
                Remove
              </button>
            </div>
          ))}

          <button type="button" className="outline small" onClick={addMeal}>
            <Plus size={14} />
            Add Meal Entry
          </button>

       <div className="form-subhead" style={{ marginTop: 24 }}>Favourite Activities</div>
<div className="form-grid">
  <Field label="Activities" wide>
    <textarea
      rows={4}
      value={values.favouriteActivities}
      onChange={(e) => update("favouriteActivities", e.target.value)}
      placeholder="Describe what this client enjoys doing..."
    />
  </Field>
</div>


{activities.length > 0 && (
  <div className="activity-chips">
    {activities.map((a) => (
      <span className="activity-chip" key={a}>
        {a}
        <button type="button" onClick={() => removeActivity(a)} aria-label={`Remove ${a}`}>
          ×
        </button>
      </span>
    ))}
  </div>
)}
        </FormSection>

        <FormSection
          icon={<UploadCloud size={16} />}
          title="Documents"
          desc="Upload care plans, ID, or other supporting documents for this client."
        >
          <label className="upload-drop">
            <UploadCloud size={18} />
            <span>
              <b>Click to browse</b> or drag a file in
            </span>
            <input type="file" multiple onChange={(e) => handleFiles(e.target.files)} />
          </label>

       {documents.length > 0 && (
  <div className="upload-list">
    {documents.map((doc) => (
      <div className="upload-card" key={doc.id}>
        <div className="upload-card-top">
          <FileText size={15} />
          <span className="upload-name">{doc.name}</span>
          <a href={doc.url} target="_blank" rel="noreferrer">View</a>
          <button
            type="button"
            className="upload-remove"
            onClick={() => removeDocument(doc.id)}
            aria-label={`Remove ${doc.name}`}
          >
            <Trash2 size={14} />
          </button>
        </div>

    <div className="form-grid">
  <Field label="Document Title" required>
    <input
      value={doc.title}
      onChange={(e) => updateDocument(doc.id, "title", e.target.value)}
      placeholder="e.g. Care Plan 2025"
    />
  </Field>
  <Field label="Document Type">
    <select
      value={doc.documentType}
      onChange={(e) => updateDocument(doc.id, "documentType", e.target.value)}
    >
      {DOCUMENT_TYPES.map((t) => (
        <option key={t}>{t}</option>
      ))}
    </select>
  </Field>
  <Field label="Date">
    <input
      type="date"
      value={doc.uploadedAt}
      onChange={(e) => updateDocument(doc.id, "uploadedAt", e.target.value)}
    />
  </Field>
  <div className="field wide">
    <span>Who can view this document</span>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {DOCUMENT_VIEWERS.map((v) => (
        <label key={v.value} style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={doc.visibleTo.includes(v.value)}
            onChange={() => toggleDocViewer(doc.id, v.value)}
          />
          {v.label}
        </label>
      ))}
    </div>
  </div>
</div>
      </div>
    ))}
  </div>
)}
        </FormSection>

        <FormSection
          icon={<Pill size={16} />}
          title="Current Medication & Schedule"
          desc="Optional — add any medications this client currently takes. All fields are required per entry."
        >
          {medications.length === 0 && <p className="section-empty">No medications added yet.</p>}

          {medications.map((med) => (
            <div className="medication-row" key={med.id}>
              <div className="form-grid">
                <Field label="Medication Name">
                  <input
                    value={med.name}
                    onChange={(e) => updateMedication(med.id, "name", e.target.value)}
                    placeholder="e.g. Paracetamol"
                  />
                </Field>
                <Field label="Dosage">
                  <input
                    value={med.dosage}
                    onChange={(e) => updateMedication(med.id, "dosage", e.target.value)}
                    placeholder="e.g. 500mg"
                  />
                </Field>
                <Field label="Time">
                  <input
                    type="time"
                    value={med.time}
                    onChange={(e) => updateMedication(med.id, "time", e.target.value)}
                  />
                </Field>
                <Field label="Date">
                  <input
                    type="date"
                    value={med.date}
                    onChange={(e) => updateMedication(med.id, "date", e.target.value)}
                  />
                </Field>
                <Field label="Instructions" wide>
                  <input
                    value={med.instructions}
                    onChange={(e) => updateMedication(med.id, "instructions", e.target.value)}
                    placeholder="e.g. Take with food, twice daily"
                  />
                </Field>
              </div>
              <button type="button" className="medication-remove" onClick={() => removeMedication(med.id)}>
                <Trash2 size={13} />
                Remove
              </button>
            </div>
          ))}

          <button type="button" className="outline small" onClick={addMedication}>
            <Plus size={14} />
            Add Another Medication
          </button>
        </FormSection>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button type="button" className="outline" onClick={() => nav(-1)} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="primary" disabled={submitting}>
            <Plus size={15} />
            {submitting ? "Saving..." : "Add Client"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FormSection({ icon, title, desc, children }) {
  return (
    <section className="form-section">
      <div className="form-section-head">
        <span className="form-section-icon">{icon}</span>
        <div>
          <h2>{title}</h2>
          {desc && <p>{desc}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Field({ label, required, wide, hint, children }) {
  return (
    <label className={`field ${wide ? "wide" : ""}`}>
      <span>
        {label}
        {required && <em>*</em>}
      </span>
      {children}
      {hint && <small className="field-hint">{hint}</small>}
    </label>
  );
}

export default AddClient;
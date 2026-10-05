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
  Pill,
  Stethoscope
} from "lucide-react";
import { useData } from "../../../context/DataContext.jsx";
import "./AddClient.css";

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
const LANGUAGES = [
  "English",
  "Welsh",
  "Polish",
  "Punjabi",
  "Urdu",
  "Bengali",
  "Gujarati",
  "Hindi",
  "Arabic",
  "French",
  "Portuguese",
  "Spanish",
  "Yoruba",
  "Igbo",
  "Twi",
  "Somali",
  "Chinese (Mandarin)",
  "Chinese (Cantonese)",
  "British Sign Language (BSL)",
  "Other",
];
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

const emptyClient = {
  name: "",
  email: "",
  phone: "",
  keySafeCode: "",
  dateOfBirth: "",
  address: "",
  postCode: "",
  region: "",
  maritalStatus: "",
  religion: "",
  ethnicity: "",
  sex: "",
  communicationPreference: "",
  otherLanguage: "",
  familyMemberName: "",
  relationship: "",
  nextOfKinName: "",
  nextOfKinPhone: "",
  medicalHistory: "",
  allergies: "",
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
  const { createClient } = useData();
  const [values, setValues] = useState(emptyClient);
  const [documents, setDocuments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [meals, setMeals] = useState([]);
  const [photo, setPhoto] = useState("");

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
  const [professionals, setProfessionals] = useState(() =>
  Object.fromEntries(
    PROFESSIONAL_TYPES.map((t) => [t, { ...emptyProfessional }])
  )
);

const updateProfessional = (type, field, value) => {
  setProfessionals((p) => ({ ...p, [type]: { ...p[type], [field]: value } }));
};
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }));
  };

  const updateNested = (section, field, value) => {
    setValues((v) => ({ ...v, [section]: { ...v[section], [field]: value } }));
  };

  // ---------- Documents ----------
  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const next = files.map((file) => ({
      id: makeId(),
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setDocuments((docs) => [...docs, ...next]);
  };

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
    if (!values.communicationPreference) {
  setError("Language preference is required.");
  return;
}
if (values.communicationPreference === "Other" && !values.otherLanguage.trim()) {
  setError("Please specify the client's language.");
  return;
}
    setError("");

    const payload = {
      fullName: values.name,
      email: values.email,
      phone: values.phone,
      keySafeCode: values.keySafeCode,
      dateOfBirth: values.dateOfBirth || undefined,
      address: values.address,
      postCode: values.postCode,
      region: values.region,
      maritalStatus: values.maritalStatus,
      profilePhoto: photo || undefined,
      religion: values.religion,
      ethnicity: values.ethnicity || undefined,
      gender: values.sex === "Other" ? undefined : values.sex,
communicationPreference:
  values.communicationPreference === "Other"
    ? values.otherLanguage
    : values.communicationPreference,
      medicalHistory: values.medicalHistory,
      allergies: values.allergies,
      favoriteActivities: values.favouriteActivities,
      dailyCare: values.dailyCare,
      emergencyContact: {
        familyMemberName: values.familyMemberName,
        relationship: values.relationship,
        nextOfKinName: values.nextOfKinName,
        nextOfKinPhone: values.nextOfKinPhone,
      },
      professionals: PROFESSIONAL_TYPES
  .filter((t) => professionals[t].name.trim())
  .map((t) => ({
    role: t,
    ...professionals[t],
    registeredDate: professionals[t].registeredDate || undefined,
  })),
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
       <Field label="Language Preference" required>
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
</Field>

{values.communicationPreference === "Other" && (
  <Field label="Specify Language" required>
    <input
      value={values.otherLanguage}
      onChange={(e) => update("otherLanguage", e.target.value)}
      placeholder="e.g. Tamil"
    />
  </Field>
)}
          </div>
        </FormSection>

        <FormSection
          icon={<Users size={16} />}
          title="Family & Emergency Contacts"
          desc="Who to reach in the event of an emergency."
        >
          <div className="form-grid">
            <Field label="Family Member Name">
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
          </div>
        </FormSection>
<FormSection
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
          </div>
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
              <input
                value={values.favouriteActivities}
                onChange={(e) => update("favouriteActivities", e.target.value)}
                placeholder="e.g. Football, gardening, listening to jazz music"
              />
            </Field>
          </div>
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
                <div className="upload-row" key={doc.id}>
                  <FileText size={15} />
                  <span className="upload-name">{doc.name}</span>
                  <a href={doc.url} target="_blank" rel="noreferrer">
                    View
                  </a>
                  <button
                    type="button"
                    className="upload-remove"
                    onClick={() => removeDocument(doc.id)}
                    aria-label={`Remove ${doc.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </FormSection>

        <FormSection
          icon={<Pill size={16} />}
          title="Medication Schedule"
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
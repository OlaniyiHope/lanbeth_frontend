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
  Pill,
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
  familyMemberName: "",
  relationship: "",
  nextOfKinName: "",
  nextOfKinPhone: "",
  medicalHistory: "",
  allergies: "",
  favouriteActivities: "",
  dailyCare: { bedtime: "", bathTime: "" },
  meal: { type: "", description: "", time: "", day: "Monday" },
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

function generateClientId(count) {
  const year = new Date().getFullYear();
  return `CL-${String(count + 1).padStart(3, "0")}-${year}`;
}

function AddClient() {
  const nav = useNavigate();
  const { data, setData } = useData();
  const [values, setValues] = useState(emptyClient);
  const [documents, setDocuments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [error, setError] = useState("");

  const update = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }));
  };

  const updateNested = (section, field, value) => {
    setValues((v) => ({ ...v, [section]: { ...v[section], [field]: value } }));
  };

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

  const submit = (e) => {
    e.preventDefault();
    if (!values.name.trim() || !values.email.trim() || !values.phone.trim()) {
      setError("Full name, email address, and phone number are required.");
      return;
    }
    if (!values.nextOfKinName.trim() || !values.nextOfKinPhone.trim()) {
      setError("Next of kin name and phone number are required.");
      return;
    }
    setError("");

    const newClient = {
      ...values,
      id: generateClientId(data.clients.length),
      initials: getInitials(values.name),
      status: "Active",
      startDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      documents,
      medications: medications.filter((m) => m.name.trim()),
    };

    setData({ ...data, clients: [...data.clients, newClient] });
    nav("/admin/clients");
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
                placeholder="+1 (555) 123-4567"
              />
            </Field>
            <Field label="Key Safe Code">
              <input
                value={values.keySafeCode}
                onChange={(e) => update("keySafeCode", e.target.value)}
                placeholder="e.g. 4821"
              />
            </Field>
            <Field label="Date of Birth">
              <input
                type="date"
                value={values.dateOfBirth}
                onChange={(e) => update("dateOfBirth", e.target.value)}
              />
            </Field>
            <Field label="Sex">
              <select value={values.sex} onChange={(e) => update("sex", e.target.value)}>
                <option value="">Select...</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Address" wide>
              <input
                value={values.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="123 Oak Street, Springfield"
              />
            </Field>
            <Field label="Post Code">
              <input
                value={values.postCode}
                onChange={(e) => update("postCode", e.target.value)}
                placeholder="IL 62701"
              />
            </Field>
            <Field label="Region">
              <input
                value={values.region}
                onChange={(e) => update("region", e.target.value)}
                placeholder="e.g. Lambeth"
              />
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
            <Field label="Religion">
              <input
                value={values.religion}
                onChange={(e) => update("religion", e.target.value)}
              />
            </Field>
            <Field label="Ethnicity">
              <input
                value={values.ethnicity}
                onChange={(e) => update("ethnicity", e.target.value)}
              />
            </Field>
            <Field label="Communication Preference" wide>
              <input
                value={values.communicationPreference}
                onChange={(e) => update("communicationPreference", e.target.value)}
                placeholder="e.g. Speaks slowly, hard of hearing in left ear"
              />
            </Field>
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
                placeholder="+1 (555) 987-6543"
              />
            </Field>
          </div>
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
          <div className="form-grid">
            <Field label="Meal Type">
              <select
                value={values.meal.type}
                onChange={(e) => updateNested("meal", "type", e.target.value)}
              >
                <option value="">Select...</option>
                {MEAL_TYPES.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </Field>
            <Field label="Meal Description">
              <input
                value={values.meal.description}
                onChange={(e) => updateNested("meal", "description", e.target.value)}
                placeholder="e.g. Soft diet, low sodium"
              />
            </Field>
            <Field label="Meal Time">
              <input
                type="time"
                value={values.meal.time}
                onChange={(e) => updateNested("meal", "time", e.target.value)}
              />
            </Field>
            <Field label="Select Meal Day">
              <select
                value={values.meal.day}
                onChange={(e) => updateNested("meal", "day", e.target.value)}
              >
                {WEEKDAYS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="form-subhead">Favourite Activities</div>
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
            <input
              type="file"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
            />
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
          {medications.length === 0 && (
            <p className="section-empty">No medications added yet.</p>
          )}

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
                    onChange={(e) =>
                      updateMedication(med.id, "instructions", e.target.value)
                    }
                    placeholder="e.g. Take with food, twice daily"
                  />
                </Field>
              </div>
              <button
                type="button"
                className="medication-remove"
                onClick={() => removeMedication(med.id)}
              >
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
          <button type="button" className="outline" onClick={() => nav(-1)}>
            Cancel
          </button>
          <button type="submit" className="primary">
            <Plus size={15} />
            Add Client
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

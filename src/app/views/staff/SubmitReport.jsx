import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  Pill,
  Utensils,
  Thermometer,
  HeartPulse,
  AlertTriangle,
  Brain,
  Heart,
  TestTube,
  UploadCloud,
  FileText,
  Trash2,
  Clock,
  BedDouble,
  Bath,
  Save,
  CheckCircle2,
} from "lucide-react";

import { useData } from "../../../context/DataContext.jsx";
import "./SubmitReport.css";

const MEDICATION_TYPES = [
  "Tablet / Pill",
  "Cream",
  "Fluid",
  "Injection",
  "Patch",
  "PEG",
  "Inhaler",
  "Liquid",
  "Syrup",
  "Capsule",
  "Nebulizer",
  "Other",
];

const MEAL_TYPES = [
  "Breakfast",
  "Brunch",
  "Lunch",
  "Dinner",
  "Supper",
];

const INCIDENT_TYPES = [
  "Bruise",
  "Burn",
  "Fainted",
  "Fall",
  "Graze",
  "Heart Attack",
  "Medication Error",
  "Near Miss",
  "No Apparent Injury",
  "Red Mark",
  "Scratch",
  "Seizure",
  "Skin Tear",
  "Slipped",
  "Stroke",
  "Trip",
];

const BEHAVIOURS = [
  "Aggression (e.g. hitting, kicking, biting)",
  "Crying",
  "Isolation",
  "Self-injurious behaviour (e.g. head banging, biting self, hitting self)",
  "Sexualised behaviour in public",
  "Shouting / swearing",
  "Soiling / smearing",
  "Starvation",
];

const COMMUNICATION_REASONS = [
  "To express their emotions to others",
  "Escape / avoidance - to get away from a situation or task the person finds difficult",
  "Not Known",
  "Pain / feeling unwell - to let others know about it or manage discomfort",
  "Sensory - because it feels good",
  "Social attention - to get noticed or acknowledged by others",
  "Tangible - to get something they want (e.g. food, activities etc.)",
];

const initialForm = {
  reportDate: new Date().toISOString().split("T")[0],

  // Medication
  medication: {
    name: "",
    type: "",
    completed: "",
    notes: "",
  },

  // Meal
  meal: {
    type: "",
    foodGiven: "",
    completed: "",
    notes: "",
  },

  // Daily care
  bathTime: "",
  bedtime: "",
  cleaningDone: "",
  bedroomCheck: "",
  finances: "",
  keyworkSession: "",
  caseNote: "",

  // Temperature
  temperature: {
    date: new Date().toISOString().split("T")[0],
    time: "",
    completed: "",
    value: "",
    notRequired: false,
    notes: "",
  },

  // Blood pressure
  bloodPressure: {
    date: new Date().toISOString().split("T")[0],
    time: "",
    completed: "",
    systolic: "",
    diastolic: "",
    pulse: "",
    notes: "",
  },

  // Incident
  incident: {
    type: "",
    lastedMinutes: "",
    location: "",
    locationDetails: "",
    injured: "",
    residentProvidedInfo: "",
    whatDoing: "",
    howHappened: "",
    reportedToSeniorDate: "",
    equipmentInvolved: "",
    relativesInformed: "",
    gpAmbulance: "",
    gpAmbulanceDetails: "",
    notes: "",
  },

  // Behaviour
  behaviour: {
    date: new Date().toISOString().split("T")[0],
    time: "",
    selected: [],
    communicationReason: "",
    antecedents: "",
    consequences: "",
    notes: "",
  },

  // Comfort
  comfort: {
    time: "",
    cheeks: "",
    skin: "",
    pain: "",
    positioning: "",
    generalComfort: "",
    notes: "",
  },

  // Blood test
  bloodTest: {
    date: "",
    time: "",
    completed: "",
    type: "",
    result: "",
    notes: "",
  },

  // General report
  generalNotes: "",
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

export default function SubmitReport() {
  const nav = useNavigate();
const { id } = useParams();
const { data, setData } = useData();

const client = data?.clients?.find(
  (item) => String(item._id || item.id) === String(id)
);
  const [form, setForm] = useState(initialForm);
  const [reportFile, setReportFile] = useState(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const update = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateSection = (section, field, value) => {
    setForm((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  };

  const toggleBehaviour = (behaviour) => {
    setForm((current) => {
      const exists = current.behaviour.selected.includes(behaviour);

      return {
        ...current,
        behaviour: {
          ...current.behaviour,
          selected: exists
            ? current.behaviour.selected.filter((item) => item !== behaviour)
            : [...current.behaviour.selected, behaviour],
        },
      };
    });
  };

  const handleReportFile = (file) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload the client report as a PDF file.");
      return;
    }

    setError("");

    setReportFile({
      id: makeId(),
      name: file.name,
      url: URL.createObjectURL(file),
    });
  };

  const removeReportFile = () => {
    if (reportFile?.url) {
      URL.revokeObjectURL(reportFile.url);
    }

    setReportFile(null);
  };

  const getStaffDetails = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        return {
          name:
            user.fullname ||
            user.fullName ||
            user.name ||
            user.username ||
            "Care Worker",
          email: user.email || "",
          id: user.id || user.staffId || "",
        };
      }
    } catch (error) {
      console.warn("Unable to read staff information.");
    }

    return {
      name: "Care Worker",
      email: "",
      id: "",
    };
  };

  const submitReport = (event) => {
    event.preventDefault();

    if (!client) {
      setError("Client could not be found.");
      return;
    }

    if (!form.reportDate) {
      setError("Please select the report date.");
      return;
    }

    setError("");

    const staff = getStaffDetails();

    const newReport = {
      id: makeId(),

      date: form.reportDate,

      staff: staff.name,
      staffId: staff.id,
      staffEmail: staff.email,

      reportFile: reportFile?.name || "",

      uploadUrl: reportFile?.url || "",

      submittedAt: new Date().toISOString(),

      medication: form.medication,

      // These two fields also make the report compatible
      // with the admin ClientProfile report display.
      medicationGiven:
        form.medication.completed === "Yes"
          ? "Yes"
          : form.medication.completed === "No"
          ? "No"
          : form.medication.completed === "Not Attempted"
          ? "Not Attempted"
          : "",

      meal: form.meal,

      mealGiven: form.meal.foodGiven,

      bathTime: form.bathTime,
      bedtime: form.bedtime,

      temperature: form.temperature,

      bloodPressure: form.bloodPressure,

      incident: form.incident,

      behaviour: form.behaviour,

      comfort: form.comfort,

      bloodTest: form.bloodTest,

      cleaningDone: form.cleaningDone,
      bedroomCheck: form.bedroomCheck,
      finances: form.finances,
      keyworkSession: form.keyworkSession,
      caseNote: form.caseNote,

      comments: form.generalNotes,
    };

    const updatedClients = data.clients.map((item) => {
      if (item.id !== client.id) {
        return item;
      }

      return {
        ...item,
        reports: [...(item.reports || []), newReport],
      };
    });

    setData({
      ...data,
      clients: updatedClients,
    });

    setSubmitted(true);
  };

  if (!client) {
    return (
      <div className="submit-report-page">
        <div className="report-not-found">
          <AlertTriangle size={28} />
          <h2>Client not found</h2>
          <p>
            The client you are trying to submit a report for could not be
            found.
          </p>

          <button className="report-outline-btn" onClick={() => nav(-1)}>
            <ArrowLeft size={15} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="submit-report-page">
        <div className="report-success">
          <div className="success-icon">
            <CheckCircle2 size={40} />
          </div>

          <span className="report-eyebrow">LANBETHCARE</span>

          <h1>Report Submitted Successfully</h1>

          <p>
            The care report for <strong>{client.name}</strong> dated{" "}
            <strong>{form.reportDate}</strong> has been submitted.
          </p>

          <div className="success-actions">
            <button
              className="report-outline-btn"
              onClick={() => nav(`/staff/client-profile/${client.id}`)}
            >
              <ArrowLeft size={15} />
              View Client
            </button>

            <button
              className="report-primary-btn"
              onClick={() => nav("/staff/clients")}
            >
              <ClipboardList size={15} />
              My Clients
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-report-page">
      {/* PAGE HEADER */}

      <div className="report-page-head">
        <button
          className="report-back-btn"
          onClick={() => nav(-1)}
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="report-head-content">
          <div className="report-eyebrow">LANBETHCARE / STAFF</div>

          <h1>Submit Client Care Report</h1>

          <p>
            Record the care, observations, medication, incidents and wellbeing
            information for this client.
          </p>
        </div>
      </div>

      {/* CLIENT SUMMARY */}

      <div className="report-client-card">
        <div className="report-client-avatar">
          {client.initials || getInitials(client.name)}
        </div>

        <div className="report-client-info">
          <span>CLIENT</span>
          <h2>{client.name}</h2>
          <p>Client ID: {client.id}</p>
        </div>

        <div className="report-date">
          <label>Report Date</label>

          <input
            type="date"
            value={form.reportDate}
            onChange={(e) => update("reportDate", e.target.value)}
          />
        </div>
      </div>

      <form onSubmit={submitReport} className="care-report-form">
        {/* ==============================
            MEDICATION
        ============================== */}

        <ReportSection
          icon={<Pill size={18} />}
          title="Medication"
          description="Record medication administered to the client."
        >
          <div className="report-grid">
            <Field label="Medication Name">
              <input
                value={form.medication.name}
                onChange={(e) =>
                  updateSection("medication", "name", e.target.value)
                }
                placeholder="e.g. Paracetamol"
              />
            </Field>

            <Field label="Type">
              <select
                value={form.medication.type}
                onChange={(e) =>
                  updateSection("medication", "type", e.target.value)
                }
              >
                <option value="">Select medication type...</option>

                {MEDICATION_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </Field>

            <Field label="Completed">
              <div className="radio-group">
                <Radio
                  label="Yes"
                  name="medication-completed"
                  value="Yes"
                  checked={form.medication.completed === "Yes"}
                  onChange={() =>
                    updateSection("medication", "completed", "Yes")
                  }
                />

                <Radio
                  label="No"
                  name="medication-completed"
                  value="No"
                  checked={form.medication.completed === "No"}
                  onChange={() =>
                    updateSection("medication", "completed", "No")
                  }
                />

                <Radio
                  label="Not Attempted"
                  name="medication-completed"
                  value="Not Attempted"
                  checked={form.medication.completed === "Not Attempted"}
                  onChange={() =>
                    updateSection(
                      "medication",
                      "completed",
                      "Not Attempted"
                    )
                  }
                />
              </div>
            </Field>

            <Field label="Notes" wide>
              <textarea
                rows="3"
                value={form.medication.notes}
                onChange={(e) =>
                  updateSection("medication", "notes", e.target.value)
                }
                placeholder="Medication notes, reason not given, observations..."
              />
            </Field>
          </div>
        </ReportSection>

        {/* ==============================
            MEAL
        ============================== */}

        <ReportSection
          icon={<Utensils size={18} />}
          title="Meal Given"
          description="Record the type of meal and food provided to the client."
        >
          <div className="report-grid">
            <Field label="Type of Meal">
              <select
                value={form.meal.type}
                onChange={(e) =>
                  updateSection("meal", "type", e.target.value)
                }
              >
                <option value="">Select meal...</option>

                {MEAL_TYPES.map((meal) => (
                  <option key={meal}>{meal}</option>
                ))}
              </select>
            </Field>

            <Field label="Completed">
              <div className="radio-group">
                <Radio
                  label="Yes"
                  name="meal-completed"
                  value="Yes"
                  checked={form.meal.completed === "Yes"}
                  onChange={() =>
                    updateSection("meal", "completed", "Yes")
                  }
                />

                <Radio
                  label="No"
                  name="meal-completed"
                  value="No"
                  checked={form.meal.completed === "No"}
                  onChange={() =>
                    updateSection("meal", "completed", "No")
                  }
                />

                <Radio
                  label="Not Attempted"
                  name="meal-completed"
                  value="Not Attempted"
                  checked={form.meal.completed === "Not Attempted"}
                  onChange={() =>
                    updateSection(
                      "meal",
                      "completed",
                      "Not Attempted"
                    )
                  }
                />
              </div>
            </Field>

            <Field label="Type of Food Given" wide>
              <textarea
                rows="3"
                value={form.meal.foodGiven}
                onChange={(e) =>
                  updateSection("meal", "foodGiven", e.target.value)
                }
                placeholder="Describe the food or meal given..."
              />
            </Field>

            <Field label="Meal Notes" wide>
              <textarea
                rows="3"
                value={form.meal.notes}
                onChange={(e) =>
                  updateSection("meal", "notes", e.target.value)
                }
                placeholder="Any observations about food intake..."
              />
            </Field>
          </div>
        </ReportSection>

        {/* ==============================
            DAILY CARE
        ============================== */}

        <ReportSection
          icon={<Bath size={18} />}
          title="Daily Care"
          description="Record the client's daily care activities."
        >
          <div className="report-grid">
            <Field label="Bath Time">
              <input
                type="time"
                value={form.bathTime}
                onChange={(e) => update("bathTime", e.target.value)}
              />
            </Field>

            <Field label="Bedtime">
              <input
                type="time"
                value={form.bedtime}
                onChange={(e) => update("bedtime", e.target.value)}
              />
            </Field>

            <Field label="Cleaning Done">
              <SelectYesNo
                value={form.cleaningDone}
                onChange={(value) => update("cleaningDone", value)}
              />
            </Field>

            <Field label="Bedroom Check">
              <SelectYesNo
                value={form.bedroomCheck}
                onChange={(value) => update("bedroomCheck", value)}
              />
            </Field>

            <Field label="Finances">
              <SelectYesNo
                value={form.finances}
                onChange={(value) => update("finances", value)}
              />
            </Field>

            <Field label="Keywork Session">
              <SelectYesNo
                value={form.keyworkSession}
                onChange={(value) => update("keyworkSession", value)}
              />
            </Field>

            <Field label="Case Note" wide>
              <textarea
                rows="4"
                value={form.caseNote}
                onChange={(e) => update("caseNote", e.target.value)}
                placeholder="Enter case notes..."
              />
            </Field>
          </div>
        </ReportSection>

        {/* ==============================
            TEMPERATURE
        ============================== */}

        <ReportSection
          icon={<Thermometer size={18} />}
          title="Temperature Entry"
          description="Record the client's temperature."
        >
          <div className="report-grid">
            <Field label="Date">
              <input
                type="date"
                value={form.temperature.date}
                onChange={(e) =>
                  updateSection("temperature", "date", e.target.value)
                }
              />
            </Field>

            <Field label="Time">
              <input
                type="time"
                value={form.temperature.time}
                onChange={(e) =>
                  updateSection("temperature", "time", e.target.value)
                }
              />
            </Field>

            <Field label="Temperature °C">
              <input
                type="number"
                step="0.1"
                value={form.temperature.value}
                disabled={form.temperature.notRequired}
                onChange={(e) =>
                  updateSection("temperature", "value", e.target.value)
                }
                placeholder="e.g. 36.7"
              />
            </Field>

            <Field label="Completed">
              <div className="radio-group">
                <Radio
                  label="Yes"
                  name="temperature-completed"
                  value="Yes"
                  checked={form.temperature.completed === "Yes"}
                  onChange={() =>
                    updateSection("temperature", "completed", "Yes")
                  }
                />

                <Radio
                  label="No"
                  name="temperature-completed"
                  value="No"
                  checked={form.temperature.completed === "No"}
                  onChange={() =>
                    updateSection("temperature", "completed", "No")
                  }
                />

                <Radio
                  label="Not Attempted"
                  name="temperature-completed"
                  value="Not Attempted"
                  checked={form.temperature.completed === "Not Attempted"}
                  onChange={() =>
                    updateSection(
                      "temperature",
                      "completed",
                      "Not Attempted"
                    )
                  }
                />
              </div>
            </Field>

            <Field label="Temperature Not Required">
              <label className="check-control">
                <input
                  type="checkbox"
                  checked={form.temperature.notRequired}
                  onChange={(e) => {
                    updateSection(
                      "temperature",
                      "notRequired",
                      e.target.checked
                    );

                    if (e.target.checked) {
                      updateSection("temperature", "value", "");
                    }
                  }}
                />
                <span>Not required</span>
              </label>
            </Field>

            <Field label="Notes" wide>
              <textarea
                rows="3"
                value={form.temperature.notes}
                onChange={(e) =>
                  updateSection("temperature", "notes", e.target.value)
                }
                placeholder="Temperature observations..."
              />
            </Field>
          </div>
        </ReportSection>

        {/* ==============================
            BLOOD PRESSURE
        ============================== */}

        <ReportSection
          icon={<HeartPulse size={18} />}
          title="Blood Pressure Entry"
          description="Record blood pressure and pulse information."
        >
          <div className="report-grid">
            <Field label="Date">
              <input
                type="date"
                value={form.bloodPressure.date}
                onChange={(e) =>
                  updateSection("bloodPressure", "date", e.target.value)
                }
              />
            </Field>

            <Field label="Time">
              <input
                type="time"
                value={form.bloodPressure.time}
                onChange={(e) =>
                  updateSection("bloodPressure", "time", e.target.value)
                }
              />
            </Field>

            <Field label="Systolic">
              <input
                type="number"
                value={form.bloodPressure.systolic}
                onChange={(e) =>
                  updateSection(
                    "bloodPressure",
                    "systolic",
                    e.target.value
                  )
                }
                placeholder="e.g. 120"
              />
            </Field>

            <Field label="Diastolic">
              <input
                type="number"
                value={form.bloodPressure.diastolic}
                onChange={(e) =>
                  updateSection(
                    "bloodPressure",
                    "diastolic",
                    e.target.value
                  )
                }
                placeholder="e.g. 80"
              />
            </Field>

            <Field label="Pulse">
              <input
                type="number"
                value={form.bloodPressure.pulse}
                onChange={(e) =>
                  updateSection(
                    "bloodPressure",
                    "pulse",
                    e.target.value
                  )
                }
                placeholder="e.g. 72"
              />
            </Field>

            <Field label="Completed">
              <SelectYesNo
                value={form.bloodPressure.completed}
                onChange={(value) =>
                  updateSection("bloodPressure", "completed", value)
                }
              />
            </Field>

            <Field label="Notes" wide>
              <textarea
                rows="3"
                value={form.bloodPressure.notes}
                onChange={(e) =>
                  updateSection(
                    "bloodPressure",
                    "notes",
                    e.target.value
                  )
                }
                placeholder="Blood pressure observations..."
              />
            </Field>
          </div>
        </ReportSection>

        {/* ==============================
            INCIDENT
        ============================== */}

        <ReportSection
          icon={<AlertTriangle size={18} />}
          title="Incident"
          description="Record any incident involving the client during the care period."
        >
          <div className="report-grid">
            <Field label="Incident Type">
              <select
                value={form.incident.type}
                onChange={(e) =>
                  updateSection("incident", "type", e.target.value)
                }
              >
                <option value="">Select incident...</option>

                {INCIDENT_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </Field>

            <Field label="Incident Lasted (minutes)">
              <input
                type="number"
                min="0"
                value={form.incident.lastedMinutes}
                onChange={(e) =>
                  updateSection(
                    "incident",
                    "lastedMinutes",
                    e.target.value
                  )
                }
              />
            </Field>

            <Field label="Location">
              <input
                value={form.incident.location}
                onChange={(e) =>
                  updateSection("incident", "location", e.target.value)
                }
                placeholder="e.g. Bedroom"
              />
            </Field>

            <Field label="Location Details">
              <input
                value={form.incident.locationDetails}
                onChange={(e) =>
                  updateSection(
                    "incident",
                    "locationDetails",
                    e.target.value
                  )
                }
                placeholder="Where was the client injured?"
              />
            </Field>

            <Field label="Service User Injured?">
              <SelectYesNo
                value={form.incident.injured}
                onChange={(value) =>
                  updateSection("incident", "injured", value)
                }
              />
            </Field>

            <Field label="Resident Able to Provide Information?">
              <select
                value={form.incident.residentProvidedInfo}
                onChange={(e) =>
                  updateSection(
                    "incident",
                    "residentProvidedInfo",
                    e.target.value
                  )
                }
              >
                <option value="">Select...</option>
                <option>Yes</option>
                <option>No</option>
                <option>Not Reliable</option>
              </select>
            </Field>

            <Field
              label="What was the resident doing at the time of the incident?"
              wide
            >
              <textarea
                rows="4"
                value={form.incident.whatDoing}
                onChange={(e) =>
                  updateSection(
                    "incident",
                    "whatDoing",
                    e.target.value
                  )
                }
              />
            </Field>

            <Field label="How did the incident happen?" wide>
              <textarea
                rows="4"
                value={form.incident.howHappened}
                onChange={(e) =>
                  updateSection(
                    "incident",
                    "howHappened",
                    e.target.value
                  )
                }
              />
            </Field>

            <Field label="Date Reported to Senior Staff">
              <input
                type="date"
                value={form.incident.reportedToSeniorDate}
                onChange={(e) =>
                  updateSection(
                    "incident",
                    "reportedToSeniorDate",
                    e.target.value
                  )
                }
              />
            </Field>

            <Field label="Equipment / Machinery Involved?">
              <SelectYesNo
                value={form.incident.equipmentInvolved}
                onChange={(value) =>
                  updateSection(
                    "incident",
                    "equipmentInvolved",
                    value
                  )
                }
              />
            </Field>

            <Field label="Relatives / NOK Informed?">
              <select
                value={form.incident.relativesInformed}
                onChange={(e) =>
                  updateSection(
                    "incident",
                    "relativesInformed",
                    e.target.value
                  )
                }
              >
                <option value="">Select...</option>
                <option>Yes</option>
                <option>Not Yet</option>
                <option>No</option>
              </select>
            </Field>

            <Field label="GP / Ambulance Called?">
              <SelectYesNo
                value={form.incident.gpAmbulance}
                onChange={(value) =>
                  updateSection(
                    "incident",
                    "gpAmbulance",
                    value
                  )
                }
              />
            </Field>

            <Field label="If yes, state details" wide>
              <textarea
                rows="3"
                value={form.incident.gpAmbulanceDetails}
                onChange={(e) =>
                  updateSection(
                    "incident",
                    "gpAmbulanceDetails",
                    e.target.value
                  )
                }
              />
            </Field>

            <Field label="Incident Notes" wide>
              <textarea
                rows="4"
                value={form.incident.notes}
                onChange={(e) =>
                  updateSection("incident", "notes", e.target.value)
                }
              />
            </Field>
          </div>
        </ReportSection>

        {/* ==============================
            BEHAVIOUR
        ============================== */}

        <ReportSection
          icon={<Brain size={18} />}
          title="Behaviour"
          description="Record behaviour observed during the care period."
        >
          <div className="report-grid">
            <Field label="Date">
              <input
                type="date"
                value={form.behaviour.date}
                onChange={(e) =>
                  updateSection("behaviour", "date", e.target.value)
                }
              />
            </Field>

            <Field label="Time">
              <input
                type="time"
                value={form.behaviour.time}
                onChange={(e) =>
                  updateSection("behaviour", "time", e.target.value)
                }
              />
            </Field>
          </div>

          <div className="field-block">
            <label>Behaviour Observed</label>

            <div className="checkbox-grid">
              {BEHAVIOURS.map((behaviour) => (
                <label className="checkbox-card" key={behaviour}>
                  <input
                    type="checkbox"
                    checked={form.behaviour.selected.includes(behaviour)}
                    onChange={() => toggleBehaviour(behaviour)}
                  />
                  <span>{behaviour}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="field-block">
            <label>Communication / Trigger Reason</label>

            <div className="trigger-list">
              {COMMUNICATION_REASONS.map((reason) => (
                <label className="checkbox-card" key={reason}>
                  <input
                    type="radio"
                    name="communicationReason"
                    checked={
                      form.behaviour.communicationReason === reason
                    }
                    onChange={() =>
                      updateSection(
                        "behaviour",
                        "communicationReason",
                        reason
                      )
                    }
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="report-grid">
            <Field
              label="Antecedents — What happened before the incident?"
              wide
            >
              <textarea
                rows="5"
                value={form.behaviour.antecedents}
                onChange={(e) =>
                  updateSection(
                    "behaviour",
                    "antecedents",
                    e.target.value
                  )
                }
                placeholder="Describe what happened immediately before..."
              />
            </Field>

            <Field
              label="Consequences — What happened after the incident?"
              wide
            >
              <textarea
                rows="5"
                value={form.behaviour.consequences}
                onChange={(e) =>
                  updateSection(
                    "behaviour",
                    "consequences",
                    e.target.value
                  )
                }
                placeholder="Describe what happened afterwards..."
              />
            </Field>

            <Field label="Behaviour Notes" wide>
              <textarea
                rows="4"
                value={form.behaviour.notes}
                onChange={(e) =>
                  updateSection(
                    "behaviour",
                    "notes",
                    e.target.value
                  )
                }
              />
            </Field>
          </div>
        </ReportSection>

        {/* ==============================
            COMFORT CHECK
        ============================== */}

        <ReportSection
          icon={<Heart size={18} />}
          title="Comfort Check"
          description="Record the client's comfort and wellbeing."
        >
          <div className="report-grid">
            <Field label="Time">
              <input
                type="time"
                value={form.comfort.time}
                onChange={(e) =>
                  updateSection("comfort", "time", e.target.value)
                }
              />
            </Field>

            <Field label="Cheeks">
              <SelectCheck
                value={form.comfort.cheeks}
                onChange={(value) =>
                  updateSection("comfort", "cheeks", value)
                }
              />
            </Field>

            <Field label="Skin">
              <SelectCheck
                value={form.comfort.skin}
                onChange={(value) =>
                  updateSection("comfort", "skin", value)
                }
              />
            </Field>

            <Field label="Pain">
              <SelectCheck
                value={form.comfort.pain}
                onChange={(value) =>
                  updateSection("comfort", "pain", value)
                }
              />
            </Field>

            <Field label="Positioning">
              <SelectCheck
                value={form.comfort.positioning}
                onChange={(value) =>
                  updateSection("comfort", "positioning", value)
                }
              />
            </Field>

            <Field label="General Comfort">
              <SelectCheck
                value={form.comfort.generalComfort}
                onChange={(value) =>
                  updateSection(
                    "comfort",
                    "generalComfort",
                    value
                  )
                }
              />
            </Field>

            <Field label="Notes" wide>
              <textarea
                rows="4"
                value={form.comfort.notes}
                onChange={(e) =>
                  updateSection("comfort", "notes", e.target.value)
                }
                placeholder="Comfort check observations..."
              />
            </Field>
          </div>
        </ReportSection>

        {/* ==============================
            BLOOD TEST
        ============================== */}

        <ReportSection
          icon={<TestTube size={18} />}
          title="Blood Test"
          description="Record any blood test completed during the care period."
        >
          <div className="report-grid">
            <Field label="Date">
              <input
                type="date"
                value={form.bloodTest.date}
                onChange={(e) =>
                  updateSection("bloodTest", "date", e.target.value)
                }
              />
            </Field>

            <Field label="Time">
              <input
                type="time"
                value={form.bloodTest.time}
                onChange={(e) =>
                  updateSection("bloodTest", "time", e.target.value)
                }
              />
            </Field>

            <Field label="Completed">
              <SelectYesNo
                value={form.bloodTest.completed}
                onChange={(value) =>
                  updateSection("bloodTest", "completed", value)
                }
              />
            </Field>

            <Field label="Blood Test Type">
              <input
                value={form.bloodTest.type}
                onChange={(e) =>
                  updateSection("bloodTest", "type", e.target.value)
                }
                placeholder="e.g. Blood glucose"
              />
            </Field>

            <Field label="Result">
              <input
                value={form.bloodTest.result}
                onChange={(e) =>
                  updateSection("bloodTest", "result", e.target.value)
                }
                placeholder="Enter result"
              />
            </Field>

            <Field label="Notes" wide>
              <textarea
                rows="3"
                value={form.bloodTest.notes}
                onChange={(e) =>
                  updateSection("bloodTest", "notes", e.target.value)
                }
              />
            </Field>
          </div>
        </ReportSection>

        {/* ==============================
            PDF
        ============================== */}

        <ReportSection
          icon={<UploadCloud size={18} />}
          title="Upload Client Report As PDF"
          description="Upload the completed client care report in PDF format."
        >
          <label className="pdf-upload">
            <UploadCloud size={25} />

            <strong>Click to browse</strong>

            <span>Only PDF files should be uploaded.</span>

            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => handleReportFile(e.target.files?.[0])}
            />
          </label>

          {reportFile && (
            <div className="uploaded-pdf">
              <div className="pdf-file-icon">
                <FileText size={19} />
              </div>

              <div className="pdf-file-details">
                <strong>{reportFile.name}</strong>
                <span>PDF report ready to submit</span>
              </div>

              <a
                href={reportFile.url}
                target="_blank"
                rel="noreferrer"
                className="view-pdf"
              >
                View
              </a>

              <button
                type="button"
                className="remove-pdf"
                onClick={removeReportFile}
                aria-label="Remove PDF"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </ReportSection>

        {/* ==============================
            GENERAL REPORT
        ============================== */}

        <ReportSection
          icon={<ClipboardList size={18} />}
          title="General Report"
          description="Add any additional information the admin or care team should know."
        >
          <Field label="Report Notes" wide>
            <textarea
              rows="7"
              value={form.generalNotes}
              onChange={(e) => update("generalNotes", e.target.value)}
              placeholder="Enter any additional observations, concerns, changes in condition, activities or other important information..."
            />
          </Field>
        </ReportSection>

        {error && (
          <div className="report-form-error">
            <AlertTriangle size={17} />
            <span>{error}</span>
          </div>
        )}

        {/* ACTIONS */}

        <div className="report-form-actions">
          <button
            type="button"
            className="report-outline-btn"
            onClick={() => nav(-1)}
          >
            Cancel
          </button>

          <button type="submit" className="report-primary-btn">
            <Save size={16} />
            Submit Client Report
          </button>
        </div>
      </form>

      <div className="report-watermark">
        LAMBETH RESOLUTION HOMECARE
      </div>
    </div>
  );
}

/* =========================================
   REUSABLE COMPONENTS
========================================= */

function ReportSection({ icon, title, description, children }) {
  return (
    <section className="report-section">
      <div className="report-section-head">
        <span className="report-section-icon">{icon}</span>

        <div>
          <h2>{title}</h2>

          {description && <p>{description}</p>}
        </div>
      </div>

      <div className="report-section-body">{children}</div>
    </section>
  );
}

function Field({ label, children, wide = false }) {
  return (
    <label className={`report-field ${wide ? "wide" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Radio({ label, name, value, checked, onChange }) {
  return (
    <label className="radio-option">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </label>
  );
}

function SelectYesNo({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select...</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
      <option value="Not Attempted">Not Attempted</option>
    </select>
  );
}

function SelectCheck({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select...</option>
      <option value="Comfortable">Comfortable</option>
      <option value="Not Comfortable">Not Comfortable</option>
      <option value="Checked - No Concern">Checked - No Concern</option>
      <option value="Concern Noted">Concern Noted</option>
    </select>
  );
}
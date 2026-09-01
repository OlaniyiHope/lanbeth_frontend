import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Cake,
  MapPin,
  UserRound,
  FileHeart,
  Pill,
  Heart,
  CalendarClock,
  ShieldAlert,
  FolderOpen,
  Users,
  ClipboardList,
  Utensils,
  Clock,
  FileText,
  Download,
  ShieldCheck,
  UserPlus,
  Search,
} from "lucide-react";
import { useData } from "../../../context/DataContext.jsx";
import "./ClientProfile.css";

const TABS = [
  { key: "personal", label: "Personal Info", icon: UserRound },
  { key: "medical", label: "Medical History", icon: FileHeart },
  { key: "foodIntake", label: "Food Intake", icon: Utensils },
  { key: "medications", label: "Medications", icon: Pill },
  { key: "activities", label: "Favorite Activities", icon: Heart },
  { key: "daily", label: "Daily Care", icon: CalendarClock },
  { key: "allergies", label: "Allergies", icon: ShieldAlert },
  { key: "documents", label: "Document", icon: FolderOpen },
  { key: "family", label: "Family & Emergency Contact", icon: Users },
  { key: "reports", label: "View Report", icon: ClipboardList },
];

function formatTime(value) {
  if (!value) return null;
  const [h, m] = value.split(":");
  const hour = Number(h);
  if (Number.isNaN(hour)) return value;
  const period = hour >= 12 ? "PM" : "AM";
  const twelveHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(twelveHour).padStart(2, "0")}:${m} ${period}`;
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

function getAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const diff = Date.now() - birth.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

function ClientProfile() {
  const nav = useNavigate();
 
  const { data, setData } = useData();
  const [activeTab, setActiveTab] = useState("personal");
  const [confirmDelete, setConfirmDelete] = useState(false);

const [staff, setStaff] = useState([]);
const [selectedStaff, setSelectedStaff] = useState("");
const [loadingStaff, setLoadingStaff] = useState(false);
const [assigningStaff, setAssigningStaff] = useState(false);
const [staffError, setStaffError] = useState("");
const [assignSuccess, setAssignSuccess] = useState("");
  const { id } = useParams();

const client =
  data.clients.find((c) => c.clientId === id) ||
  data.clients.find((c) => c._id === id);
  useEffect(() => {
  const fetchStaff = async () => {
    try {
      setLoadingStaff(true);
      setStaffError("");

      const token = localStorage.getItem("lanbeth-auth-token");

      if (!token) {
        setStaffError("You are not authenticated.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/staff`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
          result?.error ||
          "Failed to fetch staff."
        );
      }

      setStaff(result.staff || result.data || result || []);
    } catch (error) {
      console.error("Fetch staff error:", error);
      setStaffError(error.message || "Unable to load staff.");
    } finally {
      setLoadingStaff(false);
    }
  };

  fetchStaff();
}, []);

  if (!client) {
    return (
      <div className="client-profile-page">
        <p>No client found.</p>
      </div>
    );
  }

  const age = getAge(client.dateOfBirth);

  const removeClient = () => {
    setData({
      ...data,
      clients: data.clients.filter((c) => c.id !== client.id),
    });
    nav("/admin/clients");
  };

  return (
    <div className="client-profile-page">
      <div className="page-head">
        <button className="icon-btn" onClick={() => nav("/admin/clients")} aria-label="Back to clients">
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="eyebrow">LANBETHCARE</div>
          <h1>Client Profile</h1>
          <p>View and manage client information.</p>
        </div>
      </div>

      <div className="client-hero">
        <div className="client-hero-main">
          <span className="client-hero-avatar">
            {client.initials || getInitials(client.name)}
          </span>
          <div className="client-hero-id">
            <h2>{client.name}</h2>
            <span className="client-hero-code">Client ID: {client.id}</span>
            <div className="client-hero-meta">
              {age !== null && <span>{age} years old</span>}
              {client.sex && <span>{client.sex}</span>}
              {client.phone && (
                <span>
                  <Phone size={12} /> {client.phone}
                </span>
              )}
              {client.email && (
                <span>
                  <Mail size={12} /> {client.email}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="client-hero-actions">
          <button className="outline-light" onClick={() => setConfirmDelete(true)}>
            <Trash2 size={14} />
            Delete
          </button>
          <button
            className="primary-light"
            onClick={() => nav(`/admin/edit-client/${client.id}`)}
          >
            <Pencil size={14} />
            Edit Profile
          </button>
        </div>
      </div>
      <AssignStaffSection
        client={client}
        staff={staff}
        loadingStaff={loadingStaff}
        selectedStaff={selectedStaff}
        setSelectedStaff={setSelectedStaff}
        assigningStaff={assigningStaff}
        setAssigningStaff={setAssigningStaff}
        staffError={staffError}
        setStaffError={setStaffError}
        assignSuccess={assignSuccess}
        setAssignSuccess={setAssignSuccess}
      />

      <div className="client-tabs" role="tablist">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={active}
              className={`client-tab ${active ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="client-tab-panel">
        {activeTab === "personal" && <PersonalInfoTab client={client} />}
        {activeTab === "medical" && <MedicalHistoryTab client={client} />}
        {activeTab === "foodIntake" && <FoodIntakeTab client={client} />}
        {activeTab === "medications" && <MedicationsTab client={client} />}
        {activeTab === "activities" && <ActivitiesTab client={client} />}
        {activeTab === "daily" && <DailyCareTab client={client} />}
        {activeTab === "allergies" && <AllergiesTab client={client} />}
        {activeTab === "documents" && <DocumentsTab client={client} />}
        {activeTab === "family" && <FamilyTab client={client} />}
        {activeTab === "reports" && <ReportsTab client={client} />}
      </div>

      {confirmDelete && (
        <Modal title="Delete Client" onClose={() => setConfirmDelete(false)}>
          <ConfirmDelete
            name={client.name}
            onCancel={() => setConfirmDelete(false)}
            onConfirm={removeClient}
          />
        </Modal>
      )}
    </div>
  );
}
function AssignStaffSection({
  client,
  staff,
  loadingStaff,
  selectedStaff,
  setSelectedStaff,
  assigningStaff,
  setAssigningStaff,
  staffError,
  setStaffError,
  assignSuccess,
  setAssignSuccess,
}) {
  const currentStaff = client.assignedStaff || [];

const assignStaff = async () => {
  if (!selectedStaff) {
    setStaffError("Please select a staff member.");
    return;
  }

  try {
    setAssigningStaff(true);
    setStaffError("");
    setAssignSuccess("");

    const token =
      localStorage.getItem(
        "lanbeth-auth-token"
      );

    if (!token) {
      setStaffError(
        "You are not authenticated."
      );
      return;
    }

    // Get currently assigned staff IDs
    const currentStaffIds =
      (client.assignedStaff || []).map(
        (member) =>
          member._id ||
          member.id ||
          member.staffId ||
          member
      );

    // Prevent duplicate
    if (
      currentStaffIds.some(
        (staffId) =>
          staffId.toString() ===
          selectedStaff.toString()
      )
    ) {
      setStaffError(
        "This staff member is already assigned to this client."
      );
      return;
    }

    // Add newly selected staff
    const updatedStaffIds = [
      ...currentStaffIds,
      selectedStaff,
    ];

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients/${client._id}/assign-staff`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          staffIds: updatedStaffIds,
        }),
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result?.message ||
          result?.error ||
          "Failed to assign staff."
      );
    }

    setAssignSuccess(
      "Staff member assigned successfully."
    );

    setSelectedStaff("");

    // Update client data in the page
    if (result.client) {
      client.assignedStaff =
        result.client.assignedStaff;
    }

    // Notify other components
    window.dispatchEvent(
      new Event("client-updated")
    );
  } catch (error) {
    console.error(
      "Assign staff error:",
      error
    );

    setStaffError(
      error.message ||
        "Unable to assign staff member."
    );
  } finally {
    setAssigningStaff(false);
  }
};
  return (
    <div className="assign-staff-card">
      <div className="assign-staff-header">
        <div className="assign-staff-title">
          <span className="assign-staff-icon">
            <UserPlus size={18} />
          </span>

          <div>
            <h3>Assign Staff</h3>
            <p>
              Assign care staff members who will be responsible for this client.
            </p>
          </div>
        </div>
      </div>

      <div className="assign-staff-body">

        <div className="assign-staff-form">
          <label>
            <span>Select Staff Member</span>

            <select
              value={selectedStaff}
              onChange={(e) => {
                setSelectedStaff(e.target.value);
                setStaffError("");
                setAssignSuccess("");
              }}
              disabled={loadingStaff || assigningStaff}
            >
              <option value="">
                {loadingStaff
                  ? "Loading staff..."
                  : "Select a staff member"}
              </option>

              {staff.map((member) => (
                <option
                  key={member._id || member.id}
                  value={member._id || member.id}
                >
                  {member.fullName || member.name || member.username}
                  {member.jobTitle
                    ? ` — ${member.jobTitle}`
                    : ""}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="primary"
            onClick={assignStaff}
            disabled={
              !selectedStaff ||
              assigningStaff ||
              loadingStaff
            }
          >
            <UserPlus size={15} />

            {assigningStaff
              ? "Assigning..."
              : "Assign Staff"}
          </button>
        </div>

        {staffError && (
          <div className="assign-staff-error">
            {staffError}
          </div>
        )}

        {assignSuccess && (
          <div className="assign-staff-success">
            {assignSuccess}
          </div>
        )}

        <div className="assigned-staff-list">
          <div className="assigned-staff-heading">
            <span>Currently Assigned Staff</span>
            <strong>{currentStaff.length}</strong>
          </div>

          {currentStaff.length === 0 ? (
            <div className="no-assigned-staff">
              <Users size={18} />

              <div>
                <strong>No staff assigned</strong>
                <p>
                  Select a staff member above to assign them
                  to this client.
                </p>
              </div>
            </div>
          ) : (
            <div className="assigned-staff-grid">
              {currentStaff.map((member, index) => (
                <div
                  className="assigned-staff-item"
                  key={
                    member._id ||
                    member.id ||
                    member.staffId ||
                    index
                  }
                >
                  <span className="assigned-staff-avatar">
                    {getInitials(
                      member.fullName ||
                      member.name ||
                      member.username ||
                      "Staff"
                    )}
                  </span>

                  <div>
                    <strong>
                      {member.fullName ||
                        member.name ||
                        member.username}
                    </strong>

                    <small>
                      {member.jobTitle ||
                        member.role ||
                        "Staff"}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PersonalInfoTab({ client }) {
  return (
    <div className="info-panel">
      <div className="info-panel-section">
        <h3>Contact Details</h3>
        <div className="info-grid">
          <Info icon={<Mail size={13} />} label="Email" value={client.email} />
          <Info icon={<Phone size={13} />} label="Phone" value={client.phone} />
          <Info icon={<Cake size={13} />} label="Date of Birth" value={client.dateOfBirth} />
          <Info icon={<MapPin size={13} />} label="Address" value={client.address} />
          <Info label="Post Code" value={client.postCode} />
          <Info label="Region" value={client.region} />
        </div>
      </div>

      <div className="info-panel-section">
        <h3>Background</h3>
        <div className="info-grid">
          <Info label="Sex" value={client.sex} />
          <Info label="Marital Status" value={client.maritalStatus} />
          <Info label="Religion" value={client.religion} />
          <Info label="Ethnicity" value={client.ethnicity} />
          <Info label="Key Safe Code" value={client.keySafeCode} />
          <Info
            label="Communication Preference"
            value={client.communicationPreference}
            wide
          />
        </div>
      </div>
    </div>
  );
}

function Info({ icon, label, value, wide }) {
  return (
    <div className={`info-item ${wide ? "wide" : ""}`}>
      <small>
        {icon} {label}
      </small>
      <b>{value?.trim ? (value.trim() || "—") : value || "—"}</b>
    </div>
  );
}

function MedicalHistoryTab({ client }) {
  const hasHistory = client.medicalHistory && client.medicalHistory.trim();
  return (
    <div className="info-panel">
      <div className="info-panel-section">
        <h3>Medical History</h3>
        {hasHistory ? (
          <p className="note-block">{client.medicalHistory}</p>
        ) : (
          <EmptyState
            icon={<FileHeart size={20} />}
            title="No medical history recorded"
            desc="Conditions, past procedures, or notes for the care team will appear here."
          />
        )}
      </div>
    </div>
  );
}

function FoodIntakeTab({ client }) {
  const meal = client.meal || {};
  const hasMeal = meal.type || meal.description || meal.time;
  return (
    <div className="info-panel">
      <div className="info-panel-section">
        <h3>Current Food Intake Plan</h3>
        {hasMeal ? (
          <div className="info-grid">
            <Info label="Meal Type" value={meal.type} />
            <Info label="Meal Time" value={formatTime(meal.time)} />
            <Info label="Meal Day" value={meal.day} />
            <Info label="Meal Description" value={meal.description} wide />
          </div>
        ) : (
          <EmptyState
            icon={<Utensils size={20} />}
            title="No food intake plan recorded"
            desc="Meal type, timing, and dietary notes will appear here."
          />
        )}
      </div>
    </div>
  );
}

function MedicationsTab({ client }) {
  const medications = client.medications || [];
  return (
    <div className="info-panel">
      <div className="info-panel-section">
        <h3>Medication Schedule</h3>
        {medications.length === 0 ? (
          <EmptyState
            icon={<Pill size={20} />}
            title="No medications recorded"
            desc="Medications added for this client will be listed here."
          />
        ) : (
          <div className="medication-list">
            {medications.map((med, i) => (
              <div className="medication-card" key={med.id || i}>
                <span className="medication-icon">
                  <Pill size={15} />
                </span>
                <div className="medication-details">
                  <div className="medication-top">
                    <b>{med.name || "Untitled medication"}</b>
                    {med.dosage && <span className="medication-badge">{med.dosage}</span>}
                  </div>
                  <div className="medication-meta">
                    {med.time && (
                      <span>
                        <Clock size={12} /> {formatTime(med.time)}
                      </span>
                    )}
                    {med.date && <span>{med.date}</span>}
                  </div>
                  {med.instructions && (
                    <p className="medication-instructions">{med.instructions}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActivitiesTab({ client }) {
  const hasActivities = client.favouriteActivities && client.favouriteActivities.trim();
  return (
    <div className="info-panel">
      <div className="info-panel-section">
        <h3>Favourite Activities</h3>
        {hasActivities ? (
          <p className="note-block">{client.favouriteActivities}</p>
        ) : (
          <EmptyState
            icon={<Heart size={20} />}
            title="No favourite activities recorded"
            desc="Hobbies and preferences that support wellbeing will appear here."
          />
        )}
      </div>
    </div>
  );
}

function DailyCareTab({ client }) {
  const dailyCare = client.dailyCare || {};
  const hasSchedule = dailyCare.bedtime || dailyCare.bathTime;
  return (
    <div className="info-panel">
      <div className="info-panel-section">
        <h3>Daily Care Schedule</h3>
        {hasSchedule ? (
          <div className="info-grid">
            <Info icon={<Clock size={13} />} label="Bedtime" value={formatTime(dailyCare.bedtime)} />
            <Info icon={<Clock size={13} />} label="Bath Time" value={formatTime(dailyCare.bathTime)} />
          </div>
        ) : (
          <EmptyState
            icon={<CalendarClock size={20} />}
            title="No daily care schedule recorded"
            desc="Bedtime and bath time routines will appear here."
          />
        )}
      </div>
    </div>
  );
}

function AllergiesTab({ client }) {
  const list = (client.allergies || "")
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);
  return (
    <div className="info-panel">
      <div className="info-panel-section">
        <h3>Allergies</h3>
        {list.length === 0 ? (
          <EmptyState
            icon={<ShieldAlert size={20} />}
            title="No allergies recorded"
            desc="Known allergies and sensitivities will appear here."
          />
        ) : (
          <div className="allergy-chips">
            {list.map((a) => (
              <span className="allergy-chip" key={a}>
                <ShieldAlert size={12} />
                {a}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentsTab({ client }) {
  const documents = client.documents || [];
  return (
    <div className="info-panel">
      <div className="info-panel-section">
        <h3>Uploaded Documents</h3>
        {documents.length === 0 ? (
          <EmptyState
            icon={<FolderOpen size={20} />}
            title="No documents uploaded"
            desc="Care plans, identity documents, and other files will appear here."
          />
        ) : (
          <div className="doc-list">
            {documents.map((doc, i) => (
              <div className="doc-row" key={doc.id || i}>
                <FileText size={15} />
                <span className="doc-name">{doc.name}</span>
                <a href={doc.url} target="_blank" rel="noreferrer">
                  View
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FamilyTab({ client }) {
  const hasContact =
    client.familyMemberName || client.nextOfKinName || client.nextOfKinPhone;
  return (
    <div className="info-panel">
      <div className="info-panel-section">
        <h3>Family & Emergency Contact</h3>
        {hasContact ? (
          <div className="info-grid">
            <Info icon={<Users size={13} />} label="Family Member Name" value={client.familyMemberName} />
            <Info label="Relationship" value={client.relationship} />
            <Info icon={<UserPlus size={13} />} label="Next of Kin Name" value={client.nextOfKinName} />
            <Info icon={<Phone size={13} />} label="Next of Kin Phone" value={client.nextOfKinPhone} />
          </div>
        ) : (
          <EmptyState
            icon={<Users size={20} />}
            title="No emergency contact recorded"
            desc="Family and next-of-kin details will appear here."
          />
        )}
      </div>
    </div>
  );
}

function ReportsTab({ client }) {
  const [filterDate, setFilterDate] = useState("");
  const reports = client.reports || [];
  const matched = filterDate
    ? reports.filter((r) => r.date === filterDate)
    : reports;
  const report = matched[0];

  return (
    <div className="info-panel">
      <div className="report-filter">
        <label>
          <span>Filter by Date</span>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </label>
        <button className="primary-light apply-btn" type="button">
          <Search size={14} />
          Apply Filters
        </button>
      </div>

      {report ? (
        <div className="report-card">
          <div className="info-grid">
            <Info icon={<ShieldCheck size={13} />} label="Staff" value={report.staff} />
            <Info label="Report File" value={report.reportFile} />
            <Info label="Medication Given" value={report.medicationGiven} />
            <Info label="Meal Given" value={report.mealGiven} />
            <Info icon={<Clock size={13} />} label="Bath Time" value={formatTime(report.bathTime)} />
            <Info icon={<Clock size={13} />} label="Bedtime" value={formatTime(report.bedtime)} />
            <Info label="Incident" value={report.incident} wide />
            <Info label="Comments" value={report.comments} wide />
          </div>
          <div className="report-links">
            {report.uploadUrl && (
              <a href={report.uploadUrl} target="_blank" rel="noreferrer">
                View manual upload report
              </a>
            )}
            {report.downloadUrl && (
              <a href={report.downloadUrl} download>
                <Download size={13} />
                Download report
              </a>
            )}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={<ClipboardList size={20} />}
          title={filterDate ? "No report for this date" : "No reports submitted yet"}
          desc={
            filterDate
              ? "Try a different date, or clear the filter to see all reports."
              : "Daily care reports submitted by staff will appear here."
          }
        />
      )}
    </div>
  );
}

function EmptyState({ icon, title, desc }) {
  return (
    <div className="coming-soon">
      <span className="coming-soon-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">CLIENT MANAGEMENT</span>
            <h2>{title}</h2>
          </div>
          <button className="icon-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function ConfirmDelete({ name, onCancel, onConfirm }) {
  return (
    <div className="confirm-delete">
      <div className="delete-icon">
        <Trash2 />
      </div>
      <h3>Delete this client?</h3>
      <p>
        You are about to permanently delete <b>{name}</b>. This action cannot be undone.
      </p>
      <div className="confirm-actions">
        <button className="outline" onClick={onCancel}>
          Cancel
        </button>
        <button className="danger-solid" onClick={onConfirm}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default ClientProfile;

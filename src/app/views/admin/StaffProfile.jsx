import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  UserRound,
  FolderOpen,
  CalendarClock,
  UploadCloud,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { useData } from "../../../context/DataContext.jsx";
import { DOC_TYPES } from "./AddStaff.jsx";
import "./StaffProfile.css";

const TABS = [
  { key: "personal", label: "Personal Info", icon: UserRound },
  { key: "uploaded", label: "Uploaded Documents", icon: FolderOpen },
  { key: "expiry", label: "Expiry Documents", icon: CalendarClock },
  { key: "upload", label: "Upload Documents", icon: UploadCloud },
];

const EXPIRY_WINDOW_DAYS = 30;

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

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) return null;
  const diff = target.getTime() - Date.now();
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

function StaffProfile() {
  const nav = useNavigate();
  const { id } = useParams();
  const { data, setData } = useData();
  const [activeTab, setActiveTab] = useState("personal");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const staff = data.staff.find((s) => s.id === id) || data.staff[0];

  if (!staff) {
    return (
      <div className="staff-profile-page">
        <p>No staff member found.</p>
      </div>
    );
  }

  const age = getAge(staff.dateOfBirth);

  const removeStaff = () => {
    setData({ ...data, staff: data.staff.filter((s) => s.id !== staff.id) });
    nav("/admin/staff");
  };

  const saveDocuments = (documents) => {
    setData({
      ...data,
      staff: data.staff.map((s) => (s.id === staff.id ? { ...s, documents } : s)),
    });
  };

  return (
    <div className="staff-profile-page">
      <div className="page-head">
        <button className="icon-btn" onClick={() => nav("/admin/staff")} aria-label="Back to staff">
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="eyebrow">LANBETHCARE</div>
          <h1>Staff Profile</h1>
          <p>View and manage staff information.</p>
        </div>
      </div>

      <div className="staff-hero">
        <div className="staff-hero-main">
          <span className="staff-hero-avatar">{staff.initials || getInitials(staff.name)}</span>
          <div className="staff-hero-id">
            <h2>{staff.name}</h2>
            <span className="staff-hero-code">
              {staff.role || "Staff"} · ID: {staff.id}
            </span>
            <div className="staff-hero-meta">
              {age !== null && <span>{age} years old</span>}
              {staff.gender && <span>{staff.gender}</span>}
              {staff.phone && (
                <span>
                  <Phone size={12} /> {staff.phone}
                </span>
              )}
              {staff.email && (
                <span>
                  <Mail size={12} /> {staff.email}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="staff-hero-actions">
          <button className="outline-light" onClick={() => setConfirmDelete(true)}>
            <Trash2 size={14} />
            Delete
          </button>
          <button className="primary-light" onClick={() => nav(`/admin/edit-staff/${staff.id}`)}>
            <Pencil size={14} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="staff-tabs" role="tablist">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={active}
              className={`staff-tab ${active ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="staff-tab-panel">
        {activeTab === "personal" && <PersonalInfoTab staff={staff} />}
        {activeTab === "uploaded" && <UploadedDocumentsTab staff={staff} />}
        {activeTab === "expiry" && <ExpiryDocumentsTab staff={staff} />}
        {activeTab === "upload" && (
          <UploadDocumentsTab staff={staff} onSave={saveDocuments} />
        )}
      </div>

      {confirmDelete && (
        <Modal title="Delete Staff" onClose={() => setConfirmDelete(false)}>
          <ConfirmDelete
            name={staff.name}
            onCancel={() => setConfirmDelete(false)}
            onConfirm={removeStaff}
          />
        </Modal>
      )}
    </div>
  );
}

function PersonalInfoTab({ staff }) {
  return (
    <div className="info-panel">
      <div className="subsection-bar">Basic Information</div>
      <div className="info-grid">
        <Info label="Name" value={staff.name} />
        <Info icon={<Mail size={13} />} label="Email" value={staff.email} />
        <Info label="Gender" value={staff.gender} />
        <Info label="Date of Birth" value={staff.dateOfBirth} />
        <Info label="Position Applied For" value={staff.positionAppliedFor} />
        <Info label="Role" value={staff.role} />
        <Info label="Employment Type" value={staff.employment} />
        <Info label="Status" value={staff.status} />
        <Info label="Work Permit Expiry" value={staff.workPermitExpiry || "0000-00-00 (Expired)"} />
        <Info label="Marital Status" value={staff.maritalStatus} />
        <Info label="Religion" value={staff.religion} />
        <Info label="Ethnicity" value={staff.ethnicity} />
        <Info label="Address" value={staff.address} wide />
        <Info label="Postcode" value={staff.postCode} />
        <Info label="Region" value={staff.region} />
      </div>
    </div>
  );
}

function UploadedDocumentsTab({ staff }) {
  const documents = staff.documents || [];
  return (
    <div className="info-panel">
      <div className="doc-status-list">
        {DOC_TYPES.map((type) => {
          const doc = documents.find((d) => d.type === type);
          return (
            <div className="doc-status-row" key={type}>
              <span className="doc-status-name">{type}:</span>
              {doc ? (
                <a href={doc.url} target="_blank" rel="noreferrer">
                  View
                </a>
              ) : (
                <span className="doc-status-missing">Not uploaded</span>
              )}
              <span className="doc-status-expiry">
                Expiry: {doc?.expiry || "0000-00-00"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExpiryDocumentsTab({ staff }) {
  const documents = staff.documents || [];
  const expiring = documents
    .map((doc) => ({ ...doc, daysLeft: daysUntil(doc.expiry) }))
    .filter((doc) => doc.daysLeft !== null && doc.daysLeft <= EXPIRY_WINDOW_DAYS);

  if (expiring.length === 0) {
    return (
      <div className="info-panel">
        <p className="expiry-empty">
          No document will expire in the next {EXPIRY_WINDOW_DAYS} days
        </p>
      </div>
    );
  }

  return (
    <div className="info-panel">
      <div className="doc-status-list">
        {expiring.map((doc) => (
          <div className="doc-status-row" key={doc.id}>
            <span className="doc-status-name">{doc.type}:</span>
            <span className={doc.daysLeft < 0 ? "expiry-badge expired" : "expiry-badge"}>
              {doc.daysLeft < 0 ? "Expired" : `${doc.daysLeft} days left`}
            </span>
            <span className="doc-status-expiry">Expiry: {doc.expiry}</span>
            <a href={doc.url} target="_blank" rel="noreferrer">
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function UploadDocumentsTab({ staff, onSave }) {
  const [docType, setDocType] = useState(DOC_TYPES[0]);
  const [expiry, setExpiry] = useState("");
  const [saved, setSaved] = useState(false);

  const handleFile = (fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    const documents = staff.documents || [];
    const next = [
      ...documents.filter((d) => d.type !== docType),
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: docType,
        name: file.name,
        url: URL.createObjectURL(file),
        expiry,
      },
    ];
    onSave(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="info-panel">
      <h3 className="upload-heading">Upload Staff Documents</h3>
      <p className="upload-subtext">(PDF, JPG)</p>

      <div className="form-grid">
        <label className="field">
          <span>Document Type</span>
          <select value={docType} onChange={(e) => setDocType(e.target.value)}>
            {DOC_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Expiry Date</span>
          <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
        </label>
      </div>

      <label className="upload-drop">
        <UploadCloud size={18} />
        <span>
          <b>Browse...</b> or drag a file in
        </span>
        <input type="file" accept=".pdf,.jpg,.jpeg" onChange={(e) => handleFile(e.target.files)} />
      </label>

      {saved && <div className="upload-confirm">Document saved to this staff profile.</div>}

      <div className="doc-status-list" style={{ marginTop: 20 }}>
        {(staff.documents || []).map((doc) => (
          <div className="doc-status-row" key={doc.id}>
            <FileText size={14} />
            <span className="doc-status-name">{doc.type} — {doc.name}</span>
            <span className="doc-status-expiry">Expiry: {doc.expiry || "0000-00-00"}</span>
            <a href={doc.url} target="_blank" rel="noreferrer">
              View
            </a>
          </div>
        ))}
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
            <span className="eyebrow">STAFF MANAGEMENT</span>
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
      <h3>Delete this staff member?</h3>
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

export default StaffProfile;

// import { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   Pencil,
//   Trash2,
//   Mail,
//   Phone,
//   UserRound,
//   FolderOpen,
//   CalendarClock,
//   UploadCloud,
//   FileText,
//   ShieldCheck,
// } from "lucide-react";
// import { useData } from "../../../context/DataContext.jsx";
// import { DOC_TYPES } from "./AddStaff.jsx";
// import "./StaffProfile.css";

// const TABS = [
//   { key: "personal", label: "Personal Info", icon: UserRound },
//   { key: "uploaded", label: "Uploaded Documents", icon: FolderOpen },
//   { key: "expiry", label: "Expiry Documents", icon: CalendarClock },
//   { key: "upload", label: "Upload Documents", icon: UploadCloud },
// ];

// const EXPIRY_WINDOW_DAYS = 30;

// function getInitials(name = "") {
//   return name
//     .split(" ")
//     .filter(Boolean)
//     .map((word) => word[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();
// }

// function getAge(dob) {
//   if (!dob) return null;
//   const birth = new Date(dob);
//   if (Number.isNaN(birth.getTime())) return null;
//   const diff = Date.now() - birth.getTime();
//   return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
// }

// function daysUntil(dateStr) {
//   if (!dateStr) return null;
//   const target = new Date(dateStr);
//   if (Number.isNaN(target.getTime())) return null;
//   const diff = target.getTime() - Date.now();
//   return Math.ceil(diff / (24 * 60 * 60 * 1000));
// }

// function StaffProfile() {
//   const nav = useNavigate();
//   const { id } = useParams();
//   const { data, setData } = useData();
//   const [activeTab, setActiveTab] = useState("personal");
//   const [confirmDelete, setConfirmDelete] = useState(false);

//   // Mongo documents come back with `_id`, not `id` — match on either so
//   // this works regardless of which shape the record is in. NOTE: this no
//   // longer falls back to data.staff[0] on a miss — if the id in the URL
//   // doesn't match anything, we show "No staff member found" instead of
//   // silently showing the wrong person.
//   const staff = data.staff.find((s) => String(s._id || s.id) === id);

//   if (!staff) {
//     return (
//       <div className="staff-profile-page">
//         <p>No staff member found.</p>
//       </div>
//     );
//   }

//   const staffId = staff._id || staff.id;
//   const age = getAge(staff.dateOfBirth);

//   const removeStaff = () => {
//     setData({ ...data, staff: data.staff.filter((s) => (s._id || s.id) !== staffId) });
//     nav("/admin/staff");
//   };

//   const saveDocuments = (documents) => {
//     setData({
//       ...data,
//       staff: data.staff.map((s) => ((s._id || s.id) === staffId ? { ...s, documents } : s)),
//     });
//   };

//   return (
//     <div className="staff-profile-page">
//       <div className="page-head">
//         <button className="icon-btn" onClick={() => nav("/admin/staff")} aria-label="Back to staff">
//           <ArrowLeft size={18} />
//         </button>
//         <div>
//           <div className="eyebrow">LANBETHCARE</div>
//           <h1>Staff Profile</h1>
//           <p>View and manage staff information.</p>
//         </div>
//       </div>

//       <div className="staff-hero">
//         <div className="staff-hero-main">
//           <span className="staff-hero-avatar">{staff.initials || getInitials(staff.name)}</span>
//           <div className="staff-hero-id">
//             <h2>{staff.name}</h2>
//             <span className="staff-hero-code">
//               {staff.role || "Staff"} · ID: {staffId}
//             </span>
//             <div className="staff-hero-meta">
//               {age !== null && <span>{age} years old</span>}
//               {staff.gender && <span>{staff.gender}</span>}
//               {staff.phone && (
//                 <span>
//                   <Phone size={12} /> {staff.phone}
//                 </span>
//               )}
//               {staff.email && (
//                 <span>
//                   <Mail size={12} /> {staff.email}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="staff-hero-actions">
//           <button className="outline-light" onClick={() => setConfirmDelete(true)}>
//             <Trash2 size={14} />
//             Delete
//           </button>
//           <button className="primary-light" onClick={() => nav(`/admin/edit-staff/${staffId}`)}>
//             <Pencil size={14} />
//             Edit Profile
//           </button>
//         </div>
//       </div>

//       <div className="staff-tabs" role="tablist">
//         {TABS.map((tab) => {
//           const Icon = tab.icon;
//           const active = activeTab === tab.key;
//           return (
//             <button
//               key={tab.key}
//               role="tab"
//               aria-selected={active}
//               className={`staff-tab ${active ? "active" : ""}`}
//               onClick={() => setActiveTab(tab.key)}
//             >
//               <Icon size={14} />
//               {tab.label}
//             </button>
//           );
//         })}
//       </div>

//       <div className="staff-tab-panel">
//         {activeTab === "personal" && <PersonalInfoTab staff={staff} />}
//         {activeTab === "uploaded" && <UploadedDocumentsTab staff={staff} />}
//         {activeTab === "expiry" && <ExpiryDocumentsTab staff={staff} />}
//         {activeTab === "upload" && (
//           <UploadDocumentsTab staff={staff} onSave={saveDocuments} />
//         )}
//       </div>

//       {confirmDelete && (
//         <Modal title="Delete Staff" onClose={() => setConfirmDelete(false)}>
//           <ConfirmDelete
//             name={staff.name}
//             onCancel={() => setConfirmDelete(false)}
//             onConfirm={removeStaff}
//           />
//         </Modal>
//       )}
//     </div>
//   );
// }

// function PersonalInfoTab({ staff }) {
//   return (
//     <div className="info-panel">
//       <div className="subsection-bar">Basic Information</div>
//       <div className="info-grid">
//         <Info label="Name" value={staff.name} />
//         <Info icon={<Mail size={13} />} label="Email" value={staff.email} />
//         <Info label="Gender" value={staff.gender} />
//         <Info label="Date of Birth" value={staff.dateOfBirth} />
//         <Info label="Position Applied For" value={staff.positionAppliedFor} />
//         <Info label="Role" value={staff.role} />
//         <Info label="Employment Type" value={staff.employment} />
//         <Info label="Status" value={staff.status} />
//         <Info label="Work Permit Expiry" value={staff.workPermitExpiry || "0000-00-00 (Expired)"} />
//         <Info label="Marital Status" value={staff.maritalStatus} />
//         <Info label="Religion" value={staff.religion} />
//         <Info label="Ethnicity" value={staff.ethnicity} />
//         <Info label="Address" value={staff.address} wide />
//         <Info label="Postcode" value={staff.postCode} />
//         <Info label="Region" value={staff.region} />
//       </div>
//     </div>
//   );
// }

// function UploadedDocumentsTab({ staff }) {
//   const documents = staff.documents || [];
//   return (
//     <div className="info-panel">
//       <div className="doc-status-list">
//         {DOC_TYPES.map((type) => {
//           const doc = documents.find((d) => d.type === type);
//           return (
//             <div className="doc-status-row" key={type}>
//               <span className="doc-status-name">{type}:</span>
//               {doc ? (
//                 <a href={doc.url} target="_blank" rel="noreferrer">
//                   View
//                 </a>
//               ) : (
//                 <span className="doc-status-missing">Not uploaded</span>
//               )}
//               <span className="doc-status-expiry">
//                 Expiry: {doc?.expiry || "0000-00-00"}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// function ExpiryDocumentsTab({ staff }) {
//   const documents = staff.documents || [];
//   const expiring = documents
//     .map((doc) => ({ ...doc, daysLeft: daysUntil(doc.expiry) }))
//     .filter((doc) => doc.daysLeft !== null && doc.daysLeft <= EXPIRY_WINDOW_DAYS);

//   if (expiring.length === 0) {
//     return (
//       <div className="info-panel">
//         <p className="expiry-empty">
//           No document will expire in the next {EXPIRY_WINDOW_DAYS} days
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="info-panel">
//       <div className="doc-status-list">
//         {expiring.map((doc) => (
//           <div className="doc-status-row" key={doc.id}>
//             <span className="doc-status-name">{doc.type}:</span>
//             <span className={doc.daysLeft < 0 ? "expiry-badge expired" : "expiry-badge"}>
//               {doc.daysLeft < 0 ? "Expired" : `${doc.daysLeft} days left`}
//             </span>
//             <span className="doc-status-expiry">Expiry: {doc.expiry}</span>
//             <a href={doc.url} target="_blank" rel="noreferrer">
//               View
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function UploadDocumentsTab({ staff, onSave }) {
//   const [docType, setDocType] = useState(DOC_TYPES[0]);
//   const [expiry, setExpiry] = useState("");
//   const [saved, setSaved] = useState(false);

//   const handleFile = (fileList) => {
//     const file = fileList?.[0];
//     if (!file) return;
//     const documents = staff.documents || [];
//     const next = [
//       ...documents.filter((d) => d.type !== docType),
//       {
//         id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
//         type: docType,
//         name: file.name,
//         url: URL.createObjectURL(file),
//         expiry,
//       },
//     ];
//     onSave(next);
//     setSaved(true);
//     setTimeout(() => setSaved(false), 2500);
//   };

//   return (
//     <div className="info-panel">
//       <h3 className="upload-heading">Upload Staff Documents</h3>
//       <p className="upload-subtext">(PDF, JPG)</p>

//       <div className="form-grid">
//         <label className="field">
//           <span>Document Type</span>
//           <select value={docType} onChange={(e) => setDocType(e.target.value)}>
//             {DOC_TYPES.map((t) => (
//               <option key={t}>{t}</option>
//             ))}
//           </select>
//         </label>
//         <label className="field">
//           <span>Expiry Date</span>
//           <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
//         </label>
//       </div>

//       <label className="upload-drop">
//         <UploadCloud size={18} />
//         <span>
//           <b>Browse...</b> or drag a file in
//         </span>
//         <input type="file" accept=".pdf,.jpg,.jpeg" onChange={(e) => handleFile(e.target.files)} />
//       </label>

//       {saved && <div className="upload-confirm">Document saved to this staff profile.</div>}

//       <div className="doc-status-list" style={{ marginTop: 20 }}>
//         {(staff.documents || []).map((doc) => (
//           <div className="doc-status-row" key={doc.id}>
//             <FileText size={14} />
//             <span className="doc-status-name">{doc.type} — {doc.name}</span>
//             <span className="doc-status-expiry">Expiry: {doc.expiry || "0000-00-00"}</span>
//             <a href={doc.url} target="_blank" rel="noreferrer">
//               View
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function Info({ icon, label, value, wide }) {
//   return (
//     <div className={`info-item ${wide ? "wide" : ""}`}>
//       <small>
//         {icon} {label}
//       </small>
//       <b>{value?.trim ? (value.trim() || "—") : value || "—"}</b>
//     </div>
//   );
// }

// function Modal({ title, onClose, children }) {
//   return (
//     <div
//       className="modal-backdrop"
//       onMouseDown={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       <div className="modal">
//         <div className="modal-head">
//           <div>
//             <span className="eyebrow">STAFF MANAGEMENT</span>
//             <h2>{title}</h2>
//           </div>
//           <button className="icon-btn" onClick={onClose}>
//             ×
//           </button>
//         </div>
//         <div className="modal-body">{children}</div>
//       </div>
//     </div>
//   );
// }

// function ConfirmDelete({ name, onCancel, onConfirm }) {
//   return (
//     <div className="confirm-delete">
//       <div className="delete-icon">
//         <Trash2 />
//       </div>
//       <h3>Delete this staff member?</h3>
//       <p>
//         You are about to permanently delete <b>{name}</b>. This action cannot be undone.
//       </p>
//       <div className="confirm-actions">
//         <button className="outline" onClick={onCancel}>
//           Cancel
//         </button>
//         <button className="danger-solid" onClick={onConfirm}>
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// }

// export default StaffProfile;

import { useEffect, useState } from "react";
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
  RefreshCw,
  Eye,
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";

import { useData } from "../../../context/DataContext.jsx";
import { DOC_TYPES } from "./AddStaff.jsx";

import "./StaffProfile.css";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:5001").replace(
    /\/$/,
    ""
  ) + "/api";

const TABS = [
  {
    key: "personal",
    label: "Personal Info",
    icon: UserRound,
  },
  {
    key: "uploaded",
    label: "Uploaded Documents",
    icon: FolderOpen,
  },
  {
    key: "expiry",
    label: "Expiry Documents",
    icon: CalendarClock,
  },
  {
    key: "upload",
    label: "Upload Documents",
    icon: UploadCloud,
  },
];

const EXPIRY_WINDOW_DAYS = 30;

const getToken = () =>
  localStorage.getItem("lanbeth-auth-token");

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

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

  if (Number.isNaN(birth.getTime())) {
    return null;
  }

  const diff =
    Date.now() - birth.getTime();

  return Math.floor(
    diff /
      (365.25 *
        24 *
        60 *
        60 *
        1000)
  );
}

function getExpiryStatus(expiryDate) {
  if (!expiryDate) {
    return {
      status: "No Expiry",
      days: null,
    };
  }

  const today = new Date();
  const expiry = new Date(expiryDate);

  if (
    Number.isNaN(
      expiry.getTime()
    )
  ) {
    return {
      status: "No Expiry",
      days: null,
    };
  }

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const difference =
    expiry.getTime() -
    today.getTime();

  const days = Math.ceil(
    difference /
      (1000 * 60 * 60 * 24)
  );

  if (days < 0) {
    return {
      status: "Expired",
      days,
    };
  }

  if (days <= EXPIRY_WINDOW_DAYS) {
    return {
      status: "Expiring Soon",
      days,
    };
  }

  return {
    status: "Valid",
    days,
  };
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}

function getRemainingText(
  expiry
) {
  if (
    expiry.status ===
    "No Expiry"
  ) {
    return "No expiry date";
  }

  if (
    expiry.status ===
    "Expired"
  ) {
    const days = Math.abs(
      expiry.days
    );

    if (days === 0) {
      return "Expired today";
    }

    return `Expired ${days} day${
      days === 1 ? "" : "s"
    } ago`;
  }

  if (expiry.days === 0) {
    return "Expires today";
  }

  if (expiry.days === 1) {
    return "1 day remaining";
  }

  return `${expiry.days} days remaining`;
}

/*
|--------------------------------------------------------------------------
| Staff Profile
|--------------------------------------------------------------------------
*/

function StaffProfile() {
  const nav = useNavigate();
  const { id } = useParams();

  const { data, setData } =
    useData();

  const [activeTab, setActiveTab] =
    useState("personal");

  const [confirmDelete, setConfirmDelete] =
    useState(false);

  const [documents, setDocuments] =
    useState([]);

  const [documentsLoading, setDocumentsLoading] =
    useState(false);

  const [documentsError, setDocumentsError] =
    useState("");

  /*
   * Find staff from DataContext.
   */
  const staff = data.staff.find(
    (s) =>
      String(
        s._id || s.id
      ) === String(id)
  );

  /*
   |--------------------------------------------------------------------------
   | Load this staff member's real documents
   |--------------------------------------------------------------------------
   */

  const fetchDocuments = async () => {
    try {
      setDocumentsLoading(true);
      setDocumentsError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found."
        );
      }

      const response =
        await fetch(
          `${API_BASE_URL}/staff/${id}/documents`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            result.error ||
            "Failed to load documents."
        );
      }

      setDocuments(
        result.documents || []
      );
    } catch (error) {
      console.error(
        "LOAD STAFF DOCUMENTS ERROR:",
        error
      );

      setDocumentsError(
        error.message ||
          "Failed to load staff documents."
      );
    } finally {
      setDocumentsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDocuments();
    }
  }, [id]);

  if (!staff) {
    return (
      <div className="staff-profile-page">
        <p>
          No staff member found.
        </p>
      </div>
    );
  }

  const staffId =
    staff._id || staff.id;

  const age = getAge(
    staff.dateOfBirth
  );

  /*
  |--------------------------------------------------------------------------
  | Delete Staff
  |--------------------------------------------------------------------------
  */

  const removeStaff = () => {
    setData({
      ...data,
      staff: data.staff.filter(
        (s) =>
          String(
            s._id || s.id
          ) !== String(staffId)
      ),
    });

    nav("/admin/staff");
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="staff-profile-page">

      {/* HEADER */}

      <div className="page-head">

        <button
          className="icon-btn"
          onClick={() =>
            nav("/admin/staff")
          }
          aria-label="Back to staff"
        >
          <ArrowLeft size={18} />
        </button>

        <div>

          <div className="eyebrow">
            LANBETHCARE
          </div>

          <h1>
            Staff Profile
          </h1>

          <p>
            View and manage staff
            information.
          </p>

        </div>

      </div>

      {/* STAFF HERO */}

      <div className="staff-hero">

        <div className="staff-hero-main">

          <span className="staff-hero-avatar">
            {staff.initials ||
              getInitials(
                staff.name ||
                  staff.fullName
              )}
          </span>

          <div className="staff-hero-id">

            <h2>
              {staff.name ||
                staff.fullName}
            </h2>

            <span className="staff-hero-code">
              {staff.role ||
                "Staff"}{" "}
              · ID: {staffId}
            </span>

            <div className="staff-hero-meta">

              {age !== null && (
                <span>
                  {age} years old
                </span>
              )}

              {staff.gender && (
                <span>
                  {staff.gender}
                </span>
              )}

              {staff.phone && (
                <span>
                  <Phone size={12} />{" "}
                  {staff.phone}
                </span>
              )}

              {staff.email && (
                <span>
                  <Mail size={12} />{" "}
                  {staff.email}
                </span>
              )}

            </div>

          </div>

        </div>

        <div className="staff-hero-actions">

          <button
            className="outline-light"
            onClick={() =>
              setConfirmDelete(
                true
              )
            }
          >
            <Trash2 size={14} />
            Delete
          </button>

          <button
            className="primary-light"
            onClick={() =>
              nav(
                `/admin/edit-staff/${staffId}`
              )
            }
          >
            <Pencil size={14} />
            Edit Profile
          </button>

        </div>

      </div>

      {/* TABS */}

      <div
        className="staff-tabs"
        role="tablist"
      >

        {TABS.map((tab) => {

          const Icon = tab.icon;

          const active =
            activeTab ===
            tab.key;

          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={active}
              className={`staff-tab ${
                active
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab(
                  tab.key
                )
              }
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}

      </div>

      {/* TAB CONTENT */}

      <div className="staff-tab-panel">

        {activeTab ===
          "personal" && (
          <PersonalInfoTab
            staff={staff}
          />
        )}

        {activeTab ===
          "uploaded" && (
          <UploadedDocumentsTab
            documents={documents}
            loading={
              documentsLoading
            }
            error={
              documentsError
            }
            onRefresh={
              fetchDocuments
            }
          />
        )}

        {activeTab ===
          "expiry" && (
          <ExpiryDocumentsTab
            documents={documents}
            loading={
              documentsLoading
            }
            error={
              documentsError
            }
            onRefresh={
              fetchDocuments
            }
          />
        )}

        {activeTab ===
          "upload" && (
          <UploadDocumentsTab
            staff={staff}
            documents={documents}
            onUploaded={
              fetchDocuments
            }
          />
        )}

      </div>

      {/* DELETE MODAL */}

      {confirmDelete && (
        <Modal
          title="Delete Staff"
          onClose={() =>
            setConfirmDelete(
              false
            )
          }
        >
          <ConfirmDelete
            name={
              staff.name ||
              staff.fullName
            }
            onCancel={() =>
              setConfirmDelete(
                false
              )
            }
            onConfirm={
              removeStaff
            }
          />
        </Modal>
      )}

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Personal Info
|--------------------------------------------------------------------------
*/

function PersonalInfoTab({
  staff,
}) {
  return (
    <div className="info-panel">

      <div className="subsection-bar">
        Basic Information
      </div>

      <div className="info-grid">

        <Info
          label="Name"
          value={
            staff.name ||
            staff.fullName
          }
        />

        <Info
          icon={
            <Mail size={13} />
          }
          label="Email"
          value={staff.email}
        />

        <Info
          label="Gender"
          value={staff.gender}
        />

        <Info
          label="Date of Birth"
          value={
            staff.dateOfBirth
          }
        />

        <Info
          label="Position Applied For"
          value={
            staff.positionAppliedFor
          }
        />

        <Info
          label="Role"
          value={staff.role}
        />

        <Info
          label="Employment Type"
          value={
            staff.employment
          }
        />

        <Info
          label="Status"
          value={staff.status}
        />

        <Info
          label="Work Permit Expiry"
          value={
            staff.workPermitExpiry
          }
        />

        <Info
          label="Marital Status"
          value={
            staff.maritalStatus
          }
        />

        <Info
          label="Religion"
          value={
            staff.religion
          }
        />

        <Info
          label="Ethnicity"
          value={
            staff.ethnicity
          }
        />

        <Info
          label="Address"
          value={
            staff.address
          }
          wide
        />

        <Info
          label="Postcode"
          value={
            staff.postCode
          }
        />

        <Info
          label="Region"
          value={
            staff.region
          }
        />

      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Uploaded Documents
|--------------------------------------------------------------------------
*/

function UploadedDocumentsTab({
  documents,
  loading,
  error,
  onRefresh,
}) {
  if (loading) {
    return (
      <div className="info-panel">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="info-panel">

        <ErrorState
          error={error}
          onRefresh={onRefresh}
        />

      </div>
    );
  }

  return (
    <div className="info-panel">

      <div
        className="subsection-bar"
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >

        <span>
          Uploaded Documents
        </span>

        <button
          className="outline small"
          onClick={onRefresh}
        >
          <RefreshCw size={13} />
          Refresh
        </button>

      </div>

      {documents.length ===
      0 ? (

        <EmptyDocuments />

      ) : (

        <div className="doc-status-list">

          {documents.map(
            (document) => {

              const expiry =
                getExpiryStatus(
                  document.expiryDate
                );

              return (
                <div
                  className="doc-status-row"
                  key={
                    document._id
                  }
                >

                  <FileText
                    size={15}
                  />

                  <span className="doc-status-name">

                    {document.documentType}

                    <small
                      style={{
                        display:
                          "block",
                        opacity:
                          0.65,
                      }}
                    >
                      {
                        document.fileName
                      }
                    </small>

                  </span>

                  <span className="doc-status-expiry">

                    Expiry:{" "}

                    {document.expiryDate
                      ? formatDate(
                          document.expiryDate
                        )
                      : "No expiry"}

                  </span>

                  <span
                    className={`expiry-badge ${
                      expiry.status ===
                      "Expired"
                        ? "expired"
                        : expiry.status ===
                          "Expiring Soon"
                        ? "warning"
                        : ""
                    }`}
                  >
                    {expiry.status}
                  </span>

                  {document.fileUrl ? (
                    <a
                      href={
                        document.fileUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="table-link"
                    >
                      <Eye
                        size={13}
                      />
                      View
                    </a>
                  ) : (
                    <span>
                      File unavailable
                    </span>
                  )}

                </div>
              );
            }
          )}

        </div>

      )}

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Expiry Documents
|--------------------------------------------------------------------------
*/

function ExpiryDocumentsTab({
  documents,
  loading,
  error,
  onRefresh,
}) {
  if (loading) {
    return (
      <div className="info-panel">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="info-panel">
        <ErrorState
          error={error}
          onRefresh={onRefresh}
        />
      </div>
    );
  }

  /*
   * Only show documents that are:
   *
   * 1. Already expired
   * 2. Expiring within 30 days
   */

  const expiryDocuments =
    documents
      .map((document) => ({
        ...document,
        expiry: getExpiryStatus(
          document.expiryDate
        ),
      }))
      .filter(
        (document) =>
          document.expiry.status ===
            "Expired" ||
          document.expiry.status ===
            "Expiring Soon"
      )
      .sort(
        (a, b) =>
          new Date(
            a.expiryDate
          ) -
          new Date(
            b.expiryDate
          )
      );

  /*
   * Count expired documents.
   */

  const expiredCount =
    expiryDocuments.filter(
      (document) =>
        document.expiry.status ===
        "Expired"
    ).length;

  const expiringSoonCount =
    expiryDocuments.filter(
      (document) =>
        document.expiry.status ===
        "Expiring Soon"
    ).length;

  if (expiryDocuments.length ===
    0) {
    return (
      <div className="info-panel">

        <div
          className="subsection-bar"
          style={{
            display: "flex",
            justifyContent:
              "space-between",
          }}
        >
          <span>
            Expiry Documents
          </span>

          <button
            className="outline small"
            onClick={onRefresh}
          >
            <RefreshCw
              size={13}
            />
            Refresh
          </button>
        </div>

        <div className="expiry-empty">

          <CheckCircle2
            size={30}
          />

          <h3>
            No Expiry Alerts
          </h3>

          <p>
            This staff member has no
            documents that are expired
            or expiring within the next{" "}
            {EXPIRY_WINDOW_DAYS} days.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="info-panel">

      <div className="subsection-bar">

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap: "15px",
          }}
        >

          <span>
            Documents Requiring Attention
          </span>

          <button
            className="outline small"
            onClick={onRefresh}
          >
            <RefreshCw
              size={13}
            />
            Refresh
          </button>

        </div>

      </div>

      {/* SUMMARY */}

      <div
        style={{
          display: "flex",
          gap: "12px",
          margin:
            "16px 0",
          flexWrap:
            "wrap",
        }}
      >

        <div className="expiry-summary-card">

          <div className="expiry-summary-icon danger">
            <AlertTriangle
              size={17}
            />
          </div>

          <div>
            <small>
              Expired
            </small>

            <strong>
              {expiredCount}
            </strong>
          </div>

        </div>

        <div className="expiry-summary-card">

          <div className="expiry-summary-icon warning">
            <CalendarClock
              size={17}
            />
          </div>

          <div>
            <small>
              Expiring Soon
            </small>

            <strong>
              {expiringSoonCount}
            </strong>
          </div>

        </div>

      </div>

      <div className="doc-status-list">

        {expiryDocuments.map(
          (document) => {

            const isExpired =
              document.expiry.status ===
              "Expired";

            return (
              <div
                className="doc-status-row"
                key={
                  document._id
                }
              >

                <FileText
                  size={15}
                />

                <span className="doc-status-name">

                  {document.documentType}

                  <small
                    style={{
                      display:
                        "block",
                      opacity:
                        0.65,
                    }}
                  >
                    {
                      document.fileName
                    }
                  </small>

                </span>

                <span
                  className={
                    isExpired
                      ? "expiry-badge expired"
                      : "expiry-badge"
                  }
                >
                  {isExpired
                    ? "Expired"
                    : `${document.expiry.days} days left`}
                </span>

                <span className="doc-status-expiry">

                  Expiry:{" "}

                  {formatDate(
                    document.expiryDate
                  )}

                  <small
                    style={{
                      display:
                        "block",
                      marginTop:
                        "3px",
                    }}
                  >
                    {getRemainingText(
                      document.expiry
                    )}
                  </small>

                </span>

                {document.fileUrl && (
                  <a
                    href={
                      document.fileUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="table-link"
                  >
                    <Eye
                      size={13}
                    />
                    View
                  </a>
                )}

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Admin Upload Documents
|--------------------------------------------------------------------------
*/

function UploadDocumentsTab({
  staff,
  documents,
  onUploaded,
}) {
  const [docType, setDocType] =
    useState(
      DOC_TYPES[0]
    );

  const [expiry, setExpiry] =
    useState("");

  const [file, setFile] =
    useState(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [saved, setSaved] =
    useState(false);

  const handleUpload =
    async (e) => {
      e.preventDefault();

      if (!file) {
        setError(
          "Please select a document."
        );
        return;
      }

      try {
        setUploading(true);
        setError("");
        setSaved(false);

        const token =
          getToken();

        if (!token) {
          throw new Error(
            "Authentication token not found."
          );
        }

        /*
         * Your S3 middleware currently
         * accepts PDF files.
         */

        if (
          file.type !==
            "application/pdf" &&
          !file.name
            .toLowerCase()
            .endsWith(".pdf")
        ) {
          throw new Error(
            "Only PDF documents are allowed."
          );
        }

        const formData =
          new FormData();

        formData.append(
          "documentType",
          docType
        );

        if (expiry) {
          formData.append(
            "expiryDate",
            expiry
          );
        }

        formData.append(
          "file",
          file
        );

        /*
         * Admin endpoint:
         *
         * POST /api/staff/:id/documents
         */

        const response =
          await fetch(
            `${API_BASE_URL}/staff/${staff._id || staff.id}/documents`,
            {
              method: "POST",
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
              body: formData,
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              result.error ||
              "Failed to upload document."
          );
        }

        setFile(null);
        setExpiry("");

        setSaved(true);

        /*
         * Reload the actual
         * documents from MongoDB.
         */

        await onUploaded();

        setTimeout(() => {
          setSaved(false);
        }, 3000);
      } catch (error) {
        console.error(
          "ADMIN DOCUMENT UPLOAD ERROR:",
          error
        );

        setError(
          error.message ||
            "Failed to upload document."
        );
      } finally {
        setUploading(false);
      }
    };

  return (
    <div className="info-panel">

      <h3 className="upload-heading">
        Upload Staff Documents
      </h3>

      <p className="upload-subtext">
        PDF files only
      </p>

      {error && (
        <div
          className="expiry-alert"
          style={{
            marginBottom: "15px",
          }}
        >
          <AlertTriangle
            size={16}
          />

          <span>
            {error}
          </span>

          <button
            className="modal-close"
            onClick={() =>
              setError("")
            }
          >
            <X size={14} />
          </button>
        </div>
      )}

      {saved && (
        <div
          className="upload-confirm"
        >
          <CheckCircle2
            size={15}
          />

          Document uploaded
          successfully.
        </div>
      )}

      <form
        onSubmit={handleUpload}
      >

        <div className="form-grid">

          <label className="field">

            <span>
              Document Type
            </span>

            <select
              value={docType}
              onChange={(e) =>
                setDocType(
                  e.target.value
                )
              }
              disabled={uploading}
            >
              {DOC_TYPES.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                )
              )}
            </select>

          </label>

          <label className="field">

            <span>
              Expiry Date
            </span>

            <input
              type="date"
              value={expiry}
              onChange={(e) =>
                setExpiry(
                  e.target.value
                )
              }
              disabled={uploading}
            />

          </label>

        </div>

        <label className="upload-drop">

          <UploadCloud
            size={18}
          />

          <span>

            <b>
              {file
                ? file.name
                : "Browse..."}
            </b>

            {!file &&
              " or drag a PDF file in"}

          </span>

          <input
            type="file"
            accept=".pdf,application/pdf"
            disabled={uploading}
            onChange={(e) =>
              setFile(
                e.target.files?.[0] ||
                  null
              )
            }
          />

        </label>

        <div
          style={{
            marginTop: "15px",
            display: "flex",
            justifyContent:
              "flex-end",
          }}
        >

          <button
            type="submit"
            className="primary"
            disabled={
              uploading ||
              !file
            }
          >

            <UploadCloud
              size={15}
            />

            {uploading
              ? "Uploading..."
              : "Upload Document"}

          </button>

        </div>

      </form>

      {/* CURRENT DOCUMENTS */}

      <div
        className="doc-status-list"
        style={{
          marginTop: 20,
        }}
      >

        {documents.map(
          (document) => {

            return (
              <div
                className="doc-status-row"
                key={
                  document._id
                }
              >

                <FileText
                  size={14}
                />

                <span className="doc-status-name">

                  {document.documentType}

                  {" — "}

                  {
                    document.fileName
                  }

                </span>

                <span className="doc-status-expiry">

                  Expiry:{" "}

                  {document.expiryDate
                    ? formatDate(
                        document.expiryDate
                      )
                    : "No expiry"}

                </span>

                {document.fileUrl && (
                  <a
                    href={
                      document.fileUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                )}

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Small Components
|--------------------------------------------------------------------------
*/

function LoadingState() {
  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
      }}
    >
      <RefreshCw
        size={22}
        className="spin"
      />

      <p>
        Loading documents...
      </p>
    </div>
  );
}

function ErrorState({
  error,
  onRefresh,
}) {
  return (
    <div
      style={{
        padding: "30px",
        textAlign: "center",
      }}
    >
      <AlertTriangle
        size={25}
      />

      <h3>
        Unable to load documents
      </h3>

      <p>
        {error}
      </p>

      <button
        className="outline"
        onClick={onRefresh}
      >
        <RefreshCw
          size={14}
        />
        Try Again
      </button>
    </div>
  );
}

function EmptyDocuments() {
  return (
    <div className="expiry-empty">

      <FolderOpen
        size={30}
      />

      <h3>
        No Documents Uploaded
      </h3>

      <p>
        This staff member has not
        uploaded any documents yet.
      </p>

    </div>
  );
}

function Info({
  icon,
  label,
  value,
  wide,
}) {
  return (
    <div
      className={`info-item ${
        wide ? "wide" : ""
      }`}
    >
      <small>
        {icon} {label}
      </small>

      <b>
        {value?.trim
          ? value.trim() ||
            "—"
          : value || "—"}
      </b>
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (
          e.target ===
          e.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="modal">

        <div className="modal-head">

          <div>

            <span className="eyebrow">
              STAFF MANAGEMENT
            </span>

            <h2>
              {title}
            </h2>

          </div>

          <button
            className="icon-btn"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <div className="modal-body">
          {children}
        </div>

      </div>

    </div>
  );
}

function ConfirmDelete({
  name,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="confirm-delete">

      <div className="delete-icon">
        <Trash2 />
      </div>

      <h3>
        Delete this staff member?
      </h3>

      <p>
        You are about to permanently
        delete <b>{name}</b>. This
        action cannot be undone.
      </p>

      <div className="confirm-actions">

        <button
          className="outline"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          className="danger-solid"
          onClick={onConfirm}
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default StaffProfile;

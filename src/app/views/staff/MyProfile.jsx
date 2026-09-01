import {
  User,
  FileText,
  ShieldCheck,
  Users,
  CalendarDays,
  UploadCloud,
  AlertCircle,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

import { useEffect, useState } from "react";

import "./MyProfile.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function MyProfile() {
  const [activeTab, setActiveTab] =
    useState("personal");

  const [staff, setStaff] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
        "lanbeth-auth-token"
      );

      if (!token) {
        setError(
          "You are not authenticated."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/api/staff/me/profile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Failed to load profile."
        );
      }

      setStaff(result.staff);

    } catch (err) {
      console.error(
        "Profile error:",
        err
      );

      setError(
        err.message ||
          "Unable to load profile."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProfile();
  }, []);


  const tabs = [
    {
      id: "personal",
      label: "Personal Info",
      icon: <User size={16} />,
    },

    {
      id: "documents",
      label: "Uploaded Documents",
      icon: <FileText size={16} />,
    },

    {
      id: "expiry",
      label: "Expiry Documents",
      icon: <ShieldCheck size={16} />,
    },

    {
      id: "clients",
      label: "Assigned Clients",
      icon: <Users size={16} />,
    },
  ];


  if (loading) {
    return (
      <div className="staff-profile-page">

        <div className="profile-loading">

          <RefreshCw
            size={25}
            className="loading-icon"
          />

          <h2>
            Loading your profile...
          </h2>

          <p>
            Please wait while we retrieve
            your information.
          </p>

        </div>

      </div>
    );
  }


  if (error) {
    return (
      <div className="staff-profile-page">

        <div className="dashboard-error">

          <AlertCircle size={20} />

          <div>

            <strong>
              Unable to load profile
            </strong>

            <p>
              {error}
            </p>

          </div>

          <button
            className="primary small"
            onClick={fetchProfile}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }


  if (!staff) {
    return (
      <div className="staff-profile-page">

        <div className="profile-loading">

          <Users size={25} />

          <h2>
            Profile not found
          </h2>

        </div>

      </div>
    );
  }


  return (
    <div className="staff-profile-page">

      {/* ================= PROFILE HEADER ================= */}

      <div className="profile-header">

        <div className="profile-avatar">

          <div className="profile-avatar-placeholder">
            {getInitials(
              staff.fullName
            )}
          </div>

        </div>


        <div className="profile-info">

          <h1>
            {staff.fullName ||
              "Staff Member"}
          </h1>

          <p>
            Staff ID:{" "}
            {staff.staffId ||
              staff.employeeId ||
              "N/A"}
          </p>


          <div className="profile-meta">

            {staff.dateOfBirth && (
              <span>
                {calculateAge(
                  staff.dateOfBirth
                )}{" "}
                years old
              </span>
            )}


            {staff.gender && (
              <span>
                {staff.gender}
              </span>
            )}


            {staff.phone && (
              <span>
                {staff.phone}
              </span>
            )}


            {staff.email && (
              <span>
                {staff.email}
              </span>
            )}

          </div>

        </div>


        <button
          className="outline small profile-refresh"
          onClick={fetchProfile}
        >
          <RefreshCw size={14} />

          Refresh

        </button>

      </div>


      {/* ================= TABS ================= */}

      <div className="profile-tabs">

        {tabs.map((tab) => (

          <button
            key={tab.id}
            className={
              activeTab === tab.id
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(tab.id)
            }
          >

            {tab.icon}

            {tab.label}

          </button>

        ))}

      </div>


      {/* ================= CONTENT ================= */}

      <div className="profile-content">

        {activeTab === "personal" && (
          <PersonalInfo
            staff={staff}
          />
        )}


        {activeTab === "documents" && (
          <UploadedDocuments
            documents={
              staff.documents || []
            }
          />
        )}


        {activeTab === "expiry" && (
          <ExpiryDocuments
            documents={
              staff.expiryDocuments || []
            }
          />
        )}


        {activeTab === "clients" && (
          <AssignedClients
            clients={
              staff.assignedClients ||
              []
            }
          />
        )}

      </div>


      <div className="watermark">
        LAMBETH RESOLUTION HOMECARE
      </div>

    </div>
  );
}


/* =====================================================
   PERSONAL INFORMATION
===================================================== */

function PersonalInfo({ staff }) {

  return (
    <>
      <section className="profile-card">

        <CardTitle
          icon={<User size={18} />}
          title="Personal Information"
        />

        <div className="info-grid">

          <Info
            label="Full Name"
            value={
              staff.fullName
            }
          />

          <Info
            label="Email"
            value={
              staff.email
            }
          />

          <Info
            label="Phone"
            value={
              staff.phone
            }
          />

          <Info
            label="Gender"
            value={
              staff.gender
            }
          />

          <Info
            label="Date Of Birth"
            value={
              formatDate(
                staff.dateOfBirth
              )
            }
          />

          <Info
            label="Role"
            value={
              staff.role
            }
          />

          <Info
            label="Status"
            value={
              staff.status
            }
          />

          <Info
            label="Address"
            value={
              staff.address
            }
          />

          <Info
            label="Region"
            value={
              staff.region
            }
          />

        </div>

      </section>


      <section className="profile-card">

        <CardTitle
          icon={<FileText size={18} />}
          title="Employment Information"
        />

        <div className="info-grid">

          <Info
            label="Staff ID"
            value={
              staff.staffId ||
              staff.employeeId
            }
          />

          <Info
            label="Position"
            value={
              staff.position
            }
          />

          <Info
            label="Joined Date"
            value={
              formatDate(
                staff.joinedDate
              )
            }
          />

          <Info
            label="Department"
            value={
              staff.department
            }
          />

          <Info
            label="Work Status"
            value={
              staff.workStatus
            }
          />

          <Info
            label="Supervisor"
            value={
              staff.supervisor
            }
          />

        </div>

      </section>
    </>
  );
}


/* =====================================================
   DOCUMENTS
===================================================== */

function UploadedDocuments({
  documents,
}) {

  return (
    <section className="profile-card">

      <CardTitle
        icon={<UploadCloud size={18} />}
        title="Uploaded Documents"
      />


      {documents.length === 0 ? (

        <EmptyState
          icon={<FileText size={25} />}
          title="No documents"
          text="You currently have no uploaded documents."
        />

      ) : (

        <div className="document-list">

          {documents.map(
            (doc, index) => (

              <div
                className="document-item"
                key={
                  doc._id ||
                  index
                }
              >

                <FileText size={18} />

                <div>

                  <b>
                    {doc.fileName ||
                      doc.name ||
                      "Document"}
                  </b>

                  <p>
                    {doc.uploadedAt
                      ? `Uploaded ${formatDate(
                          doc.uploadedAt
                        )}`
                      : "Uploaded successfully"}
                  </p>

                </div>


                {doc.fileUrl && (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="outline small"
                  >
                    View
                  </a>
                )}

              </div>

            )
          )}

        </div>

      )}

    </section>
  );
}


/* =====================================================
   EXPIRY DOCUMENTS
===================================================== */

function ExpiryDocuments({
  documents,
}) {

  return (
    <section className="profile-card">

      <CardTitle
        icon={<ShieldCheck size={18} />}
        title="Expiry Documents"
      />


      {documents.length === 0 ? (

        <EmptyState
          icon={
            <ShieldCheck size={25} />
          }
          title="No expiry documents"
          text="You currently have no documents with expiry dates."
        />

      ) : (

        <div className="document-list">

          {documents.map(
            (doc, index) => (

              <DocumentStatus
                key={
                  doc._id ||
                  index
                }
                name={
                  doc.fileName ||
                  doc.name ||
                  "Document"
                }
                date={
                  formatDate(
                    doc.expiryDate
                  )
                }
                status={
                  doc.status ||
                  "Valid"
                }
              />

            )
          )}

        </div>

      )}

    </section>
  );
}


/* =====================================================
   ASSIGNED CLIENTS
===================================================== */

function AssignedClients({
  clients,
}) {

  return (
    <section className="profile-card">

      <CardTitle
        icon={<Users size={18} />}
        title="Assigned Clients"
      />


      {clients.length === 0 ? (

        <EmptyState
          icon={<Users size={25} />}
          title="No assigned clients"
          text="You currently don't have any clients assigned to you."
        />

      ) : (

        <div className="client-list">

          {clients.map(
            (client) => (

              <div
                className="client-item"
                key={client._id}
              >

                <div>

                  <b>
                    {client.fullName}
                  </b>

                  <p>
                    {client.clientId}
                  </p>

                </div>


                <span
                  className={
                    client.status ===
                    "Active"
                      ? "active"
                      : ""
                  }
                >
                  {client.status ||
                    "Active"}
                </span>

              </div>

            )
          )}

        </div>

      )}

    </section>
  );
}


/* =====================================================
   DOCUMENT STATUS
===================================================== */

function DocumentStatus({
  name,
  date,
  status,
}) {

  return (
    <div className="document-item">

      <CalendarDays size={18} />

      <div>

        <b>
          {name}
        </b>

        <p>
          Expiry Date:{" "}
          {date || "Not specified"}
        </p>

      </div>


      <strong
        className={getDocumentStatusClass(
          status
        )}
      >
        {status}
      </strong>

    </div>
  );
}


/* =====================================================
   CARD TITLE
===================================================== */

function CardTitle({
  icon,
  title,
}) {

  return (
    <div className="card-title">

      {icon}

      <h2>
        {title}
      </h2>

    </div>
  );
}


/* =====================================================
   INFO
===================================================== */

function Info({
  label,
  value,
}) {

  return (
    <div className="info-item">

      <small>
        {label}
      </small>

      <p>
        {value || "Not provided"}
      </p>

    </div>
  );
}


/* =====================================================
   EMPTY STATE
===================================================== */

function EmptyState({
  icon,
  title,
  text,
}) {

  return (
    <div className="activity-empty">

      {icon}

      <strong>
        {title}
      </strong>

      <p>
        {text}
      </p>

    </div>
  );
}


/* =====================================================
   HELPERS
===================================================== */

function getInitials(
  name = ""
) {

  return name
    .split(" ")
    .filter(Boolean)
    .map(
      (word) => word[0]
    )
    .join("")
    .slice(0, 2)
    .toUpperCase();
}


function calculateAge(
  dateOfBirth
) {

  if (!dateOfBirth) {
    return "";
  }

  const today = new Date();

  const birth = new Date(
    dateOfBirth
  );

  let age =
    today.getFullYear() -
    birth.getFullYear();

  const month =
    today.getMonth() -
    birth.getMonth();

  if (
    month < 0 ||
    (month === 0 &&
      today.getDate() <
        birth.getDate())
  ) {
    age--;
  }

  return age;
}


function formatDate(
  value
) {

  if (!value) {
    return "";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}


function getDocumentStatusClass(
  status
) {

  if (
    status ===
    "Expired"
  ) {
    return "danger-text";
  }

  if (
    status ===
    "Expiring Soon"
  ) {
    return "warning-text";
  }

  return "";
}
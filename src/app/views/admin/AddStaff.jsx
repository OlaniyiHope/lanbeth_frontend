import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  ShieldCheck,
  UploadCloud,
  FileText,
  Trash2,
  Plus,
} from "lucide-react";
import { useData } from "../../../context/DataContext.jsx";
import "./AddStaff.css";

export const DOC_TYPES = [
  "Immigration Status",
  "Driver License",
  "Supervision Note",
  "Training Certificate",
  "DBS",
  "National Insurance",
];

const emptyStaff = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  dateOfBirth: "",
  positionAppliedFor: "",
  role: "",
  employment: "",
  maritalStatus: "",
  religion: "",
  ethnicity: "",
  address: "",
  postCode: "",
  region: "",
  status: "Active",
  workPermitExpiry: "",
    // Login credentials
  password: "",
  confirmPassword: "",
};

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function generateStaffId(count) {
  return `ST-${String(count + 1).padStart(3, "0")}`;
}

function AddStaff() {
  const nav = useNavigate();
  const { data, setData } = useData();
  const [values, setValues] = useState(emptyStaff);
  const [documents, setDocuments] = useState([]);
  const [docType, setDocType] = useState(DOC_TYPES[0]);
  const [docExpiry, setDocExpiry] = useState("");
  const [error, setError] = useState("");

  const update = (field, value) => setValues((v) => ({ ...v, [field]: value }));

  const handleFile = (fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    setDocuments((docs) => [
      ...docs.filter((d) => d.type !== docType),
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: docType,
        name: file.name,
        url: URL.createObjectURL(file),
        expiry: docExpiry,
      },
    ]);
  };

  const removeDocument = (id) => {
    setDocuments((docs) => {
      const target = docs.find((d) => d.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return docs.filter((d) => d.id !== id);
    });
  };

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

const submit = async (e) => {
  e.preventDefault();

  setError("");

  if (
    !values.name.trim() ||
    !values.username.trim() ||
    !values.email.trim() ||
    !values.password.trim()
  ) {
    setError(
      "Full name, username, email, and password are required."
    );
    return;
  }

  if (values.password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  if (values.password !== values.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  try {
    const token = localStorage.getItem("lanbeth-auth-token");

    if (!token) {
      setError("You are not authenticated. Please log in again.");
      return;
    }

    const payload = {
      role: "staff",

      fullName: values.name.trim(),
      username: values.username.trim(),
      email: values.email.trim(),
      password: values.password,

      phone: values.phone,
      address: values.address,
      postcode: values.postCode,
      region: values.region,

      gender: values.gender || undefined,
      dateOfBirth: values.dateOfBirth || undefined,

      maritalStatus: values.maritalStatus,
      religion: values.religion,
      ethnicity: values.ethnicity,

      positionAppliedFor: values.positionAppliedFor,
      workPermitExpiry: values.workPermitExpiry || undefined,

      jobTitle: values.role,

      status:
        values.status === "Active"
          ? "active"
          : "inactive",

      documents: documents.map((doc) => ({
        documentType: doc.type,
        fileName: doc.name,
        fileUrl: doc.url,
        expiryDate: doc.expiry || undefined,
      })),
    };

    const response = await fetch(
      `${API_BASE_URL}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.message ||
        result?.error ||
        "Failed to create staff account."
      );
    }

    console.log("Staff created successfully:", result);

    nav("/admin/staff");

  } catch (err) {
    console.error("Create staff error:", err);

    setError(
      err.message ||
      "Unable to create staff account."
    );
  }
};

  return (
    <div className="add-staff-page">
      <div className="page-head">
        <button className="icon-btn" onClick={() => nav(-1)} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="eyebrow">LANBETHCARE</div>
          <h1>Add Staff</h1>
          <p>Create a new staff profile and onboarding record.</p>
        </div>
      </div>

      <form className="staff-form" onSubmit={submit}>
        <FormSection
          icon={<User size={16} />}
          title="Staff Details"
          desc="Core identity, role, and background information."
        >
          <div className="form-grid">
            <Field label="Full Name" required>
              <input
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Sarah Mitchell"
              />
            </Field>
            <Field label="Email" required>
              <input
                type="email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="sarah.mitchell@healthcare.com"
              />
            </Field>
            <Field label="Phone Number">
              <input
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </Field>
            <Field label="Gender">
              <select value={values.gender} onChange={(e) => update("gender", e.target.value)}>
                <option value="">Select...</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </Field>
            <Field label="Date of Birth">
              <input
                type="date"
                value={values.dateOfBirth}
                onChange={(e) => update("dateOfBirth", e.target.value)}
              />
            </Field>
            <Field label="Position Applied For">
              <input
                value={values.positionAppliedFor}
                onChange={(e) => update("positionAppliedFor", e.target.value)}
                placeholder="e.g. Care Giver Role 12"
              />
            </Field>
            <Field label="Role">
              <input
                value={values.role}
                onChange={(e) => update("role", e.target.value)}
                placeholder="e.g. Senior Nurse"
              />
            </Field>
            <Field label="Employment Type">
              <select
                value={values.employment}
                onChange={(e) => update("employment", e.target.value)}
              >
                <option value="">Select...</option>
                <option>Full Time</option>
                <option>Part Time</option>
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
            <Field label="Address" wide>
              <input
                value={values.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="79 Awolowo Way, Ikeja"
              />
            </Field>
            <Field label="Postcode">
              <input
                value={values.postCode}
                onChange={(e) => update("postCode", e.target.value)}
              />
            </Field>
            <Field label="Region">
              <input
                value={values.region}
                onChange={(e) => update("region", e.target.value)}
              />
            </Field>
          </div>
        </FormSection>
<FormSection
  icon={<ShieldCheck size={16} />}
  title="Login Credentials"
  desc="Create the login details the staff member will use to access the staff portal."
>
  <div className="form-grid">
    <Field label="Username" required>
      <input
        value={values.username}
        onChange={(e) => update("username", e.target.value)}
        placeholder="e.g. sarah.mitchell"
        autoComplete="username"
      />
    </Field>

    <Field label="Password" required>
      <input
        type="password"
        value={values.password}
        onChange={(e) => update("password", e.target.value)}
        placeholder="Minimum 6 characters"
        autoComplete="new-password"
      />
    </Field>

    <Field label="Confirm Password" required>
      <input
        type="password"
        value={values.confirmPassword}
        onChange={(e) => update("confirmPassword", e.target.value)}
        placeholder="Re-enter password"
        autoComplete="new-password"
      />
    </Field>

    <Field label="Login Role">
      <select
        value={values.role}
        onChange={(e) => update("role", e.target.value)}
      >
        <option value="staff">Staff</option>
      </select>
    </Field>
  </div>

  <div className="credential-notice">
    <ShieldCheck size={15} />
    <div>
      <strong>Staff Login</strong>
      <p>
        Give the staff member their username and password after their account
        has been created. They will use these credentials to sign in to the
        staff portal.
      </p>
    </div>
  </div>
</FormSection>
        <FormSection
          icon={<ShieldCheck size={16} />}
          title="Status & Work Permit"
          desc="Employment status and right-to-work details."
        >
          <div className="form-grid">
            <Field label="Status">
              <select value={values.status} onChange={(e) => update("status", e.target.value)}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </Field>
            <Field label="Work Permit Expiry Date">
              <input
                type="date"
                value={values.workPermitExpiry}
                onChange={(e) => update("workPermitExpiry", e.target.value)}
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          icon={<UploadCloud size={16} />}
          title="Upload Staff Documents"
          desc="PDF or JPG. You can upload more from the staff profile once created."
        >
          <div className="form-grid">
            <Field label="Document Type">
              <select value={docType} onChange={(e) => setDocType(e.target.value)}>
                {DOC_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Expiry Date">
              <input
                type="date"
                value={docExpiry}
                onChange={(e) => setDocExpiry(e.target.value)}
              />
            </Field>
          </div>

          <label className="upload-drop">
            <UploadCloud size={18} />
            <span>
              <b>Click to browse</b> or drag a file in (PDF, JPG)
            </span>
            <input type="file" accept=".pdf,.jpg,.jpeg" onChange={(e) => handleFile(e.target.files)} />
          </label>

          {documents.length > 0 && (
            <div className="upload-list">
              {documents.map((doc) => (
                <div className="upload-row" key={doc.id}>
                  <FileText size={15} />
                  <span className="upload-name">
                    {doc.type} — {doc.name}
                  </span>
                  {doc.expiry && <span className="upload-expiry">Expiry: {doc.expiry}</span>}
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

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button type="button" className="outline" onClick={() => nav(-1)}>
            Cancel
          </button>
          <button type="submit" className="primary">
            <Plus size={15} />
            Add Staff
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

function Field({ label, required, wide, children }) {
  return (
    <label className={`field ${wide ? "wide" : ""}`}>
      <span>
        {label}
        {required && <em>*</em>}
      </span>
      {children}
    </label>
  );
}

export default AddStaff;
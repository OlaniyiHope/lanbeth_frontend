import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, ShieldCheck, Camera, Trash2, Plus } from "lucide-react";
import { createAdmin } from "../../../lib/api.js";
import "./AddStaff.css"; // reuses the same form styles

const emptyAdmin = {
  name: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

function getInitials(name = "") {
  return name.split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

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

function AddAdmin() {
  const nav = useNavigate();
  const [values, setValues] = useState(emptyAdmin);
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => {
    setSuccess("");
    setValues((v) => ({ ...v, [field]: value }));
  };

  const handlePhoto = async (file) => {
    if (!file) return;
    try {
      setPhoto(await resizeImage(file));
    } catch {
      setError("Could not read that image. Please try another file.");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !values.name.trim() ||
      !values.username.trim() ||
      !values.email.trim() ||
      !values.password
    ) {
      setError("Full name, username, email and password are required.");
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
      setSubmitting(true);
      await createAdmin({
        fullName: values.name.trim(),
        username: values.username.trim(),
        email: values.email.trim(),
        phone: values.phone,
        password: values.password,
        profilePhoto: photo || undefined,
      });

      setSuccess(`Admin account created for ${values.name.trim()}.`);
      setValues(emptyAdmin);
      setPhoto("");
    } catch (err) {
      setError(err.message || "Failed to create admin.");
    } finally {
      setSubmitting(false);
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
          <h1>Add Admin</h1>
          <p>Create a new administrator account with full portal access.</p>
        </div>
      </div>

      <form className="staff-form" onSubmit={submit}>
        <FormSection
          icon={<User size={16} />}
          title="Admin Details"
          desc="Identity and contact details for the new administrator."
        >
          <div className="photo-upload">
            <div className="photo-circle">
              {photo ? (
                <img src={photo} alt="Admin preview" />
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
                placeholder="e.g. Jane Okafor"
              />
            </Field>
            <Field label="Email" required>
              <input
                type="email"
                value={values.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="jane@lanbethcare.com"
              />
            </Field>
            <Field label="Phone Number">
              <input
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+44 7911 123456"
              />
            </Field>
          </div>
        </FormSection>

        <FormSection
          icon={<ShieldCheck size={16} />}
          title="Login Credentials"
          desc="The admin will use these to sign in. They have full access to the admin portal."
        >
          <div className="form-grid">
            <Field label="Username" required>
              <input
                value={values.username}
                onChange={(e) => update("username", e.target.value)}
                placeholder="e.g. jane.okafor"
                autoComplete="off"
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
          </div>

          <div className="credential-notice">
            <ShieldCheck size={15} />
            <div>
              <strong>Full admin access</strong>
              <p>
                This account can manage staff, clients, documents and other admins.
                Only create it for someone you trust, and share the credentials securely.
              </p>
            </div>
          </div>
        </FormSection>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="profile-success">{success}</div>}

        <div className="form-actions">
          <button type="button" className="outline" onClick={() => nav(-1)}>
            Cancel
          </button>
          <button type="submit" className="primary" disabled={submitting}>
            <Plus size={15} />
            {submitting ? "Creating…" : "Add Admin"}
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

export default AddAdmin;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { useData } from "../../../context/DataContext.jsx";
import { getStaffById, updateStaffMember } from "../../../lib/api.js";
import "./StaffProfile.css";

const FIELDS = [
  { key: "fullName", label: "Full Name" },
  { key: "username", label: "Username" },
  { key: "email", label: "Email", type: "email" },
  { key: "phone", label: "Phone" },
  { key: "role", label: "Role" },
  { key: "jobTitle", label: "Job Title" },
  { key: "positionAppliedFor", label: "Position Applied For" },
  { key: "gender", label: "Gender" },
  { key: "dateOfBirth", label: "Date of Birth", type: "date" },
  { key: "maritalStatus", label: "Marital Status" },
  { key: "religion", label: "Religion" },
  { key: "ethnicity", label: "Ethnicity" },
  { key: "address", label: "Address", wide: true },
  { key: "postcode", label: "Postcode" },
  { key: "region", label: "Region" },
  { key: "workPermitExpiry", label: "Work Permit Expiry", type: "date" },
  { key: "nextOfKinName", label: "Next of Kin Name" },
  { key: "nextOfKinPhone", label: "Next of Kin Phone" },
  { key: "status", label: "Status" },
];

// Different endpoints in this codebase return the record under different
// keys ({ user }, { staff }, or the bare object). Try the likely keys in
// order instead of assuming one shape.
function extractRecord(response) {
  if (!response) return null;
  if (response.user) return response.user;
  if (response.staff) return response.staff;
  if (response.data) return response.data;
  // If the response itself looks like a record (has an _id/id and no
  // wrapper), use it directly.
  if (response._id || response.id) return response;
  return null;
}

function EditStaff() {
  const nav = useNavigate();
  const { id } = useParams();
  const { data, setData } = useData();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await getStaffById(id);
        // TEMP: check your browser console — this shows exactly what the
        // API returned so we can confirm the real key name.
        console.log("getStaffById response:", response);

        const record = extractRecord(response);

        if (!cancelled) {
          if (!record) {
            setError(
              "Staff data came back in an unexpected shape. Check the console log for the raw response."
            );
            setForm({});
          } else {
            setForm(record);
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Failed to load staff member.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (id) load();
    else {
      setError("No staff id in the URL.");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await updateStaffMember(id, form);
      const updated = extractRecord(response) || form;

      // Keep local cache in sync so the profile page reflects the change
      // immediately without waiting for a full refetch.
      setData({
        ...data,
        staff: data.staff.map((s) =>
          (s._id || s.id) === id ? { ...s, ...updated } : s
        ),
      });

      nav(`/admin/staff-profile/${id}`);
    } catch (err) {
      setError(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="staff-profile-page">
        <p>Loading staff member…</p>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="staff-profile-page">
        <p>{error}</p>
        <button className="outline" onClick={() => nav("/admin/staff")}>
          Back to Staff
        </button>
      </div>
    );
  }

  return (
    <div className="staff-profile-page">
      <div className="page-head">
        <button
          className="icon-btn"
          onClick={() => nav(`/admin/staff-profile/${id}`)}
          aria-label="Back to staff profile"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="eyebrow">LANBETHCARE</div>
          <h1>Edit Staff</h1>
          <p>Update this staff member's information.</p>
        </div>
      </div>

      <form className="info-panel" onSubmit={handleSubmit}>
        <div className="subsection-bar">Staff Details</div>

        <div className="form-grid">
          {FIELDS.map(({ key, label, type, wide }) => (
            <label className={`field ${wide ? "wide" : ""}`} key={key}>
              <span>{label}</span>
              <input
                type={type || "text"}
                value={form?.[key] ?? ""}
                onChange={handleChange(key)}
              />
            </label>
          ))}
        </div>

        {error && <div className="upload-confirm" style={{ color: "#b91c1c" }}>{error}</div>}

        <div className="confirm-actions" style={{ marginTop: 20 }}>
          <button
            type="button"
            className="outline"
            onClick={() => nav(`/admin/staff-profile/${id}`)}
          >
            Cancel
          </button>
          <button type="submit" className="primary-light" disabled={saving}>
            <Save size={14} />
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditStaff;

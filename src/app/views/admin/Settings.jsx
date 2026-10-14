import { useEffect, useState } from "react";
import { Mail, Phone, RefreshCw, Save, ShieldCheck, UserRound } from "lucide-react";
import "./Settings.css";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:5001").replace(/\/$/, "") + "/api";

const TOKEN_KEY = "lanbeth-auth-token";

const emptyProfile = { name: "", email: "", phone: "", role: "" };

export default function Settings({ title = "Profile" }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const request = async (path, options = {}) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error("Authentication token not found.");

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result?.message || result?.error || "Request failed.");
    }
    return result;
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // Adjust this endpoint to match your backend (e.g. /auth/me or /users/me)
      const result = await request("/auth/me");
      const user = result?.user || result || {};

      setProfile({
        name: user.name || user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
      });
    } catch (err) {
      setError(err.message || "Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (field) => (e) => {
    setMessage("");
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setMessage("");

      await request("/auth/me", {
        method: "PUT",
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
        }),
      });

      setMessage("Profile updated.");
    } catch (err) {
      setError(err.message || "Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  };

  const initials =
    profile.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "?";

  return (
    <div className="dashboard-page profile-page">
      <div className="page-head">
        <div>
          <div className="eyebrow">LANBETHCARE</div>
          <h1>{title}</h1>
          <p>View and update your account details.</p>
        </div>

        <div className="head-actions">
          <button
            className="icon-btn"
            title="Reload profile"
            onClick={loadProfile}
            disabled={loading}
          >
            <RefreshCw size={17} className={loading ? "spin" : ""} />
          </button>
        </div>
      </div>

      {error && (
        <div className="dashboard-error">
          <div>
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>
          <button className="outline small" onClick={loadProfile}>
            <RefreshCw size={13} />
            Retry
          </button>
        </div>
      )}

      <div className="dashboard-grid">
        <section className="section-card profile-summary">
          <div className="profile-avatar">{loading ? "…" : initials}</div>
          <h2>{loading ? "Loading..." : profile.name || "Unnamed user"}</h2>

          <ul className="profile-meta">
            <li>
              <ShieldCheck size={15} />
              {profile.role || "No role assigned"}
            </li>
            <li>
              <Mail size={15} />
              {profile.email || "No email on file"}
            </li>
            <li>
              <Phone size={15} />
              {profile.phone || "No phone number"}
            </li>
          </ul>
        </section>

        <section className="section-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">ACCOUNT</span>
              <h2>Personal details</h2>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleSave}>
            <label>
              <span>
                <UserRound size={14} /> Full name
              </span>
              <input
                type="text"
                value={profile.name}
                onChange={handleChange("name")}
                disabled={loading || saving}
                required
              />
            </label>

            <label>
              <span>
                <Mail size={14} /> Email
              </span>
              <input type="email" value={profile.email} disabled readOnly />
              <small>Email can only be changed by an administrator.</small>
            </label>

            <label>
              <span>
                <Phone size={14} /> Phone
              </span>
              <input
                type="tel"
                value={profile.phone}
                onChange={handleChange("phone")}
                disabled={loading || saving}
              />
            </label>

            {message && <p className="profile-success">{message}</p>}

            <div className="profile-actions">
              <button type="submit" className="outline" disabled={loading || saving}>
                <Save size={14} />
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </section>
      </div>

      <div className="watermark">LANBETH RESOLUTIONS</div>
    </div>
  );
}
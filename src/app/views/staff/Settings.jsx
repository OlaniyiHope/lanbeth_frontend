import { useState } from "react";
import {
  User,
  Lock,
  Bell,
  ShieldCheck,
  Save,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";

import "./Settings.css";

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");

  const [profile, setProfile] = useState({
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 123-4567",
  });

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    reportReminder: true,
    expiryAlert: true,
    policyUpdates: true,
    clientUpdates: true,
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saved, setSaved] = useState(false);

  const updateProfile = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updatePassword = (field, value) => {
    setPassword((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNotification = (field) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const saveSettings = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <div className="staff-settings-page">

      {/* PAGE HEADER */}
      <div className="page-head">
        <div>
          <div className="eyebrow">LANBETHCARE</div>
          <h1>Settings</h1>
          <p>
            Manage your account, security, and notification preferences.
          </p>
        </div>
      </div>

      {/* SETTINGS LAYOUT */}
      <div className="settings-layout">

        {/* SIDEBAR */}
        <aside className="settings-sidebar">

          <button
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => setActiveSection("profile")}
          >
            <User size={17} />
            Profile
          </button>

          <button
            className={activeSection === "password" ? "active" : ""}
            onClick={() => setActiveSection("password")}
          >
            <Lock size={17} />
            Password & Security
          </button>

          <button
            className={activeSection === "notifications" ? "active" : ""}
            onClick={() => setActiveSection("notifications")}
          >
            <Bell size={17} />
            Notifications
          </button>

          <button
            className={activeSection === "privacy" ? "active" : ""}
            onClick={() => setActiveSection("privacy")}
          >
            <ShieldCheck size={17} />
            Privacy
          </button>

        </aside>


        {/* CONTENT */}
        <main className="settings-content">

          {/* PROFILE */}
          {activeSection === "profile" && (
            <section className="settings-card">

              <div className="settings-card-header">
                <div className="settings-card-icon">
                  <User size={18} />
                </div>

                <div>
                  <h2>Profile Information</h2>
                  <p>
                    Update your personal information and contact details.
                  </p>
                </div>
              </div>

              <div className="settings-form-grid">

                <Field label="First Name">
                  <input
                    value={profile.firstName}
                    onChange={(e) =>
                      updateProfile("firstName", e.target.value)
                    }
                  />
                </Field>

                <Field label="Last Name">
                  <input
                    value={profile.lastName}
                    onChange={(e) =>
                      updateProfile("lastName", e.target.value)
                    }
                  />
                </Field>

                <Field label="Email Address">
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      updateProfile("email", e.target.value)
                    }
                  />
                </Field>

                <Field label="Phone Number">
                  <input
                    value={profile.phone}
                    onChange={(e) =>
                      updateProfile("phone", e.target.value)
                    }
                  />
                </Field>

              </div>

              <div className="settings-readonly">

                <div>
                  <small>Staff ID</small>
                  <strong>HC-2024-1547</strong>
                </div>

                <div>
                  <small>Role</small>
                  <strong>Care Worker</strong>
                </div>

                <div>
                  <small>Employment Status</small>
                  <strong className="status-active">
                    <span></span>
                    Active
                  </strong>
                </div>

              </div>

              <div className="settings-actions">
                <button className="primary" onClick={saveSettings}>
                  <Save size={15} />
                  Save Changes
                </button>
              </div>

            </section>
          )}


          {/* PASSWORD */}
          {activeSection === "password" && (
            <section className="settings-card">

              <div className="settings-card-header">
                <div className="settings-card-icon">
                  <Lock size={18} />
                </div>

                <div>
                  <h2>Password & Security</h2>
                  <p>
                    Keep your account secure by using a strong password.
                  </p>
                </div>
              </div>


              <div className="password-form">

                <PasswordField
                  label="Current Password"
                  value={password.current}
                  onChange={(value) =>
                    updatePassword("current", value)
                  }
                  visible={showCurrent}
                  toggle={() => setShowCurrent(!showCurrent)}
                />

                <PasswordField
                  label="New Password"
                  value={password.newPassword}
                  onChange={(value) =>
                    updatePassword("newPassword", value)
                  }
                  visible={showNew}
                  toggle={() => setShowNew(!showNew)}
                />

                <PasswordField
                  label="Confirm New Password"
                  value={password.confirm}
                  onChange={(value) =>
                    updatePassword("confirm", value)
                  }
                  visible={showConfirm}
                  toggle={() => setShowConfirm(!showConfirm)}
                />

              </div>


              <div className="password-requirements">

                <strong>Password requirements</strong>

                <p>
                  • Use at least 8 characters
                </p>

                <p>
                  • Use a mixture of letters and numbers
                </p>

                <p>
                  • Avoid using easily guessed information
                </p>

              </div>


              <div className="settings-actions">
                <button className="primary" onClick={saveSettings}>
                  <Save size={15} />
                  Update Password
                </button>
              </div>

            </section>
          )}


          {/* NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <section className="settings-card">

              <div className="settings-card-header">
                <div className="settings-card-icon">
                  <Bell size={18} />
                </div>

                <div>
                  <h2>Notification Preferences</h2>
                  <p>
                    Choose which notifications you would like to receive.
                  </p>
                </div>
              </div>


              <div className="notification-list">

                <NotificationToggle
                  title="Email Notifications"
                  description="Receive important account notifications by email."
                  checked={notifications.email}
                  onChange={() => updateNotification("email")}
                />

                <NotificationToggle
                  title="Report Reminders"
                  description="Reminders when a daily client care report is due."
                  checked={notifications.reportReminder}
                  onChange={() => updateNotification("reportReminder")}
                />

                <NotificationToggle
                  title="Document Expiry Alerts"
                  description="Receive alerts when one of your documents is about to expire."
                  checked={notifications.expiryAlert}
                  onChange={() => updateNotification("expiryAlert")}
                />

                <NotificationToggle
                  title="Policy Updates"
                  description="Be notified when the company publishes or updates a policy."
                  checked={notifications.policyUpdates}
                  onChange={() => updateNotification("policyUpdates")}
                />

                <NotificationToggle
                  title="Client Updates"
                  description="Receive updates related to your assigned clients."
                  checked={notifications.clientUpdates}
                  onChange={() => updateNotification("clientUpdates")}
                />

              </div>


              <div className="settings-actions">
                <button className="primary" onClick={saveSettings}>
                  <Save size={15} />
                  Save Preferences
                </button>
              </div>

            </section>
          )}


          {/* PRIVACY */}
          {activeSection === "privacy" && (
            <section className="settings-card">

              <div className="settings-card-header">
                <div className="settings-card-icon">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <h2>Privacy & Access</h2>
                  <p>
                    Information about your account access and privacy.
                  </p>
                </div>
              </div>


              <div className="privacy-list">

                <div className="privacy-row">
                  <div>
                    <strong>Account Role</strong>
                    <p>Your account has staff-level access.</p>
                  </div>

                  <span className="privacy-badge">
                    Care Worker
                  </span>
                </div>


                <div className="privacy-row">
                  <div>
                    <strong>Client Information</strong>
                    <p>
                      You can access information for clients assigned to you.
                    </p>
                  </div>

                  <span className="privacy-badge">
                    Assigned Only
                  </span>
                </div>


                <div className="privacy-row">
                  <div>
                    <strong>Report Access</strong>
                    <p>
                      Submitted care reports are available to authorised staff.
                    </p>
                  </div>

                  <span className="privacy-badge">
                    Authorised
                  </span>
                </div>


                <div className="privacy-row">
                  <div>
                    <strong>Account Status</strong>
                    <p>
                      Your account is currently active.
                    </p>
                  </div>

                  <span className="privacy-active">
                    <span></span>
                    Active
                  </span>
                </div>

              </div>

            </section>
          )}

        </main>

      </div>


      {/* SAVED MESSAGE */}
      {saved && (
        <div className="settings-saved">
          <Check size={16} />
          Settings saved successfully
        </div>
      )}


      <div className="watermark">
        LAMBETH RESOLUTION HOMECARE
      </div>

    </div>
  );
}


/* =========================
   FIELD
========================= */

function Field({ label, children }) {
  return (
    <label className="settings-field">
      <span>{label}</span>
      {children}
    </label>
  );
}


/* =========================
   PASSWORD FIELD
========================= */

function PasswordField({
  label,
  value,
  onChange,
  visible,
  toggle,
}) {
  return (
    <label className="settings-field">

      <span>{label}</span>

      <div className="password-input">

        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <button
          type="button"
          onClick={toggle}
          aria-label="Toggle password visibility"
        >
          {visible ? (
            <EyeOff size={16} />
          ) : (
            <Eye size={16} />
          )}
        </button>

      </div>

    </label>
  );
}


/* =========================
   NOTIFICATION TOGGLE
========================= */

function NotificationToggle({
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="notification-row">

      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <button
        type="button"
        className={`toggle ${checked ? "checked" : ""}`}
        onClick={onChange}
        aria-label={`Toggle ${title}`}
      >
        <span />
      </button>

    </div>
  );
}
import { useEffect, useState } from "react";
import { Bell, Send, Users } from "lucide-react";
import { useData } from "../../../context/DataContext.jsx";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5001").replace(/\/$/, "");
const TOKEN_KEY = "lanbeth-auth-token";

function AdminNotifications() {
  const { data } = useData();

  const activeStaff = (Array.isArray(data?.staff) ? data.staff : []).filter(
    (s) => String(s.status || "").toLowerCase() === "active" && s.role !== "admin"
  );

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sendToAll, setSendToAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [inbox, setInbox] = useState([]);
  const [inboxLoading, setInboxLoading] = useState(true);

  const token = localStorage.getItem(TOKEN_KEY);

  const loadInbox = async () => {
    try {
      setInboxLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || "Failed to load notifications.");
      setInbox(result.notifications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setInboxLoading(false);
    }
  };

  useEffect(() => {
    loadInbox();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleStaff = (id) =>
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !message.trim()) {
      setError("Please enter a title and a message.");
      return;
    }
    if (!sendToAll && selectedIds.length === 0) {
      setError("Choose at least one staff member, or select 'All staff'.");
      return;
    }

    try {
      setSending(true);
      const res = await fetch(`${API_BASE_URL}/api/notifications/notice`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          message,
          sendToAll,
          recipientIds: sendToAll ? undefined : selectedIds,
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result?.message || "Failed to send notice.");

      setSuccess(`Notice sent to ${result.sent} staff member(s).`);
      setTitle("");
      setMessage("");
      setSelectedIds([]);
      setSendToAll(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="add-staff-page">
      <div className="page-head">
        <div>
          <div className="eyebrow">LANBETHCARE</div>
          <h1>Notifications</h1>
          <p>Send notices to staff and view your own notifications.</p>
        </div>
      </div>

      <form className="staff-form" onSubmit={handleSend}>
        <section className="form-section">
          <div className="form-section-head">
            <span className="form-section-icon"><Send size={16} /></span>
            <div>
              <h2>Send a Notice</h2>
              <p>Staff will see this on their notifications page.</p>
            </div>
          </div>

          <div className="form-grid">
            <label className="field wide">
              <span>Title <em>*</em></span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Staff meeting on Friday"
              />
            </label>

            <label className="field wide">
              <span>Message <em>*</em></span>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write the notice for staff..."
              />
            </label>

            <div className="field wide">
              <span>Send to</span>
              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={sendToAll}
                  onChange={(e) => setSendToAll(e.target.checked)}
                />
                All active staff ({activeStaff.length})
              </label>
            </div>

            {!sendToAll && (
              <div className="field wide">
                <span>Or choose staff</span>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {activeStaff.length === 0 && <small>No active staff found.</small>}
                  {activeStaff.map((s) => (
                    <label key={s._id} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(s._id)}
                        onChange={() => toggleStaff(s._id)}
                      />
                      {s.fullName}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="profile-success">{success}</div>}

        <div className="form-actions">
          <button type="submit" className="primary" disabled={sending}>
            <Send size={15} />
            {sending ? "Sending..." : "Send Notice"}
          </button>
        </div>
      </form>

      <section className="form-section" style={{ marginTop: 24 }}>
        <div className="form-section-head">
          <span className="form-section-icon"><Bell size={16} /></span>
          <div>
            <h2>My Notifications</h2>
            <p>Expiry alerts and birthday reminders for you.</p>
          </div>
        </div>

        {inboxLoading ? (
          <p>Loading...</p>
        ) : inbox.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          <div className="upload-list">
            {inbox.map((n) => (
              <div className="upload-row" key={n._id}>
                <Users size={15} />
                <div style={{ flex: 1 }}>
                  <b>{n.title}</b>
                  <small style={{ display: "block" }}>{n.message}</small>
                </div>
                {!n.read && <span className="medication-badge">New</span>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminNotifications;
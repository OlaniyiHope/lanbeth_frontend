import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, FileWarning, Clock, Cake } from "lucide-react";
import "./NotificationBell.css";

const API = import.meta.env.VITE_API_URL || "";
const POLL_MS = 60 * 1000;

// Replace with your existing API client if you have one (axios instance, etc.)
async function request(path, options = {}) {
  const token = localStorage.getItem("lanbeth-auth-token");
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState("");
  const wrapRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const data = await request("/api/notifications");
      setItems(data.notifications);
      setUnread(data.unreadCount);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Initial load + polling
  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const markOne = async (n) => {
    if (n.read) return;
    setItems((prev) => prev.map((x) => (x._id === n._id ? { ...x, read: true } : x)));
    setUnread((u) => Math.max(0, u - 1));
    try {
      await request(`/api/notifications/${n._id}/read`, { method: "PATCH" });
    } catch {
      load();
    }
  };

  const markAll = async () => {
    try {
      await request("/api/notifications/read-all", { method: "PATCH" });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggle = () => {
    setOpen((o) => !o);
    if (!open) load(); // refresh when opening
  };

  return (
    <div className="notif-wrap" ref={wrapRef}>
      <button
        className="icon-btn notif-btn"
        onClick={toggle}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="notif-badge">{unread > 99 ? "99+" : unread}</span>
        )}
      </button>

      {open && (
        <div className="notif-panel" role="dialog" aria-label="Notifications">
          <div className="notif-header">
            <strong>Notifications</strong>
            {unread > 0 && (
              <button className="notif-link" onClick={markAll}>
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="notif-list">
            {error && <div className="notif-error">{error}</div>}

            {!error && items.length === 0 && (
              <div className="notif-empty">No notifications</div>
            )}

            {items.map((n) => (
              <button
                key={n._id}
               className={`notif-item ${n.read ? "" : "unread"} ${
  n.type === "document_expired" ? "expired" : n.type === "birthday" ? "birthday" : "expiring"
}`}
                onClick={() => markOne(n)}
              >
               <span className="notif-icon">
  {n.type === "document_expired" ? (
    <FileWarning size={16} />
  ) : n.type === "birthday" ? (
    <Cake size={16} />
  ) : (
    <Clock size={16} />
  )}
</span>
                <span className="notif-body">
                  <span className="notif-title">{n.title}</span>
                  <span className="notif-msg">{n.message}</span>
                  <span className="notif-time">{timeAgo(n.createdAt)}</span>
                </span>
                {!n.read && <span className="notif-dot" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
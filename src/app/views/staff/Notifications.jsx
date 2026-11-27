import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  Cake,
  FileWarning,
  Clock,
  Megaphone,
  RefreshCw,
  Info,
  X,
} from "lucide-react";

import "./Notifications.css";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5001").replace(/\/$/, "");
const TOKEN_KEY = "lanbeth-auth-token";

const CATEGORY_BY_TYPE = {
  document_expired: "Documents",
  document_expiring: "Documents",
  birthday: "Birthdays",
  notice: "Notices",
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
    : "";

const formatTime = (value) =>
  value ? new Date(value).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";

// Turn the API shape into the shape the UI uses
function mapNotification(n) {
  return {
    id: n._id,
    type: n.type,
    title: n.title,
    message: n.message,
    unread: !n.read,
    date: formatDate(n.createdAt),
    time: formatTime(n.createdAt),
    category: CATEGORY_BY_TYPE[n.type] || "General",
    priority: n.type === "document_expired" ? "high" : "normal",
    expiryDate: n.expiryDate ? formatDate(n.expiryDate) : null,
    senderName: n.sender?.fullName || null,
  };
}

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed.");
  return data;
}

function Notifications() {
  const nav = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState(null);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/api/notifications");
      setNotifications((data.notifications || []).map(mapNotification));
    } catch (err) {
      setError(err.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const actionRequiredCount = notifications.filter((n) => n.unread && n.priority === "high").length;

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") return notifications.filter((n) => n.unread);
    if (filter === "read") return notifications.filter((n) => !n.unread);
    return notifications;
  }, [notifications, filter]);

  const markAsRead = async (id) => {
    const target = notifications.find((n) => n.id === id);
    if (!target || !target.unread) return;

    // Update the screen first, then save
    setNotifications((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    try {
      await apiRequest(`/api/notifications/${id}/read`, { method: "PATCH" });
    } catch (err) {
      setError(err.message);
      loadNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiRequest("/api/notifications/read-all", { method: "PATCH" });
      setNotifications((list) => list.map((n) => ({ ...n, unread: false })));
    } catch (err) {
      setError(err.message);
    }
  };

  const openNotification = (notification) => {
    markAsRead(notification.id);
    setSelectedNotification({ ...notification, unread: false });
  };

  return (
    <div className="notifications-page">
      {/* PAGE HEADER */}
      <div className="page-head">
        <div className="notifications-heading">
          <button className="icon-btn" onClick={() => nav(-1)} aria-label="Go back">
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="eyebrow">LANBETHCARE</div>
            <h1>
              Notifications
              {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
            </h1>
            <p>Notices from admin, document expiry alerts and birthday reminders.</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button className="outline" onClick={loadNotifications} disabled={loading}>
            <RefreshCw size={15} className={loading ? "spin" : ""} />
            Refresh
          </button>
          {unreadCount > 0 && (
            <button className="outline" onClick={markAllAsRead}>
              <CheckCheck size={15} />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

      {/* SUMMARY */}
      <div className="notification-summary">
        <div className="notification-summary-card">
          <span className="notification-summary-icon">
            <Bell size={18} />
          </span>
          <div>
            <small>Total Notifications</small>
            <strong>{loading ? "—" : notifications.length}</strong>
          </div>
        </div>

        <div className="notification-summary-card">
          <span className="notification-summary-icon unread">
            <Info size={18} />
          </span>
          <div>
            <small>Unread</small>
            <strong>{loading ? "—" : unreadCount}</strong>
          </div>
        </div>

        <div className="notification-summary-card">
          <span className="notification-summary-icon warning">
            <FileWarning size={18} />
          </span>
          <div>
            <small>Action Required</small>
            <strong>{loading ? "—" : actionRequiredCount}</strong>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="notifications-toolbar">
        <div className="notification-filters">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
            All <span>{notifications.length}</span>
          </button>
          <button className={filter === "unread" ? "active" : ""} onClick={() => setFilter("unread")}>
            Unread <span>{unreadCount}</span>
          </button>
          <button className={filter === "read" ? "active" : ""} onClick={() => setFilter("read")}>
            Read <span>{notifications.length - unreadCount}</span>
          </button>
        </div>
      </div>

      {/* LIST */}
      <section className="notifications-card">
        <div className="notifications-card-head">
          <div>
            <span className="eyebrow">STAFF UPDATES</span>
            <h2>
              {filter === "unread"
                ? "Unread Notifications"
                : filter === "read"
                ? "Read Notifications"
                : "All Notifications"}
            </h2>
          </div>
          <span className="notification-total">
            {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="notifications-empty">
            <p>Loading notifications...</p>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="notification-list">
            {filteredNotifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onOpen={() => openNotification(notification)}
                onMarkRead={() => markAsRead(notification.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyNotifications filter={filter} />
        )}
      </section>

      <div className="watermark">LANBETH CARE</div>

      {selectedNotification && (
        <NotificationModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
}

/* =========================================================
   NOTIFICATION ROW
========================================================= */

function NotificationRow({ notification, onOpen, onMarkRead }) {
  return (
    <div className={`notification-row ${notification.unread ? "unread" : ""}`}>
      <div className={`notification-icon ${notification.type}`}>
        <NotificationIcon type={notification.type} />
      </div>

      <div className="notification-main" onClick={onOpen}>
        <div className="notification-title-row">
          <h3>{notification.title}</h3>
          {notification.unread && <span className="unread-dot" />}
          {notification.priority === "high" && (
            <span className="priority-badge">Action Required</span>
          )}
        </div>

        <p>{notification.message}</p>

        <div className="notification-meta">
          <span>{notification.category}</span>
          {notification.senderName && (
            <>
              <span>•</span>
              <span>From {notification.senderName}</span>
            </>
          )}
          <span>•</span>
          <span>{notification.date}</span>
          <span>•</span>
          <span>{notification.time}</span>
        </div>
      </div>

      <div className="notification-actions">
        <button className="notification-action" onClick={onOpen} title="View notification">
          <ChevronRight size={17} />
        </button>

        {notification.unread && (
          <button className="notification-action" onClick={onMarkRead} title="Mark as read">
            <Check size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ICON
========================================================= */

function NotificationIcon({ type }) {
  if (type === "document_expired" || type === "document_expiring") return <FileWarning size={18} />;
  if (type === "birthday") return <Cake size={18} />;
  if (type === "notice") return <Megaphone size={18} />;
  return <Clock size={18} />;
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyNotifications({ filter }) {
  const title =
    filter === "unread"
      ? "You're all caught up"
      : filter === "read"
      ? "No read notifications"
      : "No notifications";

  const description =
    filter === "unread"
      ? "There are currently no unread notifications."
      : filter === "read"
      ? "You haven't read any notifications yet."
      : "There are currently no notifications to display.";

  return (
    <div className="notifications-empty">
      <div className="notifications-empty-icon">
        <Bell size={24} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

/* =========================================================
   MODAL
========================================================= */

function NotificationModal({ notification, onClose }) {
  return (
    <div
      className="notification-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="notification-modal">
        <div className="notification-modal-head">
          <div className="notification-modal-heading">
            <span className={`notification-modal-icon ${notification.type}`}>
              <NotificationIcon type={notification.type} />
            </span>
            <div>
              <span className="eyebrow">{notification.category}</span>
              <h2>{notification.title}</h2>
            </div>
          </div>

          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={17} />
          </button>
        </div>

        <div className="notification-modal-body">
          <div className="notification-detail-date">
            <span>{notification.date}</span>
            <span>•</span>
            <span>{notification.time}</span>
          </div>

          {notification.priority === "high" && (
            <div className="notification-alert">
              <FileWarning size={17} />
              <div>
                <strong>Action required</strong>
                <p>Please attend to this notification as soon as possible.</p>
              </div>
            </div>
          )}

          <div className="notification-message">
            <p>{notification.message}</p>
          </div>

          {notification.senderName && (
            <div className="notification-detail-box">
              <small>From</small>
              <strong>{notification.senderName}</strong>
            </div>
          )}

          {notification.expiryDate && (
            <div className="notification-detail-box">
              <small>Document Expiry Date</small>
              <strong>{notification.expiryDate}</strong>
            </div>
          )}
        </div>

        <div className="notification-modal-footer">
          <button className="primary" onClick={onClose}>
            <Check size={14} />
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  FileWarning,
  FileText,
  UserPlus,
  ClipboardList,
  ShieldCheck,
  CalendarClock,
  Info,
  X,
} from "lucide-react";

import "./Notifications.css";

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "expiry",
    title: "Document Expiring Soon",
    message:
      "Your Care Certificate is due to expire soon. Please upload a renewed copy before the expiry date.",
    date: "24 August 2026",
    time: "09:15 AM",
    unread: true,
    priority: "high",
    category: "Documents",
    expiryDate: "30 August 2026",
  },
  {
    id: 2,
    type: "policy",
    title: "New Company Policy Available",
    message:
      "A new Health & Safety policy has been published. Please review and acknowledge that you have read it.",
    date: "23 August 2026",
    time: "02:30 PM",
    unread: true,
    priority: "normal",
    category: "Policies",
  },
  {
    id: 3,
    type: "client",
    title: "New Client Assigned",
    message:
      "You have been assigned to a new client. Please review the client's care information before your next visit.",
    date: "22 August 2026",
    time: "11:20 AM",
    unread: true,
    priority: "normal",
    category: "Clients",
    clientName: "Sarah Williams",
  },
  {
    id: 4,
    type: "report",
    title: "Care Report Reminder",
    message:
      "Please remember to submit today's care report for your assigned clients.",
    date: "22 August 2026",
    time: "08:00 PM",
    unread: false,
    priority: "normal",
    category: "Reports",
  },
  {
    id: 5,
    type: "document",
    title: "Document Approved",
    message:
      "Your National ID document has been reviewed and approved by the administrator.",
    date: "21 August 2026",
    time: "04:45 PM",
    unread: false,
    priority: "normal",
    category: "Documents",
  },
  {
    id: 6,
    type: "announcement",
    title: "Staff Meeting Announcement",
    message:
      "There will be a mandatory staff meeting on Friday at 10:00 AM. Please make arrangements to attend.",
    date: "20 August 2026",
    time: "10:10 AM",
    unread: false,
    priority: "normal",
    category: "Announcements",
  },
  {
    id: 7,
    type: "policy",
    title: "Policy Review Reminder",
    message:
      "You have 2 company policies that have not yet been acknowledged.",
    date: "19 August 2026",
    time: "09:30 AM",
    unread: true,
    priority: "normal",
    category: "Policies",
  },
  {
    id: 8,
    type: "client",
    title: "Client Care Plan Updated",
    message:
      "The care plan for John Smith has been updated by the administrator. Please review the latest information.",
    date: "18 August 2026",
    time: "03:15 PM",
    unread: false,
    priority: "normal",
    category: "Clients",
    clientName: "John Smith",
  },
];

function Notifications() {
  const nav = useNavigate();

  const [notifications, setNotifications] = useState(
    INITIAL_NOTIFICATIONS
  );

  const [filter, setFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState(null);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const filteredNotifications = useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((notification) => notification.unread);
    }

    if (filter === "read") {
      return notifications.filter((notification) => !notification.unread);
    }

    return notifications;
  }, [notifications, filter]);

  const markAsRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const markAsUnread = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const openNotification = (notification) => {
    markAsRead(notification.id);
    setSelectedNotification({
      ...notification,
      unread: false,
    });
  };

  const closeNotification = () => {
    setSelectedNotification(null);
  };

  return (
    <div className="notifications-page">
      {/* PAGE HEADER */}
      <div className="page-head">
        <div className="notifications-heading">
          <button
            className="icon-btn"
            onClick={() => nav(-1)}
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="eyebrow">LANBETHCARE</div>

            <h1>
              Notifications
              {unreadCount > 0 && (
                <span className="notification-count">
                  {unreadCount}
                </span>
              )}
            </h1>

            <p>
              Stay up to date with your work, clients, documents and
              company announcements.
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button className="outline" onClick={markAllAsRead}>
            <CheckCheck size={15} />
            Mark all as read
          </button>
        )}
      </div>

      {/* SUMMARY */}
      <div className="notification-summary">
        <div className="notification-summary-card">
          <span className="notification-summary-icon">
            <Bell size={18} />
          </span>

          <div>
            <small>Total Notifications</small>
            <strong>{notifications.length}</strong>
          </div>
        </div>

        <div className="notification-summary-card">
          <span className="notification-summary-icon unread">
            <Info size={18} />
          </span>

          <div>
            <small>Unread</small>
            <strong>{unreadCount}</strong>
          </div>
        </div>

        <div className="notification-summary-card">
          <span className="notification-summary-icon warning">
            <FileWarning size={18} />
          </span>

          <div>
            <small>Action Required</small>
            <strong>
              {
                notifications.filter(
                  (notification) =>
                    notification.unread &&
                    notification.priority === "high"
                ).length
              }
            </strong>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="notifications-toolbar">
        <div className="notification-filters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
            <span>{notifications.length}</span>
          </button>

          <button
            className={filter === "unread" ? "active" : ""}
            onClick={() => setFilter("unread")}
          >
            Unread
            <span>{unreadCount}</span>
          </button>

          <button
            className={filter === "read" ? "active" : ""}
            onClick={() => setFilter("read")}
          >
            Read
            <span>
              {notifications.length - unreadCount}
            </span>
          </button>
        </div>
      </div>

      {/* NOTIFICATION LIST */}
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
            {filteredNotifications.length} notification
            {filteredNotifications.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filteredNotifications.length > 0 ? (
          <div className="notification-list">
            {filteredNotifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onOpen={() => openNotification(notification)}
                onMarkRead={() => markAsRead(notification.id)}
                onMarkUnread={() =>
                  markAsUnread(notification.id)
                }
              />
            ))}
          </div>
        ) : (
          <EmptyNotifications filter={filter} />
        )}
      </section>

      <div className="watermark">
        LAMBETH RESOLUTION HOMECARE
      </div>

      {/* DETAILS MODAL */}
      {selectedNotification && (
        <NotificationModal
          notification={selectedNotification}
          onClose={closeNotification}
          onMarkUnread={() => {
            markAsUnread(selectedNotification.id);
            setSelectedNotification(null);
          }}
        />
      )}
    </div>
  );
}

/* =========================================================
   NOTIFICATION ROW
========================================================= */

function NotificationRow({
  notification,
  onOpen,
  onMarkRead,
  onMarkUnread,
}) {
  return (
    <div
      className={`notification-row ${
        notification.unread ? "unread" : ""
      }`}
    >
      <div
        className={`notification-icon ${notification.type}`}
      >
        <NotificationIcon type={notification.type} />
      </div>

      <div
        className="notification-main"
        onClick={onOpen}
      >
        <div className="notification-title-row">
          <h3>{notification.title}</h3>

          {notification.unread && (
            <span className="unread-dot" />
          )}

          {notification.priority === "high" && (
            <span className="priority-badge">
              Action Required
            </span>
          )}
        </div>

        <p>{notification.message}</p>

        <div className="notification-meta">
          <span>{notification.category}</span>
          <span>•</span>
          <span>{notification.date}</span>
          <span>•</span>
          <span>{notification.time}</span>
        </div>
      </div>

      <div className="notification-actions">
        <button
          className="notification-action"
          onClick={onOpen}
          title="View notification"
        >
          <ChevronRight size={17} />
        </button>

        {notification.unread ? (
          <button
            className="notification-action"
            onClick={onMarkRead}
            title="Mark as read"
          >
            <Check size={15} />
          </button>
        ) : (
          <button
            className="notification-action"
            onClick={onMarkUnread}
            title="Mark as unread"
          >
            <Bell size={15} />
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
  if (type === "expiry") {
    return <FileWarning size={18} />;
  }

  if (type === "policy") {
    return <ShieldCheck size={18} />;
  }

  if (type === "client") {
    return <UserPlus size={18} />;
  }

  if (type === "report") {
    return <ClipboardList size={18} />;
  }

  if (type === "document") {
    return <FileText size={18} />;
  }

  if (type === "announcement") {
    return <CalendarClock size={18} />;
  }

  return <Bell size={18} />;
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

function NotificationModal({
  notification,
  onClose,
  onMarkUnread,
}) {
  return (
    <div
      className="notification-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="notification-modal">
        <div className="notification-modal-head">
          <div className="notification-modal-heading">
            <span
              className={`notification-modal-icon ${notification.type}`}
            >
              <NotificationIcon type={notification.type} />
            </span>

            <div>
              <span className="eyebrow">
                {notification.category}
              </span>

              <h2>{notification.title}</h2>
            </div>
          </div>

          <button
            className="icon-btn"
            onClick={onClose}
            aria-label="Close"
          >
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

                <p>
                  Please attend to this notification as soon
                  as possible.
                </p>
              </div>
            </div>
          )}

          <div className="notification-message">
            <p>{notification.message}</p>
          </div>

          {notification.expiryDate && (
            <div className="notification-detail-box">
              <small>Document Expiry Date</small>
              <strong>
                {notification.expiryDate}
              </strong>
            </div>
          )}

          {notification.clientName && (
            <div className="notification-detail-box">
              <small>Client</small>
              <strong>
                {notification.clientName}
              </strong>
            </div>
          )}
        </div>

        <div className="notification-modal-footer">
          <button
            className="outline"
            onClick={onMarkUnread}
          >
            <Bell size={14} />
            Mark as unread
          </button>

          <button
            className="primary"
            onClick={onClose}
          >
            <Check size={14} />
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
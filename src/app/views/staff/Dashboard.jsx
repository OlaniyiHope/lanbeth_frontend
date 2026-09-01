import { useEffect, useState } from "react";

import {
  Users,
  FileText,
  CalendarDays,
  ClipboardCheck,
  ChevronRight,
  CheckCircle,
  ClipboardList,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    assignedClients: [],
    assignedClientsCount: 0,
    reportsSubmitted: 0,
    pendingReports: 0,
    upcomingVisits: 0,
    recentActivity: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("lanbeth-auth-token");

      if (!token) {
        setError("You are not authenticated.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/staff/dashboard`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Failed to load dashboard."
        );
      }

      setDashboard({
        assignedClients: result.assignedClients || [],
        assignedClientsCount:
          result.assignedClientsCount ||
          result.assignedClients?.length ||
          0,
        reportsSubmitted: result.reportsSubmitted || 0,
        pendingReports: result.pendingReports || 0,
        upcomingVisits: result.upcomingVisits || 0,
        recentActivity: result.recentActivity || [],
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  /*
   * Get logged-in staff information from localStorage.
   * Adjust this key if your authentication system uses
   * another key.
   */
  const storedUser = localStorage.getItem("user");

  let currentUser = null;

  try {
    currentUser = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    currentUser = null;
  }

  const staffName =
    currentUser?.fullName ||
    currentUser?.name ||
    currentUser?.username ||
    "Staff Member";

  return (
    <div className="dashboard-page">

      {/* ================= PAGE HEADER ================= */}

      <div className="page-head">
        <div>
          <div className="eyebrow">
            STAFF PORTAL
          </div>

          <h1>
            Welcome Back, {staffName}
          </h1>

          <p>
            Manage your assigned clients, submit care reports
            and track your activities.
          </p>
        </div>

        <div className="head-actions">
          <button className="icon-btn">
            🔔
          </button>

          <button
            className="outline small"
            onClick={fetchDashboard}
            disabled={loading}
          >
            <RefreshCw size={14} />

            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>


      {/* ================= ERROR ================= */}

      {error && (
        <div className="dashboard-error">
          <AlertCircle size={18} />

          <div>
            <strong>Unable to load dashboard</strong>
            <p>{error}</p>
          </div>

          <button
            className="primary small"
            onClick={fetchDashboard}
          >
            Try Again
          </button>
        </div>
      )}


      {/* ================= STATS ================= */}

      <div className="stats">

        <StatCard
          icon={<Users />}
          label="Assigned Clients"
          value={
            loading
              ? "..."
              : dashboard.assignedClientsCount
          }
          text="Active clients"
        />

        <StatCard
          icon={<FileText />}
          label="Reports Submitted"
          value={
            loading
              ? "..."
              : dashboard.reportsSubmitted
          }
          text="This month"
        />

        <StatCard
          icon={<ClipboardCheck />}
          label="Pending Reports"
          value={
            loading
              ? "..."
              : dashboard.pendingReports
          }
          text="Need submission"
          danger={dashboard.pendingReports > 0}
        />

        <StatCard
          icon={<CalendarDays />}
          label="Upcoming Visits"
          value={
            loading
              ? "..."
              : dashboard.upcomingVisits
          }
          text="Scheduled tasks"
        />

      </div>


      {/* ================= CONTENT ================= */}

      <div className="dashboard-grid">

        {/* LEFT SIDE */}

        <section className="section-card welcome-card">

          <div>

            <span className="eyebrow">
              STAFF ACTIONS
            </span>

            <h2>
              Manage your client care activities
            </h2>

            <p>
              Access assigned clients, complete daily care
              reports, and monitor your submitted reports
              from one place.
            </p>


            <div className="quick-actions">

              <button
                onClick={() =>
                  navigate("/staff/clients")
                }
              >
                <Users />

                My Clients

              </button>


              <button
                onClick={() =>
                  navigate("/staff/submit-report")
                }
              >
                <ClipboardList />

                Submit Report

              </button>


              <button
                onClick={() =>
                  navigate("/staff/reports")
                }
              >
                <FileText />

                My Reports

              </button>


              <button
                onClick={() =>
                  navigate("/staff/documents")
                }
              >
                <FileText />

                Documents

              </button>

            </div>

          </div>


          <div className="dashboard-illustration">

            <Users size={110} />

          </div>

        </section>


        {/* RIGHT SIDE */}

        <section className="section-card">

          <div className="section-title">

            <div>

              <span className="eyebrow">
                RECENT ACTIVITY
              </span>

              <h2>
                Care Updates
              </h2>

            </div>

            <button
              className="outline small"
              onClick={() =>
                navigate("/staff/reports")
              }
            >
              View All
            </button>

          </div>


          <div className="activity-list">

            {loading ? (
              <div className="activity-empty">
                Loading activities...
              </div>
            ) : dashboard.recentActivity.length === 0 ? (

              <div className="activity-empty">
                <ClipboardList size={25} />

                <strong>
                  No recent activity
                </strong>

                <p>
                  Your submitted reports and care
                  activities will appear here.
                </p>
              </div>

            ) : (

              dashboard.recentActivity.map(
                (activity, index) => (
                  <Activity
                    key={
                      activity._id ||
                      activity.id ||
                      index
                    }
                    activity={activity}
                  />
                )
              )

            )}

          </div>

        </section>

      </div>


      {/* ================= ASSIGNED CLIENTS ================= */}

      <section className="section-card assigned-clients-card">

        <div className="section-title">

          <div>

            <span className="eyebrow">
              CLIENTS
            </span>

            <h2>
              My Assigned Clients
            </h2>

          </div>

          <button
            className="outline small"
            onClick={() =>
              navigate("/staff/clients")
            }
          >
            View All
          </button>

        </div>


        {loading ? (

          <div className="client-loading">
            Loading assigned clients...
          </div>

        ) : dashboard.assignedClients.length === 0 ? (

          <div className="activity-empty">

            <Users size={25} />

            <strong>
              No clients assigned
            </strong>

            <p>
              You currently don't have any active
              clients assigned to you.
            </p>

          </div>

        ) : (

          <div className="assigned-client-list">

            {dashboard.assignedClients
              .slice(0, 5)
              .map((client) => (

                <div
                  className="assigned-client-row"
                  key={client._id}
                >

                  <div className="assigned-client-avatar">
                    {getInitials(
                      client.fullName
                    )}
                  </div>


                  <div className="assigned-client-info">

                    <strong>
                      {client.fullName}
                    </strong>

                    <small>
                      {client.clientId}
                    </small>

                  </div>


                  <div className="assigned-client-status">
                    <span className="status-dot" />

                    {client.status}
                  </div>


                  <button
                    className="outline small"
                    onClick={() =>
                      navigate(
                        `/staff/client-profile/${client._id}`
                      )
                    }
                  >
                    View

                    <ChevronRight size={14} />

                  </button>

                </div>

              ))}

          </div>

        )}

      </section>


      <div className="watermark">
        LAMBETH RESOLUTION HOMECARE
      </div>

    </div>
  );
}


/* =====================================================
   STAT CARD
===================================================== */

function StatCard({
  icon,
  label,
  value,
  text,
  danger,
}) {
  return (
    <div className="stat-card">

      <span
        className={`stat-icon ${
          danger ? "danger" : ""
        }`}
      >
        {icon}
      </span>


      <div>

        <small>
          {label}
        </small>

        <strong>
          {value}
        </strong>

        <em
          className={
            danger
              ? "danger-text"
              : ""
          }
        >
          {text}
        </em>

      </div>

    </div>
  );
}


/* =====================================================
   ACTIVITY
===================================================== */

function Activity({ activity }) {

  const clientName =
    activity.client?.fullName ||
    activity.client?.name ||
    activity.clientName ||
    "Client";

  const reportDate =
    activity.createdAt ||
    activity.date;

  return (
    <div className="activity-row">

      <span>
        <CheckCircle size={16} />
      </span>


      <div>

        <b>
          {activity.title ||
            "Care report submitted"}
        </b>


        <small>

          {activity.description ||
            `Client: ${clientName}`}

          {reportDate && (
            <>
              {" • "}
              {formatDate(reportDate)}
            </>
          )}

        </small>

      </div>


      <ChevronRight size={16} />

    </div>
  );
}


/* =====================================================
   HELPERS
===================================================== */

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}


function formatDate(value) {

  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
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
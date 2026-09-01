// import {
//   Activity, CalendarDays, ChevronRight, FileText, UserRound, Users, Check,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useData } from "../../../context/DataContext.jsx";
// import "./Dashboard.css";

// function Dashboard() {
//   const nav = useNavigate();
//   const { data } = useData();

//   const activeClients = data.clients.filter((client) => client.status === "Active").length;
//   const activeStaff = data.staff.filter((staff) => staff.status === "Active").length;

//   return (
//     <div className="dashboard-page">
//       <div className="page-head">
//         <div>
//           <div className="eyebrow">LANBETHCARE</div>
//           <h1>LANBETH RESOLUTION HOMECARE</h1>
//           <p>Manage clients, staff, reports, and more.</p>
//         </div>
//         <div className="head-actions">
//           <button
//             className="icon-btn"
//             title="Notifications"
//             onClick={() => window.alert("You have no new notifications.")}
//           >
//             <span>🔔</span>
//           </button>
//         </div>
//       </div>

//       <div className="stats">
//         <Stat icon={<Users />} label="Total Clients" value={data.clients.length} trend="+8.2% this month" />
//         <Stat icon={<UserRound />} label="Active Staff" value={activeStaff} trend="+2 new this month" />
//         <Stat icon={<FileText />} label="Reports Submitted" value={data.reports.length} trend="12 this week" />
//         <Stat icon={<CalendarDays />} label="Expiring Documents" value="03" trend="Needs attention" danger />
//       </div>

//       <div className="dashboard-grid">
//         <section className="section-card welcome-card">
//           <div>
//             <span className="eyebrow">ADMIN DASHBOARD</span>
//             <h2>Everything important, in one place.</h2>
//             <p>Jump into your client and staff records or review documents requiring attention.</p>
//             <div className="quick-actions">
//               <button onClick={() => nav("/admin/clients")}><Users />Manage Clients</button>
//               <button onClick={() => nav("/admin/staff")}><UserRound />Manage Staff</button>
//               <button onClick={() => nav("/admin/reports")}><FileText />View Reports</button>
//             </div>
//           </div>
//           <div className="dashboard-illustration"><Activity size={110} /></div>
//         </section>

//         <section className="section-card">
//           <div className="section-title">
//             <div><span className="eyebrow">OVERVIEW</span><h2>Care activity</h2></div>
//             <button className="outline small" onClick={() => nav("/admin/audit-log")}>View audit log</button>
//           </div>
//           <div className="activity-list">
//             <ActivityRow title="Client profile viewed" meta="John Doe · 12 minutes ago" />
//             <ActivityRow title="Document uploaded" meta="John Smith · 34 minutes ago" />
//             <ActivityRow title="Weekly report submitted" meta="Sarah Williams · 1 hour ago" />
//           </div>
//         </section>
//       </div>

//       <div className="watermark">LAMBETH RESOLUTIONS</div>
//     </div>
//   );
// }

// function Stat({ icon, label, value, trend, danger }) {
//   return (
//     <div className="stat-card">
//       <span className={`stat-icon ${danger ? "danger" : ""}`}>{icon}</span>
//       <div>
//         <small>{label}</small>
//         <strong>{value}</strong>
//         <em className={danger ? "danger-text" : ""}>{trend}</em>
//       </div>
//     </div>
//   );
// }

// function ActivityRow({ title, meta }) {
//   return (
//     <div className="activity-row">
//       <span><Check size={15} /></span>
//       <div><b>{title}</b><small>{meta}</small></div>
//       <ChevronRight size={16} />
//     </div>
//   );
// }

// export default Dashboard;
import {
  Activity,
  CalendarDays,
  ChevronRight,
  FileText,
  UserRound,
  Users,
  Check,
  RefreshCw,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useData } from "../../../context/DataContext.jsx";
import "./Dashboard.css";

function Dashboard() {
  const nav = useNavigate();

  const {
    data,
    loading,
    error,
    refreshData,
  } = useData();

  const clients = Array.isArray(data?.clients)
    ? data.clients
    : [];

  const staff = Array.isArray(data?.staff)
    ? data.staff
    : [];

  const activeClients = clients.filter(
    (client) =>
      String(client.status || "").toLowerCase() === "active"
  ).length;

  const activeStaff = staff.filter(
    (member) =>
      String(member.status || "").toLowerCase() === "active"
  ).length;

  return (
    <div className="dashboard-page">

      {/* =========================
          PAGE HEADER
      ========================== */}

      <div className="page-head">
        <div>
          <div className="eyebrow">LANBETHCARE</div>

          <h1>LANBETH RESOLUTION HOMECARE</h1>

          <p>
            Manage clients, staff, reports, and more.
          </p>
        </div>

        <div className="head-actions">

          <button
            className="icon-btn"
            title="Refresh dashboard"
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={loading ? "spin" : ""}
            />
          </button>

          <button
            className="icon-btn"
            title="Notifications"
            onClick={() =>
              window.alert("Notifications will be connected to the notification API.")
            }
          >
            <span>🔔</span>
          </button>

        </div>
      </div>


      {/* =========================
          ERROR
      ========================== */}

      {error && (
        <div className="dashboard-error">
          <div>
            <strong>Unable to load live dashboard data</strong>
            <p>{error}</p>
          </div>

          <button
            className="outline small"
            onClick={refreshData}
          >
            <RefreshCw size={13} />
            Retry
          </button>
        </div>
      )}


      {/* =========================
          STATS
      ========================== */}

      <div className="stats">

        <Stat
          icon={<Users />}
          label="Total Clients"
          value={loading ? "—" : clients.length}
          trend={
            loading
              ? "Loading..."
              : `${activeClients} active clients`
          }
        />

        <Stat
          icon={<UserRound />}
          label="Active Staff"
          value={loading ? "—" : activeStaff}
          trend={
            loading
              ? "Loading..."
              : `${staff.length} total staff`
          }
        />

        <Stat
          icon={<FileText />}
          label="Reports Submitted"
          value="—"
          trend="Reports API required"
        />

        <Stat
          icon={<CalendarDays />}
          label="Expiring Documents"
          value="—"
          trend="Expiry API available"
        />

      </div>


      {/* =========================
          MAIN DASHBOARD GRID
      ========================== */}

      <div className="dashboard-grid">

        {/* Welcome */}

        <section className="section-card welcome-card">

          <div>

            <span className="eyebrow">
              ADMIN DASHBOARD
            </span>

            <h2>
              Everything important, in one place.
            </h2>

            <p>
              Jump into your client and staff records or
              review documents requiring attention.
            </p>

            <div className="quick-actions">

              <button
                onClick={() => nav("/admin/clients")}
              >
                <Users />
                Manage Clients
              </button>

              <button
                onClick={() => nav("/admin/staff")}
              >
                <UserRound />
                Manage Staff
              </button>

              <button
                onClick={() => nav("/admin/reports")}
              >
                <FileText />
                View Reports
              </button>

            </div>

          </div>

          <div className="dashboard-illustration">
            <Activity size={110} />
          </div>

        </section>


        {/* Live data overview */}

        <section className="section-card">

          <div className="section-title">

            <div>
              <span className="eyebrow">
                LIVE DATA
              </span>

              <h2>
                Current overview
              </h2>
            </div>

            <button
              className="outline small"
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshCw size={13} />
              Refresh
            </button>

          </div>


          <div className="activity-list">

            <OverviewRow
              icon={<Users size={15} />}
              title="Client records"
              value={
                loading
                  ? "Loading..."
                  : `${clients.length} clients`
              }
              onClick={() => nav("/admin/clients")}
            />

            <OverviewRow
              icon={<UserRound size={15} />}
              title="Staff records"
              value={
                loading
                  ? "Loading..."
                  : `${staff.length} staff members`
              }
              onClick={() => nav("/admin/staff")}
            />

            <OverviewRow
              icon={<Check size={15} />}
              title="Active clients"
              value={
                loading
                  ? "Loading..."
                  : `${activeClients} active`
              }
              onClick={() => nav("/admin/clients")}
            />

          </div>

        </section>

      </div>


      <div className="watermark">
        LAMBETH RESOLUTIONS
      </div>

    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function Stat({
  icon,
  label,
  value,
  trend,
  danger = false,
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

        <small>{label}</small>

        <strong>{value}</strong>

        <em
          className={
            danger ? "danger-text" : ""
          }
        >
          {trend}
        </em>

      </div>

    </div>
  );
}


/* =========================================================
   OVERVIEW ROW
========================================================= */

function OverviewRow({
  icon,
  title,
  value,
  onClick,
}) {
  return (
    <button
      className="activity-row"
      onClick={onClick}
    >

      <span>
        {icon}
      </span>

      <div>
        <b>{title}</b>
        <small>{value}</small>
      </div>

      <ChevronRight size={16} />

    </button>
  );
}


export default Dashboard;
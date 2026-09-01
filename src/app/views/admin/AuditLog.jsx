import { useMemo, useState } from "react";
import {
  Search,
  Download,
  X,
  CalendarDays,
  Activity,
  UserRound,
  ClipboardList,
  ShieldCheck,
  Eye,
} from "lucide-react";
import "./Audit.css"
import { useData } from "../../../context/DataContext.jsx";

function AuditLog() {
  const { data } = useData();

  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All Modules");
  const [actionFilter, setActionFilter] = useState("All Actions");
  const [dateFilter, setDateFilter] = useState("");
  const [selected, setSelected] = useState(null);

  const auditLogs = data?.audit || [];

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const [
        dateTime,
        user,
        action,
        module,
        ip,
      ] = log;

      const matchesSearch =
        `${dateTime} ${user} ${action} ${module} ${ip}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesModule =
        moduleFilter === "All Modules" ||
        module === moduleFilter;

      const matchesAction =
        actionFilter === "All Actions" ||
        action === actionFilter;

      const matchesDate =
        !dateFilter ||
        dateTime
          .toLowerCase()
          .includes(dateFilter.toLowerCase());

      return (
        matchesSearch &&
        matchesModule &&
        matchesAction &&
        matchesDate
      );
    });
  }, [
    auditLogs,
    search,
    moduleFilter,
    actionFilter,
    dateFilter,
  ]);

  const modules = [
    "All Modules",
    ...Array.from(
      new Set(
        auditLogs.map((log) => log[3])
      )
    ),
  ];

  const actions = [
    "All Actions",
    ...Array.from(
      new Set(
        auditLogs.map((log) => log[2])
      )
    ),
  ];

  const exportLogs = () => {
    const headers = [
      "Date & Time",
      "User",
      "Action",
      "Module",
      "IP Address",
    ];

    const csv = [
      headers.join(","),
      ...filteredLogs.map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;

    link.download = `lanbeth-staff-audit-log-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearch("");
    setModuleFilter("All Modules");
    setActionFilter("All Actions");
    setDateFilter("");
  };

  const hasFilters =
    search ||
    moduleFilter !== "All Modules" ||
    actionFilter !== "All Actions" ||
    dateFilter;

  return (
    <div className="audit-page">

   

      {/* Summary */}
      <div className="audit-summary">

        <div className="audit-stat">
          <span className="audit-stat-icon">
            <Activity size={18} />
          </span>

          <div>
            <small>Total Activities</small>
            <strong>
              {auditLogs.length}
            </strong>
          </div>
        </div>

        <div className="audit-stat">
          <span className="audit-stat-icon">
            <UserRound size={18} />
          </span>

          <div>
            <small>Active Users</small>

            <strong>
              {new Set(
                auditLogs.map((log) => log[1])
              ).size}
            </strong>
          </div>
        </div>

        <div className="audit-stat">
          <span className="audit-stat-icon">
            <ClipboardList size={18} />
          </span>

          <div>
            <small>Modules Used</small>

            <strong>
              {new Set(
                auditLogs.map((log) => log[3])
              ).size}
            </strong>
          </div>
        </div>

        <div className="audit-stat">
          <span className="audit-stat-icon">
            <ShieldCheck size={18} />
          </span>

          <div>
            <small>Security Status</small>

            <strong className="audit-secure">
              Secure
            </strong>
          </div>
        </div>

      </div>

      {/* Main Audit Card */}
      <section className="section-card audit-card">

        <div className="section-title">

          <div>
            <span className="eyebrow">
              ACTIVITY MONITOR
            </span>

            <h2>
              Staff Activity
            </h2>

            <p>
              Review actions performed by staff and
              administrators.
            </p>
          </div>

          <button
            className="outline"
            onClick={exportLogs}
          >
            <Download size={14} />
            Export CSV
          </button>

        </div>

        {/* Filters */}
        <div className="audit-toolbar">

          <div className="search audit-search">
            <Search size={16} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search user, action, module or IP..."
            />
          </div>

          <select
            value={moduleFilter}
            onChange={(e) =>
              setModuleFilter(e.target.value)
            }
          >
            {modules.map((module) => (
              <option
                key={module}
                value={module}
              >
                {module}
              </option>
            ))}
          </select>

          <select
            value={actionFilter}
            onChange={(e) =>
              setActionFilter(e.target.value)
            }
          >
            {actions.map((action) => (
              <option
                key={action}
                value={action}
              >
                {action}
              </option>
            ))}
          </select>

          <div className="audit-date">
            <CalendarDays size={15} />

            <input
              type="text"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(e.target.value)
              }
              placeholder="Search date..."
            />
          </div>

          {hasFilters && (
            <button
              className="outline"
              onClick={clearFilters}
            >
              <X size={14} />
              Clear
            </button>
          )}

        </div>

        {/* Result Count */}
        <div className="audit-result-bar">

          <span>
            Showing{" "}
            <b>{filteredLogs.length}</b>{" "}
            of{" "}
            <b>{auditLogs.length}</b>{" "}
            activities
          </span>

          {filteredLogs.length > 0 && (
            <span className="audit-live">
              <i />
              Audit monitoring active
            </span>
          )}

        </div>

        {/* Audit Table */}
        <div className="table-wrap audit-table-wrap">

          <table className="audit-table">

            <thead>
              <tr>
                <th>Date & Time</th>
                <th>User</th>
                <th>Action</th>
                <th>Module</th>
                <th>IP Address</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>

              {filteredLogs.length === 0 ? (

                <tr>
                  <td colSpan="6">

                    <div className="audit-empty">

                      <Activity size={32} />

                      <h3>
                        No audit activity found
                      </h3>

                      <p>
                        Try changing your search or
                        filter options.
                      </p>

                      <button
                        className="outline small"
                        onClick={clearFilters}
                      >
                        Clear Filters
                      </button>

                    </div>

                  </td>
                </tr>

              ) : (

                filteredLogs.map((log, index) => {

                  const [
                    dateTime,
                    user,
                    action,
                    module,
                    ip,
                  ] = log;

                  const dateParts =
                    dateTime.split(" ");

                  return (
                    <tr
                      key={`${dateTime}-${index}`}
                    >

                      {/* Date */}
                      <td>

                        <div className="audit-date-cell">

                          <CalendarDays size={14} />

                          <div>

                            <b>
                              {dateParts[0]}{" "}
                              {dateParts[1]}
                            </b>

                            <small>
                              {dateParts
                                .slice(2)
                                .join(" ")}
                            </small>

                          </div>

                        </div>

                      </td>

                      {/* User */}
                      <td>

                        <div className="audit-user">

                          <span>
                            {user
                              .split(" ")
                              .map((x) => x[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase()}
                          </span>

                          <div>
                            <b>{user}</b>

                            <small>
                              Administrator
                            </small>
                          </div>

                        </div>

                      </td>

                      {/* Action */}
                      <td>

                        <span className="audit-action">
                          <Activity size={13} />
                          {action}
                        </span>

                      </td>

                      {/* Module */}
                      <td>

                        <span className="audit-module">
                          {module}
                        </span>

                      </td>

                      {/* IP */}
                      <td>

                        <code className="audit-ip">
                          {ip}
                        </code>

                      </td>

                      {/* Details */}
                      <td>

                        <button
                          className="table-link"
                          onClick={() =>
                            setSelected({
                              dateTime,
                              user,
                              action,
                              module,
                              ip,
                            })
                          }
                        >
                          <Eye size={13} />
                          View
                        </button>

                      </td>

                    </tr>
                  );
                })

              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* Activity Detail Modal */}
      {selected && (

        <Modal
          title="Audit Activity Details"
          onClose={() => setSelected(null)}
        >

          <div className="audit-detail">

            <div className="audit-detail-icon">
              <Activity size={26} />
            </div>

            <div className="audit-detail-title">

              <span className="eyebrow">
                AUDIT RECORD
              </span>

              <h2>
                {selected.action}
              </h2>

              <p>
                Recorded activity performed within the
                LanbethCare portal.
              </p>

            </div>

            <div className="audit-detail-grid">

              <Info
                label="Date & Time"
                value={selected.dateTime}
              />

              <Info
                label="User"
                value={selected.user}
              />

              <Info
                label="Action"
                value={selected.action}
              />

              <Info
                label="Module"
                value={selected.module}
              />

              <Info
                label="IP Address"
                value={selected.ip}
              />

              <Info
                label="Access Type"
                value="Administrator"
              />

            </div>

            <div className="audit-security-note">

              <ShieldCheck size={17} />

              <div>

                <b>
                  Security record
                </b>

                <p>
                  This activity has been recorded in the
                  system audit history and should not be
                  modified manually.
                </p>

              </div>

            </div>

          </div>

        </Modal>

      )}

    </div>
  );
}


/* =========================
   INFO
========================= */

function Info({ label, value }) {
  return (
    <div className="info">

      <small>
        {label}
      </small>

      <b>
        {value}
      </b>

    </div>
  );
}


/* =========================
   MODAL
========================= */

function Modal({
  title,
  onClose,
  children,
}) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="modal">

        <div className="modal-head">

          <div>

            <span className="eyebrow">
              DETAIL VIEW
            </span>

            <h2>
              {title}
            </h2>

          </div>

          <button
            className="icon-btn"
            onClick={onClose}
          >
            <X />
          </button>

        </div>

        <div className="modal-body">
          {children}
        </div>

      </div>

    </div>
  );
}

export default AuditLog;
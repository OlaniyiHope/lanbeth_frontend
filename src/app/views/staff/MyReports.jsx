
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FileText,
  Eye,
  CalendarDays,
  User,
  CheckCircle2,
  AlertCircle,
  ClipboardList,
  Plus,
  X,
  Trash2
} from "lucide-react";
import { useData } from "../../../context/DataContext.jsx";
import "./MyReports.css";

function MyReports() {
  const nav = useNavigate();
const { data, setData } = useData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const reports = useMemo(() => {
    if (!Array.isArray(data?.reports)) {
      return [];
    }

    return data.reports.map((report, index) => {
      const client =
        report.client && typeof report.client === "object"
          ? report.client
          : {};

      const staff =
        report.staff && typeof report.staff === "object"
          ? report.staff
          : {};

      const reportDate =
        report.reportDate || report.date || report.createdAt;

      const clientName =
        report.clientName ||
        client.fullName ||
        client.name ||
        "Unknown Client";

      const clientId =
        report.clientId || client.clientId || client._id || "";

      const staffName =
        report.staffName ||
        staff.fullName ||
        staff.name ||
        staff.email ||
        "You";

      const staffId = report.staffId || staff._id || "";

      const reportId =
        report.id ||
        report._id ||
        `REP-${String(index + 1).padStart(3, "0")}`;

      return {
        ...report,

        id: reportId,

        date: reportDate ? formatDateInput(reportDate) : "",

        clientId,
        clientName,

        staffId,
        staffName,

        status: report.status || "Submitted",

        reportFile:
          report.reportFile ||
          report.uploadedReportFile?.fileName ||
          "Client Care Report",

        // Keep these as the raw nested objects the backend sends —
        // Info/formatDisplayValue already knows how to render an
        // object's populated key/value pairs generically, so this
        // stays correct even if new sub-fields get added later.
        medication: report.medication || "",
        meal: report.meal || "",
        temperature: report.temperature || "",
        bloodPressure: report.bloodPressure || "",
        comfort: report.comfort || "",
        bloodTest: report.bloodTest || "",
        behaviour: report.behaviour || "",
        incident: report.incident || "",
        generalNotes: report.generalNotes || "",
      };
    });
  }, [data?.reports]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const searchValue = [
        report.id,
        report.clientName,
        report.staffName,
        report.date,
        report.reportFile,
        report.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchValue.includes(search.toLowerCase());

      const status = report.status || "Submitted";

      const matchesStatus =
        statusFilter === "All" ||
        status.toLowerCase() === statusFilter.toLowerCase();

      const matchesDate = !dateFilter || report.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [reports, search, statusFilter, dateFilter]);

  const submittedCount = reports.filter(
    (report) => (report.status || "Submitted").toLowerCase() === "submitted"
  ).length;

  const reviewedCount = reports.filter(
    (report) => (report.status || "").toLowerCase() === "reviewed"
  ).length;

  const attentionCount = reports.filter(
    (report) => (report.status || "").toLowerCase() === "needs attention"
  ).length;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDateFilter("");
  };
const handleDeleteReport = async (report) => {
  const reportId = report._id;

  if (!reportId) {
    alert("Unable to identify this report.");
    return;
  }

  const clientId =
    report.client?._id ||
    report.clientId;

  if (!clientId) {
    alert("Unable to identify the client for this report.");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete this report?\n\nThis action cannot be undone."
  );

  if (!confirmed) {
    return;
  }

  try {
    const token =
      localStorage.getItem("lanbeth-auth-token") ||
      localStorage.getItem("jwtToken");

    const API_BASE_URL = (
      import.meta.env.VITE_API_URL ||
      import.meta.env.VITE_BASE_URL ||
      "http://localhost:5001"
    ).replace(/\/$/, "");

    const response = await fetch(
      `${API_BASE_URL}/api/clients/${clientId}/reports/single/${reportId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result?.message || "Failed to delete report"
      );
    }

    // Remove deleted report immediately from the UI
    setData((prev) => ({
      ...prev,
      reports: Array.isArray(prev.reports)
        ? prev.reports.filter(
            (item) =>
              String(item._id) !== String(reportId)
          )
        : [],
    }));

    setSelectedReport(null);

    alert("Report deleted successfully.");
  } catch (error) {
    console.error("DELETE REPORT ERROR:", error);

    alert(
      error.message ||
        "Unable to delete report. Please try again."
    );
  }
};
  return (
    <div className="staff-reports-page">
      <div className="page-head">
        <div>
          <div className="eyebrow">LANBETHCARE</div>
          <h1>My Submitted Reports</h1>
          <p>View and manage the client care reports you have submitted.</p>
        </div>

        <button className="primary" onClick={() => nav("/staff/clients")}>
          <Plus size={15} />
          Submit New Report
        </button>
      </div>

      <div className="report-summary">
        <div className="report-stat">
          <span className="report-stat-icon">
            <FileText size={18} />
          </span>
          <div>
            <small>Total Reports</small>
            <strong>{reports.length}</strong>
          </div>
        </div>

        <div className="report-stat">
          <span className="report-stat-icon">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <small>Submitted</small>
            <strong>{submittedCount}</strong>
          </div>
        </div>

        <div className="report-stat">
          <span className="report-stat-icon">
            <ClipboardList size={18} />
          </span>
          <div>
            <small>Reviewed</small>
            <strong>{reviewedCount}</strong>
          </div>
        </div>

        <div className="report-stat danger">
          <span className="report-stat-icon">
            <AlertCircle size={18} />
          </span>
          <div>
            <small>Needs Attention</small>
            <strong>{attentionCount}</strong>
          </div>
        </div>
      </div>

      <div className="reports-toolbar">
        <div className="report-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search reports, clients, dates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="report-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Needs Attention">Needs Attention</option>
        </select>

        <div className="date-filter">
          <CalendarDays size={15} />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {(search || dateFilter || statusFilter !== "All") && (
          <button className="clear-filter" onClick={clearFilters}>
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      <div className="reports-card">
        <div className="reports-card-head">
          <div>
            <span className="eyebrow">CARE RECORDS</span>
            <h2>Submitted Client Reports</h2>
          </div>

          <span className="result-count">
            {filteredReports.length} report
            {filteredReports.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filteredReports.length > 0 ? (
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Submitted By</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredReports.map((report, index) => {
                  const status = report.status || "Submitted";
                  const clientName = report.clientName || "Unknown Client";
                  const reportId =
                    report.id || `REP-${String(index + 1).padStart(3, "0")}`;

                  return (
                    <tr key={reportId}>
                      <td>
                        <div className="report-name">
                          <span className="report-file-icon">
                            <FileText size={16} />
                          </span>
                          <div>
                            <b>{report.reportFile || "Client Care Report"}</b>
                            <small>{reportId}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="table-client">
                          <span className="mini-avatar">
                            {getInitials(clientName)}
                          </span>
                          <div>
                            <b>{clientName}</b>
                            {report.clientId && <small>{report.clientId}</small>}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="table-date">
                          <CalendarDays size={14} />
                          <span>{formatDate(report.date)}</span>
                        </div>
                      </td>

                      <td>
                        <div className="submitted-by">
                          <User size={14} />
                          <span>{report.staffName || "You"}</span>
                        </div>
                      </td>

                      <td>
                        <StatusBadge status={status} />
                      </td>

                    <td>
  <div className="report-actions">
    <button
      className="outline small"
      onClick={() => setSelectedReport(report)}
    >
      <Eye size={13} />
      View
    </button>

    <button
      className="danger small"
      onClick={() => handleDeleteReport(report)}
      title="Delete report"
    >
      <Trash2 size={13} />
      Delete
    </button>
  </div>
</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="reports-empty">
            <div className="empty-report-icon">
              <ClipboardList size={25} />
            </div>

            <h3>No reports found</h3>

            <p>
              {search || dateFilter || statusFilter !== "All"
                ? "Try changing your search or filters."
                : "You have not submitted any client care reports yet."}
            </p>

            {search || dateFilter || statusFilter !== "All" ? (
              <button className="outline" onClick={clearFilters}>
                Clear Filters
              </button>
            ) : (
              <button className="primary" onClick={() => nav("/staff/clients")}>
                <Plus size={15} />
                Submit Client Report
              </button>
            )}
          </div>
        )}
      </div>

      <div className="watermark">LAMBETH RESOLUTION HOMECARE</div>

      {selectedReport && (
        <ReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onViewClient={() => {
            const clientId = selectedReport.clientId;
            if (clientId) {
              nav(`/staff/client-profile/${clientId}`);
            }
          }}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const safeStatus = typeof status === "string" ? status : "Submitted";
  const normalized = safeStatus.toLowerCase();

  let type = "submitted";
  if (normalized === "reviewed") type = "reviewed";
  if (normalized === "needs attention" || normalized === "rejected")
    type = "danger";

  return (
    <span className={`report-status ${type}`}>
      <i />
      {safeStatus}
    </span>
  );
}

function ReportModal({ report, onClose, onViewClient, onDelete, }) {
  const clientName =
    typeof report.clientName === "string" ? report.clientName : "Unknown Client";

  return (
    <div
      className="report-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="report-modal">
        <div className="report-modal-head">
          <div>
            <span className="eyebrow">CLIENT CARE REPORT</span>
            <h2>{clientName}</h2>
            <p>{formatDate(report.date)}</p>
          </div>

          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="report-modal-body">
          {/* BASIC INFORMATION */}
          <div className="modal-section">
            <h3>
              <FileText size={16} />
              Report Information
            </h3>

            <div className="modal-info-grid">
              <Info label="Report ID" value={report.id} />
              <Info label="Client" value={clientName} />
              <Info label="Date" value={formatDate(report.date)} />
              <Info label="Submitted By" value={report.staffName || "You"} />
              <Info label="Status" value={report.status || "Submitted"} />
              <Info
                label="Report File"
                value={report.reportFile || "Client Care Report"}
              />
            </div>
          </div>

          {/* CARE INFORMATION */}
          <div className="modal-section">
            <h3>
              <HeartPulseIcon />
              Daily Care
            </h3>

            <div className="modal-info-grid">
              <Info label="Medication" value={report.medication} />
              <Info label="Meal" value={report.meal} />
              <Info label="Bath Time" value={report.bathTime} />
              <Info label="Bedtime" value={report.bedtime} />
              <Info label="Temperature" value={report.temperature} />
              <Info label="Blood Pressure" value={report.bloodPressure} />
              <Info label="Cleaning Done" value={report.cleaningDone} />
              <Info label="Bedroom Check" value={report.bedroomCheck} />
              <Info label="Finances" value={report.finances} />
              <Info label="Keywork Session" value={report.keyworkSession} />
              <Info label="Case Note" value={report.caseNote} />
              <Info
                label="Fridge / Freezer Temperature"
                value={report.fridgeFreezerTemp}
              />
            </div>
          </div>

          {/* NOTES */}
          <div className="modal-section">
            <h3>
              <ClipboardList size={16} />
              Notes & Comments
            </h3>

            <div className="modal-notes">
              <Info label="Incident" value={report.incident} />
              <Info label="Behaviour" value={report.behaviour} />
              <Info label="Comfort Check" value={report.comfort} />
              <Info label="Blood Test" value={report.bloodTest} />
              <Info label="General Notes" value={report.generalNotes} />
            </div>
          </div>

          <div className="modal-actions">
            <button className="outline" onClick={onClose}>
              Close
            </button>

            {report.clientId && (
              <button className="primary" onClick={onViewClient}>
                <User size={14} />
                View Client
              </button>
            )}

            {report.downloadUrl && (
              <a href={report.downloadUrl} download className="primary">
                <FileText size={14} />
                Download Report
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  const displayValue = formatDisplayValue(value);

  return (
    <div className="modal-info">
      <small>{label}</small>
      <b>{displayValue || "—"}</b>
    </div>
  );
}

function formatDisplayValue(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => formatDisplayValue(item))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    const parts = Object.entries(value)
      .filter(([key, itemValue]) => {
        if (key === "_id") return false;
        return itemValue !== null && itemValue !== undefined && itemValue !== "";
      })
      .map(([key, itemValue]) => {
        const formatted = formatDisplayValue(itemValue);
        if (!formatted) return "";
        return `${formatLabel(key)}: ${formatted}`;
      })
      .filter(Boolean);

    return parts.join(" • ");
  }

  return String(value);
}

function formatLabel(value = "") {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

function getInitials(name = "") {
  if (typeof name !== "string") return "?";

  const cleanName = name.trim();
  if (!cleanName) return "?";

  return cleanName
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDateInput(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function HeartPulseIcon() {
  return <span className="heart-pulse-icon">♥</span>;
}

export default MyReports;
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FileText,
  Eye,
  CalendarDays,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  ClipboardList,
  Plus,
  X,
} from "lucide-react";
import { useData } from "../../../context/DataContext.jsx";
import "./MyReports.css";

function MyReports() {
  const nav = useNavigate();
  const { data } = useData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  /*
   * Reports can come from the staff reports collection if you have one.
   * It also falls back to reports stored inside clients.
   */
  const reports = useMemo(() => {
    if (Array.isArray(data?.reports)) {
      return data.reports;
    }

    const clientReports = [];

    (data?.clients || []).forEach((client) => {
      (client.reports || []).forEach((report, index) => {
        clientReports.push({
          ...report,
          id:
            report.id ||
            `REP-${client.id}-${index + 1}`,
          clientId: client.id,
          clientName: client.name,
        });
      });
    });

    return clientReports;
  }, [data]);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const searchValue = `
        ${report.id || ""}
        ${report.clientName || ""}
        ${report.client || ""}
        ${report.staff || ""}
        ${report.date || ""}
        ${report.reportFile || ""}
      `.toLowerCase();

      const matchesSearch = searchValue.includes(search.toLowerCase());

      const status = report.status || "Submitted";

      const matchesStatus =
        statusFilter === "All" ||
        status.toLowerCase() === statusFilter.toLowerCase();

      const matchesDate =
        !dateFilter ||
        report.date === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [reports, search, statusFilter, dateFilter]);

  const submittedCount = reports.filter(
    (report) =>
      (report.status || "Submitted").toLowerCase() === "submitted"
  ).length;

  const reviewedCount = reports.filter(
    (report) =>
      (report.status || "").toLowerCase() === "reviewed"
  ).length;

  const attentionCount = reports.filter(
    (report) =>
      (report.status || "").toLowerCase() === "needs attention"
  ).length;

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDateFilter("");
  };

  return (
    <div className="staff-reports-page">

      {/* PAGE HEADER */}
      <div className="page-head">
        <div>
          <div className="eyebrow">LANBETHCARE</div>

          <h1>My Submitted Reports</h1>

          <p>
            View and manage the client care reports you have submitted.
          </p>
        </div>

        <button
          className="primary"
          onClick={() => nav("/staff/clients")}
        >
          <Plus size={15} />
          Submit New Report
        </button>
      </div>


      {/* SUMMARY */}
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


      {/* TOOLBAR */}
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
          <option value="Needs Attention">
            Needs Attention
          </option>
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
          <button
            className="clear-filter"
            onClick={clearFilters}
          >
            <X size={14} />
            Clear
          </button>
        )}

      </div>


      {/* REPORT LIST */}
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

                  const status =
                    report.status || "Submitted";

                  const clientName =
                    report.clientName ||
                    report.client ||
                    "Unknown Client";

                  const reportId =
                    report.id ||
                    `REP-${String(index + 1).padStart(3, "0")}`;

                  return (

                    <tr key={reportId}>

                      {/* REPORT */}
                      <td>

                        <div className="report-name">

                          <span className="report-file-icon">
                            <FileText size={16} />
                          </span>

                          <div>
                            <b>{report.reportFile || "Client Care Report"}</b>

                            <small>
                              {reportId}
                            </small>
                          </div>

                        </div>

                      </td>


                      {/* CLIENT */}
                      <td>

                        <div className="table-client">

                          <span className="mini-avatar">
                            {getInitials(clientName)}
                          </span>

                          <div>
                            <b>{clientName}</b>

                            {report.clientId && (
                              <small>
                                {report.clientId}
                              </small>
                            )}
                          </div>

                        </div>

                      </td>


                      {/* DATE */}
                      <td>

                        <div className="table-date">

                          <CalendarDays size={14} />

                          <span>
                            {formatDate(report.date)}
                          </span>

                        </div>

                      </td>


                      {/* STAFF */}
                      <td>

                        <div className="submitted-by">

                          <User size={14} />

                          {report.staff || "You"}

                        </div>

                      </td>


                      {/* STATUS */}
                      <td>
                        <StatusBadge status={status} />
                      </td>


                      {/* ACTION */}
                      <td>

                        <button
                          className="outline small"
                          onClick={() =>
                            setSelectedReport(report)
                          }
                        >
                          <Eye size={13} />
                          View
                        </button>

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

              <button
                className="outline"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            ) : (

              <button
                className="primary"
                onClick={() => nav("/staff/clients")}
              >
                <Plus size={15} />
                Submit Client Report
              </button>

            )}

          </div>

        )}

      </div>


      <div className="watermark">
        LAMBETH RESOLUTION HOMECARE
      </div>


      {/* REPORT DETAILS MODAL */}
      {selectedReport && (

        <ReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onViewClient={() => {
            const clientId =
              selectedReport.clientId;

            if (clientId) {
              nav(`/staff/client-profile/${clientId}`);
            }
          }}
        />

      )}

    </div>
  );
}


/* =========================
   STATUS
========================= */

function StatusBadge({ status }) {

  const normalized =
    status.toLowerCase();

  let type = "submitted";

  if (normalized === "reviewed") {
    type = "reviewed";
  }

  if (
    normalized === "needs attention" ||
    normalized === "rejected"
  ) {
    type = "danger";
  }

  return (

    <span className={`report-status ${type}`}>

      <i />

      {status}

    </span>

  );
}


/* =========================
   REPORT MODAL
========================= */

function ReportModal({
  report,
  onClose,
  onViewClient,
}) {

  const clientName =
    report.clientName ||
    report.client ||
    "Unknown Client";

  return (

    <div
      className="report-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >

      <div className="report-modal">

        <div className="report-modal-head">

          <div>

            <span className="eyebrow">
              CLIENT CARE REPORT
            </span>

            <h2>
              {clientName}
            </h2>

            <p>
              {formatDate(report.date)}
            </p>

          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
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

              <Info
                label="Report ID"
                value={report.id}
              />

              <Info
                label="Client"
                value={clientName}
              />

              <Info
                label="Date"
                value={formatDate(report.date)}
              />

              <Info
                label="Submitted By"
                value={report.staff || "You"}
              />

              <Info
                label="Status"
                value={report.status || "Submitted"}
              />

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

              <Info
                label="Medication Given"
                value={report.medicationGiven}
              />

              <Info
                label="Meal Given"
                value={report.mealGiven}
              />

              <Info
                label="Bath Time"
                value={report.bathTime}
              />

              <Info
                label="Bedtime"
                value={report.bedtime}
              />

              <Info
                label="Temperature"
                value={report.temperature}
              />

              <Info
                label="Blood Pressure"
                value={report.bloodPressure}
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

              <Info
                label="Incident"
                value={report.incident}
              />

              <Info
                label="Behaviour"
                value={report.behaviour}
              />

              <Info
                label="Notes"
                value={report.comments || report.notes}
              />

            </div>

          </div>


          {/* ACTIONS */}
          <div className="modal-actions">

            <button
              className="outline"
              onClick={onClose}
            >
              Close
            </button>

            {report.clientId && (

              <button
                className="primary"
                onClick={onViewClient}
              >
                <User size={14} />
                View Client
              </button>

            )}

            {report.downloadUrl && (

              <a
                href={report.downloadUrl}
                download
                className="primary"
              >
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


/* =========================
   INFO
========================= */

function Info({ label, value }) {

  return (

    <div className="modal-info">

      <small>{label}</small>

      <b>
        {value || "—"}
      </b>

    </div>

  );
}


/* =========================
   HELPERS
========================= */

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
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

}


function HeartPulseIcon() {

  return (
    <span className="heart-pulse-icon">
      ♥
    </span>
  );

}


export default MyReports;
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Users,
  UserRound,
  CalendarDays,
  Search,
  ChevronDown,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
} from "lucide-react";

import { useData } from "../../../context/DataContext.jsx";

import "./GenerateReport.css";

function GenerateReport() {
  const nav = useNavigate();

  const {
    data,
    loading: dataLoading,
    getAllReports,
  } = useData();

  const clients = Array.isArray(data?.clients)
    ? data.clients
    : [];

  const staff = Array.isArray(data?.staff)
    ? data.staff
    : [];

  const [reportType, setReportType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [staffMember, setStaffMember] = useState("");
  const [client, setClient] = useState("");

  const [generatedReports, setGeneratedReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /*
   * ---------------------------------------------------------
   * SELECTED STAFF
   * ---------------------------------------------------------
   */

  const selectedStaff = useMemo(() => {
    if (!staffMember) {
      return null;
    }

    return staff.find(
      (item) =>
        String(item._id || item.id) ===
        String(staffMember)
    );
  }, [staff, staffMember]);

  /*
   * ---------------------------------------------------------
   * CLIENTS ASSIGNED TO SELECTED STAFF
   * ---------------------------------------------------------
   *
   * Client schema:
   *
   * assignedStaff: [ObjectId]
   *
   * So we check whether the selected staff ID exists
   * inside the client's assignedStaff array.
   */

  const staffClients = useMemo(() => {
    if (!selectedStaff) {
      return [];
    }

    const selectedStaffId = String(
      selectedStaff._id || selectedStaff.id
    );

    return clients.filter((item) => {
      const assignedStaff = Array.isArray(
        item.assignedStaff
      )
        ? item.assignedStaff
        : [];

      return assignedStaff.some((assigned) => {
        const assignedId =
          typeof assigned === "object"
            ? assigned._id || assigned.id
            : assigned;

        return (
          String(assignedId) ===
          selectedStaffId
        );
      });
    });
  }, [clients, selectedStaff]);

  /*
   * ---------------------------------------------------------
   * RESET CLIENT WHEN STAFF CHANGES
   * ---------------------------------------------------------
   */

  useEffect(() => {
    setClient("");
    setGeneratedReports([]);
    setSelectedReport(null);
    setMessage("");
    setError("");
  }, [staffMember]);

  /*
   * ---------------------------------------------------------
   * CLIENT NAME
   * ---------------------------------------------------------
   */

  const getClientName = (clientObject) => {
    if (!clientObject) {
      return "Unknown Client";
    }

    if (typeof clientObject === "string") {
      return clientObject;
    }

    return (
      clientObject.fullName ||
      clientObject.name ||
      clientObject.clientName ||
      "Unknown Client"
    );
  };

  /*
   * ---------------------------------------------------------
   * CLIENT ID
   * ---------------------------------------------------------
   */

  const getClientMongoId = (clientObject) => {
    if (!clientObject) {
      return "";
    }

    if (typeof clientObject === "string") {
      return clientObject;
    }

    return (
      clientObject._id ||
      clientObject.id ||
      ""
    );
  };

  /*
   * ---------------------------------------------------------
   * STAFF NAME
   * ---------------------------------------------------------
   */

  const getStaffName = (staffObject) => {
    if (!staffObject) {
      return "Unknown Staff";
    }

    if (typeof staffObject === "string") {
      return staffObject;
    }

    return (
      staffObject.fullName ||
      staffObject.name ||
      staffObject.email ||
      "Unknown Staff"
    );
  };

  /*
   * ---------------------------------------------------------
   * FORMAT DATE
   * ---------------------------------------------------------
   */

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /*
   * ---------------------------------------------------------
   * DATE ONLY
   * ---------------------------------------------------------
   */

  const getDateOnly = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /*
   * ---------------------------------------------------------
   * FORMAT OBJECTS FOR DISPLAY
   * ---------------------------------------------------------
   */

  const formatDisplayValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "";
    }

    if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value
        .map((item) =>
          formatDisplayValue(item)
        )
        .filter(Boolean)
        .join(", ");
    }

    if (typeof value === "object") {
      return Object.entries(value)
        .filter(([key, itemValue]) => {
          if (key === "_id") {
            return false;
          }

          return (
            itemValue !== null &&
            itemValue !== undefined &&
            itemValue !== ""
          );
        })
        .map(([key, itemValue]) => {
          const formatted =
            formatDisplayValue(itemValue);

          if (!formatted) {
            return "";
          }

          return `${formatLabel(key)}: ${formatted}`;
        })
        .filter(Boolean)
        .join(" • ");
    }

    return String(value);
  };

  const formatLabel = (value = "") => {
    return value
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (char) =>
        char.toUpperCase()
      )
      .trim();
  };

  /*
   * ---------------------------------------------------------
   * GENERATE REPORT
   * ---------------------------------------------------------
   */

  const handleGenerateReport = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setGeneratedReports([]);
    setSelectedReport(null);

    if (!reportType) {
      setError("Please select a report type.");
      return;
    }

    if (!startDate) {
      setError("Please select a start date.");
      return;
    }

    if (!endDate) {
      setError("Please select an end date.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError(
        "End date cannot be earlier than start date."
      );
      return;
    }

    if (!staffMember) {
      setError(
        "Please select a staff member."
      );
      return;
    }

    try {
      setGenerating(true);

      /*
       * Get all real reports from:
       *
       * GET /api/report/my-report
       *
       * Admin receives all reports.
       */

      const reports = await getAllReports();

      const selectedStaffId = String(
        selectedStaff?._id ||
          selectedStaff?.id ||
          staffMember
      );

      const selectedClientId = client
        ? String(client)
        : "";

      /*
       * Filter reports by:
       *
       * 1. Staff
       * 2. Client if selected
       * 3. Start date
       * 4. End date
       */

      const filtered = reports.filter(
        (report) => {
          const reportStaff =
            report.staff;

          const reportStaffId =
            typeof reportStaff === "object"
              ? reportStaff?._id ||
                reportStaff?.id
              : reportStaff;

          if (
            String(reportStaffId) !==
            selectedStaffId
          ) {
            return false;
          }

          /*
           * Client filter
           */

          if (selectedClientId) {
            const reportClient =
              report.client;

            const reportClientId =
              typeof reportClient ===
              "object"
                ? reportClient?._id ||
                  reportClient?.id
                : reportClient;

            if (
              String(reportClientId) !==
              selectedClientId
            ) {
              return false;
            }
          }

          /*
           * Date filter
           */

          const reportDate =
            getDateOnly(
              report.reportDate ||
                report.date ||
                report.createdAt
            );

          if (!reportDate) {
            return false;
          }

          if (reportDate < startDate) {
            return false;
          }

          if (reportDate > endDate) {
            return false;
          }

          return true;
        }
      );

      /*
       * Sort newest first
       */

      filtered.sort((a, b) => {
        return (
          new Date(
            b.reportDate ||
              b.date ||
              b.createdAt
          ) -
          new Date(
            a.reportDate ||
              a.date ||
              a.createdAt
          )
        );
      });

      setGeneratedReports(filtered);

      if (filtered.length === 0) {
        setMessage(
          "No reports were found for the selected staff, client and date range."
        );
      } else {
        setMessage(
          `${filtered.length} report${
            filtered.length !== 1
              ? "s"
              : ""
          } found successfully.`
        );
      }
    } catch (err) {
      console.error(
        "GENERATE REPORT ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to generate report."
      );
    } finally {
      setGenerating(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * SUMMARY
   * ---------------------------------------------------------
   */

  const reportSummary = useMemo(() => {
    const total =
      generatedReports.length;

    const submitted =
      generatedReports.filter(
        (report) =>
          String(
            report.status ||
              "Submitted"
          ).toLowerCase() ===
          "submitted"
      ).length;

    const reviewed =
      generatedReports.filter(
        (report) =>
          String(
            report.status || ""
          ).toLowerCase() ===
          "reviewed"
      ).length;

    const attention =
      generatedReports.filter(
        (report) =>
          String(
            report.status || ""
          ).toLowerCase() ===
            "needs attention" ||
          String(
            report.status || ""
          ).toLowerCase() ===
            "rejected"
      ).length;

    return {
      total,
      submitted,
      reviewed,
      attention,
    };
  }, [generatedReports]);

  /*
   * ---------------------------------------------------------
   * CLEAR
   * ---------------------------------------------------------
   */

  const clearReport = () => {
    setReportType("");
    setStartDate("");
    setEndDate("");
    setStaffMember("");
    setClient("");
    setGeneratedReports([]);
    setSelectedReport(null);
    setMessage("");
    setError("");
  };

  return (
    <div className="generate-report-page">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="page-head">
        <div>
          <span className="eyebrow">
            REPORTS
          </span>

          <h1>Generate Staff Report</h1>

          <p>
            Select a staff member and view the
            clients assigned to them and their
            submitted care reports.
          </p>
        </div>

        <button
          className="outline"
          onClick={() =>
            nav("/reports")
          }
        >
          ← Back to Reports
        </button>
      </div>

      {/* =====================================================
          FILTER FORM
      ====================================================== */}

      <section className="form-card">
        <div className="section-title">
          <div>
            <span className="eyebrow">
              REPORT FILTER
            </span>

            <h2>
              Select Staff & Report Period
            </h2>
          </div>

          <FileText size={25} />
        </div>

        <form onSubmit={handleGenerateReport}>
          <div className="form-grid">
            {/* Report Type */}

            <label>
              <span>Report Type</span>

              <select
                value={reportType}
                onChange={(e) =>
                  setReportType(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select report type
                </option>

                <option value="Daily Care Report">
                  Daily Care Report
                </option>

                <option value="Care Review">
                  Care Review
                </option>

                <option value="Weekly Report">
                  Weekly Report
                </option>

                <option value="Monthly Report">
                  Monthly Report
                </option>

                <option value="Client Care Summary">
                  Client Care Summary
                </option>
              </select>
            </label>

            {/* Staff */}

            <label>
              <span>Staff Member</span>

              <select
                value={staffMember}
                onChange={(e) =>
                  setStaffMember(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select staff member
                </option>

                {staff.map((item) => {
                  const id =
                    item._id ||
                    item.id;

                  return (
                    <option
                      key={id}
                      value={id}
                    >
                      {getStaffName(item)}
                    </option>
                  );
                })}
              </select>
            </label>

            {/* Client */}

            <label>
              <span>
                Client
                {selectedStaff && (
                  <small
                    style={{
                      marginLeft: 8,
                      opacity: 0.7,
                    }}
                  >
                    ({staffClients.length} assigned)
                  </small>
                )}
              </span>

              <select
                value={client}
                onChange={(e) =>
                  setClient(
                    e.target.value
                  )
                }
                disabled={!selectedStaff}
              >
                <option value="">
                  All Clients
                </option>

                {staffClients.map(
                  (item) => {
                    const id =
                      item._id ||
                      item.id;

                    return (
                      <option
                        key={id}
                        value={id}
                      >
                        {getClientName(item)}
                      </option>
                    );
                  }
                )}
              </select>
            </label>

            {/* Start Date */}

            <label>
              <span>Start Date</span>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
              />
            </label>

            {/* End Date */}

            <label>
              <span>End Date</span>

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(
                    e.target.value
                  )
                }
              />
            </label>
          </div>

          {/* =================================================
              SELECTED STAFF INFORMATION
          ================================================== */}

          {selectedStaff && (
            <div className="selected-staff-box">
              <div className="staff-avatar">
                <UserRound size={20} />
              </div>

              <div>
                <small>
                  SELECTED STAFF MEMBER
                </small>

                <strong>
                  {getStaffName(
                    selectedStaff
                  )}
                </strong>

                <span>
                  {selectedStaff.role ||
                    "Staff"}{" "}
                  •{" "}
                  {staffClients.length} assigned
                  client
                  {staffClients.length !==
                  1
                    ? "s"
                    : ""}
                </span>
              </div>
            </div>
          )}

          {/* =================================================
              ERROR / MESSAGE
          ================================================== */}

          {error && (
            <div className="form-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {message && !error && (
            <div className="form-success">
              <CheckCircle2 size={16} />
              <span>{message}</span>
            </div>
          )}

          {/* =================================================
              FORM FOOTER
          ================================================== */}

          <div className="form-footer">
            <button
              type="button"
              className="outline"
              onClick={clearReport}
            >
              <X size={15} />
              Clear
            </button>

            <button
              type="submit"
              className="primary"
              disabled={generating}
            >
              <FileText size={15} />

              {generating
                ? "Generating..."
                : "Generate Report"}
            </button>
          </div>
        </form>
      </section>

      {/* =====================================================
          ASSIGNED CLIENTS
      ====================================================== */}

      {selectedStaff && (
        <section className="results-card">
          <div className="section-title">
            <div>
              <span className="eyebrow">
                STAFF CLIENTS
              </span>

              <h2>
                Clients Assigned to{" "}
                {getStaffName(
                  selectedStaff
                )}
              </h2>
            </div>

            <span className="result-count">
              {staffClients.length} client
              {staffClients.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          {staffClients.length > 0 ? (
            <div className="client-list">
              {staffClients.map(
                (item) => {
                  const id =
                    item._id ||
                    item.id;

                  const isSelected =
                    String(client) ===
                    String(id);

                  return (
                    <button
                      key={id}
                      type="button"
                      className={`client-row ${
                        isSelected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        setClient(
                          isSelected
                            ? ""
                            : id
                        )
                      }
                    >
                      <span className="client-icon">
                        <Users size={17} />
                      </span>

                      <div>
                        <strong>
                          {getClientName(
                            item
                          )}
                        </strong>

                        <small>
                          Client ID:{" "}
                          {item.clientId ||
                            "—"}
                        </small>
                      </div>

                      <ChevronDown
                        size={16}
                      />
                    </button>
                  );
                }
              )}
            </div>
          ) : (
            <div className="empty-state">
              <Users size={25} />

              <h3>
                No clients assigned
              </h3>

              <p>
                This staff member does not
                currently have any assigned
                clients.
              </p>
            </div>
          )}
        </section>
      )}

      {/* =====================================================
          GENERATED REPORT SUMMARY
      ====================================================== */}

      {generatedReports.length > 0 && (
        <>
          <section className="report-summary-grid">
            <SummaryCard
              icon={<FileText />}
              label="Total Reports"
              value={
                reportSummary.total
              }
            />

            <SummaryCard
              icon={<CheckCircle2 />}
              label="Submitted"
              value={
                reportSummary.submitted
              }
            />

            <SummaryCard
              icon={<ClipboardList />}
              label="Reviewed"
              value={
                reportSummary.reviewed
              }
            />

            <SummaryCard
              icon={<AlertCircle />}
              label="Needs Attention"
              value={
                reportSummary.attention
              }
            />
          </section>

          {/* =================================================
              REPORT RESULT
          ================================================== */}

          <section className="results-card">
            <div className="section-title">
              <div>
                <span className="eyebrow">
                  GENERATED REPORT
                </span>

                <h2>
                  {reportType}
                </h2>

                <p>
                  {getStaffName(
                    selectedStaff
                  )}
                  {" • "}
                  {startDate &&
                    formatDate(
                      startDate
                    )}
                  {" — "}
                  {endDate &&
                    formatDate(
                      endDate
                    )}
                </p>
              </div>

              <button
                className="outline small"
                onClick={
                  handleGenerateReport
                }
                disabled={generating}
              >
                <RefreshCw
                  size={13}
                />

                Refresh
              </button>
            </div>

            <div className="reports-table-wrapper">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Report</th>
                    <th>Client</th>
                    <th>Date</th>
                    <th>Staff</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {generatedReports.map(
                    (report, index) => {
                      const reportClient =
                        report.client;

                      const clientName =
                        typeof reportClient ===
                        "object"
                          ? getClientName(
                              reportClient
                            )
                          : getClientName(
                              staffClients.find(
                                (item) =>
                                  String(
                                    item._id ||
                                      item.id
                                  ) ===
                                  String(
                                    reportClient
                                  )
                              )
                            );

                      const reportId =
                        report._id ||
                        report.id ||
                        `REPORT-${index + 1}`;

                      return (
                        <tr
                          key={reportId}
                        >
                          <td>
                            <div className="report-name">
                              <span className="report-icon">
                                <FileText
                                  size={16}
                                />
                              </span>

                              <div>
                                <strong>
                                  {reportType}
                                </strong>

                                <small>
                                  {String(
                                    reportId
                                  ).slice(
                                    -8
                                  )}
                                </small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="table-client">
                              <span className="mini-avatar">
                                {getInitials(
                                  clientName
                                )}
                              </span>

                              <div>
                                <strong>
                                  {
                                    clientName
                                  }
                                </strong>

                                <small>
                                  {typeof reportClient ===
                                  "object"
                                    ? reportClient.clientId ||
                                      reportClient._id ||
                                      "—"
                                    : "—"}
                                </small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="table-date">
                              <CalendarDays
                                size={14}
                              />

                              <span>
                                {formatDate(
                                  report.reportDate ||
                                    report.date ||
                                    report.createdAt
                                )}
                              </span>
                            </div>
                          </td>

                          <td>
                            <div className="submitted-by">
                              <UserRound
                                size={14}
                              />

                              <span>
                                {getStaffName(
                                  report.staff
                                )}
                              </span>
                            </div>
                          </td>

                          <td>
                            <StatusBadge
                              status={
                                report.status ||
                                "Submitted"
                              }
                            />
                          </td>

                          <td>
                            <button
                              className="outline small"
                              onClick={() =>
                                setSelectedReport(
                                  report
                                )
                              }
                            >
                              View Report
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* =====================================================
          REPORT DETAILS MODAL
      ====================================================== */}

      {selectedReport && (
        <ReportDetailsModal
          report={
            selectedReport
          }
          reportType={
            reportType
          }
          onClose={() =>
            setSelectedReport(null)
          }
          getClientName={
            getClientName
          }
          getStaffName={
            getStaffName
          }
          formatDate={
            formatDate
          }
          formatDisplayValue={
            formatDisplayValue
          }
        />
      )}
    </div>
  );
}

/*
 * =========================================================
 * SUMMARY CARD
 * =========================================================
 */

function SummaryCard({
  icon,
  label,
  value,
}) {
  return (
    <div className="report-summary-card">
      <span>
        {icon}
      </span>

      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

/*
 * =========================================================
 * STATUS
 * =========================================================
 */

function StatusBadge({ status }) {
  const safeStatus =
    typeof status === "string"
      ? status
      : "Submitted";

  const normalized =
    safeStatus.toLowerCase();

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
    <span
      className={`report-status ${type}`}
    >
      <i />
      {safeStatus}
    </span>
  );
}

/*
 * =========================================================
 * REPORT DETAILS MODAL
 * =========================================================
 */

function ReportDetailsModal({
  report,
  reportType,
  onClose,
  getClientName,
  getStaffName,
  formatDate,
  formatDisplayValue,
}) {
  const reportClient =
    report.client;

  const clientName =
    getClientName(
      reportClient
    );

  const staffName =
    getStaffName(
      report.staff
    );

  const bloodPressure =
    report.bloodPressure &&
    typeof report.bloodPressure ===
      "object"
      ? [
          report.bloodPressure
            .systolic,
          report.bloodPressure
            .diastolic,
        ]
          .filter(Boolean)
          .join(" / ")
      : report.bloodPressure;

  return (
    <div
      className="report-modal-backdrop"
      onMouseDown={(e) => {
        if (
          e.target ===
          e.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div className="report-modal">
        {/* Header */}

        <div className="report-modal-head">
          <div>
            <span className="eyebrow">
              GENERATED REPORT
            </span>

            <h2>
              {clientName}
            </h2>

            <p>
              {reportType} •{" "}
              {formatDate(
                report.reportDate ||
                  report.date ||
                  report.createdAt
              )}
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
          {/* Report information */}

          <div className="modal-section">
            <h3>
              <FileText size={16} />
              Report Information
            </h3>

            <div className="modal-info-grid">
              <Info
                label="Report Type"
                value={reportType}
              />

              <Info
                label="Report Date"
                value={formatDate(
                  report.reportDate ||
                    report.date ||
                    report.createdAt
                )}
              />

              <Info
                label="Staff Member"
                value={staffName}
              />

              <Info
                label="Staff ID"
                value={
                  typeof report.staff ===
                  "object"
                    ? report.staff?._id
                    : report.staff
                }
              />

              <Info
                label="Client"
                value={clientName}
              />

              <Info
                label="Client ID"
                value={
                  typeof report.client ===
                  "object"
                    ? report.client?.clientId ||
                      report.client?._id
                    : report.client
                }
              />

              <Info
                label="Status"
                value={
                  report.status ||
                  "Submitted"
                }
              />
            </div>
          </div>

          {/* Daily care */}

          <div className="modal-section">
            <h3>
              <ClipboardList size={16} />
              Daily Care
            </h3>

            <div className="modal-info-grid">
              <Info
                label="Medication"
                value={
                  report.medication
                }
              />

              <Info
                label="Meal Given"
                value={
                  report.mealGiven
                }
              />

              <Info
                label="Bath Time"
                value={
                  report.bathTime
                }
              />

              <Info
                label="Bedtime"
                value={
                  report.bedtime
                }
              />

              <Info
                label="Temperature"
                value={
                  report.temperature ||
                  report.temperatureEntry?.temperature
                }
              />

              <Info
                label="Blood Pressure"
                value={
                  bloodPressure
                }
              />

              <Info
                label="Cleaning Done"
                value={
                  report.cleaningDone
                }
              />

              <Info
                label="Bedroom Check"
                value={
                  report.bedroomCheck
                }
              />

              <Info
                label="Finances"
                value={
                  report.finances
                }
              />

              <Info
                label="Keywork Session"
                value={
                  report.keyworkSession
                }
              />

              <Info
                label="Fridge / Freezer Temperature"
                value={
                  report.fridgeFreezerTemp
                }
              />
            </div>
          </div>

          {/* Incident */}

          {report.incident && (
            <div className="modal-section">
              <h3>
                <AlertCircle size={16} />
                Incident
              </h3>

              <div className="modal-info-grid">
                <Info
                  label="Incident"
                  value={
                    report.incident
                  }
                />
              </div>
            </div>
          )}

          {/* Behaviour */}

          {report.behaviour && (
            <div className="modal-section">
              <h3>
                <ClipboardList size={16} />
                Behaviour
              </h3>

              <div className="modal-info-grid">
                <Info
                  label="Behaviour Record"
                  value={
                    report.behaviour
                  }
                />
              </div>
            </div>
          )}

          {/* Comfort */}

          {report.comfortCheck && (
            <div className="modal-section">
              <h3>
                <CheckCircle2 size={16} />
                Comfort Check
              </h3>

              <div className="modal-info-grid">
                <Info
                  label="Comfort Check"
                  value={
                    report.comfortCheck
                  }
                />
              </div>
            </div>
          )}

          {/* Blood sugar */}

          {report.bloodSugar && (
            <div className="modal-section">
              <h3>
                <FileText size={16} />
                Blood Sugar
              </h3>

              <div className="modal-info-grid">
                <Info
                  label="Blood Sugar"
                  value={
                    report.bloodSugar
                  }
                />
              </div>
            </div>
          )}

          {/* Notes */}

          <div className="modal-section">
            <h3>
              <FileText size={16} />
              Notes
            </h3>

            <div className="modal-notes">
              <Info
                label="Case Note"
                value={
                  report.caseNote
                }
              />

              <Info
                label="Notes"
                value={
                  report.notes ||
                  report.comments
                }
              />
            </div>
          </div>

          {/* Footer */}

          <div className="modal-actions">
            <button
              className="outline"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * =========================================================
 * INFO
 * =========================================================
 */

function Info({
  label,
  value,
}) {
  return (
    <div className="modal-info">
      <small>{label}</small>

      <b>
        {formatValue(value) || "—"}
      </b>
    </div>
  );
}

function formatValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "";
  }

  if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        formatValue(item)
      )
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([key, itemValue]) => {
        return (
          key !== "_id" &&
          itemValue !== null &&
          itemValue !== undefined &&
          itemValue !== ""
        );
      })
      .map(([key, itemValue]) => {
        const formatted =
          formatValue(itemValue);

        if (!formatted) {
          return "";
        }

        return `${formatLabel(key)}: ${formatted}`;
      })
      .filter(Boolean)
      .join(" • ");
  }

  return String(value);
}

function formatLabel(value = "") {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) =>
      char.toUpperCase()
    )
    .trim();
}

/*
 * =========================================================
 * INITIALS
 * =========================================================
 */

function getInitials(name = "") {
  if (typeof name !== "string") {
    return "?";
  }

  const cleanName =
    name.trim();

  if (!cleanName) {
    return "?";
  }

  return cleanName
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default GenerateReport;
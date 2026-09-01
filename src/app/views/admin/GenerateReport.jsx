import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { useData } from "../../../context/DataContext.jsx";

import "./GenerateReport.css";

function GenerateReport() {
  const nav = useNavigate();
  const { data, setData } = useData();

  const [reportType, setReportType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [client, setClient] = useState("");
  const [staffMember, setStaffMember] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reportType || !startDate || !endDate) {
      setMessage("Please complete the required fields.");
      return;
    }

    const selectedClient = data.clients.find(
      (item) => item.id === client
    );

    const selectedStaff = data.staff.find(
      (item) => item.id === staffMember
    );

    const newReport = {
      id: `RP-${String(data.reports.length + 1).padStart(3, "0")}`,

      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),

      by: selectedStaff ? selectedStaff.name : "Admin",

      type: reportType,

      status: "Submitted",

      startDate,

      endDate,

      client: selectedClient
        ? selectedClient.name
        : "All Clients",

      clientId: client || null,

      staffMember: selectedStaff
        ? selectedStaff.name
        : "Admin",

      staffId: staffMember || null,

      notes,
    };

    setData({
      ...data,
      reports: [newReport, ...(data.reports || [])],
    });

    setMessage("Report generated successfully.");

    setTimeout(() => {
      nav("/reports");
    }, 800);
  };

  return (
    <div className="generate-report-page">



      <section className="form-card">

        <div className="section-title">
          <div>
            <span className="eyebrow">REPORTS</span>
            <h2>Create New Report</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* Report Type */}
            <label>
              <span>Report Type</span>

              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                required
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

            {/* Start Date */}
            <label>
              <span>Start Date</span>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </label>

            {/* End Date */}
            <label>
              <span>End Date</span>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </label>

            {/* Client */}
            <label>
              <span>Client</span>

              <select
                value={client}
                onChange={(e) => setClient(e.target.value)}
              >
                <option value="">
                  All Clients
                </option>

                {data.clients?.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Staff */}
            <label>
              <span>Staff Member</span>

              <select
                value={staffMember}
                onChange={(e) => setStaffMember(e.target.value)}
              >
                <option value="">
                  Select staff member
                </option>

                {data.staff?.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Notes */}
            <label className="wide">
              <span>Report Notes</span>

              <textarea
                placeholder="Enter any additional notes for this report..."
                rows="5"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>

          </div>

          {/* Message */}
          {message && (
            <div className="form-success">
              {message}
            </div>
          )}

          {/* Footer */}
          <div className="form-footer">

            <button
              type="button"
              className="outline"
              onClick={() => nav("/reports")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary"
            >
              <FileText size={15} />
              Generate Report
            </button>

          </div>

        </form>

      </section>

      {/* Back Link */}
      <button
        className="back-link"
        onClick={() => nav("/reports")}
      >
        ← Back to Reports
      </button>

    </div>
  );
}

export default GenerateReport;
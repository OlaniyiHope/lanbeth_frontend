import React from "react";
import { CalendarDays, Eye } from "lucide-react";

const expiryDocuments = [
  {
    client: "John Doe",
    document: "Identity Document",
    expiryDate: "04 Jan 2026",
    daysLeft: "Expired",
    status: "Expired",
  },
  {
    client: "Emily Smith",
    document: "Care Plan",
    expiryDate: "22 Aug 2026",
    daysLeft: "4 days",
    status: "Expiring Soon",
  },
  {
    client: "Michael Brown",
    document: "Medical Record",
    expiryDate: "02 Sep 2026",
    daysLeft: "15 days",
    status: "Expiring Soon",
  },
];

const ExpiryDocuments = ({ nav }) => {
  return (
    <div className="expiry-page">
      {/* Page Header */}
      <div className="page-head">
        <div className="page-head-content">
          <div className="eyebrow">LANBETHCARE</div>

          <h1>Expiry Document Alert</h1>

          <p>
            Documents approaching or past their expiry date.
          </p>
        </div>

        <div className="head-actions">
          <button
            className="icon-btn"
            title="Expiry Documents"
          >
            <CalendarDays size={16} />
          </button>
        </div>
      </div>

      {/* Documents Card */}
      <section className="section-card">
        <div className="section-title">
          <div>
            <span className="eyebrow">DOCUMENT ALERTS</span>

            <h2>Documents Requiring Attention</h2>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Document</th>
                <th>Expiry Date</th>
                <th>Days Left</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {expiryDocuments.map((document) => (
                <tr
                  key={`${document.client}-${document.document}`}
                >
                  {/* Client */}
                  <td>
                    <div className="client-table-info">
                      <div className="client-avatar">
                        {document.client
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </div>

                      <div>
                        <strong>{document.client}</strong>
                      </div>
                    </div>
                  </td>

                  {/* Document */}
                  <td>{document.document}</td>

                  {/* Expiry Date */}
                  <td>{document.expiryDate}</td>

                  {/* Days Left */}
                  <td>
                    <span
                      className={
                        document.status === "Expired"
                          ? "days-left expired"
                          : "days-left warning"
                      }
                    >
                      {document.daysLeft}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`status ${document.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      <i />
                      {document.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td>
                    <button
                      className="table-link"
                      onClick={() => {
                        if (nav) {
                          nav("/client-documents");
                        }
                      }}
                    >
                      <Eye size={13} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ExpiryDocuments;
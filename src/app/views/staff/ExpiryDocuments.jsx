import { useMemo, useState } from "react";
import {
  Search,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UploadCloud,
  Eye,
  RefreshCw,
  X,
  CalendarDays,
} from "lucide-react";

import "./ExpiryDocuments.css";

const INITIAL_DOCUMENTS = [
  {
    id: 1,
    name: "NIN / National ID",
    type: "Identity Document",
    documentNumber: "NIN-****-4821",
    expiryDate: "2027-04-15",
    uploadedDate: "2025-04-15",
    fileName: "emily-nin.pdf",
  },
  {
    id: 2,
    name: "Voters Card",
    type: "Identity Document",
    documentNumber: "VC-****-1928",
    expiryDate: "2027-08-30",
    uploadedDate: "2025-08-30",
    fileName: "voters-card.pdf",
  },
  {
    id: 3,
    name: "Work Permit",
    type: "Employment Document",
    documentNumber: "WP-2025-1547",
    expiryDate: "2026-10-20",
    uploadedDate: "2025-10-20",
    fileName: "work-permit.pdf",
  },
  {
    id: 4,
    name: "First Aid Certificate",
    type: "Training Certificate",
    documentNumber: "FA-2025-8831",
    expiryDate: "2026-09-12",
    uploadedDate: "2025-09-12",
    fileName: "first-aid-certificate.pdf",
  },
  {
    id: 5,
    name: "Care Training Certificate",
    type: "Training Certificate",
    documentNumber: "CT-2025-7712",
    expiryDate: "2026-09-02",
    uploadedDate: "2025-09-02",
    fileName: "care-training.pdf",
  },
  {
    id: 6,
    name: "Safeguarding Certificate",
    type: "Training Certificate",
    documentNumber: "SG-2025-6621",
    expiryDate: "2026-08-27",
    uploadedDate: "2025-08-27",
    fileName: "safeguarding.pdf",
  },
  {
    id: 7,
    name: "DBS Certificate",
    type: "Compliance Document",
    documentNumber: "DBS-2025-1182",
    expiryDate: "2026-12-18",
    uploadedDate: "2025-12-18",
    fileName: "dbs-certificate.pdf",
  },
];

function ExpiryDocuments() {
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [renewDocument, setRenewDocument] = useState(null);

  const getStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const difference = expiry.getTime() - today.getTime();

    const days = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    if (days < 0) {
      return {
        status: "Expired",
        days,
      };
    }

    if (days <= 30) {
      return {
        status: "Expiring Soon",
        days,
      };
    }

    return {
      status: "Valid",
      days,
    };
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const expiry = getStatus(document.expiryDate);

      const matchesSearch = `
        ${document.name}
        ${document.type}
        ${document.documentNumber}
      `
        .toLowerCase()
        .includes(search.toLowerCase());

      let matchesFilter = true;

      if (filter === "Expired") {
        matchesFilter = expiry.status === "Expired";
      }

      if (filter === "Expiring Soon") {
        matchesFilter = expiry.status === "Expiring Soon";
      }

      if (filter === "Valid") {
        matchesFilter = expiry.status === "Valid";
      }

      return matchesSearch && matchesFilter;
    });
  }, [documents, search, filter]);

  const expiredCount = documents.filter(
    (document) =>
      getStatus(document.expiryDate).status === "Expired"
  ).length;

  const expiringCount = documents.filter(
    (document) =>
      getStatus(document.expiryDate).status === "Expiring Soon"
  ).length;

  const validCount = documents.filter(
    (document) =>
      getStatus(document.expiryDate).status === "Valid"
  ).length;

  const handleRenew = (id, file) => {
    if (!file) return;

    setDocuments((current) =>
      current.map((document) =>
        document.id === id
          ? {
              ...document,
              fileName: file.name,
              uploadedDate: new Date()
                .toISOString()
                .split("T")[0],
            }
          : document
      )
    );

    setRenewDocument(null);
  };

  return (
    <div className="expiry-documents-page">

      {/* PAGE HEADER */}

      <div className="page-head">
        <div>
          <div className="eyebrow">
            LANBETHCARE
          </div>

          <h1>
            Expiring Documents
          </h1>

          <p>
            Keep your staff documents up to date and renew
            documents before they expire.
          </p>
        </div>
      </div>

      {/* ALERT */}

      {expiringCount > 0 && (
        <div className="expiry-alert">

          <div className="expiry-alert-icon">
            <AlertTriangle size={19} />
          </div>

          <div className="expiry-alert-content">

            <strong>
              {expiringCount} document
              {expiringCount !== 1 ? "s" : ""} require
              {expiringCount === 1 ? "s" : ""} your attention.
            </strong>

            <p>
              Some of your documents will expire within
              the next 30 days. Please renew them before
              the expiry date.
            </p>

          </div>

        </div>
      )}

      {/* SUMMARY */}

      <div className="expiry-summary">

        <SummaryCard
          icon={<FileText size={20} />}
          label="Total Documents"
          value={documents.length}
        />

        <SummaryCard
          icon={<AlertTriangle size={20} />}
          label="Expiring Soon"
          value={expiringCount}
          type="warning"
        />

        <SummaryCard
          icon={<Clock size={20} />}
          label="Expired"
          value={expiredCount}
          type="danger"
        />

        <SummaryCard
          icon={<CheckCircle2 size={20} />}
          label="Valid"
          value={validCount}
          type="success"
        />

      </div>

      {/* TOOLBAR */}

      <div className="expiry-toolbar">

        <div className="expiry-search">

          <Search size={16} />

          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="expiry-filters">

          {[
            "All",
            "Expiring Soon",
            "Expired",
            "Valid",
          ].map((item) => (

            <button
              key={item}
              className={
                filter === item ? "active" : ""
              }
              onClick={() => setFilter(item)}
            >
              {item}
            </button>

          ))}

        </div>

      </div>

      {/* DOCUMENT LIST */}

      <section className="expiry-section">

        <div className="section-title">

          <div>

            <span className="eyebrow">
              DOCUMENT REGISTER
            </span>

            <h2>
              My Documents
            </h2>

          </div>

          <span className="expiry-count">
            {filteredDocuments.length} documents
          </span>

        </div>

        {filteredDocuments.length > 0 ? (

          <div className="expiry-list">

            {filteredDocuments.map((document) => {

              const expiry = getStatus(
                document.expiryDate
              );

              return (
                <DocumentRow
                  key={document.id}
                  document={document}
                  expiry={expiry}
                  onView={() =>
                    setSelectedDocument(document)
                  }
                  onRenew={() =>
                    setRenewDocument(document)
                  }
                />
              );

            })}

          </div>

        ) : (

          <div className="expiry-empty">

            <div className="expiry-empty-icon">
              <FileText size={24} />
            </div>

            <h3>
              No documents found
            </h3>

            <p>
              Try changing your search or filter.
            </p>

          </div>

        )}

      </section>

      <div className="watermark">
        LAMBETH RESOLUTION HOMECARE
      </div>

      {/* VIEW DOCUMENT MODAL */}

      {selectedDocument && (

        <DocumentModal
          document={selectedDocument}
          expiry={getStatus(
            selectedDocument.expiryDate
          )}
          onClose={() =>
            setSelectedDocument(null)
          }
          onRenew={() => {
            setSelectedDocument(null);
            setRenewDocument(selectedDocument);
          }}
        />

      )}

      {/* RENEW DOCUMENT MODAL */}

      {renewDocument && (

        <RenewModal
          document={renewDocument}
          onClose={() =>
            setRenewDocument(null)
          }
          onSubmit={(file) =>
            handleRenew(
              renewDocument.id,
              file
            )
          }
        />

      )}

    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  type = "",
}) {
  return (
    <div className="expiry-summary-card">

      <div
        className={`expiry-summary-icon ${type}`}
      >
        {icon}
      </div>

      <div>

        <small>
          {label}
        </small>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}

function DocumentRow({
  document,
  expiry,
  onView,
  onRenew,
}) {
  return (

    <div
      className={`document-expiry-row ${
        expiry.status === "Expired"
          ? "row-expired"
          : expiry.status === "Expiring Soon"
          ? "row-warning"
          : ""
      }`}
    >

      <div className="document-icon">
        <FileText size={19} />
      </div>

      <div className="document-main">

        <div className="document-heading">

          <div>

            <h3>
              {document.name}
            </h3>

            <div className="document-meta">

              <span>
                {document.type}
              </span>

              <span>
                {document.documentNumber}
              </span>

            </div>

          </div>

          <ExpiryBadge
            status={expiry.status}
          />

        </div>

        <div className="document-details">

          <div>
            <small>
              Expiry Date
            </small>

            <strong>
              {formatDate(
                document.expiryDate
              )}
            </strong>
          </div>

          <div>
            <small>
              Time Remaining
            </small>

            <strong
              className={
                expiry.status === "Expired"
                  ? "text-danger"
                  : expiry.status ===
                    "Expiring Soon"
                  ? "text-warning"
                  : ""
              }
            >
              {getRemainingText(
                expiry
              )}
            </strong>
          </div>

          <div>
            <small>
              Uploaded
            </small>

            <strong>
              {formatDate(
                document.uploadedDate
              )}
            </strong>
          </div>

        </div>

        <div className="document-actions">

          <button
            className="outline small"
            onClick={onView}
          >
            <Eye size={13} />
            View Details
          </button>

          {(expiry.status === "Expired" ||
            expiry.status === "Expiring Soon") && (

            <button
              className="renew-btn"
              onClick={onRenew}
            >
              <RefreshCw size={13} />
              Renew Document
            </button>

          )}

        </div>

      </div>

    </div>
  );
}

function ExpiryBadge({ status }) {
  return (
    <span
      className={`expiry-status ${status
        .toLowerCase()
        .replace(/\s/g, "-")}`}
    >
      <i />
      {status}
    </span>
  );
}

function getRemainingText(expiry) {
  if (expiry.status === "Expired") {
    const days = Math.abs(expiry.days);

    return days === 0
      ? "Expired today"
      : `Expired ${days} day${days === 1 ? "" : "s"} ago`;
  }

  if (expiry.days === 0) {
    return "Expires today";
  }

  if (expiry.days === 1) {
    return "1 day remaining";
  }

  return `${expiry.days} days remaining`;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}

function DocumentModal({
  document,
  expiry,
  onClose,
  onRenew,
}) {
  return (

    <div
      className="expiry-modal-backdrop"
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="expiry-modal">

        <div className="expiry-modal-header">

          <div className="expiry-modal-title">

            <div className="expiry-modal-icon">
              <FileText size={20} />
            </div>

            <div>

              <span className="eyebrow">
                STAFF DOCUMENT
              </span>

              <h2>
                {document.name}
              </h2>

            </div>

          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            <X size={17} />
          </button>

        </div>

        <div className="expiry-modal-body">

          <div className="modal-status">

            <ExpiryBadge
              status={expiry.status}
            />

            <span>
              {getRemainingText(expiry)}
            </span>

          </div>

          <div className="document-info-grid">

            <Info
              label="Document Type"
              value={document.type}
            />

            <Info
              label="Document Number"
              value={document.documentNumber}
            />

            <Info
              label="Uploaded Date"
              value={formatDate(
                document.uploadedDate
              )}
            />

            <Info
              label="Expiry Date"
              value={formatDate(
                document.expiryDate
              )}
            />

            <Info
              label="Current File"
              value={document.fileName}
              wide
            />

          </div>

          <div className="expiry-date-box">

            <CalendarDays size={19} />

            <div>

              <small>
                Document Expiry Date
              </small>

              <strong>
                {formatDate(
                  document.expiryDate
                )}
              </strong>

              <span>
                {getRemainingText(expiry)}
              </span>

            </div>

          </div>

        </div>

        <div className="expiry-modal-footer">

          <button
            className="outline"
            onClick={onClose}
          >
            Close
          </button>

          {(expiry.status === "Expired" ||
            expiry.status ===
              "Expiring Soon") && (

            <button
              className="primary"
              onClick={onRenew}
            >
              <RefreshCw size={15} />
              Renew Document
            </button>

          )}

        </div>

      </div>

    </div>
  );
}

function RenewModal({
  document,
  onClose,
  onSubmit,
}) {
  const [file, setFile] = useState(null);

  const submit = (e) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    onSubmit(file);
  };

  return (

    <div
      className="expiry-modal-backdrop"
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="expiry-modal renewal-modal">

        <div className="expiry-modal-header">

          <div className="expiry-modal-title">

            <div className="expiry-modal-icon">
              <RefreshCw size={20} />
            </div>

            <div>

              <span className="eyebrow">
                DOCUMENT RENEWAL
              </span>

              <h2>
                Renew {document.name}
              </h2>

            </div>

          </div>

          <button
            className="modal-close"
            onClick={onClose}
          >
            <X size={17} />
          </button>

        </div>

        <form onSubmit={submit}>

          <div className="expiry-modal-body">

            <p className="renew-description">
              Upload your new or renewed
              <strong> {document.name}</strong>.
              The new document will replace the
              existing file.
            </p>

            <label className="renew-upload">

              <UploadCloud size={24} />

              <strong>
                {file
                  ? file.name
                  : "Upload renewed document"}
              </strong>

              <span>
                Click to browse your device
              </span>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  setFile(
                    e.target.files?.[0] ||
                      null
                  )
                }
              />

            </label>

            {file && (

              <div className="selected-file">

                <FileText size={15} />

                <span>
                  {file.name}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setFile(null)
                  }
                >
                  <X size={14} />
                </button>

              </div>

            )}

            <div className="renew-warning">

              <AlertTriangle size={16} />

              <span>
                Make sure the uploaded document
                is clear, valid and belongs to you.
              </span>

            </div>

          </div>

          <div className="expiry-modal-footer">

            <button
              type="button"
              className="outline"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary"
              disabled={!file}
            >
              <UploadCloud size={15} />
              Upload Renewal
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

function Info({
  label,
  value,
  wide,
}) {
  return (
    <div
      className={`document-info ${
        wide ? "wide" : ""
      }`}
    >
      <small>
        {label}
      </small>

      <strong>
        {value || "—"}
      </strong>
    </div>
  );
}

export default ExpiryDocuments;
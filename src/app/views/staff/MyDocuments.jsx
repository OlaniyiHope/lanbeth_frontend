import { useMemo, useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  Eye,
  Trash2,
  Search,
  Plus,
  CalendarDays,
  ShieldCheck,
  AlertTriangle,
  Clock3,
  X,
} from "lucide-react";

import "./MyDocuments.css";

const DOCUMENT_TYPES = [
  "NIN",
  "Voter's Card",
  "International Passport",
  "Driver's License",
  "Work Permit",
  "Residence Permit",
  "Training Certificate",
  "First Aid Certificate",
  "DBS Certificate",
  "Medical Certificate",
  "Care Certificate",
  "Other",
];

const initialDocuments = [
  {
    id: 1,
    type: "NIN",
    name: "NIN Document.pdf",
    uploadedDate: "12 January 2025",
    expiryDate: "",
    status: "Valid",
    size: "1.2 MB",
  },
  {
    id: 2,
    type: "Voter's Card",
    name: "Voters Card.pdf",
    uploadedDate: "15 January 2025",
    expiryDate: "",
    status: "Valid",
    size: "840 KB",
  },
  {
    id: 3,
    type: "Training Certificate",
    name: "Care Training Certificate.pdf",
    uploadedDate: "20 February 2025",
    expiryDate: "20 February 2027",
    status: "Valid",
    size: "2.1 MB",
  },
  {
    id: 4,
    type: "First Aid Certificate",
    name: "First Aid Certificate.pdf",
    uploadedDate: "10 March 2025",
    expiryDate: "10 March 2026",
    status: "Expired",
    size: "1.4 MB",
  },
];

function MyDocuments() {
  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState(initialDocuments);
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const [form, setForm] = useState({
    type: "",
    expiryDate: "",
    file: null,
  });

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const value = `
        ${document.type}
        ${document.name}
        ${document.status}
        ${document.uploadedDate}
        ${document.expiryDate}
      `.toLowerCase();

      return value.includes(search.toLowerCase());
    });
  }, [documents, search]);

  const validCount = documents.filter(
    (document) => document.status === "Valid"
  ).length;

  const expiredCount = documents.filter(
    (document) => document.status === "Expired"
  ).length;

  const expiringCount = documents.filter(
    (document) => document.status === "Expiring Soon"
  ).length;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF document.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      file,
    }));
  };

  const handleUpload = (e) => {
    e.preventDefault();

    if (!form.type) {
      alert("Please select a document type.");
      return;
    }

    if (!form.file) {
      alert("Please select a document.");
      return;
    }

    const newDocument = {
      id: Date.now(),
      type: form.type,
      name: form.file.name,
      uploadedDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      expiryDate: form.expiryDate
        ? new Date(form.expiryDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
        : "",
      status: getDocumentStatus(form.expiryDate),
      size: formatFileSize(form.file.size),
      url: URL.createObjectURL(form.file),
    };

    setDocuments((prev) => [newDocument, ...prev]);

    setForm({
      type: "",
      expiryDate: "",
      file: null,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setShowUpload(false);
  };

  const removeDocument = (id) => {
    const document = documents.find((item) => item.id === id);

    if (document?.url) {
      URL.revokeObjectURL(document.url);
    }

    setDocuments((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="staff-documents-page">

      {/* HEADER */}

      <div className="page-head">
        <div>
          <div className="eyebrow">LANBETHCARE</div>

          <h1>My Documents</h1>

          <p>
            Upload and manage your personal and employment documents.
          </p>
        </div>

        <button
          className="primary"
          onClick={() => setShowUpload(true)}
        >
          <Plus size={15} />
          Upload Document
        </button>
      </div>


      {/* SUMMARY */}

      <div className="document-summary">

        <div className="document-summary-card">

          <div className="summary-icon">
            <FileText size={19} />
          </div>

          <div>
            <small>Total Documents</small>
            <strong>{documents.length}</strong>
          </div>

        </div>


        <div className="document-summary-card">

          <div className="summary-icon valid">
            <ShieldCheck size={19} />
          </div>

          <div>
            <small>Valid</small>
            <strong className="valid-number">
              {validCount}
            </strong>
          </div>

        </div>


        <div className="document-summary-card">

          <div className="summary-icon warning">
            <Clock3 size={19} />
          </div>

          <div>
            <small>Expiring Soon</small>
            <strong className="warning-number">
              {expiringCount}
            </strong>
          </div>

        </div>


        <div className="document-summary-card">

          <div className="summary-icon danger">
            <AlertTriangle size={19} />
          </div>

          <div>
            <small>Expired</small>
            <strong className="danger-number">
              {expiredCount}
            </strong>
          </div>

        </div>

      </div>


      {/* TOOLBAR */}

      <div className="documents-toolbar">

        <div className="document-search">

          <Search size={16} />

          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>


        <button
          className="outline"
          onClick={() => setShowUpload(true)}
        >
          <UploadCloud size={15} />
          Upload New
        </button>

      </div>


      {/* DOCUMENT LIST */}

      <section className="documents-card">

        <div className="documents-card-head">

          <div>
            <span className="eyebrow">
              STAFF RECORDS
            </span>

            <h2>
              My Documents
            </h2>
          </div>

          <span className="document-count">
            {filteredDocuments.length} documents
          </span>

        </div>


        {filteredDocuments.length > 0 ? (

          <div className="document-list">

            {filteredDocuments.map((document) => (

              <div
                className="document-row"
                key={document.id}
              >

                <div className="document-file-icon">
                  <FileText size={20} />
                </div>


                <div className="document-main">

                  <strong>
                    {document.name}
                  </strong>

                  <span>
                    {document.type}
                  </span>

                </div>


                <div className="document-meta">

                  <small>
                    Uploaded
                  </small>

                  <strong>
                    {document.uploadedDate}
                  </strong>

                </div>


                <div className="document-meta">

                  <small>
                    Expiry Date
                  </small>

                  <strong>
                    {document.expiryDate || "No expiry"}
                  </strong>

                </div>


                <DocumentStatus
                  status={document.status}
                />


                <div className="document-actions">

                  {document.url && (

                    <a
                      href={document.url}
                      target="_blank"
                      rel="noreferrer"
                      className="document-action view"
                    >
                      <Eye size={15} />
                      View
                    </a>

                  )}

                  <button
                    className="document-action delete"
                    onClick={() =>
                      removeDocument(document.id)
                    }
                    title="Delete document"
                  >
                    <Trash2 size={15} />
                  </button>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="empty-documents">

            <div className="empty-document-icon">
              <FileText size={25} />
            </div>

            <h3>
              No documents found
            </h3>

            <p>
              Upload your NIN, Voter's Card, certificates,
              permits, and other required documents.
            </p>

            <button
              className="primary"
              onClick={() => setShowUpload(true)}
            >
              <UploadCloud size={15} />
              Upload Document
            </button>

          </div>

        )}

      </section>


      {/* REQUIRED DOCUMENTS */}

      <section className="required-documents">

        <div className="section-title">

          <div>
            <span className="eyebrow">
              DOCUMENT CHECKLIST
            </span>

            <h2>
              Recommended Staff Documents
            </h2>
          </div>

        </div>


        <div className="required-grid">

          {[
            "NIN",
            "Voter's Card",
            "Training Certificate",
            "First Aid Certificate",
            "DBS Certificate",
            "Medical Certificate",
          ].map((type) => {

            const uploaded = documents.some(
              (document) =>
                document.type === type
            );

            return (

              <div
                className={`required-item ${
                  uploaded ? "uploaded" : ""
                }`}
                key={type}
              >

                <span>
                  {uploaded ? (
                    <ShieldCheck size={16} />
                  ) : (
                    <FileText size={16} />
                  )}
                </span>

                <div>

                  <strong>
                    {type}
                  </strong>

                  <small>
                    {uploaded
                      ? "Document uploaded"
                      : "Document required"}
                  </small>

                </div>

                {!uploaded && (

                  <button
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        type,
                      }));

                      setShowUpload(true);
                    }}
                  >
                    Upload
                  </button>

                )}

              </div>

            );
          })}

        </div>

      </section>


      {/* WATERMARK */}

      <div className="watermark">
        LAMBETH RESOLUTION HOMECARE
      </div>


      {/* UPLOAD MODAL */}

      {showUpload && (

        <div
          className="document-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowUpload(false);
            }
          }}
        >

          <div className="document-modal">

            <div className="document-modal-head">

              <div>

                <span className="eyebrow">
                  STAFF DOCUMENTS
                </span>

                <h2>
                  Upload Document
                </h2>

              </div>

              <button
                className="icon-btn"
                onClick={() =>
                  setShowUpload(false)
                }
              >
                <X size={17} />
              </button>

            </div>


            <form
              className="document-upload-form"
              onSubmit={handleUpload}
            >

              <label className="document-field">

                <span>
                  Document Type
                </span>

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value,
                    })
                  }
                >

                  <option value="">
                    Select document type
                  </option>

                  {DOCUMENT_TYPES.map((type) => (

                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>

                  ))}

                </select>

              </label>


              <label className="document-field">

                <span>
                  Expiry Date
                </span>

                <div className="input-with-icon">

                  <CalendarDays size={15} />

                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        expiryDate: e.target.value,
                      })
                    }
                  />

                </div>

                <small>
                  Leave empty if the document does not expire.
                </small>

              </label>


              <div className="document-field">

                <span>
                  Document
                </span>

                <label className="upload-drop">

                  <UploadCloud size={21} />

                  <strong>
                    {form.file
                      ? form.file.name
                      : "Upload PDF document"}
                  </strong>

                  <small>
                    PDF files only
                  </small>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                  />

                </label>

              </div>


              <div className="upload-form-actions">

                <button
                  type="button"
                  className="outline"
                  onClick={() =>
                    setShowUpload(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary"
                >
                  <UploadCloud size={15} />
                  Upload Document
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


function DocumentStatus({ status }) {

  const normalized =
    status?.toLowerCase().replace(/\s+/g, "-");

  return (

    <span
      className={`document-status ${normalized}`}
    >

      <i />

      {status}

    </span>

  );
}


function getDocumentStatus(expiryDate) {

  if (!expiryDate) {
    return "Valid";
  }

  const expiry = new Date(expiryDate);
  const today = new Date();

  expiry.setHours(23, 59, 59, 999);
  today.setHours(0, 0, 0, 0);

  if (expiry < today) {
    return "Expired";
  }

  const difference =
    expiry.getTime() - today.getTime();

  const days =
    difference / (1000 * 60 * 60 * 24);

  if (days <= 30) {
    return "Expiring Soon";
  }

  return "Valid";
}


function formatFileSize(bytes) {

  if (!bytes) return "0 KB";

  const kb = bytes / 1024;

  if (kb < 1024) {
    return `${Math.round(kb)} KB`;
  }

  return `${(kb / 1024).toFixed(1)} MB`;
}


export default MyDocuments;
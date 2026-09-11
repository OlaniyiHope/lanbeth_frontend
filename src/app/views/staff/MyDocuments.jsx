import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5001"
).replace(/\/$/, "") + "/api";

function MyDocuments() {
  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    type: "",
    expiryDate: "",
    file: null,
  });

  const getToken = () => {
    return localStorage.getItem("lanbeth-auth-token");
  };

  // =========================================================
  // FETCH MY DOCUMENTS
  // GET /api/staff/me/documents
  // =========================================================

const fetchDocuments = useCallback(async () => {
  const token = getToken();

  if (!token) {
    setError("Authentication token is missing.");
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    setError("");

    const response = await fetch(
      `${API_BASE_URL}/staff/me/documents`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let result = null;

    try {
      result = await response.json();
    } catch {
      result = null;
    }

    if (!response.ok) {
      throw new Error(
        result?.message ||
          result?.error ||
          `Failed to load documents (${response.status})`
      );
    }

    setDocuments(
      Array.isArray(result?.documents)
        ? result.documents
        : []
    );
  } catch (err) {
    console.error("Failed to load documents:", err);

    setError(
      err.message || "Unable to load your documents."
    );
  } finally {
    setLoading(false);
  }
}, []);
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredDocuments = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return documents;
    }

    return documents.filter((document) => {
      const value = `
        ${document.documentType || ""}
        ${document.fileName || ""}
        ${document.status || ""}
        ${formatDate(document.uploadedAt)}
        ${formatDate(document.expiryDate)}
      `.toLowerCase();

      return value.includes(searchValue);
    });
  }, [documents, search]);

  // =========================================================
  // SUMMARY
  // =========================================================

  const validCount = documents.filter(
    (document) => document.status === "Valid"
  ).length;

  const expiredCount = documents.filter(
    (document) => document.status === "Expired"
  ).length;

  const expiringCount = documents.filter(
    (document) => document.status === "Expiring Soon"
  ).length;

  // =========================================================
  // FILE SELECTION
  // =========================================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please upload a PDF document.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setForm((prev) => ({
        ...prev,
        file: null,
      }));

      return;
    }

    // Optional frontend size check.
    // Backend should also enforce its own limit.
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError("The PDF must be 10 MB or smaller.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setForm((prev) => ({
        ...prev,
        file: null,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      file,
    }));
  };

  // =========================================================
  // UPLOAD DOCUMENT
  // POST /api/staff/me/documents
  // =========================================================

  const handleUpload = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.type) {
      setError("Please select a document type.");
      return;
    }

    if (!form.file) {
      setError("Please select a PDF document.");
      return;
    }

    const token = getToken();

    if (!token) {
      setError("Authentication token is missing.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("documentType", form.type);

      if (form.expiryDate) {
        formData.append("expiryDate", form.expiryDate);
      }

      // IMPORTANT:
      // This must match upload.single("file") on the backend.
      formData.append("file", form.file);

      const response = await fetch(
        `${API_BASE_URL}/staff/me/documents`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      let result = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            `Upload failed (${response.status})`
        );
      }

      // Add the document returned by the backend immediately.
      if (result?.document) {
        setDocuments((prev) => [
          result.document,
          ...prev,
        ]);
      } else {
        // Fallback: reload from database.
        await fetchDocuments();
      }

      setForm({
        type: "",
        expiryDate: "",
        file: null,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setShowUpload(false);

      setSuccess(
        result?.message ||
          "Document uploaded successfully."
      );
    } catch (err) {
      console.error("Document upload failed:", err);

      setError(
        err.message ||
          "Unable to upload document."
      );
    } finally {
      setUploading(false);
    }
  };

  // =========================================================
  // DELETE DOCUMENT
  // DELETE /api/staff/me/documents/:documentId
  // =========================================================

  const removeDocument = async (documentId) => {
    if (!documentId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) return;

    const token = getToken();

    if (!token) {
      setError("Authentication token is missing.");
      return;
    }

    try {
      setDeletingId(documentId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE_URL}/staff/me/documents/${documentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let result = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            `Delete failed (${response.status})`
        );
      }

      // Remove from UI immediately after backend confirms.
      setDocuments((prev) =>
        prev.filter(
          (document) =>
            document._id !== documentId
        )
      );

      setSuccess(
        result?.message ||
          "Document deleted successfully."
      );
    } catch (err) {
      console.error("Failed to delete document:", err);

      setError(
        err.message ||
          "Unable to delete document."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeUploadModal = () => {
    if (uploading) return;

    setShowUpload(false);

    setForm({
      type: "",
      expiryDate: "",
      file: null,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================================================
  // OPEN UPLOAD FOR SPECIFIC DOCUMENT TYPE
  // =========================================================

  const openUploadForType = (type) => {
    setError("");
    setSuccess("");

    setForm({
      type,
      expiryDate: "",
      file: null,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setShowUpload(true);
  };

  return (
    <div className="staff-documents-page">

      {/* HEADER */}

      <div className="page-head">
        <div>
          <div className="eyebrow">
            LANBETHCARE
          </div>

          <h1>My Documents</h1>

          <p>
            Upload and manage your personal and
            employment documents.
          </p>
        </div>

        <button
          className="primary"
          onClick={() => {
            setError("");
            setSuccess("");
            setShowUpload(true);
          }}
          disabled={uploading}
        >
          <Plus size={15} />
          Upload Document
        </button>
      </div>

      {/* ALERTS */}

      {error && (
        <div className="document-alert error">
          <AlertTriangle size={17} />
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {success && (
        <div className="document-alert success">
          <ShieldCheck size={17} />
          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
          >
            <X size={15} />
          </button>
        </div>
      )}

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
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <button
          className="outline"
          onClick={() => {
            setError("");
            setSuccess("");
            setShowUpload(true);
          }}
          disabled={uploading}
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
            {filteredDocuments.length}{" "}
            {filteredDocuments.length === 1
              ? "document"
              : "documents"}
          </span>

        </div>

        {loading ? (

          <div className="empty-documents">

            <div className="empty-document-icon">
              <FileText size={25} />
            </div>

            <h3>
              Loading documents...
            </h3>

            <p>
              Please wait while your documents
              are loaded.
            </p>

          </div>

        ) : filteredDocuments.length > 0 ? (

          <div className="document-list">

            {filteredDocuments.map((document) => (

              <div
                className="document-row"
                key={document._id}
              >

                <div className="document-file-icon">
                  <FileText size={20} />
                </div>

                <div className="document-main">

                  <strong>
                    {document.fileName ||
                      "Unnamed document"}
                  </strong>

                  <span>
                    {document.documentType ||
                      "Other"}
                  </span>

                </div>

                <div className="document-meta">

                  <small>
                    Uploaded
                  </small>

                  <strong>
                    {formatDate(
                      document.uploadedAt
                    )}
                  </strong>

                </div>

                <div className="document-meta">

                  <small>
                    Expiry Date
                  </small>

                  <strong>
                    {document.expiryDate
                      ? formatDate(
                          document.expiryDate
                        )
                      : "No expiry"}
                  </strong>

                </div>

                <DocumentStatus
                  status={
                    document.status || "Valid"
                  }
                />

                <div className="document-actions">

                  {document.fileUrl && (
                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="document-action view"
                    >
                      <Eye size={15} />
                      View
                    </a>
                  )}

                  <button
                    type="button"
                    className="document-action delete"
                    onClick={() =>
                      removeDocument(
                        document._id
                      )
                    }
                    disabled={
                      deletingId === document._id
                    }
                    title="Delete document"
                  >
                    {deletingId === document._id ? (
                      <span className="document-delete-loading">
                        ...
                      </span>
                    ) : (
                      <Trash2 size={15} />
                    )}
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
              {search
                ? "No documents found"
                : "No documents uploaded"}
            </h3>

            <p>
              {search
                ? "Try a different search term."
                : "Upload your personal and employment documents to keep your staff record up to date."}
            </p>

            {!search && (
              <button
                className="primary"
                onClick={() =>
                  setShowUpload(true)
                }
              >
                <UploadCloud size={15} />
                Upload Document
              </button>
            )}

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
                document.documentType === type
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
                    type="button"
                    onClick={() =>
                      openUploadForType(type)
                    }
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
            if (
              e.target === e.currentTarget &&
              !uploading
            ) {
              closeUploadModal();
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
                type="button"
                className="icon-btn"
                onClick={closeUploadModal}
                disabled={uploading}
              >
                <X size={17} />
              </button>

            </div>

            <form
              className="document-upload-form"
              onSubmit={handleUpload}
            >

              {/* DOCUMENT TYPE */}

              <label className="document-field">

                <span>
                  Document Type
                </span>

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  disabled={uploading}
                  required
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

              {/* EXPIRY DATE */}

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
                      setForm((prev) => ({
                        ...prev,
                        expiryDate:
                          e.target.value,
                      }))
                    }
                    disabled={uploading}
                  />

                </div>

                <small>
                  Leave empty if the document
                  does not expire.
                </small>

              </label>

              {/* FILE */}

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
                    PDF files only • Maximum 10 MB
                  </small>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />

                </label>

              </div>

              {/* ACTIONS */}

              <div className="upload-form-actions">

                <button
                  type="button"
                  className="outline"
                  onClick={closeUploadModal}
                  disabled={uploading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary"
                  disabled={uploading}
                >
                  <UploadCloud size={15} />

                  {uploading
                    ? "Uploading..."
                    : "Upload Document"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


// =========================================================
// DOCUMENT STATUS
// =========================================================

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


// =========================================================
// FORMAT DATE
// =========================================================

function formatDate(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}


export default MyDocuments;
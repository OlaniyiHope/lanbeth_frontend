import { useEffect, useRef, useState } from "react";
import {
  FileText,
  Upload,
  Search,
  X,
  Trash2,
  Eye,
  Download,
  FilePlus2,
  ChevronDown,
} from "lucide-react";

import "./PolicyLibrary.css";

export default function PolicyLibrary() {
  const [policies, setPolicies] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const [form, setForm] = useState({
    title: "",
    policyType: "Policy",
    description: "",
    file: null,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("upload") === "true") {
      setShowUploadModal(true);

      window.history.replaceState(
        {},
        "",
        window.location.pathname
      );
    }
  }, []);

  const policyTypes = [
    "Policy",
    "Procedure",
    "Guideline",
    "Protocol",
    "Other",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Please select a PDF document.");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("The maximum file size is 10MB.");
      e.target.value = "";
      return;
    }

    setForm((previous) => ({
      ...previous,
      file,
    }));
  };

  const removeSelectedFile = () => {
    setForm((previous) => ({
      ...previous,
      file: null,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);

    setForm({
      title: "",
      policyType: "Policy",
      description: "",
      file: null,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter a policy title.");
      return;
    }

    if (!form.file) {
      alert("Please select a PDF document.");
      return;
    }

    const newPolicy = {
      id: Date.now(),
      title: form.title.trim(),
      policyType: form.policyType,
      description: form.description.trim(),
      fileName: form.file.name,
      uploadedAt: new Date(),
    };

    setPolicies((previous) => [
      newPolicy,
      ...previous,
    ]);

    closeUploadModal();
  };

  const handleDelete = (policy) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${policy.title}"?`
    );

    if (!confirmed) return;

    setPolicies((previous) =>
      previous.filter((item) => item.id !== policy.id)
    );

    if (selectedPolicy?.id === policy.id) {
      setSelectedPolicy(null);
    }
  };

  const filteredPolicies = policies.filter((policy) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      policy.title.toLowerCase().includes(searchValue) ||
      policy.fileName.toLowerCase().includes(searchValue) ||
      policy.description.toLowerCase().includes(searchValue);

    const matchesType =
      typeFilter === "All" ||
      policy.policyType === typeFilter;

    return matchesSearch && matchesType;
  });

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="policy-library">

      {/* HEADER */}
      <div className="policy-library-header">
        <div>
          <span className="policy-eyebrow">
            POLICY MANAGEMENT
          </span>

          <h1>Policy Library</h1>

          <p>
            Manage company policies, procedures and
            guidance documents.
          </p>
        </div>

        <button
          type="button"
          className="policy-upload-btn"
          onClick={() => setShowUploadModal(true)}
        >
          <Upload size={18} />
          Upload Policy
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="policy-toolbar">

        <div className="policy-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search policies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="policy-filter">
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
          >
            <option value="All">All types</option>

            {policyTypes.map((type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            ))}
          </select>

          <ChevronDown size={16} />
        </div>
      </div>

      {/* SUMMARY */}
      <div className="policy-library-summary">
        <div>
          <strong>
            {filteredPolicies.length}
          </strong>

          <span>
            {filteredPolicies.length === 1
              ? " policy"
              : " policies"}
          </span>
        </div>

        <span className="policy-summary-label">
          Company Policy Library
        </span>
      </div>

      {/* EMPTY STATE */}
      {filteredPolicies.length === 0 && (
        <div className="policy-empty-state">

          <div className="policy-empty-icon">
            <FilePlus2 size={30} />
          </div>

          <h2>No policies found</h2>

          {policies.length === 0 ? (
            <>
              <p>
                There are currently no policies in
                the library. Upload your first policy
                document to get started.
              </p>

              <button
                type="button"
                className="policy-empty-upload"
                onClick={() =>
                  setShowUploadModal(true)
                }
              >
                <Upload size={17} />
                Upload First Policy
              </button>
            </>
          ) : (
            <p>
              Try changing your search or filter.
            </p>
          )}
        </div>
      )}

      {/* POLICY LIST */}
      {filteredPolicies.length > 0 && (
        <div className="policy-list">

          {filteredPolicies.map((policy) => (
            <div
              className="policy-card"
              key={policy.id}
            >

              <div className="policy-card-icon">
                <FileText size={25} />
              </div>

              <div className="policy-card-main">

                <div className="policy-card-title-row">
                  <h3>{policy.title}</h3>

                  <span className="policy-type-badge">
                    {policy.policyType}
                  </span>
                </div>

                <p className="policy-card-description">
                  {policy.description ||
                    "No description provided."}
                </p>

                <div className="policy-card-meta">
                  <span>
                    {policy.fileName}
                  </span>

                  <span>•</span>

                  <span>
                    Uploaded{" "}
                    {formatDate(
                      policy.uploadedAt
                    )}
                  </span>
                </div>
              </div>

              <div className="policy-card-actions">

                <button
                  type="button"
                  title="View policy"
                  onClick={() =>
                    setSelectedPolicy(policy)
                  }
                >
                  <Eye size={18} />
                </button>

                <button
                  type="button"
                  title="Download policy"
                  onClick={() =>
                    alert(
                      "Download will be connected to the secure document URL."
                    )
                  }
                >
                  <Download size={18} />
                </button>

                <button
                  type="button"
                  className="delete-action"
                  title="Delete policy"
                  onClick={() =>
                    handleDelete(policy)
                  }
                >
                  <Trash2 size={18} />
                </button>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div
          className="policy-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeUploadModal();
            }
          }}
        >
          <div className="policy-upload-modal">

            <div className="policy-modal-header">

              <div>
                <span className="policy-modal-eyebrow">
                  NEW DOCUMENT
                </span>

                <h2>Upload Policy</h2>

                <p>
                  Add a new policy or procedure to
                  the company library.
                </p>
              </div>

              <button
                type="button"
                className="policy-modal-close"
                onClick={closeUploadModal}
              >
                <X size={20} />
              </button>

            </div>

            <form onSubmit={handleUpload}>

              {/* TITLE */}
              <div className="policy-form-group">

                <label>
                  Policy Title
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Safeguarding Policy"
                  value={form.title}
                  onChange={handleInputChange}
                />

              </div>

              {/* TYPE */}
              <div className="policy-form-group">

                <label>
                  Document Type
                  <span>*</span>
                </label>

                <select
                  name="policyType"
                  value={form.policyType}
                  onChange={handleInputChange}
                >
                  {policyTypes.map((type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ))}
                </select>

              </div>

              {/* DESCRIPTION */}
              <div className="policy-form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  rows="4"
                  placeholder="Briefly describe what this policy covers..."
                  value={form.description}
                  onChange={handleInputChange}
                />

              </div>

              {/* FILE */}
              <div className="policy-form-group">

                <label>
                  Policy Document
                  <span>*</span>
                </label>

                {!form.file ? (
                  <div
                    className="policy-file-dropzone"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >

                    <div className="policy-file-icon">
                      <Upload size={24} />
                    </div>

                    <h4>
                      Click to upload PDF
                    </h4>

                    <p>
                      PDF files only • Maximum 10MB
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleFileChange}
                    />

                  </div>
                ) : (
                  <div className="policy-selected-file">

                    <div className="selected-file-left">

                      <div className="selected-file-icon">
                        <FileText size={22} />
                      </div>

                      <div>
                        <strong>
                          {form.file.name}
                        </strong>

                        <span>
                          {(
                            form.file.size /
                            1024 /
                            1024
                          ).toFixed(2)}{" "}
                          MB
                        </span>
                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={removeSelectedFile}
                      title="Remove file"
                    >
                      <X size={17} />
                    </button>

                  </div>
                )}

              </div>

              {/* FOOTER */}
              <div className="policy-modal-footer">

                <button
                  type="button"
                  className="policy-cancel-btn"
                  onClick={closeUploadModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="policy-submit-btn"
                >
                  <Upload size={17} />
                  Upload Policy
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {selectedPolicy && (
        <div
          className="policy-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedPolicy(null);
            }
          }}
        >

          <div className="policy-view-modal">

            <div className="policy-modal-header">

              <div>
                <span className="policy-modal-eyebrow">
                  {selectedPolicy.policyType}
                </span>

                <h2>
                  {selectedPolicy.title}
                </h2>
              </div>

              <button
                type="button"
                className="policy-modal-close"
                onClick={() =>
                  setSelectedPolicy(null)
                }
              >
                <X size={20} />
              </button>

            </div>

            <div className="policy-view-content">

              <div className="policy-view-file">

                <FileText size={30} />

                <div>
                  <strong>
                    {selectedPolicy.fileName}
                  </strong>

                  <span>
                    Uploaded{" "}
                    {formatDate(
                      selectedPolicy.uploadedAt
                    )}
                  </span>
                </div>

              </div>

              <div className="policy-view-description">

                <h4>Description</h4>

                <p>
                  {selectedPolicy.description ||
                    "No description provided."}
                </p>

              </div>

            </div>

            <div className="policy-modal-footer">

              <button
                type="button"
                className="policy-cancel-btn"
                onClick={() =>
                  setSelectedPolicy(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="policy-submit-btn"
                onClick={() =>
                  alert(
                    "Secure document viewing will be connected to S3."
                  )
                }
              >
                <Eye size={17} />
                Open Document
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
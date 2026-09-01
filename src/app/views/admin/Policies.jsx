import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  ShieldCheck,
  FileText,
  Eye,
  Pencil,
  Trash2,
  Download,
  X,
} from "lucide-react";

import { useData } from "../../../context/DataContext.jsx";
import AppTopbar from "../../../components/layout/AppTopbar";

export default function Policies() {
  const nav = useNavigate();
  const { data, setData } = useData();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [modal, setModal] = useState(null);

  const policies = data.policies || [];

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch = `
      ${policy.name}
      ${policy.type}
      ${policy.description}
      ${policy.id}
      ${policy.status}
    `
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesType =
      typeFilter === "All Types" ||
      policy.type === typeFilter;

    const matchesStatus =
      statusFilter === "All Status" ||
      policy.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const deletePolicy = (id) => {
    setData({
      ...data,
      policies: policies.filter(
        (policy) => policy.id !== id
      ),
    });

    setModal(null);
  };

  const updatePolicy = (updatedPolicy) => {
    setData({
      ...data,
      policies: policies.map((policy) =>
        policy.id === updatedPolicy.id
          ? updatedPolicy
          : policy
      ),
    });

    setModal(null);
  };

  return (
    <div className="policies-page">

      <AppTopbar
        title="Policy"
        sub="Manage homecare policies and procedures."
      />

      {/* Toolbar */}
      <div className="toolbar">

        <div className="search">
          <Search size={16} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search policies..."
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option>All Types</option>
          <option>Clinical</option>
          <option>Safeguarding</option>
          <option>Health & Safety</option>
          <option>HR</option>
          <option>Compliance</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Archived</option>
        </select>

        <button
          className="primary"
          onClick={() => nav("/upload-policy")}
        >
          <Plus size={15} />
          Add Policy
        </button>

      </div>

      {/* Policies */}
      <section className="section-card">

        <div className="section-title">

          <div>
            <span className="eyebrow">
              COMPLIANCE
            </span>

            <h2>
              Policies & Procedures
            </h2>
          </div>

          <span className="record-count">
            {filteredPolicies.length} policies
          </span>

        </div>

        <div className="policy-list">

          {filteredPolicies.length === 0 ? (

            <div className="empty-state">

              <ShieldCheck size={40} />

              <h3>
                No policies found
              </h3>

              <p>
                Try changing your search or add a new policy.
              </p>

              <button
                className="primary"
                onClick={() => nav("/upload-policy")}
              >
                <Plus size={15} />
                Add Policy
              </button>

            </div>

          ) : (

            filteredPolicies.map((policy) => (

              <div
                className="policy-item"
                key={policy.id}
              >

                <div className="policy-icon">
                  <FileText size={21} />
                </div>

                <div className="policy-main">

                  <div className="policy-name-row">

                    <b>
                      {policy.name}
                    </b>

                    <Status
                      status={policy.status}
                    />

                  </div>

                  <div className="policy-meta">

                    <span>
                      {policy.type}
                    </span>

                    <span>
                      Policy ID: {policy.id}
                    </span>

                    <span>
                      Review: {policy.reviewDate}
                    </span>

                  </div>

                  <p>
                    {policy.description}
                  </p>

                </div>

                <div className="policy-actions">

                  <button
                    className="outline small"
                    onClick={() =>
                      setModal({
                        type: "view",
                        item: policy,
                      })
                    }
                  >
                    <Eye size={13} />
                    View
                  </button>

                  <button
                    className="outline small"
                    onClick={() =>
                      setModal({
                        type: "edit",
                        item: policy,
                      })
                    }
                  >
                    <Pencil size={13} />
                    Edit
                  </button>

                  <button
                    className="danger-btn small"
                    onClick={() =>
                      setModal({
                        type: "delete",
                        item: policy,
                      })
                    }
                  >
                    <Trash2 size={13} />
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </section>

      {/* Modal */}
      {modal && (

        <Modal
          title={
            modal.type === "delete"
              ? "Delete Policy"
              : modal.type === "edit"
              ? "Edit Policy"
              : modal.item.name
          }
          onClose={() => setModal(null)}
        >

          {modal.type === "view" && (
            <PolicyDetail
              policy={modal.item}
            />
          )}

          {modal.type === "edit" && (
            <InlineEdit
              item={modal.item}
              fields={[
                "name",
                "type",
                "effectiveDate",
                "reviewDate",
                "status",
                "description",
              ]}
              onSave={updatePolicy}
            />
          )}

          {modal.type === "delete" && (
            <ConfirmDelete
              name={modal.item.name}
              onCancel={() => setModal(null)}
              onConfirm={() =>
                deletePolicy(modal.item.id)
              }
            />
          )}

        </Modal>

      )}

    </div>
  );
}


/* =========================
   POLICY DETAIL
========================= */

function PolicyDetail({ policy }) {
  return (
    <div className="policy-detail">

      <div className="policy-detail-header">

        <div className="policy-detail-icon">
          <ShieldCheck size={28} />
        </div>

        <div>

          <span className="eyebrow">
            POLICY DOCUMENT
          </span>

          <h2>
            {policy.name}
          </h2>

          <p>
            {policy.type} · {policy.id}
          </p>

        </div>

      </div>

      <div className="detail-grid">

        <Info
          label="Policy Type"
          value={policy.type}
        />

        <Info
          label="Status"
          value={policy.status}
        />

        <Info
          label="Effective Date"
          value={policy.effectiveDate || "—"}
        />

        <Info
          label="Review Date"
          value={policy.reviewDate || "—"}
        />

        <Info
          label="Uploaded"
          value={policy.uploaded || "—"}
        />

        <Info
          label="File"
          value={policy.fileName || "—"}
        />

      </div>

      <div className="policy-description">

        <small>
          Description
        </small>

        <p>
          {policy.description || "—"}
        </p>

      </div>

      <div className="policy-download">

        <div>

          <FileText size={18} />

          <div>

            <b>
              {policy.fileName || "Policy document"}
            </b>

            <small>
              Policy document
            </small>

          </div>

        </div>

        <button
          className="primary"
          onClick={() =>
            window.alert(
              `${policy.name} download prepared.`
            )
          }
        >
          <Download size={15} />
          Download
        </button>

      </div>

    </div>
  );
}


/* =========================
   STATUS
========================= */

function Status({ status }) {
  const normalizedStatus =
    status?.toLowerCase() || "inactive";

  return (
    <span
      className={`status ${normalizedStatus}`}
    >
      <i />
      {status}
    </span>
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
   INLINE EDIT
========================= */

function InlineEdit({
  item,
  fields,
  onSave,
}) {
  const [values, setValues] = useState({
    ...item,
  });

  const submit = (e) => {
    e.preventDefault();
    onSave(values);
  };

  return (
    <form
      className="inline-form"
      onSubmit={submit}
    >

      <div className="form-grid">

        {fields.map((field) => (

          <label key={field}>

            <span>
              {formatLabel(field)}
            </span>

            {field === "status" ? (

              <select
                value={values[field] || ""}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [field]: e.target.value,
                  })
                }
              >
                <option value="Active">
                  Active
                </option>

                <option value="Archived">
                  Archived
                </option>
              </select>

            ) : field === "type" ? (

              <select
                value={values[field] || ""}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [field]: e.target.value,
                  })
                }
              >
                <option value="Clinical">
                  Clinical
                </option>

                <option value="Safeguarding">
                  Safeguarding
                </option>

                <option value="Health & Safety">
                  Health & Safety
                </option>

                <option value="HR">
                  HR
                </option>

                <option value="Compliance">
                  Compliance
                </option>
              </select>

            ) : field === "description" ? (

              <textarea
                value={values[field] || ""}
                rows="5"
                onChange={(e) =>
                  setValues({
                    ...values,
                    [field]: e.target.value,
                  })
                }
              />

            ) : (

              <input
                type={
                  field === "effectiveDate" ||
                  field === "reviewDate"
                    ? "date"
                    : "text"
                }
                value={values[field] || ""}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [field]: e.target.value,
                  })
                }
              />

            )}

          </label>

        ))}

      </div>

      <button
        className="primary full"
        type="submit"
      >
        Save Changes
      </button>

    </form>
  );
}


/* =========================
   FORMAT LABEL
========================= */

function formatLabel(value) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) =>
      letter.toUpperCase()
    );
}


/* =========================
   DELETE CONFIRMATION
========================= */

function ConfirmDelete({
  name,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="confirm-delete">

      <div className="delete-icon">
        <Trash2 />
      </div>

      <h3>
        Delete this policy?
      </h3>

      <p>
        You are about to permanently delete{" "}
        <b>{name}</b>. This action cannot be undone.
      </p>

      <div className="confirm-actions">

        <button
          className="outline"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          className="danger-solid"
          onClick={onConfirm}
        >
          Delete
        </button>

      </div>

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
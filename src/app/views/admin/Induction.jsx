import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Users,
  GraduationCap,
} from "lucide-react";

import { useData } from "../../../context/DataContext.jsx";

import "./Induction.css";

function Induction() {
  const nav = useNavigate();
  const { data, setData } = useData();

  const [modal, setModal] = useState(null);

  const inductions = data.induction || [];

  const deleteInduction = (id) => {
    setData({
      ...data,
      induction: inductions.filter(
        (item) => item.id !== id
      ),
    });

    setModal(null);
  };

  const updateInduction = (updated) => {
    setData({
      ...data,
      induction: inductions.map((item) =>
        item.id === updated.id ? updated : item
      ),
    });

    setModal(null);
  };

  return (
    <div className="induction-page">

   

      {/* Summary */}
      <div className="induction-summary">

        <div className="induction-stat">
          <span className="induction-stat-icon">
            <Users size={18} />
          </span>

          <div>
            <small>Total Staff</small>
            <strong>{inductions.length}</strong>
          </div>
        </div>

        <div className="induction-stat">
          <span className="induction-stat-icon">
            <GraduationCap size={18} />
          </span>

          <div>
            <small>Completed</small>
            <strong>
              {
                inductions.filter(
                  (item) =>
                    item.status === "Completed"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="induction-stat">
          <span className="induction-stat-icon">
            <GraduationCap size={18} />
          </span>

          <div>
            <small>In Progress</small>
            <strong>
              {
                inductions.filter(
                  (item) =>
                    item.status === "In Progress"
                ).length
              }
            </strong>
          </div>
        </div>

      </div>

      {/* Main Card */}
      <section className="section-card">

        <div className="section-title">

          <div>
            <span className="eyebrow">
              PEOPLE & TRAINING
            </span>

            <h2>Inducted Staff</h2>

            <p>
              Track staff induction progress, training
              requirements and completion status.
            </p>
          </div>

          <button
            className="primary"
            onClick={() =>
              nav("/add-induction")
            }
          >
            <Plus size={14} />
            Add New Staff Induction
          </button>

        </div>

        {/* Empty State */}
        {inductions.length === 0 ? (

          <div className="induction-empty">

            <div className="induction-empty-icon">
              <GraduationCap size={26} />
            </div>

            <h3>No induction records</h3>

            <p>
              There are currently no staff induction
              records available.
            </p>

            <button
              className="primary"
              onClick={() =>
                nav("/add-induction")
              }
            >
              <Plus size={14} />
              Add New Staff Induction
            </button>

          </div>

        ) : (

          <div className="table-wrap induction-table-wrap">

            <table className="induction-table">

              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Position</th>
                  <th>Start Date</th>
                  <th>Induction Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {inductions.map((item) => (

                  <tr key={item.id}>

                    <td>
                      <div className="induction-user">

                        <span className="staff-initial">
                          {getInitials(item.name)}
                        </span>

                        <div>
                          <b>{item.name}</b>

                          <small>
                            {item.id}
                          </small>
                        </div>

                      </div>
                    </td>

                    <td>
                      <span className="position-text">
                        {item.position}
                      </span>
                    </td>

                    <td>
                      {item.startDate || "—"}
                    </td>

                    <td>
                      <Status
                        status={item.status}
                      />
                    </td>

                    <td>

                      <div className="row-actions">

                        <button
                          className="table-link"
                          onClick={() =>
                            setModal({
                              type: "view",
                              item,
                            })
                          }
                        >
                          <Eye size={13} />
                          View
                        </button>

                        <button
                          className="table-link"
                          onClick={() =>
                            setModal({
                              type: "edit",
                              item,
                            })
                          }
                        >
                          <Pencil size={13} />
                          Edit
                        </button>

                        <button
                          className="table-danger"
                          onClick={() =>
                            setModal({
                              type: "delete",
                              item,
                            })
                          }
                        >
                          <Trash2 size={13} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {/* Modal */}
      {modal && (

        <Modal
          title={
            modal.type === "delete"
              ? "Delete Induction"
              : modal.type === "edit"
              ? "Edit Induction"
              : "Induction Details"
          }
          onClose={() =>
            setModal(null)
          }
        >

          {/* VIEW */}
          {modal.type === "view" && (

            <InductionDetail
              item={modal.item}
            />

          )}

          {/* EDIT */}
          {modal.type === "edit" && (

            <InlineEdit
              item={modal.item}
              onSave={updateInduction}
            />

          )}

          {/* DELETE */}
          {modal.type === "delete" && (

            <ConfirmDelete
              name={`${modal.item.name} induction record`}
              onCancel={() =>
                setModal(null)
              }
              onConfirm={() =>
                deleteInduction(
                  modal.item.id
                )
              }
            />

          )}

        </Modal>

      )}

    </div>
  );
}


/* =========================================================
   INITIALS
========================================================= */

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}


/* =========================================================
   STATUS
========================================================= */

function Status({ status }) {
  const completed =
    status?.toLowerCase() === "completed";

  return (
    <span
      className={`status ${
        completed
          ? "completed"
          : "in-progress"
      }`}
    >
      <i />
      {status}
    </span>
  );
}


/* =========================================================
   DETAIL
========================================================= */

function InductionDetail({ item }) {
  return (
    <div className="induction-detail">

      <div className="detail-hero">

        <span className="large-initial">
          {getInitials(item.name)}
        </span>

        <div>
          <h2>{item.name}</h2>

          <p>{item.position}</p>

          <Status
            status={item.status}
          />
        </div>

      </div>

      <div className="detail-grid">

        <Info
          label="Staff Name"
          value={item.name}
        />

        <Info
          label="Position"
          value={item.position}
        />

        <Info
          label="Start Date"
          value={
            item.startDate || "—"
          }
        />

        <Info
          label="Induction Status"
          value={item.status}
        />

        <Info
          label="Training"
          value={
            item.training ||
            "Safeguarding, Medication, Health & Safety"
          }
        />

        <Info
          label="Access Type"
          value={
            item.accessType || "Staff"
          }
        />

      </div>

      <div className="induction-box">

        <div className="induction-box-head">
          <div>
            <span className="eyebrow">
              TRAINING
            </span>

            <h3>
              Induction Checklist
            </h3>
          </div>
        </div>

        <label>
          <input
            type="checkbox"
            defaultChecked={
              item.orientationCompleted ??
              true
            }
          />
          Orientation completed
        </label>

        <label>
          <input
            type="checkbox"
            defaultChecked={
              item.safeguardingCompleted ??
              true
            }
          />
          Safeguarding training
        </label>

        <label>
          <input
            type="checkbox"
            defaultChecked={
              item.medicationCompleted ??
              true
            }
          />
          Medication training
        </label>

        <label>
          <input
            type="checkbox"
            defaultChecked={
              item.healthSafetyCompleted ??
              true
            }
          />
          Health & Safety
        </label>

        <label>
          <input
            type="checkbox"
            defaultChecked={
              item.carePlanCompleted ??
              true
            }
          />
          Care plan training
        </label>

      </div>

    </div>
  );
}


/* =========================================================
   INFO
========================================================= */

function Info({ label, value }) {
  return (
    <div className="info">

      <small>{label}</small>

      <b>{value}</b>

    </div>
  );
}


/* =========================================================
   EDIT
========================================================= */

function InlineEdit({ item, onSave }) {

  const [values, setValues] =
    useState({ ...item });

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

        <label>
          <span>Staff Name</span>

          <input
            value={values.name || ""}
            onChange={(e) =>
              setValues({
                ...values,
                name: e.target.value,
              })
            }
            required
          />
        </label>

        <label>
          <span>Position</span>

          <input
            value={values.position || ""}
            onChange={(e) =>
              setValues({
                ...values,
                position: e.target.value,
              })
            }
            required
          />
        </label>

        <label>
          <span>Start Date</span>

          <input
            type="date"
            value={values.startDate || ""}
            onChange={(e) =>
              setValues({
                ...values,
                startDate: e.target.value,
              })
            }
          />
        </label>

        <label>
          <span>Induction Status</span>

          <select
            value={values.status || ""}
            onChange={(e) =>
              setValues({
                ...values,
                status: e.target.value,
              })
            }
          >
            <option value="In Progress">
              In Progress
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>
        </label>

        <label className="wide">
          <span>Notes</span>

          <textarea
            rows="4"
            value={values.notes || ""}
            onChange={(e) =>
              setValues({
                ...values,
                notes: e.target.value,
              })
            }
            placeholder="Add induction notes..."
          />
        </label>

      </div>

      <button
        className="primary full"
        type="submit"
      >
        Update Induction
      </button>

    </form>
  );
}


/* =========================================================
   DELETE
========================================================= */

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
        Delete this record?
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


/* =========================================================
   MODAL
========================================================= */

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
              PEOPLE & TRAINING
            </span>

            <h2>{title}</h2>

          </div>

          <button
            className="icon-btn"
            onClick={onClose}
          >
            ×
          </button>

        </div>

        <div className="modal-body">
          {children}
        </div>

      </div>

    </div>
  );
}


export default Induction;
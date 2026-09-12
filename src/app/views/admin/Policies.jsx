// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Search,
//   Plus,
//   ShieldCheck,
//   FileText,
//   Eye,
//   Pencil,
//   Trash2,
//   Download,
//   X,
// } from "lucide-react";

// import { useData } from "../../../context/DataContext.jsx";
// import AppTopbar from "../../../components/layout/AppTopbar";

// export default function Policies() {
//   const nav = useNavigate();
//   const { data, setData } = useData();

//   const [search, setSearch] = useState("");
//   const [typeFilter, setTypeFilter] = useState("All Types");
//   const [statusFilter, setStatusFilter] = useState("All Status");
//   const [modal, setModal] = useState(null);

//   const policies = data.policies || [];

//   const filteredPolicies = policies.filter((policy) => {
//     const matchesSearch = `
//       ${policy.name}
//       ${policy.type}
//       ${policy.description}
//       ${policy.id}
//       ${policy.status}
//     `
//       .toLowerCase()
//       .includes(search.toLowerCase());

//     const matchesType =
//       typeFilter === "All Types" ||
//       policy.type === typeFilter;

//     const matchesStatus =
//       statusFilter === "All Status" ||
//       policy.status === statusFilter;

//     return matchesSearch && matchesType && matchesStatus;
//   });

//   const deletePolicy = (id) => {
//     setData({
//       ...data,
//       policies: policies.filter(
//         (policy) => policy.id !== id
//       ),
//     });

//     setModal(null);
//   };

//   const updatePolicy = (updatedPolicy) => {
//     setData({
//       ...data,
//       policies: policies.map((policy) =>
//         policy.id === updatedPolicy.id
//           ? updatedPolicy
//           : policy
//       ),
//     });

//     setModal(null);
//   };

//   return (
//     <div className="policies-page">

//       <AppTopbar
//         title="Policy"
//         sub="Manage homecare policies and procedures."
//       />

//       {/* Toolbar */}
//       <div className="toolbar">

//         <div className="search">
//           <Search size={16} />

//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search policies..."
//           />
//         </div>

//         <select
//           value={typeFilter}
//           onChange={(e) => setTypeFilter(e.target.value)}
//         >
//           <option>All Types</option>
//           <option>Clinical</option>
//           <option>Safeguarding</option>
//           <option>Health & Safety</option>
//           <option>HR</option>
//           <option>Compliance</option>
//         </select>

//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//         >
//           <option>All Status</option>
//           <option>Active</option>
//           <option>Archived</option>
//         </select>

//         <button
//           className="primary"
//           onClick={() => nav("/upload-policy")}
//         >
//           <Plus size={15} />
//           Add Policy
//         </button>

//       </div>

//       {/* Policies */}
//       <section className="section-card">

//         <div className="section-title">

//           <div>
//             <span className="eyebrow">
//               COMPLIANCE
//             </span>

//             <h2>
//               Policies & Procedures
//             </h2>
//           </div>

//           <span className="record-count">
//             {filteredPolicies.length} policies
//           </span>

//         </div>

//         <div className="policy-list">

//           {filteredPolicies.length === 0 ? (

//             <div className="empty-state">

//               <ShieldCheck size={40} />

//               <h3>
//                 No policies found
//               </h3>

//               <p>
//                 Try changing your search or add a new policy.
//               </p>

//               <button
//                 className="primary"
//                 onClick={() => nav("/upload-policy")}
//               >
//                 <Plus size={15} />
//                 Add Policy
//               </button>

//             </div>

//           ) : (

//             filteredPolicies.map((policy) => (

//               <div
//                 className="policy-item"
//                 key={policy.id}
//               >

//                 <div className="policy-icon">
//                   <FileText size={21} />
//                 </div>

//                 <div className="policy-main">

//                   <div className="policy-name-row">

//                     <b>
//                       {policy.name}
//                     </b>

//                     <Status
//                       status={policy.status}
//                     />

//                   </div>

//                   <div className="policy-meta">

//                     <span>
//                       {policy.type}
//                     </span>

//                     <span>
//                       Policy ID: {policy.id}
//                     </span>

//                     <span>
//                       Review: {policy.reviewDate}
//                     </span>

//                   </div>

//                   <p>
//                     {policy.description}
//                   </p>

//                 </div>

//                 <div className="policy-actions">

//                   <button
//                     className="outline small"
//                     onClick={() =>
//                       setModal({
//                         type: "view",
//                         item: policy,
//                       })
//                     }
//                   >
//                     <Eye size={13} />
//                     View
//                   </button>

//                   <button
//                     className="outline small"
//                     onClick={() =>
//                       setModal({
//                         type: "edit",
//                         item: policy,
//                       })
//                     }
//                   >
//                     <Pencil size={13} />
//                     Edit
//                   </button>

//                   <button
//                     className="danger-btn small"
//                     onClick={() =>
//                       setModal({
//                         type: "delete",
//                         item: policy,
//                       })
//                     }
//                   >
//                     <Trash2 size={13} />
//                   </button>

//                 </div>

//               </div>

//             ))

//           )}

//         </div>

//       </section>

//       {/* Modal */}
//       {modal && (

//         <Modal
//           title={
//             modal.type === "delete"
//               ? "Delete Policy"
//               : modal.type === "edit"
//               ? "Edit Policy"
//               : modal.item.name
//           }
//           onClose={() => setModal(null)}
//         >

//           {modal.type === "view" && (
//             <PolicyDetail
//               policy={modal.item}
//             />
//           )}

//           {modal.type === "edit" && (
//             <InlineEdit
//               item={modal.item}
//               fields={[
//                 "name",
//                 "type",
//                 "effectiveDate",
//                 "reviewDate",
//                 "status",
//                 "description",
//               ]}
//               onSave={updatePolicy}
//             />
//           )}

//           {modal.type === "delete" && (
//             <ConfirmDelete
//               name={modal.item.name}
//               onCancel={() => setModal(null)}
//               onConfirm={() =>
//                 deletePolicy(modal.item.id)
//               }
//             />
//           )}

//         </Modal>

//       )}

//     </div>
//   );
// }


// /* =========================
//    POLICY DETAIL
// ========================= */

// function PolicyDetail({ policy }) {
//   return (
//     <div className="policy-detail">

//       <div className="policy-detail-header">

//         <div className="policy-detail-icon">
//           <ShieldCheck size={28} />
//         </div>

//         <div>

//           <span className="eyebrow">
//             POLICY DOCUMENT
//           </span>

//           <h2>
//             {policy.name}
//           </h2>

//           <p>
//             {policy.type} · {policy.id}
//           </p>

//         </div>

//       </div>

//       <div className="detail-grid">

//         <Info
//           label="Policy Type"
//           value={policy.type}
//         />

//         <Info
//           label="Status"
//           value={policy.status}
//         />

//         <Info
//           label="Effective Date"
//           value={policy.effectiveDate || "—"}
//         />

//         <Info
//           label="Review Date"
//           value={policy.reviewDate || "—"}
//         />

//         <Info
//           label="Uploaded"
//           value={policy.uploaded || "—"}
//         />

//         <Info
//           label="File"
//           value={policy.fileName || "—"}
//         />

//       </div>

//       <div className="policy-description">

//         <small>
//           Description
//         </small>

//         <p>
//           {policy.description || "—"}
//         </p>

//       </div>

//       <div className="policy-download">

//         <div>

//           <FileText size={18} />

//           <div>

//             <b>
//               {policy.fileName || "Policy document"}
//             </b>

//             <small>
//               Policy document
//             </small>

//           </div>

//         </div>

//         <button
//           className="primary"
//           onClick={() =>
//             window.alert(
//               `${policy.name} download prepared.`
//             )
//           }
//         >
//           <Download size={15} />
//           Download
//         </button>

//       </div>

//     </div>
//   );
// }


// /* =========================
//    STATUS
// ========================= */

// function Status({ status }) {
//   const normalizedStatus =
//     status?.toLowerCase() || "inactive";

//   return (
//     <span
//       className={`status ${normalizedStatus}`}
//     >
//       <i />
//       {status}
//     </span>
//   );
// }


// /* =========================
//    INFO
// ========================= */

// function Info({ label, value }) {
//   return (
//     <div className="info">

//       <small>
//         {label}
//       </small>

//       <b>
//         {value}
//       </b>

//     </div>
//   );
// }


// /* =========================
//    INLINE EDIT
// ========================= */

// function InlineEdit({
//   item,
//   fields,
//   onSave,
// }) {
//   const [values, setValues] = useState({
//     ...item,
//   });

//   const submit = (e) => {
//     e.preventDefault();
//     onSave(values);
//   };

//   return (
//     <form
//       className="inline-form"
//       onSubmit={submit}
//     >

//       <div className="form-grid">

//         {fields.map((field) => (

//           <label key={field}>

//             <span>
//               {formatLabel(field)}
//             </span>

//             {field === "status" ? (

//               <select
//                 value={values[field] || ""}
//                 onChange={(e) =>
//                   setValues({
//                     ...values,
//                     [field]: e.target.value,
//                   })
//                 }
//               >
//                 <option value="Active">
//                   Active
//                 </option>

//                 <option value="Archived">
//                   Archived
//                 </option>
//               </select>

//             ) : field === "type" ? (

//               <select
//                 value={values[field] || ""}
//                 onChange={(e) =>
//                   setValues({
//                     ...values,
//                     [field]: e.target.value,
//                   })
//                 }
//               >
//                 <option value="Clinical">
//                   Clinical
//                 </option>

//                 <option value="Safeguarding">
//                   Safeguarding
//                 </option>

//                 <option value="Health & Safety">
//                   Health & Safety
//                 </option>

//                 <option value="HR">
//                   HR
//                 </option>

//                 <option value="Compliance">
//                   Compliance
//                 </option>
//               </select>

//             ) : field === "description" ? (

//               <textarea
//                 value={values[field] || ""}
//                 rows="5"
//                 onChange={(e) =>
//                   setValues({
//                     ...values,
//                     [field]: e.target.value,
//                   })
//                 }
//               />

//             ) : (

//               <input
//                 type={
//                   field === "effectiveDate" ||
//                   field === "reviewDate"
//                     ? "date"
//                     : "text"
//                 }
//                 value={values[field] || ""}
//                 onChange={(e) =>
//                   setValues({
//                     ...values,
//                     [field]: e.target.value,
//                   })
//                 }
//               />

//             )}

//           </label>

//         ))}

//       </div>

//       <button
//         className="primary full"
//         type="submit"
//       >
//         Save Changes
//       </button>

//     </form>
//   );
// }


// /* =========================
//    FORMAT LABEL
// ========================= */

// function formatLabel(value) {
//   return value
//     .replace(/([A-Z])/g, " $1")
//     .replace(/^./, (letter) =>
//       letter.toUpperCase()
//     );
// }


// /* =========================
//    DELETE CONFIRMATION
// ========================= */

// function ConfirmDelete({
//   name,
//   onCancel,
//   onConfirm,
// }) {
//   return (
//     <div className="confirm-delete">

//       <div className="delete-icon">
//         <Trash2 />
//       </div>

//       <h3>
//         Delete this policy?
//       </h3>

//       <p>
//         You are about to permanently delete{" "}
//         <b>{name}</b>. This action cannot be undone.
//       </p>

//       <div className="confirm-actions">

//         <button
//           className="outline"
//           onClick={onCancel}
//         >
//           Cancel
//         </button>

//         <button
//           className="danger-solid"
//           onClick={onConfirm}
//         >
//           Delete
//         </button>

//       </div>

//     </div>
//   );
// }


// /* =========================
//    MODAL
// ========================= */

// function Modal({
//   title,
//   onClose,
//   children,
// }) {
//   return (
//     <div
//       className="modal-backdrop"
//       onMouseDown={(e) => {
//         if (
//           e.target === e.currentTarget
//         ) {
//           onClose();
//         }
//       }}
//     >

//       <div className="modal">

//         <div className="modal-head">

//           <div>

//             <span className="eyebrow">
//               DETAIL VIEW
//             </span>

//             <h2>
//               {title}
//             </h2>

//           </div>

//           <button
//             className="icon-btn"
//             onClick={onClose}
//           >
//             <X />
//           </button>

//         </div>

//         <div className="modal-body">
//           {children}
//         </div>

//       </div>

//     </div>
//   );
// }
import { useEffect, useState } from "react";
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
  Upload,
} from "lucide-react";

import { useData } from "../../../context/DataContext.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";

import AppTopbar from "../../../components/layout/AppTopbar";

import "./Policies.css";

export default function Policies() {
  const nav = useNavigate();

  const {
    data,
    getPolicies,
    getPolicy,
    uploadPolicy,
    updatePolicy,
    deletePolicy,
  } = useData();

  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] =
    useState("All Types");

  const [statusFilter, setStatusFilter] =
    useState("All Status");

  const [modal, setModal] = useState(null);

  const [loading, setLoading] = useState(false);

  const policies = Array.isArray(data?.policies)
    ? data.policies
    : [];

  const isPolicyUser = user?.role === "policy";

  /*
  |--------------------------------------------------------------------------
  | LOAD POLICIES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        setLoading(true);

        await getPolicies();
      } catch (error) {
        console.error(
          "LOAD POLICIES ERROR:",
          error
        );

        alert(
          error.message ||
            "Failed to load policies."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPolicies();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredPolicies = policies.filter(
    (policy) => {
      const searchText = `
        ${policy.title || ""}
        ${policy.policyType || ""}
        ${policy.description || ""}
        ${policy.fileName || ""}
        ${policy._id || ""}
        ${policy.status || ""}
      `.toLowerCase();

      const matchesSearch =
        searchText.includes(
          search.toLowerCase()
        );

      const matchesType =
        typeFilter === "All Types" ||
        policy.policyType === typeFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        policy.status === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | VIEW POLICY
  |--------------------------------------------------------------------------
  */

  const handleView = async (policy) => {
    try {
      const result = await getPolicy(
        policy._id
      );

      const fileUrl = result?.fileUrl;

      if (!fileUrl) {
        throw new Error(
          "Secure document URL was not generated."
        );
      }

      window.open(
        fileUrl,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      console.error(
        "VIEW POLICY ERROR:",
        error
      );

      alert(
        error.message ||
          "Unable to open policy document."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (policy) => {
    try {
      await deletePolicy(policy._id);

      setModal(null);
    } catch (error) {
      console.error(
        "DELETE POLICY ERROR:",
        error
      );

      alert(
        error.message ||
          "Failed to delete policy."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE
  |--------------------------------------------------------------------------
  */

  const handleUpdate = async (
    policy,
    values
  ) => {
    try {
      await updatePolicy(
        policy._id,
        values
      );

      setModal(null);
    } catch (error) {
      console.error(
        "UPDATE POLICY ERROR:",
        error
      );

      alert(
        error.message ||
          "Failed to update policy."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UPLOAD
  |--------------------------------------------------------------------------
  */

  const handleUpload = async (form) => {
    try {
      await uploadPolicy(form);

      setModal(null);

      alert(
        "Policy uploaded successfully."
      );
    } catch (error) {
      console.error(
        "UPLOAD POLICY ERROR:",
        error
      );

      alert(
        error.message ||
          "Failed to upload policy."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | FORMAT DATE
  |--------------------------------------------------------------------------
  */

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="policies-page">

      <AppTopbar
        title="Policy"
        sub="Manage homecare policies and procedures."
      />

      {/* =========================================================
          TOOLBAR
      ========================================================= */}

      <div className="toolbar">

        <div className="search">
          <Search size={16} />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search policies..."
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)
          }
        >
          <option>All Types</option>
          <option>Policy</option>
          <option>Procedure</option>
          <option>Guideline</option>
          <option>Protocol</option>
          <option>Other</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
        >
          <option>All Status</option>
          <option>Read</option>
          <option>Unread</option>
        </select>

        <button
          className="primary"
          onClick={() =>
            setModal({
              type: "upload",
            })
          }
        >
          <Plus size={15} />
          Add Policy
        </button>

      </div>

      {/* =========================================================
          POLICY LIST
      ========================================================= */}

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
            {filteredPolicies.length}{" "}
            {filteredPolicies.length === 1
              ? "policy"
              : "policies"}
          </span>

        </div>

        <div className="policy-list">

          {loading ? (
            <div className="empty-state">
              <FileText size={40} />

              <h3>
                Loading policies...
              </h3>

              <p>
                Please wait while policies are
                loaded from the database.
              </p>
            </div>
          ) : filteredPolicies.length ===
            0 ? (
            <div className="empty-state">

              <ShieldCheck size={40} />

              <h3>
                No policies found
              </h3>

              <p>
                {policies.length === 0
                  ? "There are no policies in the system yet."
                  : "Try changing your search or filters."}
              </p>

              <button
                className="primary"
                onClick={() =>
                  setModal({
                    type: "upload",
                  })
                }
              >
                <Plus size={15} />
                Add Policy
              </button>

            </div>
          ) : (

            filteredPolicies.map(
              (policy) => (

                <div
                  className="policy-item"
                  key={policy._id}
                >

                  <div className="policy-icon">
                    <FileText size={21} />
                  </div>

                  <div className="policy-main">

                    <div className="policy-name-row">

                      <b>
                        {policy.title}
                      </b>

                      <Status
                        status={
                          policy.status
                        }
                      />

                    </div>

                    <div className="policy-meta">

                      <span>
                        {policy.policyType}
                      </span>

                      <span>
                        ID:{" "}
                        {policy._id}
                      </span>

                      <span>
                        Uploaded:{" "}
                        {formatDate(
                          policy.createdAt
                        )}
                      </span>

                    </div>

                    <p>
                      {policy.description ||
                        "No description provided."}
                    </p>

                    {policy.fileName && (
                      <small>
                        <FileText
                          size={13}
                        />{" "}
                        {policy.fileName}
                      </small>
                    )}

                  </div>

                  <div className="policy-actions">

                    <button
                      className="outline small"
                      onClick={() =>
                        handleView(policy)
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
              )
            )

          )}

        </div>

      </section>

      {/* =========================================================
          MODALS
      ========================================================= */}

      {modal && (
        <Modal
          title={
            modal.type === "upload"
              ? "Add Policy"
              : modal.type === "delete"
              ? "Delete Policy"
              : "Edit Policy"
          }
          onClose={() =>
            setModal(null)
          }
        >

          {modal.type === "upload" && (
            <UploadPolicyModal
              allowed={isPolicyUser}
              onCancel={() =>
                setModal(null)
              }
              onSubmit={handleUpload}
            />
          )}

          {modal.type === "view" && (
            <PolicyDetail
              policy={modal.item}
              onOpen={() =>
                handleView(
                  modal.item
                )
              }
            />
          )}

          {modal.type === "edit" && (
            <InlineEdit
              item={modal.item}
              onCancel={() =>
                setModal(null)
              }
              onSave={(values) =>
                handleUpdate(
                  modal.item,
                  values
                )
              }
            />
          )}

          {modal.type === "delete" && (
            <ConfirmDelete
              name={
                modal.item.title
              }
              onCancel={() =>
                setModal(null)
              }
              onConfirm={() =>
                handleDelete(
                  modal.item
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
   POLICY DETAIL
========================================================= */

function PolicyDetail({
  policy,
  onOpen,
}) {
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
            {policy.title}
          </h2>

          <p>
            {policy.policyType}
          </p>

        </div>

      </div>

      <div className="detail-grid">

        <Info
          label="Policy Type"
          value={
            policy.policyType
          }
        />

        <Info
          label="Status"
          value={
            policy.status
          }
        />

        <Info
          label="Uploaded"
          value={
            formatDateValue(
              policy.createdAt
            )
          }
        />

        <Info
          label="Updated"
          value={
            formatDateValue(
              policy.updatedAt
            )
          }
        />

        <Info
          label="File"
          value={
            policy.fileName ||
            "—"
          }
        />

        <Info
          label="Uploaded By"
          value={
            policy.uploadedBy
              ?.fullName ||
            policy.uploadedBy
              ?.username ||
            "—"
          }
        />

      </div>

      <div className="policy-description">

        <small>
          Description
        </small>

        <p>
          {policy.description ||
            "No description provided."}
        </p>

      </div>

      <div className="policy-download">

        <div>

          <FileText size={18} />

          <div>

            <b>
              {policy.fileName ||
                "Policy document"}
            </b>

            <small>
              PDF document
            </small>

          </div>

        </div>

        <button
          className="primary"
          onClick={onOpen}
        >
          <Download size={15} />
          Open PDF
        </button>

      </div>

    </div>
  );
}


/* =========================================================
   UPLOAD POLICY MODAL
========================================================= */

function UploadPolicyModal({
  allowed,
  onCancel,
  onSubmit,
}) {
  const [title, setTitle] =
    useState("");

  const [policyType, setPolicyType] =
    useState("Policy");

  const [description, setDescription] =
    useState("");

  const [file, setFile] =
    useState(null);

  const [submitting, setSubmitting] =
    useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!allowed) return;

    if (!title.trim()) {
      alert(
        "Policy title is required."
      );
      return;
    }

    if (!file) {
      alert(
        "Please select a PDF document."
      );
      return;
    }

    if (
      file.type !==
        "application/pdf" &&
      !file.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      alert(
        "Only PDF documents are allowed."
      );
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      alert(
        "PDF must not exceed 10MB."
      );
      return;
    }

    try {
      setSubmitting(true);

      await onSubmit({
        title,
        policyType,
        description,
        file,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!allowed) {
    return (
      <div className="confirm-delete">

        <div className="delete-icon">
          <ShieldCheck />
        </div>

        <h3>
          Policy users only
        </h3>

        <p>
          Only users with the{" "}
          <b>Policy</b> role can
          upload new policies.
        </p>

        <p>
          Please sign in with a policy
          management account to upload
          a document.
        </p>

        <div className="confirm-actions">

          <button
            className="outline"
            onClick={onCancel}
          >
            Close
          </button>

          <button
            className="primary"
            onClick={() =>
              window.location.href =
                "/policy/library?upload=true"
            }
          >
            Go to Policy Library
          </button>

        </div>

      </div>
    );
  }

  return (
    <form
      className="inline-form"
      onSubmit={submit}
    >

      <div className="form-grid">

        <label>
          <span>
            Policy Title
          </span>

          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            placeholder="e.g. Safeguarding Policy"
            required
          />
        </label>

        <label>
          <span>
            Policy Type
          </span>

          <select
            value={policyType}
            onChange={(e) =>
              setPolicyType(
                e.target.value
              )
            }
          >
            <option value="Policy">
              Policy
            </option>

            <option value="Procedure">
              Procedure
            </option>

            <option value="Guideline">
              Guideline
            </option>

            <option value="Protocol">
              Protocol
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </label>

        <label>
          <span>
            Description
          </span>

          <textarea
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
            rows="5"
            placeholder="Brief description of this policy..."
          />
        </label>

        <label>
          <span>
            Policy PDF
          </span>

          <div className="policy-file-input">

            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) =>
                setFile(
                  e.target.files?.[0] ||
                    null
                )
              }
              required
            />

          </div>

          {file && (
            <small>
              Selected:{" "}
              {file.name}
            </small>
          )}

          <small>
            PDF only · Maximum 10MB
          </small>

        </label>

      </div>

      <div className="confirm-actions">

        <button
          type="button"
          className="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary"
          disabled={submitting}
        >
          <Upload size={15} />

          {submitting
            ? "Uploading..."
            : "Upload Policy"}
        </button>

      </div>

    </form>
  );
}


/* =========================================================
   STATUS
========================================================= */

function Status({ status }) {
  const normalizedStatus =
    status?.toLowerCase() ||
    "unread";

  return (
    <span
      className={`status ${normalizedStatus}`}
    >
      <i />

      {status || "Unread"}
    </span>
  );
}


/* =========================================================
   INFO
========================================================= */

function Info({
  label,
  value,
}) {
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


/* =========================================================
   INLINE EDIT
========================================================= */

function InlineEdit({
  item,
  onCancel,
  onSave,
}) {
  const [title, setTitle] =
    useState(
      item.title || ""
    );

  const [policyType, setPolicyType] =
    useState(
      item.policyType ||
        "Policy"
    );

  const [description, setDescription] =
    useState(
      item.description || ""
    );

  const submit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert(
        "Policy title is required."
      );
      return;
    }

    onSave({
      title: title.trim(),
      policyType,
      description:
        description.trim(),
    });
  };

  return (
    <form
      className="inline-form"
      onSubmit={submit}
    >

      <div className="form-grid">

        <label>
          <span>
            Policy Title
          </span>

          <input
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
          />
        </label>

        <label>
          <span>
            Policy Type
          </span>

          <select
            value={policyType}
            onChange={(e) =>
              setPolicyType(
                e.target.value
              )
            }
          >
            <option value="Policy">
              Policy
            </option>

            <option value="Procedure">
              Procedure
            </option>

            <option value="Guideline">
              Guideline
            </option>

            <option value="Protocol">
              Protocol
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </label>

        <label>
          <span>
            Description
          </span>

          <textarea
            value={description}
            rows="5"
            onChange={(e) =>
              setDescription(
                e.target.value
              )
            }
          />
        </label>

        <div className="info">
          <small>
            Document
          </small>

          <b>
            {item.fileName ||
              "PDF document"}
          </b>

          <small>
            The uploaded PDF is not
            changed by this edit.
          </small>
        </div>

      </div>

      <div className="confirm-actions">

        <button
          type="button"
          className="outline"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button
          className="primary"
          type="submit"
        >
          Save Changes
        </button>

      </div>

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
        Delete this policy?
      </h3>

      <p>
        You are about to permanently
        delete{" "}
        <b>{name}</b>.
      </p>

      <p>
        The policy record and its PDF
        document will be removed.
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
          e.target ===
          e.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="modal">

        <div className="modal-head">

          <div>
            <span className="eyebrow">
              POLICY MANAGEMENT
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


/* =========================================================
   DATE
========================================================= */

function formatDateValue(date) {
  if (!date) return "—";

  return new Date(
    date
  ).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}
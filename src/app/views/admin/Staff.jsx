
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
// import { useData } from "../../../context/DataContext.jsx";
// import "./Staff.css";

// // Mongo documents come back with `_id`, not `id`. Centralize the lookup so
// // every place that needs "this staff member's identifier" agrees.
// const staffId = (staff) => staff?._id || staff?.id;

// function Staff() {
//   const nav = useNavigate();
//   const { data, setData } = useData();
//   const [search, setSearch] = useState("");
//   const [modal, setModal] = useState(null);

//   const filteredStaff = data.staff.filter((staff) => {
//     const value = `${staff.name} ${staff.email} ${staff.role} ${staffId(staff)}`;
//     return value.toLowerCase().includes(search.toLowerCase());
//   });

//   const removeStaff = (id) => {
//     setData({
//       ...data,
//       staff: data.staff.filter((staff) => staffId(staff) !== id),
//     });
//     setModal(null);
//   };

//   return (
//     <div className="staff-page">
//       <div className="page-head">
//         <div>
//           <div className="eyebrow">LANBETHCARE</div>
//           <h1>Manage Staff</h1>
//           <p>View and manage staff information.</p>
//         </div>
//       </div>

//       <div className="staff-toolbar">
//         <div className="staff-search">
//           <Search size={16} />
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search staff..."
//           />
//         </div>

//         <button className="primary" onClick={() => nav("/admin/add-staff")}>
//           <Plus size={15} />
//           Add Staff
//         </button>
//       </div>

//       <div className="staff-grid">
//         {filteredStaff.length > 0 ? (
//           filteredStaff.map((staff) => {
//             const id = staffId(staff);
//             return (
//               <div className="staff-card" key={id}>
//                 <div className="staff-card-top">
//                   <span className="staff-initial">{staff.initials}</span>
//                   <div className="staff-name">
//                     <b>{staff.name}</b>
//                     <small>{staff.role} · {id}</small>
//                   </div>
//                   <Status status={staff.status} />
//                 </div>

//                 <div className="staff-info">
//                   <p><span>✉</span>{staff.email}</p>
//                   <p><span>☎</span>{staff.phone}</p>
//                   <p><span>Role:</span>{staff.role}</p>
//                 </div>

//                 <div className="staff-actions">
//                   <button
//                     className="primary small"
//                     onClick={() => nav(`/admin/staff-profile/${id}`)}
//                   >
//                     <Eye size={13} />
//                     View
//                   </button>

//                   <button
//                     className="outline small"
//                     onClick={() => nav(`/admin/edit-staff/${id}`)}
//                   >
//                     <Pencil size={13} />
//                     Edit Profile
//                   </button>

//                   <button
//                     className="danger-btn small"
//                     onClick={() => setModal({ type: "delete", item: staff })}
//                   >
//                     <Trash2 size={13} />
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           <div className="empty-staff">
//             <UsersIcon />
//             <h3>No staff found</h3>
//             <p>Try searching with another name, email, role or staff ID.</p>
//           </div>
//         )}
//       </div>

//       {modal && (
//         <Modal
//           title={
//             modal.type === "delete"
//               ? "Delete Staff"
//               : modal.type === "edit"
//               ? "Edit Staff"
//               : "Staff Profile"
//           }
//           onClose={() => setModal(null)}
//         >
//           {modal.type === "view" && <StaffDetail staff={modal.item} />}

//           {modal.type === "delete" && (
//             <ConfirmDelete
//               name={modal.item.name}
//               onCancel={() => setModal(null)}
//               onConfirm={() => removeStaff(staffId(modal.item))}
//             />
//           )}
//         </Modal>
//       )}
//     </div>
//   );
// }

// function Status({ status }) {
//   return (
//     <span className={`status ${status.toLowerCase()}`}>
//       <i />
//       {status}
//     </span>
//   );
// }

// function StaffDetail({ staff }) {
//   return (
//     <div className="staff-detail">
//       <div className="staff-detail-hero">
//         <span className="large-initial">{staff.initials}</span>
//         <div>
//           <h2>{staff.name}</h2>
//           <p>{staff.role} · {staffId(staff)}</p>
//           <Status status={staff.status} />
//         </div>
//       </div>

//       <div className="staff-detail-grid">
//         <Info label="Email" value={staff.email} />
//         <Info label="Phone" value={staff.phone} />
//         <Info label="Employment" value={staff.employment} />
//         <Info label="Start Date" value={staff.startDate} />
//       </div>
//     </div>
//   );
// }

// function Info({ label, value }) {
//   return (
//     <div className="info">
//       <small>{label}</small>
//       <b>{value}</b>
//     </div>
//   );
// }

// function ConfirmDelete({ name, onCancel, onConfirm }) {
//   return (
//     <div className="confirm-delete">
//       <div className="delete-icon"><Trash2 /></div>
//       <h3>Delete this record?</h3>
//       <p>You are about to permanently delete <b>{name}</b>. This action cannot be undone.</p>
//       <div className="confirm-actions">
//         <button className="outline" onClick={onCancel}>Cancel</button>
//         <button className="danger-solid" onClick={onConfirm}>Delete</button>
//       </div>
//     </div>
//   );
// }

// function Modal({ title, onClose, children }) {
//   return (
//     <div
//       className="modal-backdrop"
//       onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
//     >
//       <div className="modal">
//         <div className="modal-head">
//           <div>
//             <span className="eyebrow">STAFF MANAGEMENT</span>
//             <h2>{title}</h2>
//           </div>
//           <button className="icon-btn" onClick={onClose}>×</button>
//         </div>
//         <div className="modal-body">{children}</div>
//       </div>
//     </div>
//   );
// }

// function UsersIcon() {
//   return (
//     <div className="empty-icon">
//       <span>👥</span>
//     </div>
//   );
// }

// export default Staff;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Eye, Pencil, Trash2 } from "lucide-react";
import { useData } from "../../../context/DataContext.jsx";
import { deleteStaffMember } from "../../../lib/api.js";
import "./Staff.css";

// Mongo documents come back with `_id`, not `id`. Centralize the lookup so
// every place that needs "this staff member's identifier" agrees.
const staffId = (staff) => staff?._id || staff?.id;

// Your backend stores the display name as `fullName`, not `name`. Fall back
// gracefully in case some records still have `name` from older test data.
const staffName = (staff) => staff?.fullName || staff?.name || "this staff member";

function Staff() {
  const nav = useNavigate();
  const { data, setData } = useData();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const filteredStaff = data.staff.filter((staff) => {
    const value = `${staffName(staff)} ${staff.email} ${staff.role} ${staffId(staff)}`;
    return value.toLowerCase().includes(search.toLowerCase());
  });

  const removeStaff = async (id) => {
    setDeleting(true);
    setDeleteError("");
    try {
      await deleteStaffMember(id);

      // Only remove from local state once the server confirms the delete.
      setData({
        ...data,
        staff: data.staff.filter((staff) => staffId(staff) !== id),
      });
      setModal(null);
    } catch (err) {
      setDeleteError(err.message || "Failed to delete staff member.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="staff-page">
      <div className="page-head">
        <div>
          <div className="eyebrow">LANBETHCARE</div>
          <h1>Manage Staff</h1>
          <p>View and manage staff information.</p>
        </div>
      </div>

      <div className="staff-toolbar">
        <div className="staff-search">
          <Search size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff..."
          />
        </div>

        <button className="primary" onClick={() => nav("/admin/add-staff")}>
          <Plus size={15} />
          Add Staff
        </button>
      </div>

      <div className="staff-grid">
        {filteredStaff.length > 0 ? (
          filteredStaff.map((staff) => {
            const id = staffId(staff);
            return (
              <div className="staff-card" key={id}>
                <div className="staff-card-top">
                  <span className="staff-initial">{staff.initials}</span>
                  <div className="staff-name">
                    <b>{staffName(staff)}</b>
                    <small>{staff.role} · {id}</small>
                  </div>
                  <Status status={staff.status} />
                </div>

                <div className="staff-info">
                  <p><span>✉</span>{staff.email}</p>
                  <p><span>☎</span>{staff.phone}</p>
                  <p><span>Role:</span>{staff.role}</p>
                </div>

                <div className="staff-actions">
                  <button
                    className="primary small"
                    onClick={() => nav(`/admin/staff-profile/${id}`)}
                  >
                    <Eye size={13} />
                    View
                  </button>

                  <button
                    className="outline small"
                    onClick={() => nav(`/admin/edit-staff/${id}`)}
                  >
                    <Pencil size={13} />
                    Edit Profile
                  </button>

                  <button
                    className="danger-btn small"
                    onClick={() => {
                      setDeleteError("");
                      setModal({ type: "delete", item: staff });
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-staff">
            <UsersIcon />
            <h3>No staff found</h3>
            <p>Try searching with another name, email, role or staff ID.</p>
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title={
            modal.type === "delete"
              ? "Delete Staff"
              : modal.type === "edit"
              ? "Edit Staff"
              : "Staff Profile"
          }
          onClose={() => {
            if (deleting) return; // don't let them close mid-request
            setModal(null);
            setDeleteError("");
          }}
        >
          {modal.type === "view" && <StaffDetail staff={modal.item} />}

          {modal.type === "delete" && (
            <ConfirmDelete
              name={staffName(modal.item)}
              deleting={deleting}
              error={deleteError}
              onCancel={() => {
                setModal(null);
                setDeleteError("");
              }}
              onConfirm={() => removeStaff(staffId(modal.item))}
            />
          )}
        </Modal>
      )}
    </div>
  );
}

function Status({ status }) {
  return (
    <span className={`status ${(status || "").toLowerCase()}`}>
      <i />
      {status}
    </span>
  );
}

function StaffDetail({ staff }) {
  return (
    <div className="staff-detail">
      <div className="staff-detail-hero">
        <span className="large-initial">{staff.initials}</span>
        <div>
          <h2>{staffName(staff)}</h2>
          <p>{staff.role} · {staffId(staff)}</p>
          <Status status={staff.status} />
        </div>
      </div>

      <div className="staff-detail-grid">
        <Info label="Email" value={staff.email} />
        <Info label="Phone" value={staff.phone} />
        <Info label="Employment" value={staff.employment} />
        <Info label="Start Date" value={staff.startDate} />
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="info">
      <small>{label}</small>
      <b>{value}</b>
    </div>
  );
}

function ConfirmDelete({ name, onCancel, onConfirm, deleting, error }) {
  return (
    <div className="confirm-delete">
      <div className="delete-icon"><Trash2 /></div>
      <h3>Delete this staff member?</h3>
      <p>You are about to permanently delete <b>{name}</b>. This action cannot be undone.</p>
      {error && (
        <p className="upload-confirm" style={{ color: "#b91c1c" }}>{error}</p>
      )}
      <div className="confirm-actions">
        <button className="outline" onClick={onCancel} disabled={deleting}>
          Cancel
        </button>
        <button className="danger-primary" onClick={onConfirm} disabled={deleting}>
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">STAFF MANAGEMENT</span>
            <h2>{title}</h2>
          </div>
          <button className="icon-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function UsersIcon() {
  return (
    <div className="empty-icon">
      <span>👥</span>
    </div>
  );
}

export default Staff;

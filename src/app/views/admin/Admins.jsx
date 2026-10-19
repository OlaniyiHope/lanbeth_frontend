import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Trash2, Power, RefreshCw } from "lucide-react";
import { useAuth } from "../../../context/AuthContext.jsx";
import { getAdmins, setAdminStatus, deleteAdmin } from "../../../lib/api.js";
import "./Staff.css";

const adminId = (a) => a?._id || a?.id;

const getInitials = (name = "") =>
  name.split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

function Admins() {
  const nav = useNavigate();
  const { user } = useAuth();
  const myId = String(user?.id || user?._id || "");

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null); // admin being deleted
  const [deleteError, setDeleteError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getAdmins();
      setAdmins(result.admins || []);
    } catch (err) {
      setError(err.message || "Failed to load admins.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = admins.filter((a) =>
    `${a.fullName} ${a.email} ${a.username}`.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = async (admin) => {
    const id = adminId(admin);
    const next = admin.status === "active" ? "inactive" : "active";
    try {
      setBusyId(id);
      setError("");
      const result = await setAdminStatus(id, next);
      setAdmins((list) =>
        list.map((a) => (adminId(a) === id ? { ...a, status: result.admin.status } : a))
      );
    } catch (err) {
      setError(err.message || "Failed to update admin.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async () => {
    const id = adminId(confirm);
    try {
      setBusyId(id);
      setDeleteError("");
      await deleteAdmin(id);
      setAdmins((list) => list.filter((a) => adminId(a) !== id));
      setConfirm(null);
    } catch (err) {
      setDeleteError(err.message || "Failed to delete admin.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="staff-page">
      <div className="page-head">
        <div>
          <div className="eyebrow">LANBETHCARE</div>
          <h1>Manage Admins</h1>
          <p>View and manage administrator accounts.</p>
        </div>
        <button className="icon-btn" title="Reload" onClick={load} disabled={loading}>
          <RefreshCw size={17} className={loading ? "spin" : ""} />
        </button>
      </div>

      <div className="staff-toolbar">
        <div className="staff-search">
          <Search size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search admins..."
          />
        </div>
        <button className="primary" onClick={() => nav("/admin/add-admin")}>
          <Plus size={15} />
          Add Admin
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="staff-grid">
        {loading ? (
          <p>Loading admins…</p>
        ) : filtered.length > 0 ? (
          filtered.map((admin) => {
            const id = adminId(admin);
            const isMe = String(id) === myId;
            const active = admin.status === "active";

            return (
              <div className="staff-card" key={id}>
                <div className="staff-card-top">
                  <span className="staff-initial" style={{ overflow: "hidden" }}>
                    {admin.profilePhoto ? (
                      <img
                        src={admin.profilePhoto}
                        alt={admin.fullName}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                      />
                    ) : (
                      getInitials(admin.fullName)
                    )}
                  </span>
                  <div className="staff-name">
                    <b>
                      {admin.fullName}
                      {isMe && " (You)"}
                    </b>
                    <small>@{admin.username}</small>
                  </div>
                  <span className={`status ${active ? "active" : "inactive"}`}>
                    <i />
                    {active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="staff-info">
                  <p><span>✉</span>{admin.email}</p>
                  <p><span>☎</span>{admin.phone || "—"}</p>
                  <p>
                    <span>Last login:</span>
                    {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString("en-GB") : "Never"}
                  </p>
                </div>

                <div className="staff-actions">
                  <button
                    className="outline small"
                    onClick={() => toggleStatus(admin)}
                    disabled={isMe || busyId === id}
                    title={isMe ? "You cannot change your own status" : ""}
                  >
                    <Power size={13} />
                    {active ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    className="danger-btn small"
                    onClick={() => {
                      setDeleteError("");
                      setConfirm(admin);
                    }}
                    disabled={isMe || busyId === id}
                    title={isMe ? "You cannot delete your own account" : "Delete admin"}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-staff">
            <h3>No admins found</h3>
            <p>Try another name, email or username.</p>
          </div>
        )}
      </div>

      {confirm && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && busyId === null) setConfirm(null);
          }}
        >
          <div className="modal">
            <div className="modal-head">
              <div>
                <span className="eyebrow">ADMIN MANAGEMENT</span>
                <h2>Delete Admin</h2>
              </div>
            </div>
            <div className="modal-body">
              <div className="confirm-delete">
                <div className="delete-icon"><Trash2 /></div>
                <h3>Delete this admin?</h3>
                <p>
                  You are about to permanently delete <b>{confirm.fullName}</b>. This cannot be undone.
                  To keep the record but block sign-in, deactivate the account instead.
                </p>
                {deleteError && (
                  <p className="upload-confirm" style={{ color: "#b91c1c" }}>{deleteError}</p>
                )}
                <div className="confirm-actions">
                  <button className="outline" onClick={() => setConfirm(null)} disabled={busyId !== null}>
                    Cancel
                  </button>
                  <button className="danger-primary" onClick={remove} disabled={busyId !== null}>
                    {busyId !== null ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admins;
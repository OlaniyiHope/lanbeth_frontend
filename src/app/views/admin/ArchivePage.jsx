import { useEffect, useState } from "react";
import { Search, RotateCcw, Trash2, RefreshCw } from "lucide-react";
import { getArchive, restoreArchived, deleteArchivedPermanently } from "../../../lib/api.js";
import "./Staff.css";

const itemId = (i) => i?._id || i?.id;

const getInitials = (name = "") =>
  name.split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const TABS = [
  { key: "staff", label: "Staff" },
  { key: "client", label: "Clients" },
];

function ArchivePage() {
  const [type, setType] = useState("staff");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [confirmError, setConfirmError] = useState("");

  const load = async (t = type) => {
    try {
      setLoading(true);
      setError("");
      const result = await getArchive(t);
      setItems(result.items || []);
    } catch (err) {
      setError(err.message || "Failed to load archive.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearch("");
    load(type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const filtered = items.filter((i) =>
    `${i.fullName} ${i.email} ${i.clientId || ""} ${i.username || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const restore = async (item) => {
    const id = itemId(item);
    try {
      setBusyId(id);
      setError("");
      await restoreArchived(type, id);
      setItems((list) => list.filter((i) => itemId(i) !== id));
    } catch (err) {
      setError(err.message || "Failed to restore.");
    } finally {
      setBusyId(null);
    }
  };

  const removeForever = async () => {
    const id = itemId(confirm);
    try {
      setBusyId(id);
      setConfirmError("");
      await deleteArchivedPermanently(type, id);
      setItems((list) => list.filter((i) => itemId(i) !== id));
      setConfirm(null);
    } catch (err) {
      setConfirmError(err.message || "Failed to delete.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="staff-page">
      <div className="page-head">
        <div>
          <div className="eyebrow">LANBETHCARE</div>
          <h1>Archive</h1>
          <p>Former staff and clients. Restore a record or delete it permanently.</p>
        </div>
        <button className="icon-btn" title="Reload" onClick={() => load()} disabled={loading}>
          <RefreshCw size={17} className={loading ? "spin" : ""} />
        </button>
      </div>

      <div className="staff-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={type === t.key}
            className={`staff-tab ${type === t.key ? "active" : ""}`}
            onClick={() => setType(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="staff-toolbar">
        <div className="staff-search">
          <Search size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search archived ${type === "staff" ? "staff" : "clients"}...`}
          />
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="staff-grid">
        {loading ? (
          <p>Loading…</p>
        ) : filtered.length > 0 ? (
          filtered.map((item) => {
            const id = itemId(item);
            return (
              <div className="staff-card" key={id}>
                <div className="staff-card-top">
                  <span className="staff-initial" style={{ overflow: "hidden" }}>
                    {item.profilePhoto ? (
                      <img
                        src={item.profilePhoto}
                        alt={item.fullName}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
                      />
                    ) : (
                      getInitials(item.fullName)
                    )}
                  </span>
                  <div className="staff-name">
                    <b>{item.fullName}</b>
                    <small>
                      {type === "client"
                        ? item.clientId || id
                        : item.jobTitle || "Staff"}
                    </small>
                  </div>
                </div>

                <div className="staff-info">
                  <p><span>✉</span>{item.email || "—"}</p>
                  <p><span>☎</span>{item.phone || "—"}</p>
                  <p>
                    <span>Archived:</span>
                    {item.archivedAt
                      ? new Date(item.archivedAt).toLocaleDateString("en-GB")
                      : "—"}
                    {item.archivedBy?.fullName ? ` by ${item.archivedBy.fullName}` : ""}
                  </p>
                </div>

                <div className="staff-actions">
                  <button
                    className="primary small"
                    onClick={() => restore(item)}
                    disabled={busyId === id}
                  >
                    <RotateCcw size={13} />
                    Restore
                  </button>
                  <button
                    className="danger-btn small"
                    onClick={() => {
                      setConfirmError("");
                      setConfirm(item);
                    }}
                    disabled={busyId === id}
                    title="Delete permanently"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-staff">
            <h3>Nothing archived</h3>
            <p>
              Archived {type === "staff" ? "staff" : "clients"} will appear here.
            </p>
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
                <span className="eyebrow">ARCHIVE</span>
                <h2>Delete Permanently</h2>
              </div>
            </div>
            <div className="modal-body">
              <div className="confirm-delete">
                <div className="delete-icon"><Trash2 /></div>
                <h3>Permanently delete this record?</h3>
                <p>
                  <b>{confirm.fullName}</b> will be removed for good. This cannot be undone.
                </p>
                {confirmError && (
                  <p className="upload-confirm" style={{ color: "#b91c1c" }}>{confirmError}</p>
                )}
                <div className="confirm-actions">
                  <button className="outline" onClick={() => setConfirm(null)} disabled={busyId !== null}>
                    Cancel
                  </button>
                  <button className="danger-primary" onClick={removeForever} disabled={busyId !== null}>
                    {busyId !== null ? "Deleting…" : "Delete forever"}
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

export default ArchivePage;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Eye, Pencil, Trash2, Users } from "lucide-react";
import { useData } from "../../../context/DataContext.jsx";
import "./Clients.css";

function Clients() {
  const nav = useNavigate();
  const { data, setData } = useData();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);

  const filteredClients = data.clients.filter((client) => {
    const value = `
      ${client.name}
      ${client.email}
      ${client.phone}
      ${client.id}
      ${client.status}
    `;
    return value.toLowerCase().includes(search.toLowerCase());
  });

  const removeClient = (id) => {
    setData({
      ...data,
      clients: data.clients.filter((client) => client.id !== id),
    });
    setModal(null);
  };

  return (
    <div className="clients-page">
      <div className="page-head">
        <div>
          <div className="eyebrow">LANBETHCARE</div>
          <h1>Manage Clients</h1>
          <p>View and manage client information.</p>
        </div>
      </div>

      <div className="clients-toolbar">
        <div className="client-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="primary" onClick={() => nav("/admin/add-client")}>
          <Plus size={15} />
          Add Client
        </button>
      </div>

      <div className="client-summary">
        <div>
          <span className="summary-icon"><Users size={18} /></span>
          <div>
            <small>Total Clients</small>
            <strong>{data.clients.length}</strong>
          </div>
        </div>

        <div>
          <small>Active</small>
          <strong className="active-number">
            {data.clients.filter((client) => client.status === "Active").length}
          </strong>
        </div>

        <div>
          <small>Inactive</small>
          <strong className="inactive-number">
            {data.clients.filter((client) => client.status !== "Active").length}
          </strong>
        </div>
      </div>

      <div className="clients-grid">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
        <div className="client-card" key={client.clientId || client._id}>
              <div className="client-card-top">
                <span className="client-avatar">
                  {client.initials || getInitials(client.name)}
                </span>
                <div className="client-name">
                  <b>{client.name}</b>
                <small>{client.clientId}</small>
                </div>
                <Status status={client.status} />
              </div>

              <div className="client-info">
                <div className="client-info-row">
                  <span>Email</span>
                  <b>{client.email}</b>
                </div>
                <div className="client-info-row">
                  <span>Phone</span>
                  <b>{client.phone}</b>
                </div>
                {client.address && (
                  <div className="client-info-row">
                    <span>Address</span>
                    <b>{client.address}</b>
                  </div>
                )}
              </div>

              <div className="client-actions">
          <button
  className="primary small"
  onClick={() => nav(`/admin/client-profile/${client.clientId}`)}
>
  <Eye size={13} />
  View
</button>

                <button
                  className="outline small"
                  onClick={() => setModal({ type: "edit", item: client })}
                >
                  <Pencil size={13} />
                  Edit
                </button>

                <button
                  className="danger-btn small"
                  onClick={() => setModal({ type: "delete", item: client })}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-clients">
            <div className="empty-icon"><Users size={23} /></div>
            <h3>No clients found</h3>
            <p>Try searching with another name, email, phone number, or client ID.</p>
          </div>
        )}
      </div>

      {modal && (
        <Modal
          title={
            modal.type === "delete"
              ? "Delete Client"
              : modal.type === "edit"
              ? "Edit Client"
              : "Client Profile"
          }
          onClose={() => setModal(null)}
        >
          {modal.type === "view" && <ClientDetail client={modal.item} />}

          {modal.type === "edit" && (
            <InlineEdit
              item={modal.item}
              fields={["name", "email", "phone", "address", "status"]}
              onSave={(updatedClient) => {
                setData({
                  ...data,
                  clients: data.clients.map((client) =>
                    client.id === updatedClient.id ? updatedClient : client
                  ),
                });
                setModal(null);
              }}
            />
          )}

          {modal.type === "delete" && (
            <ConfirmDelete
              name={modal.item.name}
              onCancel={() => setModal(null)}
              onConfirm={() => removeClient(modal.item.id)}
            />
          )}
        </Modal>
      )}
    </div>
  );
}

function getInitials(name = "") {
  return name.split(" ").filter(Boolean).map((word) => word[0]).join("").slice(0, 2).toUpperCase();
}

function Status({ status }) {
  const active = status?.toLowerCase() === "active";
  return (
    <span className={`status ${active ? "active" : "inactive"}`}>
      <i />
      {status}
    </span>
  );
}

function ClientDetail({ client }) {
  return (
    <div className="client-detail">
      <div className="client-detail-hero">
        <span className="large-avatar">
          {client.initials || getInitials(client.name)}
        </span>
        <div>
          <h2>{client.name}</h2>
          <p>{client.id}</p>
          <Status status={client.status} />
        </div>
      </div>

      <div className="client-detail-grid">
        <Info label="Email" value={client.email} />
        <Info label="Phone" value={client.phone} />
        <Info label="Address" value={client.address || "—"} />
        <Info label="Status" value={client.status} />
        {client.dateOfBirth && <Info label="Date of Birth" value={client.dateOfBirth} />}
        {client.startDate && <Info label="Start Date" value={client.startDate} />}
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

function InlineEdit({ item, fields, onSave }) {
  const [values, setValues] = useState({ ...item });

  const submit = (e) => {
    e.preventDefault();
    onSave(values);
  };

  return (
    <form className="inline-form" onSubmit={submit}>
      <div className="form-grid">
        {fields.map((field) => (
          <label key={field}>
            <span>{formatLabel(field)}</span>
            {field === "status" ? (
              <select
                value={values[field] || ""}
                onChange={(e) => setValues({ ...values, [field]: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            ) : (
              <input
                value={values[field] || ""}
                onChange={(e) => setValues({ ...values, [field]: e.target.value })}
              />
            )}
          </label>
        ))}
      </div>
      <button className="primary full" type="submit">Save Changes</button>
    </form>
  );
}

function formatLabel(value) {
  return value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function ConfirmDelete({ name, onCancel, onConfirm }) {
  return (
    <div className="confirm-delete">
      <div className="delete-icon"><Trash2 /></div>
      <h3>Delete this client?</h3>
      <p>You are about to permanently delete <b>{name}</b>. This action cannot be undone.</p>
      <div className="confirm-actions">
        <button className="outline" onClick={onCancel}>Cancel</button>
        <button className="danger-solid" onClick={onConfirm}>Delete</button>
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
            <span className="eyebrow">CLIENT MANAGEMENT</span>
            <h2>{title}</h2>
          </div>
          <button className="icon-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Clients;
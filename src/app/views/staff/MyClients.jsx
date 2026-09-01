import {
  Search,
  Eye,
  FileText,
  Users,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MyClients.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function MyClients() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [clients, setClients] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("lanbeth-auth-token");

      if (!token) {
        setError("You are not authenticated.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/staff/my-clients`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Failed to load assigned clients."
        );
      }

      setClients(result.clients || []);

    } catch (err) {
      console.error("My Clients error:", err);

      setError(
        err.message ||
          "Unable to load assigned clients."
      );

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchClients();
  }, []);


  /* ===============================
     FILTER CLIENTS
  =============================== */

  const filteredClients = clients.filter((client) => {

    const value = `
      ${client.fullName || ""}
      ${client.clientId || ""}
      ${client.condition || ""}
      ${client.service || ""}
      ${client.status || ""}
      ${client.phone || ""}
    `;

    return value
      .toLowerCase()
      .includes(search.toLowerCase());

  });


  /* ===============================
     ACTIVE CLIENTS
  =============================== */

  const activeClients = clients.filter(
    (client) =>
      String(client.status).toLowerCase() === "active"
  );


  return (
    <div className="staff-clients-page">


      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="page-head">

        <div>

          <div className="eyebrow">
            LANBETHCARE STAFF
          </div>

          <h1>
            Assigned Clients
          </h1>

          <p>
            View clients assigned to your care
            and submit daily reports.
          </p>

        </div>


        <div className="head-actions">

          <button
            className="outline small"
            onClick={fetchClients}
            disabled={loading}
          >

            <RefreshCw size={14} />

            {loading
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </div>

      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (

        <div className="dashboard-error">

          <AlertCircle size={18} />

          <div>

            <strong>
              Unable to load clients
            </strong>

            <p>
              {error}
            </p>

          </div>

          <button
            className="primary small"
            onClick={fetchClients}
          >
            Try Again
          </button>

        </div>

      )}


      {/* =========================
          SUMMARY
      ========================= */}

      <div className="client-summary">


        {/* ASSIGNED */}

        <div>

          <span className="summary-icon">

            <Users size={18} />

          </span>

          <div>

            <small>
              Assigned Clients
            </small>

            <strong>
              {loading ? "..." : clients.length}
            </strong>

          </div>

        </div>


        {/* ACTIVE */}

        <div>

          <small>
            Active Clients
          </small>

          <strong className="active-number">

            {loading
              ? "..."
              : activeClients.length}

          </strong>

        </div>


        {/* PENDING */}

        <div>

          <small>
            Pending Reports
          </small>

          <strong className="pending-number">
            0
          </strong>

        </div>


      </div>


      {/* =========================
          SEARCH
      ========================= */}

      <div className="clients-toolbar">

        <div className="client-search">

          <Search size={16} />

          <input
            placeholder="Search assigned clients..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>


      {/* =========================
          CLIENT CARDS
      ========================= */}

      <div className="clients-grid">


        {/* LOADING */}

        {loading ? (

          <div className="empty-clients">

            <RefreshCw
              size={30}
              className="loading-icon"
            />

            <h3>
              Loading clients...
            </h3>

            <p>
              Fetching your assigned clients.
            </p>

          </div>

        ) : filteredClients.length > 0 ? (

          filteredClients.map((client) => (

            <ClientCard
              key={client._id}
              client={client}
              navigate={navigate}
            />

          ))

        ) : (

          /* NO CLIENTS */

          <div className="empty-clients">

            <Users size={30} />

            <h3>
              {clients.length === 0
                ? "No clients assigned"
                : "No clients found"}
            </h3>

            <p>

              {clients.length === 0
                ? "You currently don't have any clients assigned to you."
                : "Try another search."}

            </p>

          </div>

        )}

      </div>


      <div className="watermark">
        LAMBETH RESOLUTION HOMECARE
      </div>

    </div>
  );
}


/* =====================================================
   CLIENT CARD
===================================================== */

function ClientCard({
  client,
  navigate,
}) {

  const name =
    client.fullName ||
    client.name ||
    "Unknown Client";


  const status =
    client.status ||
    "Unknown";


  return (

    <div className="client-card">


      {/* =========================
          TOP
      ========================= */}

      <div className="client-card-top">


        <span className="client-avatar">

          {getInitials(name)}

        </span>


        <div className="client-name">

          <b>
            {name}
          </b>

          <small>
            {client.clientId ||
              client._id}
          </small>

        </div>


        <span
          className={`status ${
            String(status).toLowerCase() ===
            "active"
              ? "active"
              : ""
          }`}
        >

          <i />

          {status}

        </span>


      </div>


      {/* =========================
          INFORMATION
      ========================= */}

      <div className="client-info">


        <div className="client-info-row">

          <span>
            Age
          </span>

          <b>
            {calculateAge(
              client.dateOfBirth
            )}
          </b>

        </div>


        <div className="client-info-row">

          <span>
            Condition
          </span>

          <b>
            {client.condition ||
              "Not specified"}
          </b>

        </div>


        <div className="client-info-row">

          <span>
            Care Type
          </span>

          <b>
            {client.service ||
              "Not specified"}
          </b>

        </div>


      </div>


      {/* =========================
          ACTIONS
      ========================= */}

      <div className="client-actions">


        <button
          className="primary small"
          onClick={() =>
            navigate(
              `/staff/client-profile/${client._id}`
            )
          }
        >

          <Eye size={13} />

          View

        </button>


        <button
          className="outline small"
          onClick={() =>
            navigate(
              `/staff/submit-report/${client._id}`
            )
          }
        >

          <FileText size={13} />

          Submit Report

        </button>


      </div>


    </div>

  );
}


/* =====================================================
   GET INITIALS
===================================================== */

function getInitials(name = "") {

  return name
    .split(" ")
    .filter(Boolean)
    .map((x) => x[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

}


/* =====================================================
   CALCULATE AGE
===================================================== */

function calculateAge(dateOfBirth) {

  if (!dateOfBirth) {
    return "—";
  }

  const birthDate =
    new Date(dateOfBirth);

  if (
    Number.isNaN(
      birthDate.getTime()
    )
  ) {
    return "—";
  }

  const today = new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const month =
    today.getMonth() -
    birthDate.getMonth();

  if (
    month < 0 ||
    (
      month === 0 &&
      today.getDate() <
        birthDate.getDate()
    )
  ) {
    age--;
  }

  return age;
}
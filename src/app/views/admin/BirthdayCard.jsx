import { useEffect, useState } from "react";
import { Cake } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function BirthdayCard() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("lanbeth-auth-token");

    fetch(`${API}/api/notifications/birthdays`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || "Failed to load birthdays");
        setItems(data.birthdays || []);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section className="birthday-card">
      <div className="birthday-head">
        <Cake size={16} />
        <strong>Upcoming birthdays</strong>
        <span className="birthday-window">next 7 days</span>
      </div>

      {error && <div className="birthday-error">{error}</div>}

      {!error && items.length === 0 && (
        <div className="birthday-empty">No birthdays in the next 7 days</div>
      )}

      <ul className="birthday-list">
        {items.map((p) => (
          <li key={`${p.kind}-${p.id}`} className="birthday-row">
            <span className={`birthday-kind ${p.kind}`}>
              {p.kind === "client" ? "Client" : "Staff"}
            </span>
            <span className="birthday-name">{p.name}</span>
            <span className="birthday-age">turns {p.age}</span>
            <span className={`birthday-when ${p.daysUntil === 0 ? "today" : ""}`}>
              {p.daysUntil === 0 ? "Today" : `in ${p.daysUntil}d`}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
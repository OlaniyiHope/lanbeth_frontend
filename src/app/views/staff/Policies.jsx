import { useMemo, useState } from "react";
import {
  Search,
  FileText,
  Eye,
  Check,
  Clock,
  ShieldCheck,
  ChevronRight,
  X,
  BookOpen,
} from "lucide-react";
import "./Policies.css";

const INITIAL_POLICIES = [
  {
    id: 1,
    title: "Safeguarding Policy",
    category: "Safeguarding",
    version: "v2.1",
    updated: "12 January 2025",
    status: "Unread",
    summary:
      "Guidelines for protecting service users from abuse, neglect, exploitation and harm.",
    content: `
The purpose of this policy is to ensure that all staff understand their responsibilities for safeguarding service users.

All staff have a responsibility to promote the safety, dignity and wellbeing of every service user.

Staff must remain alert to signs of abuse, neglect, exploitation or inappropriate treatment.

Any safeguarding concern must be reported immediately through the appropriate company reporting process.

Staff should:

• Treat every service user with dignity and respect.
• Report concerns without delay.
• Maintain professional boundaries.
• Protect confidential information.
• Follow the company's safeguarding procedures.
• Cooperate with investigations when required.

Failure to follow safeguarding procedures may result in disciplinary action.
    `,
  },
  {
    id: 2,
    title: "Medication Administration Policy",
    category: "Medication",
    version: "v1.8",
    updated: "08 January 2025",
    status: "Unread",
    summary:
      "Rules and procedures for the safe handling, administration and recording of medication.",
    content: `
This policy provides guidance for staff involved in supporting service users with medication.

Medication must always be handled safely and according to the individual's care plan.

Staff must ensure that medication records are completed accurately.

Before supporting medication administration, staff should confirm:

• The correct service user.
• The correct medication.
• The correct dosage.
• The correct time.
• The correct route.
• Any relevant instructions.

Any medication error, refusal or missed medication must be recorded and reported according to company procedures.

Medication must never be administered outside the staff member's level of training or authorization.
    `,
  },
  {
    id: 3,
    title: "Health & Safety Policy",
    category: "Health & Safety",
    version: "v2.0",
    updated: "04 January 2025",
    status: "Read",
    summary:
      "Company requirements for maintaining a safe working environment for staff and service users.",
    content: `
The company is committed to providing a safe environment for staff, service users and visitors.

Staff are expected to identify and report hazards as soon as they become aware of them.

Staff should:

• Follow health and safety procedures.
• Use equipment correctly.
• Report accidents and incidents.
• Keep work areas clean and safe.
• Follow emergency procedures.
• Attend required health and safety training.

All accidents and incidents must be reported through the appropriate reporting process.
    `,
  },
  {
    id: 4,
    title: "Confidentiality & Data Protection Policy",
    category: "Data Protection",
    version: "v1.5",
    updated: "20 December 2024",
    status: "Unread",
    summary:
      "Requirements for protecting service user, staff and company information.",
    content: `
All staff have a responsibility to protect confidential information.

Information relating to service users must only be accessed, discussed or shared when there is a legitimate reason to do so.

Staff must:

• Keep passwords secure.
• Never share login credentials.
• Avoid discussing confidential information in public places.
• Store documents securely.
• Report suspected data breaches immediately.
• Only access information necessary for their role.

Confidential information must not be shared with unauthorized individuals.
    `,
  },
  {
    id: 5,
    title: "Professional Conduct Policy",
    category: "Staff Conduct",
    version: "v1.3",
    updated: "15 December 2024",
    status: "Unread",
    summary:
      "Expected standards of behaviour, professionalism and conduct for all staff.",
    content: `
All staff are expected to maintain a high standard of professional conduct.

Staff must treat service users, colleagues, families and other professionals with respect.

Professional boundaries must always be maintained.

Staff should:

• Be punctual and reliable.
• Communicate respectfully.
• Maintain appropriate professional boundaries.
• Wear appropriate work clothing where required.
• Follow company procedures.
• Report concerns appropriately.

Unprofessional behaviour may result in disciplinary action.
    `,
  },
  {
    id: 6,
    title: "Infection Prevention & Control Policy",
    category: "Clinical",
    version: "v1.7",
    updated: "10 December 2024",
    status: "Unread",
    summary:
      "Procedures for preventing and controlling the spread of infection.",
    content: `
Staff must follow infection prevention and control procedures at all times.

This includes appropriate hand hygiene, use of personal protective equipment where required and safe disposal of waste.

Staff must report symptoms of infectious illness where required and follow company guidance.

Good infection control protects both service users and staff.
    `,
  },
];

function Policies() {
  const [policies, setPolicies] = useState(INITIAL_POLICIES);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const filteredPolicies = useMemo(() => {
    return policies.filter((policy) => {
      const matchesSearch = `
        ${policy.title}
        ${policy.category}
        ${policy.summary}
      `
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || policy.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [policies, search, filter]);

  const markAsRead = (id) => {
    setPolicies((current) =>
      current.map((policy) =>
        policy.id === id
          ? { ...policy, status: "Read" }
          : policy
      )
    );

    setSelectedPolicy((current) =>
      current && current.id === id
        ? { ...current, status: "Read" }
        : current
    );
  };

  const openPolicy = (policy) => {
    setSelectedPolicy(policy);

    if (policy.status !== "Read") {
      markAsRead(policy.id);
    }
  };

  const totalPolicies = policies.length;

  const readPolicies = policies.filter(
    (policy) => policy.status === "Read"
  ).length;

  const unreadPolicies = policies.filter(
    (policy) => policy.status === "Unread"
  ).length;

  return (
    <div className="staff-policies-page">

      {/* HEADER */}
      <div className="page-head">
        <div>
          <div className="eyebrow">LANBETHCARE</div>

          <h1>Company Policies</h1>

          <p>
            Read company policies and keep up to date with important
            procedures and requirements.
          </p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="policy-summary">

        <div className="policy-summary-card">
          <div className="policy-summary-icon">
            <FileText size={20} />
          </div>

          <div>
            <small>Total Policies</small>
            <strong>{totalPolicies}</strong>
          </div>
        </div>

        <div className="policy-summary-card">
          <div className="policy-summary-icon read">
            <Check size={20} />
          </div>

          <div>
            <small>Read</small>
            <strong>{readPolicies}</strong>
          </div>
        </div>

        <div className="policy-summary-card">
          <div className="policy-summary-icon unread">
            <Clock size={20} />
          </div>

          <div>
            <small>Unread</small>
            <strong>{unreadPolicies}</strong>
          </div>
        </div>

      </div>

      {/* TOOLBAR */}
      <div className="policies-toolbar">

        <div className="policy-search">
          <Search size={16} />

          <input
            type="text"
            placeholder="Search policies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="policy-filters">

          <button
            className={filter === "All" ? "active" : ""}
            onClick={() => setFilter("All")}
          >
            All
          </button>

          <button
            className={filter === "Unread" ? "active" : ""}
            onClick={() => setFilter("Unread")}
          >
            Unread
          </button>

          <button
            className={filter === "Read" ? "active" : ""}
            onClick={() => setFilter("Read")}
          >
            Read
          </button>

        </div>

      </div>

      {/* POLICY LIST */}
      <section className="policies-section">

        <div className="section-title">

          <div>
            <span className="eyebrow">POLICY LIBRARY</span>

            <h2>
              Company Policies
            </h2>
          </div>

          <span className="policy-count">
            {filteredPolicies.length} policies
          </span>

        </div>

        {filteredPolicies.length > 0 ? (

          <div className="policy-list">

            {filteredPolicies.map((policy) => (

              <div
                className={`policy-card ${
                  policy.status === "Unread"
                    ? "policy-unread"
                    : ""
                }`}
                key={policy.id}
              >

                <div className="policy-card-icon">
                  <FileText size={21} />
                </div>

                <div className="policy-card-content">

                  <div className="policy-card-heading">

                    <div>

                      <h3>
                        {policy.title}
                      </h3>

                      <div className="policy-meta">

                        <span>
                          {policy.category}
                        </span>

                        <span>
                          Version {policy.version}
                        </span>

                        <span>
                          Updated {policy.updated}
                        </span>

                      </div>

                    </div>

                    <StatusBadge
                      status={policy.status}
                    />

                  </div>

                  <p>
                    {policy.summary}
                  </p>

                  <div className="policy-card-footer">

                    <button
                      className="outline small"
                      onClick={() => openPolicy(policy)}
                    >
                      <Eye size={14} />
                      View Policy
                    </button>

                    {policy.status === "Unread" && (
                      <button
                        className="mark-read-btn"
                        onClick={() =>
                          markAsRead(policy.id)
                        }
                      >
                        <Check size={14} />
                        Mark as Read
                      </button>
                    )}

                    <button
                      className="policy-arrow"
                      onClick={() => openPolicy(policy)}
                    >
                      <ChevronRight size={17} />
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="policy-empty">

            <div className="policy-empty-icon">
              <FileText size={24} />
            </div>

            <h3>
              No policies found
            </h3>

            <p>
              Try changing your search or filter.
            </p>

          </div>

        )}

      </section>

      <div className="watermark">
        LAMBETH RESOLUTION HOMECARE
      </div>

      {/* POLICY VIEW MODAL */}
      {selectedPolicy && (

        <PolicyModal
          policy={selectedPolicy}
          onClose={() => setSelectedPolicy(null)}
          onMarkRead={() => markAsRead(selectedPolicy.id)}
        />

      )}

    </div>
  );
}

function StatusBadge({ status }) {
  const isRead = status === "Read";

  return (
    <span
      className={`policy-status ${
        isRead ? "read" : "unread"
      }`}
    >
      <i />
      {status}
    </span>
  );
}

function PolicyModal({
  policy,
  onClose,
  onMarkRead,
}) {
  return (

    <div
      className="policy-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >

      <div className="policy-modal">

        <div className="policy-modal-header">

          <div className="policy-modal-title">

            <div className="policy-modal-icon">
              <BookOpen size={20} />
            </div>

            <div>
              <span className="eyebrow">
                COMPANY POLICY
              </span>

              <h2>
                {policy.title}
              </h2>

              <div className="policy-modal-meta">

                <span>
                  {policy.category}
                </span>

                <span>
                  Version {policy.version}
                </span>

                <span>
                  Updated {policy.updated}
                </span>

              </div>
            </div>

          </div>

          <button
            className="policy-close"
            onClick={onClose}
            aria-label="Close policy"
          >
            <X size={18} />
          </button>

        </div>

        <div className="policy-modal-body">

          <div className="policy-notice">

            <ShieldCheck size={17} />

            <div>
              <strong>
                Please read this policy carefully.
              </strong>

              <span>
                Policies may contain important requirements
                relating to your role and responsibilities.
              </span>
            </div>

          </div>

          <div className="policy-document">

            {policy.content
              .trim()
              .split("\n")
              .map((line, index) => {

                const text = line.trim();

                if (!text) {
                  return (
                    <div
                      className="policy-space"
                      key={index}
                    />
                  );
                }

                if (text.startsWith("•")) {
                  return (
                    <p
                      className="policy-bullet"
                      key={index}
                    >
                      {text}
                    </p>
                  );
                }

                return (
                  <p key={index}>
                    {text}
                  </p>
                );
              })}

          </div>

        </div>

        <div className="policy-modal-footer">

          <div>

            {policy.status === "Read" ? (

              <span className="already-read">
                <Check size={14} />
                You have read this policy
              </span>

            ) : (

              <span className="needs-reading">
                <Clock size={14} />
                This policy is unread
              </span>

            )}

          </div>

          <div className="policy-modal-actions">

            <button
              className="outline"
              onClick={onClose}
            >
              Close
            </button>

            {policy.status !== "Read" && (

              <button
                className="primary"
                onClick={() => {
                  onMarkRead();
                }}
              >
                <Check size={15} />
                Mark as Read
              </button>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Policies;
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Upload,
  Library,
  ArrowRight,
} from "lucide-react";

import "./PolicyDashboard.css";

export default function PolicyDashboard() {
  const navigate = useNavigate();

  return (
    <div className="policy-dashboard">
      <div className="policy-page-header">
        <div>
          <span className="policy-eyebrow">
            POLICY MANAGEMENT
          </span>

          <h1>Policy Dashboard</h1>

          <p>
            Upload, manage and access company policies and
            procedures.
          </p>
        </div>
      </div>

      <div className="policy-dashboard-grid">
        <button
          className="policy-action-card"
          onClick={() => navigate("/policy/library")}
        >
          <div className="policy-action-icon">
            <Library size={26} />
          </div>

          <div className="policy-action-content">
            <h2>Policy Library</h2>

            <p>
              View all policies and procedures available in
              the system.
            </p>

            <span>
              View policies
              <ArrowRight size={16} />
            </span>
          </div>
        </button>

        <button
          className="policy-action-card"
          onClick={() => navigate("/policy/library?upload=true")}
        >
          <div className="policy-action-icon">
            <Upload size={26} />
          </div>

          <div className="policy-action-content">
            <h2>Upload Policy</h2>

            <p>
              Upload a new policy or procedure document to
              the policy library.
            </p>

            <span>
              Upload document
              <ArrowRight size={16} />
            </span>
          </div>
        </button>
      </div>

      <div className="policy-info-card">
        <div className="policy-info-icon">
          <FileText size={22} />
        </div>

        <div>
          <h3>Policy & Procedure Management</h3>

          <p>
            Keep important policies, procedures and guidance
            documents organised in one secure location.
          </p>
        </div>
      </div>
    </div>
  );
}
import { Routes, Route, Navigate } from "react-router-dom";

import PolicyDashboard from "../views/policy/PolicyDashboard.jsx";
import PolicyLibrary from "../views/policy/PolicyLibrary.jsx";

export default function PolicyRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<PolicyDashboard />} />

      <Route path="library" element={<PolicyLibrary />} />

      {/* Default policy page */}
      <Route
        path="*"
        element={<Navigate to="dashboard" replace />}
      />
    </Routes>
  );
}
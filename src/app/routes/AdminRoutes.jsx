
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../views/admin/Dashboard.jsx';
import Clients from '../views/admin/Client.jsx';
import Staff from '../views/admin/Staff.jsx';
import Document from '../views/admin/Document.jsx';
import Policies from '../views/admin/Policies.jsx';
import GenerateReport from '../views/admin/GenerateReport.jsx';
import AuditLog from '../views/admin/AuditLog.jsx';
import Induction from '../views/admin/Induction.jsx';
import Settings from '../views/admin/Settings.jsx';
import AddClient from '../views/admin/AddClient.jsx';
import ClientProfile from '../views/admin/ClientProfile.jsx';
import StaffProfile from '../views/admin/StaffProfile.jsx';
import AddStaff from '../views/admin/AddStaff.jsx';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />

      <Route path="clients" element={<Clients />} />
    <Route path="client-profile/:id" element={<ClientProfile />} />
      <Route path="add-client" element={<AddClient />} />
      {/* <Route path="client-profile" element={<Clients />} /> */}
      <Route path="client-documents" element={<Document />} />
      <Route path="edit-client" element={<Clients />} />
      <Route path="expiry-documents" element={<Document />} />

      <Route path="staff" element={<Staff />} />

      <Route path="staff-documents" element={<Document />} />
    <Route path="staff-profile/:id" element={<StaffProfile />} />
      <Route path="add-staff" element={<AddStaff />} />

      <Route path="policies" element={<Policies />} />
      <Route path="generate-report" element={<GenerateReport />} />
      <Route path="audit-log" element={<AuditLog />} />
      <Route path="induction" element={<Induction />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
}
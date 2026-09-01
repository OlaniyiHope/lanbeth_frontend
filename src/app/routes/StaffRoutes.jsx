import { Routes, Route } from "react-router-dom";

import Dashboard from "../views/staff/Dashboard.jsx";

import MyClients from "../views/staff/MyClients.jsx";
import ClientProfile from "../views/staff/ClientProfile.jsx";

import SubmitReport from "../views/staff/SubmitReport.jsx";
import MyReports from "../views/staff/MyReports.jsx";

import Policies from "../views/staff/Policies.jsx";
import ExpiryDocuments from "../views/staff/ExpiryDocuments.jsx";

import MyProfile from "../views/staff/MyProfile.jsx";
import MyDocuments from "../views/staff/MyDocuments.jsx";
import Notifications from "../views/staff/Notifications.jsx";
import Settings from "../views/staff/Settings.jsx";


export default function StaffRoutes() {

  return (

    <Routes>


      {/* Staff Dashboard */}
      <Route 
        path="dashboard" 
        element={<Dashboard />} 
      />



      {/* Staff Profile */}
      <Route
        path="profile"
        element={<MyProfile />}
      />



      {/* Assigned Clients */}
      <Route
        path="clients"
        element={<MyClients />}
      />



      {/* View Client Details - Read Only */}
      <Route
        path="client-profile/:id"
        element={<ClientProfile />}
      />



      {/* Submit Client Care Report */}
      <Route
        path="submit-report/:id"
        element={<SubmitReport />}
      />



      {/* Staff Submitted Reports */}
      <Route
        path="reports"
        element={<MyReports />}
      />



      {/* Staff Documents */}
      <Route
        path="documents"
        element={<MyDocuments />}
      />



      {/* Policies */}
      <Route
        path="policies"
        element={<Policies />}
      />



      {/* Expiring Documents */}
      <Route
        path="expiry-documents"
        element={<ExpiryDocuments />}
      />



      {/* Notifications */}
      <Route
        path="notifications"
        element={<Notifications />}
      />



      {/* Settings */}
      <Route
        path="settings"
        element={<Settings />}
      />


    </Routes>

  );
}
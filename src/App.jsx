import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import AppLayout from './components/layout/AppLayout.jsx';
import './styles.css';
import { DataProvider } from './context/DataContext.jsx'
import Landing from './pages/Landing.jsx';
import AuthPage from './pages/AuthPage.jsx';

import AdminRoutes from './app/routes/AdminRoutes.jsx';
import StaffRoutes from './app/routes/StaffRoutes.jsx';
import PolicyRoutes from './app/routes/PolicyRoutes.jsx';

function RoleRoutes() {
  const { role } = useAuth();
  if (role === 'staff') return <StaffRoutes />;
  if (role === 'policy') return <PolicyRoutes />;
  return <AdminRoutes />;
}

function Gate() {
  const { isAuthenticated, role } = useAuth();
  const nav = useNavigate();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route
          path="/"
          element={<AuthPage onLogin={() => nav('/login')} onSignup={() => nav('/signup')} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
     <DataProvider>

 <Routes>
      <Route path={`/${role}/*`} element={<AppLayout />}>
        <Route path="*" element={<RoleRoutes />} />
      </Route>
      <Route path="*" element={<Navigate to={`/${role}/dashboard`} replace />} />
    </Routes>
     </DataProvider>
   
  );
}

export default function App() {
  return (
    <AuthProvider>
      
      <Gate />
    </AuthProvider>
  );
}
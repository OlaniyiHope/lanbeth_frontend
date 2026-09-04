import { useLocation, Link } from 'react-router-dom';
import {
  ClipboardList, UserRound, Users, CalendarDays, FileText,
  ShieldCheck, Activity, Check, Menu, Settings, LogOut, FolderOpen,
} from 'lucide-react';
import Brand from '../Brand.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

function buildAdminNav() {
  return [
    ['/admin/dashboard', 'Dashboard', ClipboardList],
    ['/admin/staff', 'Staff Manage', UserRound],
    ['/admin/clients', 'Manage Clients', Users],
    ['/admin/expiry-documents', 'Expiry document alert', CalendarDays],
    ['/admin/generate-report', 'Generate Report', FileText],
    ['/admin/policies', 'Policy', ShieldCheck],
    ['/admin/audit-log', 'Staff Audit Logs', Activity],
    ['/admin/induction', 'Staff Induction', Check],
  ];
}

function buildStaffNav() {
  return [
    ['/staff/dashboard', 'Dashboard', ClipboardList],

    ['/staff/profile', 'My Profile', UserRound],

    ['/staff/clients', 'Assigned Clients', Users],

    ['/staff/reports', 'My Reports', FileText],

    ['/staff/documents', 'My Documents', FolderOpen],

    ['/staff/policies', 'Policies', ShieldCheck],

    ['/staff/expiry-documents', 'Expiry Documents', CalendarDays],

    ['/staff/notifications', 'Notifications', Activity],
  ];
}

function buildPolicyNav() {
  return [
    ['/policy/dashboard', 'Dashboard', ClipboardList],
    ['/policy/library', 'Policy Library', ShieldCheck],
  ];
}

export default function AppSidebar({ collapsed, mobileOpen, toggle, closeMobile, logout }) {
  const loc = useLocation();
  const { user, role } = useAuth();

  const items =
    role === 'staff' ? buildStaffNav() :
    role === 'policy' ? buildPolicyNav() :
    buildAdminNav();

  const settingsPath = `/${role}/settings`;

  return (
    <aside className={'sidebar ' + (mobileOpen ? 'open' : '')}>
   <div className="side-top">
  <Brand />
  <button
    className="icon-btn"
    onClick={mobileOpen ? closeMobile : toggle}
    aria-label={mobileOpen ? 'Close menu' : 'Collapse sidebar'}
  >
    <Menu />
  </button>
</div>
      <div className="side-profile">
        <span className="side-profile-icon"><ShieldCheck size={15} /></span>
        <div><b>{user?.fullName || 'Portal User'}</b><small>{role} workspace</small></div>
      </div>
      <div className="side-scroll">
        {items.map(([p, t, I]) => (
          <Link
            key={p}
            title={collapsed ? t : ''}
            className={'side-item ' + (loc.pathname === p ? 'active' : '')}
            to={p}
            onClick={closeMobile}
            style={{color: "black", textDecoration: "none"}}
          >
            <I /><span>{t}</span>
          </Link>
        ))}
      </div>
      <div className="side-bottom">
        <Link className="side-item" to={settingsPath} onClick={closeMobile}>
          <Settings /><span>Settings</span>
        </Link>
        <button className="logout" onClick={logout}><LogOut /><span>Log Out</span></button>
      </div>
    </aside>
  );
}
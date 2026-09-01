import { useLocation } from 'react-router-dom';
import { ClipboardList, UserRound, Users, CalendarDays, FileText, ShieldCheck, Activity, Check, Menu, Settings, LogOut } from 'lucide-react';
import Brand from './Brand.jsx';

export default function Sidebar({ collapsed, toggle, mobileOpen, closeMobile, nav, logout }) {
  const loc = useLocation();
  const items = [
    ['/dashboard', 'Dashboard', ClipboardList],
    ['/staff', 'Staff Manage', UserRound],
    ['/clients', 'Manage Clients', Users],
    ['/expiry-documents', 'Expiry document alert', CalendarDays],
    ['/generate-report', 'Generate Report', FileText],
    ['/policies', 'Policy', ShieldCheck],
    ['/audit-log', 'Staff Audit Logs', Activity],
    ['/induction', 'Staff Induction', Check],
  ];
  return (
    <aside className={'sidebar ' + (mobileOpen ? 'open' : '')}>
      <div className="side-top"><Brand /><button className="icon-btn" onClick={toggle}><Menu /></button></div>
      <div className="side-profile">
        <span className="side-profile-icon"><ShieldCheck size={15} /></span>
        <div><b>Admin Portal</b><small>Secure workspace</small></div>
      </div>
      <div className="side-scroll">
        {items.map(([p, t, I]) => (
          <button key={p} title={collapsed ? t : ''} className={'side-item ' + (loc.pathname === p ? 'active' : '')} onClick={() => { nav(p); closeMobile(); }}>
            <I /><span>{t}</span>
          </button>
        ))}
      </div>
      <div className="side-bottom">
        <button className="side-item" onClick={() => { nav('/settings'); closeMobile(); }}><Settings /><span>Settings</span></button>
        <button className="logout" onClick={logout}><LogOut /><span>Log Out</span></button>
      </div>
    </aside>
  );
}
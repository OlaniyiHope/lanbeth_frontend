import { ChevronRight, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import "./Sidebar.css"
export default function AppTopbar({ theme, toggleTheme, onMenuClick }) {
  const { role } = useAuth();
  return (
    <header className="topbar">
      <div className="top-left">
        <button className="icon-btn menu-toggle" onClick={onMenuClick} aria-label="Toggle menu">
          <Menu size={20} />
        </button>
        <div className="crumb"><span>LanbethCare</span><ChevronRight size={15} /><b>{role} Portal</b></div>
      </div>
      <div className="top-actions">
        <button className="icon-btn theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? <span>☾</span> : <span>☀</span>}
        </button>
      </div>
    </header>
  );
}
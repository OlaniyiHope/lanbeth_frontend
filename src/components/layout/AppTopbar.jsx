import { ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AppTopbar({ theme, toggleTheme }) {
  const { role } = useAuth();
  return (
    <header className="topbar">
      <div className="top-left">
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
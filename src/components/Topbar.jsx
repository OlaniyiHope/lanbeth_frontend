import { ChevronRight } from 'lucide-react';

export default function Topbar({ theme, toggleTheme }) {
  return (
    <header className="topbar">
      <div className="top-left">
        <div className="crumb"><span>LanbethCare</span><ChevronRight size={15} /><b>Admin Portal</b></div>
      </div>
      <div className="top-actions">
        <button className="icon-btn theme-toggle" title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} onClick={toggleTheme}>
          {theme === 'light' ? <span>☾</span> : <span>☀</span>}
        </button>
      </div>
    </header>
  );
}
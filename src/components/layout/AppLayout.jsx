  import { useState } from 'react';
  import { Outlet, useNavigate } from 'react-router-dom';
  import AppSidebar from './AppSidebar.jsx';
  import AppTopbar from './AppTopbar.jsx';
  import { useAuth } from '../../context/AuthContext.jsx';

  const THEME_KEY = 'lanbeth-care-theme-v3';

  export default function AppLayout() {
    const { logout } = useAuth();
    const nav = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light');

    const toggleTheme = () => {
      setTheme((t) => {
        const next = t === 'light' ? 'dark' : 'light';
        localStorage.setItem(THEME_KEY, next);
        return next;
      });
    };

    const handleLogout = () => { logout(); nav('/'); };

    return (
      <div className={'app ' + (collapsed ? 'collapsed ' : '') + (mobileOpen ? 'mobile-open ' : '') + `theme-${theme}`}>
        {mobileOpen && <button className="sidebar-overlay" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
        <AppSidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          toggle={() => setCollapsed((v) => !v)}
          closeMobile={() => setMobileOpen(false)}
          logout={handleLogout}
        />
      <main className="main">
    <AppTopbar
      theme={theme}
      toggleTheme={toggleTheme}
      onMenuClick={() => setMobileOpen((v) => !v)}
    />
    <div className="content"><Outlet /></div>
  </main>
      </div>
    );
  }
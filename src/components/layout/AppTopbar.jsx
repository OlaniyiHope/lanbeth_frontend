// import { ChevronRight, Menu } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext.jsx';
// import "./Sidebar.css"
// export default function AppTopbar({ theme, toggleTheme, onMenuClick }) {
//   const { role } = useAuth();
//   return (
//     <header className="topbar">
//       <div className="top-left">
//         <button className="icon-btn menu-toggle" onClick={onMenuClick} aria-label="Toggle menu">
//           <Menu size={20} />
//         </button>
//         <div className="crumb"><span>LanbethCare</span><ChevronRight size={15} /><b>{role} Portal</b></div>
//       </div>
//       <div className="top-actions">
//         <button className="icon-btn theme-toggle" onClick={toggleTheme}>
//           {theme === 'light' ? <span>☾</span> : <span>☀</span>}
//         </button>
//       </div>
//     </header>
//   );
// }
import { ChevronRight, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import "./Sidebar.css"

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AppTopbar({ theme, toggleTheme, onMenuClick }) {
  const { role, user } = useAuth();
  const displayName = user?.fullName || user?.name || "";
console.log("topbar user:", user, user?.profilePhoto?.slice(0, 30));
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

        <div className="topbar-avatar" title={displayName}>
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt={displayName || "Profile"} />
          ) : (
            <span>{getInitials(displayName) || "?"}</span>
          )}
        </div>
      </div>
    </header>
  );
}
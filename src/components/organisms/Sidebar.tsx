import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { label: 'Dashboard', to: '/dashboard', end: true },
  { label: 'Productos', to: '/dashboard/products', end: false },
];

const GREEN_DARK = '#1e5c1e';
const GREEN = '#2d7a2d';
const YELLOW = '#f5c518';

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { logout } = useAuth();

  return (
    <aside
      style={{ backgroundColor: GREEN_DARK, width: isCollapsed ? 64 : 224 }}
      className="flex flex-col text-white h-full transition-all duration-300 flex-shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4" style={{ borderBottom: `1px solid ${GREEN}` }}>
        {!isCollapsed && (
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: 'white' }}>
              <img src="/logo.png" alt="Porteño" className="h-11 w-11 object-contain" />
            </div>
            <span className="text-xs font-bold tracking-widest mt-0.5" style={{ color: YELLOW }}>CIAl</span>
          </div>
        )}
        {isCollapsed && (
          <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: 'white' }}>
            <img src="/logo.png" alt="Porteño" className="h-7 w-7 object-contain" />
          </div>
        )}
        <button
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="p-1 rounded transition-colors"
          style={{ color: 'white' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = GREEN)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {navItems.map(({ label, to, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-sm font-medium transition-colors duration-150"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? YELLOW : 'transparent',
                  color: isActive ? '#111' : 'white',
                })}
              >
                {!isCollapsed ? label : label[0]}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      {!isCollapsed && (
        <div className="p-3" style={{ borderTop: `1px solid ${GREEN}` }}>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-sm text-white rounded-md transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = GREEN)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const YELLOW = '#f5c518';
const GREEN = '#2d7a2d';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header
      className="flex items-center justify-between px-6 py-3 bg-white shadow-sm"
      style={{ borderBottom: `2px solid ${YELLOW}` }}
    >
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: 'white', border: '2px solid #f5c518' }}>
          <img src="/logo.png" alt="Porteño" className="h-9 w-9 object-contain" />
        </div>
        <span className="font-bold text-sm tracking-widest" style={{ color: GREEN }}>CIAl</span>
      </div>
      <div className="flex items-center gap-3">
        {user?.name && (
          <>
            <span className="text-sm font-medium text-gray-700">{user.name}</span>
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: GREEN }}
            >
              {user.name[0].toUpperCase()}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

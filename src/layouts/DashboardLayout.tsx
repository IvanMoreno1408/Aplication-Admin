import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/organisms/Sidebar';
import Header from '../components/organisms/Header';
import { ToastNotification } from '../components/organisms/ToastNotification';

const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => window.innerWidth < 768);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed((p) => !p)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
      <ToastNotification />
    </div>
  );
};

export default DashboardLayout;

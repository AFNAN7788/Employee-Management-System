import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <main
        className="pt-[var(--navbar-height)] transition-all duration-300"
        style={{
          marginLeft: 'var(--sidebar-width)',
        }}
      >
        <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
          <Outlet />
        </div>

        {/* Responsive: remove margin on mobile */}
        <style>{`
          @media (max-width: 1023px) {
            main { margin-left: 0 !important; }
          }
        `}</style>
      </main>
    </div>
  );
}

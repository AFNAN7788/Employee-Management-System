import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  LogOut,
  X,
  Zap,
  Pencil,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ProfileEditModal from './ProfileEditModal';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/departments', icon: Building2, label: 'Departments' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { logout, user, updateProfile } = useAuth();
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          width: 'var(--sidebar-width)',
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          borderRight: '1px solid rgba(148, 163, 184, 0.08)',
        }}
      >
        {/* Logo section — EMS → Management → Main Menu */}
        <div className="px-5 pt-6 pb-2 shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Zap size={22} color="white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight leading-tight">EMS</h1>
              <p className="text-[10px] text-slate-500 leading-tight">Employee Management System</p>
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-600 font-semibold mt-4 mb-3 px-1">Main Menu</p>
        </div>

        {/* Navigation — each item as separate block */}
        <nav className="px-4 flex-1 flex flex-col gap-2">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? { background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.15))', boxShadow: '0 2px 8px rgba(99,102,241,0.15)' }
                  : {}
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Profile + Edit Profile + Sign Out — bottom section */}
        <div className="px-4 pb-5 pt-3 shrink-0" style={{ borderTop: '1px solid rgba(148, 163, 184, 0.08)' }}>
          {/* Profile card */}
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800/40 mb-3">
            <div className="flex items-center justify-center rounded-full text-white font-bold text-xs shrink-0" style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email || ''}</p>
            </div>
          </div>

          {/* Edit Profile button */}
          <button
            onClick={() => setShowProfileEdit(true)}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200 mb-2"
          >
            <Pencil size={15} />
            Edit Profile
          </button>

          {/* Sign Out — separated with spacing */}
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {showProfileEdit && <ProfileEditModal user={user} onClose={() => setShowProfileEdit(false)} onSave={updateProfile} />}
    </>
  );
}

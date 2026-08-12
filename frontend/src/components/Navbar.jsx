import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, Search, X } from 'lucide-react';
import api from '../services/api';
import { formatDate } from '../utils/formatters';

const pageTitles = {
  '/': 'Dashboard',
  '/employees': 'Employees',
  '/departments': 'Departments',
};

export default function Navbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || 'Dashboard';
  const [query, setQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/employees?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  // Load notifications on mount and when dropdown opens
  useEffect(() => {
    if (!showNotif) return;
    api.get('/dashboard/stats').then((res) => {
      setNotifications(res.data.data.recentActivity || []);
    }).catch(() => {});
  }, [showNotif]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    if (showNotif) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showNotif]);

  return (
    <header
      className="glass fixed top-0 right-0 z-30 flex items-center justify-between px-6"
      style={{ height: 'var(--navbar-height)', left: 'var(--sidebar-width)' }}
    >
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-slate-400 hover:text-white transition-colors"><Menu size={22} /></button>
        <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick search — navigates to /employees?search=... */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 focus-within:border-indigo-500/50 transition-colors">
          <Search size={14} className="text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Quick search..."
            className="bg-transparent text-sm text-slate-300 outline-none w-48 placeholder-slate-500"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="text-slate-500 hover:text-slate-300"><X size={14} /></button>
          )}
        </form>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#6366f1' }} />
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                <button onClick={() => setShowNotif(false)} className="text-slate-500 hover:text-white"><X size={16} /></button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-slate-500">No recent activity.</p>
                ) : notifications.map((n) => (
                  <div key={n.id} className="px-4 py-3 border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-start gap-2">
                      <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.action === 'CREATE' ? 'bg-emerald-400' : n.action === 'DELETE' ? 'bg-red-400' : 'bg-blue-400'}`} />
                      <div>
                        <p className="text-sm text-slate-300">{n.description}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{formatDate(n.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) { header { left: 0 !important; } }
      `}</style>
    </header>
  );
}

import { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  CalendarOff,
  UserX,
  Building2,
  Wallet,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

const STATUS_COLORS = {
  Active: '#10b981',
  'On Leave': '#f59e0b',
  Inactive: '#ef4444',
  Terminated: '#64748b',
};

/* ── Reusable stat card ─────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, gradient }) => (
  <div
    className="flex items-center gap-4 !p-6 !rounded-2xl !hover:transform-none !hover:shadow-none !cursor-default h-full"
    style={{
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(148, 163, 184, 0.12)',
      backdropFilter: 'blur(16px)',
    }}
  >
    <div
      className="flex items-center justify-center rounded-xl shrink-0"
      style={{ width: 52, height: 52, background: `linear-gradient(135deg, ${gradient})` }}
    >
      <Icon size={24} color="white" />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-white leading-tight">{value ?? 0}</p>
    </div>
  </div>
);

/* ── Reusable section card ──────────────────────────────────── */
const SectionCard = ({ children, className = '' }) => (
  <div
    className={`!rounded-2xl !p-6 !hover:transform-none !hover:shadow-none !cursor-default ${className}`}
    style={{
      background: 'rgba(30, 41, 59, 0.7)',
      border: '1px solid rgba(148, 163, 184, 0.08)',
      backdropFilter: 'blur(16px)',
    }}
  >
    {children}
  </div>
);

const SectionTitle = ({ icon: Icon, iconColor, children }) => (
  <div className="flex items-center gap-3 mb-5">
    <Icon size={18} className={iconColor} />
    <h3 className="font-semibold text-white text-[15px]">{children}</h3>
  </div>
);

/* ── Main Dashboard ─────────────────────────────────────────── */
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-16">
        <p className="text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  const activityColors = {
    CREATE: '#10b981',
    UPDATE: '#3b82f6',
    DELETE: '#ef4444',
  };

  return (
    <div className="animate-fadeIn space-y-10">

      {/* ── Heading ── */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Dashboard</h1>
        <p className="text-slate-400 text-sm">Overview of your organization</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 lg:gap-6">
        <StatCard icon={Users} label="Total Employees" value={stats.totalEmployees} gradient="#6366f1, #8b5cf6" />
        <StatCard icon={UserCheck} label="Active" value={stats.activeEmployees} gradient="#10b981, #059669" />
        <StatCard icon={CalendarOff} label="On Leave" value={stats.onLeave} gradient="#f59e0b, #d97706" />
        <StatCard icon={UserX} label="Inactive" value={stats.inactiveEmployees} gradient="#ef4444, #dc2626" />
        <StatCard icon={Building2} label="Departments" value={stats.totalDepartments} gradient="#06b6d4, #3b82f6" />
      </div>

      {/* ── Charts: Department + Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard>
          <SectionTitle icon={BarChart3} iconColor="text-indigo-400">Employees by Department</SectionTitle>
          {stats.departmentStats.length === 0 ? (
            <p className="text-sm text-slate-500">No departments yet.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.departmentStats} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(99,102,241,0.08)' }}
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12, fontSize: 13 }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="count" name="Employees" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>

        <SectionCard>
          <SectionTitle icon={PieChartIcon} iconColor="text-cyan-400">Employees by Status</SectionTitle>
          {stats.statusStats.length === 0 ? (
            <p className="text-sm text-slate-500">No employees yet.</p>
          ) : (
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stats.statusStats} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} stroke="#0f172a">
                    {stats.statusStats.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12, fontSize: 13 }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Salary / Departments / Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard>
          <SectionTitle icon={Wallet} iconColor="text-indigo-400">Salary Overview</SectionTitle>
          <div className="space-y-4">
            {[
              ['Total Payroll', formatCurrency(stats.salaryStats.total), 'font-bold text-white'],
              ['Average Salary', formatCurrency(stats.salaryStats.average), 'font-semibold text-white'],
              ['Minimum', formatCurrency(stats.salaryStats.min), 'text-sm text-slate-300'],
              ['Maximum', formatCurrency(stats.salaryStats.max), 'text-sm text-slate-300'],
            ].map(([label, val, cls]) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-sm text-slate-400">{label}</span>
                <span className={cls}>{val}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard>
          <SectionTitle icon={Building2} iconColor="text-cyan-400">Departments</SectionTitle>
          {stats.departmentStats.length === 0 ? (
            <p className="text-sm text-slate-500">No departments yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.departmentStats.map((d) => (
                <div key={d.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{d.name}</span>
                    <span className="text-slate-400">{d.count} employees</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${stats.totalEmployees ? Math.min(100, (d.count / stats.totalEmployees) * 100) : 0}%`, background: 'linear-gradient(90deg, #6366f1, #06b6d4)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard>
          <SectionTitle icon={Activity} iconColor="text-emerald-400">Recent Activity</SectionTitle>
          {stats.recentActivity.length === 0 ? (
            <p className="text-sm text-slate-500">No activity yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.recentActivity.map((act) => (
                <li key={act.id} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ background: activityColors[act.action] || '#94a3b8' }} />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-300 truncate">{act.description}</p>
                    <p className="text-[11px] text-slate-500">{formatDate(act.created_at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

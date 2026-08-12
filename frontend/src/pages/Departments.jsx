import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Building2,
  Pencil,
  Trash2,
  Users,
  RefreshCw,
  BarChart3,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import api from '../services/api';
import DepartmentFormModal from '../components/DepartmentFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function Departments() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const loadDepartments = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/departments');
      setDepartments(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load departments.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  const handleSave = async (payload) => {
    if (editing) {
      await api.put(`/departments/${editing.id}`, payload);
      toast.success('Department updated successfully.');
    } else {
      await api.post('/departments', payload);
      toast.success('Department created successfully.');
    }
    setShowForm(false);
    setEditing(null);
    loadDepartments();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await api.delete(`/departments/${deleting.id}`);
      toast.success('Department deleted successfully.');
      setDeleting(null);
      loadDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete department.');
    }
  };

  const totalEmployees = departments.reduce((sum, d) => sum + (d.employee_count || 0), 0);
  const chartData = departments.map((d) => ({ name: d.name, count: d.employee_count }));

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Departments</h1>
          <p className="text-slate-400 text-sm mt-1">
            {departments.length} department{departments.length !== 1 ? 's' : ''} · {totalEmployees} employees
          </p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
            <Plus size={16} /> Add Department
          </button>
        )}
      </div>

      {loading ? (
        <div className="card flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : error ? (
        <div className="card text-center py-16">
          <p className="text-red-400 font-medium">{error}</p>
          <button className="btn btn-primary mt-4" onClick={loadDepartments}>
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      ) : departments.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
            <Building2 size={28} color="white" />
          </div>
          <h3 className="text-lg font-semibold text-white">No departments yet</h3>
          <p className="text-slate-400 text-sm mt-2 max-w-sm">
            Create your first department to organize your teams.
          </p>
          {isAdmin && (
            <button className="btn btn-primary mt-5" onClick={() => { setEditing(null); setShowForm(true); }}>
              <Plus size={16} /> Add Department
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Chart */}
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-3 mb-5">
              <BarChart3 size={18} className="text-cyan-400" />
              <h3 className="font-semibold text-white">Employees per Department</h3>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(6,182,212,0.08)' }}
                    contentStyle={{ background: '#1e293b', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 12, fontSize: 13 }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="count" name="Employees" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept, i) => {
              const colors = [
                'linear-gradient(135deg, #6366f1, #8b5cf6)',
                'linear-gradient(135deg, #06b6d4, #3b82f6)',
                'linear-gradient(135deg, #10b981, #059669)',
                'linear-gradient(135deg, #f59e0b, #d97706)',
                'linear-gradient(135deg, #ef4444, #dc2626)',
                'linear-gradient(135deg, #8b5cf6, #d946ef)',
              ];
              return (
                <div key={dept.id} className="card p-5 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="flex items-center justify-center rounded-xl"
                      style={{ width: 44, height: 44, background: colors[i % colors.length] }}
                    >
                      <Building2 size={20} color="white" />
                    </div>
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          className="btn-ghost !p-2 !rounded-lg text-slate-400 hover:text-indigo-400"
                          onClick={() => { setEditing(dept); setShowForm(true); }}
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          className="btn-ghost !p-2 !rounded-lg text-slate-400 hover:text-red-400"
                          onClick={() => setDeleting(dept)}
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>

                  <h3 className="font-semibold text-white">{dept.name}</h3>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2 min-h-[2.5rem]">
                    {dept.description || 'No description provided.'}
                  </p>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800/60">
                    <Users size={15} className="text-slate-500" />
                    <span className="text-sm text-slate-300">
                      <span className="font-bold text-white">{dept.employee_count}</span>{' '}
                      employee{dept.employee_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modals */}
      {showForm && (
        <DepartmentFormModal
          department={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}

      {deleting && (
        <DeleteConfirmModal
          title="Delete Department"
          message={
            deleting.employee_count > 0
              ? `"${deleting.name}" has ${deleting.employee_count} employee(s). You cannot delete a department that still has employees.`
              : `Are you sure you want to delete "${deleting.name}"? This action cannot be undone.`
          }
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

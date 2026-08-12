import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Users,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import useDebounce from '../hooks/useDebounce';
import { formatCurrency, formatDate, getFullName } from '../utils/formatters';
import { EMPLOYEE_STATUSES } from '../utils/constants';
import EmployeeFormModal from '../components/EmployeeFormModal';
import EmployeeDetailModal from '../components/EmployeeDetailModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

const statusBadge = (status) => {
  const map = {
    Active: 'badge badge-active',
    Inactive: 'badge badge-inactive',
    'On Leave': 'badge badge-onleave',
    Terminated: 'badge badge-terminated',
  };
  return map[status] || 'badge';
};

export default function Employees() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [searchParams, setSearchParams] = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const debouncedSearch = useDebounce(search, 300);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/employees', {
        params: {
          page,
          limit,
          search: debouncedSearch,
          department: deptFilter,
          status: statusFilter,
        },
      });
      setEmployees(res.data.data);
      setTotal(res.data.pagination.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load employees.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, deptFilter, statusFilter, refreshKey]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    api
      .get('/departments')
      .then((res) => setDepartments(res.data.data))
      .catch(() => setDepartments([]));
  }, []);

  // Sync search state when URL search param changes (from Quick Search in navbar)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (urlSearch !== search) {
      setSearch(urlSearch);
      setPage(1);
    }
  }, [searchParams]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleSave = async (payload) => {
    if (editing) {
      await api.put(`/employees/${editing.id}`, payload);
      toast.success('Employee updated successfully.');
    } else {
      await api.post('/employees', payload);
      toast.success('Employee added successfully.');
    }
    setShowForm(false);
    setEditing(null);
    setRefreshKey((k) => k + 1);
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await api.delete(`/employees/${deleting.id}`);
      toast.success('Employee deleted successfully.');
      setDeleting(null);
      if (employees.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        setRefreshKey((k) => k + 1);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete employee.');
    }
  };

  const resetFilters = () => {
    setSearch('');
    setDeptFilter('');
    setStatusFilter('');
    setPage(1);
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Employees</h1>
          <p className="text-slate-400 text-sm mt-1">
            {total} employee{total !== 1 ? 's' : ''} in your organization
          </p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>
            <Plus size={16} /> Add Employee
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 flex items-stretch">
            <div className="flex items-center justify-center w-11 rounded-l-xl bg-slate-800/80 border border-slate-600/50 border-r-0 shrink-0">
              <Search size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, email, or employee ID..."
              className="input !rounded-l-none flex-1"
            />
          </div>
          <select
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
            className="input"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="input"
          >
            <option value="">All Statuses</option>
            {EMPLOYEE_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        {(search || deptFilter || statusFilter) && (
          <div className="flex justify-end mt-3">
            <button className="btn btn-ghost text-xs" onClick={resetFilters}>
              <RefreshCw size={14} /> Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="card flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      ) : error ? (
        /* Error state */
        <div className="card text-center py-16">
          <p className="text-red-400 font-medium">{error}</p>
          <button className="btn btn-primary mt-4" onClick={loadEmployees}>
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      ) : employees.length === 0 ? (
        /* Empty state */
        <div className="card flex flex-col items-center justify-center py-20 text-center">
          <div
            className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <Users size={28} color="white" />
          </div>
          <h3 className="text-lg font-semibold text-white">No employees found</h3>
          <p className="text-slate-400 text-sm mt-2 max-w-sm">
            {search || deptFilter || statusFilter
              ? 'No employees match your filters. Try adjusting them.'
              : 'Get started by adding your first employee.'}
          </p>
          {!search && !deptFilter && !statusFilter && (
            <button className="btn btn-primary mt-5" onClick={() => { setEditing(null); setShowForm(true); }}>
              <Plus size={16} /> Add Employee
            </button>
          )}
        </div>
      ) : (
        /* Table */
        <>
          <div className="card p-0 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Salary</th>
                  <th>Hire Date</th>
                  <th>Status</th>
                  <th className="!text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id}>
                    <td className="font-mono text-xs text-indigo-400">{emp.employee_id}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center rounded-lg text-xs font-bold text-white shrink-0"
                          style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                        >
                          {getFullName(emp.first_name, emp.last_name).split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{getFullName(emp.first_name, emp.last_name)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-slate-400">{emp.email}</td>
                    <td className="text-slate-400">{emp.phone || '—'}</td>
                    <td>
                      <span className="text-sm text-slate-300">{emp.departments?.name || '—'}</span>
                    </td>
                    <td className="text-slate-300">{emp.position}</td>
                    <td className="text-slate-300 font-medium">{formatCurrency(emp.salary)}</td>
                    <td className="text-slate-400">{formatDate(emp.hire_date)}</td>
                    <td><span className={statusBadge(emp.status)}>{emp.status}</span></td>
                    <td>
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          className="btn-ghost !p-2 !rounded-lg text-slate-400 hover:text-cyan-400"
                          onClick={() => setViewing(emp)}
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        {isAdmin && (
                          <>
                            <button
                              className="btn-ghost !p-2 !rounded-lg text-slate-400 hover:text-indigo-400"
                              onClick={() => { setEditing(emp); setShowForm(true); }}
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="btn-ghost !p-2 !rounded-lg text-slate-400 hover:text-red-400"
                              onClick={() => setDeleting(emp)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-ghost !py-2"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button
                className="btn btn-ghost !py-2"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      {showForm && (
        <EmployeeFormModal
          employee={editing}
          departments={departments}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}

      {viewing && (
        <EmployeeDetailModal
          employee={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => { setEditing(viewing); setViewing(null); setShowForm(true); }}
        />
      )}

      {deleting && (
        <DeleteConfirmModal
          title="Delete Employee"
          message={`Are you sure you want to delete ${getFullName(deleting.first_name, deleting.last_name)}? This action cannot be undone.`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

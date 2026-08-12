import { X, Pencil, Mail, Phone, MapPin, Calendar, Building2, Briefcase, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, getFullName } from '../utils/formatters';

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-800/60">
    <div className="mt-0.5">
      <Icon size={16} className="text-indigo-400" />
    </div>
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-sm text-slate-200 mt-0.5">{value || '—'}</p>
    </div>
  </div>
);

export default function EmployeeDetailModal({ employee, onClose, onEdit }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center rounded-2xl text-lg font-bold text-white"
              style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              {getFullName(employee.first_name, employee.last_name).split(' ').map((w) => w[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{getFullName(employee.first_name, employee.last_name)}</h2>
              <p className="text-sm text-slate-400 font-mono">{employee.employee_id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button onClick={onEdit} className="btn btn-primary !py-2 !px-3 text-sm" title="Edit">
                <Pencil size={14} /> Edit
              </button>
            )}
            <button onClick={onClose} className="btn btn-ghost !py-2 !px-2 text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              employee.status === 'Active'
                ? 'bg-emerald-500/15 text-emerald-400'
                : employee.status === 'On Leave'
                ? 'bg-amber-500/15 text-amber-400'
                : employee.status === 'Inactive'
                ? 'bg-red-500/15 text-red-400'
                : 'bg-slate-500/15 text-slate-400'
            }`}
          >
            {employee.status}
          </span>
        </div>

        <div className="divide-y divide-slate-800/60">
          <DetailRow icon={Building2} label="Department" value={employee.departments?.name} />
          <DetailRow icon={Briefcase} label="Position" value={employee.position} />
          <DetailRow icon={Wallet} label="Salary" value={formatCurrency(employee.salary)} />
          <DetailRow icon={Mail} label="Email" value={employee.email} />
          <DetailRow icon={Phone} label="Phone" value={employee.phone} />
          <DetailRow icon={Calendar} label="Hire Date" value={formatDate(employee.hire_date)} />
          <DetailRow icon={Calendar} label="Date of Birth" value={formatDate(employee.date_of_birth)} />
          <DetailRow icon={MapPin} label="Address" value={employee.address} />
          <DetailRow
            icon={Calendar}
            label="Added"
            value={`${formatDate(employee.created_at)}`}
          />
        </div>
      </div>
    </div>
  );
}

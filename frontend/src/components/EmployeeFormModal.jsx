import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { EMPLOYEE_STATUSES } from '../utils/constants';

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  address: '',
  department_id: '',
  position: '',
  salary: '',
  hire_date: '',
  status: 'Active',
};

export default function EmployeeFormModal({ employee, departments, onClose, onSave }) {
  const isEdit = !!employee;

  const [values, setValues] = useState(() =>
    isEdit
      ? {
          first_name: employee.first_name || '',
          last_name: employee.last_name || '',
          email: employee.email || '',
          phone: employee.phone || '',
          date_of_birth: employee.date_of_birth || '',
          address: employee.address || '',
          department_id: employee.department_id || '',
          position: employee.position || '',
          salary: employee.salary ?? '',
          hire_date: employee.hire_date || '',
          status: employee.status || 'Active',
        }
      : initialValues
  );
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};

    if (!values.first_name.trim()) errors.first_name = 'First name is required.';
    else if (values.first_name.trim().length < 2) errors.first_name = 'First name must be at least 2 characters.';

    if (!values.last_name.trim()) errors.last_name = 'Last name is required.';
    else if (values.last_name.trim().length < 2) errors.last_name = 'Last name must be at least 2 characters.';

    if (!values.email.trim()) errors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address.';

    if (!values.department_id) errors.department_id = 'Department is required.';
    if (!values.position.trim()) errors.position = 'Position is required.';

    if (values.salary === '' || values.salary === null) errors.salary = 'Salary is required.';
    else if (Number.isNaN(Number(values.salary))) errors.salary = 'Salary must be a number.';
    else if (Number(values.salary) < 0) errors.salary = 'Salary cannot be negative.';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const payload = {
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || null,
        date_of_birth: values.date_of_birth || null,
        address: values.address.trim() || null,
        department_id: values.department_id,
        position: values.position.trim(),
        salary: Number(values.salary),
        hire_date: values.hire_date || new Date().toISOString().slice(0, 10),
        status: values.status,
      };
      await onSave(payload);
    } catch (err) {
      const message = err.response?.data?.message;
      if (message === 'Validation failed.') {
        const details = err.response?.data?.errors?.[0];
        setFieldErrors({ _form: details || 'Please check your inputs.' });
      } else {
        setFieldErrors({ _form: message || 'Something went wrong. Please try again.' });
      }
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field) =>
    `input ${fieldErrors[field] ? '!border-red-500' : ''}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content !max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? 'Edit Employee' : 'Add Employee'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {fieldErrors._form && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
            {fieldErrors._form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">First Name *</label>
              <input
                name="first_name"
                value={values.first_name}
                onChange={handleChange}
                placeholder="John"
                className={inputClass('first_name')}
              />
              {fieldErrors.first_name && <p className="text-xs text-red-400 mt-1">{fieldErrors.first_name}</p>}
            </div>
            <div>
              <label className="input-label">Last Name *</label>
              <input
                name="last_name"
                value={values.last_name}
                onChange={handleChange}
                placeholder="Doe"
                className={inputClass('last_name')}
              />
              {fieldErrors.last_name && <p className="text-xs text-red-400 mt-1">{fieldErrors.last_name}</p>}
            </div>
            <div>
              <label className="input-label">Email *</label>
              <input
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                placeholder="john@company.com"
                className={inputClass('email')}
              />
              {fieldErrors.email && <p className="text-xs text-red-400 mt-1">{fieldErrors.email}</p>}
            </div>
            <div>
              <label className="input-label">Phone</label>
              <input
                name="phone"
                value={values.phone}
                onChange={handleChange}
                placeholder="+1 555 0100"
                className={inputClass('phone')}
              />
            </div>
            <div>
              <label className="input-label">Department *</label>
              <select
                name="department_id"
                value={values.department_id}
                onChange={handleChange}
                className={inputClass('department_id')}
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {fieldErrors.department_id && <p className="text-xs text-red-400 mt-1">{fieldErrors.department_id}</p>}
            </div>
            <div>
              <label className="input-label">Position *</label>
              <input
                name="position"
                value={values.position}
                onChange={handleChange}
                placeholder="Software Engineer"
                className={inputClass('position')}
              />
              {fieldErrors.position && <p className="text-xs text-red-400 mt-1">{fieldErrors.position}</p>}
            </div>
            <div>
              <label className="input-label">Salary (USD) *</label>
              <input
                name="salary"
                type="number"
                min="0"
                step="0.01"
                value={values.salary}
                onChange={handleChange}
                placeholder="75000"
                className={inputClass('salary')}
              />
              {fieldErrors.salary && <p className="text-xs text-red-400 mt-1">{fieldErrors.salary}</p>}
            </div>
            <div>
              <label className="input-label">Hire Date</label>
              <input
                name="hire_date"
                type="date"
                value={values.hire_date}
                onChange={handleChange}
                className={inputClass('hire_date')}
              />
            </div>
            <div>
              <label className="input-label">Date of Birth</label>
              <input
                name="date_of_birth"
                type="date"
                value={values.date_of_birth}
                onChange={handleChange}
                className={inputClass('date_of_birth')}
              />
            </div>
            <div>
              <label className="input-label">Status</label>
              <select
                name="status"
                value={values.status}
                onChange={handleChange}
                className={inputClass('status')}
              >
                {EMPLOYEE_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="input-label">Address</label>
            <textarea
              name="address"
              value={values.address}
              onChange={handleChange}
              placeholder="123 Main St, City"
              rows={2}
              className={`input resize-none ${fieldErrors.address ? '!border-red-500' : ''}`}
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : isEdit ? 'Save Changes' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

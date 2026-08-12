import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function DepartmentFormModal({ department, onClose, onSave }) {
  const isEdit = !!department;

  const [values, setValues] = useState({
    name: department?.name || '',
    description: department?.description || '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!values.name.trim()) errors.name = 'Department name is required.';
    else if (values.name.trim().length < 2) errors.name = 'Department name must be at least 2 characters.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      await onSave({
        name: values.name.trim(),
        description: values.description.trim() || null,
      });
    } catch (err) {
      const message = err.response?.data?.message;
      setFieldErrors({
        _form:
          message === 'Validation failed.'
            ? err.response?.data?.errors?.[0] || 'Please check your inputs.'
            : message || 'Something went wrong. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content !max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? 'Edit Department' : 'Add Department'}
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
          <div>
            <label className="input-label">Department Name *</label>
            <input
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="e.g. Engineering"
              className={`input ${fieldErrors.name ? '!border-red-500' : ''}`}
            />
            {fieldErrors.name && <p className="text-xs text-red-400 mt-1">{fieldErrors.name}</p>}
          </div>

          <div>
            <label className="input-label">Description</label>
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="What does this department do?"
              rows={3}
              className="input resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : isEdit ? 'Save Changes' : 'Create Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileEditModal({ user, onClose, onSave }) {
  const [values, setValues] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errs = {};
    if (!values.name.trim()) errs.name = 'Name is required.';
    else if (values.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    if (!values.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = 'Enter a valid email.';
    if (values.password) {
      if (values.password.length < 8) errs.password = 'Password must be at least 8 characters.';
      if (values.password !== values.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSaving(true);
    try {
      await onSave({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password || undefined,
      });
      toast.success('Profile updated successfully.');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = (f) => `input !rounded-l-none flex-1 ${errors[f] ? '!border-red-500' : ''}`;
  const IconBox = ({ children }) => (
    <div className="flex items-center justify-center w-12 rounded-l-xl bg-slate-800/80 border border-slate-600/50 border-r-0">
      {children}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content !max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div>
            <label className="input-label">Full Name</label>
            <div className="flex items-stretch">
              <IconBox><span className="text-slate-400 text-sm font-bold">A</span></IconBox>
              <input name="name" value={values.name} onChange={handleChange} className={fieldClass('name')} placeholder="Your name" />
            </div>
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="input-label">Email</label>
            <div className="flex items-stretch">
              <IconBox><span className="text-slate-400 text-sm font-bold">@</span></IconBox>
              <input name="email" type="email" value={values.email} onChange={handleChange} className={fieldClass('email')} placeholder="you@company.com" />
            </div>
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="input-label">New Password <span className="text-slate-600">(leave blank to keep current)</span></label>
            <div className="flex items-stretch">
              <IconBox><span className="text-slate-400 text-sm font-bold">•••</span></IconBox>
              <input name="password" type="password" value={values.password} onChange={handleChange} className={fieldClass('password')} placeholder="Min 8 characters" />
            </div>
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
          </div>
          {values.password && (
            <div>
              <label className="input-label">Confirm New Password</label>
              <div className="flex items-stretch">
                <IconBox><span className="text-slate-400 text-sm font-bold">•••</span></IconBox>
                <input name="confirmPassword" type="password" value={values.confirmPassword} onChange={handleChange} className={fieldClass('confirmPassword')} placeholder="Repeat new password" />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
            </div>
          )}
          <div className="flex items-center justify-end gap-3 mt-2">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

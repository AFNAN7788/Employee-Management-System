import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const STRONG_PASSWORD = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

const InputIcon = ({ Icon, children }) => (
  <div className="flex items-stretch">
    <div className="flex items-center justify-center w-12 rounded-l-xl bg-slate-800/80 border border-slate-600/50 border-r-0">
      <Icon size={16} className="text-slate-400" />
    </div>
    {children}
  </div>
);

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!name.trim()) errors.name = 'Name is required.';
    else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters.';
    if (!email.trim()) errors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
    if (!password) errors.password = 'Password is required.';
    else if (!STRONG_PASSWORD.test(password)) errors.password = 'Password must be 8-16 characters with at least one uppercase letter and one special character.';
    if (!confirmPassword) errors.confirmPassword = 'Confirm password is required.';
    else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error('Please fix the highlighted fields.');
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password, confirmPassword);
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      const message = err.response?.data?.message;
      if (message === 'Validation failed.') {
        toast.error(err.response?.data?.errors?.[0] || 'Please check your inputs.');
      } else {
        toast.error(message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldClass = (f) => `input !rounded-l-none flex-1 ${fieldErrors[f] ? '!border-red-500' : ''}`;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0f172a]" />
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-md animate-scaleIn">
        {/* Logo section with proper spacing */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)' }}>
            <Zap size={30} color="white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-3">Create Account</h1>
          <p className="text-slate-400 text-sm leading-relaxed">Set up your Employee Management System account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div>
              <label className="input-label">Full Name</label>
              <InputIcon Icon={User}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className={fieldClass('name')} id="register-name" autoComplete="off" />
              </InputIcon>
              {fieldErrors.name && <p className="text-xs text-red-400 mt-1">{fieldErrors.name}</p>}
            </div>

            <div>
              <label className="input-label">Email Address</label>
              <InputIcon Icon={Mail}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className={fieldClass('email')} id="register-email" autoComplete="off" />
              </InputIcon>
              {fieldErrors.email && <p className="text-xs text-red-400 mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="input-label">Password</label>
              <InputIcon Icon={Lock}>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8-16 chars, uppercase + special" className={fieldClass('password')} id="register-password" autoComplete="off" />
              </InputIcon>
              {fieldErrors.password && <p className="text-xs text-red-400 mt-1">{fieldErrors.password}</p>}
            </div>

            <div>
              <label className="input-label">Confirm Password</label>
              <InputIcon Icon={Lock}>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password" className={fieldClass('confirmPassword')} id="register-confirm-password" autoComplete="off" />
              </InputIcon>
              {fieldErrors.confirmPassword && <p className="text-xs text-red-400 mt-1">{fieldErrors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2" id="register-submit">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

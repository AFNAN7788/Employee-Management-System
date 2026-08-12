import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-white tracking-tight mb-3">Welcome Back</h1>
          <p className="text-slate-400 text-sm leading-relaxed">Sign in to your Employee Management System</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email field — icon outside */}
            <div>
              <label className="input-label">Email Address</label>
              <div className="flex items-stretch">
                <div className="flex items-center justify-center w-12 rounded-l-xl bg-slate-800/80 border border-slate-600/50 border-r-0">
                  <Mail size={16} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input !rounded-l-none flex-1"
                  id="login-email"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Password field — icon outside */}
            <div>
              <label className="input-label">Password</label>
              <div className="flex items-stretch">
                <div className="flex items-center justify-center w-12 rounded-l-xl bg-slate-800/80 border border-slate-600/50 border-r-0">
                  <Lock size={16} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input !rounded-l-none flex-1"
                  id="login-password"
                  autoComplete="off"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400 text-center">
                {errorMsg}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2" id="login-submit">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

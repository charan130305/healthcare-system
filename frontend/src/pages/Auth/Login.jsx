import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User, Lock, HeartPulse, RefreshCw } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const session = await login(username, password);
      if (session.role === 'ROLE_ADMIN') {
        navigate('/admin-dashboard');
      } else if (session.role === 'ROLE_HEALTH_WORKER') {
        navigate('/worker-dashboard');
      } else {
        navigate('/citizen-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (userType) => {
    setUsername(userType);
    setPassword('password'); // mock default
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 relative">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -z-10 h-72 w-72 rounded-full bg-health-300/20 blur-3xl dark:bg-health-950/20"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 -z-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-950/20"></div>

      <div className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white/70 p-8 shadow-2xl backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/70">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-health-600 text-white shadow-glow">
            <HeartPulse className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-sans text-xl font-bold text-slate-800 dark:text-slate-100">Welcome Back</h2>
          <p className="mt-1 text-xs text-slate-400">Access your citizen profile or clinical panel.</p>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Username</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="h-4 w-4" />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="block w-full rounded-xl border border-slate-200 bg-transparent py-2.5 pl-10 pr-3 text-sm focus:border-health-500 focus:outline-none dark:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Password</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-xl border border-slate-200 bg-transparent py-2.5 pl-10 pr-3 text-sm focus:border-health-500 focus:outline-none dark:border-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-between items-center text-xs pt-1">
            <Link to="#" className="text-health-600 hover:underline dark:text-health-400">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-health-600 py-3 text-sm font-extrabold text-white shadow-glow hover:bg-health-500 transition-all disabled:opacity-50"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Sign In
          </button>
        </form>

        {/* Demo Fast Login Shortcuts */}
        <div className="mt-6 border-t border-slate-200/50 pt-5 dark:border-slate-800/50">
          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Demo Accounts Shortcut
          </p>
          <div className="mt-3 flex gap-2 justify-center">
            <button
              onClick={() => handleQuickLogin('citizen')}
              className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Citizen
            </button>
            <button
              onClick={() => handleQuickLogin('worker')}
              className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Health Worker
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Administrator
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-450 dark:text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-health-600 font-semibold hover:underline dark:text-health-400">
            Sign Up Free
          </Link>
        </p>
      </div>
    </div>
  );
}

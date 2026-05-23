import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, UserPlus, HeartPulse, RefreshCw } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    address: '',
    role: 'CITIZEN' // "CITIZEN", "HEALTH_WORKER", "ADMIN"
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(formData);
      alert('Registration successful! Redirecting to login.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 relative py-12">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -z-10 h-72 w-72 rounded-full bg-health-300/20 blur-3xl dark:bg-health-950/20"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 -z-10 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-950/20"></div>

      <div className="w-full max-w-md rounded-2xl border border-slate-200/60 bg-white/70 p-8 shadow-2xl backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/70">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-health-600 text-white shadow-glow">
            <HeartPulse className="h-6 w-6" />
          </div>
          <h2 className="mt-4 font-sans text-xl font-bold text-slate-800 dark:text-slate-100">Create Account</h2>
          <p className="mt-1 text-xs text-slate-400">Join the HealthConnect local coordination system.</p>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInput}
                placeholder="Aarav Patel"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-xs focus:border-health-500 focus:outline-none dark:border-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Username *</label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleInput}
                placeholder="aarav123"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-xs focus:border-health-500 focus:outline-none dark:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInput}
              placeholder="name@domain.com"
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-xs focus:border-health-500 focus:outline-none dark:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Password *</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInput}
                placeholder="••••••"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-xs focus:border-health-500 focus:outline-none dark:border-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInput}
                placeholder="+91 9876543210"
                className="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-xs focus:border-health-500 focus:outline-none dark:border-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Home Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInput}
              placeholder="e.g. Village Rampur, Block C"
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-xs focus:border-health-500 focus:outline-none dark:border-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">System Role Profile *</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInput}
              className="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 text-xs focus:border-health-500 focus:outline-none dark:border-slate-800"
            >
              <option value="CITIZEN">Citizen / Patient</option>
              <option value="HEALTH_WORKER">Healthcare Field Worker</option>
              <option value="ADMIN">Clinical System Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-health-600 py-3 text-sm font-extrabold text-white shadow-glow hover:bg-health-500 transition-all disabled:opacity-50"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Register Profile
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-450 dark:text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-health-600 font-semibold hover:underline dark:text-health-400">
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}

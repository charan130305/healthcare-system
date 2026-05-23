import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { Users, Building, Megaphone, ShieldAlert, BarChart3, Trash2, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  // Hospital Form State
  const [hospForm, setHospForm] = useState({ name: '', address: '', phone: '', latitude: '', longitude: '', type: 'Government', specialties: '', isEmergencyReady: true });

  // Broadcast Alert Form State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const allUsers = await api.admin.getUsers();
      setUsers(allUsers);
      const allHosps = await api.citizen.getHospitals();
      setHospitals(allHosps);
      const stats = await api.admin.getAnalytics();
      setAnalytics(stats);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRole = async (userId, roleName) => {
    try {
      await api.admin.updateUserRole(userId, roleName);
      alert('User role updated successfully!');
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.admin.deleteUser(userId);
      alert('User deleted.');
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddHospital = async (e) => {
    e.preventDefault();
    try {
      await api.admin.addHospital(hospForm);
      alert('New clinic registered successfully!');
      setHospForm({ name: '', address: '', phone: '', latitude: '', longitude: '', type: 'Government', specialties: '', isEmergencyReady: true });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteHospital = async (id) => {
    if (!window.confirm('Delete this clinic facility?')) return;
    try {
      await api.admin.deleteHospital(id);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMsg) return alert('Enter title and message');
    try {
      await api.admin.broadcast(broadcastTitle, broadcastMsg);
      alert('System alert broadcasted to all active accounts!');
      setBroadcastTitle('');
      setBroadcastMsg('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans">
      <Navbar />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-5xl mx-auto w-full">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
              System Admin Console
            </h1>
            <p className="text-xs text-slate-400">Review public health charts, manage system users, edit clinic registries, and broadcast alerts.</p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-glass dark:border-slate-800 dark:bg-slate-900/50 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">System Users</p>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{analytics?.totalUsers || 0}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-glass dark:border-slate-800 dark:bg-slate-900/50 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Clinics Registry</p>
              <p className="text-xl font-extrabold text-health-600 mt-0.5">{analytics?.totalHospitals || 0}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-glass dark:border-slate-800 dark:bg-slate-900/50 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Consultations</p>
              <p className="text-xl font-extrabold text-cyan-600 mt-0.5">{analytics?.totalAppointments || 0}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-glass dark:border-slate-800 dark:bg-slate-900/50 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Local Reports</p>
              <p className="text-xl font-extrabold text-amber-600 mt-0.5">{analytics?.totalComplaints || 0}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-glass dark:border-slate-800 dark:bg-slate-900/50 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Active SOS Alerts</p>
              <p className="text-xl font-extrabold text-red-600 mt-0.5">{analytics?.activeSOSAlerts || 0}</p>
            </div>
          </div>

          {/* Recharts Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Disease trends bar chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
              <h3 className="font-bold text-sm text-slate-850 dark:text-slate-200 flex items-center gap-1.5 mb-4">
                <BarChart3 className="h-4.5 w-4.5 text-health-500" />
                Active Epidemic & Disease Density (Disease Trends)
              </h3>
              <div className="h-48 w-full text-xs">
                {analytics?.diseaseTrends ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.diseaseTrends}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip />
                      <Bar dataKey="cases" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">Loading charts...</div>
                )}
              </div>
            </div>

            {/* Regional cases density area chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
              <h3 className="font-bold text-sm text-slate-850 dark:text-slate-200 flex items-center gap-1.5 mb-4">
                <BarChart3 className="h-4.5 w-4.5 text-cyan-500" />
                Regional Case Density & Citizen Engagement
              </h3>
              <div className="h-48 w-full text-xs">
                {analytics?.regionalStats ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.regionalStats}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="region" stroke="#64748b" fontSize={10} />
                      <YAxis stroke="#64748b" fontSize={10} />
                      <Tooltip />
                      <Area type="monotone" dataKey="citizens" stackId="1" stroke="#3b82f6" fill="#93c5fd" fillOpacity={0.4} />
                      <Area type="monotone" dataKey="cases" stackId="2" stroke="#ef4444" fill="#fca5a5" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">Loading charts...</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Left: User Directory Grid (span 2) */}
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
                  <Users className="h-4.5 w-4.5 text-health-500" />
                  System Directory Roles Control
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 pb-2 font-semibold">
                        <th className="py-2">User Details</th>
                        <th>Registered Role</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="py-3">
                            <p className="font-bold text-slate-700 dark:text-slate-350">{u.fullName}</p>
                            <p className="text-[10px] text-slate-450 font-mono mt-0.5">{u.email}</p>
                          </td>
                          <td className="font-semibold text-slate-650 dark:text-slate-400 capitalize">
                            {u.role.replace('ROLE_', '').replace('_', ' ').toLowerCase()}
                          </td>
                          <td className="text-right space-x-1.5">
                            {u.role === 'ROLE_CITIZEN' && (
                              <button
                                onClick={() => handleUpdateRole(u.id, 'HEALTH_WORKER')}
                                className="rounded bg-health-50 px-2 py-1 text-[9px] font-bold text-health-600 hover:bg-health-100"
                              >
                                Promote Worker
                              </button>
                            )}
                            {u.role === 'ROLE_HEALTH_WORKER' && (
                              <button
                                onClick={() => handleUpdateRole(u.id, 'CITIZEN')}
                                className="rounded bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-600 hover:bg-slate-200"
                              >
                                Demote Citizen
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="rounded bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hospital Registry Manager */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
                  <Building className="h-4.5 w-4.5 text-health-500" />
                  Clinic Registry Directory
                </h3>
                <div className="space-y-3">
                  {hospitals.map(h => (
                    <div key={h.id} className="rounded-xl border border-slate-150 p-3 dark:border-slate-850 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-slate-700 dark:text-slate-300">{h.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{h.address}</p>
                        <span className="text-[9px] rounded bg-health-50/50 px-2 py-0.5 font-semibold text-health-600 mt-2 inline-block">
                          {h.type} | Specialities: {h.specialties}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteHospital(h.id)}
                        className="rounded bg-red-50 p-1.5 text-red-650 hover:bg-red-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Broadcaster Form, Hospital Adder Form */}
            <div className="space-y-6">
              {/* Alert Broadcaster */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
                <h3 className="font-bold text-sm text-slate-850 dark:text-slate-200 flex items-center gap-2 mb-3">
                  <Megaphone className="h-4.5 w-4.5 text-red-500" />
                  Broadcast Public Health Alert
                </h3>
                <form onSubmit={handleBroadcast} className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400">Alert Title *</label>
                    <input
                      type="text"
                      required
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      placeholder="e.g. Dengue Prevention Drive"
                      className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400">Broadcast Message *</label>
                    <textarea
                      required
                      value={broadcastMsg}
                      onChange={(e) => setBroadcastMsg(e.target.value)}
                      placeholder="Enter the alert information details for all citizen dashboards..."
                      rows="3"
                      className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-red-600 py-2.5 font-bold text-white shadow-lg hover:bg-red-700 transition-all flex items-center justify-center gap-1.5"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    Transmit Alert Signal
                  </button>
                </form>
              </div>

              {/* Add Hospital Facility Registry Form */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
                <h3 className="font-bold text-sm text-slate-850 dark:text-slate-200 flex items-center gap-2 mb-3">
                  <Plus className="h-4.5 w-4.5 text-health-500" />
                  Register Healthcare Facility
                </h3>
                <form onSubmit={handleAddHospital} className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400">Facility Name *</label>
                    <input
                      type="text"
                      required
                      value={hospForm.name}
                      onChange={(e) => setHospForm({ ...hospForm, name: e.target.value })}
                      placeholder="e.g. Rampur Primary Health Centre"
                      className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400">Address Location *</label>
                    <input
                      type="text"
                      required
                      value={hospForm.address}
                      onChange={(e) => setHospForm({ ...hospForm, address: e.target.value })}
                      placeholder="Main Road, Block B, Rampur"
                      className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-600 dark:text-slate-400">Latitude GPS *</label>
                      <input
                        type="number"
                        step="0.0001"
                        required
                        value={hospForm.latitude}
                        onChange={(e) => setHospForm({ ...hospForm, latitude: e.target.value })}
                        placeholder="28.6139"
                        className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 dark:text-slate-400">Longitude GPS *</label>
                      <input
                        type="number"
                        step="0.0001"
                        required
                        value={hospForm.longitude}
                        onChange={(e) => setHospForm({ ...hospForm, longitude: e.target.value })}
                        placeholder="77.2090"
                        className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-600 dark:text-slate-400">Facility Type *</label>
                      <select
                        value={hospForm.type}
                        onChange={(e) => setHospForm({ ...hospForm, type: e.target.value })}
                        className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                      >
                        <option value="Government">Government</option>
                        <option value="Private">Private</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 dark:text-slate-400">Phone Contact *</label>
                      <input
                        type="tel"
                        required
                        value={hospForm.phone}
                        onChange={(e) => setHospForm({ ...hospForm, phone: e.target.value })}
                        placeholder="+91 11 234567"
                        className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400">Specialities (comma split) *</label>
                    <input
                      type="text"
                      required
                      value={hospForm.specialties}
                      onChange={(e) => setHospForm({ ...hospForm, specialties: e.target.value })}
                      placeholder="General Consult, Maternity, Pediatrics"
                      className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-health-600 py-2.5 font-bold text-white shadow-glow hover:bg-health-500 transition-all"
                  >
                    Register Facility
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

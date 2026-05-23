import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import { Calendar, AlertCircle, Heart, Phone, Clipboard, ArrowRight, User, PlusCircle } from 'lucide-react';

export default function WorkerDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [users, setUsers] = useState([]);

  // Medical Record Logger Form State
  const [citizenId, setCitizenId] = useState('');
  const [diagnoses, setDiagnoses] = useState('');
  const [prescriptions, setPrescriptions] = useState('');
  const [bp, setBp] = useState('');
  const [hr, setHr] = useState('');
  const [notes, setNotes] = useState('');

  // Vaccination Logger State
  const [vCitizenId, setVCitizenId] = useState('');
  const [vaccineName, setVaccineName] = useState('');
  const [doseNumber, setDoseNumber] = useState('1');
  const [nextDose, setNextDose] = useState('');

  useEffect(() => {
    fetchWorkerData();
  }, []);

  const fetchWorkerData = async () => {
    try {
      const apps = await api.worker.getAppointments();
      setAppointments(apps);
      const comps = await api.worker.getComplaints();
      setComplaints(comps);
      const ems = await api.worker.getEmergencies();
      setEmergencies(ems);
      const allUsers = await api.admin.getUsers();
      setUsers(allUsers.filter(u => u.role === 'ROLE_CITIZEN'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAppStatus = async (id, status) => {
    try {
      await api.worker.updateAppointmentStatus(id, status);
      fetchWorkerData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSOS = async (id, status) => {
    try {
      await api.worker.dispatchEmergency(id, status);
      fetchWorkerData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogVitals = async (e) => {
    e.preventDefault();
    if (!citizenId) return alert('Select a citizen');
    try {
      await api.worker.addHealthRecord(citizenId, { diagnoses, prescriptions, bloodPressure: bp, heartRate: hr, notes });
      alert('Vitals and prescriptions saved to patient file!');
      setCitizenId('');
      setDiagnoses('');
      setPrescriptions('');
      setBp('');
      setHr('');
      setNotes('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogVaccine = async (e) => {
    e.preventDefault();
    if (!vCitizenId) return alert('Select a citizen');
    try {
      await api.worker.addVaccination(vCitizenId, { vaccineName, doseNumber, nextDoseDue: nextDose });
      alert('Vaccine record added successfully!');
      setVCitizenId('');
      setVaccineName('');
      setDoseNumber('1');
      setNextDose('');
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
              Healthcare Worker Console
            </h1>
            <p className="text-xs text-slate-400">Manage patient queues, dispatch emergency services, and record immunization statuses.</p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Pending SOS Alerts</p>
              <p className="text-2xl font-extrabold text-red-600 mt-0.5">
                {emergencies.filter(e => e.status === 'PENDING').length} Active
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Consultations Today</p>
              <p className="text-2xl font-extrabold text-health-600 mt-0.5">
                {appointments.filter(a => a.status === 'PENDING').length} Pending
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Sanitation Reports</p>
              <p className="text-2xl font-extrabold text-amber-600 mt-0.5">
                {complaints.filter(c => c.status === 'PENDING').length} Unchecked
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Registered Citizens</p>
              <p className="text-2xl font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">
                {users.length} Active
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Active SOS Alerts, Appointments Schedule */}
            <div className="md:col-span-2 space-y-6">
              {/* Emergency SOS Alarm Board */}
              {emergencies.some(e => e.status === 'PENDING' || e.status === 'DISPATCHED') && (
                <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5 shadow-glass dark:border-red-950/20 dark:bg-red-950/5">
                  <h3 className="font-bold text-sm text-red-700 dark:text-red-400 flex items-center gap-2 mb-3">
                    <Phone className="h-4.5 w-4.5 animate-bounce" />
                    LIVE EMERGENCY DISPATCH WORKBOARD
                  </h3>
                  <div className="space-y-4">
                    {emergencies.filter(e => e.status !== 'RESOLVED').map(sos => (
                      <div key={sos.id} className="rounded-xl border border-red-200/50 bg-white p-4 dark:border-red-900/40 dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="text-xs space-y-1">
                          <p className="font-bold text-slate-800 dark:text-slate-100">Patient: {sos.citizenName}</p>
                          <p className="text-slate-500 dark:text-slate-400 font-mono">Location GPS: {sos.latitude.toFixed(4)}, {sos.longitude.toFixed(4)}</p>
                          <p className="text-slate-500 dark:text-slate-400">Phone: {sos.contactPhone}</p>
                          <p className="text-[11px] italic text-red-600 dark:text-red-400 mt-1">"{sos.description}"</p>
                        </div>
                        <div className="flex gap-2 text-[10px] font-bold">
                          {sos.status === 'PENDING' && (
                            <button
                              onClick={() => handleUpdateSOS(sos.id, 'DISPATCHED')}
                              className="rounded-lg bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                            >
                              Dispatch Ambulance
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateSOS(sos.id, 'RESOLVED')}
                            className="rounded-lg bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700"
                          >
                            Mark Resolved
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Consultation Schedules List */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
                  <Calendar className="h-4.5 w-4.5 text-health-500" />
                  Appointment Slot Queue
                </h3>
                {appointments.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">No scheduled consultations.</div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map(app => (
                      <div key={app.id} className="rounded-xl border border-slate-150 p-4 dark:border-slate-850 flex justify-between items-start text-xs">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-700 dark:text-slate-200">{app.citizenName}</p>
                          <p className="text-slate-400">{app.hospitalName} - {app.doctorName}</p>
                          <p className="text-slate-450 font-mono text-[10px]">{app.appointmentDate} | {app.timeSlot}</p>
                          {app.symptoms && <p className="text-[10px] text-slate-500 mt-1 italic">"{app.symptoms}"</p>}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            app.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {app.status}
                          </span>
                          {app.status === 'PENDING' && (
                            <div className="flex gap-1 text-[9px] font-bold mt-1">
                              <button
                                onClick={() => handleUpdateAppStatus(app.id, 'APPROVED')}
                                className="rounded bg-health-50 px-2 py-1 text-health-600 hover:bg-health-100"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateAppStatus(app.id, 'COMPLETED')}
                                className="rounded bg-emerald-50 px-2 py-1 text-emerald-600 hover:bg-emerald-100"
                              >
                                Complete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Vitals Form, Vaccination Form */}
            <div className="space-y-6 text-xs">
              {/* Record Health Vitals Form */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                  <Clipboard className="h-4.5 w-4.5 text-health-500" />
                  Log Patient Vitals & Prescriptions
                </h3>
                <form onSubmit={handleLogVitals} className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400">Select Patient Citizen *</label>
                    <select
                      required
                      value={citizenId}
                      onChange={(e) => setCitizenId(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                    >
                      <option value="">Choose Citizen</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.fullName} (id: {u.id})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-600 dark:text-slate-400">Blood Pressure</label>
                      <input
                        type="text"
                        value={bp}
                        onChange={(e) => setBp(e.target.value)}
                        placeholder="e.g. 120/80"
                        className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 dark:text-slate-400">Heart Rate</label>
                      <input
                        type="text"
                        value={hr}
                        onChange={(e) => setHr(e.target.value)}
                        placeholder="e.g. 72 bpm"
                        className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400">Diagnosis Diagnosis *</label>
                    <input
                      type="text"
                      required
                      value={diagnoses}
                      onChange={(e) => setDiagnoses(e.target.value)}
                      placeholder="e.g. Viral Fever / Stomach Infection"
                      className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400">Prescriptions Instructions *</label>
                    <textarea
                      required
                      value={prescriptions}
                      onChange={(e) => setPrescriptions(e.target.value)}
                      placeholder="e.g. Tab Paracetamol 650mg TDS x 3 Days"
                      rows="2"
                      className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400">Doctor Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Drink ORS fluids, check vitals daily..."
                      rows="2"
                      className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-health-600 py-2.5 font-bold text-white shadow-glow hover:bg-health-500 transition-all"
                  >
                    Commit Patient Record
                  </button>
                </form>
              </div>

              {/* Log Immunization Form */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-3">
                  <PlusCircle className="h-4.5 w-4.5 text-emerald-500" />
                  Log Immunization Dose
                </h3>
                <form onSubmit={handleLogVaccine} className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400">Select Patient Citizen *</label>
                    <select
                      required
                      value={vCitizenId}
                      onChange={(e) => setVCitizenId(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                    >
                      <option value="">Choose Citizen</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>{u.fullName} (id: {u.id})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-600 dark:text-slate-400">Vaccine Name *</label>
                      <input
                        type="text"
                        required
                        value={vaccineName}
                        onChange={(e) => setVaccineName(e.target.value)}
                        placeholder="e.g. Hepatitis B / Polio"
                        className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 dark:text-slate-400">Dose Number *</label>
                      <select
                        value={doseNumber}
                        onChange={(e) => setDoseNumber(e.target.value)}
                        className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                      >
                        <option value="1">Dose #1</option>
                        <option value="2">Dose #2</option>
                        <option value="3">Dose #3</option>
                        <option value="4">Booster</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-600 dark:text-slate-400">Next Dose Due Date</label>
                    <input
                      type="date"
                      value={nextDose}
                      onChange={(e) => setNextDose(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-2.5 py-1.5 focus:border-health-500 focus:outline-none dark:border-slate-800"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-emerald-600 py-2.5 font-bold text-white shadow-lg hover:bg-emerald-700 transition-all"
                  >
                    Commit Vaccine Record
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

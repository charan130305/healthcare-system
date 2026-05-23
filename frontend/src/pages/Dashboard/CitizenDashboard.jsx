import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Navbar from '../../components/Layout/Navbar';
import Sidebar from '../../components/Layout/Sidebar';
import SOSButton from '../../components/Widgets/SOSButton';
import AIHealthAssistant from '../../components/Widgets/AIHealthAssistant';
import { Calendar, AlertCircle, Heart, ShieldAlert, Sparkles, Plus, Clock, FileText, CheckCircle } from 'lucide-react';

export default function CitizenDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  
  // Appointment Form Modal State
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [appForm, setAppForm] = useState({ hospitalId: '', doctorName: '', appointmentDate: '', timeSlot: '09:00 AM - 10:00 AM', symptoms: '' });
  
  // Complaint Form State
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [compForm, setCompForm] = useState({ title: '', description: '', category: 'Sanitation', priority: 'MEDIUM' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const apps = await api.citizen.getAppointments();
      setAppointments(apps);
      const comps = await api.citizen.getComplaints();
      setComplaints(comps);
      const recs = await api.citizen.getHealthRecords();
      setHealthRecords(recs);
      const vaccs = await api.citizen.getVaccinations();
      setVaccinations(vaccs);
      const hosps = await api.citizen.getHospitals();
      setHospitals(hosps);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      await api.citizen.bookAppointment(appForm);
      alert('Appointment slot booked successfully!');
      setIsBookModalOpen(false);
      fetchDashboardData();
      setAppForm({ hospitalId: '', doctorName: '', appointmentDate: '', timeSlot: '09:00 AM - 10:00 AM', symptoms: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileComplaint = async (e) => {
    e.preventDefault();
    try {
      await api.citizen.fileComplaint(compForm);
      alert('Environmental health report logged successfully!');
      setIsCompModalOpen(false);
      fetchDashboardData();
      setCompForm({ title: '', description: '', category: 'Sanitation', priority: 'MEDIUM' });
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Citizen Health Hub
                <Sparkles className="h-5 w-5 text-amber-500 fill-amber-500" />
              </h1>
              <p className="text-xs text-slate-400">View prescriptions, book health services, and log local sanitation reports.</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsBookModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-health-600 px-4 py-2.5 text-xs font-bold text-white shadow-glow hover:bg-health-500 transition-all"
              >
                <Plus className="h-4 w-4" />
                Book Consultation
              </button>
              <button
                onClick={() => setIsCompModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition-all"
              >
                <AlertCircle className="h-4 w-4 text-red-500" />
                Log Area Report
              </button>
            </div>
          </div>

          {/* Citizen Health Stats Ticker Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Upcoming Appointments */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-glass dark:border-slate-800 dark:bg-slate-900/50 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-health-50 dark:bg-health-950/20 text-health-600 dark:text-health-400">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Consultation Slots</p>
                <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{appointments.length} Active</p>
              </div>
            </div>

            {/* Immunizations */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-glass dark:border-slate-800 dark:bg-slate-900/50 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Vaccine Status</p>
                <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{vaccinations.length} Doses Logged</p>
              </div>
            </div>

            {/* Submitted Complaints */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-glass dark:border-slate-800 dark:bg-slate-900/50 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Sanitation Reports</p>
                <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 mt-0.5">{complaints.length} Logged</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Col: Health Profile Vitals, Vaccination History */}
            <div className="md:col-span-2 space-y-6">
              {/* Medical Record Folder */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
                  <FileText className="h-4.5 w-4.5 text-health-500" />
                  Prescriptions & Medical Vitals
                </h3>
                {healthRecords.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">No medical consultations recorded yet.</div>
                ) : (
                  healthRecords.map(rec => (
                    <div key={rec.id} className="rounded-xl border border-slate-100 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-health-600 dark:text-health-400">Diag: {rec.diagnoses}</span>
                        <span className="text-[10px] text-slate-400">{new Date(rec.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-650 leading-relaxed dark:text-slate-350">
                        <strong className="text-slate-700 dark:text-slate-300">Prescription:</strong> {rec.prescriptions}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                        <span>Blood Pressure: <strong className="text-slate-650 dark:text-slate-300">{rec.bloodPressure}</strong></span>
                        <span>Heart Rate: <strong className="text-slate-650 dark:text-slate-300">{rec.heartRate}</strong></span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Immunization History */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
                  Immunization Record
                </h3>
                {vaccinations.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">No vaccinations recorded.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-800 pb-2">
                          <th className="py-2">Vaccine Name</th>
                          <th>Dose Number</th>
                          <th>Date Administered</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vaccinations.map(v => (
                          <tr key={v.id} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-3 font-semibold text-slate-700 dark:text-slate-300">{v.vaccineName}</td>
                            <td>Dose #{v.doseNumber}</td>
                            <td className="font-mono text-slate-500">{v.dateAdministered}</td>
                            <td>
                              <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-450">
                                {v.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: AI Assistant, Area Complaints */}
            <div className="space-y-6">
              <AIHealthAssistant />

              {/* Complaints / Environmental Tracker */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-glass dark:border-slate-800 dark:bg-slate-900/50">
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3">
                  My Area Reports
                </h3>
                {complaints.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">No issues reported in your sector.</div>
                ) : (
                  <div className="space-y-3">
                    {complaints.map(c => (
                      <div key={c.id} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0 dark:border-slate-800">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-xs text-slate-700 dark:text-slate-200 leading-snug">{c.title}</h4>
                          <span className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                            c.status === 'PENDING' 
                              ? 'bg-amber-55 text-amber-600 bg-amber-50 dark:bg-amber-950/20' 
                              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                          }`}>
                            {c.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 capitalize">Category: {c.category}</p>
                        {c.adminResponse && (
                          <div className="mt-2 rounded-lg bg-health-50/50 p-2 border border-health-100/30 text-[10px] text-health-700 dark:bg-health-950/10 dark:border-health-950/30 dark:text-health-450">
                            <strong>Response:</strong> {c.adminResponse}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <SOSButton />

      {/* Appointment Booking Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-850">
            <h2 className="font-sans text-base font-bold text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800">
              Book Health Consultation Slot
            </h2>
            <form onSubmit={handleBookAppointment} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400">Select Clinic Facility *</label>
                <select
                  required
                  value={appForm.hospitalId}
                  onChange={(e) => setAppForm({ ...appForm, hospitalId: e.target.value })}
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 focus:border-health-500 focus:outline-none dark:border-slate-800"
                >
                  <option value="">Choose Hospital</option>
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>{h.name} ({h.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400">Doctor / Department Name *</label>
                <input
                  type="text"
                  required
                  value={appForm.doctorName}
                  onChange={(e) => setAppForm({ ...appForm, doctorName: e.target.value })}
                  placeholder="e.g. Dr. Ramesh Kumar (Pediatrics)"
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 focus:border-health-500 focus:outline-none dark:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400">Consultation Date *</label>
                  <input
                    type="date"
                    required
                    value={appForm.appointmentDate}
                    onChange={(e) => setAppForm({ ...appForm, appointmentDate: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 focus:border-health-500 focus:outline-none dark:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400">Preferred Hours *</label>
                  <select
                    value={appForm.timeSlot}
                    onChange={(e) => setAppForm({ ...appForm, timeSlot: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 focus:border-health-500 focus:outline-none dark:border-slate-800"
                  >
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400">Symptoms Brief</label>
                <textarea
                  value={appForm.symptoms}
                  onChange={(e) => setAppForm({ ...appForm, symptoms: e.target.value })}
                  placeholder="e.g. Mild cough or dry throat..."
                  rows="3"
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 focus:border-health-500 focus:outline-none dark:border-slate-800"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-transparent px-4 py-2 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-health-600 px-4 py-2 text-white hover:bg-health-500 shadow-glow"
                >
                  Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Logger Modal */}
      {isCompModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-850">
            <h2 className="font-sans text-base font-bold text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-100 dark:border-slate-800">
              Report Sanitation / Environmental Health Issue
            </h2>
            <form onSubmit={handleFileComplaint} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400">Issue Title *</label>
                <input
                  type="text"
                  required
                  value={compForm.title}
                  onChange={(e) => setCompForm({ ...compForm, title: e.target.value })}
                  placeholder="e.g. Water leaking near public pipeline"
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 focus:border-health-500 focus:outline-none dark:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400">Category *</label>
                  <select
                    value={compForm.category}
                    onChange={(e) => setCompForm({ ...compForm, category: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 focus:border-health-500 focus:outline-none dark:border-slate-800"
                  >
                    <option value="Sanitation">Poor Sanitation</option>
                    <option value="Water Contamination">Water Contamination</option>
                    <option value="Medicine Shortage">Medicine Shortage</option>
                    <option value="Other">Other Issues</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-600 dark:text-slate-400">Priority Level *</label>
                  <select
                    value={compForm.priority}
                    onChange={(e) => setCompForm({ ...compForm, priority: e.target.value })}
                    className="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 focus:border-health-500 focus:outline-none dark:border-slate-800"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 dark:text-slate-400">Description *</label>
                <textarea
                  required
                  value={compForm.description}
                  onChange={(e) => setCompForm({ ...compForm, description: e.target.value })}
                  placeholder="Describe the sanitation risk, exact location markers, or medication shortages..."
                  rows="3"
                  className="mt-1 block w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2 focus:border-health-500 focus:outline-none dark:border-slate-800"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCompModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-transparent px-4 py-2 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-health-600 px-4 py-2 text-white hover:bg-health-500 shadow-glow"
                >
                  Log Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

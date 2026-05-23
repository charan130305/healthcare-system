import React, { useState, useEffect } from 'react';
import { AlertOctagon, Phone, X, AlertTriangle } from 'lucide-react';
import { api } from '../../services/api';

export default function SOSButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [phone, setPhone] = useState('');
  const [desc, setDesc] = useState('');
  const [sent, setSent] = useState(false);
  const [coords, setCoords] = useState({ lat: 28.6139, lng: 77.2090 }); // Default New Delhi

  useEffect(() => {
    // Fetch user details for default phone
    const session = api.auth.getCurrentUser();
    if (session?.phone) {
      setPhone(session.phone);
    }
    
    // Auto query location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.log('Geolocation prompt skipped or rejected')
      );
    }
  }, []);

  useEffect(() => {
    let timer;
    if (triggering && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (triggering && countdown === 0) {
      submitSOS();
    }
    return () => clearTimeout(timer);
  }, [triggering, countdown]);

  const startSOSTrigger = () => {
    if (!phone) {
      alert('Please enter a contact phone number for the dispatch team.');
      return;
    }
    setCountdown(3);
    setTriggering(true);
  };

  const cancelSOS = () => {
    setTriggering(false);
    setCountdown(3);
  };

  const submitSOS = async () => {
    try {
      await api.citizen.triggerSOS({
        latitude: coords.lat,
        longitude: coords.lng,
        contactPhone: phone,
        description: desc || 'Medical SOS emergency alarm triggered.'
      });
      setSent(true);
      setTriggering(false);
    } catch (err) {
      console.error(err);
      alert('Failed to trigger SOS. Check internet connection.');
      setTriggering(false);
    }
  };

  const resetSOS = () => {
    setSent(false);
    setIsOpen(false);
    setDesc('');
  };

  return (
    <>
      {/* SOS Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:bg-red-700 transition-all hover:scale-105 active:scale-95 group"
      >
        <span className="absolute inset-0 rounded-full bg-red-600 sos-ring opacity-75"></span>
        <AlertOctagon className="h-8 w-8 relative z-10" />
      </button>

      {/* SOS Trigger Panel Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-red-500/20">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <h2 className="font-sans text-lg font-bold">EMERGENCY SOS DISPATCH</h2>
              </div>
              {!triggering && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {!sent ? (
              <div className="mt-4 space-y-4">
                {triggering ? (
                  <div className="flex flex-col items-center py-8">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 text-5xl font-extrabold sos-ring">
                      {countdown}
                    </div>
                    <p className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                      Broadcasting location to ambulances and local clinics...
                    </p>
                    <button
                      onClick={cancelSOS}
                      className="mt-6 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                    >
                      ABORT ALERT
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
                      This triggers an immediate emergency alert to the nearest rural health workers, ambulances, and administrators. Your current GPS coordinates will be captured.
                    </p>
                    
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Active Mobile Number *
                      </label>
                      <div className="relative mt-1 flex rounded-lg shadow-sm">
                        <span className="inline-flex items-center rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 px-3 text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-800">
                          <Phone className="h-3.5 w-3.5" />
                        </span>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +91 9876543210"
                          className="block w-full rounded-r-lg border border-slate-200 bg-transparent px-3 py-2 text-sm focus:border-health-500 focus:outline-none dark:border-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Describe Symptoms / Situation (Optional)
                      </label>
                      <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="e.g. Chest pain, difficulty breathing, or accident location detail..."
                        rows="3"
                        className="mt-1 block w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm focus:border-health-500 focus:outline-none dark:border-slate-800"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <div className="text-[10px] text-slate-400 flex-1">
                        Detected Coordinates: <span className="font-mono text-slate-500">{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
                      </div>
                    </div>

                    <button
                      onClick={startSOSTrigger}
                      className="w-full rounded-xl bg-red-600 py-3 text-sm font-extrabold text-white shadow-lg hover:bg-red-700 active:scale-95 transition-all"
                    >
                      ACTIVATE EMERGENCY ALARM
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center py-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-100">SOS Signal Broadcasted</h3>
                <p className="mt-2 text-xs text-slate-500 max-w-xs dark:text-slate-400">
                  Your coordinates have been dispatched. Emergency responders have been alerted. Keep your mobile line reachable!
                </p>
                <button
                  onClick={resetSOS}
                  className="mt-6 rounded-xl bg-slate-100 px-6 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  DISMISS
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

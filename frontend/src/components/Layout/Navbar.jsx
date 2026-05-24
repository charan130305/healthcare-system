import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Sun, Moon, LogOut, ShieldAlert, HeartPulse } from 'lucide-react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Sync dark mode preference
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const data = await api.citizen.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async () => {
    try {
      await api.citizen.markNotificationsRead();
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/50 bg-white/75 px-6 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-900/75">
      <div className="flex items-center gap-3">
        <HeartPulse className="h-8 w-8 text-health-600 dark:text-health-400" />
        <span className="font-sans text-xl font-extrabold tracking-tight bg-gradient-to-r from-health-700 to-cyan-500 bg-clip-text text-transparent dark:from-health-400 dark:to-cyan-400">
          HealthConnect
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
        >
          {darkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications Center */}
        {user && (
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDropdown(!showNotifDropdown);
                if (!showNotifDropdown && unreadCount > 0) markAsRead();
              }}
              className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900">
                <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">Alerts & Messages</h3>
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-3 text-center text-xs text-slate-400">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        className={`flex gap-3 px-3 py-2 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                          !n.isRead ? 'bg-health-50/50 dark:bg-health-950/20' : ''
                        }`}
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-slate-700 dark:text-slate-200">{n.title}</p>
                          <p className="mt-1 text-slate-500 dark:text-slate-400 leading-relaxed">{n.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Account / Profile Info */}
        {user ? (
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="hidden text-right md:block">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{user.fullName}</p>
              <p className="text-[10px] text-slate-400 capitalize">{user.role.replace('ROLE_', '').replace('_', ' ').toLowerCase()}</p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 rounded-xl bg-health-600 px-4 py-2 text-sm font-semibold text-white hover:bg-health-500 shadow-glow transition-all"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

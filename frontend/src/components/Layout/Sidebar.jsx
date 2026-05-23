import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  AlertCircle,
  Megaphone,
  Activity,
  Heart,
  Users,
  Shield,
  MessageCircle,
  HelpCircle,
  Building
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  
  if (!user) return null;

  const role = user.role;

  const citizenLinks = [
    { to: '/citizen-dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { to: '/appointments', label: 'Appointments', icon: Calendar },
    { to: '/complaints', label: 'File Complaint', icon: AlertCircle },
    { to: '/health-profile', label: 'Health Profile', icon: Activity },
    { to: '/chatbot', label: 'AI Health Help', icon: HelpCircle }
  ];

  const workerLinks = [
    { to: '/worker-dashboard', label: 'Worker Panel', icon: LayoutDashboard },
    { to: '/worker/appointments', label: 'Schedules', icon: Calendar },
    { to: '/worker/complaints', label: 'Area Reports', icon: AlertCircle },
    { to: '/worker/records', label: 'Vitals & Vaccination', icon: Heart },
    { to: '/worker/awareness', label: 'Awareness Campaign', icon: Megaphone }
  ];

  const adminLinks = [
    { to: '/admin-dashboard', label: 'Admin Panel', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users Directory', icon: Users },
    { to: '/admin/hospitals', label: 'Hospitals Registry', icon: Building },
    { to: '/admin/broadcasts', label: 'Send Alert Alert', icon: Megaphone },
    { to: '/admin/monitoring', label: 'System Analytics', icon: Shield }
  ];

  const getLinks = () => {
    switch (role) {
      case 'ROLE_ADMIN':
        return adminLinks;
      case 'ROLE_HEALTH_WORKER':
        return workerLinks;
      default:
        return citizenLinks;
    }
  };

  const navLinks = getLinks();

  return (
    <aside className="w-64 border-r border-slate-200/50 bg-white p-4 dark:border-slate-800/50 dark:bg-slate-900 hidden md:block flex-shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation Menu
          </p>
          <ul className="mt-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-health-500 text-white shadow-glow'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Account Role
          </p>
          <div className="mt-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize">
              {role.replace('ROLE_', '').replace('_', ' ').toLowerCase()} Account
            </p>
            <p className="mt-1 text-[10px] text-slate-400">
              Access limits applied by system administrators.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

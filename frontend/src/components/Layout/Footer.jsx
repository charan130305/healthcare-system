import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-400 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="flex items-center gap-1 justify-center">
          Made with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for Rural Health Accessibility.
        </p>
        <div className="flex gap-4 text-[11px] text-slate-400">
          <a href="#" className="hover:text-health-500">Privacy Policy</a>
          <a href="#" className="hover:text-health-500">Terms of Use</a>
          <a href="#" className="hover:text-health-500">Official Portal</a>
          <a href="#" className="hover:text-health-500">Developer API</a>
        </div>
        <p className="text-[10px]">
          &copy; {new Date().getFullYear()} HealthConnect Community System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

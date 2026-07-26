import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">SCE FIESTA</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">One Platform. Complete College Life.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Link to="/copilot" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">AI Copilot</Link>
            <Link to="/map" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Campus Map</Link>
            <Link to="/academics" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Academics</Link>
            <Link to="/faculty" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Faculty Directory</Link>
            <Link to="/freshers-guide" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Freshers Guide</Link>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>

        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© 2026 SCE FIESTA. Built for Digital Campus Platform.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1 font-medium">
            Engineered with <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 inline" /> for Students & Faculty.
          </p>
        </div>
      </div>
    </footer>
  );
};

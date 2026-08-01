import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="py-8 transition-colors">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="material-surface-glass px-5 py-5 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-2xl bg-[color:var(--cp-primary)] flex items-center justify-center text-white font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-sm text-[color:var(--cp-text-strong)]">CampusPilot AI</p>
              <p className="text-xs text-[color:var(--cp-text-muted)]">University Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[color:var(--cp-text-muted)] font-medium">
            <Link to="/copilot" className="hover:text-[color:var(--cp-primary)] transition-colors">AI Copilot</Link>
            <Link to="/map" className="hover:text-[color:var(--cp-primary)] transition-colors">Campus Map</Link>
            <Link to="/academics" className="hover:text-[color:var(--cp-primary)] transition-colors">Academics</Link>
            <Link to="/faculty" className="hover:text-[color:var(--cp-primary)] transition-colors">Faculty Directory</Link>
            <Link to="/library" className="hover:text-[color:var(--cp-primary)] transition-colors">Digital Library</Link>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[color:var(--cp-secondary-container)] text-[color:var(--cp-primary)] font-medium border border-[color:var(--cp-outline)]">
              <span className="w-2 h-2 rounded-full bg-[color:var(--cp-primary)]" />
              System Status: Normal
            </span>
          </div>

        </div>

        <div className="mt-5 px-2 flex flex-col sm:flex-row items-center justify-between text-xs text-[color:var(--cp-text-muted)]">
          <p>© 2026 CampusPilot AI. Production-Ready University Platform.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1 font-medium">
            Designed for Students, Faculty & Administrators.
          </p>
        </div>
      </div>
    </footer>
  );
};

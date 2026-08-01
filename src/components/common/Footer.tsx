import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#DDE5DD] dark:border-[#334155] bg-white dark:bg-[#162033] py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#2E7D32] dark:bg-[#4CAF50] flex items-center justify-center text-white font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#1F2937] dark:text-[#F8FAFC]">CampusPilot AI</p>
              <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1]">University Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#6B7280] dark:text-[#CBD5E1] font-medium">
            <Link to="/copilot" className="hover:text-[#2E7D32] dark:hover:text-[#81C784] transition-colors">AI Copilot</Link>
            <Link to="/map" className="hover:text-[#2E7D32] dark:hover:text-[#81C784] transition-colors">Campus Map</Link>
            <Link to="/academics" className="hover:text-[#2E7D32] dark:hover:text-[#81C784] transition-colors">Academics</Link>
            <Link to="/faculty" className="hover:text-[#2E7D32] dark:hover:text-[#81C784] transition-colors">Faculty Directory</Link>
            <Link to="/library" className="hover:text-[#2E7D32] dark:hover:text-[#81C784] transition-colors">Digital Library</Link>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5E9] dark:bg-[#1E293B] text-[#2E7D32] dark:text-[#81C784] font-semibold border border-[#DDE5DD] dark:border-[#334155]">
              <span className="w-2 h-2 rounded-full bg-[#2E7D32] dark:bg-[#4CAF50]" />
              System Status: Normal
            </span>
          </div>

        </div>

        <div className="mt-8 pt-4 border-t border-[#E5E7EB] dark:border-[#475569] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] dark:text-[#CBD5E1]">
          <p>© 2026 CampusPilot AI. Production-Ready University Platform.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1 font-medium">
            Designed for Students, Faculty & Administrators.
          </p>
        </div>
      </div>
    </footer>
  );
};

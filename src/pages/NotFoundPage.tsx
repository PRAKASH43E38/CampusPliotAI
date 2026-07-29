import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] text-[#1F2937] dark:text-[#F8FAFC] flex flex-col items-center justify-center p-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[#E8F5E9] dark:bg-[#1E293B] text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center font-extrabold text-2xl border border-[#DDE5DD] dark:border-[#334155]">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-[#1F2937] dark:text-[#F8FAFC]">Campus Page Not Found</h1>
      <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] max-w-sm">
        The page or location coordinate you requested does not exist in our university database.
      </p>
      <div className="flex items-center gap-3">
        <Link
          to="/student"
          className="px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs flex items-center gap-1.5 border-none"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
        <Link
          to="/copilot"
          className="px-5 py-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC] font-bold text-xs flex items-center gap-1.5"
        >
          Ask AI Copilot <Sparkles className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" />
        </Link>
      </div>
    </div>
  );
};

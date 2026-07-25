import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, MapPin } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-2xl border border-indigo-500/30">
        404
      </div>
      <h1 className="text-3xl font-black text-white">Campus Location Not Found</h1>
      <p className="text-xs text-slate-400 max-w-sm">
        The page or building coordinate you requested does not exist in our campus database.
      </p>
      <div className="flex items-center gap-3">
        <Link
          to="/student"
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
        <Link
          to="/copilot"
          className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
        >
          Ask AI Copilot <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        </Link>
      </div>
    </div>
  );
};

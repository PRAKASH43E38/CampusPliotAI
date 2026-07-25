import React, { useState } from 'react';
import { SlidersHorizontal, Moon, Sun, Sparkles, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 border border-white/10 text-white flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-pink-200 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <SlidersHorizontal className="w-4 h-4 text-white" /> System Preferences
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Settings & Theme Configuration
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 mt-1 font-medium">
            Customize Light/Dark theme mode and AI model response parameters.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Theme Settings Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#140f33] border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Interface Theme Mode
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-purple-600/20 border-purple-500 text-purple-400 font-bold'
                  : 'bg-slate-50 dark:bg-[#1a1442] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Moon className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-xs sm:text-sm font-extrabold">Dark Mode</p>
                  <p className="text-[11px] opacity-70">Deep dark UI aesthetic</p>
                </div>
              </div>
              {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
            </button>

            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-purple-500/10 border-purple-500 text-purple-600 font-bold'
                  : 'bg-slate-50 dark:bg-[#1a1442] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sun className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs sm:text-sm font-extrabold">Light Mode</p>
                  <p className="text-[11px] opacity-70">Soft lavender light UI</p>
                </div>
              </div>
              {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
            </button>
          </div>
        </div>

        {/* AI Copilot Configuration */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#140f33] border border-slate-200 dark:border-white/10 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" /> AI Engine Configuration
          </h3>

          <div className="space-y-4 text-xs font-medium">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                AI Response Mode
              </label>
              <select className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#1a1442] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-bold">
                <option>Structured Solid Cards + Timetables (Recommended)</option>
                <option>Compact Plain Text Mode</option>
                <option>Detailed Academic Analytical Mode</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                AI Model Speed & Precision
              </label>
              <select className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#1a1442] border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-bold">
                <option>Google Antigravity Agentic Engine (Fastest)</option>
                <option>GPT-4o Campus Orchestrator</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white font-extrabold text-xs shadow-none flex items-center justify-center gap-2 border-none cursor-pointer hover:opacity-90 transition-all"
        >
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Preferences Saved!</> : 'Save System Settings'}
        </button>
      </form>
    </div>
  );
};

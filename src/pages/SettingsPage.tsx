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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F8FAF8] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC] flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <SlidersHorizontal className="w-4 h-4" /> System Preferences
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-[#F8FAFC] tracking-tight">
            Settings & Theme Configuration
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#CBD5E1] mt-1 font-medium">
            Customize Light/Dark theme mode and AI assistant parameters.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Theme Settings Card */}
        <div className="p-6 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] space-y-4">
          <h3 className="font-extrabold text-base text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-2">
            <Moon className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" /> Interface Theme Mode
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#162033] border-[#4CAF50] text-[#4CAF50] font-bold'
                  : 'bg-white dark:bg-[#162033] border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Moon className="w-5 h-5" />
                <div>
                  <p className="text-xs sm:text-sm font-extrabold">Dark Mode</p>
                  <p className="text-[11px] opacity-70">Slate & Dark Navy Theme</p>
                </div>
              </div>
              {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />}
            </button>

            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                theme === 'light'
                  ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#2E7D32] font-bold'
                  : 'bg-white dark:bg-[#162033] border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sun className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs sm:text-sm font-extrabold">Light Mode</p>
                  <p className="text-[11px] opacity-70">Clean Professional White & Green</p>
                </div>
              </div>
              {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />}
            </button>
          </div>
        </div>

        {/* AI Copilot Configuration */}
        <div className="p-6 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] space-y-4">
          <h3 className="font-extrabold text-base text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" /> AI Engine Configuration
          </h3>

          <div className="space-y-4 text-xs font-medium">
            <div>
              <label className="block font-bold text-[#1F2937] dark:text-[#F8FAFC] mb-1">
                AI Response Mode
              </label>
              <select className="w-full">
                <option>Structured Solid Cards + Timetables (Recommended)</option>
                <option>Compact Plain Text Mode</option>
                <option>Detailed Academic Analytical Mode</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#1F2937] dark:text-[#F8FAFC] mb-1">
                AI Model Engine
              </label>
              <select className="w-full">
                <option>Google Gemini 1.5 Flash (Default)</option>
                <option>GLM 4.7 Flash Engine</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs flex items-center justify-center gap-2 border-none cursor-pointer transition-colors"
        >
          {saved ? <><CheckCircle2 className="w-4 h-4" /> Preferences Saved!</> : 'Save System Settings'}
        </button>
      </form>
    </div>
  );
};

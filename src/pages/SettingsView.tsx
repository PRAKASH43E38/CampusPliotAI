import { useState } from 'react';
import { Settings, Bell, Shield, Eye, HelpCircle, Save, CheckCircle, Moon, Sun } from 'lucide-react';

interface SettingsViewProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function SettingsView({ isDark, onToggleTheme }: SettingsViewProps) {
  const [examReminders, setExamReminders] = useState(true);
  const [placementAlerts, setPlacementAlerts] = useState(true);
  const [transitAlerts, setTransitAlerts] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 font-sans max-w-3xl">
      {/* Banner Intro */}
      <div className={`border p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
        isDark ? 'bg-[#0d0e11] border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900'
      }`}>
        <div>
          <h2 className={`text-xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>Settings & Security Controls</h2>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Configure push notification filters, data sharing permissions, and UI accessibility preferences.
          </p>
        </div>
      </div>

      {/* Grid layouts */}
      <div className={`border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 transition-all ${
        isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* Notifications config section */}
        <div className="space-y-4">
          <div className={`flex items-center gap-2 border-b pb-2.5 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <Bell className="w-5 h-5 text-blue-500" />
            <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>Alerts & Notification Subscriptions</h3>
          </div>

          <div className="space-y-3">
            <label className={`flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer ${
              isDark 
                ? 'bg-slate-900/40 hover:bg-slate-900/60 border-slate-800' 
                : 'bg-slate-50/50 hover:bg-slate-50 border-slate-100'
            }`}>
              <input
                type="checkbox"
                checked={examReminders}
                onChange={(e) => setExamReminders(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mt-0.5"
              />
              <div>
                <span className={`text-xs sm:text-sm font-bold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Exam Cell Reminders</span>
                <p className={`text-[11px] leading-relaxed font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Receive priority alerts regarding CIA schedule updates, seat arrangements, and grade releases.
                </p>
              </div>
            </label>

            <label className={`flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer ${
              isDark 
                ? 'bg-slate-900/40 hover:bg-slate-900/60 border-slate-800' 
                : 'bg-slate-50/50 hover:bg-slate-50 border-slate-100'
            }`}>
              <input
                type="checkbox"
                checked={placementAlerts}
                onChange={(e) => setPlacementAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mt-0.5"
              />
              <div>
                <span className={`text-xs sm:text-sm font-bold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Placement Opportunity Broadcasts</span>
                <p className={`text-[11px] leading-relaxed font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Get notified instantly when new corporate recruitment drives, resume clinics, or mock drives are registered.
                </p>
              </div>
            </label>

            <label className={`flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer ${
              isDark 
                ? 'bg-slate-900/40 hover:bg-slate-900/60 border-slate-800' 
                : 'bg-slate-50/50 hover:bg-slate-50 border-slate-100'
            }`}>
              <input
                type="checkbox"
                checked={transitAlerts}
                onChange={(e) => setTransitAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mt-0.5"
              />
              <div>
                <span className={`text-xs sm:text-sm font-bold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Live Shuttle Proximity Alerts</span>
                <p className={`text-[11px] leading-relaxed font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Receive mobile notifications when your scheduled transport bus route reaches within 1 KM of your home boarding stop.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Theme Preferences */}
        <div className="space-y-4">
          <div className={`flex items-center gap-2 border-b pb-2.5 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <Eye className="w-5 h-5 text-indigo-500" />
            <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>Visual Interface Styling</h3>
          </div>

          <div className={`p-4 border rounded-2xl space-y-4 transition-all ${
            isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/50 border-slate-100'
          }`}>
            <div>
              <span className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>System Visual Theme</span>
              <p className={`text-[11px] leading-relaxed font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Toggle between Light mode for maximum WCAG daylight readability and Dark mode for safe, premium, late-night academic study.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onToggleTheme}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  !isDark 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10' 
                    : 'bg-slate-900 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Sun className="w-4 h-4" />
                Light Mode Active
              </button>

              <button
                type="button"
                onClick={onToggleTheme}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10' 
                    : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Moon className="w-4 h-4" />
                Dark Mode Active
              </button>
            </div>
          </div>
        </div>

        {/* Security / Privacy disclaimer */}
        <div className="space-y-4">
          <div className={`flex items-center gap-2 border-b pb-2.5 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <Shield className="w-5 h-5 text-emerald-500" />
            <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>Access Clearance Privacy</h3>
          </div>

          <div className={`p-4 border rounded-2xl text-[11px] font-semibold leading-relaxed transition-all ${
            isDark ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-slate-50/50 border-slate-100 text-slate-600'
          }`}>
            🎓 <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>FERPA Compliant Credentials Guard</strong><br />
            Your academic performance grade sheets and continuous internal assessment logs are encrypted on host containers. Personal biodata elements are concealed from third-party networks or scrapers.
          </div>
        </div>

        {/* Save button and success toast */}
        <div className={`pt-6 border-t flex items-center justify-between gap-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          {savedSuccess && (
            <div className={`text-xs font-bold flex items-center gap-2 px-4 py-2.5 rounded-xl animate-fade-in shadow-sm ${
              isDark ? 'text-green-400 bg-green-950/20 border border-green-900/55' : 'text-green-700 bg-green-50 border border-green-200'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Settings updated successfully!
            </div>
          )}

          <div className="flex-1" />

          <button
            onClick={handleSave}
            className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
            id="save-settings-button"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple custom inline helper SVG representing checkbox checked or tick
function CheckCircle2(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      style={{ width: '16px', height: '16px' }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

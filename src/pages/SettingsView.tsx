/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Bell, Shield, Eye, Save } from 'lucide-react';

interface SettingsViewProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function SettingsView({}: SettingsViewProps) {
  const [examReminders, setExamReminders] = useState(true);
  const [placementAlerts, setPlacementAlerts] = useState(true);
  const [transitAlerts, setTransitAlerts] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 font-sans max-w-3xl">
      {/* Banner Intro */}
      <div className="border p-6 rounded-3xl shadow-sm bg-white border-[#A7C7DD]">
        <div>
          <h2 className="text-xl font-extrabold text-[#001D39]">Settings & Security Controls</h2>
          <p className="text-xs mt-1 text-slate-550">
            Configure push notification filters, data sharing permissions, and UI accessibility preferences.
          </p>
        </div>
      </div>

      {/* Settings Grid Panel */}
      <div className="border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 bg-white border-[#A7C7DD]">
        {/* Notifications config section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#A7C7DD]/60 pb-2.5">
            <Bell className="w-5 h-5 text-[#0A4174]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#001D39]">Alerts & Notification Subscriptions</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-slate-200/60 bg-slate-50/50 hover:bg-slate-100/30 transition-all cursor-pointer">
              <input
                type="checkbox"
                checked={examReminders}
                onChange={(e) => setExamReminders(e.target.checked)}
                className="w-4 h-4 text-[#0A4174] border-slate-300 rounded focus:ring-[#0A4174] mt-0.5"
              />
              <div>
                <span className="text-xs sm:text-sm font-bold block text-[#001D39]">Exam Cell Reminders</span>
                <p className="text-[11px] leading-relaxed text-slate-550 mt-0.5">
                  Receive priority alerts regarding CIA schedule updates, seat arrangements, and grade releases.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-slate-200/60 bg-slate-50/50 hover:bg-slate-100/30 transition-all cursor-pointer">
              <input
                type="checkbox"
                checked={placementAlerts}
                onChange={(e) => setPlacementAlerts(e.target.checked)}
                className="w-4 h-4 text-[#0A4174] border-slate-300 rounded focus:ring-[#0A4174] mt-0.5"
              />
              <div>
                <span className="text-xs sm:text-sm font-bold block text-[#001D39]">Placement Opportunity Broadcasts</span>
                <p className="text-[11px] leading-relaxed text-slate-550 mt-0.5">
                  Get notified instantly when new corporate recruitment drives, resume clinics, or mock drives are registered.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-slate-200/60 bg-slate-50/50 hover:bg-slate-100/30 transition-all cursor-pointer">
              <input
                type="checkbox"
                checked={transitAlerts}
                onChange={(e) => setTransitAlerts(e.target.checked)}
                className="w-4 h-4 text-[#0A4174] border-slate-300 rounded focus:ring-[#0A4174] mt-0.5"
              />
              <div>
                <span className="text-xs sm:text-sm font-bold block text-[#001D39]">Live Shuttle Proximity Alerts</span>
                <p className="text-[11px] leading-relaxed text-slate-550 mt-0.5">
                  Receive mobile notifications when your scheduled transport bus route reaches within 1 KM of your home boarding stop.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Theme Preferences (Locked to Blue-on-Blue SaaS Theme) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#A7C7DD]/60 pb-2.5">
            <Eye className="w-5 h-5 text-[#0A4174]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#001D39]">Visual Interface Styling</h3>
          </div>

          <div className="p-4 border border-slate-200/60 rounded-2xl space-y-2 bg-slate-50/50">
            <div>
              <span className="text-xs font-bold block text-[#001D39]">SaaS Institutional Theme</span>
              <p className="text-[11px] leading-relaxed text-slate-550 mt-0.5">
                The visual palette is configured to the official **Blue-on-Blue SaaS Layout** matching Saranathan College of Engineering design specifications.
              </p>
            </div>
          </div>
        </div>

        {/* Security / Privacy disclaimer */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#A7C7DD]/60 pb-2.5">
            <Shield className="w-5 h-5 text-[#4E8EA2]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#001D39]">Access Clearance Privacy</h3>
          </div>

          <div className="p-4 border border-slate-200/60 rounded-2xl text-[11px] font-medium leading-relaxed bg-slate-50/50 text-slate-600">
            🎓 <strong className="text-[#001D39]">FERPA Compliant Credentials Guard</strong><br />
            Your academic performance grade sheets and continuous internal assessment logs are encrypted on host containers. Personal biodata elements are concealed from third-party networks or scrapers.
          </div>
        </div>

        {/* Save button and success toast */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          {savedSuccess && (
            <div className="text-xs font-bold flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-250 text-emerald-700 animate-fade-in shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Settings updated successfully!
            </div>
          )}

          <div className="flex-1" />

          <button
            onClick={handleSave}
            className="py-3 px-6 bg-[#0A4174] hover:bg-[#002b52] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
            id="save-settings-button"
          >
            <Save className="w-4 h-4 text-white" />
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

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { hostelMenu, mockStudent } from '../data/mockData';
import { Coffee, Utensils, Moon, HelpCircle, ShieldAlert, CheckCircle, Send } from 'lucide-react';

type DayType = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

interface HostelViewProps {
  isDark?: boolean;
}

export default function HostelView({ isDark = false }: HostelViewProps) {
  const [activeDay, setActiveDay] = useState<DayType>('Monday');
  const [room, setRoom] = useState(mockStudent.hostelRoom);
  const [block, setBlock] = useState(mockStudent.hostelBlock);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const handleLeaveRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) return;

    setSubmitting(true);
    fetch('/api/hostel/outpass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Student-Id': mockStudent.id || 'st-0982'
      },
      body: JSON.stringify({ startDate, endDate, reason })
    })
    .then(res => {
      if (!res.ok) throw new Error("Server error");
      return res.json();
    })
    .then(data => {
      setSubmitting(false);
      setRequestSuccess(true);
      setStartDate('');
      setEndDate('');
      setReason('');
    })
    .catch(err => {
      setSubmitting(false);
      alert("Failed to submit outpass request. Please verify server connection.");
    });
  };

  const days: DayType[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-8 pb-12 font-sans transition-colors duration-300">
      {/* Introduction Banner */}
      <div className={`border p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors duration-300 ${
        isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        <div>
          <h2 className={`text-xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-955'}`}>Hostel & Cafeteria Portal</h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse daily mess schedules, file biometric leave clearance requests, and audit hostel compound regulations.
          </p>
        </div>

        <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl shrink-0 border ${
          isDark ? 'text-slate-200 bg-slate-900 border-slate-800' : 'text-white bg-slate-900 border-transparent'
        }`}>
          Room Allocation: {mockStudent.hostelBlock} • Rm {mockStudent.hostelRoom}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Weekly Mess Menu Slider */}
        <div className={`lg:col-span-7 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
          isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${isDark ? 'border-slate-850' : 'border-slate-100'}`}>
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-955'}`}>Weekly Mess Dining Schedule</h3>
              <p className="text-xs text-slate-500">Biometric cafeteria timetable (Monday - Friday)</p>
            </div>

            <div className="flex overflow-x-auto gap-1 scrollbar-none">
              {days.map(d => (
                <button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    activeDay === d
                      ? 'bg-blue-600 text-white shadow-sm'
                      : isDark
                        ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-950'
                  }`}
                  id={`mess-day-tab-${d.toLowerCase()}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Menus display cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`border p-4 rounded-2xl space-y-2 ${isDark ? 'bg-slate-900/40 border-slate-850' : 'bg-slate-50/50 border-slate-200/40'}`}>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 font-mono uppercase tracking-wider">
                <Coffee className="w-4 h-4 text-orange-400" />
                Breakfast (07:30 AM - 09:00 AM)
              </div>
              <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-850'}`}>{hostelMenu[activeDay].breakfast}</p>
            </div>

            <div className={`border p-4 rounded-2xl space-y-2 ${isDark ? 'bg-slate-900/40 border-slate-850' : 'bg-slate-50/50 border-slate-200/40'}`}>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 font-mono uppercase tracking-wider">
                <Utensils className="w-4 h-4 text-blue-550" />
                Lunch (12:30 PM - 02:00 PM)
              </div>
              <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-850'}`}>{hostelMenu[activeDay].lunch}</p>
            </div>

            <div className={`border p-4 rounded-2xl space-y-2 ${isDark ? 'bg-slate-900/40 border-slate-850' : 'bg-slate-50/50 border-slate-200/40'}`}>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 font-mono uppercase tracking-wider">
                <Coffee className="w-4 h-4 text-amber-500" />
                Evening Snacks (05:00 PM - 06:00 PM)
              </div>
              <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-850'}`}>{hostelMenu[activeDay].snack}</p>
            </div>

            <div className={`border p-4 rounded-2xl space-y-2 ${isDark ? 'bg-slate-900/40 border-slate-850' : 'bg-slate-50/50 border-slate-200/40'}`}>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 font-mono uppercase tracking-wider">
                <Moon className="w-4 h-4 text-indigo-400" />
                Dinner (07:30 PM - 09:30 PM)
              </div>
              <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-850'}`}>{hostelMenu[activeDay].dinner}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Leave Application Form */}
        <div className={`border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
          isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`border-b pb-4 ${isDark ? 'border-slate-850' : 'border-slate-100'}`}>
            <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-955'}`}>Warden Leave Clearance Request</h3>
            <p className="text-xs text-slate-500">Apply for hostel out-pass or night leave permits</p>
          </div>

          {requestSuccess ? (
            <div className={`p-6 border rounded-2xl space-y-4 text-center ${
              isDark ? 'bg-green-950/20 border-green-900/30 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
            }`}>
              <div className="w-12 h-12 bg-green-500/10 text-green-550 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-green-300' : 'text-green-900'}`}>Application Registered</h4>
                <p className="text-xs leading-relaxed mt-1">
                  Your out-pass application has been logged and sent to **Col. K.S. Rathore (Warden, Aryabhata Block)** for digital authorization. You will be alerted via portal notifications once cleared.
                </p>
              </div>
              <button
                onClick={() => setRequestSuccess(false)}
                className={`text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer border ${
                  isDark 
                    ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-850' 
                    : 'bg-white border-green-200 hover:bg-green-100 text-green-700'
                }`}
                id="reset-leave-form"
              >
                Apply Another Leave
              </button>
            </div>
          ) : (
            <form onSubmit={handleLeaveRequestSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Block Allocation</label>
                  <input
                    type="text"
                    value={block}
                    disabled
                    className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold cursor-not-allowed outline-none ${
                      isDark ? 'bg-slate-900/50 border-slate-850 text-slate-505' : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Room Allocation</label>
                  <input
                    type="text"
                    value={room}
                    disabled
                    className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold cursor-not-allowed outline-none ${
                      isDark ? 'bg-slate-900/50 border-slate-850 text-slate-550' : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Start Out-Pass Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                      isDark 
                        ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Return Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                      isDark 
                        ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Reason for Leave Out-pass</label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="E.g., Medical checkup, family emergency, or weekend holiday out-pass..."
                  className={`w-full py-2.5 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                    isDark 
                      ? 'bg-slate-905 border-slate-800 text-slate-100 placeholder-slate-550 focus:border-blue-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                id="submit-leave-request"
              >
                {submitting ? (
                  'Transmitting logs...'
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Transmit Out-pass Request
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Rules and Regulations Accordions */}
      <div className={`border rounded-3xl p-6 shadow-sm space-y-4 transition-colors duration-300 ${
        isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" />
          <h4 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Hostel Compound Code & Bio-metric Curfew Regulations</h4>
        </div>

        <div className={`divide-y text-xs ${isDark ? 'divide-slate-850' : 'divide-slate-100'}`}>
          <div className={`py-3 font-semibold leading-relaxed ${isDark ? 'text-slate-350' : 'text-slate-700'}`}>
            1.  **Curfew Timings**: Curfew biometric entry lock is strictly enforced at <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>10:00 PM</strong> daily. Unauthorized late entries attract strict penalty evaluations on student credentials.
          </div>
          <div className={`py-3 font-semibold leading-relaxed ${isDark ? 'text-slate-350' : 'text-slate-700'}`}>
            2.  **Visitors Policy**: Parents and guardians are allowed to consult students only inside the central reception lobby wing between <strong className={isDark ? 'text-slate-200' : 'text-slate-900'}>04:30 PM - 07:00 PM</strong> on weekdays.
          </div>
          <div className={`py-3 font-semibold leading-relaxed ${isDark ? 'text-slate-350' : 'text-slate-700'}`}>
            3.  **Appliance Regulation**: High-voltage electrical loads (water heaters, cookers, coils) are strictly forbidden within student dormitory allotments.
          </div>
        </div>
      </div>
    </div>
  );
}

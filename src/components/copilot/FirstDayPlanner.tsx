import React, { useState } from 'react';
import { Sparkles, MapPin, Compass, CheckCircle2, User, Clock, Download, Share2 } from 'lucide-react';
import { facultyMembers, OFFICIAL_DEPARTMENTS } from '../../data/mockData';

export const FirstDayPlanner: React.FC = () => {
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('1st Year');
  const [section, setSection] = useState('CSE-A');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedPlan({
        department,
        year,
        section,
        schedule: [
          { time: '08:30 AM - 09:15 AM', task: 'Freshers Orientation & Welcome Address', location: 'CV Raman Grand Auditorium', host: 'Dean of Student Affairs' },
          { time: '09:30 AM - 10:45 AM', task: 'Departmental Briefing & Lab Tour', location: `${department.split(' ')[0]} Block Hall 302`, host: 'Head of Department' },
          { time: '11:00 AM - 12:30 PM', task: 'RFID Smart ID Card & High-Speed WiFi Activation', location: 'Homi Bhabha Admin Block Room 102', host: 'IT Operations Team' },
          { time: '12:30 PM - 01:30 PM', task: 'Welcome Lunch & Club Fair Walkthrough', location: 'Campus Central Canteen & Food Court', host: 'Student Welfare Council' },
          { time: '01:45 PM - 03:30 PM', task: 'First Technical Foundation Class & Lab Allocation', location: `${department.split(' ')[0]} Tech Lab 204`, host: 'Senior Faculty' },
          { time: '03:45 PM - 04:30 PM', task: 'Library Membership & Digital Kiosk Activation', location: 'Aryabhata Central Library', host: 'Chief Librarian' }
        ],
        checklist: [
          'Collect physical RFID Student Identity Card',
          'Register Laptop & Phone MAC Address on Campus Portal',
          `Locate designated classroom in ${department.split(' ')[0]} Block`,
          'Submit original certificates verification at Admin Office',
          'Connect with Student Mentor & Class Representative'
        ]
      });
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            AI First Day Planner <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">AI Automated</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Generate an optimized first-day timetable, campus navigation route, and administrative checklist.
          </p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {OFFICIAL_DEPARTMENTS.filter(d => d !== 'All Departments').map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Academic Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option>1st Year (Freshers)</option>
            <option>2nd Year (Sophomores)</option>
            <option>3rd Year (Juniors)</option>
            <option>4th Year (Seniors)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Section
          </label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option>Section A</option>
            <option>Section B</option>
            <option>Section C</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                Synthesizing Custom First Day Blueprint...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-200" />
                Generate First Day Blueprint
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Result */}
      {generatedPlan && (
        <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
          
          <div className="p-4 rounded-2xl bg-emerald-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-emerald-800">
            <div>
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Blueprint Ready</span>
              <h4 className="text-base font-black text-white">{generatedPlan.department} • {generatedPlan.year}</h4>
              <p className="text-xs text-emerald-200 mt-0.5">Customized for {generatedPlan.section}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3.5 py-1.5 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-xs font-bold text-white border border-emerald-700 flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-extrabold text-white flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            </div>
          </div>

          {/* Timetable timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" /> Optimized First Day Schedule
            </h4>
            <div className="space-y-2.5">
              {generatedPlan.schedule.map((item: any, idx: number) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{item.task}</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Host: {item.host}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">{item.time}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold flex items-center justify-end gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-500" /> {item.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Required Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Essential Day 1 Checklist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {generatedPlan.checklist.map((chk: string, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{chk}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  mockStudent, 
  mockClasses, 
  mockAnnouncements
} from '../data/mockData';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  Clock, 
  Calendar, 
  Bell, 
  Flame, 
  ChevronRight, 
  ArrowRight,
  Navigation,
  FileDown,
  Briefcase
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateTo: (view: string) => void;
  isDark?: boolean;
}

export default function DashboardView({ onNavigateTo, isDark = false }: DashboardViewProps) {
  // Filter monday classes to represent today
  const todayClasses = mockClasses.filter(c => c.day === 'Monday');
  const highPriorityAnnounce = mockAnnouncements.filter(a => a.priority === 'high');

  // Simple countdown to IA assessment (August 3, 2026)
  const targetDate = new Date('2026-08-03T00:00:00');
  const now = new Date('2026-07-18T19:50:44'); // Mocking current state
  const timeDiff = targetDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* AI Daily Summary Bar */}
      <div className={`p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all border ${
        isDark 
          ? 'bg-blue-950/10 border-blue-900/50 text-slate-100' 
          : 'bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent border-blue-200/60 text-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">CampusPilot AI recommendation</span>
            <p className="text-sm font-semibold">
              Your overall attendance is <strong className="text-blue-500">84.5%</strong>. However, Theory of Computation is at <strong className="text-amber-500">76.5%</strong> (nearing the 75% cutoff). Attend today's 10:00 AM class to stay secure!
            </p>
          </div>
        </div>
        <button 
          onClick={() => onNavigateTo('ai')}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition-all shadow-sm shrink-0 whitespace-nowrap active:scale-95 cursor-pointer"
          id="dashboard-ai-suggestion-button"
        >
          Consult Assistant
        </button>
      </div>


      {/* Main Welcome Banner */}
      <div className={`p-8 rounded-3xl relative overflow-hidden shadow-xl border ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-900 text-white border-transparent'
      }`}>
        <div className="absolute right-[-5%] bottom-[-10%] opacity-10">
          <GraduationCap className="w-72 h-72" />
        </div>
        <div className="relative z-10 space-y-4">
          <div>
            <p className="text-blue-400 font-mono text-xs uppercase tracking-widest font-semibold">Semester V • B.Tech CSE (AI & ML)</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">Welcome back, {mockStudent.name}!</h1>
          </div>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
            All systems online. You have {todayClasses.length} academic lecture sessions remaining today. Your next class is **Theory of Computation** with Dr. Ananya Sen in Block A Room 301.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <span className="text-xs font-semibold bg-white/10 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              Streak: 12 Active Days
            </span>
            <span className="text-xs font-semibold bg-white/10 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-300" />
              Latest Notice: CIA-2 Assessment dates out
            </span>
          </div>
        </div>
      </div>

      {/* Core metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className={`p-6 border rounded-2xl shadow-sm transition-all flex justify-between items-center group ${
          isDark ? 'bg-[#0d0e11] border-slate-800 text-slate-100 hover:bg-slate-900/40' : 'bg-white border-slate-200/80 hover:shadow-md text-slate-800'
        }`}>
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Attendance Overall</span>
            <p className={`text-3xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>{mockStudent.attendanceOverall}%</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${isDark ? 'bg-green-950/40 text-green-400' : 'bg-green-50 text-green-600'}`}>8.2% above threshold</span>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-blue-950/30 text-blue-400 border border-blue-900/50' : 'bg-blue-50 text-blue-600'}`}>
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className={`p-6 border rounded-2xl shadow-sm transition-all flex justify-between items-center group ${
          isDark ? 'bg-[#0d0e11] border-slate-800 text-slate-100 hover:bg-slate-900/40' : 'bg-white border-slate-200/80 hover:shadow-md text-slate-800'
        }`}>
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">CGPA Cumulative</span>
            <p className={`text-3xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>{mockStudent.cgpa} / 10</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${isDark ? 'bg-blue-950/40 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>Ranked #14 in Department</span>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-purple-950/30 text-purple-400 border border-purple-900/50' : 'bg-purple-50 text-purple-600'}`}>
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className={`p-6 border rounded-2xl shadow-sm transition-all flex justify-between items-center sm:col-span-2 lg:col-span-1 group ${
          isDark ? 'bg-[#0d0e11] border-slate-800 text-slate-100 hover:bg-slate-900/40' : 'bg-white border-slate-200/80 hover:shadow-md text-slate-800'
        }`}>
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">CIA-2 Countdown</span>
            <p className={`text-3xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>{daysRemaining} Days Left</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${isDark ? 'bg-rose-950/40 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>Starts Aug 3, 2026</span>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-rose-950/30 text-rose-400 border border-rose-900/50' : 'bg-rose-50 text-rose-600'}`}>
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Schedule vs Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Today's Schedule timeline */}
        <div className={`lg:col-span-7 border rounded-2xl p-6 shadow-sm space-y-6 transition-all ${
          isDark ? 'bg-[#0d0e11] border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>Today's Academic Timeline</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Scheduled lectures, rooms and allocated professors</p>
            </div>
            <button 
              onClick={() => onNavigateTo('academics')}
              className="text-xs text-blue-500 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Weekly Schedule <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className={`space-y-4 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 ${
            isDark ? 'before:bg-slate-800' : 'before:bg-slate-100'
          }`}>
            {todayClasses.map((cl, i) => (
              <div key={cl.id} className="relative pl-9 flex gap-4 group">
                {/* Timeline node */}
                <div className="absolute left-2.5 top-2.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-blue-500 shadow-sm z-10" />
                
                <div className={`flex-1 border rounded-xl p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isDark 
                    ? 'bg-slate-900/30 border-slate-800/80 group-hover:bg-slate-900/50 text-slate-200' 
                    : 'bg-slate-50 group-hover:bg-slate-100/80 border-slate-200/40 text-slate-800'
                }`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{cl.subjectCode}</span>
                    <h4 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{cl.subjectName}</h4>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Instructor: {cl.facultyName}</p>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <Navigation className="w-3 h-3 text-indigo-500" />
                      {cl.room}
                    </span>
                  </div>
                  <div className={`flex items-center gap-2 text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg border shrink-0 ${
                    isDark 
                      ? 'text-blue-400 bg-blue-950/20 border-blue-900/50' 
                      : 'text-blue-700 bg-blue-50/80 border-blue-100'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    {cl.timeStart}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notices and Announcements card */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`border rounded-2xl p-6 shadow-sm space-y-4 transition-all ${
            isDark ? 'bg-[#0d0e11] border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>University Announcements</h2>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Dean notifications and alerts</p>
              </div>
              <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                isDark ? 'bg-blue-950/40 text-blue-400 border border-blue-900/40' : 'bg-blue-50 text-blue-600'
              }`}>
                {highPriorityAnnounce.length}
              </span>
            </div>

            <div className="space-y-3">
              {highPriorityAnnounce.map(ann => (
                <div key={ann.id} className={`p-3 border rounded-xl space-y-2 transition-all ${
                  isDark 
                    ? 'bg-slate-900/30 border-slate-800/80 hover:bg-slate-900/50 text-slate-200' 
                    : 'bg-slate-50 hover:bg-slate-100/50 border-slate-200/40 text-slate-800'
                }`}>
                  <div className="flex justify-between items-start">
                    <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      ann.category === 'exam' 
                        ? (isDark ? 'bg-rose-950/30 text-rose-400 border border-rose-900/50' : 'bg-rose-50 text-rose-700 border border-rose-100') 
                        : (isDark ? 'bg-indigo-950/30 text-indigo-400 border border-indigo-900/50' : 'bg-indigo-50 text-indigo-700 border border-indigo-100')
                    }`}>
                      {ann.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{ann.date}</span>
                  </div>
                  <h4 className={`text-xs font-bold leading-snug ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{ann.title}</h4>
                  <p className={`text-[11px] leading-relaxed line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts Grid */}
          <div className={`border rounded-2xl p-6 shadow-sm space-y-4 transition-all ${
            isDark ? 'bg-[#0d0e11] border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900'
          }`}>
            <h3 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>Campus Quick Shortcuts</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onNavigateTo('resources')}
                className={`p-3 rounded-xl border text-left transition-all group flex items-center justify-between cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900/30 border-slate-800 hover:bg-slate-800 hover:border-slate-700' 
                    : 'bg-slate-50 border-slate-200/50 hover:bg-blue-50/50 hover:border-blue-200'
                }`}
                id="quick-download-resources"
              >
                <div>
                  <span className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Notes Center</span>
                  <p className="text-[10px] text-slate-500">Download PDFs</p>
                </div>
                <FileDown className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors" />
              </button>

              <button 
                onClick={() => onNavigateTo('map')}
                className={`p-3 rounded-xl border text-left transition-all group flex items-center justify-between cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900/30 border-slate-800 hover:bg-slate-800 hover:border-slate-700' 
                    : 'bg-slate-50 border-slate-200/50 hover:bg-blue-50/50 hover:border-blue-200'
                }`}
                id="quick-campus-navigator"
              >
                <div>
                  <span className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Campus Maps</span>
                  <p className="text-[10px] text-slate-500">Directions & Rooms</p>
                </div>
                <Navigation className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors" />
              </button>

              <button 
                onClick={() => onNavigateTo('placements')}
                className={`p-3 rounded-xl border text-left transition-all group flex items-center justify-between cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900/30 border-slate-800 hover:bg-slate-800 hover:border-slate-700' 
                    : 'bg-slate-50 border-slate-200/50 hover:bg-blue-50/50 hover:border-blue-200'
                }`}
                id="quick-placement-portal"
              >
                <div>
                  <span className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Placement Hub</span>
                  <p className="text-[10px] text-slate-500">Active CSE Drives</p>
                </div>
                <Briefcase className="w-4 h-4 text-slate-500 group-hover:text-blue-500 transition-colors" />
              </button>

              <button 
                onClick={() => onNavigateTo('events')}
                className={`p-3 rounded-xl border text-left transition-all group flex items-center justify-between cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900/30 border-slate-800 hover:bg-slate-800 hover:border-slate-700' 
                    : 'bg-slate-50 border-slate-200/50 hover:bg-blue-50/50 hover:border-blue-200'
                }`}
                id="quick-event-enroll"
              >
                <div>
                  <span className={`text-xs font-bold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Join Events</span>
                  <p className="text-[10px] text-slate-500">CodeRed Hackathon</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

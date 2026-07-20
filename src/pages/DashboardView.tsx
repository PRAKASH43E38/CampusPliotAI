/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  mockStudent, 
  mockClasses, 
  mockAnnouncements,
  mockSubjects
} from '../data/mockData';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  Clock, 
  Calendar, 
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

export default function DashboardView({ onNavigateTo }: DashboardViewProps) {
  // Filter current day classes
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = weekdays[new Date().getDay()];
  const todayClasses = mockClasses.filter(c => c.day === todayName || (c.day === 'Monday' && (todayName === 'Sunday' || todayName === 'Saturday')));
  const highPriorityAnnounce = mockAnnouncements.filter(a => a.priority === 'high');

  // Simple countdown to IA assessment (August 3, 2026)
  const targetDate = new Date('2026-08-03T00:00:00');
  const now = new Date(); 
  const timeDiff = targetDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));

  // Dynamic low attendance alert
  const lowAttendanceSubject = mockSubjects.find(s => s.attendance < 78);
  const nextClass = todayClasses.length > 0 ? todayClasses[0] : null;

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* AI Daily Summary Bar */}
      <div className="p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all border bg-white border-[#A7C7DD] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0A4174]/10 text-[#0A4174] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">CampusPilot AI recommendation</span>
            <p className="text-sm font-semibold text-[#001D39]">
              {lowAttendanceSubject ? (
                <>
                  Your overall attendance is <strong className="text-[#0A4174]">{mockStudent.attendanceOverall}%</strong>. However, {lowAttendanceSubject.name} is at <strong className="text-amber-600">{lowAttendanceSubject.attendance}%</strong> (nearing the 75% cutoff). Attend classes to stay secure!
                </>
              ) : (
                <>
                  Your overall attendance is in excellent standing at <strong className="text-[#0A4174]">{mockStudent.attendanceOverall}%</strong>. Keep up the consistent track record!
                </>
              )}
            </p>
          </div>
        </div>
        <button 
          onClick={() => onNavigateTo('ai')}
          className="text-xs bg-[#0A4174] hover:bg-[#002b52] text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm shrink-0 whitespace-nowrap active:scale-95 cursor-pointer"
          id="dashboard-ai-suggestion-button"
        >
          Consult Assistant
        </button>
      </div>

      {/* Main Welcome Banner */}
      <div className="p-8 rounded-3xl relative overflow-hidden bg-white border border-[#A7C7DD] shadow-sm">
        <div className="absolute right-[-5%] bottom-[-15%] opacity-5 text-[#0A4174]">
          <GraduationCap className="w-72 h-72" />
        </div>
        <div className="relative z-10 space-y-4">
          <div>
            <p className="text-[#4E8EA2] font-mono text-xs uppercase tracking-widest font-bold">{mockStudent.department} • {mockStudent.course}</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-[#001D39]">Welcome back, {mockStudent.name}!</h1>
          </div>
          <p className="text-slate-650 text-sm sm:text-base max-w-2xl font-medium leading-relaxed">
            All systems online. You have {todayClasses.length} academic lecture sessions scheduled for today. {nextClass ? `Your next class is **${nextClass.subjectName}** with ${nextClass.facultyName} in ${nextClass.room}.` : 'No classes scheduled.'}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <span className="text-xs font-semibold bg-[#BDD8E9]/30 border border-[#A7C7DD]/50 text-[#0A4174] px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0A4174]" />
              Streak: 12 Active Days
            </span>
            <span className="text-xs font-semibold bg-[#BDD8E9]/30 border border-[#A7C7DD]/50 text-[#0A4174] px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0A4174]" />
              Notice: CIA-2 Assessment dates out
            </span>
          </div>
        </div>
      </div>

      {/* Core metrics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 border rounded-2xl bg-white border-[#A7C7DD] shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Attendance Overall</span>
            <p className="text-3xl font-extrabold text-[#001D39]">{mockStudent.attendanceOverall}%</p>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-55 text-emerald-700 border border-emerald-100 block w-max">8.2% above threshold</span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#0A4174]/10 text-[#0A4174]">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 border rounded-2xl bg-white border-[#A7C7DD] shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">CGPA Cumulative</span>
            <p className="text-3xl font-extrabold text-[#001D39]">{mockStudent.cgpa} / 10</p>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#BDD8E9]/20 text-[#0A4174] border border-[#A7C7DD]/40 block w-max">Ranked #14 in Dept</span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#0A4174]/10 text-[#0A4174]">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 border rounded-2xl bg-white border-[#A7C7DD] shadow-sm hover:shadow-md transition-all flex justify-between items-center sm:col-span-2 lg:col-span-1 group">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">CIA-2 Countdown</span>
            <p className="text-3xl font-extrabold text-[#001D39]">{daysRemaining} Days Left</p>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 block w-max">Starts Aug 3, 2026</span>
          </div>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-[#0A4174]/10 text-[#0A4174]">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Schedule vs Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Today's Schedule timeline */}
        <div className="lg:col-span-7 border rounded-2xl p-6 bg-white border-[#A7C7DD] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#001D39]">Today's Academic Timeline</h2>
              <p className="text-xs text-slate-500">Scheduled lectures, rooms and allocated professors</p>
            </div>
            <button 
              onClick={() => onNavigateTo('academics')}
              className="text-xs text-[#0A4174] font-bold hover:underline flex items-center gap-1 cursor-pointer animate-fade-in"
            >
              Weekly Schedule <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-105">
            {todayClasses.map((cl) => (
              <div key={cl.id} className="relative pl-9 flex gap-4 group">
                {/* Timeline node */}
                <div className="absolute left-2.5 top-2.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-[#0A4174] shadow-sm z-10" />
                
                <div className="flex-1 border rounded-xl p-4 bg-slate-50/50 group-hover:bg-slate-100/30 border-slate-200/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{cl.subjectCode}</span>
                    <h4 className="text-sm font-bold text-[#001D39]">{cl.subjectName}</h4>
                    <p className="text-xs text-slate-550">Instructor: {cl.facultyName}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold mt-1 text-[#0A4174]">
                      <Navigation className="w-3 h-3 text-[#4E8EA2]" />
                      {cl.room}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg border shrink-0 text-[#0A4174] bg-[#BDD8E9]/20 border-[#A7C7DD]/40">
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
          <div className="border rounded-2xl p-6 bg-white border-[#A7C7DD] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#001D39]">University Announcements</h2>
                <p className="text-xs text-slate-500">Dean notifications and alerts</p>
              </div>
              <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center bg-[#0A4174] text-white">
                {highPriorityAnnounce.length}
              </span>
            </div>

            <div className="space-y-3">
              {highPriorityAnnounce.map(ann => (
                <div key={ann.id} className="p-3 border rounded-xl space-y-2 bg-slate-50/50 hover:bg-slate-100/30 border-slate-200/50 transition-all">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#BDD8E9]/30 text-[#0A4174] border border-[#A7C7DD]/30">
                      {ann.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-bold leading-snug text-[#001D39]">{ann.title}</h4>
                  <p className="text-[11px] leading-relaxed text-slate-600 line-clamp-2">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts Grid */}
          <div className="border rounded-2xl p-6 bg-white border-[#A7C7DD] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#001D39]">Campus Quick Shortcuts</h3>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onNavigateTo('resources')}
                className="p-3 rounded-xl border text-left transition-all group flex items-center justify-between cursor-pointer bg-slate-50/50 border-slate-200/50 hover:bg-[#BDD8E9]/20 hover:border-[#A7C7DD]"
                id="quick-download-resources"
              >
                <div>
                  <span className="text-xs font-bold block text-[#001D39]">Notes Center</span>
                  <p className="text-[10px] text-slate-500">Download PDFs</p>
                </div>
                <FileDown className="w-4 h-4 text-slate-500 group-hover:text-[#0A4174] transition-colors" />
              </button>

              <button 
                onClick={() => onNavigateTo('map')}
                className="p-3 rounded-xl border text-left transition-all group flex items-center justify-between cursor-pointer bg-slate-50/50 border-slate-200/50 hover:bg-[#BDD8E9]/20 hover:border-[#A7C7DD]"
                id="quick-campus-navigator"
              >
                <div>
                  <span className="text-xs font-bold block text-[#001D39]">Campus Maps</span>
                  <p className="text-[10px] text-slate-500">Directions & Rooms</p>
                </div>
                <Navigation className="w-4 h-4 text-slate-500 group-hover:text-[#0A4174] transition-colors" />
              </button>

              <button 
                onClick={() => onNavigateTo('placements')}
                className="p-3 rounded-xl border text-left transition-all group flex items-center justify-between cursor-pointer bg-slate-50/50 border-slate-200/50 hover:bg-[#BDD8E9]/20 hover:border-[#A7C7DD]"
                id="quick-placement-portal"
              >
                <div>
                  <span className="text-xs font-bold block text-[#001D39]">Placement Hub</span>
                  <p className="text-[10px] text-slate-500">Active CSE Drives</p>
                </div>
                <Briefcase className="w-4 h-4 text-slate-500 group-hover:text-[#0A4174] transition-colors" />
              </button>

              <button 
                onClick={() => onNavigateTo('events')}
                className="p-3 rounded-xl border text-left transition-all group flex items-center justify-between cursor-pointer bg-slate-50/50 border-slate-200/50 hover:bg-[#BDD8E9]/20 hover:border-[#A7C7DD]"
                id="quick-event-enroll"
              >
                <div>
                  <span className="text-xs font-bold block text-[#001D39]">Join Events</span>
                  <p className="text-[10px] text-slate-500">CodeRed Hackathon</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-[#0A4174] transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

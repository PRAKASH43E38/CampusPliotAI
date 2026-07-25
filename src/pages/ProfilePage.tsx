import React from 'react';
import { Mail, GraduationCap, Award, BookOpen, Calendar, CheckCircle2, Sparkles } from 'lucide-react';
import { currentUser } from '../data/mockData';

export const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950 border border-emerald-800 text-white shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-24 h-24 rounded-3xl object-cover ring-4 ring-emerald-500/40 shadow-sm"
        />

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-black text-white">{currentUser.name}</h1>
              <p className="text-xs text-emerald-400 font-bold mt-0.5">{currentUser.department}</p>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/30">
              {currentUser.year} • {currentUser.section}
            </span>
          </div>

          <p className="text-xs text-emerald-200 mt-3 font-medium leading-relaxed">
            {currentUser.bio}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-400" /> {currentUser.email}</span>
            <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-emerald-400" /> Roll: {currentUser.rollNumber}</span>
          </div>
        </div>
      </div>

      {/* Academic Milestones Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">CGPA Grade</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">{currentUser.cgpa}</span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 inline-block">Top 5% of Batch</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Overall Attendance</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">{currentUser.attendancePct}%</span>
          <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">University Compliant</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Earned Credits</span>
          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 block mt-1">114</span>
          <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">Out of 160 required</span>
        </div>
      </div>

    </div>
  );
};

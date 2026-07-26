import React, { useState, useEffect } from 'react';
import { GraduationCap, Clock, Calendar, AlertTriangle, CheckCircle2, BookOpen, Award, Sparkles, UserCheck, ChevronRight } from 'lucide-react';
import { OFFICIAL_DEPARTMENTS, currentUser, academicSubjects, timetableSlots } from '../data/mockData';
import { CourseSubject } from '../types';
import { apiService } from '../services/apiService';

export const AcademicsPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>('Computer Science & Engineering');
  const [selectedSemester, setSelectedSemester] = useState<number>(6);
  const [activeTab, setActiveTab] = useState<'attendance' | 'timetable' | 'cgpa'>('attendance');
  const [coursesList, setCoursesList] = useState<CourseSubject[]>([]);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await apiService.getCourses();
        if (data && data.length > 0) {
          setCoursesList(data);
        }
      } catch (err) {
        console.error("Failed to load courses from SQLite:", err);
      }
    }
    loadCourses();
  }, []);

  const filteredSubjects = coursesList.filter((sub) => {
    const matchesDept = selectedDept === 'All Departments' || sub.department === selectedDept;
    return matchesDept;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-slate-900 to-cyan-950/40 border border-indigo-500/30 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4" /> Departmental Academic Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Academics, Attendance & CGPA Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Track real-time attendance thresholds, master timetable schedules, and target CGPA path calculators for your engineering department.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-2xl font-black text-emerald-400">{currentUser.attendancePct}%</span>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">Overall Attendance</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-2xl font-black text-cyan-400">{currentUser.cgpa}</span>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">Current CGPA</span>
          </div>
        </div>
      </div>

      {/* Department & Semester Control Panel */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-extrabold text-indigo-600 dark:text-indigo-400"
            >
              {OFFICIAL_DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-extrabold text-slate-900 dark:text-slate-100"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing subjects for <strong className="text-indigo-500">{selectedDept}</strong> (Sem {selectedSemester})
          </span>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'attendance' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Subjects & Attendance
            </button>
            <button
              onClick={() => setActiveTab('timetable')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'timetable' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Timetable Grid
            </button>
            <button
              onClick={() => setActiveTab('cgpa')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'cgpa' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              CGPA Calculator
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Subjects & Attendance */}
      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filteredSubjects.length > 0 ? filteredSubjects : academicSubjects.slice(0, 6)).map((sub) => {
            const pct = Math.round((sub.attendedClasses / sub.totalClasses) * 100);
            const isWarning = pct < 75;

            return (
              <div
                key={sub.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">{sub.code}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                      {sub.credits} Credits
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Faculty: {sub.facultyName} ({sub.facultyCabin})
                  </p>

                  {/* Attendance Percentage Progress */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Attendance Status
                      </span>
                      <span
                        className={`text-sm font-extrabold ${
                          isWarning ? 'text-rose-500' : 'text-emerald-500'
                        }`}
                      >
                        {pct}% ({sub.attendedClasses}/{sub.totalClasses})
                      </span>
                    </div>

                    <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWarning ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
                        }`}
                      />
                    </div>

                    {isWarning ? (
                      <div className="mt-2 text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        Warning: Attend next 3 classes to cross 75% threshold!
                      </div>
                    ) : (
                      <div className="mt-2 text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        Safe zone: Above university threshold!
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Projected Grade: <strong className="text-slate-900 dark:text-white">{sub.grade}</strong></span>
                  <button className="text-indigo-500 font-bold hover:underline">Syllabus PDF</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Timetable Grid */}
      {activeTab === 'timetable' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" /> Weekly Master Class Schedule ({selectedDept})
            </h3>
            <span className="text-xs text-indigo-500 font-bold">Sem {selectedSemester}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Venue & Room</th>
                  <th className="py-3 px-4">Faculty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {timetableSlots.slice(0, 12).map((slot) => (
                  <tr key={slot.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-indigo-600 dark:text-indigo-400">{slot.day}</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{slot.time}</td>
                    <td className="py-3.5 px-4 text-slate-900 dark:text-white font-bold">{slot.subjectName}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold">
                        {slot.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{slot.building} ({slot.room})</td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{slot.facultyName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: CGPA Calculator */}
      {activeTab === 'cgpa' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <Award className="w-10 h-10 text-amber-500 mx-auto mb-2" />
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Target CGPA Calculator ({selectedDept})</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Calculate required grades in upcoming semesters to achieve your goal.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center">
              <span className="text-xs text-slate-400 font-semibold block">Current CGPA</span>
              <span className="text-3xl font-black text-indigo-500">8.92</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center">
              <span className="text-xs text-slate-400 font-semibold block">Total Credits Earned</span>
              <span className="text-3xl font-black text-cyan-500">114 / 160</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Set Desired Target CGPA</label>
            <input
              type="range"
              min="7.0"
              max="10.0"
              step="0.05"
              defaultValue="9.2"
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>7.0</span>
              <span className="font-bold text-indigo-500">Target: 9.20</span>
              <span>10.0</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong className="text-indigo-600 dark:text-indigo-400 block mb-1">AI Grade Path:</strong>
            To reach 9.20 CGPA by graduation in {selectedDept}, you need a minimum GPA of <strong>9.45</strong> in Semester 7 and <strong>9.30</strong> in Semester 8 project work.
          </div>
        </div>
      )}
    </div>
  );
};

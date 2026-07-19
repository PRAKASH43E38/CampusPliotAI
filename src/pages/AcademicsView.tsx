/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { mockSubjects, mockClasses } from '../data/mockData';
import { 
  Calendar, 
  BookOpen, 
  Clock, 
  GraduationCap, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Info
} from 'lucide-react';

interface AcademicsViewProps {
  isDark?: boolean;
}

export default function AcademicsView({ isDark = false }: AcademicsViewProps) {
  const [activeTab, setActiveTab] = useState<'subjects' | 'timetable' | 'internal'>('subjects');
  const [activeDay, setActiveDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>('s-01');

  const filteredTimetable = mockClasses.filter(c => c.day === activeDay);
  const selectedSubject = mockSubjects.find(s => s.id === selectedSubjectId) || mockSubjects[0];

  return (
    <div className="space-y-8 pb-12 font-sans transition-colors duration-300">
      {/* Metric overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`border p-5 rounded-2xl shadow-sm transition-colors duration-300 ${
          isDark ? 'bg-[#0d0e11] border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900'
        }`}>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">Current Semester</span>
          <p className={`text-2xl font-black mt-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Semester V</p>
          <span className="text-xs text-slate-400 font-semibold block mt-1">B.Tech CSE (AI & ML)</span>
        </div>

        <div className={`border p-5 rounded-2xl shadow-sm transition-colors duration-300 ${
          isDark ? 'bg-[#0d0e11] border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900'
        }`}>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">Active Subjects</span>
          <p className={`text-2xl font-black mt-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{mockSubjects.length} Core Courses</p>
          <span className="text-xs text-slate-400 font-semibold block mt-1">18 Lecture Credits</span>
        </div>

        <div className={`border p-5 rounded-2xl shadow-sm transition-colors duration-300 ${
          isDark ? 'bg-[#0d0e11] border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900'
        }`}>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">Consolidated CGPA</span>
          <p className={`text-2xl font-black mt-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>8.76 / 10</p>
          <span className={`text-xs font-bold flex items-center gap-1 mt-1 ${isDark ? 'text-emerald-400' : 'text-green-600'}`}>
            <CheckCircle className="w-3.5 h-3.5" /> Excellent standing
          </span>
        </div>

        <div className={`border p-5 rounded-2xl shadow-sm transition-colors duration-300 ${
          isDark ? 'bg-[#0d0e11] border-slate-800 text-slate-100' : 'bg-white border-slate-200/80 text-slate-900'
        }`}>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">Academic Attendance</span>
          <p className={`text-2xl font-black mt-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>84.5% overall</p>
          <span className={`text-xs font-bold block mt-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>Safe above 75% cutoff</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex gap-6">
          {(['subjects', 'timetable', 'internal'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 text-sm font-bold border-b-2 transition-all capitalize cursor-pointer ${
                activeTab === tab 
                  ? 'border-blue-500 text-blue-500' 
                  : isDark 
                    ? 'border-transparent text-slate-400 hover:text-slate-100' 
                    : 'border-transparent text-slate-500 hover:text-slate-955'
              }`}
              id={`academics-tab-${tab}`}
            >
              {tab === 'internal' ? 'Internal Assessment Marks' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Subjects & Syllabus Detail */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Subjects List */}
          <div className={`border rounded-2xl overflow-hidden shadow-sm lg:col-span-7 transition-colors duration-300 ${
            isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200/80'
          }`}>
            <div className={`p-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
              <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>Active Core Subjects</h3>
              <p className="text-xs text-slate-500">Select any subject to view syllabus units and assigned faculty</p>
            </div>

            <div className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {mockSubjects.map(sub => (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`p-5 flex items-center justify-between cursor-pointer transition-all ${
                    selectedSubjectId === sub.id 
                      ? (isDark ? 'bg-blue-950/20' : 'bg-blue-50/50') 
                      : (isDark ? 'hover:bg-slate-900/40' : 'hover:bg-slate-50/50')
                  }`}
                  id={`subject-list-item-${sub.code.toLowerCase()}`}
                >
                  <div className="space-y-1 pr-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                        isDark 
                          ? 'text-blue-400 bg-blue-950/30 border-blue-900/30' 
                          : 'text-blue-600 bg-blue-50 border-blue-100'
                      }`}>
                        {sub.code}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{sub.credits} Credits</span>
                    </div>
                    <h4 className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{sub.name}</h4>
                    <p className="text-xs text-slate-400">Allocated: {sub.facultyName}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs text-slate-500 font-bold block">Attendance</span>
                    <span className={`text-base font-extrabold block ${
                      sub.attendance < 78 
                        ? (isDark ? 'text-rose-400' : 'text-rose-600') 
                        : (isDark ? 'text-slate-200' : 'text-slate-800')
                    }`}>
                      {sub.attendance}%
                    </span>
                    {sub.attendance < 78 && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border inline-flex items-center gap-0.5 mt-0.5 ${
                        isDark 
                          ? 'text-rose-400 bg-rose-950/25 border-rose-900/30' 
                          : 'text-rose-500 bg-rose-50 border-rose-100'
                      }`}>
                        <AlertTriangle className="w-2.5 h-2.5" /> Warning
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Selected Syllabus Units */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`border rounded-2xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200/80'
            }`}>
              <div className={`border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <span className={`text-xs font-bold uppercase tracking-widest block ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{selectedSubject.code} Syllabus</span>
                <h4 className={`text-base font-extrabold mt-1 ${isDark ? 'text-slate-100' : 'text-slate-955'}`}>{selectedSubject.name}</h4>
                <p className="text-xs text-slate-500 mt-1">Instructor: {selectedSubject.facultyName}</p>
              </div>

              <div className="space-y-4">
                {selectedSubject.syllabusUnits.map((unit, index) => (
                  <div key={index} className="flex gap-3">
                    <div className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 ${
                      isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {index + 1}
                    </div>
                    <p className={`text-xs font-semibold leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{unit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Curriculum Downloads */}
            <div className={`border rounded-2xl p-6 shadow-sm space-y-4 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200/80'
            }`}>
              <h4 className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Academic Regulations Downloads</h4>
              <div className="space-y-2">
                <a
                  href="#download-syllabus"
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all group ${
                    isDark 
                      ? 'bg-slate-900/40 border-slate-800 hover:bg-slate-850 text-slate-300' 
                      : 'bg-slate-50 hover:bg-slate-100/50 border-slate-200/40 text-slate-700'
                  }`}
                  id="download-full-syllabus-pdf"
                >
                  <div className="flex items-center gap-2 font-bold">
                    <FileText className="w-4 h-4 text-slate-400 animate-pulse" />
                    Full CSE curriculum 2023 Regulations PDF
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                </a>

                <a
                  href="#download-cal"
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all group ${
                    isDark 
                      ? 'bg-slate-900/40 border-slate-800 hover:bg-slate-850 text-slate-300' 
                      : 'bg-slate-50 hover:bg-slate-100/50 border-slate-200/40 text-slate-700'
                  }`}
                  id="download-calendar-pdf"
                >
                  <div className="flex items-center gap-2 font-bold">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    University Academic Calendar 2026 PDF
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Week Timetable View */}
      {activeTab === 'timetable' && (
        <div className={`border rounded-2xl overflow-hidden shadow-sm transition-colors duration-300 ${
          isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200/80'
        }`}>
          {/* Day selection row */}
          <div className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-slate-50/50'
          }`}>
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>Weekly Class Timetable</h3>
              <p className="text-xs text-slate-500">Semester V allocated slots and lecture locations</p>
            </div>

            <div className="flex overflow-x-auto gap-1.5 scrollbar-none">
              {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map(day => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                    activeDay === day 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : isDark 
                        ? 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800' 
                        : 'bg-white text-slate-600 hover:text-slate-950 border border-slate-200'
                  }`}
                  id={`timetable-day-${day.toLowerCase()}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className={`border-b text-xs font-bold uppercase font-mono tracking-wider ${
                    isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
                  }`}>
                    <th className="pb-3 pr-4">Slot Time</th>
                    <th className="pb-3 px-4">Subject</th>
                    <th className="pb-3 px-4">Course Code</th>
                    <th className="pb-3 px-4">Faculty Instructor</th>
                    <th className="pb-3 pl-4">Classroom Location</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-xs font-medium ${
                  isDark ? 'divide-slate-800 text-slate-300' : 'divide-slate-100 text-slate-850'
                }`}>
                  {filteredTimetable.map(item => (
                    <tr key={item.id} className={isDark ? 'hover:bg-slate-900/30 transition-colors' : 'hover:bg-slate-50/50 transition-colors'}>
                      <td className="py-4 pr-4 font-mono font-bold">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${
                          isDark 
                            ? 'text-blue-400 bg-blue-950/20 border-blue-900/30' 
                            : 'text-blue-700 bg-blue-50 border-blue-100'
                        }`}>
                          <Clock className="w-3.5 h-3.5 animate-pulse" />
                          {item.timeStart} - {item.timeEnd}
                        </span>
                      </td>
                      <td className={`py-4 px-4 font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{item.subjectName}</td>
                      <td className="py-4 px-4 font-mono text-slate-500">{item.subjectCode}</td>
                      <td className="py-4 px-4 text-slate-400">{item.facultyName}</td>
                      <td className={`py-4 pl-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Internal CIA Marks Sheet */}
      {activeTab === 'internal' && (
        <div className={`border rounded-2xl overflow-hidden shadow-sm transition-colors duration-300 ${
          isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200/80'
        }`}>
          <div className={`p-6 border-b ${
            isDark ? 'border-slate-800 bg-slate-900/20' : 'border-slate-200 bg-slate-50/50'
          }`}>
            <h3 className={`text-base font-bold ${isDark ? 'text-slate-100' : 'text-slate-955'}`}>Internal Assessment Marks Compilation</h3>
            <p className="text-xs text-slate-500">CIA continuous assessments compiled directly by exam branch (max marks 20)</p>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className={`border-b text-xs font-bold uppercase font-mono tracking-wider ${
                    isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
                  }`}>
                    <th className="pb-3 pr-4">Subject</th>
                    <th className="pb-3 px-4">CIA-1 (20)</th>
                    <th className="pb-3 px-4">CIA-2 (20)</th>
                    <th className="pb-3 px-4">CIA-3 (20)</th>
                    <th className="pb-3 px-4">Best of Two (20)</th>
                    <th className="pb-3 pl-4">Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-xs font-semibold ${
                  isDark ? 'divide-slate-800 text-slate-300' : 'divide-slate-100 text-slate-800'
                }`}>
                  {mockSubjects.map(sub => {
                    const sorted = [sub.ciaMarks.cia1, sub.ciaMarks.cia2, sub.ciaMarks.cia3].sort((a, b) => b - a);
                    const bestOfTwo = ((sorted[0] + sorted[1]) / 2).toFixed(1);
                    return (
                      <tr key={sub.id} className={isDark ? 'hover:bg-slate-900/30 transition-colors' : 'hover:bg-slate-50/50 transition-colors'}>
                        <td className="py-4 pr-4">
                          <span className={`block font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{sub.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">{sub.code} • {sub.facultyName}</span>
                        </td>
                        <td className="py-4 px-4 text-slate-400">{sub.ciaMarks.cia1} / 20</td>
                        <td className="py-4 px-4 text-slate-400">{sub.ciaMarks.cia2} / 20</td>
                        <td className="py-4 px-4 text-slate-400">{sub.ciaMarks.cia3} / 20</td>
                        <td className={`py-4 px-4 font-bold font-mono text-sm ${
                          isDark ? 'text-blue-400 bg-blue-950/10' : 'text-blue-750 bg-blue-50/30'
                        }`}>{bestOfTwo} / 20</td>
                        <td className="py-4 pl-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            Number(bestOfTwo) >= 15 
                              ? (isDark ? 'bg-green-950/30 text-green-400 border-green-900/30' : 'bg-green-50 text-green-700 border-green-200') 
                              : (isDark ? 'bg-yellow-950/30 text-yellow-400 border-yellow-900/30' : 'bg-yellow-50 text-yellow-700 border-yellow-200')
                          }`}>
                            {Number(bestOfTwo) >= 15 ? 'Excellent Stand' : 'Marginal Review'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className={`mt-6 p-4 border rounded-2xl flex items-start gap-3 ${
              isDark ? 'bg-blue-950/20 border-blue-900/30' : 'bg-blue-50/50 border-blue-200/50'
            }`}>
              <Info className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <div>
                <p className={`text-xs font-bold ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>Exam Office Regulation Disclaimer</p>
                <p className={`text-[11px] leading-relaxed mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                  Best of two Continuous Internal Assessment scores is processed to compile your internal contribution grade sheet (weighted 20%). Regularization is subject to final approval by the respective department head.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

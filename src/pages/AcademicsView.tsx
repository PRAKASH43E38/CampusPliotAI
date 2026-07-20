/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { mockStudent } from '../data/mockData';
import { 
  Calendar, 
  BookOpen, 
  Clock, 
  GraduationCap, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Info,
  RefreshCw
} from 'lucide-react';

interface AcademicsViewProps {
  isDark?: boolean;
}

export default function AcademicsView({}: AcademicsViewProps) {
  const [activeTab, setActiveTab] = useState<'subjects' | 'timetable' | 'internal'>('subjects');
  const [activeDay, setActiveDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  
  // Dynamic lists
  const [departments, setDepartments] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [timetable, setTimetable] = useState<any[]>([]);
  
  // Selected filter states
  const [selectedDept, setSelectedDept] = useState<string>('CSE');
  const [selectedSem, setSelectedSem] = useState<number>(5);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  
  // Details state
  const [subjectDetail, setSubjectDetail] = useState<any | null>(null);
  
  // Loading and Error states
  const [loading, setLoading] = useState(false);
  const [timetableLoading, setTimetableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ----------------------------------------------------
  // INITIAL DATA (Departments, Semesters)
  // ----------------------------------------------------
  useEffect(() => {
    fetch('/api/departments')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDepartments(data);
          const match = data.find(d => d.name === mockStudent.department || d.code === mockStudent.department);
          if (match) setSelectedDept(match.code);
        }
      })
      .catch(err => console.error("Error loading departments:", err));

    fetch('/api/semesters')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSemesters(data);
          if (mockStudent.semester) setSelectedSem(mockStudent.semester);
        }
      })
      .catch(err => console.error("Error loading semesters:", err));
  }, []);

  // ----------------------------------------------------
  // FETCH SUBJECTS (whenever dept or sem changes)
  // ----------------------------------------------------
  const loadSubjects = () => {
    setLoading(true);
    setError(null);
    fetch(`/api/academics/subjects?department=${selectedDept}&semester=${selectedSem}`, {
      headers: {
        'X-Student-Id': mockStudent.id || 'st-0982'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch subjects.");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setSubjects(data);
          if (data.length > 0) {
            setSelectedSubjectId(data[0].id);
          } else {
            setSelectedSubjectId(null);
            setSubjectDetail(null);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Unable to establish link with institutional API. Verify database connection.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSubjects();
  }, [selectedDept, selectedSem]);

  // ----------------------------------------------------
  // FETCH SELECTED SUBJECT DETAILS
  // ----------------------------------------------------
  useEffect(() => {
    if (!selectedSubjectId) return;
    fetch(`/api/academics/subjects/${selectedSubjectId}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setSubjectDetail(data);
      })
      .catch(() => {
        // Fallback to local item if API fails
        const matched = subjects.find(s => s.id === selectedSubjectId);
        if (matched) setSubjectDetail(matched);
      });
  }, [selectedSubjectId, subjects]);

  // ----------------------------------------------------
  // TIMETABLE
  // ----------------------------------------------------
  const loadTimetable = () => {
    setTimetableLoading(true);
    fetch(`/api/academics/timetable?department=${selectedDept}&semester=${selectedSem}&day=${activeDay}`)
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setTimetable(data);
        setTimetableLoading(false);
      })
      .catch(err => {
        console.error("Error loading timetable:", err);
        setTimetableLoading(false);
      });
  };

  useEffect(() => {
    loadTimetable();
  }, [activeDay, selectedDept, selectedSem]);

  const totalCredits = subjects.reduce((acc, sub) => acc + (sub.credits || 0), 0);
  const averageAttendance = subjects.length > 0 
    ? (subjects.reduce((acc, sub) => acc + (sub.attendance || 0), 0) / subjects.length).toFixed(1) 
    : '0.0';

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Metric overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border p-5 rounded-2xl bg-white border-[#A7C7DD] shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#4E8EA2] font-bold block">Current Semester</span>
          <p className="text-2xl font-extrabold mt-1 text-[#001D39]">Semester {selectedSem}</p>
          <span className="text-xs text-slate-500 font-semibold block mt-1">{selectedDept} Department</span>
        </div>

        <div className="border p-5 rounded-2xl bg-white border-[#A7C7DD] shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#4E8EA2] font-bold block">Active Subjects</span>
          <p className="text-2xl font-extrabold mt-1 text-[#001D39]">{subjects.length} Courses</p>
          <span className="text-xs text-slate-500 font-semibold block mt-1">{totalCredits} Lecture Credits</span>
        </div>

        <div className="border p-5 rounded-2xl bg-white border-[#A7C7DD] shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#4E8EA2] font-bold block">Consolidated CGPA</span>
          <p className="text-2xl font-extrabold mt-1 text-[#001D39]">{mockStudent.cgpa} / 10</p>
          <span className="text-xs font-bold flex items-center gap-1 mt-1 text-emerald-600">
            <CheckCircle className="w-3.5 h-3.5" /> Good standing
          </span>
        </div>

        <div className="border p-5 rounded-2xl bg-white border-[#A7C7DD] shadow-sm">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#4E8EA2] font-bold block">Academic Attendance</span>
          <p className="text-2xl font-extrabold mt-1 text-[#001D39]">{averageAttendance}% overall</p>
          <span className={`text-xs font-bold block mt-1 ${Number(averageAttendance) >= 75 ? 'text-[#0A4174]' : 'text-rose-600'}`}>
            {Number(averageAttendance) >= 75 ? 'Safe above 75% cutoff' : 'Attendance Review Warning'}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-[#A7C7DD]/60">
        <div className="flex gap-6">
          {(['subjects', 'timetable', 'internal'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-1 text-sm font-bold border-b-2 transition-all capitalize cursor-pointer ${
                activeTab === tab 
                  ? 'border-[#0A4174] text-[#0A4174]' 
                  : 'border-transparent text-[#4E8EA2] hover:text-[#001D39]'
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
          <div className="border rounded-2xl overflow-hidden shadow-sm lg:col-span-7 flex flex-col justify-between bg-white border-[#A7C7DD]">
            
            {/* Filter Section Header */}
            <div className="p-6 border-b border-[#A7C7DD]/60 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="text-base font-bold text-[#001D39]">Active Core Subjects</h3>
                  <p className="text-xs text-slate-500">Filter courses by department and semester timeline</p>
                </div>
                
                <div className="flex gap-2">
                  <select 
                    value={selectedDept}
                    onChange={(e) => {
                      setSelectedDept(e.target.value);
                      setSelectedSubjectId(null);
                    }}
                    className="py-1.5 px-3 border border-[#A7C7DD] bg-white rounded-xl text-xs font-bold transition-all outline-none text-[#001D39] focus:border-[#0A4174] focus:ring-2 focus:ring-[#0A4174]/10 cursor-pointer"
                  >
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.code}>{dept.code}</option>
                    ))}
                  </select>

                  <select 
                    value={selectedSem}
                    onChange={(e) => {
                      setSelectedSem(parseInt(e.target.value));
                      setSelectedSubjectId(null);
                    }}
                    className="py-1.5 px-3 border border-[#A7C7DD] bg-white rounded-xl text-xs font-bold transition-all outline-none text-[#001D39] focus:border-[#0A4174] focus:ring-2 focus:ring-[#0A4174]/10 cursor-pointer"
                  >
                    {semesters.map(sem => (
                      <option key={sem.id} value={sem.number}>Sem {sem.number}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* List Body */}
            <div className="divide-y divide-[#A7C7DD]/30 flex-1">
              {loading ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0A4174]" />
                  Loading department subjects...
                </div>
              ) : error ? (
                <div className="p-8 text-center text-xs text-rose-500 font-semibold">
                  <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-rose-500" />
                  {error}
                  <button onClick={loadSubjects} className="mt-3 block mx-auto px-4 py-1.5 bg-[#0A4174] hover:bg-[#002b52] text-white rounded-lg text-[10px] font-bold cursor-pointer">
                    Retry Fetching
                  </button>
                </div>
              ) : subjects.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500 font-bold">
                  No courses registered in this department for Semester {selectedSem}.
                </div>
              ) : (
                subjects.map(sub => {
                  const isSelected = selectedSubjectId === sub.id;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubjectId(sub.id)}
                      className={`p-5 flex items-center justify-between cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-[#BDD8E9]/20 border-l-4 border-l-[#0A4174]' 
                          : 'hover:bg-slate-50/50'
                      }`}
                      id={`subject-list-item-${sub.code.toLowerCase()}`}
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border text-[#0A4174] bg-[#BDD8E9]/20 border-[#A7C7DD]/40">
                            {sub.code}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">{sub.credits} Credits</span>
                        </div>
                        <h4 className="text-sm font-extrabold text-[#001D39]">{sub.name}</h4>
                        <p className="text-xs text-slate-500">Allocated coordinator: {sub.facultyName}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs text-slate-400 font-bold block">Attendance</span>
                        <span className={`text-base font-extrabold block ${sub.attendance < 75 ? 'text-rose-600' : 'text-[#001D39]'}`}>
                          {sub.attendance}%
                        </span>
                        {sub.attendance < 75 && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-50 border border-rose-100 text-rose-600 inline-flex items-center gap-0.5 mt-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" /> Warning
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Selected Syllabus Units & Subject Description */}
          <div className="lg:col-span-5 space-y-6">
            {subjectDetail ? (
              <div className="border rounded-2xl p-6 shadow-sm space-y-6 bg-white border-[#A7C7DD]">
                <div className="border-b border-[#A7C7DD]/60 pb-4">
                  <span className="text-xs font-bold uppercase tracking-widest block text-[#0A4174]">{subjectDetail.code} Syllabus Model</span>
                  <h4 className="text-base font-extrabold mt-1 text-[#001D39]">{subjectDetail.name}</h4>
                  <p className="text-xs text-slate-550 mt-1">Instructor: {subjectDetail.facultyName}</p>
                </div>

                {subjectDetail.description && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Course Description</span>
                    <p className="text-xs leading-relaxed text-slate-650 font-medium">{subjectDetail.description}</p>
                  </div>
                )}

                {subjectDetail.referenceBooks && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Reference Books</span>
                    <p className="text-xs leading-relaxed font-mono whitespace-pre-line text-slate-650 bg-slate-50 p-3 rounded-xl border border-slate-200/50">{subjectDetail.referenceBooks}</p>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Syllabus Breakdown</span>
                  <div className="space-y-3 pt-2">
                    {subjectDetail.syllabusUnits && subjectDetail.syllabusUnits.length > 0 ? (
                      subjectDetail.syllabusUnits.map((unit: string, index: number) => (
                        <div key={index} className="flex gap-3">
                          <div className="w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 bg-[#BDD8E9]/30 text-[#0A4174] border border-[#A7C7DD]/40">
                            {index + 1}
                          </div>
                          <p className="text-xs font-semibold leading-relaxed text-slate-700">{unit}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">No syllabus units seeded for this subject.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="border rounded-2xl p-6 shadow-sm text-center py-12 bg-white border-[#A7C7DD] text-slate-400">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                Select a subject to view descriptions, reference books, and syllabus models.
              </div>
            )}

            {/* Quick Curriculum Downloads */}
            <div className="border rounded-2xl p-6 shadow-sm space-y-4 bg-white border-[#A7C7DD]">
              <h4 className="text-sm font-bold text-[#001D39]">Academic Regulations Downloads</h4>
              <div className="space-y-2">
                <a
                  href="#download-syllabus"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200/60 bg-slate-50 hover:bg-[#BDD8E9]/20 hover:border-[#A7C7DD]/60 text-xs transition-all group font-bold text-slate-700"
                  id="download-full-syllabus-pdf"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-450" />
                    Full curriculum regulations syllabus PDF
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-[#0A4174]" />
                </a>

                <a
                  href="#download-cal"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200/60 bg-slate-50 hover:bg-[#BDD8E9]/20 hover:border-[#A7C7DD]/60 text-xs transition-all group font-bold text-slate-700"
                  id="download-calendar-pdf"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-450" />
                    University Academic Calendar 2026 PDF
                  </div>
                  <Download className="w-4 h-4 text-slate-400 group-hover:text-[#0A4174]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Week Timetable View */}
      {activeTab === 'timetable' && (
        <div className="border rounded-2xl overflow-hidden shadow-sm bg-white border-[#A7C7DD]">
          {/* Day selection row */}
          <div className="p-6 border-b border-[#A7C7DD]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
            <div>
              <h3 className="text-base font-bold text-[#001D39]">Weekly Class Timetable</h3>
              <p className="text-xs text-slate-500">Weekly allocated slots and lecture locations</p>
            </div>

            <div className="flex overflow-x-auto gap-1.5 scrollbar-none">
              {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const).map(day => {
                const isActive = activeDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      isActive 
                        ? 'bg-[#0A4174] text-white shadow-sm' 
                        : 'bg-white text-slate-600 hover:text-[#001D39] border border-slate-200'
                    }`}
                    id={`timetable-day-${day.toLowerCase()}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {timetableLoading ? (
              <p className="text-xs text-slate-500 text-center py-8">Fetching timetable logs...</p>
            ) : timetable.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No lecture sessions scheduled for {activeDay}.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-[#A7C7DD]/60 text-xs font-bold uppercase font-mono tracking-wider text-slate-400">
                      <th className="pb-3 pr-4">Slot Time</th>
                      <th className="pb-3 px-4">Subject</th>
                      <th className="pb-3 px-4">Course Code</th>
                      <th className="pb-3 px-4">Faculty Instructor</th>
                      <th className="pb-3 pl-4">Classroom Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#A7C7DD]/20 text-xs font-medium text-slate-700">
                    {timetable.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 pr-4 font-mono font-bold">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[#0A4174] bg-[#BDD8E9]/20 border-[#A7C7DD]/40">
                            <Clock className="w-3.5 h-3.5" />
                            {item.timeStart} - {item.timeEnd}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-extrabold text-[#001D39]">{item.subjectName}</td>
                        <td className="py-4 px-4 font-mono text-slate-500">{item.subjectCode}</td>
                        <td className="py-4 px-4 text-slate-500">{item.facultyName}</td>
                        <td className="py-4 pl-4 font-semibold text-[#0A4174]">{item.room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Internal CIA Marks Sheet */}
      {activeTab === 'internal' && (
        <div className="border rounded-2xl overflow-hidden shadow-sm bg-white border-[#A7C7DD]">
          <div className="p-6 border-b border-[#A7C7DD]/60 bg-slate-50/30">
            <h3 className="text-base font-bold text-[#001D39]">Internal Assessment Marks Compilation</h3>
            <p className="text-xs text-slate-500">CIA continuous assessments compiled directly by exam branch (max marks 20)</p>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#A7C7DD]/60 text-xs font-bold uppercase font-mono tracking-wider text-slate-400">
                    <th className="pb-3 pr-4">Subject</th>
                    <th className="pb-3 px-4">CIA-1 (20)</th>
                    <th className="pb-3 px-4">CIA-2 (20)</th>
                    <th className="pb-3 px-4">CIA-3 (20)</th>
                    <th className="pb-3 px-4">Best of Two (20)</th>
                    <th className="pb-3 pl-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#A7C7DD]/20 text-xs font-semibold text-slate-700">
                  {subjects.map(sub => {
                    const sorted = [sub.ciaMarks.cia1, sub.ciaMarks.cia2, sub.ciaMarks.cia3].sort((a, b) => b - a);
                    const bestOfTwo = ((sorted[0] + sorted[1]) / 2).toFixed(1);
                    return (
                      <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 pr-4">
                          <span className="block font-extrabold text-[#001D39]">{sub.name}</span>
                          <span className="text-[10px] font-mono text-slate-500">{sub.code} • {sub.facultyName}</span>
                        </td>
                        <td className="py-4 px-4 text-slate-500">{sub.ciaMarks.cia1} / 20</td>
                        <td className="py-4 px-4 text-slate-500">{sub.ciaMarks.cia2} / 20</td>
                        <td className="py-4 px-4 text-slate-500">{sub.ciaMarks.cia3} / 20</td>
                        <td className="py-4 px-4 font-bold font-mono text-sm text-[#0A4174] bg-[#BDD8E9]/10">{bestOfTwo} / 20</td>
                        <td className="py-4 pl-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            Number(bestOfTwo) >= 15 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : 'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {Number(bestOfTwo) >= 15 ? 'Excellent Stand' : 'Marginal Review'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {subjects.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-slate-550 font-semibold">
                        No subject evaluation marks registered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 border rounded-2xl flex items-start gap-3 bg-[#BDD8E9]/10 border-[#A7C7DD]/40">
              <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#0A4174]" />
              <div>
                <p className="text-xs font-bold text-[#0A4174]">Exam Office Regulation Disclaimer</p>
                <p className="text-[11px] leading-relaxed mt-0.5 text-slate-600">
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

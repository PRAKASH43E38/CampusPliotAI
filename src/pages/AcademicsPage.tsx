import React, { useState, useEffect } from 'react';
import { GraduationCap, Calendar, AlertTriangle, CheckCircle2, BookOpen, Award, Sparkles } from 'lucide-react';
import { academicSubjects, timetableSlots, OFFICIAL_DEPARTMENTS as fallbackDepts } from '../data/staticData';
import { CourseSubject } from '../types';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

export const AcademicsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedDept, setSelectedDept] = useState<string>('Computer Science & Engineering');
  const [selectedSemester, setSelectedSemester] = useState<number>(6);
  const [activeTab, setActiveTab] = useState<'attendance' | 'timetable' | 'cgpa'>('attendance');
  const [coursesList, setCoursesList] = useState<CourseSubject[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    async function loadDeptsAndCourses() {
      try {
        const [rawDepts, data] = await Promise.all([
          apiService.getDepartments(),
          apiService.getCourses()
        ]);
        if (rawDepts && rawDepts.length > 0) {
          const names = rawDepts.map(d => d.dept_name);
          setDepartments(['All Departments', ...names]);
        } else {
          setDepartments(Array.from(fallbackDepts));
        }
        if (data && data.length > 0) {
          setCoursesList(data);
        }
      } catch (err) {
        console.error("Failed to load data in AcademicsPage:", err);
        setDepartments(Array.from(fallbackDepts));
      }
    }
    loadDeptsAndCourses();
  }, []);

  const filteredSubjects = coursesList.filter((sub) => {
    const matchesDept = selectedDept === 'All Departments' || sub.department === selectedDept;
    return matchesDept;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F8FAF8] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4" /> Academic Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-[#F8FAFC] tracking-tight">
            Academics, Attendance & CGPA Tracker
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#CBD5E1] mt-1 max-w-xl">
            Track real-time attendance thresholds, master timetable schedules, and target CGPA path calculators for your department.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-center">
            <span className="text-2xl font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">{user?.attendancePct || 88.5}%</span>
            <span className="block text-[10px] text-[#6B7280] dark:text-[#CBD5E1] font-semibold uppercase">Overall Attendance</span>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-center">
            <span className="text-2xl font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">{user?.cgpa || 8.92}</span>
            <span className="block text-[10px] text-[#6B7280] dark:text-[#CBD5E1] font-semibold uppercase">Current CGPA</span>
          </div>
        </div>
      </div>

      {/* Department & Semester Control Panel */}
      <div className="p-4 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] space-y-4">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E5E7EB] dark:border-[#475569] pb-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#6B7280] dark:text-[#CBD5E1] uppercase tracking-wider">Department:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-xs font-bold text-[#1F2937] dark:text-[#F8FAFC]"
            >
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#6B7280] dark:text-[#CBD5E1] uppercase tracking-wider">Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="px-3 py-1.5 bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-xs font-bold text-[#1F2937] dark:text-[#F8FAFC]"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-xs text-[#6B7280] dark:text-[#CBD5E1]">
            Showing subjects for <strong className="text-[#2E7D32] dark:text-[#4CAF50]">{selectedDept}</strong> (Sem {selectedSemester})
          </span>

          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer border-none ${
                activeTab === 'attendance' ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold' : 'text-[#6B7280] dark:text-[#CBD5E1]'
              }`}
            >
              Subjects & Attendance
            </button>
            <button
              onClick={() => setActiveTab('timetable')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer border-none ${
                activeTab === 'timetable' ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold' : 'text-[#6B7280] dark:text-[#CBD5E1]'
              }`}
            >
              Timetable Grid
            </button>
            <button
              onClick={() => setActiveTab('cgpa')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer border-none ${
                activeTab === 'cgpa' ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold' : 'text-[#6B7280] dark:text-[#CBD5E1]'
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
                className="p-5 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#475569] pb-3 mb-3">
                    <span className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50]">{sub.code}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#81C784] font-bold">
                      {sub.credits} Credits
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-[#1F2937] dark:text-[#F8FAFC]">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] mt-1">
                    Faculty: {sub.facultyName} ({sub.facultyCabin})
                  </p>

                  {/* Attendance Percentage Progress */}
                  <div className="mt-4 p-3.5 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155]">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-[#6B7280] dark:text-[#CBD5E1]">
                        Attendance Status
                      </span>
                      <span
                        className={`text-sm font-extrabold ${
                          isWarning ? 'text-red-600 dark:text-red-400' : 'text-[#2E7D32] dark:text-[#4CAF50]'
                        }`}
                      >
                        {pct}% ({sub.attendedClasses}/{sub.totalClasses})
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-[#E5E7EB] dark:bg-[#334155] overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className={`h-full rounded-full transition-all duration-300 ${
                          isWarning ? 'bg-red-600 dark:bg-red-500' : 'bg-[#2E7D32] dark:bg-[#4CAF50]'
                        }`}
                      />
                    </div>

                    {isWarning ? (
                      <div className="mt-2 text-[11px] text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        Warning: Below 75% threshold!
                      </div>
                    ) : (
                      <div className="mt-2 text-[11px] text-[#2E7D32] dark:text-[#4CAF50] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        Safe zone: Above requirement.
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5E7EB] dark:border-[#475569] flex items-center justify-between text-xs">
                  <span className="text-[#6B7280] dark:text-[#CBD5E1]">Projected Grade: <strong className="text-[#1F2937] dark:text-[#F8FAFC]">{sub.grade}</strong></span>
                  <button className="text-[#2E7D32] dark:text-[#4CAF50] font-bold hover:underline cursor-pointer border-none bg-transparent">Syllabus PDF</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Timetable Grid */}
      {activeTab === 'timetable' && (
        <div className="p-6 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" /> Weekly Master Class Schedule ({selectedDept})
            </h3>
            <span className="text-xs text-[#2E7D32] dark:text-[#4CAF50] font-bold">Sem {selectedSemester}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-[#475569] text-[#6B7280] dark:text-[#CBD5E1] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Venue & Room</th>
                  <th className="py-3 px-4">Faculty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#475569] font-medium">
                {timetableSlots.slice(0, 12).map((slot) => (
                  <tr key={slot.id} className="hover:bg-white dark:hover:bg-[#162033] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#2E7D32] dark:text-[#4CAF50]">{slot.day}</td>
                    <td className="py-3.5 px-4 text-[#6B7280] dark:text-[#CBD5E1]">{slot.time}</td>
                    <td className="py-3.5 px-4 text-[#1F2937] dark:text-[#F8FAFC] font-bold">{slot.subjectName}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#81C784] text-[10px] font-bold">
                        {slot.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#6B7280] dark:text-[#CBD5E1]">{slot.building} ({slot.room})</td>
                    <td className="py-3.5 px-4 text-[#6B7280] dark:text-[#CBD5E1]">{slot.facultyName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: CGPA Calculator */}
      {activeTab === 'cgpa' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <Award className="w-10 h-10 text-[#2E7D32] dark:text-[#4CAF50] mx-auto mb-2" />
            <h3 className="text-lg font-extrabold text-[#1F2937] dark:text-[#F8FAFC]">Target CGPA Calculator ({selectedDept})</h3>
            <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] mt-1">Calculate required grades in upcoming semesters to achieve your goal.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-center">
              <span className="text-xs text-[#6B7280] dark:text-[#CBD5E1] font-semibold block">Current CGPA</span>
              <span className="text-3xl font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">8.92</span>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-center">
              <span className="text-xs text-[#6B7280] dark:text-[#CBD5E1] font-semibold block">Total Credits Earned</span>
              <span className="text-3xl font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">114 / 160</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#1F2937] dark:text-[#F8FAFC] uppercase tracking-wider">Set Desired Target CGPA</label>
            <input
              type="range"
              min="7.0"
              max="10.0"
              step="0.05"
              defaultValue="9.2"
              className="w-full accent-[#2E7D32] dark:accent-[#4CAF50]"
            />
            <div className="flex justify-between text-xs text-[#6B7280] dark:text-[#CBD5E1]">
              <span>7.0</span>
              <span className="font-bold text-[#2E7D32] dark:text-[#4CAF50]">Target: 9.20</span>
              <span>10.0</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-xs text-[#1F2937] dark:text-[#F8FAFC] leading-relaxed">
            <strong className="text-[#2E7D32] dark:text-[#4CAF50] block mb-1">AI Grade Path:</strong>
            To reach 9.20 CGPA by graduation in {selectedDept}, you need a minimum GPA of <strong>9.45</strong> in Semester 7 and <strong>9.30</strong> in Semester 8 project work.
          </div>
        </div>
      )}
    </div>
  );
};

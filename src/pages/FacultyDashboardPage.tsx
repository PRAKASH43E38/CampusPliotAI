import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Calendar, Clock, MapPin, BookOpen, Users, FolderKanban, 
  CheckCircle2, ArrowRight, Plus, Send, GraduationCap, Briefcase, Award, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { facultyScheduleSlots } from '../data/staticData';

export const FacultyDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [markedAttendance, setMarkedAttendance] = useState<Record<string, boolean>>({});

  const facultySchedule = facultyScheduleSlots;

  const handledSubjects = [
    { code: 'CS301', name: 'Data Structures & Algorithms', department: 'CSE', yearSec: '2nd Year - Sec A', totalStudents: 68, room: 'LH-101' },
    { code: 'CS601', name: 'Artificial Intelligence & Neural Nets', department: 'CSE', yearSec: '3rd Year - Sec B', totalStudents: 72, room: 'LH-201' },
    { code: 'CS601L', name: 'AI & Agentic Systems Lab', department: 'CSE', yearSec: '3rd Year - Sec B', totalStudents: 36, room: 'AI-304' }
  ];

  const quickPrompts = [
    "Which classes do I have today?",
    "What is my timetable?",
    "Which hour is DSA today?",
    "Which classroom should I teach next?",
    "What subjects am I handling?",
    "Show today's schedule."
  ];

  const handlePromptClick = (prompt: string) => {
    navigate(`/copilot?query=${encodeURIComponent(prompt)}`);
  };

  const toggleAttendance = (id: string) => {
    setMarkedAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Faculty Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-800 to-[#1F2937] dark:from-[#172235] dark:to-[#1E293B] text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 text-xs font-bold">
            <Briefcase className="w-3.5 h-3.5" /> Logged in as Faculty Member
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Dr. Rajesh Sharma'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            {user?.designation || 'Professor & HOD'} • {user?.department || 'Computer Science & Engineering'} • Cabin {user?.cabin || 'HOD-301'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 relative z-10 shrink-0">
          <button
            onClick={() => navigate('/resources')}
            className="px-4 py-2.5 rounded-xl bg-white text-[#2E7D32] hover:bg-emerald-50 font-bold text-xs flex items-center gap-1.5 border-none cursor-pointer shadow-sm transition-all"
          >
            <FolderKanban className="w-4 h-4" /> Manage Resources
          </button>
          <button
            onClick={() => navigate('/copilot')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 border-none cursor-pointer shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" /> Faculty AI Assistant
          </button>
        </div>
      </div>

      {/* Faculty AI Quick Query Panel */}
      <div className="p-5 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
            Faculty AI Quick Assistant Prompts
          </h3>
          <span className="text-[10px] text-[#6B7280] dark:text-[#CBD5E1]">Role-Aware Intelligence</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(prompt)}
              className="p-3 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-left hover:border-[#2E7D32] dark:hover:border-[#4CAF50] transition-colors cursor-pointer group"
            >
              <p className="text-xs font-semibold text-[#1F2937] dark:text-[#F8FAFC] group-hover:text-[#2E7D32] dark:group-hover:text-[#4CAF50] flex items-center justify-between">
                <span>"{prompt}"</span>
                <Send className="w-3 h-3 text-[#6B7280] group-hover:text-[#2E7D32] shrink-0" />
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Handled Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Today's Teaching Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#475569] pb-3">
              <div>
                <h2 className="font-extrabold text-base text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
                  Today's Teaching Schedule (Monday)
                </h2>
                <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] mt-0.5">Live timetable slots for Dr. Rajesh Sharma</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#81C784] font-bold text-xs">
                3 Sessions Today
              </span>
            </div>

            <div className="space-y-3">
              {facultySchedule.slice(0, 3).map((slot) => {
                const isMarked = markedAttendance[slot.id];
                return (
                  <div
                    key={slot.id}
                    className="p-4 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] dark:bg-[#1E293B] text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center font-bold text-sm shrink-0">
                        H{slot.hour}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-[#1F2937] dark:text-[#F8FAFC]">{slot.subjectName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-mono">
                            {slot.subjectCode}
                          </span>
                        </div>
                        <p className="text-xs text-[#2E7D32] dark:text-[#4CAF50] font-semibold mt-0.5">
                          {slot.yearSection} • Classroom: <span className="font-bold">{slot.room}</span> ({slot.building})
                        </p>
                        <p className="text-[11px] text-[#6B7280] dark:text-[#CBD5E1] flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 text-[#2E7D32]" /> {slot.time} • {slot.type}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleAttendance(slot.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border-none transition-colors shrink-0 ${
                        isMarked
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#E8F5E9] dark:bg-[#1E293B] text-[#2E7D32] dark:text-[#81C784] hover:bg-[#2E7D32] hover:text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      {isMarked ? 'Attendance Marked' : 'Mark Attendance'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Upload Action Box */}
          <div className="p-5 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-[#1F2937] dark:text-[#F8FAFC]">Academic Resource Center Management</h3>
              <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1]">Upload lecture notes, assignment sheets, PYQs, and lab manuals for students.</p>
            </div>
            <button
              onClick={() => navigate('/resources')}
              className="px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs border-none cursor-pointer shrink-0"
            >
              Upload Materials Now
            </button>
          </div>
        </div>

        {/* Right Col: Handled Subjects & Stats */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] space-y-4">
            <h3 className="font-extrabold text-sm text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-2 border-b border-[#E5E7EB] dark:border-[#475569] pb-3">
              <GraduationCap className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
              Assigned Subjects & Batches
            </h3>

            <div className="space-y-3">
              {handledSubjects.map((sub, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1F2937] dark:text-[#F8FAFC]">{sub.name}</span>
                    <span className="text-[10px] font-mono text-[#2E7D32] dark:text-[#4CAF50] font-bold">{sub.code}</span>
                  </div>
                  <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1]">{sub.yearSec}</p>
                  <div className="flex items-center justify-between text-[10px] text-[#6B7280] dark:text-[#CBD5E1] pt-1">
                    <span>{sub.totalStudents} Enrolled Students</span>
                    <span className="font-bold text-[#2E7D32] dark:text-[#4CAF50]">Room {sub.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] space-y-3">
            <h3 className="font-extrabold text-sm text-[#1F2937] dark:text-[#F8FAFC]">Faculty Quick Directory</h3>
            <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1]">Check status of department colleagues and reserve cabins for research meetings.</p>
            <button
              onClick={() => navigate('/faculty')}
              className="w-full py-2 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC] font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
            >
              Open Faculty Directory <ArrowRight className="w-3.5 h-3.5 text-[#2E7D32]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FacultyDashboardPage;

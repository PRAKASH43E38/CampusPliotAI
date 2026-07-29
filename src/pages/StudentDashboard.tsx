import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Clock, GraduationCap, Award, BookOpen, ArrowUpRight, Bell, UserPlus } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { timetableSlots, academicResources } from '../data/staticData';
import { Announcement } from '../types';
import { apiService } from '../services/apiService';
import { StudentOnboardingModal } from '../components/common/StudentOnboardingModal';
import { useAuth } from '../context/AuthContext';
import freshersBanner from '../assets/welcome-freshers-banner.jpeg';

export const StudentDashboard: React.FC = () => {
  const { profileCompleted, user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const nextClass = timetableSlots[0];

  useEffect(() => {
    async function loadData() {
      try {
        const anns = await apiService.getAnnouncements();
        if (anns && anns.length > 0) setAnnouncements(anns);
      } catch (err) {
        console.error("Failed to load announcements for StudentDashboard:", err);
      }
    }
    loadData();

    if (user?.role === 'student' && !profileCompleted) {
      setShowOnboardingModal(true);
    }
  }, [profileCompleted, user]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Onboarding Callout Banner */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#F8FAF8] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center font-bold text-lg shrink-0 border border-[#DDE5DD] dark:border-[#334155]">
            🎓
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-2">
              Student Profile Onboarding Registration
            </h3>
            <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1]">
              Complete your student profile to store academic details, skills, and preferences permanently.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowOnboardingModal(true)}
          className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs shrink-0 flex items-center gap-2 transition-colors border-none cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Complete Onboarding Form
        </button>
      </div>
      
      {/* Freshers Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#DDE5DD] dark:border-[#334155] bg-white dark:bg-[#162033] flex justify-center p-2">
        <img
          src={freshersBanner}
          alt="Welcome Freshers 2026"
          className="w-full max-w-4xl h-auto object-contain rounded-xl"
        />
      </div>

      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-[#F8FAF8] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#2E7D32] dark:text-[#4CAF50] font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Official Student Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-[#F8FAFC] tracking-tight">
            Welcome back, {(user?.name || 'Student').split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#CBD5E1] mt-1 font-medium max-w-xl">
            {user?.department || 'Computer Science & Engineering'} • {user?.year || '3rd Year'} ({user?.section || 'A'}) • Roll No: {user?.rollNumber || '21CS8042'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/copilot"
            className="px-4 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs transition-colors border-none"
          >
            Ask Copilot
          </Link>
          <Link
            to="/map"
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC] font-semibold text-xs hover:bg-[#F4F8F4] transition-colors"
          >
            Campus Map
          </Link>
        </div>
      </div>

      {/* Next Class Alert Bar */}
      <div className="p-4 rounded-2xl bg-[#E8F5E9] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2E7D32] dark:bg-[#4CAF50] text-white flex items-center justify-center font-bold text-sm shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold uppercase">
                Upcoming Class
              </span>
              <span className="text-xs text-[#6B7280] dark:text-[#CBD5E1] font-bold">{nextClass.time}</span>
            </div>
            <h4 className="font-extrabold text-sm text-[#1F2937] dark:text-[#F8FAFC] mt-0.5">
              {nextClass.subjectName} ({nextClass.subjectCode})
            </h4>
            <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1]">
              Instructor: {nextClass.facultyName} • Venue: {nextClass.building} ({nextClass.room})
            </p>
          </div>
        </div>

        <Link
          to={`/map?bldg=bldg_01`}
          className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1 border-none"
        >
          Navigate to Venue <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Attendance"
          value={`${user?.attendancePct || 88.5}%`}
          change="+1.2%"
          isPositive={true}
          icon={GraduationCap}
          subtitle="Safe zone (Minimum 75% required)"
        />
        <StatCard
          title="Current CGPA"
          value={user?.cgpa || 8.92}
          change="+0.15"
          isPositive={true}
          icon={Award}
          subtitle="Semester 6 • Rank 4 in CSE-B"
        />
        <StatCard
          title="Earned Credits"
          value="114 / 160"
          icon={BookOpen}
          subtitle="Degree completion: 71.2%"
        />
        <StatCard
          title="Enrolled Fests"
          value="2 Events"
          icon={Calendar}
          subtitle="HackCampus 2026 Seat Verified"
        />
      </div>

      {/* Main Dashboard Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Today's Schedule & Academic Overview */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Schedule */}
          <div className="p-6 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#475569] pb-3">
              <h3 className="font-bold text-base text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" /> Today's Lecture Schedule
              </h3>
              <Link to="/academics" className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] hover:underline">
                Full Timetable Grid →
              </Link>
            </div>

            <div className="space-y-3">
              {timetableSlots.slice(0, 3).map((slot) => (
                <div
                  key={slot.id}
                  className="p-4 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#E8F5E9] dark:bg-[#1E293B] text-[#2E7D32] dark:text-[#4CAF50]">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#1F2937] dark:text-[#F8FAFC]">
                        {slot.subjectName}
                      </h4>
                      <p className="text-[11px] text-[#6B7280] dark:text-[#CBD5E1]">
                        {slot.subjectCode} • {slot.facultyName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                      {slot.time}
                    </span>
                    <p className="text-[10px] text-[#6B7280] dark:text-[#CBD5E1]">
                      {slot.building} ({slot.room})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Vault & Resources */}
          <div className="p-6 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#475569] pb-3">
              <h3 className="font-bold text-base text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" /> Course Resources & Lecture Notes
              </h3>
              <Link to="/resources" className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] hover:underline">
                View All Vault Files →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {academicResources.slice(0, 4).map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] space-y-2"
                >
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F5E9] dark:bg-[#1E293B] text-[#2E7D32] dark:text-[#81C784] font-bold">
                    {res.subject}
                  </span>
                  <h4 className="font-bold text-xs text-[#1F2937] dark:text-[#F8FAFC] line-clamp-1">
                    {res.title}
                  </h4>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#CBD5E1]">
                    {res.type} • {res.fileSize}
                  </p>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] hover:underline"
                  >
                    Download Resource →
                  </a>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 col): Official Broadcasts */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#475569] pb-3">
              <h3 className="font-bold text-base text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" /> Official Broadcasts
              </h3>
              <Link to="/events" className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {announcements.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] dark:bg-[#1E293B] text-[#2E7D32] dark:text-[#81C784]">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-[#6B7280] dark:text-[#CBD5E1]">{item.date || (item as any).publish_date}</span>
                  </div>
                  <h4 className="font-bold text-xs text-[#1F2937] dark:text-[#F8FAFC]">{item.title}</h4>
                  <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] line-clamp-2">{item.content || (item as any).description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Onboarding Modal */}
      {showOnboardingModal && (
        <StudentOnboardingModal isOpen={showOnboardingModal} onClose={() => setShowOnboardingModal(false)} />
      )}

    </div>
  );
};

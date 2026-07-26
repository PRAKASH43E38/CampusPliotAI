import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Clock, GraduationCap, Award, BookOpen, ChevronRight, ArrowUpRight, Bell, UserPlus } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { currentUser, timetableSlots, academicResources } from '../data/mockData';
import { Announcement } from '../types';
import { apiService } from '../services/apiService';
import { StudentOnboardingModal } from '../components/common/StudentOnboardingModal';
import { useAuth } from '../context/AuthContext';
import freshersBanner from '../assets/welcome-freshers-banner.jpeg';

export const StudentDashboard: React.FC = () => {
  const { profileCompleted, user } = useAuth();
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>([]);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const nextClass = timetableSlots[0];

  useEffect(() => {
    async function loadData() {
      try {
        const anns = await apiService.getAnnouncements();
        if (anns && anns.length > 0) setAnnouncementsList(anns);
      } catch (err) {
        console.error("Failed to load announcements for StudentDashboard:", err);
      }
    }
    loadData();

    // Auto open onboarding modal if first-time student login and profile not completed
    if (user?.role === 'student' && !profileCompleted) {
      setShowOnboardingModal(true);
    }
  }, [profileCompleted, user]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Onboarding Callout Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 border border-emerald-500/30 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg shrink-0">
            🎓
          </div>
          <div>
            <h3 className="font-black text-sm text-white flex items-center gap-2">
              Student Profile Onboarding Registration
            </h3>
            <p className="text-xs text-slate-300">
              Complete your student profile to store academic details, skills, and economic info permanently in SSE FESTA Student Database.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowOnboardingModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shrink-0 flex items-center gap-2 transition-all hover:scale-105"
        >
          <UserPlus className="w-4 h-4" /> Complete Onboarding Form
        </button>
      </div>
      
      {/* Freshers Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 flex justify-center p-2">
        <img
          src={freshersBanner}
          alt="Welcome Freshers 2026"
          className="w-full max-w-4xl h-auto object-contain rounded-2xl"
        />
      </div>

      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950 border border-emerald-800 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-addictive font-black text-xs uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-addictive animate-pulse" /> AI Powered Campus Intelligence
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Welcome back, {currentUser.name.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 font-medium max-w-xl leading-relaxed">
            {currentUser.department} • {currentUser.year} ({currentUser.section}) • Roll No: {currentUser.rollNumber}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/copilot"
            className="px-5 py-3 rounded-2xl bg-addictive text-white font-black text-xs shadow-sm flex items-center gap-2 transition-all hover:scale-105 hover:shadow-md hover:shadow-pink-500/25 border-none"
          >
            Ask Copilot
          </Link>
          <Link
            to="/map"
            className="px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center gap-2"
          >
            Campus Map
          </Link>
        </div>
      </div>

      {/* Next Class Alert Bar */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-addictive text-white font-black uppercase border-none">
                Upcoming Class
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">{nextClass.time}</span>
            </div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-0.5">
              {nextClass.subjectName} ({nextClass.subjectCode})
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Instructor: {nextClass.facultyName} • Venue: {nextClass.building} ({nextClass.room})
            </p>
          </div>
        </div>

        <Link
          to={`/map?bldg=bldg_01`}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all shrink-0 flex items-center gap-1"
        >
          Navigate to Venue <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
          <div className="relative">
            <StatCard
              title="Overall Attendance"
              value={`${currentUser.attendancePct}%`}
              change="+1.2%"
              isPositive={true}
              icon={GraduationCap}
              color="emerald"
              subtitle="Safe zone (Minimum 75% required)"
            />
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
          <div className="relative">
            <StatCard
              title="Current CGPA"
              value={currentUser.cgpa || 8.92}
              change="+0.15"
              isPositive={true}
              icon={Award}
              color="emerald"
              subtitle="Semester 6 • Rank 4 in CSE-B"
            />
          </div>
        </div>
        <StatCard
          title="Earned Credits"
          value="114 / 160"
          icon={BookOpen}
          color="emerald"
          subtitle="Degree completion: 71.2%"
        />
        <StatCard
          title="Enrolled Fests"
          value="2 Events"
          icon={Calendar}
          color="emerald"
          subtitle="HackCampus 2026 Seat Verified"
        />
      </div>

      {/* Main Dashboard Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 cols): Today's Schedule & Academic Overview */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Schedule */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" /> Today's Lecture Schedule
              </h3>
              <Link to="/academics" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                Full Timetable Grid →
              </Link>
            </div>

            <div className="space-y-3">
              {timetableSlots.slice(0, 3).map((slot, idx) => (
                <div
                  key={slot.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{slot.subjectName}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                        {slot.facultyName} • {slot.building} ({slot.room})
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">{slot.time}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase mt-1 inline-block">
                      {slot.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Study Materials */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" /> Recommended Study Materials
              </h3>
              <Link to="/resources" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                Explore Vault →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {academicResources.slice(0, 2).map((res) => (
                <div key={res.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                      {res.type}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-1.5 line-clamp-2">
                      {res.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">{res.subject}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                    <span>{res.fileSize}</span>
                    <Link to="/resources" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Download PDF</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1 col): AI Suggestions & Announcements */}
        <div className="space-y-6">
          
          {/* AI Smart Suggestions */}
          <div className="p-6 rounded-3xl bg-emerald-950 border border-emerald-800 text-white shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" /> AI Recommendations
            </div>
            <h4 className="font-bold text-sm text-white">HackCampus 2026 Team Formation Live</h4>
            <p className="text-xs text-emerald-200 leading-relaxed font-medium">
              Based on your interests in AI/ML, we recommend connecting with 2 teammates for HackCampus 2026.
            </p>
            <Link
              to="/copilot"
              className="w-full mt-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all"
            >
              Open AI Team Matcher <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pinned Broadcasts */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" /> Campus Broadcasts
            </h3>
            <div className="space-y-3">
              {announcementsList.slice(0, 2).map((ann) => (
                <div key={ann.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-medium">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{ann.category}</span>
                    <span>{ann.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{ann.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 font-medium">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <StudentOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />
    </div>
  );
};

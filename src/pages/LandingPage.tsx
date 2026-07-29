import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, GraduationCap, ArrowRight, ShieldCheck, Users, Award, Send } from 'lucide-react';
import { Footer } from '../components/common/Footer';
import welcomeImg from '../assets/welcome-freshers.png';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A] text-[#1F2937] dark:text-[#F8FAFC] font-sans">

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-[#DDE5DD] dark:border-[#334155] bg-white dark:bg-[#162033]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D32] dark:bg-[#4CAF50] flex items-center justify-center text-white font-bold">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#1F2937] dark:text-[#F8FAFC]">
              CampusPilot AI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-[#6B7280] dark:text-[#CBD5E1]">
            <a href="#services" className="hover:text-[#2E7D32] dark:hover:text-[#81C784] transition-colors">Platform Features</a>
            <a href="#ai-copilot" className="hover:text-[#2E7D32] dark:hover:text-[#81C784] transition-colors">AI Copilot</a>
            <a href="#stats" className="hover:text-[#2E7D32] dark:hover:text-[#81C784] transition-colors">Statistics</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#1F2937] dark:text-[#F8FAFC] hover:bg-[#F4F8F4] dark:hover:bg-[#1E293B] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/copilot"
              className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs flex items-center gap-1.5 transition-colors border-none"
            >
              Ask Copilot <Send className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5E9] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-xs font-bold text-[#2E7D32] dark:text-[#81C784]">
              <Sparkles className="w-4 h-4" />
              <span>Official University Digital Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1F2937] dark:text-[#F8FAFC] leading-tight">
              Smart Campus Navigation & Academic Intelligence
            </h1>

            <p className="text-sm sm:text-base text-[#6B7280] dark:text-[#CBD5E1] max-w-xl leading-relaxed">
              Step into a unified university platform designed for students, faculty, and administrators. Seamlessly navigate classrooms, manage academic schedules, and access AI-powered campus assistance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/freshers-guide"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors border-none"
              >
                Explore Freshers Guide <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/admin"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC] font-bold text-xs flex items-center justify-center gap-2 transition-colors hover:bg-[#F4F8F4]"
              >
                Admin Workspace <ShieldCheck className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
              </Link>
            </div>
          </div>

          <div>
            <img
              src={welcomeImg}
              alt="University Platform Welcome"
              className="w-full h-auto rounded-2xl border border-[#DDE5DD] dark:border-[#334155] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="services" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <p className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] uppercase tracking-wider">PLATFORM CAPABILITIES</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-[#F8FAFC]">University Services & Tools</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1F2937] dark:text-[#F8FAFC]">AI Copilot</h3>
            <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] leading-relaxed">
              Instant answers with structured route maps, timetable slots, and syllabus lookup.
            </p>
            <Link to="/copilot" className="inline-block text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] hover:underline">Launch Copilot →</Link>
          </div>

          <div className="p-6 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1F2937] dark:text-[#F8FAFC]">Campus Map</h3>
            <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] leading-relaxed">
              Interactive walking routes for classrooms, laboratories, and administrative offices.
            </p>
            <Link to="/map" className="inline-block text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] hover:underline">View Map →</Link>
          </div>

          <div className="p-6 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1F2937] dark:text-[#F8FAFC]">Academic Hub</h3>
            <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] leading-relaxed">
              Track attendance percentage, access course materials, and view class timetables.
            </p>
            <Link to="/academics" className="inline-block text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] hover:underline">View Academics →</Link>
          </div>

          <div className="p-6 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#4CAF50] flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1F2937] dark:text-[#F8FAFC]">Faculty Directory</h3>
            <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] leading-relaxed">
              Find professors by department, research field, or office location.
            </p>
            <Link to="/faculty" className="inline-block text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] hover:underline">Search Faculty →</Link>
          </div>
        </div>
      </section>

      {/* Multi-Stat Banner Ribbon */}
      <section id="stats" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-[#2E7D32] dark:bg-[#4CAF50] text-white grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-white" />
              <span className="text-2xl sm:text-3xl font-black text-white">18,500+</span>
            </div>
            <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">Enrolled Students</span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-white" />
              <span className="text-2xl sm:text-3xl font-black text-white">120+</span>
            </div>
            <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">Academic Modules</span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-white" />
              <span className="text-2xl sm:text-3xl font-black text-white">99.4%</span>
            </div>
            <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">System Reliability</span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-white" />
              <span className="text-2xl sm:text-3xl font-black text-white">150</span>
            </div>
            <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">Mapped Acres</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

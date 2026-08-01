import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, GraduationCap, ArrowRight, ShieldCheck, Users, Award, Send, User, Briefcase } from 'lucide-react';
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
          
          {/* Left Column: Hero Content & CTAs */}
          <div className="text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5E9] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-xs font-bold text-[#2E7D32] dark:text-[#81C784]">
              <Sparkles className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
              <span>Saranathan College of Engineering • Official Digital Hub</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1F2937] dark:text-[#F8FAFC] leading-tight">
              Smart Campus Navigation & <span className="text-[#2E7D32] dark:text-[#4CAF50]">Academic Intelligence</span>
            </h1>

            <p className="text-sm sm:text-base text-[#6B7280] dark:text-[#CBD5E1] max-w-xl leading-relaxed">
              Step into a unified university platform designed for students, faculty, and administrators. Seamlessly navigate classrooms, manage academic timetables, and access instant AI campus assistance.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                to="/login?portal=student"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md border-none cursor-pointer"
              >
                <User className="w-4 h-4" /> Student Portal
              </Link>
              <Link
                to="/login?portal=faculty"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1E293B] dark:bg-[#273449] hover:bg-[#334155] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md border-none cursor-pointer"
              >
                <Briefcase className="w-4 h-4" /> Faculty Portal
              </Link>
              <Link
                to="/login?portal=admin"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md border-none cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Portal
              </Link>
            </div>

            {/* Micro Feature Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-[#6B7280] dark:text-[#CBD5E1] font-semibold border-t border-[#E5E7EB] dark:border-[#334155]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" /> Verified Student Auth
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" /> SQLite RAG Database
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" /> Gemini & GLM Fallback
              </span>
            </div>
          </div>

          {/* Right Column: SaaS Product Interactive Showcase Card */}
          <div className="relative">
            {/* Glowing Accent Backdrop */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#2E7D32] to-[#81C784] opacity-20 blur-xl"></div>
            
            <div className="relative rounded-2xl bg-[#0F172A] border border-[#334155] shadow-2xl overflow-hidden p-5 space-y-4 text-white font-sans">
              
              {/* Product Window Header */}
              <div className="flex items-center justify-between border-b border-[#334155] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                  <span className="ml-2 text-xs font-mono text-slate-400">CampusPilot AI v2.4 • Saranathan Hub</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#1E293B] border border-[#334155] text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live RAG Online
                </span>
              </div>

              {/* Mock Chat Conversation */}
              <div className="space-y-3 text-xs leading-relaxed">
                
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="p-3 rounded-xl bg-[#2E7D32] text-white font-medium max-w-[85%] shadow-sm">
                    Where is the CSE HOD cabin and what is my next scheduled lecture?
                  </div>
                </div>

                {/* AI Copilot Response */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#4CAF50] flex items-center justify-center text-white shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="space-y-2 max-w-[90%]">
                    <div className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155] text-slate-200 font-medium">
                      <p className="font-bold text-emerald-400 mb-1">📍 CSE Department Block (AB-1)</p>
                      <p className="text-[11px] text-slate-300">
                        The CSE HOD cabin is located on <strong>Floor 2, Room 204</strong> (Main Block AB-1).
                      </p>
                    </div>

                    {/* Interactive Widget Card Preview */}
                    <div className="p-3 rounded-xl bg-[#162033] border border-emerald-500/30 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                        <span>🗓️ UPCOMING LECTURE</span>
                        <span>10:00 AM - 11:00 AM</span>
                      </div>
                      <div className="font-extrabold text-white text-xs">
                        Web Technologies (CS8691) • CSE-B
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                        <span>Venue: Lab 3, IT Block</span>
                        <span className="text-emerald-400 font-bold hover:underline cursor-pointer">Navigate on Map →</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Interactive Pills */}
              <div className="pt-2 border-t border-[#334155] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>18,500+ Active Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
                    Gemini 1.5 Flash
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[10px]">
                    SQLite Sync
                  </span>
                </div>
              </div>

            </div>
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

import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, GraduationCap, ArrowRight, ShieldCheck, Users, Calendar, Award, CheckCircle2, Send } from 'lucide-react';
import { Footer } from '../components/common/Footer';
import welcomeImg from '../assets/welcome-freshers.png';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080614] text-white selection:bg-pink-500 selection:text-white overflow-hidden font-sans relative">

      {/* Ambient background glows matching Mark Davis design */}
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/20 via-purple-600/20 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/4 w-[550px] h-[550px] bg-gradient-to-tr from-blue-600/20 via-purple-600/15 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0d0922]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              SCE FIESTA
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300">
            <a href="#services" className="hover:text-pink-400 transition-colors">Services & Features</a>
            <a href="#ai-copilot" className="hover:text-pink-400 transition-colors">AI Copilot</a>
            <a href="#stats" className="hover:text-pink-400 transition-colors">Stats</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/copilot"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white font-black text-xs shadow-lg shadow-pink-500/25 flex items-center gap-1.5 hover:opacity-90 transition-all border-none"
            >
              Let's Talk <Send className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-pink-500/30 text-xs font-extrabold text-pink-300 shadow-md">
              <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
              <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-blue-400 bg-clip-text text-transparent font-black">
                Welcome to the Future of Campus Life
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-3xl leading-none">
              Welcome Home, <br />
              <span className="bg-gradient-to-r from-pink-500 via-purple-400 to-blue-400 bg-clip-text text-transparent font-black">
                Freshers! 🎓
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 max-w-xl leading-relaxed font-medium">
              Step into your new journey with confidence. SCE FIESTA is your ultimate companion to navigate classrooms, find your favorite spots, and master your academic life from day one.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/freshers-guide"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white font-extrabold text-sm shadow-xl shadow-pink-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                Get Your Freshers Guide 🚀 <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/admin"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#140f35] hover:bg-[#1a1442] border border-white/10 text-slate-200 font-extrabold text-sm flex items-center justify-center gap-2 transition-all"
              >
                Admin Workspace <ShieldCheck className="w-4 h-4 text-purple-400" />
              </Link>
            </div>
          </div>

          <div className="relative group">
            {/* Floating Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />

            <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-[#140f33]/50 backdrop-blur-sm p-2 transition-transform duration-500 group-hover:scale-[1.02]">
              <img
                src={welcomeImg}
                alt="Welcome Freshers"
                className="w-full h-auto rounded-2xl shadow-inner object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section (Styled like "Services I Offer" from Demo Image) */}
      <section id="services" className="py-24 border-t border-white/10 bg-[#0d0922]/60 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-extrabold text-pink-400 uppercase tracking-widest">WHAT WE OFFER</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Services & Capabilities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#140f33] border border-white/10 hover:border-pink-500/50 transition-all text-center space-y-4 group">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Copilot</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Natural language answers with interactive route, timetable & syllabus cards.
            </p>
            <span className="inline-block text-xs font-bold text-purple-400 group-hover:text-pink-400 transition-colors cursor-pointer">Learn More →</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#140f33] border border-white/10 hover:border-purple-500/50 transition-all text-center space-y-4 group">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Interactive 3D Map</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Turn-by-turn walking navigation for classrooms, canteens & faculty cabins.
            </p>
            <span className="inline-block text-xs font-bold text-purple-400 group-hover:text-pink-400 transition-colors cursor-pointer">Learn More →</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#140f33] border border-white/10 hover:border-blue-500/50 transition-all text-center space-y-4 group">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Academic Vault</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Attendance trackers, solved past papers, and faculty office hour bookings.
            </p>
            <span className="inline-block text-xs font-bold text-purple-400 group-hover:text-pink-400 transition-colors cursor-pointer">Learn More →</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#1 la0f33] border border-white/10 hover:border-pink-500/50 transition-all text-center space-y-4 group">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Faculty Hub</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Search professors by department, research expertise, or office location.
            </p>
            <span className="inline-block text-xs font-bold text-purple-400 group-hover:text-pink-400 transition-colors cursor-pointer">Learn More →</span>
          </div>
        </div>
      </section>

      {/* Multi-Stat Banner Ribbon (Exact Pink -> Purple -> Blue Ribbon from Mark Davis Demo) */}
      <section id="stats" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white shadow-2xl grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-7 h-7 text-white" />
              <span className="text-3xl sm:text-4xl font-black text-white">18.5k+</span>
            </div>
            <span className="text-xs font-bold text-purple-100 uppercase tracking-wider">Active Students</span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-7 h-7 text-white" />
              <span className="text-3xl sm:text-4xl font-black text-white">120+</span>
            </div>
            <span className="text-xs font-bold text-purple-100 uppercase tracking-wider">Courses & Modules</span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-white" />
              <span className="text-3xl sm:text-4xl font-black text-white">99.4%</span>
            </div>
            <span className="text-xs font-bold text-purple-100 uppercase tracking-wider">AI Accuracy</span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-7 h-7 text-white" />
              <span className="text-3xl sm:text-4xl font-black text-white">150</span>
            </div>
            <span className="text-xs font-bold text-purple-100 uppercase tracking-wider">Digitized Acres</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Shield, Sparkles, Navigation, Calendar, Users, FileText, Briefcase, PhoneCall, GraduationCap } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onExploreAI: () => void;
}

export default function LandingPage({ onStart, onExploreAI }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[var(--color-background-500)] text-[var(--color-heading-500)] font-sans selection:bg-blue-100 selection:text-blue-800">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--color-surface-500)]/70 border-b border-[var(--color-border-500)]/80 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-400)] flex items-center justify-center text-white shadow-md shadow-[var(--color-primary-400)]/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-sans font-bold tracking-tight text-lg text-[var(--color-heading-500)]">CampusPilot <span className="text-[var(--color-primary-400)]">AI</span></span>
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Institutional Hub</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#statistics" className="hover:text-blue-600 transition-colors">Campus Metrics</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">Institutional Standards</a>
          </nav>

          <button 
            onClick={onStart}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95"
            id="landing-portal-button"
          >
            Portal Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              The Next-Gen Digital University Framework
            </div>

            <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Your Complete <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">AI Campus</span> Companion
            </h1>

            <p className="text-slate-600 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl">
              Centralizing scheduling, interactive campus maps, event registration, and resources in an elegant, Google Material 3 inspired digital platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={onStart}
                className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-base transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/25 flex items-center justify-center gap-2.5 hover:translate-y-[-1px] active:scale-95"
                id="hero-start-button"
              >
                Get Started
                <Shield className="w-5 h-5" />
              </button>
              <button
                onClick={onExploreAI}
                className="px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-base transition-all flex items-center justify-center gap-2.5 hover:translate-y-[-1px] active:scale-95"
                id="hero-ai-button"
              >
                Ask Assistant
                <Sparkles className="w-5 h-5 text-indigo-500" />
              </button>
            </div>

            {/* Microstats banner */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
              <div>
                <p className="text-3xl font-extrabold text-slate-900">10,000+</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Active Students</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900">350+</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">PhD Faculty</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900">50+</p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Academic Clubs</p>
              </div>
            </div>
          </div>

          {/* Visual Interactive illustration container */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-indigo-500/5 to-transparent rounded-full filter blur-2xl" />
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden relative z-10"
            >
              {/* Fake app shell mock */}
              <div className="bg-slate-900/5 px-6 py-4 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-[11px] font-mono text-slate-400">CampusPilot OS v1.4</span>
              </div>

              <div className="p-6 space-y-5">
                <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-blue-700">CAMPUS PILOT AI</span>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">Where is Block A administrative wing?</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Block A is positioned near the central gate entrance. It hosts the registrar, fee department, and dean desk.
                    </p>
                  </div>
                </div>

                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center shrink-0">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-indigo-700">SMART NAVIGATION</span>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">Nearest parking lot?</p>
                    <p className="text-xs text-slate-500 mt-1">Main Gate Parking A has 24 open slots currently.</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                      RI
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Dr. Ramesh Iyer</p>
                      <p className="text-[10px] text-slate-500">Office Consultation: 1 PM - 3 PM</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-green-50 text-green-700 font-semibold px-2 py-0.5 rounded-full border border-green-200">
                    Cabin 412
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              An Elite Ecosystem Built For Universities
            </h2>
            <p className="text-slate-500 text-base sm:text-lg">
              Replacing scattered links, static PDFs, and chaotic messaging loops with a unified, premium digital campus environment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/60 transition-all hover:shadow-lg hover:shadow-slate-200/50 group">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Gemini AI Campus Assistant</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                A highly advanced context-aware AI chatbot loaded with official directories, campus navigation blueprints, timetables, and rules.
              </p>
            </div>

            <div className="p-6 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/60 transition-all hover:shadow-lg hover:shadow-slate-200/50 group">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Navigation className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Campus Navigation</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Step-by-step directions to classrooms, labs, offices, and hostel wings with block information and estimated walking paths.
              </p>
            </div>

            <div className="p-6 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/60 transition-all hover:shadow-lg hover:shadow-slate-200/50 group">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Academics & Countdown</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Real-time tracking of subject attendance, internal evaluation marks, personal timetables, and exact countdown metrics for exam cells.
              </p>
            </div>

            <div className="p-6 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/60 transition-all hover:shadow-lg hover:shadow-slate-200/50 group">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Club & Events Center</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                A streamlined catalog of upcoming hackathons, tech workshops, creative photography walks, and direct membership registration.
              </p>
            </div>

            <div className="p-6 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/60 transition-all hover:shadow-lg hover:shadow-slate-200/50 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Curated Resource Center</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Centralized semester-wise notes, lab manuals, and syllabus files added officially by faculty for simple one-tap access.
              </p>
            </div>

            <div className="p-6 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/60 transition-all hover:shadow-lg hover:shadow-slate-200/50 group">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Career & Placement Hub</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Audited resume builders, active recruitment drives, application tracking, and custom interview prep pathways.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Call To Action Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold tracking-tight text-lg">CampusPilot AI</span>
            </div>
            <p className="text-sm max-w-sm">
              SaaS-level university ecosystem optimizing academic planning, digital safety, and automated campus knowledge operations.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Ecosystem Modules</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-white">AI Assistant Hub</a></li>
              <li><a href="#features" className="hover:text-white">Academic Performance</a></li>
              <li><a href="#features" className="hover:text-white">Campus Digital Maps</a></li>
              <li><a href="#features" className="hover:text-white">Placement Opportunities</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Security & Trust</h4>
            <p className="text-xs leading-relaxed">
              Fully compliant with academic standards, enterprise encryptions, and institutional RBAC clearances.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-8 mt-8 border-t border-slate-800 text-center text-xs">
          © 2026 CampusPilot AI Institutional Solutions. Crafted for Hackathon judges and university administrators.
        </div>
      </footer>
    </div>
  );
}

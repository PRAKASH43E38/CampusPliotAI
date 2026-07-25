import React, { useState } from 'react';
import { StatCard } from '../components/common/StatCard';
import { Users, ShieldCheck, Megaphone, FolderKanban, Calendar, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { announcements, facultyMembers } from '../data/mockData';

export const AdminDashboard: React.FC = () => {
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState('Academic');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setShowBroadcastModal(false);
      setBroadcastTitle('');
      setBroadcastContent('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Admin Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950 border border-emerald-800 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4" /> University Admin Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Academic & Campus Administration
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 font-medium max-w-xl">
            Monitor real-time campus analytics, issue official broadcasts, approve academic resources, and oversee faculty schedules.
          </p>
        </div>

        <button
          onClick={() => setShowBroadcastModal(true)}
          className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-2 transition-all hover:scale-105"
        >
          <Megaphone className="w-4 h-4" /> Create Emergency Broadcast
        </button>
      </div>

      {/* Admin Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Registered Students"
          value="18,520"
          change="+420 this semester"
          isPositive={true}
          icon={Users}
          color="emerald"
          subtitle="98.4% Profile Verification Rate"
        />
        <StatCard
          title="Daily AI Query Volume"
          value="42,800"
          change="+18.4%"
          isPositive={true}
          icon={Sparkles}
          color="emerald"
          subtitle="Avg response latency: 120ms"
        />
        <StatCard
          title="Active Fests & Hackathons"
          value="50 Events"
          icon={Calendar}
          color="emerald"
          subtitle="2,770 Total Ticket Registrations"
        />
        <StatCard
          title="Low Attendance Alerts"
          value="34 Students"
          change="-5 from last week"
          isPositive={true}
          icon={AlertTriangle}
          color="rose"
          subtitle="Below 75% university requirement"
        />
      </div>

      {/* Admin Section: Broadcasts & Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Active Campus Broadcasts Table */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-emerald-600" /> Active Campus Broadcasts
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">4 Published</span>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 4).map((ann) => (
              <div key={ann.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{ann.category}</span>
                    <span className="text-slate-400">• {ann.date}</span>
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{ann.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 font-medium">{ann.content}</p>
                </div>
                <button className="text-xs font-bold text-rose-500 hover:underline shrink-0">Unpin</button>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Upload Approvals Queue */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-emerald-600" /> Resource Approval Queue
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">2 Pending Review</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">Lab Manual</span>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-1">Operating Systems Kernel Solved Manual</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Uploaded by CSE Dept • 12.4 MB PDF</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">Approve</button>
                <button className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold">Reject</button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">PYQ</span>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white mt-1">Compiler Design 2025 Mid-Sem Papers</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Uploaded by CSE Dept • 4.2 MB PDF</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">Approve</button>
                <button className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold">Reject</button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Broadcast Creation Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-emerald-600" /> Publish Official Broadcast
              </h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {broadcastSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-extrabold text-base text-emerald-600 dark:text-emerald-400">Broadcast Published!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Pushed to 18,500+ student feeds and mobile alerts.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateBroadcast} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Broadcast Category</label>
                  <select
                    value={broadcastCategory}
                    onChange={(e) => setBroadcastCategory(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-medium"
                  >
                    <option>Academic</option>
                    <option>Exam</option>
                    <option>Placement</option>
                    <option>Emergency</option>
                    <option>General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. End-Sem Exam Schedule Released"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Content Details</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write announcement details..."
                    value={broadcastContent}
                    onChange={(e) => setBroadcastContent(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-all"
                >
                  Publish & Broadcast Instantly
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

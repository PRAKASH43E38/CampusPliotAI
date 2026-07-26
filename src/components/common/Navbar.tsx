import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Bell, Search, User, LogOut, SlidersHorizontal, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { announcements } from '../../data/mockData';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/copilot?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-white/10 bg-white/90 dark:bg-[#0d0922]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                SCE FIESTA
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-1 font-medium tracking-wide">
                Smart Digital Campus
              </span>
            </div>
          </Link>
        </div>

        {/* Middle: Search bar */}
        <div className="hidden md:flex flex-1 max-w-lg mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Ask AI or search campus map, events, faculty... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2 bg-slate-100 dark:bg-[#140f35] border border-slate-200 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
            />
            <button
              type="button"
              onClick={() => navigate('/copilot')}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white text-[11px] font-bold flex items-center gap-1 hover:opacity-90 border-none cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              Ask AI
            </button>
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          
          {/* Role badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 dark:bg-white/5 border border-purple-500/20 dark:border-white/10 text-xs font-extrabold text-slate-900 dark:text-white capitalize">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            {role} Mode
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#140f35] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#140f35] border border-slate-200 dark:border-white/15 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-white/10 pb-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-pink-500" />
                    Campus Alerts & Broadcasts
                  </h4>
                  <span className="text-[10px] bg-pink-500/10 text-pink-600 dark:text-pink-300 px-2 py-0.5 rounded-full font-bold">
                    3 New
                  </span>
                </div>
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {announcements.slice(0, 3).map((ann) => (
                    <div
                      key={ann.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a1442] border border-slate-100 dark:border-white/5"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-pink-600 dark:text-pink-400">
                          {ann.category}
                        </span>
                        <span className="text-[10px] text-slate-400">{ann.date}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {ann.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-300 line-clamp-2 mt-0.5">
                        {ann.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar / CTA */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-pink-500/50"
                />
                <span className="hidden lg:block text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#140f35] border border-slate-200 dark:border-white/15 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10 mb-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block text-[10px] mt-1 px-2 py-0.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold">
                      {user.department}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Student Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Settings
                  </Link>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/copilot')}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-all cursor-pointer border-none"
            >
              Let's Talk <Send className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

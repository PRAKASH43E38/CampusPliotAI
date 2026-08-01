import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Bell, Search, User, LogOut, SlidersHorizontal, Send, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { Announcement } from '../../types';
import { apiService } from '../../services/apiService';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [announcementList, setAnnouncementList] = useState<Announcement[]>([]);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const anns = await apiService.getAnnouncements();
        setAnnouncementList(anns);
      } catch (err) {
        console.error("Failed to load notifications in Navbar:", err);
      }
    }
    loadNotifications();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/copilot?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#DDE5DD] dark:border-[#334155] bg-white dark:bg-[#162033] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#2E7D32] dark:bg-[#4CAF50] flex items-center justify-center text-white font-bold">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-1.5">
                CampusPilot AI
              </span>
              <span className="text-[10px] text-[#6B7280] dark:text-[#CBD5E1] -mt-1 font-medium tracking-wide">
                University Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Middle: Search bar */}
        <div className="hidden md:flex flex-1 max-w-lg mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#CBD5E1]" />
            <input
              type="text"
              placeholder="Search campus map, courses, events, faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2 bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-xs sm:text-sm text-[#1F2937] dark:text-[#F8FAFC] placeholder-[#6B7280] focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#4CAF50] transition-all"
            />
            <button
              type="button"
              onClick={() => navigate('/copilot')}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white text-[11px] font-bold flex items-center gap-1 border-none cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              Ask AI
            </button>
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          
          {/* Static Role Indicator Badge (No role switching inside application) */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F5E9] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-xs font-bold text-[#2E7D32] dark:text-[#81C784]">
            <span className="w-2 h-2 rounded-full bg-[#2E7D32] dark:bg-[#4CAF50] shrink-0" />
            <span className="uppercase tracking-wider">{role} Portal</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-[#DDE5DD] dark:border-[#334155] bg-[#F4F8F4] dark:bg-[#1E293B] text-[#1F2937] dark:text-[#F8FAFC] hover:bg-[#E8F5E9] dark:hover:bg-[#273449] transition-all cursor-pointer"
            aria-label="Toggle Theme"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-[#1F2937]" />
            ) : (
              <Sun className="w-4 h-4 text-[#4CAF50]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markAllAsRead();
              }}
              className="relative p-2.5 rounded-xl border border-[#DDE5DD] dark:border-[#334155] bg-[#F4F8F4] dark:bg-[#1E293B] text-[#1F2937] dark:text-[#F8FAFC] hover:bg-[#E8F5E9] dark:hover:bg-[#273449] transition-all cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-[#1F2937] dark:text-[#F8FAFC]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#2E7D32] dark:bg-[#4CAF50]" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] rounded-2xl shadow-lg p-4 z-50">
                <div className="flex items-center justify-between mb-3 border-b border-[#E5E7EB] dark:border-[#475569] pb-2">
                  <h4 className="font-bold text-sm text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
                    University Broadcasts
                  </h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-[#E8F5E9] dark:bg-[#1E293B] text-[#2E7D32] dark:text-[#81C784] px-2 py-0.5 rounded-full font-bold">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] py-4 text-center">No alerts at the moment.</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3 rounded-xl bg-[#F4F8F4] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155]"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                            {notif.category}
                          </span>
                          <span className="text-[10px] text-[#6B7280] dark:text-[#CBD5E1]">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs font-bold text-[#1F2937] dark:text-[#F8FAFC] line-clamp-1">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-[#6B7280] dark:text-[#CBD5E1] line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar / CTA */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#F4F8F4] dark:hover:bg-[#1E293B] transition-all cursor-pointer border-none bg-transparent"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-[#DDE5DD] dark:border-[#334155]"
                />
                <span className="hidden lg:block text-xs font-bold text-[#1F2937] dark:text-[#F8FAFC] max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] rounded-2xl shadow-lg p-2 z-50">
                  <div className="px-3 py-2 border-b border-[#E5E7EB] dark:border-[#475569] mb-1">
                    <p className="text-xs font-bold text-[#1F2937] dark:text-[#F8FAFC]">{user.name}</p>
                    <p className="text-[10px] text-[#6B7280] dark:text-[#CBD5E1] truncate">{user.email}</p>
                    <span className="inline-block text-[10px] mt-1 px-2 py-0.5 rounded-full bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#81C784] font-bold">
                      {user.department}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#1F2937] dark:text-[#F8FAFC] hover:bg-[#F4F8F4] dark:hover:bg-[#273449] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
                    University Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[#1F2937] dark:text-[#F8FAFC] hover:bg-[#F4F8F4] dark:hover:bg-[#273449] transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
                    Settings
                  </Link>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors mt-1 border-none cursor-pointer"
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
              className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-none"
            >
              Ask Copilot <Send className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

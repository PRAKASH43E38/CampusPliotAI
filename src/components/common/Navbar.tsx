import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Bell, Search, User, LogOut, SlidersHorizontal, Send, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { apiService } from '../../services/apiService';

export const Navbar: React.FC<{ onToggleSidebar?: () => void; sidebarCollapsed?: boolean }> = ({ onToggleSidebar, sidebarCollapsed }) => {
  const { user, role, logout } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    void apiService.getAnnouncements().catch((err) => {
      console.error("Failed to load notifications in Navbar:", err);
    });
  }, []);

  useEffect(() => {
    setShowNotifications(false);
    setShowProfileMenu(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/copilot?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="app-topbar z-40 w-full">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="hidden lg:inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--cp-outline)] bg-[color:var(--cp-surface-strong)] text-[color:var(--cp-text)] hover:bg-[color:var(--cp-secondary-container)]"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </button>
          )}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-[color:var(--cp-primary)] flex items-center justify-center text-white font-bold shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base sm:text-lg tracking-tight text-[color:var(--cp-text-strong)] flex items-center gap-1.5">
                CampusPilot AI
              </span>
              <span className="text-[10px] text-[color:var(--cp-text-muted)] -mt-1 font-medium tracking-[0.18em] uppercase">
                University Platform
              </span>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--cp-text-muted)]" />
            <input
              type="text"
              placeholder="Search campus map, courses, events, faculty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="material-input pl-11 pr-28 bg-[color:var(--cp-surface-strong)]"
            />
            <button
              type="button"
              onClick={() => navigate('/copilot')}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 material-button text-[11px] min-h-0 h-9 px-3"
            >
              <Sparkles className="w-3 h-3" />
              Ask AI
            </button>
          </form>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full border border-[color:var(--cp-outline)] bg-[color:var(--cp-secondary-container)] text-xs font-medium text-[color:var(--cp-text-strong)]">
            <span className="w-2 h-2 rounded-full bg-[color:var(--cp-primary)] shrink-0" />
            <span className="uppercase tracking-[0.18em] text-[10px]">{role} Portal</span>
          </div>

          <button
            onClick={toggleTheme}
            className="material-chip p-0 justify-center h-10 w-10"
            aria-label="Toggle Theme"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-[color:var(--cp-text-strong)]" />
            ) : (
              <Sun className="w-4 h-4 text-[color:var(--cp-primary)]" />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                if (!showNotifications) markAllAsRead();
              }}
              className="relative material-chip p-0 justify-center h-10 w-10"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-[color:var(--cp-text-strong)]" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[color:var(--cp-primary)]" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 material-surface-elevated p-4 z-50">
                <div className="flex items-center justify-between mb-3 border-b border-[color:var(--cp-outline)] pb-2">
                  <h4 className="font-medium text-sm text-[color:var(--cp-text-strong)] flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[color:var(--cp-primary)]" />
                    University Broadcasts
                  </h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-[color:var(--cp-secondary-container)] text-[color:var(--cp-primary)] px-2 py-0.5 rounded-full font-medium">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-[color:var(--cp-text-muted)] py-4 text-center">No alerts at the moment.</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3 rounded-2xl bg-[color:var(--cp-surface-variant)] border border-[color:var(--cp-outline)]"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-medium text-[color:var(--cp-primary)]">
                            {notif.category}
                          </span>
                          <span className="text-[10px] text-[color:var(--cp-text-muted)]">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs font-medium text-[color:var(--cp-text-strong)] line-clamp-1">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-[color:var(--cp-text-muted)] line-clamp-2 mt-0.5">
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
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[color:var(--cp-surface-variant)] transition-all cursor-pointer border-none bg-transparent"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-[color:var(--cp-outline)]"
                />
                <span className="hidden lg:block text-xs font-medium text-[color:var(--cp-text-strong)] max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 material-surface-elevated p-2 z-50">
                  <div className="px-3 py-2 border-b border-[color:var(--cp-outline)] mb-1">
                    <p className="text-xs font-medium text-[color:var(--cp-text-strong)]">{user.name}</p>
                    <p className="text-[10px] text-[color:var(--cp-text-muted)] truncate">{user.email}</p>
                    <span className="inline-block text-[10px] mt-1 px-2 py-0.5 rounded-full bg-[color:var(--cp-secondary-container)] text-[color:var(--cp-primary)] font-medium">
                      {user.department}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[color:var(--cp-text-strong)] hover:bg-[color:var(--cp-surface-variant)] transition-colors"
                  >
                    <User className="w-4 h-4 text-[color:var(--cp-primary)]" />
                    University Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-[color:var(--cp-text-strong)] hover:bg-[color:var(--cp-surface-variant)] transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[color:var(--cp-primary)]" />
                    Settings
                  </Link>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors mt-1 border-none cursor-pointer"
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
              className="material-button px-4 py-2 text-xs"
            >
              Ask Copilot <Send className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

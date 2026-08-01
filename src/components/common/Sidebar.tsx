import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  MapPin,
  GraduationCap,
  Users,
  FolderKanban,
  Calendar,
  Settings,
  Send,
  BookOpen,
  Search,
  LucideIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarLink {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export const Sidebar: React.FC<{ collapsed?: boolean }> = ({ collapsed = false }) => {
  const { role } = useAuth();
  const [search, setSearch] = React.useState('');

  const studentLinks: SidebarLink[] = [
    { to: '/student', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/copilot', label: 'AI Copilot', icon: Sparkles, badge: 'Copilot' },
    { to: '/map', label: 'Campus Map', icon: MapPin },
    { to: '/academics', label: 'Academics', icon: GraduationCap },
    { to: '/faculty', label: 'Faculty Directory', icon: Users },
    { to: '/resources', label: 'Resource Hub', icon: FolderKanban },
    { to: '/events', label: 'Events & News', icon: Calendar },
  ];

  const facultyLinks: SidebarLink[] = [
    { to: '/faculty-dashboard', label: 'Faculty Dashboard', icon: LayoutDashboard },
    { to: '/copilot', label: 'Faculty AI Copilot', icon: Sparkles, badge: 'Teaching' },
    { to: '/academics', label: 'Teaching Schedule', icon: GraduationCap },
    { to: '/faculty', label: 'Faculty Directory', icon: Users },
    { to: '/resources', label: 'Resource Management', icon: FolderKanban },
    { to: '/library', label: 'Digital Library', icon: BookOpen },
    { to: '/events', label: 'Events & News', icon: Calendar },
  ];

  const adminLinks: SidebarLink[] = [
    { to: '/admin', label: 'Admin Overview', icon: LayoutDashboard },
    { to: '/copilot', label: 'Admin AI Copilot', icon: Sparkles },
    { to: '/map', label: 'Campus Map', icon: MapPin },
    { to: '/faculty', label: 'Faculty Directory', icon: Users },
    { to: '/resources', label: 'Manage Resources', icon: FolderKanban },
    { to: '/library', label: 'Digital Library', icon: BookOpen },
    { to: '/events', label: 'Manage Events', icon: Calendar },
  ];

  const links = role === 'admin' ? adminLinks : role === 'faculty' ? facultyLinks : studentLinks;

  const filteredLinks = links.filter((link) => {
    const value = `${link.label} ${link.badge || ''}`.toLowerCase();
    return value.includes(search.toLowerCase());
  });

  return (
    <aside
      className="app-shell__sidebar hidden lg:block transition-[width] duration-300 ease-out"
    >
      <div className="p-4 space-y-4">
        
        <div className={`material-surface p-3 ${collapsed ? 'space-y-3' : 'space-y-4'}`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[color:var(--cp-primary)] shrink-0" />
              {!collapsed && (
                <span className="text-xs font-medium text-[color:var(--cp-text-strong)] capitalize">
                  {role} Workspace
                </span>
              )}
            </div>
            {!collapsed && (
              <span className="text-[10px] text-[color:var(--cp-text-muted)] font-medium">v3.0</span>
            )}
          </div>

          {!collapsed && (
            <label className="flex items-center gap-2 rounded-full border border-[color:var(--cp-outline)] bg-[color:var(--cp-surface-variant)] px-3 py-2">
              <Search className="w-4 h-4 text-[color:var(--cp-text-muted)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search navigation"
                className="w-full bg-transparent text-sm placeholder:text-[color:var(--cp-text-muted)] focus:outline-none"
              />
            </label>
          )}
        </div>

        <nav className="space-y-1.5">
          {filteredLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                title={link.label}
                aria-label={link.label}
                className={({ isActive }) =>
                  `group flex items-center justify-between min-h-11 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[color:var(--cp-secondary-container)] text-[color:var(--cp-text-strong)] shadow-sm'
                      : 'text-[color:var(--cp-text-muted)] hover:text-[color:var(--cp-text-strong)] hover:bg-[color:var(--cp-surface-variant)]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[color:var(--cp-primary)]' : 'text-current'}`} />
                      {!collapsed && <span>{link.label}</span>}
                    </div>
                    {!collapsed && link.badge && (
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                        isActive
                          ? 'bg-white/70 text-[color:var(--cp-text-strong)]'
                          : 'bg-[color:var(--cp-surface-variant)] text-[color:var(--cp-primary)]'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="material-surface p-4 space-y-3">
            <p className="text-xs font-medium text-[color:var(--cp-text-strong)]">University Assistant</p>
            <p className="text-[11px] text-[color:var(--cp-text-muted)] leading-relaxed">
              Instant help with timetable, course materials, or map routes.
            </p>
            <NavLink
              to="/copilot"
              className="material-button w-full py-2 px-3 text-xs"
            >
              Ask Copilot <Send className="w-3 h-3" />
            </NavLink>
          </div>
        )}

        <div className="pt-4 border-t border-[color:var(--cp-outline)] space-y-1">
          <NavLink
            to="/settings"
            title="Settings"
            aria-label="Settings"
            className={({ isActive }) =>
              `flex items-center gap-3 min-h-11 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[color:var(--cp-secondary-container)] text-[color:var(--cp-text-strong)]'
                  : 'text-[color:var(--cp-text-muted)] hover:text-[color:var(--cp-text-strong)] hover:bg-[color:var(--cp-surface-variant)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Settings className={`w-4 h-4 ${isActive ? 'text-[color:var(--cp-primary)]' : 'text-current'}`} />
                {!collapsed && <span>Settings</span>}
              </>
            )}
          </NavLink>
        </div>

      </div>
    </aside>
  );
};

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
  Compass,
  Settings,
  Send,
  BookOpen,
  LucideIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarLink {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const { role } = useAuth();

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

  return (
    <aside className="w-64 shrink-0 hidden md:block border-r border-[#DDE5DD] dark:border-[#334155] bg-[#F7FAF7] dark:bg-[#172235] min-h-[calc(100vh-4rem)] p-4 transition-colors">
      <div className="space-y-6">
        
        {/* Role badge / Status */}
        <div className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32] dark:bg-[#4CAF50]" />
            <span className="text-xs font-bold text-[#1F2937] dark:text-[#F8FAFC] capitalize">
              {role} Workspace
            </span>
          </div>
          <span className="text-[10px] text-[#6B7280] dark:text-[#CBD5E1] font-semibold">v2.4</span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold'
                      : 'text-[#6B7280] dark:text-[#CBD5E1] hover:text-[#2E7D32] dark:hover:text-[#81C784] hover:bg-[#E8F5E9] dark:hover:bg-[#1E293B]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6B7280] dark:text-[#CBD5E1]'}`} />
                      <span className={isActive ? 'text-white' : ''}>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#81C784]'
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

        {/* Professional CTA Box */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] space-y-3">
          <p className="text-xs font-bold text-[#1F2937] dark:text-[#F8FAFC]">
            University Assistant
          </p>
          <p className="text-[11px] text-[#6B7280] dark:text-[#CBD5E1] leading-relaxed">
            Instant help with timetable, course materials, or map routes.
          </p>
          <NavLink
            to="/copilot"
            className="w-full py-2 px-3 rounded-lg bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border-none"
          >
            Ask Copilot <Send className="w-3 h-3" />
          </NavLink>
        </div>

        {/* System Settings & Help */}
        <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#475569] space-y-1">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold'
                  : 'text-[#6B7280] dark:text-[#CBD5E1] hover:text-[#2E7D32] dark:hover:text-[#81C784] hover:bg-[#E8F5E9] dark:hover:bg-[#1E293B]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Settings className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6B7280] dark:text-[#CBD5E1]'}`} />
                <span>Settings</span>
              </>
            )}
          </NavLink>
        </div>

      </div>
    </aside>
  );
};

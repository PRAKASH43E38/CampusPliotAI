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
    { to: '/copilot', label: 'AI Copilot', icon: Sparkles, badge: 'Hero AI' },
    { to: '/map', label: 'Campus Map', icon: MapPin },
    { to: '/academics', label: 'Academics', icon: GraduationCap },
    { to: '/faculty', label: 'Faculty Directory', icon: Users },
    { to: '/resources', label: 'Resource Hub', icon: FolderKanban },
    { to: '/events', label: 'Events & News', icon: Calendar },
    { to: '/freshers-guide', label: 'Freshers Guide', icon: Compass, badge: 'New' },
  ];

  const adminLinks: SidebarLink[] = [
    { to: '/admin', label: 'Admin Overview', icon: LayoutDashboard },
    { to: '/copilot', label: 'AI Copilot', icon: Sparkles },
    { to: '/map', label: 'Campus Map', icon: MapPin },
    { to: '/faculty', label: 'Faculty Directory', icon: Users },
    { to: '/resources', label: 'Resource Hub', icon: FolderKanban },
    { to: '/events', label: 'Manage Events', icon: Calendar },
    { to: '/freshers-guide', label: 'Freshers Onboarding', icon: Compass },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="w-64 shrink-0 hidden md:block border-r border-white/10 bg-[#0d0922] min-h-[calc(100vh-4rem)] p-4 transition-colors">
      <div className="space-y-6">
        
        {/* Role badge / Status */}
        <div className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white capitalize">
              {role} Mode
            </span>
          </div>
          <span className="text-[10px] text-pink-400 font-bold tracking-wide">Pro v2.4</span>
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
                  `flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 text-white border-l-4 border-pink-500 font-bold shadow-lg shadow-purple-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-purple-400" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black uppercase shadow-sm">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Featured Magenta-Purple CTA Box (Match Demo Image) */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-600/30 via-purple-600/20 to-blue-600/30 border border-pink-500/30 text-white space-y-3 shadow-xl">
          <p className="text-xs font-bold tracking-tight text-white leading-snug">
            Available for Campus AI Assistance
          </p>
          <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
            Get instant assistance with timetable, route maps, or assignments!
          </p>
          <NavLink
            to="/copilot"
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:opacity-90 transition-all border-none"
          >
            Ask AI Copilot <Send className="w-3 h-3" />
          </NavLink>
        </div>

        {/* System Settings & Help */}
        <div className="pt-4 border-t border-white/10 space-y-1">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-white/10 text-pink-400 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Settings className="w-4 h-4 text-purple-400" />
            <span>Settings</span>
          </NavLink>
        </div>

      </div>
    </aside>
  );
};

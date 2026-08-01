import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  MapPin,
  GraduationCap,
  Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const BottomNav: React.FC = () => {
  const { role } = useAuth();

  // Route mapping based on active user role
  const dashboardPath = role === 'admin' ? '/admin' : role === 'faculty' ? '/faculty-dashboard' : '/student';

  const navItems = [
    { to: dashboardPath, label: 'Home', icon: LayoutDashboard },
    { to: '/copilot', label: 'AI Copilot', icon: Sparkles },
    { to: '/map', label: 'Map', icon: MapPin },
    { to: '/academics', label: 'Academics', icon: GraduationCap },
    { to: '/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 block lg:hidden px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
      <div className="material-surface-glass mx-auto max-w-2xl border-t-0 rounded-t-[28px] shadow-lg">
        <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-all ${
                  isActive
                    ? 'text-[color:var(--cp-primary)] font-medium'
                    : 'text-[color:var(--cp-text-muted)]'
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`px-4 py-1 rounded-full transition-all flex items-center justify-center ${
                      isActive
                        ? 'bg-[color:var(--cp-primary-container)]'
                        : 'bg-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] tracking-tight">{item.label}</span>
                </div>
              )}
            </NavLink>
          );
        })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;

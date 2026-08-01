import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const UnauthorizedPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleReturnDashboard = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'faculty') {
      navigate('/faculty-dashboard');
    } else {
      navigate('/student');
    }
  };

  const handleSignOutAndSwitch = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl bg-white dark:bg-[#1E293B] border border-red-200 dark:border-red-900/50 p-8 shadow-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-extrabold text-[#1F2937] dark:text-[#F8FAFC]">403 - Access Denied</h1>
          <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] leading-relaxed">
            Direct URL access blocked by Role-Based Access Control (RBAC). Your logged in account role (<span className="font-bold uppercase text-[#2E7D32] dark:text-[#4CAF50]">{user?.role || 'Guest'}</span>) is not authorized to view this portal page.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-medium text-left space-y-1">
          <p className="font-bold">Portal Security Policy:</p>
          <p className="text-[11px] leading-relaxed">
            Role switching inside active sessions is strictly prohibited. To access another portal, please sign out completely and authenticate through the respective login portal.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            onClick={handleReturnDashboard}
            className="flex-1 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs flex items-center justify-center gap-1.5 border-none cursor-pointer"
          >
            <Home className="w-4 h-4" /> Return to My Dashboard
          </button>
          
          <button
            onClick={handleSignOutAndSwitch}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-[#1F2937] dark:text-[#F8FAFC] font-semibold text-xs flex items-center justify-center gap-1.5 border-none cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-500" /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

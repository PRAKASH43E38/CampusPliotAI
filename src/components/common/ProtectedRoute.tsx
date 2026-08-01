import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sparkles } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  allowedRoles?: ('student' | 'faculty' | 'admin')[];
}

export const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0F172A] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#2E7D32] dark:bg-[#4CAF50] flex items-center justify-center text-white animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <p className="text-xs font-bold text-[#6B7280] dark:text-[#CBD5E1]">Restoring Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role as any)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

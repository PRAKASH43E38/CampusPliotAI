import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Role } from '../types';
import { currentUser as mockStudent } from '../data/mockData';
import { apiService } from '../services/apiService';

const mockAdmin: UserProfile = {
  id: 'usr_admin',
  name: 'Dr. Sarah Jenkins',
  email: 'dean.academic@campuspilot.edu',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
  department: 'Office of Academic Affairs',
  bio: 'Dean of Student & Academic Affairs'
};

interface AuthContextType {
  user: UserProfile | null;
  role: Role;
  profileCompleted: boolean;
  loginAsStudent: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
  switchRole: (role: Role) => void;
  completeOnboarding: () => void;
  checkOnboardingStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(mockStudent);
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);

  const checkOnboardingStatus = async (): Promise<boolean> => {
    if (!user || user.role !== 'student') {
      setProfileCompleted(true);
      return true;
    }
    try {
      const res = await apiService.getStudentProfiles({ search: user.email });
      if (res && res.length > 0 && res[0].profile_completed) {
        setProfileCompleted(true);
        return true;
      } else {
        setProfileCompleted(false);
        return false;
      }
    } catch (err) {
      console.error("Error checking onboarding status:", err);
      setProfileCompleted(false);
      return false;
    }
  };

  useEffect(() => {
    checkOnboardingStatus();
  }, [user]);

  const loginAsStudent = () => {
    setUser(mockStudent);
  };

  const loginAsAdmin = () => {
    setUser(mockAdmin);
    setProfileCompleted(true);
  };

  const logout = () => {
    setUser(null);
    setProfileCompleted(false);
  };

  const switchRole = (newRole: Role) => {
    if (newRole === 'admin') {
      setUser(mockAdmin);
      setProfileCompleted(true);
    } else if (newRole === 'student') {
      setUser(mockStudent);
    } else {
      setUser(null);
      setProfileCompleted(false);
    }
  };

  const completeOnboarding = () => {
    setProfileCompleted(true);
    if (user) {
      setUser({ ...user, profileCompleted: true });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'guest',
        profileCompleted,
        loginAsStudent,
        loginAsAdmin,
        logout,
        switchRole,
        completeOnboarding,
        checkOnboardingStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Role } from '../types';
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
  loginAsStudent: (email?: string) => Promise<void>;
  loginAsAdmin: () => void;
  logout: () => void;
  switchRole: (role: Role) => void;
  completeOnboarding: () => void;
  checkOnboardingStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [profileCompleted, setProfileCompleted] = useState<boolean>(false);

  const loginAsStudent = async (email: string = 'astrabyte@gmail.com') => {
    try {
      const res = await apiService.getStudentProfiles({ search: email });
      if (res && res.length > 0) {
        const student = res[0];
        const studentProfile: UserProfile = {
          id: `usr_${student.student_id}`,
          name: student.full_name,
          email: student.college_email,
          role: 'student',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          department: student.department,
          year: student.year,
          section: student.section,
          rollNumber: student.register_number,
          cgpa: 8.92,
          attendancePct: 88.5,
          bio: student.reason_for_department || 'Engineering Student'
        };
        setUser(studentProfile);
        setProfileCompleted(!!student.profile_completed);
      } else {
        const studentProfile: UserProfile = {
          id: 'usr_new',
          name: email.split('@')[0],
          email: email,
          role: 'student',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          department: 'Computer Science & Engineering',
          year: '1st Year',
          section: 'A',
          rollNumber: 'PENDING',
          cgpa: 0,
          attendancePct: 0,
          bio: 'New Onboarding Student'
        };
        setUser(studentProfile);
        setProfileCompleted(false);
      }
    } catch (err) {
      console.error("Error logging in student:", err);
    }
  };

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
    // Perform initial default login for astrabyte@gmail.com so student starts logged in
    loginAsStudent('astrabyte@gmail.com');
  }, []);

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    }
  }, [user?.email, user?.role]);

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
      loginAsStudent('astrabyte@gmail.com');
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

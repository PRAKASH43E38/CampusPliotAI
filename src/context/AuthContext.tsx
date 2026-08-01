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
  loading: boolean;
  loginWithGoogle: (payload: { credential?: string; email?: string; name?: string; picture?: string; role?: Role }) => Promise<void>;
  loginAsStudent: (email?: string) => Promise<void>;
  loginAsFaculty: (email?: string) => Promise<void>;
  loginAsAdmin: () => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restore authenticated session on mount (refresh / back navigation)
  useEffect(() => {
    async function restoreSession() {
      try {
        const res = await apiService.getCurrentUser();
        if (res && res.authenticated && res.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  const loginWithGoogle = async (payload: {
    credential?: string;
    email?: string;
    name?: string;
    picture?: string;
    role?: Role;
  }) => {
    try {
      const selectedRole = payload.role || 'student';
      const res = await apiService.loginWithGoogle({
        credential: payload.credential,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        role: selectedRole === 'guest' ? 'student' : selectedRole
      });

      if (res && res.user) {
        setUser(res.user);
      } else {
        setUser({
          id: 'google-usr-' + Date.now(),
          email: payload.email || 'student@campuspilot.edu',
          name: payload.name || 'Campus Member',
          role: selectedRole === 'guest' ? 'student' : selectedRole,
          avatar: payload.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
          department: 'Computer Science & Engineering'
        });
      }
    } catch (err) {
      console.error("Google Auth error:", err);
      const selectedRole = payload.role || 'student';
      setUser({
        id: 'google-usr-fallback',
        email: payload.email || 'student@campuspilot.edu',
        name: 'Campus Member',
        role: selectedRole === 'guest' ? 'student' : selectedRole,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
        department: 'Computer Science & Engineering'
      });
    }
  };

  const loginAsStudent = async (email: string = 'astrabyte@gmail.com') => {
    setUser({
      id: 'usr-student-001',
      email: email,
      name: 'AstraByte Student',
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      section: 'Sec A'
    });
  };

  const loginAsFaculty = async (email: string = 'dr.sharma@campuspilot.edu') => {
    setUser({
      id: 'usr-faculty-101',
      email: email,
      name: 'Dr. Rajesh Sharma',
      role: 'faculty',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
      department: 'Computer Science & Engineering',
      designation: 'Professor & HOD'
    });
  };

  const loginAsAdmin = async () => {
    setUser({
      id: 'usr-admin-999',
      email: 'dean.academic@campuspilot.edu',
      name: 'Dr. Sarah Jenkins',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
      department: 'Office of Academic Affairs'
    });
  };

  const logout = async () => {
    try {
      await apiService.logoutUser();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setUser(null);
    }
  };

  const switchRole = (newRole: Role) => {
    if (newRole === 'admin') {
      loginAsAdmin();
    } else if (newRole === 'faculty') {
      loginAsFaculty();
    } else if (newRole === 'student') {
      loginAsStudent('astrabyte@gmail.com');
    } else {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'guest',
        loading,
        loginWithGoogle,
        loginAsStudent,
        loginAsFaculty,
        loginAsAdmin,
        logout,
        switchRole
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

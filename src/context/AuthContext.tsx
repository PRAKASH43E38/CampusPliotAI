import React, { createContext, useContext, useState } from 'react';
import { UserProfile, Role } from '../types';
import { currentUser as mockStudent } from '../data/mockData';

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
  loginAsStudent: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(mockStudent);

  const loginAsStudent = () => {
    setUser(mockStudent);
  };

  const loginAsAdmin = () => {
    setUser(mockAdmin);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: Role) => {
    if (newRole === 'admin') setUser(mockAdmin);
    else if (newRole === 'student') setUser(mockStudent);
    else setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'guest',
        loginAsStudent,
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

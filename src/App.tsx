import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { CopilotChat } from './components/copilot/CopilotChat';
import { CampusMapViewer } from './components/map/CampusMapViewer';
import { AcademicsPage } from './pages/AcademicsPage';
import { FacultyPage } from './pages/FacultyPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { EventsPage } from './pages/EventsPage';
import { FreshersGuidePage } from './pages/FreshersGuidePage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-transparent text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <div className="flex-1 flex max-w-full">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto pb-12">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* App Authenticated Layout Views */}
      <Route
        path="/student"
        element={
          <AppLayout>
            <StudentDashboard />
          </AppLayout>
        }
      />
      <Route
        path="/admin"
        element={
          <AppLayout>
            <AdminDashboard />
          </AppLayout>
        }
      />
      <Route
        path="/copilot"
        element={
          <AppLayout>
            <CopilotChat />
          </AppLayout>
        }
      />
      <Route
        path="/map"
        element={
          <AppLayout>
            <CampusMapViewer />
          </AppLayout>
        }
      />
      <Route
        path="/academics"
        element={
          <AppLayout>
            <AcademicsPage />
          </AppLayout>
        }
      />
      <Route
        path="/faculty"
        element={
          <AppLayout>
            <FacultyPage />
          </AppLayout>
        }
      />
      <Route
        path="/resources"
        element={
          <AppLayout>
            <ResourcesPage />
          </AppLayout>
        }
      />
      <Route
        path="/events"
        element={
          <AppLayout>
            <EventsPage />
          </AppLayout>
        }
      />
      <Route
        path="/freshers-guide"
        element={
          <AppLayout>
            <FreshersGuidePage />
          </AppLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <AppLayout>
            <ProfilePage />
          </AppLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <AppLayout>
            <SettingsPage />
          </AppLayout>
        }
      />

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { BottomNav } from './components/common/BottomNav';

import { ProtectedRoute } from './components/common/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { FacultyDashboardPage } from './pages/FacultyDashboardPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CopilotChat } from './components/copilot/CopilotChat';
import { CampusMapViewer } from './components/map/CampusMapViewer';
import { AcademicsPage } from './pages/AcademicsPage';
import { FacultyPage } from './pages/FacultyPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { LibraryPage } from './pages/LibraryPage';
import { EventsPage } from './pages/EventsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem('cp_sidebarCollapsed') === 'true');
  const location = useLocation();
  const mainRef = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    localStorage.setItem('cp_sidebarCollapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div className="app-shell" style={{ ['--sidebar-width' as any]: sidebarCollapsed ? '88px' : '296px' }}>
      <Navbar onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)} sidebarCollapsed={sidebarCollapsed} />
      <div className="app-shell__viewport">
        <Sidebar collapsed={sidebarCollapsed} />
        <main ref={mainRef} className="app-shell__content">
          <div className="min-h-full px-4 py-4 sm:px-6 lg:px-8 xl:px-10">
            {children}
          </div>
          <div className="hidden md:block app-shell__footer">
            <Footer />
          </div>
        </main>
      </div>
      <BottomNav />
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
          <ProtectedRoute allowedRoles={['student']}>
            <AppLayout>
              <StudentDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty-dashboard"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <AppLayout>
              <FacultyDashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/copilot"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CopilotChat />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute allowedRoles={['student', 'admin']}>
            <AppLayout>
              <CampusMapViewer />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/academics"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AcademicsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty"
        element={
          <ProtectedRoute>
            <AppLayout>
              <FacultyPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ResourcesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <AppLayout>
              <LibraryPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EventsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/unauthorized"
        element={
          <AppLayout>
            <UnauthorizedPage />
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

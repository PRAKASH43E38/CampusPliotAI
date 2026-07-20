/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  FileText, 
  Briefcase, 
  PhoneCall, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Bell, 
  CheckCircle,
  Clock,
  LayoutDashboard,
  Home,
  AlertTriangle,
  Moon,
  Sun,
  MoreVertical,
  Database
} from 'lucide-react';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardView from './pages/DashboardView';
import AIAssistantView from './pages/AIAssistantView';
import AcademicsView from './pages/AcademicsView';
import EventsView from './pages/EventsView';
import CampusMapView from './pages/CampusMapView';
import ResourceCenterView from './pages/ResourceCenterView';
import HostelView from './pages/HostelView';
import ProfileView from './pages/ProfileView';
import SettingsView from './pages/SettingsView';
import AdminView from './pages/AdminView';


import { mockStudent, syncWithBackend } from './data/mockData';

type AppState = 'LANDING' | 'LOGIN' | 'APP';
type TabView = 
  | 'dashboard' 
  | 'ai' 
  | 'academics' 
  | 'faculty' 
  | 'events' 
  | 'clubs' 
  | 'map' 
  | 'resources' 
  | 'hostel' 
  | 'profile' 
  | 'settings'
  | 'admin-panel';

export default function App() {
  const [state, setState] = useState<AppState>('LANDING');
  // Theme state removed – using fixed blue palette per design requirements
  const isDark = false;
  const toggleTheme = () => {};
  const [userRole, setUserRole] = useState<'STUDENT' | 'ADMIN'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userRole');
      return (saved === 'ADMIN' ? 'ADMIN' : 'STUDENT');
    }
    return 'STUDENT';
  });
  const [studentId, setStudentId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('studentId') || '';
    }
    return '';
  });
  const [activeTab, setActiveTab] = useState<TabView>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const [notifications, setNotifications] = useState<any[]>([]);

  const [dataLoaded, setDataLoaded] = useState(false);

  const loadNotifications = (sId: string = studentId) => {
    if (userRole !== 'STUDENT' || !sId) return;
    fetch('/api/notifications', {
      headers: { 'X-Student-Id': sId }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      })
      .catch(err => console.error("Failed to load notifications:", err));
  };

  useEffect(() => {
    const savedLoggedIn = localStorage.getItem('isLoggedIn');
    const savedRole = localStorage.getItem('userRole') as 'STUDENT' | 'ADMIN' | null;
    const savedStudentId = localStorage.getItem('studentId');
    if (savedLoggedIn === 'true' && savedRole) {
      setUserRole(savedRole);
      if (savedRole === 'STUDENT' && savedStudentId) {
        setStudentId(savedStudentId);
      }
      setState('APP');
      if (savedRole === 'ADMIN') {
        setActiveTab('admin-panel');
      } else {
        setActiveTab('dashboard');
      }
    }
  }, []);

  useEffect(() => {
    if (state === 'APP') {
      setDataLoaded(false);
      const sId = studentId || localStorage.getItem('studentId') || 'st-0982';
      syncWithBackend(sId).then(() => {
        setDataLoaded(true);
        if (userRole === 'STUDENT') {
          loadNotifications(sId);
        }
      });
    }
  }, [state, studentId, userRole]);

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const handleStartPortal = () => {
    setState('LOGIN');
  };

  const handleExploreAI = () => {
    setState('LOGIN');
  };

  const handleLoginSuccess = (role: 'STUDENT' | 'ADMIN', sId?: string) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
    localStorage.setItem('isLoggedIn', 'true');
    if (role === 'STUDENT' && sId) {
      setStudentId(sId);
      localStorage.setItem('studentId', sId);
    }
    setState('APP');
    if (role === 'ADMIN') {
      setActiveTab('admin-panel');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setState('LANDING');
    setUserRole('STUDENT');
    setStudentId('');
    localStorage.removeItem('userRole');
    localStorage.removeItem('studentId');
    localStorage.removeItem('isLoggedIn');
    setProfileDropdownOpen(false);
  };

  const handleClearAllNotifications = () => {
    fetch('/api/notifications/read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Student-Id': studentId
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          loadNotifications();
        }
      })
      .catch(err => console.error("Failed to clear notifications:", err));
  };

  const handleMarkAsRead = (notifId: string) => {
    fetch('/api/notifications/read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Student-Id': studentId
      },
      body: JSON.stringify({ notificationId: notifId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          loadNotifications();
        }
      })
      .catch(err => console.error("Failed to mark notification read:", err));
  };

  // Smart global search navigation helper
  const handleSearchSelection = (tab: TabView) => {
    setActiveTab(tab);
    setSearchQuery('');
  };

  // Perform basic fuzzy searches on campus sectors
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results = [];

    if ('library'.includes(q) || 'central'.includes(q)) {
      results.push({ label: 'Central Library (Campus Map)', tab: 'map' as TabView });
    }
    if ('block'.includes(q) || 'administrative'.includes(q) || 'room'.includes(q)) {
      results.push({ label: 'Block A Administrative Wing', tab: 'map' as TabView });
    }
    if ('timetable'.includes(q) || 'class'.includes(q) || 'attendance'.includes(q) || 'marks'.includes(q)) {
      results.push({ label: 'My Academic Timetable & Marks', tab: 'academics' as TabView });
    }
    if ('ramesh'.includes(q) || 'clara'.includes(q) || 'faculty'.includes(q) || 'cabin'.includes(q)) {
      results.push({ label: 'Faculty Consultant Directory', tab: 'faculty' as TabView });
    }
    if ('hackathon'.includes(q) || 'codered'.includes(q) || 'event'.includes(q)) {
      results.push({ label: 'CodeRed National Hackathon (Events)', tab: 'events' as TabView });
    }
    if ('club'.includes(q) || 'robotics'.includes(q) || 'photography'.includes(q)) {
      results.push({ label: 'University Recommended Clubs', tab: 'clubs' as TabView });
    }
    if ('notes'.includes(q) || 'pdf'.includes(q) || 'download'.includes(q) || 'manual'.includes(q)) {
      results.push({ label: 'Syllabus & Lecture Downloads', tab: 'resources' as TabView });
    }
    if ('mess'.includes(q) || 'menu'.includes(q) || 'dinner'.includes(q) || 'hostel'.includes(q)) {
      results.push({ label: 'Hostel Mess Menu & Curfew Rules', tab: 'hostel' as TabView });
    }

    return results;
  };

  const searchResults = getSearchResults();

  // Sidebar list configurations based on user role
  const sidebarItems = userRole === 'ADMIN'
    ? [
        { id: 'admin-panel', label: 'Admin panel', icon: <Database className="w-4 h-4" />, section: 'portal' },
        { id: 'resources', label: 'Resource Center', icon: <FileText className="w-4 h-4" />, section: 'portal' },
        { id: 'ai', label: 'AI Assistant', icon: <Sparkles className="w-4 h-4 text-indigo-500" />, section: 'portal' },
        { id: 'map', label: 'Campus Map', icon: <Compass className="w-4 h-4" />, section: 'portal' },
        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, section: 'safety' }
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4" />, section: 'portal' },
        { id: 'ai', label: 'AI Assistant', icon: <Sparkles className="w-4 h-4 text-indigo-500" />, section: 'portal' },
        { id: 'academics', label: 'Academics', icon: <BookOpen className="w-4 h-4" />, section: 'portal' },
        { id: 'map', label: 'Campus Map', icon: <Compass className="w-4 h-4" />, section: 'portal' },
        { id: 'resources', label: 'Resource Center', icon: <FileText className="w-4 h-4" />, section: 'portal' },
        
        { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" />, section: 'life' },
        { id: 'hostel', label: 'Hostel & Mess', icon: <Home className="w-4 h-4" />, section: 'life' },

        { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" />, section: 'safety' },
        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, section: 'safety' }
      ];

  return (
    <div className="min-h-screen bg-[var(--color-background-500)] text-[var(--color-heading-500)] selection:bg-blue-100 selection:text-blue-800">
      <AnimatePresence mode="wait">
        {/* Landing View State */}
        {state === 'LANDING' && (
          <LandingPage onStart={handleStartPortal} onExploreAI={handleExploreAI} />
        )}

        {/* Login View State */}
        {state === 'LOGIN' && (
          <LoginPage onLoginSuccess={handleLoginSuccess} onBack={() => setState('LANDING')} />
        )}

        {/* Core Full-Stack Application State */}
        {state === 'APP' && (
          !dataLoaded ? (
            <div className={`h-screen w-screen flex flex-col items-center justify-center font-sans ${isDark ? 'bg-[#090a0c] text-white' : 'bg-slate-50 text-slate-900'}`}>
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-xs font-bold font-mono uppercase tracking-widest text-slate-500 animate-pulse">Syncing Portal with University Database...</p>
            </div>
          ) : (
            <div className="flex h-screen overflow-hidden">
            
            {/* Desktop Adaptive Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 border-r border-[#0A4174]/20 bg-[#0A4174] text-[#BDD8E9] shrink-0">
              <div className="p-5 border-b border-white/10">
                {/* Brand Capsule Matching User Screenshot */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 transition-all shadow-sm">
                  {/* 4-Quadrant Custom Circle Logo */}
                  <div className="relative w-6 h-6 rounded-full overflow-hidden flex flex-wrap shrink-0 shadow-sm border border-white/10">
                    <div className="w-3 h-3 bg-[#10b981]" />
                    <div className="w-3 h-3 bg-[#BDD8E9]" />
                    <div className="w-3 h-3 bg-[#06b6d4]" />
                    <div className="w-3 h-3 bg-[#6366f1]" />
                  </div>
                  
                  {/* Brand Text */}
                  <span className="font-sans font-extrabold text-[12px] tracking-tight leading-none text-white flex-1">
                    CampusPilot<span className="text-[#7BBDE8]">AI</span>
                  </span>
                  
                  {/* 3-Dots Action Button */}
                  <MoreVertical className="w-4 h-4 text-white/55 shrink-0 cursor-pointer hover:text-white" />
                </div>
              </div>

              {/* Sidebar list scrolling container */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                {/* Core Portal categories */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono font-bold text-[#7BBDE8] uppercase tracking-widest px-3">Academic Core</span>
                  {sidebarItems.filter(item => item.section === 'portal').map(item => {
                    const isSelected = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as TabView)}
                        className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all border border-transparent cursor-pointer ${
                          isSelected
                            ? 'bg-white text-[#001D39] shadow-sm font-extrabold'
                            : 'text-[#7BBDE8] hover:text-white hover:bg-[#4E8EA2]/30'
                        }`}
                        id={`sidebar-item-${item.id}`}
                      >
                        <span className={isSelected ? 'text-[#001D39]' : 'text-[#7BBDE8]'}>
                          {item.icon}
                        </span>
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                {/* Campus Engagement categories */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono font-bold text-[#7BBDE8] uppercase tracking-widest px-3">Campus Life</span>
                  {sidebarItems.filter(item => item.section === 'life').map(item => {
                    const isSelected = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as TabView)}
                        className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all border border-transparent cursor-pointer ${
                          isSelected
                            ? 'bg-white text-[#001D39] shadow-sm font-extrabold'
                            : 'text-[#7BBDE8] hover:text-white hover:bg-[#4E8EA2]/30'
                        }`}
                        id={`sidebar-item-${item.id}`}
                      >
                        <span className={isSelected ? 'text-[#001D39]' : 'text-[#7BBDE8]'}>
                          {item.icon}
                        </span>
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                {/* Safety and Config categories */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono font-bold text-[#7BBDE8] uppercase tracking-widest px-3">Safety & Settings</span>
                  {sidebarItems.filter(item => item.section === 'safety').map(item => {
                    const isSelected = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as TabView)}
                        className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all border border-transparent cursor-pointer ${
                          isSelected
                            ? 'bg-white text-[#001D39] shadow-sm font-extrabold'
                            : 'text-[#7BBDE8] hover:text-white hover:bg-[#4E8EA2]/30'
                        }`}
                        id={`sidebar-item-${item.id}`}
                      >
                        <span className={isSelected ? 'text-[#001D39]' : 'text-[#7BBDE8]'}>
                          {item.icon}
                        </span>
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom logout area */}
              <div className={`p-4 border-t transition-colors duration-300 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-950/20' : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                  }`}
                  id="sidebar-logout"
                >
                  <LogOut className="w-4 h-4" />
                  Logout Session
                </button>
              </div>
            </aside>

            {/* Mobile Sidebar overlay */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                  />
                  <motion.aside
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'tween', duration: 0.3 }}
                    className="fixed top-0 bottom-0 left-0 w-64 z-50 shadow-2xl flex flex-col lg:hidden border-r border-[#0A4174]/20 bg-[#0A4174]"
                  >
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                      {/* Mobile Brand Capsule */}
                      <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-white/5 transition-all shadow-sm">
                        {/* 4-Quadrant Custom Circle Logo */}
                        <div className="relative w-5 h-5 rounded-full overflow-hidden flex flex-wrap shrink-0 shadow-sm border border-white/10">
                          <div className="w-2.5 h-2.5 bg-[#10b981]" />
                          <div className="w-2.5 h-2.5 bg-[#BDD8E9]" />
                          <div className="w-2.5 h-2.5 bg-[#06b6d4]" />
                          <div className="w-2.5 h-2.5 bg-[#6366f1]" />
                        </div>
                        
                        <span className="font-sans font-bold text-[11px] tracking-tight leading-none text-white truncate flex-1">
                          CampusPilot<span className="text-[#7BBDE8]">AI</span>
                        </span>
                      </div>
                      <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-white/10 rounded-lg cursor-pointer">
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                      <div className="space-y-2">
                        {sidebarItems.map(item => {
                          const isSelected = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveTab(item.id as TabView);
                                setMobileMenuOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all border border-transparent cursor-pointer ${
                                isSelected
                                  ? 'bg-white text-[#001D39] shadow-sm font-extrabold'
                                  : 'text-[#7BBDE8] hover:text-white hover:bg-[#4E8EA2]/30'
                              }`}
                            >
                              <span className={isSelected ? 'text-[#001D39]' : 'text-[#7BBDE8]'}>
                                {item.icon}
                              </span>
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-4 border-t border-white/10">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all text-[#7BBDE8] hover:text-[#ffffff] hover:bg-white/10 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout Session
                      </button>
                    </div>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>

            {/* Main view container shell */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="h-18 px-6 flex items-center justify-between shrink-0 relative z-30 bg-white border-b border-[#A7C7DD]/60 shadow-sm text-slate-800">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setMobileMenuOpen(true)}
                    className="lg:hidden p-2 text-[#0A4174] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <Menu className="w-5 h-5" />
                  </button>

                  {/* Smart Global Search */}
                  <div className="relative hidden sm:block w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Search className="w-4 h-4 text-[#0A4174]" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Fuzzy Global Search..."
                      className="w-full pl-9 pr-4 py-2 border border-[#A7C7DD] rounded-full text-xs transition-all outline-none font-medium bg-white text-slate-800 placeholder-slate-400 focus:border-[#0A4174] focus:ring-2 focus:ring-[#0A4174]/10"
                    />

                    {/* Search results dropdown dropdown list */}
                    {searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 border border-[#A7C7DD] rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto divide-y bg-white divide-slate-100">
                        {searchResults.map((res, i) => (
                          <div
                            key={i}
                            onClick={() => handleSearchSelection(res.tab)}
                            className="p-3 cursor-pointer text-xs font-bold flex items-center gap-2 transition-colors hover:bg-slate-50 text-slate-700"
                          >
                            <Search className="w-3.5 h-3.5 text-slate-400" />
                            {res.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Notification Bell Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setNotifDropdownOpen(!notifDropdownOpen);
                        setProfileDropdownOpen(false);
                      }}
                      className={`p-2.5 border rounded-xl transition-colors relative cursor-pointer ${
                        isDark 
                          ? 'bg-slate-900 border-slate-700/60 text-slate-300 hover:bg-slate-800' 
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                      }`}
                      id="topbar-bell-notifications"
                    >
                      <Bell className="w-4 h-4" />
                      {unreadNotifications > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border border-white">
                          {unreadNotifications}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {notifDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setNotifDropdownOpen(false)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className={`absolute right-0 mt-2 w-80 border rounded-2xl shadow-xl z-40 p-4 space-y-4 ${
                              isDark ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-slate-950/50' : 'bg-white border-slate-200 text-slate-900'
                            }`}
                          >
                            <div className={`flex justify-between items-center border-b pb-2 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                              <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Academic Notices</span>
                              <button 
                                onClick={() => {
                                  handleClearAllNotifications();
                                  setNotifDropdownOpen(false);
                                }}
                                className="text-[10px] text-blue-500 font-bold hover:underline"
                              >
                                Clear all
                              </button>
                            </div>

                            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                              {notifications.length > 0 ? (
                                notifications.map(notif => (
                                  <div 
                                    key={notif.id} 
                                    className={`text-xs space-y-1 p-2 rounded-xl transition-all cursor-pointer ${
                                      notif.isRead 
                                        ? 'opacity-50' 
                                        : (isDark ? 'bg-slate-850 hover:bg-slate-800' : 'bg-blue-50/50 hover:bg-blue-50')
                                    }`}
                                    onClick={() => {
                                      handleMarkAsRead(notif.id);
                                    }}
                                  >
                                    <p className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{notif.title}</p>
                                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{notif.message}</p>
                                    <span className="text-[9px] text-slate-550 block font-mono">
                                      {new Date(notif.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-slate-500 text-center py-4">No unread notices pending</p>
                              )}
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => {
                        setProfileDropdownOpen(!profileDropdownOpen);
                        setNotifDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 px-2.5 py-1.5 border border-[#A7C7DD] rounded-xl bg-white hover:bg-slate-50 text-[#001D39] transition-all cursor-pointer shadow-sm"
                      id="topbar-user-profile-button"
                    >
                      {mockStudent.avatar ? (
                        <img 
                          src={mockStudent.avatar} 
                          alt={mockStudent.name} 
                          className="w-6 h-6 rounded-lg object-cover border border-[#A7C7DD]/40"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-lg bg-[#0A4174] text-white font-bold text-xs flex items-center justify-center border border-[#A7C7DD]/40">
                          {mockStudent.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST'}
                        </div>
                      )}
                      <span className="text-xs font-bold hidden md:block text-[#001D39]">{mockStudent.name}</span>
                    </button>

                    <AnimatePresence>
                      {profileDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setProfileDropdownOpen(false)} />
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className={`absolute right-0 mt-2 w-56 border rounded-2xl shadow-xl z-40 overflow-hidden ${
                              isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900'
                            }`}
                          >
                            <div className={`p-4 border-b ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50'}`}>
                              <span className="text-xs font-bold block truncate">{mockStudent.name}</span>
                              <span className="text-[10px] text-slate-500 block truncate mt-0.5">{mockStudent.email}</span>
                            </div>
                            <div className="p-2 space-y-1">
                              <button
                                onClick={() => {
                                  setActiveTab('profile');
                                  setProfileDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 ${
                                  isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <User className="w-3.5 h-3.5 text-blue-500" />
                                My Profile Page
                              </button>
                              <button
                                onClick={() => {
                                  setActiveTab('settings');
                                  setProfileDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 ${
                                  isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <Settings className="w-3.5 h-3.5 text-indigo-500" />
                                System Settings
                              </button>
                            </div>
                            <div className={`p-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                              <button
                                onClick={handleLogout}
                                className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 ${
                                  isDark ? 'text-rose-400 hover:bg-rose-950/25' : 'text-rose-600 hover:bg-rose-50'
                                }`}
                              >
                                <LogOut className="w-3.5 h-3.5" />
                                Logout Session
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </header>

              {/* Main Scrolling Workspace views */}
              <main className={`flex-1 overflow-y-auto px-6 py-8 transition-colors duration-300 ${
                isDark ? 'bg-[#090a0c]' : 'bg-slate-50/30'
              }`}>
                <div className="max-w-7xl mx-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === 'dashboard' && (
                        <DashboardView 
                          onNavigateTo={(view) => setActiveTab(view as TabView)} 
                          isDark={isDark}
                        />
                      )}
                      {activeTab === 'ai' && <AIAssistantView isDark={isDark} />}
                      {activeTab === 'academics' && <AcademicsView isDark={isDark} />}
                      {activeTab === 'events' && <EventsView isDark={isDark} />}
                      {activeTab === 'map' && <CampusMapView isDark={isDark} />}
                      {activeTab === 'resources' && <ResourceCenterView isDark={isDark} userRole={userRole} />}
                      {activeTab === 'hostel' && <HostelView isDark={isDark} />}
                      {activeTab === 'profile' && <ProfileView isDark={isDark} />}
                      {activeTab === 'admin-panel' && <AdminView isDark={isDark} />}
                      {activeTab === 'settings' && (
                        <SettingsView 
                          isDark={isDark} 
                          onToggleTheme={toggleTheme} 
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </main>
            </div>
          </div>
        )
      )}
    </AnimatePresence>

    </div>
  );
}

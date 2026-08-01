import React, { useState, useEffect } from 'react';
import {
  User,
  GraduationCap,
  Bell,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  Lock,
  SlidersHorizontal,
  Save
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, role } = useAuth();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'profile' | 'academic' | 'notifications' | 'display' | 'ai'>('profile');
  const [saved, setSaved] = useState(false);

  // Form State (loaded from localStorage or defaults)
  const [branch, setBranch] = useState(() => localStorage.getItem('cp_branch') || 'Computer Science & Engineering');
  const [semester, setSemester] = useState(() => localStorage.getItem('cp_semester') || 'Semester 5');
  const [gradYear, setGradYear] = useState(() => localStorage.getItem('cp_gradYear') || '2027');
  
  // Academic toggles
  const [showTimetable, setShowTimetable] = useState(() => JSON.parse(localStorage.getItem('cp_showTimetable') ?? 'true'));
  const [showEvents, setShowEvents] = useState(() => JSON.parse(localStorage.getItem('cp_showEvents') ?? 'true'));
  const [showLibrary, setShowLibrary] = useState(() => JSON.parse(localStorage.getItem('cp_showLibrary') ?? 'false'));

  // Notification toggles
  const [pushExams, setPushExams] = useState(() => JSON.parse(localStorage.getItem('cp_pushExams') ?? 'true'));
  const [pushAssignments, setPushAssignments] = useState(() => JSON.parse(localStorage.getItem('cp_pushAssignments') ?? 'true'));
  const [emailDigest, setEmailDigest] = useState(() => JSON.parse(localStorage.getItem('cp_emailDigest') ?? 'false'));
  const [smsUrgent, setSmsUrgent] = useState(() => JSON.parse(localStorage.getItem('cp_smsUrgent') ?? 'true'));

  // Display toggles
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('cp_fontSize') || 'standard');

  // AI assistant toggles
  const [aiMode, setAiMode] = useState(() => localStorage.getItem('cp_aiMode') || 'structured');
  const [aiLanguage, setAiLanguage] = useState(() => localStorage.getItem('cp_aiLanguage') || 'english');
  const [aiModel, setAiModel] = useState(() => localStorage.getItem('cp_aiModel') || 'gemini');
  const [historyEnabled, setHistoryEnabled] = useState(() => JSON.parse(localStorage.getItem('cp_historyEnabled') ?? 'true'));
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(() => JSON.parse(localStorage.getItem('cp_suggestionsEnabled') ?? 'true'));

  // Font size effect
  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'small') {
      root.style.fontSize = '14px';
    } else if (fontSize === 'large') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [fontSize]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem('cp_branch', branch);
    localStorage.setItem('cp_semester', semester);
    localStorage.setItem('cp_gradYear', gradYear);
    localStorage.setItem('cp_showTimetable', JSON.stringify(showTimetable));
    localStorage.setItem('cp_showEvents', JSON.stringify(showEvents));
    localStorage.setItem('cp_showLibrary', JSON.stringify(showLibrary));
    
    localStorage.setItem('cp_pushExams', JSON.stringify(pushExams));
    localStorage.setItem('cp_pushAssignments', JSON.stringify(pushAssignments));
    localStorage.setItem('cp_emailDigest', JSON.stringify(emailDigest));
    localStorage.setItem('cp_smsUrgent', JSON.stringify(smsUrgent));
    
    localStorage.setItem('cp_fontSize', fontSize);
    
    localStorage.setItem('cp_aiMode', aiMode);
    localStorage.setItem('cp_aiLanguage', aiLanguage);
    localStorage.setItem('cp_aiModel', aiModel);
    localStorage.setItem('cp_historyEnabled', JSON.stringify(historyEnabled));
    localStorage.setItem('cp_suggestionsEnabled', JSON.stringify(suggestionsEnabled));

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Custom Toggle Switch Component
  const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: (val: boolean) => void;
    label: string;
    description?: string;
  }> = ({ checked, onChange, label, description }) => {
    return (
      <div className="flex items-center justify-between py-3 border-b border-[#DADCE0] dark:border-[#3C4043] last:border-b-0">
        <div className="pr-4">
          <p className="text-xs sm:text-sm font-bold text-[#202124] dark:text-[#E3E3E3]">{label}</p>
          {description && <p className="text-[11px] text-[#5F6368] dark:text-[#9E9E9E] mt-0.5">{description}</p>}
        </div>
        <button
          type="button"
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            checked ? 'bg-[#1e8e3e] dark:bg-[#81C995]' : 'bg-[#DADCE0] dark:bg-[#3C4043]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
              checked ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* Header Panel */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1F1F1F] border border-[#DADCE0] dark:border-[#3C4043] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[#1e8e3e] dark:text-[#81C995] uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> System Console
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202124] dark:text-[#E3E3E3]">
            System Settings & Preferences
          </h1>
          <p className="text-xs text-[#5F6368] dark:text-[#9E9E9E] mt-0.5">
            Configure system themes, notification updates, dashboard layouts, and AI configurations.
          </p>
        </div>
        
        <button
          onClick={handleSave}
          className="w-full sm:w-auto px-4 py-2 bg-[#1e8e3e] hover:bg-[#137333] dark:bg-[#81C995] dark:hover:bg-[#A8DAB5] text-white dark:text-[#121212] rounded-lg font-bold text-xs flex items-center justify-center gap-2 border-none cursor-pointer transition-colors shadow-sm"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" /> Preferences Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Settings
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Side: Navigation Tabs */}
        <div className="md:col-span-1 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible border-b md:border-b-0 border-[#DADCE0] dark:border-[#3C4043] pb-2 md:pb-0 gap-1.5 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-none bg-transparent ${
              activeTab === 'profile'
                ? 'bg-[#E8F0FE] dark:bg-[#202124] text-[#1e8e3e] dark:text-[#81C995] font-bold'
                : 'text-[#5F6368] dark:text-[#9E9E9E] hover:bg-[#F1F3F4] dark:hover:bg-[#1F1F1F]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-none bg-transparent ${
              activeTab === 'academic'
                ? 'bg-[#E8F0FE] dark:bg-[#202124] text-[#1e8e3e] dark:text-[#81C995] font-bold'
                : 'text-[#5F6368] dark:text-[#9E9E9E] hover:bg-[#F1F3F4] dark:hover:bg-[#1F1F1F]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Academic Setup</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-none bg-transparent ${
              activeTab === 'notifications'
                ? 'bg-[#E8F0FE] dark:bg-[#202124] text-[#1e8e3e] dark:text-[#81C995] font-bold'
                : 'text-[#5F6368] dark:text-[#9E9E9E] hover:bg-[#F1F3F4] dark:hover:bg-[#1F1F1F]'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Alerts & Messages</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('display')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-none bg-transparent ${
              activeTab === 'display'
                ? 'bg-[#E8F0FE] dark:bg-[#202124] text-[#1e8e3e] dark:text-[#81C995] font-bold'
                : 'text-[#5F6368] dark:text-[#9E9E9E] hover:bg-[#F1F3F4] dark:hover:bg-[#1F1F1F]'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Theme & Display</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border-none bg-transparent ${
              activeTab === 'ai'
                ? 'bg-[#E8F0FE] dark:bg-[#202124] text-[#1e8e3e] dark:text-[#81C995] font-bold'
                : 'text-[#5F6368] dark:text-[#9E9E9E] hover:bg-[#F1F3F4] dark:hover:bg-[#1F1F1F]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Copilot Engine</span>
          </button>
        </div>

        {/* Right Side: Active Tab View Panel */}
        <div className="md:col-span-3 bg-white dark:bg-[#1F1F1F] border border-[#DADCE0] dark:border-[#3C4043] rounded-2xl p-5 sm:p-6 shadow-sm min-h-[400px]">
          
          {/* TAB 1: PROFILE & ACCOUNT */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#202124] dark:text-[#E3E3E3]">University Member Identity</h3>
                <p className="text-xs text-[#5F6368] dark:text-[#9E9E9E] mt-0.5">Your official verified account registration details.</p>
              </div>

              {user && (
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#202124] border border-[#DADCE0] dark:border-[#3C4043]">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover border border-[#DADCE0] dark:border-[#3C4043]"
                  />
                  <div className="text-center sm:text-left">
                    <p className="text-base font-bold text-[#202124] dark:text-[#E3E3E3]">{user.name}</p>
                    <p className="text-xs text-[#5F6368] dark:text-[#9E9E9E]">{user.email}</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F0FE] text-[#1e8e3e] dark:bg-[#1e8e3e]/20 dark:text-[#81C995] font-bold">
                        {user.department}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[#5F6368] dark:text-[#E3E3E3] font-bold uppercase tracking-wider">
                        {role} Account
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#5F6368] dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
                    Student ID Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={user?.id || 'SEC-STU-3409'}
                      disabled
                      className="w-full pl-3 pr-10 py-2 rounded-lg bg-[#F1F3F4] dark:bg-[#2D2D2D] text-[#5F6368] dark:text-[#9E9E9E] cursor-not-allowed text-xs border border-[#DADCE0] dark:border-[#3C4043] focus:outline-none"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F6368] dark:text-[#9E9E9E]" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5F6368] dark:text-[#9E9E9E] uppercase tracking-wider mb-1">
                    Academic Domain
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value="campuspilot.edu"
                      disabled
                      className="w-full pl-3 pr-10 py-2 rounded-lg bg-[#F1F3F4] dark:bg-[#2D2D2D] text-[#5F6368] dark:text-[#9E9E9E] cursor-not-allowed text-xs border border-[#DADCE0] dark:border-[#3C4043] focus:outline-none"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F6368] dark:text-[#9E9E9E]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC PREFERENCES */}
          {activeTab === 'academic' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#202124] dark:text-[#E3E3E3]">Dashboard & Academic Setup</h3>
                <p className="text-xs text-[#5F6368] dark:text-[#9E9E9E] mt-0.5">Customize your branch, semester, and main dashboard features.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#202124] dark:text-[#E3E3E3] mb-1">
                      Department / Specialization
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full text-xs"
                    >
                      <option>Computer Science & Engineering</option>
                      <option>Electronics & Communication Engineering</option>
                      <option>Electrical & Electronics Engineering</option>
                      <option>Information Technology</option>
                      <option>Mechanical Engineering</option>
                      <option>Civil Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#202124] dark:text-[#E3E3E3] mb-1">
                      Current Semester
                    </label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                      className="w-full text-xs"
                    >
                      <option>Semester 1</option>
                      <option>Semester 2</option>
                      <option>Semester 3</option>
                      <option>Semester 4</option>
                      <option>Semester 5</option>
                      <option>Semester 6</option>
                      <option>Semester 7</option>
                      <option>Semester 8</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#202124] dark:text-[#E3E3E3] mb-1">
                    Graduation Year
                  </label>
                  <select
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="w-full sm:w-1/2 text-xs"
                  >
                    <option>2026</option>
                    <option>2027</option>
                    <option>2028</option>
                    <option>2029</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-[#DADCE0] dark:border-[#3C4043] space-y-2">
                  <h4 className="text-xs font-bold text-[#202124] dark:text-[#E3E3E3] uppercase tracking-wider mb-2">Dashboard Components</h4>
                  <ToggleSwitch
                    checked={showTimetable}
                    onChange={setShowTimetable}
                    label="Show Class Schedule & Timetable"
                    description="Displays your active daily lectures and timing slots on dashboard."
                  />
                  <ToggleSwitch
                    checked={showEvents}
                    onChange={setShowEvents}
                    label="Show Campus Events & Announcements"
                    description="Lists public club circulars and administrative notifications."
                  />
                  <ToggleSwitch
                    checked={showLibrary}
                    onChange={setShowLibrary}
                    label="Digital Library Shortcuts"
                    description="Adds quick access to digital textbooks and reference material search."
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ALERTS & MESSAGES */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#202124] dark:text-[#E3E3E3]">Notification Updates</h3>
                <p className="text-xs text-[#5F6368] dark:text-[#9E9E9E] mt-0.5">Control how and when you receive university circulars and AI alerts.</p>
              </div>

              <div className="space-y-3">
                <ToggleSwitch
                  checked={pushExams}
                  onChange={setPushExams}
                  label="Exam Schedule & Result Alerts"
                  description="Immediate push announcements for exam timetables, halls, and grades."
                />
                
                <ToggleSwitch
                  checked={pushAssignments}
                  onChange={setPushAssignments}
                  label="Assignment & Coursework Reminders"
                  description="Notifications for pending assignments and updates from professors."
                />
                
                <ToggleSwitch
                  checked={emailDigest}
                  onChange={setEmailDigest}
                  label="Weekly Academic Email Digests"
                  description="Receive a summary email of all campus activities, circulars, and announcements."
                />
                
                <ToggleSwitch
                  checked={smsUrgent}
                  onChange={setSmsUrgent}
                  label="Urgent Broadcast SMS Alerts"
                  description="Receive direct text messages for emergency weather notifications or campus holiday broadcasts."
                />
              </div>
            </div>
          )}

          {/* TAB 4: THEME & DISPLAY */}
          {activeTab === 'display' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#202124] dark:text-[#E3E3E3]">Interface Theme & Display Preferences</h3>
                <p className="text-xs text-[#5F6368] dark:text-[#9E9E9E] mt-0.5">Customize font sizes and switch between light and dark UI themes.</p>
              </div>

              {/* Theme Selector */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#202124] dark:text-[#E3E3E3] uppercase tracking-wider">Interface Theme Mode</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer bg-transparent ${
                      theme === 'light'
                        ? 'border-[#1e8e3e] dark:border-[#81C995] text-[#1e8e3e] dark:text-[#81C995] bg-[#E8F0FE]/30 font-bold'
                        : 'border-[#DADCE0] dark:border-[#3C4043] text-[#202124] dark:text-[#E3E3E3]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sun className="w-5 h-5" />
                      <div>
                        <p className="text-xs sm:text-sm font-bold">Light Theme</p>
                        <p className="text-[10px] text-[#5F6368] dark:text-[#9E9E9E]">Clean, high-contrast white layout</p>
                      </div>
                    </div>
                    {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-[#1e8e3e] dark:text-[#81C995]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer bg-transparent ${
                      theme === 'dark'
                        ? 'border-[#1e8e3e] dark:border-[#81C995] text-[#1e8e3e] dark:text-[#81C995] bg-[#E8F0FE]/10 font-bold'
                        : 'border-[#DADCE0] dark:border-[#3C4043] text-[#202124] dark:text-[#E3E3E3]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Moon className="w-5 h-5" />
                      <div>
                        <p className="text-xs sm:text-sm font-bold">Dark Theme</p>
                        <p className="text-[10px] text-[#5F6368] dark:text-[#9E9E9E]">Sleek Google Dark Gray palette</p>
                      </div>
                    </div>
                    {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-[#1e8e3e] dark:text-[#81C995]" />}
                  </button>
                </div>
              </div>

              {/* Font Size Adjuster */}
              <div className="space-y-3 pt-4 border-t border-[#DADCE0] dark:border-[#3C4043]">
                <h4 className="text-xs font-bold text-[#202124] dark:text-[#E3E3E3] uppercase tracking-wider">Interface Scale (Font Size)</h4>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFontSize('small')}
                    className={`px-4 py-2 text-xs rounded-lg border cursor-pointer bg-transparent transition-all ${
                      fontSize === 'small'
                        ? 'border-[#1e8e3e] dark:border-[#81C995] bg-[#E8F0FE]/30 dark:bg-[#E8F0FE]/10 font-bold text-[#1e8e3e] dark:text-[#81C995]'
                        : 'border-[#DADCE0] dark:border-[#3C4043] text-[#202124] dark:text-[#E3E3E3]'
                    }`}
                  >
                    Small (14px)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize('standard')}
                    className={`px-4 py-2 text-xs rounded-lg border cursor-pointer bg-transparent transition-all ${
                      fontSize === 'standard'
                        ? 'border-[#1e8e3e] dark:border-[#81C995] bg-[#E8F0FE]/30 dark:bg-[#E8F0FE]/10 font-bold text-[#1e8e3e] dark:text-[#81C995]'
                        : 'border-[#DADCE0] dark:border-[#3C4043] text-[#202124] dark:text-[#E3E3E3]'
                    }`}
                  >
                    Standard (16px)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize('large')}
                    className={`px-4 py-2 text-xs rounded-lg border cursor-pointer bg-transparent transition-all ${
                      fontSize === 'large'
                        ? 'border-[#1e8e3e] dark:border-[#81C995] bg-[#E8F0FE]/30 dark:bg-[#E8F0FE]/10 font-bold text-[#1e8e3e] dark:text-[#81C995]'
                        : 'border-[#DADCE0] dark:border-[#3C4043] text-[#202124] dark:text-[#E3E3E3]'
                    }`}
                  >
                    Large (18px)
                  </button>
                </div>
                <p className="text-[10px] text-[#5F6368] dark:text-[#9E9E9E] mt-1">Updates browser font layout sizing immediately upon selection.</p>
              </div>
            </div>
          )}

          {/* TAB 5: AI COPILOT ENGINE */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#202124] dark:text-[#E3E3E3]">AI Engine Configuration</h3>
                <p className="text-xs text-[#5F6368] dark:text-[#9E9E9E] mt-0.5">Control layout styles and the engine running the Campus Copilot chat assistant.</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* AI Response Mode */}
                  <div>
                    <label className="block text-xs font-bold text-[#202124] dark:text-[#E3E3E3] mb-1">
                      AI Response Layout Mode
                    </label>
                    <select
                      value={aiMode}
                      onChange={(e) => setAiMode(e.target.value)}
                      className="w-full text-xs"
                    >
                      <option value="structured">Structured Cards & Timetables</option>
                      <option value="compact">Plain Text Only</option>
                      <option value="detailed">Detailed Analytical Mode</option>
                    </select>
                  </div>

                  {/* AI Copilot Language Selection */}
                  <div>
                    <label className="block text-xs font-bold text-[#202124] dark:text-[#E3E3E3] mb-1">
                      Copilot Communication Language
                    </label>
                    <select
                      value={aiLanguage}
                      onChange={(e) => setAiLanguage(e.target.value)}
                      className="w-full text-xs font-medium"
                    >
                      <option value="english">English (Default)</option>
                      <option value="tamil">Tamil (தமிழ்)</option>
                      <option value="tanglish">Tanglish (Tamil + English)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* AI Model Engine */}
                  <div>
                    <label className="block text-xs font-bold text-[#202124] dark:text-[#E3E3E3] mb-1">
                      AI Model Engine
                    </label>
                    <select
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      className="w-full text-xs"
                    >
                      <option value="auto">Auto fallback: Grok then Gemini</option>
                      <option value="grok">Grok first, Gemini fallback</option>
                      <option value="gemini">Gemini first, Grok fallback</option>
                      <option value="glm">GLM fallback</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#DADCE0] dark:border-[#3C4043] space-y-2">
                  <h4 className="text-xs font-bold text-[#202124] dark:text-[#E3E3E3] uppercase tracking-wider mb-2">Copilot Session Settings</h4>
                  <ToggleSwitch
                    checked={historyEnabled}
                    onChange={setHistoryEnabled}
                    label="Retain Copilot Chat History"
                    description="Saves and reloads previous chat discussions for easy retrieval."
                  />
                  <ToggleSwitch
                    checked={suggestionsEnabled}
                    onChange={setSuggestionsEnabled}
                    label="Show Smart Suggestions Panel"
                    description="Displays context-aware prompt tips when starting a conversation."
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      
    </div>
  );
};

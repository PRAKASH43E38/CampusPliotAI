/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  PlusCircle, 
  Trash2, 
  Megaphone,
  CheckCircle, 
  Send,
  Database,
  Building,
  Sparkles,
  Search,
  FileText,
  Edit
} from 'lucide-react';

interface StudentData {
  id: string;
  name: string;
  rollNo: string;
  department: string;
  course: string;
  semester: number;
  email: string;
  attendanceOverall: number;
  cgpa: number;
  hostelBlock: string;
  hostelRoom: string;
}

interface FacultyData {
  id: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  cabin: string;
  officeHours: string;
  researchInterests: string[];
}

interface AnnouncementData {
  id: string;
  title: string;
  category: string;
  date: string;
  content: string;
  author: string;
  priority: string;
}

interface EventData {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  spotsLeft: number;
  totalSpots: number;
  description: string;
  organizer: string;
}

interface AdminViewProps {
  isDark?: boolean;
}

export default function AdminView({ isDark = false }: AdminViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'students' | 'faculty' | 'announcements' | 'events'>('students');
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Data states
  const [students, setStudents] = useState<StudentData[]>([]);
  const [faculty, setFaculty] = useState<FacultyData[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  
  // Search queries
  const [searchQuery, setSearchQuery] = useState('');

  // Form states - Student
  const [studentForm, setStudentForm] = useState({
    id: '',
    name: '',
    rollNo: '',
    department: 'Computer Science & Engineering',
    course: 'B.Tech in CSE',
    semester: 5,
    email: '',
    attendanceOverall: 85,
    cgpa: 8.5,
    hostelBlock: 'Aryabhata Block C',
    hostelRoom: '304-A'
  });

  // Form states - Faculty
  const [facultyForm, setFacultyForm] = useState({
    id: '',
    name: '',
    designation: 'Assistant Professor',
    department: 'Computer Science & Engineering',
    email: '',
    cabin: 'CSE Cabin 10, JS Block',
    officeHours: '09:00 AM - 04:30 PM',
    interestsInput: ''
  });

  // Form states - Announcement
  const [annForm, setAnnForm] = useState({
    title: '',
    category: 'general',
    content: '',
    author: 'Campus Operations Admin',
    priority: 'normal'
  });

  // Form states - Event
  const [evForm, setEvForm] = useState({
    title: '',
    category: 'technical',
    date: '',
    time: '',
    location: '',
    totalSpots: 100,
    description: '',
    organizer: 'CSE Department Association'
  });

  // ----------------------------------------------------
  // DATA LOADERS
  // ----------------------------------------------------
  useEffect(() => {
    loadStudents();
    loadFaculty();
    loadAnnouncements();
    loadEvents();
  }, []);

  const loadStudents = () => {
    setLoading(true);
    fetch('/api/admin/students')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setStudents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const loadFaculty = () => {
    fetch('/api/faculty')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setFaculty(data);
      })
      .catch(err => console.error(err));
  };

  const loadAnnouncements = () => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAnnouncements(data);
      })
      .catch(err => console.error(err));
  };

  const loadEvents = () => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch(err => console.error(err));
  };

  const triggerAlert = (message: string) => {
    setActionSuccess(message);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // ----------------------------------------------------
  // SUBMIT HANDLERS
  // ----------------------------------------------------
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/admin/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentForm)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerAlert(`Student record ${studentForm.id ? 'updated' : 'created'} successfully!`);
          setStudentForm({
            id: '', name: '', rollNo: '', department: 'Computer Science & Engineering',
            course: 'B.Tech in CSE', semester: 5, email: '', attendanceOverall: 85,
            cgpa: 8.5, hostelBlock: 'Aryabhata Block C', hostelRoom: '304-A'
          });
          loadStudents();
        }
      })
      .catch(err => alert(err.message));
  };

  const handleStudentDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this student profile?')) return;
    fetch(`/api/admin/students/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerAlert('Student profile deleted from database.');
          loadStudents();
        }
      })
      .catch(err => console.error(err));
  };

  const handleFacultySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...facultyForm,
      researchInterests: facultyForm.interestsInput.split(',').map(s => s.trim()).filter(Boolean)
    };
    fetch('/api/admin/faculty', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerAlert(`Faculty directory record ${facultyForm.id ? 'updated' : 'created'} successfully!`);
          setFacultyForm({
            id: '', name: '', designation: 'Assistant Professor', department: 'Computer Science & Engineering',
            email: '', cabin: 'CSE Cabin 10, JS Block', officeHours: '09:00 AM - 04:30 PM', interestsInput: ''
          });
          loadFaculty();
        }
      })
      .catch(err => alert(err.message));
  };

  const handleFacultyDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this faculty directory record?')) return;
    fetch(`/api/admin/faculty/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerAlert('Faculty record removed.');
          loadFaculty();
        }
      })
      .catch(err => console.error(err));
  };

  const handleAnnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...annForm,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
    fetch('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerAlert('Notice broadcasted to student dashboard alerts list.');
          setAnnForm({ title: '', category: 'general', content: '', author: 'Campus Operations Admin', priority: 'normal' });
          loadAnnouncements();
        }
      })
      .catch(err => alert(err.message));
  };

  const handleAnnDelete = (id: string) => {
    if (!confirm('Delete this announcement notice?')) return;
    fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerAlert('Announcement notice deleted.');
          loadAnnouncements();
        }
      })
      .catch(err => console.error(err));
  };

  const handleEvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...evForm,
      spotsLeft: evForm.totalSpots
    };
    fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerAlert('Campus event listed on registration logs board.');
          setEvForm({ title: '', category: 'technical', date: '', time: '', location: '', totalSpots: 100, description: '', organizer: 'CSE Department Association' });
          loadEvents();
        }
      })
      .catch(err => alert(err.message));
  };

  const handleEvDelete = (id: string) => {
    if (!confirm('Cancel and delete this campus event listing?')) return;
    fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          triggerAlert('Campus event removed.');
          loadEvents();
        }
      })
      .catch(err => console.error(err));
  };

  // ----------------------------------------------------
  // FILTERED LIST SEARCHES
  // ----------------------------------------------------
  const filteredStudents = students.filter(st => 
    st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    st.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    st.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFaculty = faculty.filter(fac => 
    fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fac.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fac.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16 font-sans transition-colors duration-300">
      
      {/* ----------------------------------------------------
          PORTAL HEADER BANNER
          ---------------------------------------------------- */}
      <div className={`border p-6 rounded-3xl shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 transition-colors duration-300 ${
        isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Database className="w-5 h-5" />
            </span>
            <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Admin Operations Control Panel
            </h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
            Institutional management terminal. Configure student database profiles, add/edit faculty directory details, broadcast portal announcements, list upcoming events, and update the campus knowledge index.
          </p>
        </div>

        <span className={`text-[10px] font-mono font-bold px-3 py-2 rounded-xl border flex items-center gap-1.5 ${
          isDark ? 'text-slate-200 bg-slate-900 border-slate-800' : 'text-slate-700 bg-slate-100 border-slate-200/50'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          Access Level: Administrator Console
        </span>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-505 text-xs font-bold rounded-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-green-500" />
          {actionSuccess}
        </div>
      )}

      {/* ----------------------------------------------------
          SUB-TAB NAVIGATION BAR
          ---------------------------------------------------- */}
      <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
        {[
          { id: 'students', label: 'Student Records', icon: <GraduationCap className="w-4 h-4" /> },
          { id: 'faculty', label: 'Faculty Directory', icon: <Users className="w-4 h-4" /> },
          { id: 'announcements', label: 'Broadcaster Alerts', icon: <Megaphone className="w-4 h-4" /> },
          { id: 'events', label: 'Campus Event Listings', icon: <Calendar className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveSubTab(tab.id as any);
              setSearchQuery('');
            }}
            className={`px-4 py-3 text-xs font-bold rounded-2xl flex items-center gap-2 transition-all shrink-0 cursor-pointer border ${
              activeSubTab === tab.id
                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 active:scale-95'
                : isDark
                  ? 'bg-[#0d0e11] border-slate-800 text-slate-400 hover:text-slate-250 hover:bg-slate-900'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ----------------------------------------------------
          TAB CONTENT PANELS
          ---------------------------------------------------- */}
      <div className="transition-all duration-300">
        
        {/* ====================================================
            TAB 1: STUDENTS MANAGEMENT
            ==================================================== */}
        {activeSubTab === 'students' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Left Column: Student form creation/editing */}
            <div className={`lg:col-span-5 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="border-b border-slate-105 dark:border-slate-850 pb-4">
                <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {studentForm.id ? 'Edit Student Record' : 'Enroll New Student'}
                </h3>
                <p className="text-xs text-slate-500">Configure institutional verification metrics</p>
              </div>

              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Student Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand R."
                      value={studentForm.name}
                      onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Roll Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2023CSE0010"
                      value={studentForm.rollNo}
                      onChange={(e) => setStudentForm({ ...studentForm, rollNo: e.target.value })}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Department</label>
                    <select
                      value={studentForm.department}
                      onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none ${
                        isDark ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    >
                      {['Computer Science & Engineering', 'Electronics & Communication', 'Electrical & Electronics', 'Mechanical Engineering', 'Civil Engineering', 'MBA Studies'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Course Specification</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech in CSE (AI & ML)"
                      value={studentForm.course}
                      onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Semester</label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={studentForm.semester}
                      onChange={(e) => setStudentForm({ ...studentForm, semester: parseInt(e.target.value) || 1 })}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">CGPA / 10</label>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      max={10}
                      value={studentForm.cgpa}
                      onChange={(e) => setStudentForm({ ...studentForm, cgpa: parseFloat(e.target.value) || 0 })}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Attendance %</label>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      max={100}
                      value={studentForm.attendanceOverall}
                      onChange={(e) => setStudentForm({ ...studentForm, attendanceOverall: parseFloat(e.target.value) || 0 })}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Institutional Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="student@saranathan.ac.in"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className={`w-full py-2.5 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                      isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Hostel Block</label>
                    <input
                      type="text"
                      placeholder="e.g. Aryabhata Block C"
                      value={studentForm.hostelBlock}
                      onChange={(e) => setStudentForm({ ...studentForm, hostelBlock: e.target.value })}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Hostel Room</label>
                    <input
                      type="text"
                      placeholder="e.g. 304-A"
                      value={studentForm.hostelRoom}
                      onChange={(e) => setStudentForm({ ...studentForm, hostelRoom: e.target.value })}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  {studentForm.id && (
                    <button
                      type="button"
                      onClick={() => setStudentForm({
                        id: '', name: '', rollNo: '', department: 'Computer Science & Engineering',
                        course: 'B.Tech in CSE', semester: 5, email: '', attendanceOverall: 85,
                        cgpa: 8.5, hostelBlock: 'Aryabhata Block C', hostelRoom: '304-A'
                      })}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isDark ? 'bg-slate-900 border-slate-800 text-slate-350 hover:bg-slate-850' : 'bg-slate-200 border-slate-200 text-slate-655'
                      }`}
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    {studentForm.id ? 'Save Changes' : 'Register Profile'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Students List Table */}
            <div className={`lg:col-span-7 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
                <div>
                  <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    Active Student Profiles Registry
                  </h3>
                  <p className="text-xs text-slate-500">Search and audit registered students</p>
                </div>

                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border max-w-sm ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, roll..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs font-semibold placeholder-slate-450"
                  />
                </div>
              </div>

              {loading ? (
                <p className="text-xs text-slate-500 text-center py-8">Fetching database records...</p>
              ) : filteredStudents.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8 font-semibold">No student records found matching search queries.</p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {filteredStudents.map(st => (
                    <div key={st.id} className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${
                      isDark ? 'bg-slate-905 border-slate-850' : 'bg-slate-50/50 border-slate-150'
                    }`}>
                      <div className="space-y-1 max-w-sm">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black font-mono leading-none bg-blue-600/15 text-blue-500 border border-blue-500/10 px-2 py-0.5 rounded">
                            {st.rollNo}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Sem {st.semester} • {st.department}</span>
                        </div>
                        <h4 className={`text-xs font-black leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {st.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">Email: {st.email}</p>
                        <p className="text-[10px] text-slate-500">CGPA: {st.cgpa} • Attendance: {st.attendanceOverall}%</p>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setStudentForm({
                              id: st.id, name: st.name, rollNo: st.rollNo, department: st.department,
                              course: st.course, semester: st.semester, email: st.email,
                              attendanceOverall: st.attendanceOverall, cgpa: st.cgpa,
                              hostelBlock: st.hostelBlock, hostelRoom: st.hostelRoom
                            });
                          }}
                          className={`p-2 border rounded-xl hover:bg-blue-600/10 hover:border-blue-500 hover:text-blue-500 text-slate-450 transition-colors cursor-pointer`}
                        >
                          <Edit className="w-3.5 h-3.5 text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleStudentDelete(st.id)}
                          className={`p-2 border rounded-xl hover:bg-rose-500/15 hover:border-rose-500 hover:text-rose-500 text-slate-455 transition-colors cursor-pointer`}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 2: FACULTY DIRECTORY MANAGEMENT (ACADEMIC DETAILS)
            ==================================================== */}
        {activeSubTab === 'faculty' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Left: Faculty Form */}
            <div className={`lg:col-span-5 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {facultyForm.id ? 'Edit Faculty Record' : 'Add Faculty Directory Log'}
                </h3>
                <p className="text-xs text-slate-500">Faculty details exist only as academic information managed by the Admin.</p>
              </div>

              <form onSubmit={handleFacultySubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Faculty Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Anand K."
                      value={facultyForm.name}
                      onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Designation</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Assistant Professor"
                      value={facultyForm.designation}
                      onChange={(e) => setFacultyForm({ ...facultyForm, designation: e.target.value })}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Department</label>
                    <select
                      value={facultyForm.department}
                      onChange={(e) => setFacultyForm({ ...facultyForm, department: e.target.value })}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none ${
                        isDark ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    >
                      {['Computer Science & Engineering', 'Electronics & Communication', 'Electrical & Electronics', 'Mechanical Engineering', 'Civil Engineering', 'MBA Studies'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Cabin Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Cabin 5, Block A"
                      value={facultyForm.cabin}
                      onChange={(e) => setFacultyForm({ ...facultyForm, cabin: e.target.value })}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Official Email</label>
                    <input
                      type="email"
                      required
                      placeholder="name@saranathan.ac.in"
                      value={facultyForm.email}
                      onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })}
                      className={`w-full py-2.5 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Office hours</label>
                    <input
                      type="text"
                      placeholder="09:00 AM - 04:30 PM"
                      value={facultyForm.officeHours}
                      onChange={(e) => setFacultyForm({ ...facultyForm, officeHours: e.target.value })}
                      className={`w-full py-2.5 px-3 border rounded-xl text-xs font-semibold outline-none ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Research Interests (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Machine Learning, Computer Vision, Signal Processing..."
                    value={facultyForm.interestsInput}
                    onChange={(e) => setFacultyForm({ ...facultyForm, interestsInput: e.target.value })}
                    className={`w-full py-2.5 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                      isDark ? 'bg-slate-905 border-slate-800 text-slate-100 placeholder-slate-550 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  {facultyForm.id && (
                    <button
                      type="button"
                      onClick={() => setFacultyForm({
                        id: '', name: '', designation: 'Assistant Professor', department: 'Computer Science & Engineering',
                        email: '', cabin: 'CSE Cabin 10, JS Block', officeHours: '09:00 AM - 04:30 PM', interestsInput: ''
                      })}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        isDark ? 'bg-slate-900 border-slate-800 text-slate-350 hover:bg-slate-850' : 'bg-slate-200 border-slate-200 text-slate-655'
                      }`}
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    {facultyForm.id ? 'Save Changes' : 'Save Record'}
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Faculty List */}
            <div className={`lg:col-span-7 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-4">
                <div>
                  <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    Faculty Directory logs
                  </h3>
                  <p className="text-xs text-slate-500">Record storage (Faculty members are no longer system users)</p>
                </div>

                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border max-w-sm ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, cabin..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none outline-none text-xs font-semibold placeholder-slate-450"
                  />
                </div>
              </div>

              {filteredFaculty.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8 font-semibold">No faculty directory records matching search queries.</p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {filteredFaculty.map(fac => (
                    <div key={fac.id} className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${
                      isDark ? 'bg-slate-905 border-slate-850' : 'bg-slate-50/50 border-slate-150'
                    }`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black font-mono leading-none bg-blue-600/15 text-blue-500 border border-blue-500/10 px-2 py-0.5 rounded">
                            {fac.designation}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{fac.department}</span>
                        </div>
                        <h4 className={`text-xs font-black leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {fac.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 truncate">Cabin: {fac.cabin} • Email: {fac.email}</p>
                        {fac.researchInterests.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {fac.researchInterests.map((interest, i) => (
                              <span key={i} className="text-[8px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-400 font-bold uppercase tracking-wider">{interest}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setFacultyForm({
                              id: fac.id, name: fac.name, designation: fac.designation, department: fac.department,
                              email: fac.email, cabin: fac.cabin, officeHours: fac.officeHours,
                              interestsInput: fac.researchInterests.join(', ')
                            });
                          }}
                          className={`p-2 border rounded-xl hover:bg-blue-600/10 hover:border-blue-500 hover:text-blue-500 text-slate-450 transition-colors cursor-pointer`}
                        >
                          <Edit className="w-3.5 h-3.5 text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleFacultyDelete(fac.id)}
                          className={`p-2 border rounded-xl hover:bg-rose-500/15 hover:border-rose-500 hover:text-rose-500 text-slate-455 transition-colors cursor-pointer`}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 3: BROADCASTER ALERTS (ANNOUNCEMENTS)
            ==================================================== */}
        {activeSubTab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Left form */}
            <div className={`lg:col-span-5 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Broadcast Announcement
                </h3>
                <p className="text-xs text-slate-500">Publish alerts to student dashboard timelines</p>
              </div>

              <form onSubmit={handleAnnSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Alert Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hostel Maintenance Shutdown"
                    value={annForm.title}
                    onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                    className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                      isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                    <select
                      value={annForm.category}
                      onChange={(e) => setAnnForm({ ...annForm, category: e.target.value })}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none ${
                        isDark ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    >
                      <option value="general">General Notification</option>
                      <option value="placement">Placement Info</option>
                      <option value="academics">Academics Bulletin</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Priority</label>
                    <select
                      value={annForm.priority}
                      onChange={(e) => setAnnForm({ ...annForm, priority: e.target.value })}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none ${
                        isDark ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    >
                      <option value="normal">Normal Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Alert Content / Message Body</label>
                  <textarea
                    required
                    rows={4}
                    value={annForm.content}
                    onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                    placeholder="Provide details about the notice..."
                    className={`w-full py-2.5 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                      isDark ? 'bg-slate-905 border-slate-800 text-slate-100 placeholder-slate-550 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  Broadcast Notice
                </button>
              </form>
            </div>

            {/* Right: announcements history list */}
            <div className={`lg:col-span-7 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div>
                <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Announcements History Logs
                </h3>
                <p className="text-xs text-slate-500">Track and delete active notifications notices</p>
              </div>

              {announcements.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">No notices broadcasted yet.</p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {announcements.map(ann => (
                    <div key={ann.id} className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${
                      isDark ? 'bg-slate-905 border-slate-850' : 'bg-slate-50/50 border-slate-150'
                    }`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            ann.priority === 'high' ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            {ann.priority} Priority
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{ann.category} • {ann.date}</span>
                        </div>
                        <h4 className={`text-xs font-black leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {ann.title}
                        </h4>
                        <p className="text-[10px] text-slate-400">{ann.content}</p>
                      </div>

                      <button
                        onClick={() => handleAnnDelete(ann.id)}
                        className={`p-2 border rounded-xl hover:bg-rose-500/15 hover:border-rose-500 hover:text-rose-505 text-slate-455 transition-colors cursor-pointer shrink-0`}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 4: CAMPUS EVENT LISTINGS
            ==================================================== */}
        {activeSubTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Left Form */}
            <div className={`lg:col-span-5 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="border-b border-slate-105 dark:border-slate-850 pb-4">
                <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Create Campus Event
                </h3>
                <p className="text-xs text-slate-500">Publish student hackathons, symposiums or club sessions</p>
              </div>

              <form onSubmit={handleEvSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Event Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CodeRed National Hackathon"
                    value={evForm.title}
                    onChange={(e) => setEvForm({ ...evForm, title: e.target.value })}
                    className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                      isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                    <select
                      value={evForm.category}
                      onChange={(e) => setEvForm({ ...evForm, category: e.target.value })}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none ${
                        isDark ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    >
                      <option value="technical">Technical Event</option>
                      <option value="cultural">Cultural Festival</option>
                      <option value="sports">Sports Match</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Total Spots</label>
                    <input
                      type="number"
                      required
                      value={evForm.totalSpots}
                      onChange={(e) => setEvForm({ ...evForm, totalSpots: parseInt(e.target.value) || 100 })}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Date</label>
                    <input
                      type="text"
                      placeholder="e.g. October 15, 2026"
                      value={evForm.date}
                      onChange={(e) => setEvForm({ ...evForm, date: e.target.value })}
                      className={`w-full py-2.5 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Time & Hour</label>
                    <input
                      type="text"
                      placeholder="09:00 AM - 04:30 PM"
                      value={evForm.time}
                      onChange={(e) => setEvForm({ ...evForm, time: e.target.value })}
                      className={`w-full py-2.5 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Location Venue</label>
                    <input
                      type="text"
                      placeholder="e.g. Main Auditorium"
                      value={evForm.location}
                      onChange={(e) => setEvForm({ ...evForm, location: e.target.value })}
                      className={`w-full py-2.5 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Organizer</label>
                    <input
                      type="text"
                      placeholder="e.g. Robotics Association"
                      value={evForm.organizer}
                      onChange={(e) => setEvForm({ ...evForm, organizer: e.target.value })}
                      className={`w-full py-2.5 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        isDark ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Event Description</label>
                  <textarea
                    required
                    rows={3}
                    value={evForm.description}
                    onChange={(e) => setEvForm({ ...evForm, description: e.target.value })}
                    placeholder="Provide details about the hackathon/contest guidelines..."
                    className={`w-full py-2.5 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                      isDark ? 'bg-slate-905 border-slate-800 text-slate-100 placeholder-slate-550 focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  List Campus Event
                </button>
              </form>
            </div>

            {/* Right List */}
            <div className={`lg:col-span-7 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div>
                <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Listed Campus Events
                </h3>
                <p className="text-xs text-slate-500">Track and delete active hackathons or symposium listings</p>
              </div>

              {events.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">No events active.</p>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 font-semibold">
                  {events.map(ev => (
                    <div key={ev.id} className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${
                      isDark ? 'bg-slate-905 border-slate-850' : 'bg-slate-50/50 border-slate-150'
                    }`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-blue-500/10 bg-blue-500/10 text-blue-500`}>
                            {ev.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{ev.date} • {ev.time}</span>
                        </div>
                        <h4 className={`text-xs font-black leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {ev.title}
                        </h4>
                        <p className="text-[10px] text-slate-450">Venue: {ev.location} • Org: {ev.organizer}</p>
                        <p className="text-[10px] text-slate-500">Available Slots: {ev.spotsLeft} / {ev.totalSpots}</p>
                      </div>

                      <button
                        onClick={() => handleEvDelete(ev.id)}
                        className={`p-2 border rounded-xl hover:bg-rose-500/15 hover:border-rose-500 hover:text-rose-505 text-slate-455 transition-colors cursor-pointer shrink-0`}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

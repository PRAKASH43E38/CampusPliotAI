import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/common/StatCard';
import { 
  Users, ShieldCheck, Megaphone, FolderKanban, Calendar, Sparkles, 
  Plus, Edit, Trash2, Search, RefreshCw, Database, Layers, CheckCircle2, 
  AlertTriangle, X, Eye, FileText, ChevronRight, GraduationCap, Award,
  Filter, Check, UserCheck, Phone, Mail, MapPin, DollarSign, Brain, Heart, Star, BookOpen, Building2
} from 'lucide-react';
import { 
  fetchTablesList, fetchTableData, createRecord, updateRecord, deleteRecord, TABLE_PRIMARY_KEYS,
  apiService
} from '../services/apiService';
import { StudentProfile, StudentDatabaseStats } from '../types';
import { useNotifications } from '../context/NotificationContext';

export const AdminDashboard: React.FC = () => {
  const { addNotification } = useNotifications();

  // Navigation tab: 'students' (Student Database) | 'tables' (Raw Table Explorer)
  const [activeTab, setActiveTab] = useState<'students' | 'tables'>('students');

  // STUDENT DATABASE STATE
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [studentStats, setStudentStats] = useState<StudentDatabaseStats | null>(null);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  // Search & Filter State
  const [searchName, setSearchName] = useState('');
  const [searchRegNo, setSearchRegNo] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [filterBatch, setFilterBatch] = useState('All');
  const [filterScholarship, setFilterScholarship] = useState('All');
  const [filterFirstGrad, setFilterFirstGrad] = useState('All');

  // RAW SQLITE TABLES EXPLORER STATE
  const [tablesList, setTablesList] = useState<{ name: string; count: number }[]>([]);
  const [activeTable, setActiveTable] = useState<string>('announcements');
  const [tableData, setTableData] = useState<Record<string, any>[]>([]);
  const [loadingTables, setLoadingTables] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<Record<string, any> | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Quick Broadcast Form state
  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState<'Academic' | 'Exam' | 'Placement' | 'Emergency' | 'General'>('General');

  // Load Student Database
  const loadStudentDatabase = async () => {
    setLoadingStudents(true);
    try {
      const [stList, stStats] = await Promise.all([
        apiService.getStudentProfiles({
          search: searchName || searchRegNo,
          department: filterDept,
          year: filterYear,
          batch: filterBatch,
          scholarship_required: filterScholarship,
          first_graduate: filterFirstGrad
        }),
        apiService.getStudentStats()
      ]);
      setStudents(stList);
      setStudentStats(stStats);
    } catch (err) {
      console.error("Error loading student database:", err);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'students') {
      loadStudentDatabase();
    }
  }, [activeTab, searchName, searchRegNo, filterDept, filterYear, filterBatch, filterScholarship, filterFirstGrad]);

  // Load Raw SQLite Tables
  const loadRawDatabaseTables = async (targetTable = activeTable) => {
    setLoadingTables(true);
    try {
      const [tList, tData] = await Promise.all([
        fetchTablesList(),
        fetchTableData<Record<string, any>>(targetTable)
      ]);
      setTablesList(tList);
      setTableData(tData);
    } catch (err) {
      console.error("Error loading raw database tables:", err);
    } finally {
      setLoadingTables(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'tables') {
      loadRawDatabaseTables(activeTable);
    }
  }, [activeTab, activeTable]);

  // Handle Create Record in SQLite
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRecord(activeTable, formData);
      setActionSuccess(`Successfully created new entry in '${activeTable}'!`);
      setShowCreateModal(false);
      setFormData({});
      
      const title = formData.title || formData.faculty_name || formData.company_name || formData.dept_name || 'New Record Added';
      addNotification(
        `📢 Admin Update: ${activeTable.toUpperCase()}`,
        `New record '${title}' added to institutional database.`,
        'General'
      );

      loadRawDatabaseTables(activeTable);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      alert(`Failed to create record: ${err}`);
    }
  };

  // Handle Edit Record in SQLite
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    const pkCol = TABLE_PRIMARY_KEYS[activeTable] || Object.keys(editingRecord)[0];
    const recordId = editingRecord[pkCol];

    try {
      await updateRecord(activeTable, pkCol, recordId, formData);
      setActionSuccess(`Successfully updated record #${recordId} in '${activeTable}'!`);
      setShowEditModal(false);
      setEditingRecord(null);
      setFormData({});

      addNotification(
        `✏️ Admin Update: ${activeTable.toUpperCase()}`,
        `Record #${recordId} in ${activeTable} was updated by University Administration.`,
        'Academic'
      );

      loadRawDatabaseTables(activeTable);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      alert(`Failed to update record: ${err}`);
    }
  };

  // Handle Delete Record in SQLite
  const handleDeleteRecord = async (row: Record<string, any>) => {
    const pkCol = TABLE_PRIMARY_KEYS[activeTable] || Object.keys(row)[0];
    const recordId = row[pkCol];
    const confirmName = row.title || row.faculty_name || row.dept_name || row.company_name || `Record #${recordId}`;

    if (!window.confirm(`Are you sure you want to delete '${confirmName}' from '${activeTable}'?`)) {
      return;
    }

    try {
      await deleteRecord(activeTable, pkCol, recordId);
      setActionSuccess(`Record deleted successfully from '${activeTable}'!`);

      addNotification(
        `🗑️ Admin Alert: ${activeTable.toUpperCase()}`,
        `Record '${confirmName}' was removed from database.`,
        'Emergency'
      );

      loadRawDatabaseTables(activeTable);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      alert(`Failed to delete record: ${err}`);
    }
  };

  // Open Edit Modal
  const openEditModal = (row: Record<string, any>) => {
    setEditingRecord(row);
    const pkCol = TABLE_PRIMARY_KEYS[activeTable] || Object.keys(row)[0];
    const copy = { ...row };
    delete copy[pkCol];
    delete copy['created_at'];
    delete copy['updated_at'];
    setFormData(copy);
    setShowEditModal(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    if (tableData.length > 0) {
      const sample = { ...tableData[0] };
      const pkCol = TABLE_PRIMARY_KEYS[activeTable] || Object.keys(sample)[0];
      delete sample[pkCol];
      delete sample['created_at'];
      delete sample['updated_at'];
      const blankData: Record<string, any> = {};
      Object.keys(sample).forEach((k) => (blankData[k] = ''));
      setFormData(blankData);
    } else {
      setFormData({});
    }
    setShowCreateModal(true);
  };

  // Create Emergency Broadcast
  const handleCreateBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const today = new Date().toISOString().split('T')[0];
      await createRecord('announcements', {
        title: broadcastTitle,
        category: broadcastCategory,
        publish_date: today,
        description: broadcastContent,
        attachment_url: 'https://saranathan.ac.in',
        source_url: 'https://saranathan.ac.in'
      });

      addNotification(
        `🚨 ${broadcastCategory.toUpperCase()} BROADCAST: ${broadcastTitle}`,
        broadcastContent,
        broadcastCategory
      );

      setActionSuccess(`Broadcast successfully posted to SQLite DB & notified to all students!`);
      setShowBroadcastModal(false);
      setBroadcastTitle('');
      setBroadcastContent('');
      if (activeTab === 'tables') loadRawDatabaseTables(activeTable);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      alert(`Failed to post broadcast: ${err}`);
    }
  };

  // Delete Student Profile
  const handleDeleteStudent = async (studentId: number, studentName: string) => {
    if (!window.confirm(`Are you sure you want to delete Student Profile #${studentId} (${studentName})?`)) {
      return;
    }
    try {
      await apiService.deleteStudentProfile(studentId);
      setActionSuccess(`Student profile #${studentId} deleted successfully!`);
      loadStudentDatabase();
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      alert(`Failed to delete student: ${err}`);
    }
  };

  const filteredRawTableData = tableData.filter((row) => {
    if (!searchQuery) return true;
    return Object.values(row).some((val) =>
      val !== null && String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8 w-full">
      
      {/* Admin Control Center Header */}
      <div className="p-5 sm:p-8 rounded-3xl bg-[#3B6064] border border-[#55828B]/30 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#C9E4CA] uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#C9E4CA]" /> SSE FESTA Institutional Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Student Profile Management System
          </h1>
          <p className="text-xs sm:text-sm text-[#C9E4CA] mt-1 font-medium max-w-2xl leading-relaxed">
            Comprehensive database of registered students, onboarding responses, academic records, and skills. Real-time updates & notifications enabled.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-[#87BBA2] hover:bg-[#55828B] text-[#364958] hover:text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-none min-h-[44px]"
          >
            <Megaphone className="w-4 h-4 text-[#364958]" /> Send Instant Broadcast
          </button>
          <button
            onClick={() => activeTab === 'students' ? loadStudentDatabase() : loadRawDatabaseTables(activeTable)}
            className="p-3 rounded-2xl bg-white border border-[#87BBA2] text-[#364958] hover:bg-[#C9E4CA] font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-w-[44px] min-h-[44px]"
            title="Refresh Database"
          >
            <RefreshCw className={`w-4 h-4 text-[#55828B] ${loadingStudents || loadingTables ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-[#87BBA2] border border-[#3B6064] text-[#364958] text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#364958] shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-[#364958] hover:text-black font-black border-none bg-transparent cursor-pointer">✕</button>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#C9E4CA] pb-3">
        <button
          onClick={() => setActiveTab('students')}
          className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer border-none min-h-[44px] ${
            activeTab === 'students'
              ? 'bg-[#3B6064] text-white shadow-sm'
              : 'bg-white text-[#364958] border border-[#87BBA2] hover:bg-[#C9E4CA]/40'
          }`}
        >
          <Users className="w-4 h-4" /> Student Database ({studentStats?.total_students || 0})
        </button>

        <button
          onClick={() => setActiveTab('tables')}
          className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer border-none min-h-[44px] ${
            activeTab === 'tables'
              ? 'bg-[#3B6064] text-white shadow-sm'
              : 'bg-white text-[#364958] border border-[#87BBA2] hover:bg-[#C9E4CA]/40'
          }`}
        >
          <Database className="w-4 h-4" /> All SQLite Raw Tables ({tablesList.length})
        </button>
      </div>

      {/* VIEW 1: STUDENT DATABASE MANAGEMENT PORTAL */}
      {activeTab === 'students' && (
        <div className="space-y-6 sm:space-y-8">
          
          {/* Dashboard Statistics Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
              title="Total Students"
              value={`${studentStats?.total_students || 0}`}
              change="Registered Profiles"
              isPositive={true}
              icon={Users}
              color="emerald"
              subtitle="Permanent Database"
            />
            <StatCard
              title="Scholarship Requests"
              value={`${studentStats?.scholarship_requests || 0}`}
              icon={Award}
              color="amber"
              subtitle="Financial Aid Applicants"
            />
            <StatCard
              title="First Graduates"
              value={`${studentStats?.first_graduates || 0}`}
              icon={GraduationCap}
              color="cyan"
              subtitle="First Generation Scholars"
            />
            <StatCard
              title="Avg Completion"
              value={`${studentStats?.avg_profile_completion || 0}%`}
              isPositive={true}
              icon={Sparkles}
              color="indigo"
              subtitle="Profile Health Index"
            />
            <StatCard
              title="Departments"
              value={`${Object.keys(studentStats?.department_wise || {}).length} Depts`}
              icon={Building2}
              color="emerald"
              subtitle="Academic Wings"
            />
            <StatCard
              title="Batches Active"
              value={`${Object.keys(studentStats?.year_wise || {}).length} Batches`}
              icon={Calendar}
              color="rose"
              subtitle="Year 1 to Year 4"
            />
          </div>

          {/* Department-wise & Year-wise Visual Distribution */}
          {studentStats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Department Breakdown */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#C9E4CA] shadow-sm space-y-3">
                <h3 className="font-extrabold text-xs text-[#55828B] uppercase tracking-widest flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-[#55828B]" /> Department-wise Student Breakdown
                </h3>
                <div className="space-y-2">
                  {Object.entries(studentStats.department_wise || {}).map(([dept, count]) => {
                    const pct = Math.round((count / (studentStats.total_students || 1)) * 100);
                    return (
                      <div key={dept} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-[#364958]">
                          <span className="truncate max-w-xs">{dept}</span>
                          <span>{count} Students ({pct}%)</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-[#C9E4CA] overflow-hidden">
                          <div className="h-full bg-[#3B6064] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Year-wise Breakdown */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#C9E4CA] shadow-sm space-y-3">
                <h3 className="font-extrabold text-xs text-[#55828B] uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#55828B]" /> Year-wise Student Distribution
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(studentStats.year_wise || {}).map(([yr, count]) => (
                    <div key={yr} className="p-3.5 rounded-2xl bg-[#F7FAF8] border border-[#87BBA2] text-center">
                      <span className="text-xl font-black text-[#364958]">{count}</span>
                      <p className="text-xs font-bold text-[#3B6064] mt-0.5">{yr}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Search & Multi-filter Control Bar */}
          <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#C9E4CA] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#C9E4CA] pb-3">
              <h3 className="font-extrabold text-xs sm:text-sm text-[#364958] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#55828B]" /> Search & Filter Registered Student Profiles
              </h3>
              <span className="text-xs font-bold text-[#55828B]">
                {students.length} Records
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Search by Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#55828B] uppercase">Search Name / Email</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#55828B]" />
                  <input
                    type="text"
                    placeholder="Search name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#87BBA2] bg-white text-[#364958]"
                  />
                </div>
              </div>

              {/* Search by Reg No */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#55828B] uppercase">Register Number</label>
                <input
                  type="text"
                  placeholder="e.g. 21CS8042"
                  value={searchRegNo}
                  onChange={(e) => setSearchRegNo(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#87BBA2] bg-white text-[#364958]"
                />
              </div>

              {/* Filter Department */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#55828B] uppercase">Department</label>
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#87BBA2] bg-white text-[#364958] font-semibold"
                >
                  <option value="All">All Departments</option>
                  <option value="Computer Science & Engineering">CSE</option>
                  <option value="Artificial Intelligence & Data Science">AI & DS</option>
                  <option value="Electronics & Communication">ECE</option>
                  <option value="Information Technology">IT</option>
                  <option value="Mechanical Engineering">Mech</option>
                  <option value="Civil Engineering">Civil</option>
                </select>
              </div>

              {/* Filter Year */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#55828B] uppercase">Year</label>
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#87BBA2] bg-white text-[#364958] font-semibold"
                >
                  <option value="All">All Years</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              {/* Filter Scholarship */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#55828B] uppercase">Scholarship</label>
                <select
                  value={filterScholarship}
                  onChange={(e) => setFilterScholarship(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#87BBA2] bg-white text-[#364958] font-semibold"
                >
                  <option value="All">All</option>
                  <option value="true">Required (Yes)</option>
                  <option value="false">Not Required (No)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Student Table */}
          <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#C9E4CA] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm sm:text-base text-[#364958] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#55828B]" /> Registered Student Database Table
              </h3>
            </div>

            {loadingStudents ? (
              <div className="py-16 text-center text-[#55828B] text-xs font-bold flex flex-col items-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-[#3B6064]" />
                Querying REST API for student profiles...
              </div>
            ) : students.length === 0 ? (
              <div className="py-12 text-center text-[#55828B] text-xs font-medium border border-dashed border-[#87BBA2] rounded-2xl">
                No student profiles found matching the current search filters.
              </div>
            ) : (
              <div className="overflow-x-auto w-full border border-[#87BBA2] rounded-2xl">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead>
                    <tr className="bg-[#3B6064] text-white font-extrabold">
                      <th className="p-3.5 whitespace-nowrap uppercase tracking-wider text-[11px] rounded-tl-xl">ID</th>
                      <th className="p-3.5 whitespace-nowrap uppercase tracking-wider text-[11px]">Full Name</th>
                      <th className="p-3.5 whitespace-nowrap uppercase tracking-wider text-[11px]">Register No</th>
                      <th className="p-3.5 whitespace-nowrap uppercase tracking-wider text-[11px]">Department</th>
                      <th className="p-3.5 whitespace-nowrap uppercase tracking-wider text-[11px]">Year / Sem</th>
                      <th className="p-3.5 whitespace-nowrap uppercase tracking-wider text-[11px]">Batch</th>
                      <th className="p-3.5 whitespace-nowrap uppercase tracking-wider text-[11px]">Completion</th>
                      <th className="p-3.5 text-right whitespace-nowrap uppercase tracking-wider text-[11px] rounded-tr-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#87BBA2]">
                    {students.map((st) => (
                      <tr
                        key={st.student_id}
                        onClick={() => setSelectedStudent(st)}
                        className="hover:bg-[#C9E4CA]/40 transition-colors cursor-pointer group"
                      >
                        <td className="p-3.5 font-bold text-[#364958]">#{st.student_id}</td>
                        <td className="p-3.5 font-extrabold text-[#364958]">
                          {st.full_name}
                          {st.first_graduate && (
                            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] bg-[#87BBA2] text-[#364958] font-bold">1st Grad</span>
                          )}
                        </td>
                        <td className="p-3.5 font-mono text-[#3B6064] font-bold">{st.register_number}</td>
                        <td className="p-3.5 text-[#364958] font-medium max-w-xs truncate">{st.department}</td>
                        <td className="p-3.5 font-bold text-[#364958]">{st.year} (Sem {st.semester || 1})</td>
                        <td className="p-3.5 font-semibold text-[#55828B]">{st.batch}</td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#3B6064]">{st.profile_completion_pct || 100}%</span>
                            <div className="w-12 h-1.5 rounded-full bg-[#C9E4CA] overflow-hidden">
                              <div className="h-full bg-[#3B6064] rounded-full" style={{ width: `${st.profile_completion_pct || 100}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedStudent(st)}
                              className="px-2.5 py-1.5 rounded-xl bg-white border border-[#55828B] text-[#364958] hover:bg-[#C9E4CA] font-bold text-[11px] flex items-center gap-1 cursor-pointer min-h-[36px]"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(st.student_id!, st.full_name)}
                              className="px-2.5 py-1.5 rounded-xl bg-red-100 border border-red-300 text-red-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer min-h-[36px]"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: RAW SQLITE TABLE EXPLORER */}
      {activeTab === 'tables' && (
        <div className="p-4 sm:p-6 rounded-3xl bg-white border border-[#C9E4CA] shadow-sm space-y-6">
          
          {/* Table Selector Pills */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#55828B] uppercase tracking-widest flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[#55828B]" /> Select SQLite Table To Manage:
              </h3>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {tablesList.map((t) => (
                <button
                  key={t.name}
                  onClick={() => {
                    setActiveTable(t.name);
                    setSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 cursor-pointer border-none ${
                    activeTable === t.name
                      ? 'bg-[#3B6064] text-white shadow-sm font-bold'
                      : 'bg-white border border-[#87BBA2] text-[#364958] hover:bg-[#C9E4CA]/40'
                  }`}
                >
                  <span>{t.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    activeTable === t.name ? 'bg-white/20 text-white' : 'bg-[#87BBA2] text-[#364958]'
                  }`}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Toolbar: Search & Add New Record button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#C9E4CA]">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#55828B]" />
              <input
                type="text"
                placeholder={`Search in '${activeTable}' records...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-[#87BBA2] bg-white text-[#364958] focus:border-[#55828B]"
              />
            </div>

            <button
              onClick={openCreateModal}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#3B6064] hover:bg-[#364958] text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer border-none min-h-[44px]"
            >
              <Plus className="w-4 h-4 text-[#C9E4CA]" /> Add New Record to '{activeTable}'
            </button>
          </div>

          {/* Table View */}
          {loadingTables ? (
            <div className="py-16 text-center text-[#55828B] text-xs font-bold flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-[#3B6064]" />
              Loading database table '{activeTable}'...
            </div>
          ) : filteredRawTableData.length === 0 ? (
            <div className="py-12 text-center text-[#55828B] text-xs font-medium border border-dashed border-[#87BBA2] rounded-2xl">
              No records found in '{activeTable}' table.
            </div>
          ) : (
            <div className="overflow-x-auto w-full border border-[#87BBA2] rounded-2xl">
              <table className="w-full text-left text-xs min-w-[600px]">
                <thead>
                  <tr className="bg-[#3B6064] text-white font-extrabold">
                    {columns.map((col) => (
                      <th key={col} className="p-3.5 whitespace-nowrap uppercase tracking-wider text-[11px]">
                        {col}
                      </th>
                    ))}
                    <th className="p-3.5 text-right whitespace-nowrap uppercase tracking-wider text-[11px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#87BBA2]">
                  {filteredRawTableData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#C9E4CA]/40 transition-colors">
                      {columns.map((col) => {
                        const val = row[col];
                        return (
                          <td key={col} className="p-3.5 text-[#364958] max-w-xs truncate font-medium">
                            {val === null ? (
                              <span className="text-[#55828B] italic text-[10px]">NULL</span>
                            ) : typeof val === 'string' && val.startsWith('http') ? (
                              <a href={val} target="_blank" rel="noreferrer" className="text-[#3B6064] underline font-bold text-[11px]">
                                View Link 🔗
                              </a>
                            ) : (
                              String(val)
                            )}
                          </td>
                        );
                      })}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(row)}
                            className="px-2.5 py-1.5 rounded-xl bg-white border border-[#55828B] text-[#364958] hover:bg-[#C9E4CA] font-bold text-[11px] flex items-center gap-1 cursor-pointer min-h-[36px]"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(row)}
                            className="px-2.5 py-1.5 rounded-xl bg-red-100 border border-red-300 text-red-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer min-h-[36px]"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* DETAILED STUDENT PROFILE MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-[#364958]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#C9E4CA] rounded-3xl p-5 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#C9E4CA] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#3B6064] text-[#C9E4CA] font-black flex items-center justify-center text-lg shadow-sm">
                  {selectedStudent.full_name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-[#364958]">{selectedStudent.full_name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#87BBA2] text-[#364958] font-extrabold">
                      ID #{selectedStudent.student_id}
                    </span>
                  </div>
                  <p className="text-xs text-[#55828B] font-medium">
                    Reg No: <span className="font-mono font-bold text-[#3B6064]">{selectedStudent.register_number}</span> • {selectedStudent.college_email}
                  </p>
                </div>
              </div>

              <button onClick={() => setSelectedStudent(null)} className="p-1 rounded-full bg-white text-[#364958] border-none cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content Grid */}
            <div className="space-y-6">
              
              {/* 1. Academic & Personal Overview Card */}
              <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#87BBA2] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#55828B] uppercase">Department</span>
                  <p className="font-extrabold text-[#364958] mt-0.5">{selectedStudent.department}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#55828B] uppercase">Year / Semester</span>
                  <p className="font-extrabold text-[#364958] mt-0.5">{selectedStudent.year} (Sem {selectedStudent.semester || 1})</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#55828B] uppercase">Batch & Section</span>
                  <p className="font-extrabold text-[#364958] mt-0.5">{selectedStudent.batch} (Sec {selectedStudent.section || 'A'})</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#55828B] uppercase">Gender & DOB</span>
                  <p className="font-extrabold text-[#364958] mt-0.5">{selectedStudent.gender || 'N/A'} • {selectedStudent.dob || 'N/A'}</p>
                </div>
              </div>

              {/* 2. Contact & Family Economic Information */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-[#55828B] uppercase tracking-widest flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#55828B]" /> Economic & Contact Details
                </h4>
                <div className="p-4 rounded-2xl bg-[#F7FAF8] border border-[#87BBA2] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-[#55828B] font-bold">Parent / Guardian</span>
                    <p className="font-bold text-[#364958] mt-0.5">{selectedStudent.parent_name || 'N/A'} ({selectedStudent.parent_occupation || 'N/A'})</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#55828B] font-bold">Annual Income</span>
                    <p className="font-bold text-[#364958] mt-0.5">{selectedStudent.family_income || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#55828B] font-bold">Scholarship & First Grad</span>
                    <div className="flex gap-2 mt-0.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedStudent.scholarship_required ? 'bg-[#87BBA2] text-[#364958]' : 'bg-[#C9E4CA] text-[#364958]'}`}>
                        Scholarship: {selectedStudent.scholarship_required ? 'YES' : 'NO'}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedStudent.first_graduate ? 'bg-[#87BBA2] text-[#364958]' : 'bg-[#C9E4CA] text-[#364958]'}`}>
                        1st Grad: {selectedStudent.first_graduate ? 'YES' : 'NO'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Skills */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-[#55828B] uppercase tracking-widest flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-[#55828B]" /> Current Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedStudent.current_skills || []).map((sk, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-[#87BBA2] text-[#364958] font-bold text-xs">
                      ⚡ {sk}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-[#C9E4CA] flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#3B6064] hover:bg-[#364958] text-white font-extrabold text-xs shadow-sm cursor-pointer border-none min-h-[44px]"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CREATE RECORD MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#364958]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#C9E4CA] rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#C9E4CA] pb-3">
              <h3 className="text-base font-extrabold text-[#364958] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#55828B]" /> Add New Record to '{activeTable}'
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-[#364958] p-1 border-none bg-transparent cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              {Object.keys(formData).map((key) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-bold text-[#364958] capitalize">{key.replace('_', ' ')}</label>
                  <textarea
                    rows={key === 'description' || key === 'activities' ? 3 : 1}
                    value={formData[key] || ''}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#87BBA2] bg-white text-[#364958] focus:border-[#55828B]"
                    placeholder={`Enter ${key}...`}
                  />
                </div>
              ))}

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#C9E4CA]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-[#55828B] text-xs font-bold text-[#364958] cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#3B6064] hover:bg-[#364958] text-white text-xs font-extrabold shadow-sm flex items-center justify-center gap-1.5 border-none cursor-pointer min-h-[44px]"
                >
                  <Plus className="w-4 h-4 text-[#C9E4CA]" /> Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT RECORD MODAL */}
      {showEditModal && editingRecord && (
        <div className="fixed inset-0 z-50 bg-[#364958]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#C9E4CA] rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#C9E4CA] pb-3">
              <h3 className="text-base font-extrabold text-[#364958] flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#55828B]" /> Edit Record in '{activeTable}'
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-[#364958] p-1 border-none bg-transparent cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              {Object.keys(formData).map((key) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-bold text-[#364958] capitalize">{key.replace('_', ' ')}</label>
                  <textarea
                    rows={key === 'description' || key === 'activities' ? 3 : 1}
                    value={formData[key] !== null ? String(formData[key]) : ''}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#87BBA2] bg-white text-[#364958] focus:border-[#55828B]"
                  />
                </div>
              ))}

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#C9E4CA]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-[#55828B] text-xs font-bold text-[#364958] cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#3B6064] hover:bg-[#364958] text-white text-xs font-extrabold shadow-sm flex items-center justify-center gap-1.5 border-none cursor-pointer min-h-[44px]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C9E4CA]" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EMERGENCY BROADCAST MODAL */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 bg-[#364958]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#C9E4CA] rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#C9E4CA] pb-3">
              <h3 className="text-base font-extrabold text-[#364958] flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#55828B]" /> Institutional Broadcast Notice
              </h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-[#364958] p-1 border-none bg-transparent cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBroadcast} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#364958]">Notice Category</label>
                <select
                  value={broadcastCategory}
                  onChange={(e) => setBroadcastCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#87BBA2] bg-white text-[#364958] font-bold"
                >
                  <option value="General">General Announcement</option>
                  <option value="Academic">Academic Notice</option>
                  <option value="Exam">Exam Schedule</option>
                  <option value="Placement">Placement Drive Alert</option>
                  <option value="Emergency">Emergency Urgent Alert</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#364958]">Broadcast Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. End Semester Exam Timetable Revised..."
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#87BBA2] bg-white text-[#364958]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#364958]">Broadcast Description / Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write official notice details to broadcast to all students..."
                  value={broadcastContent}
                  onChange={(e) => setBroadcastContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#87BBA2] bg-white text-[#364958]"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-3 border-t border-[#C9E4CA]">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-[#55828B] text-xs font-bold text-[#364958] cursor-pointer min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#3B6064] hover:bg-[#364958] text-white text-xs font-extrabold shadow-sm flex items-center justify-center gap-2 border-none cursor-pointer min-h-[44px]"
                >
                  <Megaphone className="w-4 h-4 text-[#C9E4CA]" /> Broadcast & Notify Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;

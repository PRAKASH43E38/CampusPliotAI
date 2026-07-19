/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { hostelMenu, mockStudent } from '../data/mockData';
import { 
  Coffee, 
  Utensils, 
  Moon, 
  ShieldAlert, 
  CheckCircle, 
  Send, 
  Users, 
  FileText, 
  PhoneCall, 
  FileSignature, 
  PlusCircle, 
  DollarSign, 
  AlertCircle, 
  Calendar, 
  Wifi, 
  Tv, 
  Activity, 
  Info,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
  AlertOctagon,
  Award
} from 'lucide-react';

type DayType = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
type SubTabType = 'dashboard' | 'mess' | 'leave' | 'complaints' | 'guide' | 'community';

interface OutpassRecord {
  id: number;
  studentId: string;
  block: string;
  room: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface MaintenanceComplaint {
  id: string;
  category: 'Electrical' | 'Water' | 'Bathroom' | 'Wi-Fi' | 'Furniture' | 'Cleaning';
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  date: string;
  status: 'PENDING' | 'RESOLVED';
}

interface CommunityPost {
  id: string;
  type: 'lost' | 'found' | 'sell';
  title: string;
  description: string;
  contact: string;
  date: string;
  price?: string; // Optional for sell type
}

interface HostelViewProps {
  isDark?: boolean;
}

export default function HostelView({ isDark = false }: HostelViewProps) {
  // Tabs State
  const [activeTab, setActiveTab] = useState<SubTabType>('dashboard');
  
  // Mess States
  const [activeDay, setActiveDay] = useState<DayType>('Monday');
  const [menuData, setMenuData] = useState<any>(hostelMenu);
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);

  // Outpass States
  const [outpasses, setOutpasses] = useState<OutpassRecord[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [outpassSubmitting, setOutpassSubmitting] = useState(false);
  const [outpassSuccess, setOutpassSuccess] = useState(false);

  // Complaints States
  const [complaints, setComplaints] = useState<MaintenanceComplaint[]>(() => {
    const saved = localStorage.getItem('hostel_complaints');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Default complaints seed data
    return [
      {
        id: 'comp-101',
        category: 'Wi-Fi',
        priority: 'Medium',
        description: 'Internet connection is dropping repeatedly in Room 304-A, speed is below 2 Mbps.',
        date: '2026-07-15',
        status: 'PENDING'
      },
      {
        id: 'comp-102',
        category: 'Water',
        priority: 'High',
        description: 'RO water dispenser on the 3rd floor Aryabhata Block C is leaking water.',
        date: '2026-07-12',
        status: 'RESOLVED'
      }
    ];
  });
  const [complaintCategory, setComplaintCategory] = useState<MaintenanceComplaint['category']>('Electrical');
  const [complaintPriority, setComplaintPriority] = useState<MaintenanceComplaint['priority']>('Medium');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintSuccess, setComplaintSuccess] = useState(false);

  // Community States
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('hostel_community');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'post-1',
        type: 'lost',
        title: 'Lost Blue Stainless steel water bottle',
        description: 'Lost near the sports ground cricket pitch. It has a sticker on the side.',
        contact: 'Devashish (Roll: 2023CSE0145) - Block C Room 304-A',
        date: '2026-07-18'
      },
      {
        id: 'post-2',
        type: 'sell',
        title: 'DBMS Core Textbook (Korth, Silberschatz)',
        description: 'Selling 3rd edition DBMS Textbook in mint condition. Ideal for 5th sem CSE core curriculum.',
        contact: 'Vignesh - Room 302-B (+91 98845 XXXXX)',
        date: '2026-07-17',
        price: 'Rs. 250'
      },
      {
        id: 'post-3',
        type: 'found',
        title: 'Found Keys near Library corridor',
        description: 'Bunch of keys with a leather keychain found near the front entrance steps.',
        contact: 'Contact Warden Office or call Security Room',
        date: '2026-07-16'
      }
    ];
  });
  const [postType, setPostType] = useState<'lost' | 'found' | 'sell'>('lost');
  const [postTitle, setPostTitle] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [postContact, setPostContact] = useState('');
  const [postPrice, setPostPrice] = useState('');
  const [postSuccess, setPostSuccess] = useState(false);

  // Laundry Booking simulation
  const [laundrySlots, setLaundrySlots] = useState([
    { id: '1', time: '08:00 AM - 09:00 AM', status: 'available', bookedBy: '' },
    { id: '2', time: '09:00 AM - 10:00 AM', status: 'booked', bookedBy: 'Vignesh (302-B)' },
    { id: '3', time: '10:00 AM - 11:00 AM', status: 'available', bookedBy: '' },
    { id: '4', time: '11:00 AM - 12:00 PM', status: 'available', bookedBy: '' },
    { id: '5', time: '04:00 PM - 05:00 PM', status: 'booked', bookedBy: 'Karthik (304-A)' },
    { id: '6', time: '05:00 PM - 06:00 PM', status: 'available', bookedBy: '' }
  ]);
  const [laundrySuccess, setLaundrySuccess] = useState<string | null>(null);

  // SOS state
  const [sosActive, setSosActive] = useState(false);

  // ----------------------------------------------------
  // USE EFFECTS / BACKEND SYNC
  // ----------------------------------------------------
  useEffect(() => {
    // 1. Fetch Dynamic Mess Menu from Flask
    fetch('/api/hostel/menu')
      .then(res => {
        if (!res.ok) throw new Error('API Menu not found');
        return res.json();
      })
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setMenuData(data);
        }
      })
      .catch(err => console.log('Falling back to local mock hostelMenu:', err));

    // 2. Fetch Student Outpasses from Flask
    fetchOutpasses();
  }, []);

  const fetchOutpasses = () => {
    fetch('/api/hostel/outpasses', {
      headers: {
        'X-Student-Id': mockStudent.id || 'st-0982'
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch outpasses');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setOutpasses(data);
        }
      })
      .catch(err => console.error('Error fetching outpasses:', err));
  };

  // Sync state to local storage on edits
  useEffect(() => {
    localStorage.setItem('hostel_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('hostel_community', JSON.stringify(communityPosts));
  }, [communityPosts]);

  // ----------------------------------------------------
  // SUBMISSION HANDLERS
  // ----------------------------------------------------
  const handleLeaveRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) return;

    setOutpassSubmitting(true);
    fetch('/api/hostel/outpass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Student-Id': mockStudent.id || 'st-0982'
      },
      body: JSON.stringify({ startDate, endDate, reason })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to create outpass');
        return res.json();
      })
      .then(() => {
        setOutpassSubmitting(false);
        setOutpassSuccess(true);
        setStartDate('');
        setEndDate('');
        setReason('');
        fetchOutpasses(); // Refresh outpass list
        setTimeout(() => setOutpassSuccess(false), 5000);
      })
      .catch(err => {
        setOutpassSubmitting(false);
        alert('Failed to transmit outpass request. Falls back to offline mode.');
        // Offline mock implementation
        const offlineOp: OutpassRecord = {
          id: Date.now(),
          studentId: mockStudent.id,
          block: mockStudent.hostelBlock,
          room: mockStudent.hostelRoom,
          startDate,
          endDate,
          reason,
          status: 'PENDING'
        };
        setOutpasses(prev => [offlineOp, ...prev]);
        setOutpassSuccess(true);
        setStartDate('');
        setEndDate('');
        setReason('');
      });
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintDesc.trim()) return;

    const newComp: MaintenanceComplaint = {
      id: `comp-${Date.now().toString().slice(-4)}`,
      category: complaintCategory,
      priority: complaintPriority,
      description: complaintDesc,
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    };

    setComplaints(prev => [newComp, ...prev]);
    setComplaintDesc('');
    setComplaintSuccess(true);
    setTimeout(() => setComplaintSuccess(false), 4000);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackRating === 0) return;
    setFeedbackSuccess(true);
    setFeedbackComment('');
    setFeedbackRating(0);
    setTimeout(() => setFeedbackSuccess(false), 4000);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postDesc.trim() || !postContact.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      type: postType,
      title: postTitle,
      description: postDesc,
      contact: postContact,
      date: new Date().toISOString().split('T')[0],
      price: postType === 'sell' ? postPrice : undefined
    };

    setCommunityPosts(prev => [newPost, ...prev]);
    setPostTitle('');
    setPostDesc('');
    setPostContact('');
    setPostPrice('');
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 4000);
  };

  const bookLaundrySlot = (slotId: string) => {
    setLaundrySlots(prev => prev.map(slot => {
      if (slot.id === slotId) {
        if (slot.status === 'available') {
          setLaundrySuccess(`Successfully booked washing slot: ${slot.time}`);
          setTimeout(() => setLaundrySuccess(null), 4000);
          return { ...slot, status: 'booked', bookedBy: `${mockStudent.name} (304-A)` };
        } else if (slot.bookedBy === `${mockStudent.name} (304-A)`) {
          setLaundrySuccess(`Cancelled booking for slot: ${slot.time}`);
          setTimeout(() => setLaundrySuccess(null), 4000);
          return { ...slot, status: 'available', bookedBy: '' };
        }
      }
      return slot;
    }));
  };

  // Days list
  const days: DayType[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

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
              <Clock className="w-5 h-5" />
            </span>
            <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Hostel & Mess Management
            </h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
            Saranathan Student residential ecosystem. File leave outpasses, view weekly dining schedules, register maintenance complaints, and trigger emergency SOS alarms.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <span className={`text-[10px] font-mono font-bold px-3 py-2 rounded-xl border flex items-center gap-1.5 ${
            isDark ? 'text-slate-200 bg-slate-900 border-slate-800' : 'text-slate-700 bg-slate-100 border-slate-200/50'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Status: Checked-In
          </span>
          <span className={`text-[10px] font-mono font-bold px-3 py-2 rounded-xl border flex items-center gap-1.5 ${
            isDark ? 'text-slate-200 bg-slate-900 border-slate-800' : 'text-slate-700 bg-slate-100 border-slate-200/50'
          }`}>
            Room: {mockStudent.hostelBlock} • {mockStudent.hostelRoom}
          </span>
        </div>
      </div>

      {/* ----------------------------------------------------
          SOS EMERGENCY ALARM PANEL
          ---------------------------------------------------- */}
      {sosActive ? (
        <div className="p-5 bg-rose-600 text-white rounded-3xl border border-rose-500 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse shadow-xl">
          <div className="flex items-center gap-3">
            <AlertOctagon className="w-10 h-10 shrink-0" />
            <div>
              <h4 className="text-base font-black uppercase tracking-wider">Hostel SOS Beacon Activated</h4>
              <p className="text-xs text-rose-100 font-semibold mt-0.5">
                SOS ping sent to Duty Warden Office, Main Security Post, and Ambulance Room. Coordinates logged from Aryabhata Block C.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <a href="tel:+919443212345" className="px-4 py-2 bg-white text-rose-600 font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 hover:bg-rose-50 transition-colors">
              <PhoneCall className="w-3.5 h-3.5" />
              Call Security Desk
            </a>
            <button 
              onClick={() => setSosActive(false)}
              className="px-4 py-2 bg-rose-800 hover:bg-rose-900 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Cancel SOS
            </button>
          </div>
        </div>
      ) : null}

      {/* ----------------------------------------------------
          SUB-TAB NAVIGATION BAR
          ---------------------------------------------------- */}
      <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-hide">
        {[
          { id: 'dashboard', label: 'Hostel Dashboard', icon: <Users className="w-4 h-4" /> },
          { id: 'mess', label: 'Mess Timetable & Feedback', icon: <Utensils className="w-4 h-4" /> },
          { id: 'leave', label: 'Leave & Gate Pass', icon: <FileSignature className="w-4 h-4" /> },
          { id: 'complaints', label: 'Complaints & Maintenance', icon: <ShieldAlert className="w-4 h-4" /> },
          { id: 'guide', label: 'Warden Contacts & FAQ', icon: <PhoneCall className="w-4 h-4" /> },
          { id: 'community', label: 'Community Lost & Found', icon: <BookOpen className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SubTabType)}
            className={`px-4 py-3 text-xs font-bold rounded-2xl flex items-center gap-2 transition-all shrink-0 cursor-pointer border ${
              activeTab === tab.id
                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 active:scale-95'
                : isDark
                  ? 'bg-[#0d0e11] border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
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
            TAB 1: HOSTEL DASHBOARD (OVERVIEW)
            ==================================================== */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Left Box: Student Room details */}
            <div className={`lg:col-span-8 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Student Room & Occupancy Profile
                </h3>
                <p className="text-xs text-slate-500">Official roommate allocations and wing details</p>
              </div>

              {/* Roommate grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Devashish Sharma (You)', roll: '2023CSE0145', dept: 'CSE (AI & ML)', role: 'Self', avatar: 'DS' },
                  { name: 'Karthik Raja', roll: '2023ECE0092', dept: 'ECE Core', role: 'Roommate', avatar: 'KR' },
                  { name: 'Vignesh S.', roll: '2023MECH0110', dept: 'Mechanical', role: 'Roommate', avatar: 'VS' }
                ].map((mate, idx) => (
                  <div key={idx} className={`p-4 border rounded-2xl flex flex-col justify-between h-36 ${
                    isDark ? 'bg-slate-900/40 border-slate-850/85' : 'bg-slate-50/50 border-slate-150'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 font-extrabold text-xs flex items-center justify-center">
                        {mate.avatar}
                      </div>
                      <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded ${
                        mate.role === 'Self' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {mate.role}
                      </span>
                    </div>
                    <div>
                      <h4 className={`text-xs font-black leading-tight ${isDark ? 'text-slate-205 text-slate-200' : 'text-slate-800'}`}>{mate.name}</h4>
                      <p className="text-[9px] text-slate-400 mt-0.5">{mate.roll} • {mate.dept}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status details indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className={`p-4 border rounded-2xl space-y-1 ${isDark ? 'bg-slate-900/20 border-slate-850' : 'bg-slate-50/30 border-slate-100'}`}>
                  <p className="text-[9px] font-extrabold text-slate-500 uppercase font-mono">Wi-Fi Status</p>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-805'}`}>Active (15 Mbps)</span>
                  </div>
                </div>
                <div className={`p-4 border rounded-2xl space-y-1 ${isDark ? 'bg-slate-900/20 border-slate-850' : 'bg-slate-50/30 border-slate-100'}`}>
                  <p className="text-[9px] font-extrabold text-slate-500 uppercase font-mono">Water Dispatch</p>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-805'}`}>24/7 Available</span>
                  </div>
                </div>
                <div className={`p-4 border rounded-2xl space-y-1 ${isDark ? 'bg-slate-900/20 border-slate-850' : 'bg-slate-50/30 border-slate-100'}`}>
                  <p className="text-[9px] font-extrabold text-slate-500 uppercase font-mono">Hostel Fee Status</p>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-805'}`}>Fully Paid</span>
                  </div>
                </div>
                <div className={`p-4 border rounded-2xl space-y-1 ${isDark ? 'bg-slate-900/20 border-slate-850' : 'bg-slate-50/30 border-slate-100'}`}>
                  <p className="text-[9px] font-extrabold text-slate-500 uppercase font-mono">Power Supply</p>
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-green-500" />
                    <span className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-805'}`}>Normal load</span>
                  </div>
                </div>
              </div>

              {/* Fee Receipt Card */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                isDark ? 'bg-slate-950/40 border-slate-850' : 'bg-slate-50 border-slate-150'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Academic Year 2026-2027 Fees</h5>
                    <p className="text-[10px] text-slate-400">Transaction Ref: TXN-SRN-9988231 cleared successfully.</p>
                  </div>
                </div>
                <button className="px-3.5 py-2 border dark:border-slate-800 dark:bg-slate-900 hover:bg-blue-600/10 hover:border-blue-500 hover:text-blue-500 rounded-xl text-[10px] font-bold transition-all cursor-pointer">
                  Receipt PDF
                </button>
              </div>
            </div>

            {/* Right Box: Quick Laundry slot scheduler */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className={`border rounded-3xl p-6 shadow-sm space-y-4 transition-colors duration-300 ${
                isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div>
                  <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    Smart Laundry Scheduler
                  </h3>
                  <p className="text-xs text-slate-500">Book washing slots (Aryabhata Block C laundry center)</p>
                </div>

                {laundrySuccess && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold rounded-xl flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {laundrySuccess}
                  </div>
                )}

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {laundrySlots.map(slot => (
                    <div key={slot.id} className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                      slot.status === 'booked' 
                        ? 'bg-slate-100 dark:bg-slate-900/30 border-slate-200 dark:border-slate-900/40 text-slate-400' 
                        : 'bg-white dark:bg-slate-905 border-slate-200 dark:border-slate-800/85'
                    }`}>
                      <div>
                        <p className="font-bold text-[11px]">{slot.time}</p>
                        {slot.status === 'booked' && (
                          <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Occupied: {slot.bookedBy}</span>
                        )}
                      </div>
                      <button
                        onClick={() => bookLaundrySlot(slot.id)}
                        disabled={slot.status === 'booked' && slot.bookedBy !== `${mockStudent.name} (304-A)`}
                        className={`px-3 py-1.5 text-[9px] font-extrabold rounded-lg cursor-pointer transition-all ${
                          slot.bookedBy === `${mockStudent.name} (304-A)`
                            ? 'bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 border border-rose-500/20'
                            : slot.status === 'booked'
                              ? 'bg-slate-200 dark:bg-slate-900 text-slate-400 border border-transparent cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600'
                        }`}
                      >
                        {slot.bookedBy === `${mockStudent.name} (304-A)` ? 'Cancel' : slot.status === 'booked' ? 'Booked' : 'Book slot'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SOS panel quick launcher */}
              <div className="p-6 bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-500/20 rounded-3xl shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    Hostel SOS Trigger
                  </h4>
                  <p className="text-[11px] leading-relaxed text-slate-500 mt-1">
                    Press in case of critical medical issue or security hazard inside the hostel bounds.
                  </p>
                </div>
                <button
                  onClick={() => setSosActive(true)}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-rose-600/10 cursor-pointer"
                >
                  Activate SOS Beacon
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 2: MESS & CAFETERIA SCHEDULER
            ==================================================== */}
        {activeTab === 'mess' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Weekly menu details */}
            <div className={`lg:col-span-8 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${isDark ? 'border-slate-850' : 'border-slate-100'}`}>
                <div>
                  <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                    Weekly Mess Dining Schedule
                  </h3>
                  <p className="text-xs text-slate-500">Biometric cafeteria timetable (Monday - Friday)</p>
                </div>

                <div className="flex overflow-x-auto gap-1 scrollbar-hide">
                  {days.map(d => (
                    <button
                      key={d}
                      onClick={() => setActiveDay(d)}
                      className={`px-3 py-1.5 text-[10px] font-black rounded-xl transition-all whitespace-nowrap cursor-pointer border ${
                        activeDay === d
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                          : isDark
                            ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            : 'bg-slate-100 border-transparent text-slate-600 hover:text-slate-950'
                      }`}
                      id={`mess-day-tab-${d.toLowerCase()}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`border p-4 rounded-2xl space-y-2 ${isDark ? 'bg-slate-900/40 border-slate-850' : 'bg-slate-50/50 border-slate-200/40'}`}>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
                    <Coffee className="w-4 h-4 text-orange-400" />
                    Breakfast (07:30 AM - 09:00 AM)
                  </div>
                  <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {menuData[activeDay]?.breakfast || 'Loading menu...'}
                  </p>
                </div>

                <div className={`border p-4 rounded-2xl space-y-2 ${isDark ? 'bg-slate-900/40 border-slate-850' : 'bg-slate-50/50 border-slate-200/40'}`}>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
                    <Utensils className="w-4 h-4 text-blue-555" />
                    Lunch (12:30 PM - 02:00 PM)
                  </div>
                  <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {menuData[activeDay]?.lunch || 'Loading menu...'}
                  </p>
                </div>

                <div className={`border p-4 rounded-2xl space-y-2 ${isDark ? 'bg-slate-900/40 border-slate-850' : 'bg-slate-50/50 border-slate-200/40'}`}>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
                    <Coffee className="w-4 h-4 text-amber-500" />
                    Evening Snacks (05:00 PM - 06:00 PM)
                  </div>
                  <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {menuData[activeDay]?.snack || 'Loading menu...'}
                  </p>
                </div>

                <div className={`border p-4 rounded-2xl space-y-2 ${isDark ? 'bg-slate-900/40 border-slate-850' : 'bg-slate-50/50 border-slate-200/40'}`}>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 font-mono uppercase tracking-wider">
                    <Moon className="w-4 h-4 text-indigo-400" />
                    Dinner (07:30 PM - 09:30 PM)
                  </div>
                  <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    {menuData[activeDay]?.dinner || 'Loading menu...'}
                  </p>
                </div>
              </div>

              {/* Veg / Non-Veg Days details card */}
              <div className="p-4 rounded-2xl border border-dashed dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500 border border-white" />
                  <span className="font-semibold text-slate-500">Vegetarian Days: Mon, Wed, Thu</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500 border border-white" />
                  <span className="font-semibold text-slate-500">Non-Veg Days (Chicken/Egg curries): Tue, Fri</span>
                </div>
                <div className="py-1 px-3 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold rounded-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Special feast: Sunday dinner
                </div>
              </div>
            </div>

            {/* Right Box: Mess Menu Feedback */}
            <div className={`lg:col-span-4 border rounded-3xl p-6 shadow-sm space-y-4 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div>
                <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Diet & Menu Feedback
                </h3>
                <p className="text-xs text-slate-500">Send direct reviews to the Mess Management Committee</p>
              </div>

              {feedbackSuccess ? (
                <div className={`p-5 text-center border rounded-2xl space-y-3 ${
                  isDark ? 'bg-green-950/20 border-green-900/30 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
                }`}>
                  <CheckCircle className="w-6 h-6 text-green-500 mx-auto" />
                  <div>
                    <h5 className="font-bold text-xs">Feedback Received!</h5>
                    <p className="text-[10px] mt-1 leading-relaxed text-slate-400">
                      Your ratings have been transmitted. Feedback is evaluated weekly to optimize dining schedules.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Rate Today's Food Quality</label>
                    <div className="flex gap-2.5 pt-1.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setFeedbackRating(star)}
                          className={`w-8 h-8 rounded-lg font-bold border transition-all text-xs cursor-pointer ${
                            feedbackRating >= star
                              ? 'bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-500/10'
                              : isDark
                                ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                                : 'bg-slate-100 border-transparent text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Constructive Suggestions / Comments</label>
                    <textarea
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Comment on menu taste, hygiene, raw material quality, or server behaviour..."
                      rows={3}
                      className={`w-full py-2.5 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        isDark 
                          ? 'bg-slate-905 border-slate-800 text-slate-100 focus:border-blue-500 placeholder-slate-550' 
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={feedbackRating === 0}
                    className={`w-full py-2.5 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer ${
                      feedbackRating > 0
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10'
                        : 'bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 3: LEAVE & GATE PASS
            ==================================================== */}
        {activeTab === 'leave' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Outpass Form */}
            <div className={`lg:col-span-5 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Warden Leave Clearance Request
                </h3>
                <p className="text-xs text-slate-500">Apply for hostel out-pass or night leave permits</p>
              </div>

              {outpassSuccess && (
                <div className={`p-4 border rounded-2xl flex items-start gap-3 ${
                  isDark ? 'bg-green-950/20 border-green-900/30 text-green-400' : 'bg-green-50 border-green-200 text-green-700'
                }`}>
                  <CheckCircle className="w-5 h-5 shrink-0 text-green-500 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold">Leave Logged Successfully</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                      Outpass request logged and routed to Warden Office. You will be notified on status changes.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleLeaveRequestSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Start Out-Pass Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        isDark 
                          ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Return Date</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        isDark 
                          ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Reason for Leave Out-pass</label>
                  <textarea
                    required
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="E.g., Medical checkup, family emergency, or weekend holiday out-pass..."
                    className={`w-full py-2.5 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-205 ${
                      isDark 
                        ? 'bg-slate-905 border-slate-800 text-slate-100 placeholder-slate-550 focus:border-blue-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={outpassSubmitting}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  {outpassSubmitting ? (
                    'Transmitting logs...'
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Transmit Out-pass Request
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Outpass list and History */}
            <div className={`lg:col-span-7 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div>
                <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Outpass & Leave History
                </h3>
                <p className="text-xs text-slate-500">Track and review previous outpass requests</p>
              </div>

              {outpasses.length === 0 ? (
                <div className={`p-8 text-center rounded-2xl border ${
                  isDark ? 'bg-slate-900/10 border-slate-900 text-slate-550' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-400 stroke-1" />
                  <p className="text-xs font-semibold">No outpass requests found on your profile.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {outpasses.map((op) => (
                    <div key={op.id} className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${
                      isDark ? 'bg-slate-905 border-slate-850' : 'bg-slate-50/50 border-slate-150'
                    }`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            op.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border border-green-500/10' :
                            op.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-505 border border-rose-500/10' :
                            'bg-amber-500/10 text-amber-550 border border-amber-500/10'
                          }`}>
                            {op.status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Room {op.room}</span>
                        </div>
                        <p className={`text-xs font-bold leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {op.reason}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Period: {op.startDate} to {op.endDate}
                        </p>
                      </div>
                      
                      {op.status === 'APPROVED' && (
                        <button className="px-3 py-1.5 bg-blue-600/10 text-blue-500 border border-blue-500/20 hover:bg-blue-600 hover:text-white rounded-xl text-[10px] font-extrabold cursor-pointer transition-all">
                          Get Pass QR
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 4: COMPLAINTS & MAINTENANCE
            ==================================================== */}
        {activeTab === 'complaints' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Raise complaint Form */}
            <div className={`lg:col-span-5 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  File Maintenance Ticket
                </h3>
                <p className="text-xs text-slate-500">Raise issues related to your room or hostel facilities</p>
              </div>

              {complaintSuccess && (
                <div className="p-3.5 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold rounded-xl flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Complaint logged. Plumber/Electrician has been alerted.
                </div>
              )}

              <form onSubmit={handleComplaintSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Category</label>
                    <select
                      value={complaintCategory}
                      onChange={(e) => setComplaintCategory(e.target.value as MaintenanceComplaint['category'])}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        isDark 
                          ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-blue-500' 
                          : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    >
                      {['Electrical', 'Water', 'Bathroom', 'Wi-Fi', 'Furniture', 'Cleaning'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Priority Level</label>
                    <select
                      value={complaintPriority}
                      onChange={(e) => setComplaintPriority(e.target.value as MaintenanceComplaint['priority'])}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        isDark 
                          ? 'bg-slate-900 border-slate-800 text-slate-200 focus:border-blue-500' 
                          : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    >
                      {['Low', 'Medium', 'High'].map(pr => (
                        <option key={pr} value={pr}>{pr} Priority</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Describe Maintenance issue</label>
                  <textarea
                    required
                    rows={3}
                    value={complaintDesc}
                    onChange={(e) => setComplaintDesc(e.target.value)}
                    placeholder="Provide specific room details e.g., 'Bathroom tap is dripping continuously' or 'Study table chair leg is broken'..."
                    className={`w-full py-2.5 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                      isDark 
                        ? 'bg-slate-905 border-slate-800 text-slate-100 placeholder-slate-550 focus:border-blue-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Log Maintenance Complaint
                </button>
              </form>
            </div>

            {/* Complaints list and tracking */}
            <div className={`lg:col-span-7 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div>
                <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Maintenance Complaint Logs
                </h3>
                <p className="text-xs text-slate-500">Track and review submitted maintenance requests</p>
              </div>

              {complaints.length === 0 ? (
                <div className={`p-8 text-center rounded-2xl border ${
                  isDark ? 'bg-slate-900/10 border-slate-900 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400 stroke-1" />
                  <p className="text-xs font-semibold">No maintenance complaints registered.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {complaints.map((comp) => (
                    <div key={comp.id} className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${
                      isDark ? 'bg-slate-905 border-slate-850' : 'bg-slate-50/50 border-slate-150'
                    }`}>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            comp.status === 'RESOLVED' ? 'bg-green-500/10 text-green-500 border border-green-500/10' : 'bg-amber-500/10 text-amber-500 border border-amber-500/10'
                          }`}>
                            {comp.status}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            comp.priority === 'High' ? 'bg-red-500/10 text-red-500' :
                            comp.priority === 'Medium' ? 'bg-orange-500/10 text-orange-505' :
                            'bg-slate-500/10 text-slate-500'
                          }`}>
                            {comp.priority} Priority
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{comp.category} • {comp.date}</span>
                        </div>
                        <p className={`text-xs font-bold leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          {comp.description}
                        </p>
                      </div>

                      {comp.status === 'PENDING' && (
                        <button
                          onClick={() => {
                            setComplaints(prev => prev.map(c => c.id === comp.id ? { ...c, status: 'RESOLVED' as const } : c));
                          }}
                          className="px-3 py-1.5 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20 rounded-xl text-[10px] font-bold transition-all cursor-pointer shrink-0"
                        >
                          Mark Solved
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 5: WARDEN & HELPLINES (GUIDE)
            ==================================================== */}
        {activeTab === 'guide' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Warden Contacts */}
            <div className={`lg:col-span-6 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Hostel Administration & Contacts
                </h3>
                <p className="text-xs text-slate-500">Official wardens and emergency responders directory</p>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Col. K.S. Rathore', role: 'Chief Warden (Aryabhata Block C)', phone: '+91 94432 12345', email: 'warden.boys@saranathan.ac.in', hours: '05:00 PM - 07:00 PM Office hours' },
                  { name: 'Dr. Clara Mendonca', role: 'Girls Hostel Deputy Warden', phone: '+91 94432 12346', email: 'warden.girls@saranathan.ac.in', hours: '04:30 PM - 06:30 PM Office hours' },
                  { name: 'Saranathan Security Desk', role: 'Main Entrance Guard Post', phone: '+91 94432 99881', email: 'security@saranathan.ac.in', hours: '24 Hours Emergency Desk' },
                  { name: 'Campus Health Clinic', role: 'Emergency Doctor & Ambulance', phone: '+91 94432 99882', email: 'clinic@saranathan.ac.in', hours: 'Standby Emergency Response' },
                  { name: 'Anti-Ragging Helpline', role: 'Central Disciplinary Cell', phone: '1800-180-5522', email: 'antiragging@saranathan.ac.in', hours: 'Toll-free 24/7' }
                ].map((adm, idx) => (
                  <div key={idx} className={`p-4 border rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${
                    isDark ? 'bg-slate-905 border-slate-850/70' : 'bg-slate-50/50 border-slate-150'
                  }`}>
                    <div>
                      <h4 className={`text-xs font-black leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{adm.name}</h4>
                      <p className="text-[10px] text-blue-500 font-bold mt-0.5">{adm.role}</p>
                      <p className="text-[9px] text-slate-400 font-semibold mt-1">Available: {adm.hours}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <a href={`tel:${adm.phone.replace(/ /g, '')}`} className="p-2 border dark:border-slate-800 dark:bg-slate-900 hover:bg-blue-600/10 hover:border-blue-500 hover:text-blue-500 text-slate-450 rounded-xl transition-all">
                        <PhoneCall className="w-3.5 h-3.5 text-blue-500" />
                      </a>
                      <a href={`mailto:${adm.email}`} className="p-2 border dark:border-slate-800 dark:bg-slate-900 hover:bg-blue-600/10 hover:border-blue-500 hover:text-blue-500 text-slate-450 rounded-xl transition-all">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick FAQ / Guidelines */}
            <div className={`lg:col-span-6 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  First-Year Student FAQ
                </h3>
                <p className="text-xs text-slate-500">Common hostel regulations and general guidelines</p>
              </div>

              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                {[
                  { q: 'What is the daily curfew lockout timing?', a: 'Biometric curfew locks trigger strictly at 10:00 PM. Students arriving late must submit written explanations to the chief warden.' },
                  { q: 'How do I apply for a weekend outpass?', a: 'Fill the Warden Leave Clearance Request form inside the outpass tab at least 24 hours in advance. Your parents must approve before the warden signs off.' },
                  { q: 'Can I use personal electric kettles or heaters in my room?', a: 'No, personal high-power appliances (heaters, irons, kettles) are strictly prohibited for fire safety reasons.' },
                  { q: 'What should I do in case of medical emergency at night?', a: 'Press the SOS emergency beacon. The campus medical officer and standby ambulance are active 24/7 at the ground sector clinical bay.' },
                  { q: 'How do I submit laundry clothes?', a: 'Reserve washing slots using the smart laundry scheduler inside the dashboard. Laundry stations are situated at Block C basement wing.' }
                ].map((faq, idx) => (
                  <div key={idx} className={`p-4 border rounded-2xl space-y-1.5 ${
                    isDark ? 'bg-slate-905 border-slate-850/40' : 'bg-slate-50/20 border-slate-100'
                  }`}>
                    <h5 className={`text-xs font-black leading-tight flex items-start gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>{faq.q}</span>
                    </h5>
                    <p className="text-[11px] leading-relaxed text-slate-400 font-semibold pl-6">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            TAB 6: COMMUNITY BOARD (LOST & FOUND / MARKETPLACE)
            ==================================================== */}
        {activeTab === 'community' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Create Post Form */}
            <div className={`lg:col-span-5 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Post on Community Board
                </h3>
                <p className="text-xs text-slate-500">Share notices, sell textbooks, or report lost items</p>
              </div>

              {postSuccess && (
                <div className="p-3.5 bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold rounded-xl flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Successfully posted on the campus board.
                </div>
              )}

              <form onSubmit={handlePostSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Post Type</label>
                    <select
                      value={postType}
                      onChange={(e) => setPostType(e.target.value as 'lost' | 'found' | 'sell')}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        isDark 
                          ? 'bg-slate-900 border-slate-800 text-slate-205 focus:border-blue-500' 
                          : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    >
                      <option value="lost">Lost Item</option>
                      <option value="found">Found Item</option>
                      <option value="sell">Buy & Sell</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Price (for Sell posts)</label>
                    <input
                      type="text"
                      disabled={postType !== 'sell'}
                      placeholder="e.g. Rs. 200"
                      value={postPrice}
                      onChange={(e) => setPostPrice(e.target.value)}
                      className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                        postType !== 'sell'
                          ? 'bg-slate-100 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/40 text-slate-400 cursor-not-allowed'
                          : isDark
                            ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' 
                            : 'bg-white border-slate-200 text-slate-800 focus:border-blue-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Item Title / Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lost Black Leather Wallet, Selling Gate study manuals..."
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                      isDark 
                        ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Description Details</label>
                  <textarea
                    required
                    rows={3}
                    value={postDesc}
                    onChange={(e) => setPostDesc(e.target.value)}
                    placeholder="Provide description, color, brand, condition, and location details..."
                    className={`w-full py-2.5 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                      isDark 
                        ? 'bg-slate-905 border-slate-800 text-slate-100 placeholder-slate-550 focus:border-blue-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-blue-500'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Your Contact Info</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Devashish Room 304-A or +91 944XX..."
                    value={postContact}
                    onChange={(e) => setPostContact(e.target.value)}
                    className={`w-full py-2 px-3 border rounded-xl text-xs font-semibold outline-none transition-colors duration-200 ${
                      isDark 
                        ? 'bg-slate-905 border-slate-800 text-slate-200 focus:border-blue-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Publish Post
                </button>
              </form>
            </div>

            {/* Posts Grid List */}
            <div className={`lg:col-span-7 border rounded-3xl p-6 shadow-sm space-y-6 transition-colors duration-300 ${
              isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div>
                <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Community Notice Board
                </h3>
                <p className="text-xs text-slate-500">Recent posts from boys and girls hostel residents</p>
              </div>

              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1 font-semibold">
                {communityPosts.map(post => (
                  <div key={post.id} className={`p-4 border rounded-2xl space-y-2.5 transition-all ${
                    isDark ? 'bg-slate-905 border-slate-850/60' : 'bg-slate-50/45 border-slate-150'
                  }`}>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                          post.type === 'lost' ? 'bg-rose-500/10 text-rose-500 border-rose-500/10' :
                          post.type === 'found' ? 'bg-green-500/10 text-green-500 border-green-500/10' :
                          'bg-purple-500/10 text-purple-500 border-purple-500/10'
                        }`}>
                          {post.type.toUpperCase()}
                        </span>
                        
                        {post.price && (
                          <span className="text-[10px] font-black text-purple-500 font-mono">
                            Price: {post.price}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono">{post.date}</span>
                    </div>

                    <div>
                      <h4 className={`text-xs font-black font-mono leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {post.title}
                      </h4>
                      <p className="text-[10.5px] leading-relaxed text-slate-450 mt-1">
                        {post.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t dark:border-slate-850/50 text-[10px] flex items-center justify-between text-slate-500 font-mono">
                      <span>Contact: {post.contact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, MapPin, Clock, Star, BookOpen, MessageSquare, Calendar, Sparkles, Building2, Filter } from 'lucide-react';
import { OFFICIAL_DEPARTMENTS } from '../data/mockData';
import { FacultyMember } from '../types';
import { apiService } from '../services/apiService';

export const FacultyPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>('All Departments');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [facultyList, setFacultyList] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadFaculty() {
      try {
        const data = await apiService.getFaculty();
        if (data && data.length > 0) {
          setFacultyList(data);
        }
      } catch (err) {
        console.error("Failed to load faculty from SQLite:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFaculty();
  }, []);

  const filteredFaculty = facultyList.filter((fac) => {
    const matchesDept = selectedDept === 'All Departments' || fac.department === selectedDept;
    const matchesQuery = fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (fac.researchArea && fac.researchArea.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (fac.cabin && fac.cabin.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesQuery;
  });

  const handleBookSlot = () => {
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedFaculty(null);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-slate-900 to-cyan-950/40 border border-indigo-500/30 text-white shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4" /> Academic Mentors Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Faculty Directory & Cabin Locator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Locate professor cabins, inspect real-time status (`In Cabin`, `In Class`), view office hours, and reserve 1-on-1 discussion slots.
          </p>
        </div>
        
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shrink-0">
          <span className="text-2xl font-black text-indigo-400">{loading ? 'Loading...' : `${facultyList.length} Professors`}</span>
          <span className="block text-[10px] text-slate-400 font-semibold uppercase">Live from Central DB</span>
        </div>
      </div>

      {/* Department Selector Pills & Search */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search professor name, domain, or cabin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            Showing {filteredFaculty.length} Professors
          </span>
        </div>

        {/* Department Pills Scrollbar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {OFFICIAL_DEPARTMENTS.map((dept) => {
            const count = dept === 'All Departments'
              ? facultyList.length
              : facultyList.filter((f: FacultyMember) => f.department === dept).length;
            const isSelected = selectedDept === dept;

            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{dept}</span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFaculty.map((fac) => (
          <div
            key={fac.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={fac.avatar}
                    alt={fac.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40 group-hover:scale-105 transition-transform"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${
                      fac.status === 'In Cabin'
                        ? 'bg-emerald-500 animate-pulse'
                        : fac.status === 'In Class'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                      {fac.status}
                    </span>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {fac.rating}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mt-1 truncate">
                    {fac.name}
                  </h3>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold truncate">
                    {fac.designation}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                    {fac.department}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span className="truncate font-medium">{fac.cabin}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="truncate font-medium">{fac.officeHours}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate font-medium">{fac.email}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {fac.specialization.map((spec, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <button
                onClick={() => setSelectedFaculty(fac)}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" /> Book Office Hours
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Popup Modal */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Book Office Hour Appointment</h3>
              <button onClick={() => setSelectedFaculty(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="flex items-center gap-3">
              <img src={selectedFaculty.avatar} alt={selectedFaculty.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{selectedFaculty.name}</h4>
                <p className="text-xs text-indigo-500 font-bold">{selectedFaculty.department}</p>
                <p className="text-[11px] text-slate-400">{selectedFaculty.cabin}</p>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
                <Sparkles className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">Appointment Confirmed!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">Confirmation pass sent to {selectedFaculty.email}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Time Slot</label>
                  <select className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100">
                    <option>Today: 02:30 PM - 03:00 PM</option>
                    <option>Tomorrow: 11:00 AM - 11:30 AM</option>
                    <option>Wednesday: 03:00 PM - 03:30 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Topic / Discussion Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Major Project Guidance / Neural Net Query"
                    className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>

                <button
                  onClick={handleBookSlot}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Confirm Reservation
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

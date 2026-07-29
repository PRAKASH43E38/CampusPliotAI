import React, { useState, useEffect } from 'react';
import { Search, Mail, MapPin, Clock, Star, Calendar, Sparkles } from 'lucide-react';
import { OFFICIAL_DEPARTMENTS as fallbackDepts } from '../data/staticData';
import { FacultyMember } from '../types';
import { apiService } from '../services/apiService';

export const FacultyPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>('All Departments');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [facultyList, setFacultyList] = useState<FacultyMember[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [rawDepts, data] = await Promise.all([
          apiService.getDepartments(),
          apiService.getFaculty()
        ]);
        if (rawDepts && rawDepts.length > 0) {
          const names = rawDepts.map(d => d.dept_name);
          setDepartments(['All Departments', ...names]);
        } else {
          setDepartments(Array.from(fallbackDepts));
        }
        if (data && data.length > 0) {
          setFacultyList(data);
        }
      } catch (err) {
        console.error("Failed to load faculty & depts from SQLite:", err);
        setDepartments(Array.from(fallbackDepts));
      } finally {
        setLoading(false);
      }
    }
    loadData();
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F8FAF8] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4" /> Academic Mentors Directory
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-[#F8FAFC] tracking-tight">
            Faculty Directory & Cabin Locator
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#CBD5E1] mt-1 max-w-xl">
            Locate professor cabins, inspect real-time status (`In Cabin`, `In Class`), view office hours, and reserve discussion slots.
          </p>
        </div>
        
        <div className="p-3.5 rounded-xl bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-center shrink-0">
          <span className="text-2xl font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">{loading ? 'Loading...' : `${facultyList.length} Professors`}</span>
          <span className="block text-[10px] text-[#6B7280] dark:text-[#CBD5E1] font-semibold uppercase">Central Database</span>
        </div>
      </div>

      {/* Department Selector Pills & Search */}
      <div className="p-4 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#CBD5E1]" />
            <input
              type="text"
              placeholder="Search professor name, domain, or cabin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-xs sm:text-sm text-[#1F2937] dark:text-[#F8FAFC] focus:border-[#2E7D32] dark:focus:border-[#4CAF50] focus:outline-none"
            />
          </div>

          <span className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50]">
            Showing {filteredFaculty.length} Professors
          </span>
        </div>

        {/* Department Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-[#E5E7EB] dark:border-[#475569] pt-3">
          {departments.map((dept) => {
            const count = dept === 'All Departments'
              ? facultyList.length
              : facultyList.filter((f: FacultyMember) => f.department === dept).length;
            const isSelected = selectedDept === dept;

            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer border-none ${
                  isSelected
                    ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold'
                    : 'bg-white dark:bg-[#162033] text-[#6B7280] dark:text-[#CBD5E1] border border-[#DDE5DD] dark:border-[#334155]'
                }`}
              >
                <span>{dept}</span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-[#E5E7EB] dark:bg-[#334155] text-[#6B7280] dark:text-[#CBD5E1]'}`}>
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
            className="p-5 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={fac.avatar}
                    alt={fac.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#DDE5DD] dark:border-[#334155]"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#1E293B] ${
                      fac.status === 'In Cabin'
                        ? 'bg-[#2E7D32] dark:bg-[#4CAF50]'
                        : fac.status === 'In Class'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#81C784] font-bold">
                      {fac.status}
                    </span>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-500" /> {fac.rating}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-[#1F2937] dark:text-[#F8FAFC] mt-1 truncate">
                    {fac.name}
                  </h3>
                  <p className="text-xs text-[#2E7D32] dark:text-[#4CAF50] font-bold truncate">
                    {fac.designation}
                  </p>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#CBD5E1] truncate mt-0.5">
                    {fac.department}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3.5 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-xs space-y-1.5 text-[#1F2937] dark:text-[#F8FAFC]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50] shrink-0" />
                  <span className="truncate">{fac.cabin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50] shrink-0" />
                  <span className="truncate">{fac.officeHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#6B7280] dark:text-[#CBD5E1] shrink-0" />
                  <span className="truncate">{fac.email}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {fac.specialization.map((spec, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#81C784] font-semibold">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E5E7EB] dark:border-[#475569]">
              <button
                onClick={() => setSelectedFaculty(fac)}
                className="w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border-none cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" /> Book Office Hours
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Popup Modal */}
      {selectedFaculty && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] rounded-2xl p-6 max-w-md w-full shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#475569] pb-3">
              <h3 className="font-extrabold text-base text-[#1F2937] dark:text-[#F8FAFC]">Book Office Hour Appointment</h3>
              <button onClick={() => setSelectedFaculty(null)} className="text-[#6B7280] hover:text-[#1F2937] dark:hover:text-white border-none bg-transparent cursor-pointer">✕</button>
            </div>

            <div className="flex items-center gap-3">
              <img src={selectedFaculty.avatar} alt={selectedFaculty.name} className="w-12 h-12 rounded-full object-cover border border-[#DDE5DD] dark:border-[#334155]" />
              <div>
                <h4 className="font-bold text-sm text-[#1F2937] dark:text-[#F8FAFC]">{selectedFaculty.name}</h4>
                <p className="text-xs text-[#2E7D32] dark:text-[#4CAF50] font-bold">{selectedFaculty.department}</p>
                <p className="text-[11px] text-[#6B7280] dark:text-[#CBD5E1]">{selectedFaculty.cabin}</p>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="p-4 rounded-xl bg-[#E8F5E9] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-center space-y-1">
                <Sparkles className="w-8 h-8 text-[#2E7D32] dark:text-[#4CAF50] mx-auto" />
                <h4 className="font-bold text-sm text-[#2E7D32] dark:text-[#4CAF50]">Appointment Confirmed!</h4>
                <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1]">Confirmation pass sent to {selectedFaculty.email}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] dark:text-[#F8FAFC] mb-1">Select Time Slot</label>
                  <select className="w-full">
                    <option>Today: 02:30 PM - 03:00 PM</option>
                    <option>Tomorrow: 11:00 AM - 11:30 AM</option>
                    <option>Wednesday: 03:00 PM - 03:30 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] dark:text-[#F8FAFC] mb-1">Topic / Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Major Project Guidance"
                    className="w-full"
                  />
                </div>

                <button
                  onClick={handleBookSlot}
                  className="w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs border-none cursor-pointer"
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

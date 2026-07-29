import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle2, Pin, Sparkles, Search, Share2 } from 'lucide-react';
import { OFFICIAL_DEPARTMENTS as fallbackDepts } from '../data/staticData';
import { CampusEvent, Announcement } from '../types';
import { apiService } from '../services/apiService';

export const EventsPage: React.FC = () => {
  const [eventsList, setEventsList] = useState<CampusEvent[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('All Departments');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [rawDepts, evts, anns] = await Promise.all([
          apiService.getDepartments(),
          apiService.getEvents(),
          apiService.getAnnouncements()
        ]);
        if (rawDepts && rawDepts.length > 0) {
          const names = rawDepts.map(d => d.dept_name);
          setDepartments(['All Departments', ...names]);
        } else {
          setDepartments(Array.from(fallbackDepts));
        }
        if (evts && evts.length > 0) setEventsList(evts);
        if (anns && anns.length > 0) setAnnouncementsList(anns);
      } catch (err) {
        console.error("Failed to load events from SQLite:", err);
        setDepartments(Array.from(fallbackDepts));
      }
    }
    loadData();
  }, []);

  const categories = ['All', 'Hackathon', 'Workshop', 'Cultural', 'Technical', 'Seminar', 'Sports'];

  const filteredEvents = eventsList.filter((evt) => {
    const matchesDept = selectedDept === 'All Departments' || evt.organizer.includes(selectedDept.split(' ')[0]);
    const matchesCat = selectedCategory === 'All' || evt.category === selectedCategory;
    const matchesQuery = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesCat && matchesQuery;
  });

  const toggleRegister = (id: string) => {
    setEventsList((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              isRegistered: !e.isRegistered,
              registeredCount: e.isRegistered ? e.registeredCount - 1 : e.registeredCount + 1
            }
          : e
      )
    );
    if (selectedEvent && selectedEvent.id === id) {
      setSelectedEvent((prev) =>
        prev
          ? {
              ...prev,
              isRegistered: !prev.isRegistered,
              registeredCount: prev.isRegistered ? prev.registeredCount - 1 : prev.registeredCount + 1
            }
          : null
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F8FAF8] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4" /> Live Campus Buzz
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-[#F8FAFC] tracking-tight">
            Events & Campus Broadcasts
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#CBD5E1] mt-1 max-w-xl">
            Register for national hackathons, cultural fests, AI workshops, and track official department announcements.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-center">
            <span className="text-2xl font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">50 Events</span>
            <span className="block text-[10px] text-[#6B7280] dark:text-[#CBD5E1] font-semibold uppercase">Across Departments</span>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-center">
            <span className="text-2xl font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">2,770+</span>
            <span className="block text-[10px] text-[#6B7280] dark:text-[#CBD5E1] font-semibold uppercase">Registrations</span>
          </div>
        </div>
      </div>

      {/* Pinned Broadcast Announcements */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-[#6B7280] dark:text-[#CBD5E1] uppercase tracking-wider flex items-center gap-2">
          <Pin className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" /> Pinned Official Announcements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcementsList.slice(0, 4).map((ann: Announcement) => (
            <div
              key={ann.id}
              className="p-5 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155]"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#81C784] font-bold">
                  {ann.category}
                </span>
                <span className="text-[11px] text-[#6B7280] dark:text-[#CBD5E1]">{ann.date}</span>
              </div>
              <h3 className="font-extrabold text-sm text-[#1F2937] dark:text-[#F8FAFC]">{ann.title}</h3>
              <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] mt-1.5 leading-relaxed">
                {ann.content}
              </p>
              <div className="mt-4 pt-3 border-t border-[#E5E7EB] dark:border-[#475569] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#6B7280] dark:text-[#CBD5E1]">By: {ann.author}</span>
                <span className="text-[#2E7D32] dark:text-[#4CAF50] font-bold">{ann.department}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Category / Department Filter */}
      <div className="p-4 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#CBD5E1]" />
            <input
              type="text"
              placeholder="Search events, workshops or hackathons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-xs sm:text-sm text-[#1F2937] dark:text-[#F8FAFC] focus:border-[#2E7D32] dark:focus:border-[#4CAF50] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer border-none ${
                  selectedCategory === cat
                    ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold'
                    : 'bg-white dark:bg-[#162033] text-[#6B7280] dark:text-[#CBD5E1] border border-[#DDE5DD] dark:border-[#334155]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Department Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-[#E5E7EB] dark:border-[#475569] pt-3">
          {departments.map((dept) => {
            const isSelected = selectedDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer border-none ${
                  isSelected
                    ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold'
                    : 'bg-white dark:bg-[#162033] text-[#6B7280] dark:text-[#CBD5E1] border border-[#DDE5DD] dark:border-[#334155]'
                }`}
              >
                <span>{dept}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((evt: CampusEvent) => (
          <div
            key={evt.id}
            className="p-5 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 rounded-xl overflow-hidden mb-4 bg-[#1F2937]">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover opacity-90"
                />
                
                <span className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-[#1F2937] text-white font-bold text-xs">
                  {evt.category}
                </span>

                {evt.featured && (
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold text-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Featured
                  </span>
                )}
              </div>

              <h3 className="font-extrabold text-base text-[#1F2937] dark:text-[#F8FAFC]">
                {evt.title}
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] mt-2 leading-relaxed line-clamp-2">
                {evt.description}
              </p>

              <div className="mt-4 space-y-2 text-xs text-[#6B7280] dark:text-[#CBD5E1]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
                  <span>{evt.date} • {evt.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
                  <span>{evt.location}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {evt.tags.map((t: string, idx: number) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#81C784] font-semibold">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E7EB] dark:border-[#475569] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#CBD5E1]">
                <Users className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" />
                <span className="font-bold">{evt.registeredCount} / {evt.maxCapacity}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedEvent(evt)}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-xs font-semibold text-[#1F2937] dark:text-[#F8FAFC] cursor-pointer"
                >
                  Details
                </button>
                <button
                  onClick={() => toggleRegister(evt.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border-none ${
                    evt.isRegistered
                      ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white'
                      : 'bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white'
                  }`}
                >
                  {evt.isRegistered ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                    </>
                  ) : (
                    'Register Now'
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Event Details */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] rounded-2xl p-6 max-w-xl w-full shadow-lg space-y-4">
            <div className="relative h-44 rounded-xl overflow-hidden bg-[#1F2937]">
              <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-[#1F2937] text-white border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h3 className="text-lg font-bold text-[#1F2937] dark:text-[#F8FAFC]">{selectedEvent.title}</h3>

            <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] leading-relaxed">
              {selectedEvent.description}
            </p>

            <div className="p-3.5 rounded-xl bg-[#F4F8F4] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-xs space-y-1.5 text-[#1F2937] dark:text-[#F8FAFC]">
              <p><strong>Organizer:</strong> {selectedEvent.organizer}</p>
              <p><strong>Date & Time:</strong> {selectedEvent.date} ({selectedEvent.time})</p>
              <p><strong>Location:</strong> {selectedEvent.location}</p>
              <p><strong>Capacity:</strong> {selectedEvent.registeredCount} / {selectedEvent.maxCapacity}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-xs font-semibold text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-1.5 cursor-pointer">
                <Share2 className="w-3.5 h-3.5" /> Share Event
              </button>
              <button
                onClick={() => toggleRegister(selectedEvent.id)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] flex items-center gap-1.5 border-none cursor-pointer"
              >
                {selectedEvent.isRegistered ? <><CheckCircle2 className="w-4 h-4" /> Registered</> : 'Confirm Seat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

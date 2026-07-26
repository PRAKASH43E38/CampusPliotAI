import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Tag, Users, CheckCircle2, Pin, Sparkles, Filter, Search, Share2, Bell } from 'lucide-react';
import { OFFICIAL_DEPARTMENTS } from '../data/mockData';
import { CampusEvent, Announcement } from '../types';
import { apiService } from '../services/apiService';

export const EventsPage: React.FC = () => {
  const [eventsList, setEventsList] = useState<CampusEvent[]>([]);
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('All Departments');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [evts, anns] = await Promise.all([
          apiService.getEvents(),
          apiService.getAnnouncements()
        ]);
        if (evts && evts.length > 0) setEventsList(evts);
        if (anns && anns.length > 0) setAnnouncementsList(anns);
      } catch (err) {
        console.error("Failed to load events from SQLite:", err);
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-slate-900 to-cyan-950/40 border border-indigo-500/30 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4" /> Live Campus Buzz
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Events & Campus Broadcasts
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Register for national hackathons, cultural fests, AI workshops, and track official department announcements.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-2xl font-black text-cyan-400">50 Events</span>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">Across 7 Departments</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-2xl font-black text-indigo-400">2,770+</span>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase">Registrations</span>
          </div>
        </div>
      </div>

      {/* Pinned Broadcast Announcements */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Pin className="w-4 h-4 text-indigo-500 fill-indigo-500" /> Pinned Official Announcements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcementsList.slice(0, 4).map((ann: Announcement) => (
            <div
              key={ann.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-500/20 dark:border-indigo-500/30 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                  {ann.category}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{ann.date}</span>
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{ann.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                {ann.content}
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-500 dark:text-slate-400">By: {ann.author}</span>
                <span className="text-indigo-500 font-bold">{ann.department}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Category / Department Filter */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search events, workshops or hackathons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Department Pills Scrollbar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 dark:border-slate-800 pt-3">
          {OFFICIAL_DEPARTMENTS.map((dept) => {
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
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredEvents.map((evt: CampusEvent) => (
          <div
            key={evt.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                
                <span className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md text-amber-400 font-extrabold text-xs shadow-md">
                  {evt.category}
                </span>

                {evt.featured && (
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Featured
                  </span>
                )}

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs text-slate-300 font-medium">Organizer: {evt.organizer}</p>
                </div>
              </div>

              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-tight">
                {evt.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed line-clamp-2">
                {evt.description}
              </p>

              <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span>{evt.date} • {evt.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-500" />
                  <span>{evt.location}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {evt.tags.map((t: string, idx: number) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Users className="w-4 h-4 text-indigo-500" />
                <span className="font-bold">{evt.registeredCount} / {evt.maxCapacity}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedEvent(evt)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Details
                </button>
                <button
                  onClick={() => toggleRegister(evt.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md ${
                    evt.isRegistered
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white'
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
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="relative h-48 rounded-2xl overflow-hidden">
              <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-white hover:bg-slate-800"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-600 font-bold">{selectedEvent.category}</span>
                <h3 className="text-lg font-black mt-1">{selectedEvent.title}</h3>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {selectedEvent.description}
            </p>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs space-y-2">
              <p className="text-slate-700 dark:text-slate-300"><strong>Organizer:</strong> {selectedEvent.organizer}</p>
              <p className="text-slate-700 dark:text-slate-300"><strong>Date & Time:</strong> {selectedEvent.date} ({selectedEvent.time})</p>
              <p className="text-slate-700 dark:text-slate-300"><strong>Location:</strong> {selectedEvent.location}</p>
              <p className="text-slate-700 dark:text-slate-300"><strong>Capacity:</strong> {selectedEvent.registeredCount} registered / {selectedEvent.maxCapacity} seats max</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" /> Share Event
              </button>
              <button
                onClick={() => toggleRegister(selectedEvent.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold text-white shadow-md flex items-center gap-1.5 ${
                  selectedEvent.isRegistered ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
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

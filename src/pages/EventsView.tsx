/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { mockEvents, mockStudent } from '../data/mockData';
import { Calendar, MapPin, Users, CheckCircle, Ticket, Info } from 'lucide-react';

interface EventsViewProps {
  isDark?: boolean;
}

export default function EventsView({ isDark = false }: EventsViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [registeredIds, setRegisteredIds] = useState<string[]>(mockStudent.registeredEvents || []);
  const [eventList, setEventList] = useState(mockEvents);

  const handleRegister = (id: string) => {
    if (registeredIds.includes(id)) return;

    fetch('/api/events/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Student-Id': mockStudent.id || 'st-0982'
      },
      body: JSON.stringify({ eventId: id })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setEventList(prev => prev.map(ev => {
          if (ev.id === id) {
            return { ...ev, spotsLeft: ev.spotsLeft - 1 };
          }
          return ev;
        }));
        setRegisteredIds(prev => [...prev, id]);
        if (!mockStudent.registeredEvents.includes(id)) {
          mockStudent.registeredEvents.push(id);
        }
      }
    })
    .catch(err => {
      console.error("Failed to register event:", err);
    });
  };

  const filteredEvents = activeCategory === 'All' 
    ? eventList 
    : eventList.filter(ev => ev.category === activeCategory);

  const categories = ['All', 'technical', 'academic', 'cultural', 'career'];

  return (
    <div className="space-y-8 pb-12 font-sans transition-colors duration-300">
      {/* Banner Introduction */}
      <div className={`border p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors duration-300 ${
        isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        <div>
          <h2 className={`text-xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-955'}`}>University Events & Symposiums</h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse and register for upcoming national hackathons, technical paper presentations, or cultural concerts.
          </p>
        </div>

        <div className="flex gap-2">
          <span className={`text-xs font-bold border px-3 py-1.5 rounded-xl ${
            isDark 
              ? 'bg-blue-950/20 text-blue-400 border-blue-900/30' 
              : 'bg-blue-50 border-blue-100 text-blue-700'
          }`}>
            Registered: {registeredIds.length} Events
          </span>
        </div>
      </div>

      {/* Categories filters */}
      <div className={`flex overflow-x-auto gap-2 pb-1 scrollbar-none border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`pb-4 px-2 text-xs font-bold capitalize relative cursor-pointer ${
              activeCategory === cat 
                ? 'text-blue-500 font-extrabold' 
                : isDark 
                  ? 'text-slate-400 hover:text-slate-200' 
                  : 'text-slate-500 hover:text-slate-900'
            }`}
            id={`event-category-tab-${cat}`}
          >
            {cat}
            {activeCategory === cat && (
              <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Grid view */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredEvents.map(ev => {
          const isRegistered = registeredIds.includes(ev.id);
          return (
            <div 
              key={ev.id}
              className={`border rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col ${
                isDark 
                  ? 'bg-[#0d0e11] border-slate-800 hover:border-slate-700 shadow-none' 
                  : 'bg-white border-slate-200 hover:shadow-lg'
              }`}
              id={`event-card-${ev.id}`}
            >
              {/* Event poster banner image */}
              <div className="h-48 w-full overflow-hidden relative">
                <img referrerPolicy="no-referrer" src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                <span className="absolute top-4 right-4 bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-slate-750">
                  {ev.category}
                </span>
              </div>

              {/* Card body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className={`font-extrabold text-base leading-snug ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{ev.title}</h3>
                    <p className="text-[10px] text-slate-500 font-mono tracking-wide mt-1">Organized by {ev.organizer}</p>
                  </div>

                  <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {ev.description}
                  </p>

                  <div className={`grid grid-cols-2 gap-4 border p-3.5 rounded-2xl text-xs font-semibold ${
                    isDark ? 'bg-slate-900/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{ev.venue}</span>
                    </div>
                  </div>
                </div>

                <div className={`pt-4 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-xs font-bold text-slate-500">
                      {ev.spotsLeft} spots remaining
                    </span>
                  </div>

                  <button
                    onClick={() => handleRegister(ev.id)}
                    disabled={isRegistered || ev.spotsLeft <= 0}
                    className={`py-2.5 px-5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95 ${
                      isRegistered
                        ? isDark 
                          ? 'bg-green-950/20 border border-green-900/30 text-green-400 cursor-default' 
                          : 'bg-green-50 border border-green-200 text-green-700 cursor-default'
                        : ev.spotsLeft <= 0
                        ? 'bg-slate-900/30 border border-slate-800 text-slate-500 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 cursor-pointer'
                    }`}
                    id={`register-event-${ev.id}`}
                  >
                    {isRegistered ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        Registered
                      </>
                    ) : ev.spotsLeft <= 0 ? (
                      'Sold Out'
                    ) : (
                      <>
                        <Ticket className="w-3.5 h-3.5" />
                        Register Spot
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* General Information disclaimer */}
      <div className={`p-4 border rounded-2xl flex items-start gap-3 ${
        isDark ? 'bg-blue-950/20 border-blue-900/30' : 'bg-blue-50/50 border-blue-100'
      }`}>
        <Info className={`w-5 h-5 shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
        <div>
          <p className={`text-xs font-bold ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>Event Attendance Clearance Policy</p>
          <p className={`text-[11px] leading-relaxed mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
            Registered students attending official technical symposiums or national hackathons are eligible to apply for **On-Duty (OD) Attendance Credit**. Clearances must be approved by your respective departmental advisor within 48 hours of event completion.
          </p>
        </div>
      </div>
    </div>
  );
}

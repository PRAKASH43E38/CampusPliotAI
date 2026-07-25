import React from 'react';
import { AICardData, TimetableSlot, Building, FacultyMember, CampusEvent } from '../../types';
import { Clock, MapPin, Calendar, User, ExternalLink, CheckCircle2, Sparkles, ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AICardRendererProps {
  cards: AICardData[];
}

export const AICardRenderer: React.FC<AICardRendererProps> = ({ cards }) => {
  if (!cards || cards.length === 0) return null;

  return (
    <div className="mt-4 space-y-3">
      {cards.map((card, idx) => {
        switch (card.type) {
          case 'timetable': {
            const slot = card.data as TimetableSlot;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                    <Clock className="w-4 h-4" /> Next Class Schedule
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-extrabold">
                    {slot.type}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{slot.subjectName}</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{slot.subjectCode} • {slot.time}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Venue</p>
                      <p className="font-bold truncate text-slate-900 dark:text-white">{slot.building} ({slot.room})</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">Instructor</p>
                      <p className="font-bold truncate text-slate-900 dark:text-white">{slot.facultyName}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <Link
                    to="/map"
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    View on Campus Map <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          }

          case 'map': {
            const bldg = card.data as Building;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> Location Guidance
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                    {bldg.status}
                  </span>
                </div>
                <div className="flex gap-3">
                  <img src={bldg.image} alt={bldg.name} className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{bldg.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{bldg.description}</p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">Hours: {bldg.openingHours}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500">{bldg.floors} Floors • {bldg.departments.length} Depts</span>
                  <Link
                    to={`/map?bldg=${bldg.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                  >
                    Open Live Map <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          }

          case 'faculty': {
            const fac = card.data as FacultyMember;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white">
                <div className="flex items-center gap-3">
                  <img src={fac.avatar} alt={fac.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/40" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{fac.name}</h4>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{fac.designation} • {fac.department}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {fac.status}
                      </span>
                      <span className="text-xs text-amber-500 font-bold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-500" /> {fac.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <p className="text-slate-700 dark:text-slate-300"><strong>Cabin:</strong> {fac.cabin}</p>
                  <p className="text-slate-700 dark:text-slate-300"><strong>Office Hours:</strong> {fac.officeHours}</p>
                  <p className="text-slate-700 dark:text-slate-300 truncate"><strong>Email:</strong> {fac.email}</p>
                </div>
              </div>
            );
          }

          case 'event': {
            const evt = card.data as CampusEvent;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> Recommended Event
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                    {evt.category}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{evt.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{evt.description}</p>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500">{evt.date} • {evt.location}</span>
                  <Link
                    to="/events"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            );
          }

          case 'first_day_plan': {
            const plan = card.data;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">AI First Day Itinerary</h4>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                    {plan.department} • {plan.year}
                  </span>
                </div>

                <div className="space-y-2">
                  {plan.schedule.map((item: any, i: number) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div className="flex-1 text-xs">
                        <div className="flex justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">{item.time}</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.location}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mt-0.5">{item.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          case 'club_recommendation': {
            const club = card.data;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-900 dark:text-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{club.name}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                    {club.matchPercentage}% Match
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{club.description}</p>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-500">{club.membersCount} Members Active</span>
                  <button className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all">
                    Join Guild
                  </button>
                </div>
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
};

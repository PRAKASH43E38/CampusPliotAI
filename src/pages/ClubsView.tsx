/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { mockClubs, mockStudent } from '../data/mockData';
import { Sparkles, CheckCircle, Users, GraduationCap, ChevronRight, Bookmark } from 'lucide-react';

interface ClubsViewProps {
  isDark?: boolean;
}

export default function ClubsView({ isDark = false }: ClubsViewProps) {
  const [joinedClubIds, setJoinedClubIds] = useState<string[]>(mockStudent.joinedClubs || []);
  const [clubList, setClubList] = useState(mockClubs);

  const handleJoinClub = (id: string) => {
    if (joinedClubIds.includes(id)) return;

    fetch('/api/clubs/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Student-Id': mockStudent.id || 'st-0982'
      },
      body: JSON.stringify({ clubId: id })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setClubList(prev => prev.map(cl => {
          if (cl.id === id) {
            return { ...cl, membersCount: cl.membersCount + 1 };
          }
          return cl;
        }));
        setJoinedClubIds(prev => [...prev, id]);
        if (!mockStudent.joinedClubs.includes(id)) {
          mockStudent.joinedClubs.push(id);
        }
      }
    })
    .catch(err => {
      console.error("Failed to join club:", err);
    });
  };

  return (
    <div className="space-y-8 pb-12 font-sans transition-colors duration-300">
      {/* Introduction banner */}
      <div className={`border p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors duration-300 ${
        isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        <div>
          <h2 className={`text-xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-955'}`}>University Student Clubs</h2>
          <p className="text-xs text-slate-500 mt-1">
            Build leadership skills, expand your technical portfolio, and collaborate with creative student bodies.
          </p>
        </div>

        <span className={`text-xs font-bold border px-3.5 py-1.5 rounded-xl shrink-0 ${
          isDark 
            ? 'bg-indigo-950/20 text-indigo-400 border-indigo-900/30' 
            : 'bg-indigo-50 text-indigo-750 border-indigo-100'
        }`}>
          Joined: {joinedClubIds.length} Core Societies
        </span>
      </div>

      {/* Clubs Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {clubList.map(club => {
          const isMember = joinedClubIds.includes(club.id);
          return (
            <div 
              key={club.id}
              className={`border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-6 ${
                isDark 
                  ? 'bg-[#0d0e11] border-slate-800 hover:border-slate-700 shadow-none' 
                  : 'bg-white border-slate-200 hover:shadow-lg'
              }`}
              id={`club-card-${club.id}`}
            >
              <div className="space-y-5">
                {/* Header branding row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 border rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                    }`}>
                      {club.logo}
                    </div>
                    <div>
                      <h3 className={`font-extrabold text-base leading-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{club.name}</h3>
                      <span className="text-[10px] font-mono text-slate-500 block mt-0.5">{club.category}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold border px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    isDark ? 'text-slate-300 bg-slate-900 border-slate-800/60' : 'text-slate-500 bg-slate-100 border-slate-200/60'
                  }`}>
                    <Users className="w-3 h-3 text-slate-400" />
                    {club.membersCount} Members
                  </span>
                </div>

                <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {club.description}
                </p>

                {/* Coordinators summary panel */}
                <div className={`grid grid-cols-2 gap-4 border p-3.5 rounded-2xl text-xs font-semibold ${
                  isDark ? 'bg-slate-900/40 border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Faculty Advisor</span>
                    <span className={`leading-snug block ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{club.facultyCoordinator}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-0.5">Student Lead</span>
                    <span className={`leading-snug block ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{club.studentCoordinator}</span>
                  </div>
                </div>

                {/* Joining requirements */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Entry Criteria</span>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold">{club.requirements}</p>
                </div>
              </div>

              {/* Join action trigger */}
              <div className={`pt-4 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <span className={`text-xs font-bold border px-2.5 py-1 rounded-lg flex items-center gap-1 ${
                  isDark 
                    ? 'text-indigo-400 bg-indigo-950/20 border-indigo-900/30' 
                    : 'text-indigo-600 bg-indigo-50 border-indigo-100'
                }`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {club.upcomingEventsCount} events pending
                </span>

                <button
                  onClick={() => handleJoinClub(club.id)}
                  disabled={isMember}
                  className={`py-2 px-5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 active:scale-95 ${
                    isMember
                      ? isDark 
                        ? 'bg-green-950/20 border border-green-900/30 text-green-400 cursor-default' 
                        : 'bg-green-50 border border-green-200 text-green-700 cursor-default'
                      : isDark 
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 cursor-pointer' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer hover:translate-y-[-1px]'
                  }`}
                  id={`join-club-button-${club.id}`}
                >
                  {isMember ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-green-505" />
                      Active Member
                    </>
                  ) : (
                    <>
                      Join Society
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

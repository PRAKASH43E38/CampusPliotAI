/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { mockFaculty } from '../data/mockData';
import { Search, Mail, MapPin, Clock, Star, ArrowUpRight, Check } from 'lucide-react';

interface FacultyViewProps {
  isDark?: boolean;
}

export default function FacultyView({ isDark = false }: FacultyViewProps) {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [scheduledFacId, setScheduledFacId] = useState<string | null>(null);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 1500);
  };

  const handleScheduleConsultation = (facId: string) => {
    setScheduledFacId(facId);
    setTimeout(() => setScheduledFacId(null), 2000);
  };

  const filteredFaculty = mockFaculty.filter(fac => {
    const matchesSearch = fac.name.toLowerCase().includes(search.toLowerCase()) || 
                          fac.cabin.toLowerCase().includes(search.toLowerCase()) ||
                          fac.researchInterests.some(ri => ri.toLowerCase().includes(search.toLowerCase()));
    
    const matchesDept = selectedDept === 'All' || fac.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  const departments = ['All', 'Computer Science & Engineering', 'Information Technology'];

  return (
    <div className="space-y-8 pb-12 font-sans transition-colors duration-300">
      {/* Banner introduction */}
      <div className={`border p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors duration-300 ${
        isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        <div>
          <h2 className={`text-xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-955'}`}>University Faculty Directory</h2>
          <p className="text-xs text-slate-500 mt-1">
            Search PhD faculty guides, locate active consultation cabins, and coordinate research advisor schedules.
          </p>
        </div>

        <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl shrink-0 border ${
          isDark ? 'text-slate-400 bg-slate-900/60 border-slate-800' : 'text-slate-500 bg-slate-100 border-slate-200'
        }`}>
          Total Directory Size: {mockFaculty.length} Instructors
        </span>
      </div>

      {/* Control panel: Search + Department filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-450">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, cabin, or research keyword..."
            className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all outline-none font-medium shadow-sm ${
              isDark 
                ? 'bg-slate-905 border-slate-800 focus:border-blue-500 text-slate-100 placeholder-slate-550' 
                : 'bg-white border-slate-200 focus:border-blue-500 text-slate-850 placeholder-slate-400'
            }`}
          />
        </div>

        <div className="flex overflow-x-auto gap-1.5 scrollbar-none">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap border cursor-pointer ${
                selectedDept === dept
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : isDark 
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' 
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-950'
              }`}
              id={`faculty-dept-filter-${dept.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {dept === 'All' ? 'All Departments' : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFaculty.map(fac => (
          <div 
            key={fac.id}
            className={`border rounded-3xl p-6 shadow-sm transition-all flex flex-col justify-between space-y-6 ${
              isDark 
                ? 'bg-[#0d0e11] border-slate-800 hover:border-slate-700 hover:shadow-slate-950/20 shadow-none' 
                : 'bg-white border-slate-200 hover:shadow-lg hover:border-slate-300'
            }`}
            id={`faculty-card-${fac.id}`}
          >
            <div className="space-y-4">
              {/* Header profile avatar & title */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-950 text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-md border border-slate-700/15">
                  {fac.avatar}
                </div>
                <div>
                  <h3 className={`font-extrabold text-sm sm:text-base leading-tight ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{fac.name}</h3>
                  <p className="text-xs text-blue-500 font-bold mt-0.5">{fac.designation}</p>
                  <p className="text-[10px] text-slate-500 font-mono tracking-wide mt-0.5">{fac.department}</p>
                </div>
              </div>

              {/* Consultation Details */}
              <div className={`space-y-2 border p-3.5 rounded-2xl ${
                isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className={`flex items-center gap-2.5 text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 animate-pulse" />
                  <span>Cabin: {fac.cabin}</span>
                </div>
                <div className={`flex items-center gap-2.5 text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="leading-snug">{fac.officeHours}</span>
                </div>
              </div>

              {/* Research tags */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">Research & Domains</span>
                <div className="flex flex-wrap gap-1">
                  {fac.researchInterests.map(interest => (
                    <span 
                      key={interest} 
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border ${
                        isDark 
                          ? 'bg-blue-950/20 text-blue-400 border-blue-900/30' 
                          : 'bg-blue-50/50 text-slate-650 border-slate-100'
                      }`}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions button */}
            <div className={`pt-4 border-t flex gap-2 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <button
                onClick={() => handleCopyEmail(fac.email)}
                className={`flex-1 py-2.5 border font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                  isDark 
                    ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
                id={`faculty-copy-email-${fac.id}`}
              >
                {copiedEmail === fac.email ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Copy Email
                  </>
                )}
              </button>

              <button
                onClick={() => handleScheduleConsultation(fac.id)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-500/5 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                id={`faculty-schedule-${fac.id}`}
              >
                {scheduledFacId === fac.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    Scheduled!
                  </>
                ) : (
                  <>
                    Consult Advisor
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}

        {filteredFaculty.length === 0 && (
          <div className={`col-span-full border py-16 text-center rounded-3xl space-y-3 ${
            isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200/80'
          }`}>
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>No instructors found matching your filter</p>
              <p className="text-xs text-slate-500 mt-1">Verify spelling coordinates or expand department category</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

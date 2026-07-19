/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { mockStudent, mockResources, mockClubs } from '../data/mockData';
import { User, Award, BookOpen, Users, Bookmark, FileText } from 'lucide-react';

interface ProfileViewProps {
  isDark?: boolean;
}

export default function ProfileView({ isDark = false }: ProfileViewProps) {
  const [resources, setResources] = useState<any[]>([]);
  
  useEffect(() => {
    fetch('/api/resources')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setResources(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const savedDocs = resources.filter(res => mockStudent.savedResources.includes(res.id));
  const memberClubs = mockClubs.filter(cl => mockStudent.joinedClubs.includes(cl.id));

  const achievementsList = [
    { title: 'Dean’s Honor List 2025', issuer: 'Office of Academics', year: 'Semester IV' },
    { title: '1st Prize - CodeMania Hackathon', issuer: 'University Coding Club', year: '2025' },
    { title: 'Full Attendance Merit Award', issuer: 'Department of CSE', year: 'Semester III' }
  ];

  return (
    <div className="space-y-8 pb-12 font-sans transition-colors duration-300">
      {/* Profile Header Card */}
      <div className={`border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* Background mesh decoration */}
        <div className={`absolute right-[-10%] top-[-10%] w-64 h-64 rounded-full blur-3xl z-0 ${
          isDark ? 'bg-blue-550/5' : 'bg-blue-100/20'
        }`} />

        <div className="w-24 h-24 rounded-3xl bg-slate-950 text-white font-black text-3xl flex items-center justify-center shrink-0 shadow-md relative z-10 border border-slate-850">
          DS
        </div>

        <div className="space-y-3 flex-1 text-center sm:text-left relative z-10">
          <div>
            <h2 className={`text-2xl font-extrabold leading-tight ${isDark ? 'text-slate-100' : 'text-slate-955'}`}>{mockStudent.name}</h2>
            <p className="text-xs text-blue-500 font-bold mt-1">{mockStudent.course}</p>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide mt-0.5">{mockStudent.department} • Roll No: {mockStudent.rollNo}</p>
          </div>

          <p className={`text-xs sm:text-sm font-semibold max-w-xl leading-relaxed ${isDark ? 'text-slate-350' : 'text-slate-600'}`}>
            Highly motivated Computer Science & Engineering undergraduate focusing on Artificial Intelligence and Machine Learning models. Active executive member of the University Coding Club.
          </p>

          <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2">
            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full border ${
              isDark 
                ? 'bg-blue-950/20 text-blue-400 border-blue-900/30' 
                : 'bg-blue-50 text-blue-700 border-blue-100'
            }`}>
              GPA: {mockStudent.cgpa} Stand
            </span>
            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full border ${
              isDark 
                ? 'bg-green-950/20 text-green-400 border-green-900/30' 
                : 'bg-green-50 text-green-700 border-green-100'
            }`}>
              Attendance: {mockStudent.attendanceOverall}%
            </span>
            <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full border ${
              isDark 
                ? 'bg-purple-950/20 text-purple-400 border-purple-900/30' 
                : 'bg-purple-50 text-purple-700 border-purple-100'
            }`}>
              Credits: {mockStudent.totalCredits} Completed
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Achievements and Saved bookmarks */}
        <div className="lg:col-span-7 space-y-8">
          {/* Achievements showcase list */}
          <div className={`border rounded-3xl p-6 shadow-sm space-y-4 transition-colors duration-300 ${
            isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center gap-2 border-b pb-3 ${isDark ? 'border-slate-855' : 'border-slate-100'}`}>
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Academic Honors & Achievements</h3>
            </div>

            <div className="space-y-4">
              {achievementsList.map((ach, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-550 flex items-center justify-center shrink-0 mt-0.5">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{ach.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{ach.issuer} • {ach.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved bookmarks list */}
          <div className={`border rounded-3xl p-6 shadow-sm space-y-4 transition-colors duration-300 ${
            isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center gap-2 border-b pb-3 ${isDark ? 'border-slate-855' : 'border-slate-100'}`}>
              <Bookmark className="w-5 h-5 text-blue-500" />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Saved Study Resources</h3>
            </div>

            <div className="space-y-3">
              {savedDocs.map(doc => (
                <div key={doc.id} className={`p-3 border rounded-2xl flex items-center justify-between text-xs font-semibold ${
                  isDark ? 'bg-slate-900/40 border-slate-850' : 'bg-slate-50 border-slate-200/40'
                }`}>
                  <div className="space-y-0.5">
                    <span className={`font-bold block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{doc.title}</span>
                    <span className="text-[10px] text-slate-500 font-medium block">{doc.subjectCode} • {doc.fileSize}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-bold border px-2.5 py-1 rounded-lg ${
                    isDark 
                      ? 'bg-blue-950/20 text-blue-400 border-blue-900/30' 
                      : 'bg-blue-50 text-blue-700 border-blue-100'
                  }`}>
                    {doc.type.toUpperCase()}
                  </span>
                </div>
              ))}
              {savedDocs.length === 0 && (
                <p className="text-xs text-slate-500 font-semibold text-center py-4">No saved resources found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Joined Clubs society cards list */}
        <div className={`lg:col-span-5 border rounded-3xl p-6 shadow-sm space-y-4 transition-colors duration-300 ${
          isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className={`flex items-center gap-2 border-b pb-3 ${isDark ? 'border-slate-855' : 'border-slate-100'}`}>
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className={`text-sm font-bold uppercase tracking-wider ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Joined Campus Societies</h3>
          </div>

          <div className="space-y-4">
            {memberClubs.map(cl => (
              <div key={cl.id} className={`p-4 border rounded-2xl space-y-2 ${
                isDark ? 'bg-slate-900/40 border-slate-850' : 'bg-slate-50 border-slate-100'
              }`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-xl shrink-0">{cl.logo}</span>
                  <div>
                    <h4 className={`text-xs sm:text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{cl.name}</h4>
                    <span className="text-[10px] text-slate-550 font-medium block">{cl.category}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold line-clamp-2">
                  {cl.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { mockStudent, mockClubs } from '../data/mockData';
import { 
  User, 
  Award, 
  BookOpen, 
  Users, 
  Bookmark, 
  FileText, 
  Edit, 
  Save, 
  X, 
  Camera, 
  Phone, 
  Github, 
  Linkedin, 
  Globe 
} from 'lucide-react';

interface ProfileViewProps {
  isDark?: boolean;
}

export default function ProfileView({}: ProfileViewProps) {
  const [resources, setResources] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);

  const [profile, setProfile] = useState({
    name: mockStudent.name,
    rollNo: mockStudent.rollNo,
    department: mockStudent.department || 'Computer Science & Engineering',
    course: mockStudent.course,
    phoneNumber: mockStudent.phoneNumber || '',
    linkedinUrl: mockStudent.linkedinUrl || '',
    githubUrl: mockStudent.githubUrl || '',
    portfolioUrl: mockStudent.portfolioUrl || '',
    shortBio: mockStudent.shortBio || '',
    careerObjective: mockStudent.careerObjective || '',
    skills: mockStudent.skills ? mockStudent.skills.join(', ') : '',
    avatar: mockStudent.avatar || ''
  });

  const fetchResources = () => {
    fetch('/api/resources')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setResources(data);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    setProfile({
      name: mockStudent.name,
      rollNo: mockStudent.rollNo,
      department: mockStudent.department || 'Computer Science & Engineering',
      course: mockStudent.course,
      phoneNumber: mockStudent.phoneNumber || '',
      linkedinUrl: mockStudent.linkedinUrl || '',
      githubUrl: mockStudent.githubUrl || '',
      portfolioUrl: mockStudent.portfolioUrl || '',
      shortBio: mockStudent.shortBio || '',
      careerObjective: mockStudent.careerObjective || '',
      skills: mockStudent.skills ? mockStudent.skills.join(', ') : '',
      avatar: mockStudent.avatar || ''
    });
  }, [mockStudent.name, mockStudent.avatar, mockStudent.rollNo, mockStudent.course]);

  const savedDocs = resources.filter(res => mockStudent.savedResources.includes(res.id));
  const memberClubs = mockClubs.filter(cl => mockStudent.joinedClubs.includes(cl.id));

  const achievementsList = [
    { title: 'Dean’s Honor List 2025', issuer: 'Office of Academics', year: 'Semester IV' },
    { title: '1st Prize - CodeMania Hackathon', issuer: 'University Coding Club', year: '2025' },
    { title: 'Full Attendance Merit Award', issuer: 'Department of CSE', year: 'Semester III' }
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('photo', file);

      setPhotoUploading(true);
      fetch('/api/profile/photo', {
        method: 'POST',
        headers: {
          'X-Student-Id': mockStudent.id || 'st-0982'
        },
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          setPhotoUploading(false);
          if (data.success) {
            setProfile(prev => ({ ...prev, avatar: data.avatarUrl }));
            mockStudent.avatar = data.avatarUrl;
          } else {
            alert(data.message || "Failed to upload photo");
          }
        })
        .catch(err => {
          setPhotoUploading(false);
          console.error("Error uploading photo:", err);
        });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Student-Id': mockStudent.id || 'st-0982'
      },
      body: JSON.stringify({
        ...profile,
        skills: profile.skills.split(',').map(s => s.trim()).filter(Boolean)
      })
    })
      .then(res => res.json())
      .then(data => {
        Object.assign(mockStudent, data);
        setIsEditing(false);
      })
      .catch(err => console.error("Failed to save profile:", err));
  };

  const isProfileEmpty = !mockStudent.phoneNumber && !mockStudent.shortBio && mockStudent.name === 'New Student';

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* Empty Profile Alert Banner */}
      {isProfileEmpty && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-850 text-xs font-bold rounded-2xl flex items-center justify-between gap-4 animate-pulse">
          <span>⚠️ Please complete your profile details below to register correctly in the institutional registry.</span>
          <button 
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg cursor-pointer transition-colors"
          >
            Setup Profile Now
          </button>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden bg-white border-[#A7C7DD]">
        <div className="relative group shrink-0 z-10">
          {profile.avatar ? (
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="w-24 h-24 rounded-3xl object-cover shadow-md border border-[#A7C7DD]/50" 
            />
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-[#0A4174] text-white font-black text-3xl flex items-center justify-center shadow-md border border-[#A7C7DD]/40">
              {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST'}
            </div>
          )}
          
          <label className="absolute inset-0 bg-black/60 rounded-3xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white text-[10px] font-bold">
            <Camera className="w-5 h-5 mb-1" />
            {photoUploading ? 'Uploading...' : 'Change Photo'}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </label>
        </div>

        <div className="space-y-3 flex-1 text-center sm:text-left relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight text-[#001D39]">{profile.name}</h2>
              <p className="text-xs text-[#4E8EA2] font-bold mt-1">{profile.course || 'B.Tech CSE (General)'}</p>
              <p className="text-[10px] text-slate-500 font-mono tracking-wide mt-0.5">{profile.department} • Roll No: {profile.rollNo}</p>
            </div>
            
            <button 
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 border rounded-xl border-[#A7C7DD] hover:bg-[#BDD8E9]/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 text-[#0A4174] self-center sm:self-auto shadow-sm"
            >
              <Edit className="w-3.5 h-3.5 text-[#0A4174]" />
              Edit Profile
            </button>
          </div>

          <p className="text-xs sm:text-sm font-semibold max-w-xl leading-relaxed text-slate-650">
            {profile.shortBio || 'No student summary available. Click edit profile to add details about your academic focus areas.'}
          </p>

          <div className="pt-2 flex flex-wrap justify-center sm:justify-start gap-2">
            <span className="text-[10px] font-bold px-3 py-1.5 rounded-full border bg-[#BDD8E9]/20 text-[#0A4174] border-[#A7C7DD]/40">
              GPA: {mockStudent.cgpa} Cumulative
            </span>
            <span className="text-[10px] font-bold px-3 py-1.5 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-100">
              Attendance: {mockStudent.attendanceOverall}%
            </span>
            <span className="text-[10px] font-bold px-3 py-1.5 rounded-full border bg-[#BDD8E9]/20 text-[#0A4174] border-[#A7C7DD]/40">
              Credits: {mockStudent.totalCredits} Completed
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSave} className="w-full max-w-2xl border rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[95vh] overflow-y-auto bg-white border-[#A7C7DD] text-slate-800">
            <div className="flex justify-between items-center border-b border-[#A7C7DD]/60 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#001D39]">Setup Student Profile</h3>
                <p className="text-xs text-slate-500">Configure personal biodata registry metrics</p>
              </div>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Student Name</label>
                <input 
                  type="text" 
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full py-2.5 px-3 border border-[#A7C7DD] rounded-xl text-xs font-semibold outline-none focus:border-[#0A4174] bg-white text-[#001D39]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Roll Number</label>
                <input 
                  type="text" 
                  required
                  value={profile.rollNo}
                  onChange={(e) => setProfile({ ...profile, rollNo: e.target.value })}
                  className="w-full py-2.5 px-3 border border-[#A7C7DD] rounded-xl text-xs font-semibold outline-none focus:border-[#0A4174] bg-white text-[#001D39]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Course / Specification</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. B.Tech in CSE"
                  value={profile.course}
                  onChange={(e) => setProfile({ ...profile, course: e.target.value })}
                  className="w-full py-2.5 px-3 border border-[#A7C7DD] rounded-xl text-xs font-semibold outline-none focus:border-[#0A4174] bg-white text-[#001D39]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Contact Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. +91 98401 23456"
                  value={profile.phoneNumber}
                  onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                  className="w-full py-2.5 px-3 border border-[#A7C7DD] rounded-xl text-xs font-semibold outline-none focus:border-[#0A4174] bg-white text-[#001D39]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Linkedin Link</label>
                <input 
                  type="text" 
                  placeholder="https://linkedin.com/in/username"
                  value={profile.linkedinUrl}
                  onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                  className="w-full py-2.5 px-3 border border-[#A7C7DD] rounded-xl text-xs font-semibold outline-none focus:border-[#0A4174] bg-white text-[#001D39]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Github Link</label>
                <input 
                  type="text" 
                  placeholder="https://github.com/username"
                  value={profile.githubUrl}
                  onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                  className="w-full py-2.5 px-3 border border-[#A7C7DD] rounded-xl text-xs font-semibold outline-none focus:border-[#0A4174] bg-white text-[#001D39]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Portfolio Website</label>
                <input 
                  type="text" 
                  placeholder="https://username.dev"
                  value={profile.portfolioUrl}
                  onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                  className="w-full py-2.5 px-3 border border-[#A7C7DD] rounded-xl text-xs font-semibold outline-none focus:border-[#0A4174] bg-white text-[#001D39]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Profile Short Biography</label>
              <textarea 
                rows={2}
                placeholder="Brief summary of your academic focus and career interests..."
                value={profile.shortBio}
                onChange={(e) => setProfile({ ...profile, shortBio: e.target.value })}
                className="w-full py-2.5 px-3 border border-[#A7C7DD] rounded-xl text-xs font-semibold outline-none focus:border-[#0A4174] bg-white text-[#001D39]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Technical Core Skills (comma separated)</label>
              <input 
                type="text" 
                placeholder="e.g. React, Node.js, Python, SQL"
                value={profile.skills}
                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                className="w-full py-2.5 px-3 border border-[#A7C7DD] rounded-xl text-xs font-semibold outline-none focus:border-[#0A4174] bg-white text-[#001D39]"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-[#A7C7DD]/60">
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-[#A7C7DD] text-[#0A4174] font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-[#0A4174] hover:bg-[#002b52] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Profile Details Multi-Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Bio Data Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border p-6 rounded-3xl bg-white border-[#A7C7DD] shadow-sm space-y-6">
            <h3 className="text-base font-extrabold text-[#001D39] border-b border-[#A7C7DD]/60 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-[#0A4174]" /> Personal Registry Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Roll Identification</span>
                <p className="font-extrabold text-[#001D39]">{profile.rollNo}</p>
              </div>
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">University Email</span>
                <p className="font-extrabold text-[#001D39]">{mockStudent.email}</p>
              </div>
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Number</span>
                <p className="font-extrabold text-[#001D39]">{profile.phoneNumber || 'Not Configured'}</p>
              </div>
              <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Curriculum Course</span>
                <p className="font-extrabold text-[#001D39]">{profile.course}</p>
              </div>
            </div>

            {profile.skills && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Technical Competencies</span>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.split(',').map((sk, i) => (
                    <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-lg border bg-[#BDD8E9]/20 text-[#0A4174] border-[#A7C7DD]/35">
                      {sk.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Link Badges */}
            <div className="flex flex-wrap gap-3 pt-3 border-t border-[#A7C7DD]/40">
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#0A4174] hover:underline font-bold bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                  <Github className="w-3.5 h-3.5" /> Github
                </a>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#0A4174] hover:underline font-bold bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </a>
              )}
              {profile.portfolioUrl && (
                <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-[#0A4174] hover:underline font-bold bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                  <Globe className="w-3.5 h-3.5" /> Portfolio
                </a>
              )}
            </div>
          </div>

          {/* Bookmarked Materials */}
          <div className="border p-6 rounded-3xl bg-white border-[#A7C7DD] shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#001D39] border-b border-[#A7C7DD]/60 pb-3 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#0A4174]" /> Saved Repository Notes
            </h3>
            
            <div className="divide-y divide-[#A7C7DD]/30">
              {savedDocs.length > 0 ? (
                savedDocs.map(doc => (
                  <div key={doc.id} className="py-3 flex justify-between items-center group">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-[#001D39]">{doc.title}</h4>
                      <p className="text-[10px] text-slate-500 font-medium">{doc.subjectName} • {doc.fileSize}</p>
                    </div>
                    <a 
                      href={doc.fileUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="p-2 border border-slate-200 group-hover:border-[#A7C7DD] rounded-xl hover:bg-slate-50 text-slate-500 hover:text-[#0A4174]"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic py-4">No bookmarked library resources registered.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Clubs and Achievements */}
        <div className="space-y-6">
          {/* Achievements list */}
          <div className="border p-6 rounded-3xl bg-white border-[#A7C7DD] shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-[#001D39] border-b border-[#A7C7DD]/60 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#0A4174]" /> Honor Badges
            </h3>
            
            <div className="space-y-3">
              {achievementsList.map((ac, idx) => (
                <div key={idx} className="p-3 border border-slate-200/60 rounded-xl bg-slate-50/50 flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#BDD8E9]/20 text-[#0A4174] flex items-center justify-center shrink-0 border border-[#A7C7DD]/35">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-[#001D39] truncate">{ac.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{ac.issuer} • {ac.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enrolled Clubs */}
          <div className="border p-6 rounded-3xl bg-white border-[#A7C7DD] shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-[#001D39] border-b border-[#A7C7DD]/60 pb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0A4174]" /> Joined University Clubs
            </h3>

            <div className="space-y-3">
              {memberClubs.map(cl => (
                <div key={cl.id} className="flex items-center gap-3">
                  {cl.logo ? (
                    <img src={cl.logo} alt={cl.name} className="w-8 h-8 rounded-lg object-cover border border-slate-200" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold border border-slate-200">
                      {cl.name[0]}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-[#001D39]">{cl.name}</h4>
                    <span className="text-[9px] uppercase font-bold text-[#4E8EA2] block tracking-wide">{cl.role || 'Member'}</span>
                  </div>
                </div>
              ))}
              {memberClubs.length === 0 && (
                <p className="text-xs text-slate-500 italic py-2">No student club enlistments registered.</p>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

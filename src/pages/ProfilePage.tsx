import React from 'react';
import { Mail, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const profileUser = user || {
    name: 'Student',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    section: 'A',
    bio: 'Student bio',
    email: 'student@saranathan.ac.in',
    rollNumber: 'PENDING',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    cgpa: 0,
    attendancePct: 0
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Profile Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F8FAF8] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC] flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={profileUser.avatar}
          alt={profileUser.name}
          className="w-24 h-24 rounded-2xl object-cover border border-[#DDE5DD] dark:border-[#334155]"
        />

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-extrabold text-[#1F2937] dark:text-[#F8FAFC]">{profileUser.name}</h1>
              <p className="text-xs text-[#2E7D32] dark:text-[#4CAF50] font-bold mt-0.5">{profileUser.department}</p>
            </div>
            <span className="px-3.5 py-1 rounded-full bg-[#E8F5E9] dark:bg-[#1E293B] text-[#2E7D32] dark:text-[#81C784] font-bold text-xs border border-[#DDE5DD] dark:border-[#334155]">
              {profileUser.year} • {profileUser.section}
            </span>
          </div>

          <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] mt-3 font-medium leading-relaxed">
            {profileUser.bio}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#6B7280] dark:text-[#CBD5E1] font-medium">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" /> {profileUser.email}</span>
            <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-[#2E7D32] dark:text-[#4CAF50]" /> Roll: {profileUser.rollNumber}</span>
          </div>
        </div>
      </div>

      {/* Academic Milestones Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-center">
          <span className="text-xs text-[#6B7280] dark:text-[#CBD5E1] font-semibold uppercase">CGPA Grade</span>
          <span className="text-3xl font-extrabold text-[#2E7D32] dark:text-[#4CAF50] block mt-1">{profileUser.cgpa}</span>
          <span className="text-[11px] text-[#2E7D32] dark:text-[#81C784] font-bold mt-1 inline-block">Top 5% of Batch</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-center">
          <span className="text-xs text-[#6B7280] dark:text-[#CBD5E1] font-semibold uppercase">Overall Attendance</span>
          <span className="text-3xl font-extrabold text-[#2E7D32] dark:text-[#4CAF50] block mt-1">{profileUser.attendancePct}%</span>
          <span className="text-[11px] text-[#6B7280] dark:text-[#CBD5E1] font-medium mt-1 inline-block">University Compliant</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-center">
          <span className="text-xs text-[#6B7280] dark:text-[#CBD5E1] font-semibold uppercase">Earned Credits</span>
          <span className="text-3xl font-extrabold text-[#2E7D32] dark:text-[#4CAF50] block mt-1">114</span>
          <span className="text-[11px] text-[#6B7280] dark:text-[#CBD5E1] font-medium mt-1 inline-block">Out of 160 required</span>
        </div>
      </div>

    </div>
  );
};

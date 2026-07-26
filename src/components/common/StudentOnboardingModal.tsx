import React, { useState } from 'react';
import { X, CheckCircle2, User, GraduationCap, DollarSign, Brain, Heart, Star, Sparkles, Send, ArrowRight, ArrowLeft, Lock, ShieldCheck, Check } from 'lucide-react';
import { StudentProfile } from '../../types';
import { apiService } from '../../services/apiService';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AVAILABLE_SKILLS = [
  'C Programming', 'Python', 'Java', 'HTML', 'CSS', 'JavaScript', 
  'React', 'Node.js', 'SQL', 'MS Office', 'Canva', 'Figma', 'Beginner', 
  'AutoCAD', 'SolidWorks', 'MATLAB'
];

const AVAILABLE_AREAS_OF_INTEREST = [
  'Artificial Intelligence', 'Web Development', 'Mobile App Development', 
  'Cyber Security', 'Data Science', 'UI/UX', 'Cloud Computing', 'Robotics', 
  'IoT', 'Electronics', 'Competitive Programming', 'Entrepreneurship', 
  'Public Speaking', 'Content Creation', 'Photography', 'Sports', 
  'Cultural Activities', 'Music', 'Dance', 'NSS', 'NCC'
];

const CAMPUS_INTEREST_CARDS = [
  { id: 'Clubs', name: 'Clubs', desc: 'Join student societies & technical cells.' },
  { id: 'Technical Events', name: 'Technical Events', desc: 'Participate in symposiums & paper presentations.' },
  { id: 'Coding Competitions', name: 'Coding Competitions', desc: 'Speed coding & algorithmic challenges.' },
  { id: 'Hackathons', name: 'Hackathons', desc: '24-hour product build marathons & ideation.' },
  { id: 'Workshops', name: 'Workshops', desc: 'Hands-on technical training & bootcamps.' },
  { id: 'Sports', name: 'Sports', desc: 'Inter-college & intra-college athletic tournaments.' },
  { id: 'Cultural Events', name: 'Cultural Events', desc: 'Music, dance & drama festivals.' },
  { id: 'Seminars', name: 'Seminars', desc: 'Industry & academic expert lectures.' },
  { id: 'Guest Lectures', name: 'Guest Lectures', desc: 'Keynote talks from global researchers.' },
  { id: 'NSS Activities', name: 'NSS Activities', desc: 'National Service Scheme community outreach.' },
  { id: 'NCC Activities', name: 'NCC Activities', desc: 'National Cadet Corps military training.' },
  { id: 'Innovation & Startup Cell', name: 'Innovation & Startup Cell', desc: 'Incubation & business ideation.' }
];

export const StudentOnboardingModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { addNotification } = useNotifications();
  const { completeOnboarding, user } = useAuth();
  
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Form State
  const [form, setForm] = useState<Partial<StudentProfile>>({
    full_name: user?.name || 'Astrabyte Student',
    college_email: user?.email || 'astrabyte@gmail.com',
    phone_number: '+91 98401 23456',
    gender: 'Male',
    dob: '2004-05-14',
    address: 'Trichy, Tamil Nadu',
    
    // Read only academic fields from college database
    register_number: '21CS8042',
    department: 'Computer Science & Engineering',
    batch: '2022-2026',
    year: '3rd Year',
    semester: 6,
    section: 'B',
    
    parent_name: 'R. Murugan',
    parent_occupation: 'Senior Accountant',
    family_income: '₹3.5 Lakhs',
    first_graduate: true,
    scholarship_required: true,
    
    current_skills: ['Python', 'JavaScript', 'HTML', 'C Programming'],
    areas_of_interest: ['Artificial Intelligence', 'Web Development', 'Competitive Programming'],
    campus_interests: ['Hackathons', 'Coding Competitions', 'Clubs', 'Technical Events'],
    
    communication_skills: true,
    teamwork: true,
    leadership: true,
    problem_solving: true,
    confidence_level: 'High',
    
    reason_for_department: 'Strong passion for computer science algorithms and full-stack software development.',
    excited_to_learn: 'Agentic AI frameworks, machine learning models, and cloud microservices.',
    new_skill_first_year: 'Full Stack React & Python Microservices'
  });

  if (!isOpen) return null;

  const toggleArrayItem = (field: 'current_skills' | 'areas_of_interest' | 'campus_interests', item: string) => {
    const list = form[field] || [];
    if (list.includes(item)) {
      setForm({ ...form, [field]: list.filter((i) => i !== item) });
    } else {
      setForm({ ...form, [field]: [...list, item] });
    }
  };

  const handleNext = () => {
    if (step < 8) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.createStudentProfile({
        ...form,
        profile_completed: true
      });
      
      setSubmitted(true);
      completeOnboarding();

      addNotification(
        `🎉 Onboarding Completed!`,
        `Welcome ${form.full_name}! Your student profile has been registered permanently.`,
        'Academic'
      );

      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      alert(`Error submitting student profile: ${err?.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const progressPct = Math.round((step / 8) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
        
        {/* Header & Progress Bar */}
        <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white font-black flex items-center justify-center text-base shadow-md">
                🎓
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">First-Time Student Onboarding</h2>
                <p className="text-xs text-slate-500 font-medium">Step {step} of 8 — Required Permanent Database Registration</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-400">
              {progressPct}% Completed
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center text-3xl font-black">
              ✓
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Onboarding Complete & Saved!</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your profile data is stored permanently in the SSE FESTA Student Database. Redirecting to your personalized Student Dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* STEP 1: Personal Information */}
            {step === 1 && (
              <div className="space-y-4 text-xs animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                  <User className="w-4 h-4 text-emerald-500" /> Step 1: Personal Information
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.full_name || ''}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      College Email <Lock className="w-3 h-3 text-amber-400" /> (Read Only)
                    </label>
                    <input
                      type="email"
                      readOnly
                      value={form.college_email || ''}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-400 font-medium cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98401 23456"
                      value={form.phone_number || ''}
                      onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Gender</label>
                    <select
                      value={form.gender || 'Male'}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Date of Birth</label>
                    <input
                      type="date"
                      value={form.dob || ''}
                      onChange={(e) => setForm({ ...form, dob: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Residential Address</label>
                    <textarea
                      rows={2}
                      value={form.address || ''}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Academic Information (Read Only from College DB) */}
            {step === 2 && (
              <div className="space-y-4 text-xs animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                    <GraduationCap className="w-4 h-4 text-emerald-500" /> Step 2: Academic Information
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified College Database Records
                  </span>
                </div>

                <p className="text-slate-400 text-[11px]">
                  These academic records were automatically fetched from Saranathan College of Engineering Registry DB.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Register Number</span>
                    <p className="font-mono text-sm font-black text-emerald-400">{form.register_number}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Department</span>
                    <p className="font-extrabold text-slate-900 dark:text-white">{form.department}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Batch</span>
                    <p className="font-extrabold text-slate-900 dark:text-white">{form.batch}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Year</span>
                    <p className="font-extrabold text-slate-900 dark:text-white">{form.year}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Semester</span>
                    <p className="font-extrabold text-slate-900 dark:text-white">Semester {form.semester}</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Section</span>
                    <p className="font-extrabold text-slate-900 dark:text-white">Section {form.section}</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Economic Information */}
            {step === 3 && (
              <div className="space-y-4 text-xs animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" /> Step 3: Economic Information & Financial Aid
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Parent / Guardian Name</label>
                    <input
                      type="text"
                      value={form.parent_name || ''}
                      onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Parent Occupation</label>
                    <input
                      type="text"
                      value={form.parent_occupation || ''}
                      onChange={(e) => setForm({ ...form, parent_occupation: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Annual Family Income</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹3.5 Lakhs"
                      value={form.family_income || ''}
                      onChange={(e) => setForm({ ...form, family_income: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">First Graduate in Family?</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, first_graduate: true })}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold ${form.first_graduate ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, first_graduate: false })}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold ${!form.first_graduate ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-3">
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">Scholarship Required?</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, scholarship_required: true })}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold ${form.scholarship_required ? 'bg-amber-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, scholarship_required: false })}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold ${!form.scholarship_required ? 'bg-amber-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Current Skills */}
            {step === 4 && (
              <div className="space-y-4 text-xs animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Brain className="w-4 h-4 text-indigo-400" /> Step 4: Current Technical & Software Skills
                </div>

                <p className="text-slate-400 text-[11px]">
                  Select all programming languages, tools, and technical skills you currently possess:
                </p>

                <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  {AVAILABLE_SKILLS.map((sk) => {
                    const selected = (form.current_skills || []).includes(sk);
                    return (
                      <button
                        key={sk}
                        type="button"
                        onClick={() => toggleArrayItem('current_skills', sk)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          selected
                            ? 'bg-emerald-600 text-white shadow-md scale-105'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                        }`}
                      >
                        {selected ? <Check className="w-3.5 h-3.5" /> : '+'} {sk}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: Areas of Interest */}
            {step === 5 && (
              <div className="space-y-4 text-xs animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Heart className="w-4 h-4 text-rose-500" /> Step 5: Professional & Technical Areas of Interest
                </div>

                <p className="text-slate-400 text-[11px]">
                  Choose domains you want to specialize in or explore during your studies:
                </p>

                <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  {AVAILABLE_AREAS_OF_INTEREST.map((aoi) => {
                    const selected = (form.areas_of_interest || []).includes(aoi);
                    return (
                      <button
                        key={aoi}
                        type="button"
                        onClick={() => toggleArrayItem('areas_of_interest', aoi)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          selected
                            ? 'bg-indigo-600 text-white shadow-md scale-105'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                        }`}
                      >
                        {selected ? <Check className="w-3.5 h-3.5" /> : '+'} {aoi}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 6: Campus Interests (Clickable Cards) */}
            {step === 6 && (
              <div className="space-y-4 text-xs animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Star className="w-4 h-4 text-amber-400" /> Step 6: Campus Activities & Interest Cards
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-72 overflow-y-auto pr-1">
                  {CAMPUS_INTEREST_CARDS.map((card) => {
                    const selected = (form.campus_interests || []).includes(card.name);
                    return (
                      <div
                        key={card.id}
                        onClick={() => toggleArrayItem('campus_interests', card.name)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          selected
                            ? 'bg-emerald-500/10 border-emerald-500 text-slate-900 dark:text-white shadow-md'
                            : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">{card.name}</h4>
                            {selected && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-snug">{card.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 7: Self Assessment */}
            {step === 7 && (
              <div className="space-y-4 text-xs animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Step 7: Self Assessment
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'communication_skills', label: 'Communication Skills' },
                    { key: 'teamwork', label: 'Teamwork & Collaboration' },
                    { key: 'leadership', label: 'Leadership Qualities' },
                    { key: 'problem_solving', label: 'Problem Solving Ability' }
                  ].map((item) => (
                    <div key={item.key} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, [item.key]: true })}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold ${form[item.key as keyof StudentProfile] ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, [item.key]: false })}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold ${!form[item.key as keyof StudentProfile] ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Confidence Level</span>
                    <select
                      value={form.confidence_level || 'Medium'}
                      onChange={(e) => setForm({ ...form, confidence_level: e.target.value as any })}
                      className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: Short Personal Questions */}
            {step === 8 && (
              <div className="space-y-4 text-xs animate-in fade-in">
                <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                  <Send className="w-4 h-4 text-emerald-400" /> Step 8: Personal Questions & College Goals
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">1. Why did you choose this department?</label>
                    <textarea
                      rows={2}
                      value={form.reason_for_department || ''}
                      onChange={(e) => setForm({ ...form, reason_for_department: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      placeholder="Share your interest in this degree..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">2. What are you most excited to learn in college?</label>
                    <textarea
                      rows={2}
                      value={form.excited_to_learn || ''}
                      onChange={(e) => setForm({ ...form, excited_to_learn: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      placeholder="e.g. Artificial Intelligence, Robotics, Product Design..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">3. Which new skill would you like to learn during your first year?</label>
                    <input
                      type="text"
                      value={form.new_skill_first_year || ''}
                      onChange={(e) => setForm({ ...form, new_skill_first_year: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                      placeholder="e.g. Full Stack Web Development, Public Speaking..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Controls Bar: Previous, Next, Save & Finish */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous Step
                </button>
              ) : <div />}

              {step < 8 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5"
                >
                  Next Step <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-black text-xs shadow-xl flex items-center gap-2"
                >
                  {loading ? 'Saving Profile...' : 'Save & Finish Onboarding'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>

          </form>
        )}

      </div>
    </div>
  );
};

export default StudentOnboardingModal;

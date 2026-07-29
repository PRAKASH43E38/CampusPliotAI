import React, { useState } from 'react';
import { Sparkles, Users, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

export const ClubMatcher: React.FC = () => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['AI/ML', 'Coding']);

  const interestsList = [
    'AI/ML', 'Coding', 'Robotics', 'Web Development', 'Music & Arts', 
    'Sports & Fitness', 'Entrepreneurship', 'E-Sports & Gaming', 'CyberSecurity', 'Literature'
  ];

  const clubs = [
    {
      id: 'c1',
      name: 'ACM Student Chapter & AI Collective',
      category: 'Technical',
      matchPercentage: 98,
      members: 450,
      lead: 'Alex Morgan (Vice Lead)',
      tags: ['AI/ML', 'Coding', 'Web Development', 'CyberSecurity'],
      description: 'Premier technical society organising HackCampus 2026, competitive coding bootcamps, and AI agent workshops.',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'c2',
      name: 'Steve Jobs Incubation & Startup Guild',
      category: 'Entrepreneurship',
      matchPercentage: 92,
      members: 280,
      lead: 'Dr. Michael Chang & Mentor Team',
      tags: ['Entrepreneurship', 'AI/ML'],
      description: 'Turn your hackathon projects into venture-backed startups with seed funding, IP legal assistance, and office space.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'c3',
      name: 'RoboVanguard Robotics & FPV Drone Club',
      category: 'Technical',
      matchPercentage: 85,
      members: 190,
      lead: 'Prof. Priya Venkatesh',
      tags: ['Robotics', 'Coding'],
      description: 'Design combat bots for RoboWars, autonomous obstacle drones, and ROS2 mechatronics systems.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'c4',
      name: 'Velocity E-Sports & Gaming Society',
      category: 'Gaming',
      matchPercentage: 78,
      members: 620,
      lead: 'Rohan Verma',
      tags: ['E-Sports & Gaming'],
      description: 'Inter-college Valorant, CS2, and FIFA tournaments with dedicated gaming rigs in Olympus Sports Complex.',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const toggleInterest = (tag: string) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredClubs = clubs.filter((c) =>
    c.tags.some((t) => selectedInterests.includes(t))
  );

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            AI Club & Event Matcher <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">Personalized</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Select your passions to let SCE FIESTA discover your perfect campus communities.
          </p>
        </div>
      </div>

      {/* Interest Selector Pills */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
          Select Your Interests
        </label>
        <div className="flex flex-wrap gap-2">
          {interestsList.map((tag) => {
            const isSelected = selectedInterests.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleInterest(tag)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Matched Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClubs.map((club) => (
          <div
            key={club.id}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-[#1F2937]">
                <img src={club.image} alt={club.name} className="w-full h-full object-cover opacity-90" />
                <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold text-[11px]">
                  <Sparkles className="w-3 h-3 inline mr-1" /> {club.matchPercentage}% Match
                </span>
                <span className="absolute bottom-2 left-2.5 text-xs text-white font-bold bg-[#1F2937]/80 px-2 py-0.5 rounded-md">
                  {club.category}
                </span>
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">{club.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {club.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {club.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-bold">{club.members} Members</span>
              </div>
              <button className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1">
                Join Guild <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

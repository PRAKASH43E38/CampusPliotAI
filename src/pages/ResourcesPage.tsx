import React, { useState } from 'react';
import { Search, Download, FileText, Star, Eye, Filter, BookOpen, Sparkles, Folder, CheckCircle2 } from 'lucide-react';
import { academicResources, OFFICIAL_DEPARTMENTS } from '../data/mockData';
import { AcademicResource } from '../types';

export const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<AcademicResource[]>(academicResources);
  const [selectedDept, setSelectedDept] = useState<string>('All Departments');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewResource, setPreviewResource] = useState<AcademicResource | null>(null);

  const resourceTypes = ['All', 'Notes', 'PYQ', 'Lab Manual', 'Cheatsheet'];

  const filteredResources = resources.filter((res) => {
    const matchesDept = selectedDept === 'All Departments' || res.department === selectedDept;
    const matchesType = selectedType === 'All' || res.type === selectedType;
    const matchesQuery = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesType && matchesQuery;
  });

  const handleDownload = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, downloads: r.downloads + 1 } : r))
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-slate-900 to-cyan-950/40 border border-indigo-500/30 text-white shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4" /> Academic Repository
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Resource Hub & Exam Prep Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Access verified professor notes, previous 5 years solved question papers (PYQs), lab manuals, and interview cheatsheets organized department-wise.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shrink-0">
          <span className="text-2xl font-black text-cyan-400">56 Materials</span>
          <span className="block text-[10px] text-slate-400 font-semibold uppercase">Across 7 Departments</span>
        </div>
      </div>

      {/* Department Selector & Type Filter Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notes, PYQs, subjects or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium">Type:</span>
            {resourceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  selectedType === type
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Department Pills Scrollbar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 dark:border-slate-800 pt-3">
          {OFFICIAL_DEPARTMENTS.map((dept) => {
            const count = dept === 'All Departments'
              ? resources.length
              : resources.filter(r => r.department === dept).length;
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
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-extrabold text-xs">
                  {res.type}
                </span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {res.rating}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug group-hover:text-indigo-500 transition-colors">
                {res.title}
              </h3>
              
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                {res.department} • Semester {res.semester}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Subject: {res.subject} • By {res.author}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {res.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">{res.fileSize} • {res.format} • {res.downloads} downloads</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewResource(res)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button
                  onClick={() => handleDownload(res.id)}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Get File
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Document Preview</h3>
              <button onClick={() => setPreviewResource(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <h4 className="font-bold text-sm text-slate-900 dark:text-white">{previewResource.title}</h4>
            <p className="text-xs text-indigo-500 font-bold">{previewResource.department} • {previewResource.subject}</p>

            <div className="p-6 rounded-2xl bg-slate-900 text-slate-200 text-xs font-mono border border-slate-800 space-y-2 max-h-48 overflow-y-auto">
              <p className="text-cyan-400">// Official {previewResource.department} Repository</p>
              <p>1. Complete Core Concepts & Formula Proofs</p>
              <p>2. Last 5 Years Solved End-Semester Exam Questions</p>
              <p>3. Departmental Faculty Verified Marking Key...</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">{previewResource.fileSize} • {previewResource.format}</span>
              <button
                onClick={() => {
                  handleDownload(previewResource.id);
                  setPreviewResource(null);
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
              >
                Download PDF Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Search, Download, Star, Eye, Sparkles } from 'lucide-react';
import { academicResources, OFFICIAL_DEPARTMENTS } from '../data/staticData';
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#F8FAF8] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Sparkles className="w-4 h-4" /> Academic Repository
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-[#F8FAFC] tracking-tight">
            Resource Hub & Exam Prep Vault
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#CBD5E1] mt-1 max-w-xl">
            Access verified professor notes, previous 5 years solved question papers (PYQs), lab manuals, and interview cheatsheets.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-center shrink-0">
          <span className="text-2xl font-extrabold text-[#2E7D32] dark:text-[#4CAF50]">56 Materials</span>
          <span className="block text-[10px] text-[#6B7280] dark:text-[#CBD5E1] font-semibold uppercase">Across Departments</span>
        </div>
      </div>

      {/* Department Selector & Type Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] dark:text-[#CBD5E1]" />
            <input
              type="text"
              placeholder="Search notes, PYQs, subjects or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] rounded-xl text-xs sm:text-sm text-[#1F2937] dark:text-[#F8FAFC] focus:border-[#2E7D32] dark:focus:border-[#4CAF50] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#6B7280] dark:text-[#CBD5E1]">Type:</span>
            {resourceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border-none ${
                  selectedType === type
                    ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold'
                    : 'bg-white dark:bg-[#162033] text-[#6B7280] dark:text-[#CBD5E1] border border-[#DDE5DD] dark:border-[#334155]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Department Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-[#E5E7EB] dark:border-[#475569] pt-3">
          {OFFICIAL_DEPARTMENTS.map((dept) => {
            const count = dept === 'All Departments'
              ? resources.length
              : resources.filter(r => r.department === dept).length;
            const isSelected = selectedDept === dept;

            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer border-none ${
                  isSelected
                    ? 'bg-[#2E7D32] dark:bg-[#4CAF50] text-white font-bold'
                    : 'bg-white dark:bg-[#162033] text-[#6B7280] dark:text-[#CBD5E1] border border-[#DDE5DD] dark:border-[#334155]'
                }`}
              >
                <span>{dept}</span>
                <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-[#E5E7EB] dark:bg-[#334155] text-[#6B7280] dark:text-[#CBD5E1]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="p-5 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#475569] pb-3 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] dark:bg-[#162033] text-[#2E7D32] dark:text-[#81C784] font-bold text-xs">
                  {res.type}
                </span>
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500" /> {res.rating}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-[#1F2937] dark:text-[#F8FAFC]">
                {res.title}
              </h3>
              
              <p className="text-xs text-[#2E7D32] dark:text-[#4CAF50] font-bold mt-1">
                {res.department} • Semester {res.semester}
              </p>
              <p className="text-[11px] text-[#6B7280] dark:text-[#CBD5E1] mt-0.5">Subject: {res.subject} • By {res.author}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {res.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-[#162033] text-[#6B7280] dark:text-[#CBD5E1] font-semibold border border-[#DDE5DD] dark:border-[#334155]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E7EB] dark:border-[#475569] flex items-center justify-between text-xs">
              <span className="text-[#6B7280] dark:text-[#CBD5E1]">{res.fileSize} • {res.format} • {res.downloads} downloads</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewResource(res)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-xs font-semibold text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button
                  onClick={() => handleDownload(res.id)}
                  className="px-4 py-1.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs flex items-center gap-1 cursor-pointer border-none"
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
        <div className="fixed inset-0 z-50 bg-slate-900/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] rounded-2xl p-6 max-w-lg w-full shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#475569] pb-3">
              <h3 className="font-extrabold text-base text-[#1F2937] dark:text-[#F8FAFC]">Document Preview</h3>
              <button onClick={() => setPreviewResource(null)} className="text-[#6B7280] border-none bg-transparent cursor-pointer">✕</button>
            </div>

            <h4 className="font-bold text-sm text-[#1F2937] dark:text-[#F8FAFC]">{previewResource.title}</h4>
            <p className="text-xs text-[#2E7D32] dark:text-[#4CAF50] font-bold">{previewResource.department} • {previewResource.subject}</p>

            <div className="p-4 rounded-xl bg-[#F4F8F4] dark:bg-[#162033] text-[#1F2937] dark:text-[#F8FAFC] text-xs font-mono border border-[#DDE5DD] dark:border-[#334155] space-y-2 max-h-48 overflow-y-auto">
              <p className="text-[#2E7D32] dark:text-[#4CAF50]">// Official {previewResource.department} Repository</p>
              <p>1. Complete Core Concepts & Formula Proofs</p>
              <p>2. Last 5 Years Solved End-Semester Exam Questions</p>
              <p>3. Departmental Faculty Verified Marking Key...</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#6B7280] dark:text-[#CBD5E1]">{previewResource.fileSize} • {previewResource.format}</span>
              <button
                onClick={() => {
                  handleDownload(previewResource.id);
                  setPreviewResource(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white font-bold text-xs border-none cursor-pointer"
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

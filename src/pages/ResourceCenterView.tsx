/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { mockResources, mockStudent } from '../data/mockData';
import { Search, FileDown, BookOpen, Clock, Download, Check, Save } from 'lucide-react';

interface ResourceCenterViewProps {
  isDark?: boolean;
}

export default function ResourceCenterView({ isDark = false }: ResourceCenterViewProps) {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<string>('All');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>(mockStudent.savedResources || []);

  const handleDownloadSimulation = (id: string) => {
    if (downloadedIds.includes(id) || downloadingId) return;

    setDownloadingId(id);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadedIds(d => [...d, id]);
          setDownloadingId(null);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleSaveToggle = (id: string) => {
    fetch('/api/resources/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Student-Id': mockStudent.id || 'st-0982'
      },
      body: JSON.stringify({ resourceId: id })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        if (savedIds.includes(id)) {
          setSavedIds(prev => prev.filter(savedId => savedId !== id));
          mockStudent.savedResources = mockStudent.savedResources.filter(rid => rid !== id);
        } else {
          setSavedIds(prev => [...prev, id]);
          if (!mockStudent.savedResources.includes(id)) {
            mockStudent.savedResources.push(id);
          }
        }
      }
    })
    .catch(err => {
      console.error("Failed to save resource bookmark:", err);
    });
  };

  const filteredResources = mockResources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase()) ||
                          res.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
                          res.subjectName.toLowerCase().includes(search.toLowerCase());

    const matchesType = activeType === 'All' || res.type === activeType;

    return matchesSearch && matchesType;
  });

  const types = ['All', 'notes', 'pyq', 'manual', 'book'];

  return (
    <div className="space-y-8 pb-12 font-sans transition-colors duration-300">
      {/* Banner Introduction */}
      <div className={`border p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors duration-300 ${
        isDark ? 'bg-[#0d0e11] border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        <div>
          <h2 className={`text-xl font-extrabold ${isDark ? 'text-slate-100' : 'text-slate-955'}`}>Curated Resource Center</h2>
          <p className="text-xs text-slate-500 mt-1">
            Download certified previous year question papers, lab manuals, syllabus regulations, and lecture notes.
          </p>
        </div>

        <span className={`text-xs font-bold border px-3.5 py-1.5 rounded-xl shrink-0 ${
          isDark 
            ? 'bg-blue-950/20 text-blue-400 border-blue-900/30' 
            : 'bg-blue-50 text-blue-755 border-blue-100'
        }`}>
          Curated CSE Repo: V Semester
        </span>
      </div>

      {/* Search and type filters panel */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-450">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by syllabus title, course code, or instructor name..."
            className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all outline-none font-medium shadow-sm ${
              isDark 
                ? 'bg-slate-905 border-slate-800 focus:border-blue-500 text-slate-100 placeholder-slate-550' 
                : 'bg-white border-slate-200 focus:border-blue-500 text-slate-850 placeholder-slate-400'
            }`}
          />
        </div>

        <div className="flex overflow-x-auto gap-1.5 scrollbar-none">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap border cursor-pointer ${
                activeType === t
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                  : isDark 
                    ? 'bg-[#0d0e11] border-slate-800 text-slate-300 hover:text-white' 
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-950'
              }`}
              id={`resource-type-filter-${t}`}
            >
              {t === 'All' ? 'All Formats' : t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map(res => {
          const isDownloading = downloadingId === res.id;
          const isDownloaded = downloadedIds.includes(res.id);
          const isSaved = savedIds.includes(res.id);

          return (
            <div 
              key={res.id}
              className={`border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4 ${
                isDark 
                  ? 'bg-[#0d0e11] border-slate-800 hover:border-slate-700 shadow-none' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
              id={`resource-card-${res.id}`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className={`text-[9px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    res.type === 'pyq'
                      ? (isDark ? 'bg-rose-950/20 text-rose-400 border-rose-900/30' : 'bg-rose-50 text-rose-700 border-rose-100')
                      : res.type === 'notes'
                      ? (isDark ? 'bg-blue-950/20 text-blue-400 border-blue-900/30' : 'bg-blue-50 text-blue-700 border-blue-100')
                      : (isDark ? 'bg-indigo-950/20 text-indigo-400 border-indigo-900/30' : 'bg-indigo-50 text-indigo-700 border-indigo-100')
                  }`}>
                    {res.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 font-bold">{res.fileSize}</span>
                </div>

                <div>
                  <h3 className={`font-extrabold text-sm sm:text-base leading-snug ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{res.title}</h3>
                  <p className="text-[10px] text-slate-500 font-mono tracking-wide mt-1">Course: {res.subjectName} ({res.subjectCode})</p>
                </div>

                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                  <span>Semester V</span>
                  <span>•</span>
                  <span>Uploaded by: {res.addedBy}</span>
                </div>
              </div>

              {/* Progress Bar simulation */}
              {isDownloading && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[10px] font-mono font-bold text-blue-500">
                    <span>Downloading Resource Package...</span>
                    <span>{downloadProgress}%</span>
                  </div>
                  <div className={`w-full h-2.5 rounded-full overflow-hidden border ${isDark ? 'bg-slate-900 border-slate-850' : 'bg-slate-100 border-slate-200/50'}`}>
                    <div 
                      className="bg-blue-600 h-full transition-all duration-200" 
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions panel row */}
              <div className={`pt-4 border-t flex items-center justify-between gap-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  onClick={() => handleSaveToggle(res.id)}
                  className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    isSaved
                      ? isDark 
                        ? 'bg-indigo-950/20 border border-indigo-900/30 text-indigo-400' 
                        : 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                      : isDark 
                        ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200' 
                        : 'bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700'
                  }`}
                  id={`save-resource-button-${res.id}`}
                >
                  <Save className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-550 text-indigo-550' : 'text-slate-400'}`} />
                  {isSaved ? 'Saved in Profile' : 'Save Bookmark'}
                </button>

                <button
                  onClick={() => handleDownloadSimulation(res.id)}
                  disabled={isDownloading || isDownloaded}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    isDownloaded
                      ? isDark 
                        ? 'bg-green-950/20 border border-green-900/30 text-green-400' 
                        : 'bg-green-50 border border-green-200 text-green-700'
                      : isDownloading
                      ? isDark 
                        ? 'bg-blue-950/20 text-blue-400 cursor-not-allowed border border-blue-900/30' 
                        : 'bg-blue-50 text-blue-600 cursor-not-allowed border border-blue-100'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  }`}
                  id={`download-resource-button-${res.id}`}
                >
                  {isDownloaded ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-550" />
                      Downloaded
                    </>
                  ) : isDownloading ? (
                    'Processing...'
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </>
                  )}
                </button>
              </div>
            </div>
          )})}
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  FileDown, 
  BookOpen, 
  Download, 
  Check, 
  Save, 
  Trash2, 
  Edit, 
  Upload, 
  FileText, 
  X, 
  BarChart, 
  AlertCircle, 
  UploadCloud 
} from 'lucide-react';
import { ResourceItem } from '../types';
import { mockStudent } from '../data/mockData';

interface ResourceCenterViewProps {
  isDark?: boolean;
  userRole?: 'STUDENT' | 'ADMIN';
}

export default function ResourceCenterView({ isDark = false, userRole = 'STUDENT' }: ResourceCenterViewProps) {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter states
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<string>('All');
  
  // Download simulation states
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>(mockStudent.savedResources || []);

  // Admin Panel states
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);
  
  // Drag & drop file state
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [uploadingProgress, setUploadingProgress] = useState<number | null>(null);

  // Details Form states
  const [formDetails, setFormDetails] = useState({
    title: '',
    department: 'Computer Science & Engineering',
    semester: 5,
    subjectCode: '',
    subjectName: '',
    description: '',
    type: 'notes' as 'notes' | 'pyq' | 'syllabus' | 'book' | 'manual',
    tags: '',
    fileUrl: ''
  });

  // ----------------------------------------------------
  // LOAD DATA
  // ----------------------------------------------------
  const fetchResources = () => {
    setLoading(true);
    fetch('/api/resources')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setResources(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load resources:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // ----------------------------------------------------
  // DOWNLOAD SIMULATION
  // ----------------------------------------------------
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

  // ----------------------------------------------------
  // FILE SELECTION & DROP HANDLERS
  // ----------------------------------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
  };

  // ----------------------------------------------------
  // CREATE / EDIT SUBMISSIONS
  // ----------------------------------------------------
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDetails.title || !formDetails.subjectCode || !formDetails.subjectName) {
      alert("Please fill in all mandatory details.");
      return;
    }

    setUploadingProgress(0);

    // Simulate Supabase Storage Upload connection progress
    const interval = setInterval(() => {
      setUploadingProgress(prev => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          
          // Generate a public URL from Supabase Storage mockup
          const simulatedPublicUrl = `https://supabase.co/storage/v1/object/public/resources/${formDetails.subjectCode.toLowerCase()}_${Date.now()}.pdf`;
          
          const payload = {
            ...formDetails,
            fileSize: selectedFile ? selectedFile.size : '2.4 MB',
            fileUrl: simulatedPublicUrl
          };

          const endpoint = editingResource 
            ? `/api/admin/resources/${editingResource.id}` 
            : '/api/resources';
          const method = editingResource ? 'PUT' : 'POST';

          fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setUploadingProgress(null);
              setSelectedFile(null);
              setEditingResource(null);
              setShowUploadForm(false);
              setFormDetails({
                title: '', department: 'Computer Science & Engineering', semester: 5,
                subjectCode: '', subjectName: '', description: '', type: 'notes', tags: '', fileUrl: ''
              });
              fetchResources();
            }
          })
          .catch(err => {
            console.error("Save failure:", err);
            setUploadingProgress(null);
          });

          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const handleEditClick = (res: ResourceItem) => {
    setEditingResource(res);
    setFormDetails({
      title: res.title,
      department: res.department || 'Computer Science & Engineering',
      semester: res.semester,
      subjectCode: res.subjectCode,
      subjectName: res.subjectName,
      description: res.description || '',
      type: res.type,
      tags: res.tags || '',
      fileUrl: res.fileUrl || ''
    });
    setSelectedFile({ name: `${res.title}.pdf`, size: res.fileSize });
    setShowUploadForm(true);
  };

  const handleDeleteClick = (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this resource file from the university database?")) return;
    fetch(`/api/admin/resources/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchResources();
        }
      })
      .catch(err => console.error("Deletion error:", err));
  };

  // ----------------------------------------------------
  // FILTERING LOGIC
  // ----------------------------------------------------
  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase()) ||
                          res.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
                          res.subjectName.toLowerCase().includes(search.toLowerCase());

    const matchesType = activeType === 'All' || res.type === activeType;

    return matchesSearch && matchesType;
  });

  const types = ['All', 'notes', 'pyq', 'manual', 'book'];

  return (
    <div className="space-y-8 pb-16 font-sans transition-colors duration-300">
      
      {/* ----------------------------------------------------
          PORTAL HEADER BANNER
          ---------------------------------------------------- */}
      <div className={`border p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors duration-300 ${
        isDark ? 'bg-[#202020] border-[#337418]' : 'bg-white border-slate-200'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#5DD62C]/10 text-[#5DD62C]">
              <FileDown className="w-5 h-5" stroke="#5DD62C" />
            </span>
            <h2 className="text-xl font-black tracking-tight text-[#F8F8F8]">
              Resource Repository Center
            </h2>
          </div>
          <p className="text-xs text-[#979DAB] leading-relaxed max-w-xl">
            Access official department syllabus regulations, lab manuals, certified previous year question papers, and professor lecture notes.
          </p>
        </div>

        {userRole === 'ADMIN' ? (
          <button
            onClick={() => {
              setEditingResource(null);
              setFormDetails({
                title: '', department: 'Computer Science & Engineering', semester: 5,
                subjectCode: '', subjectName: '', description: '', type: 'notes', tags: '', fileUrl: ''
              });
              setSelectedFile(null);
              setShowUploadForm(!showUploadForm);
            }}
            className="px-4 py-2.5 bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-[#F8F8F8] font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>{showUploadForm ? 'Close Manager' : 'Upload Resource'}</span>
          </button>
        ) : (
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-[#337418] text-[#F8F8F8] bg-[#202020]">
            Format: V Semester B.Tech
          </span>
        )}
      </div>

      {/* ----------------------------------------------------
          ADMIN VIEW: UPLOAD & STATISTICS PANEL
          ---------------------------------------------------- */}
      {userRole === 'ADMIN' && (
        <div className="space-y-8">
          {/* Admin Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Uploaded Resources', count: resources.length, detail: 'SQLite Database Entries' },
              { label: 'Total Curated Formats', count: `${resources.filter(r => r.type === 'notes').length} Notes, ${resources.filter(r => r.type === 'pyq').length} PYQs`, detail: 'Categorized Distribution' },
              { label: 'Repository Status', count: 'Active Sync', detail: 'Public Supabase Storage' }
            ].map((stat, i) => (
              <div key={i} className="p-6 border border-[#337418] rounded-3xl bg-[#202020] flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#979DAB] uppercase">{stat.label}</span>
                  <h4 className="text-xl font-black text-[#F8F8F8]">{stat.count}</h4>
                  <p className="text-[10px] text-[#337418] font-mono">{stat.detail}</p>
                </div>
                <span className="p-2 rounded-xl bg-[#337418]/15">
                  <BarChart className="w-5 h-5 text-[#5DD62C]" stroke="#5DD62C" />
                </span>
              </div>
            ))}
          </div>

          {/* Upload / Edit Form Drawer */}
          {showUploadForm && (
            <div className="p-6 border border-[#337418] rounded-3xl bg-[#202020] space-y-6 animate-fade-in">
              <div className="border-b border-[#337418] pb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-extrabold text-[#F8F8F8]">
                    {editingResource ? 'Edit Resource Metadata' : 'Upload Academic Resource File'}
                  </h3>
                  <p className="text-xs text-[#979DAB]">Upload to Supabase Storage and register metadata catalog</p>
                </div>
                <button onClick={() => setShowUploadForm(false)} className="p-1.5 hover:bg-[#337418]/20 rounded-xl text-[#F8F8F8]">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Drag and Drop Box */}
                <div className="lg:col-span-5 space-y-4">
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-[#337418] hover:border-[#5DD62C] transition-colors rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-3 bg-[#0F0F0F]/40 cursor-pointer relative"
                  >
                    <input
                      type="file"
                      id="resource-file-input"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-10 h-10 text-[#337418]" stroke="#337418" />
                    <div>
                      <p className="text-xs font-bold text-[#F8F8F8]">Drag & Drop Academic File Here</p>
                      <p className="text-[10px] text-[#979DAB] mt-0.5">Or browse folder files (PDF, ZIP, DOCX)</p>
                    </div>
                  </div>

                  {selectedFile && (
                    <div className="p-4 border border-[#337418] rounded-2xl bg-[#0F0F0F] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#5DD62C]" stroke="#5DD62C" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#F8F8F8] truncate">{selectedFile.name}</p>
                          <p className="text-[10px] text-[#979DAB] font-mono">{selectedFile.size}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-[#979DAB] hover:text-[#F8F8F8]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {uploadingProgress !== null && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono font-bold text-[#5DD62C]">
                        <span>Uploading to Supabase Storage...</span>
                        <span>{uploadingProgress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#0F0F0F] overflow-hidden border border-[#337418]">
                        <div 
                          className="bg-[#5DD62C] h-full transition-all duration-200" 
                          style={{ width: `${uploadingProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Form fields */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#979DAB] uppercase">Resource Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. DBMS Normalization Notes"
                        value={formDetails.title}
                        onChange={(e) => setFormDetails({ ...formDetails, title: e.target.value })}
                        className="w-full py-2 px-3 border border-[#337418] rounded-xl text-xs font-semibold bg-[#0F0F0F] text-[#F8F8F8] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#979DAB] uppercase">Department</label>
                      <select
                        value={formDetails.department}
                        onChange={(e) => setFormDetails({ ...formDetails, department: e.target.value })}
                        className="w-full py-2 px-3 border border-[#337418] rounded-xl text-xs font-semibold bg-[#0F0F0F] text-[#F8F8F8] outline-none"
                      >
                        {['Computer Science & Engineering', 'Electronics & Communication', 'Electrical & Electronics', 'Mechanical Engineering', 'Civil Engineering', 'MBA Studies'].map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#979DAB] uppercase">Semester (1-8)</label>
                      <input
                        type="number"
                        min={1}
                        max={8}
                        value={formDetails.semester}
                        onChange={(e) => setFormDetails({ ...formDetails, semester: parseInt(e.target.value) || 1 })}
                        className="w-full py-2 px-3 border border-[#337418] rounded-xl text-xs font-semibold bg-[#0F0F0F] text-[#F8F8F8] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#979DAB] uppercase">Subject Code</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CS301"
                        value={formDetails.subjectCode}
                        onChange={(e) => setFormDetails({ ...formDetails, subjectCode: e.target.value })}
                        className="w-full py-2 px-3 border border-[#337418] rounded-xl text-xs font-semibold bg-[#0F0F0F] text-[#F8F8F8] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#979DAB] uppercase">Subject Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Database Management"
                        value={formDetails.subjectName}
                        onChange={(e) => setFormDetails({ ...formDetails, subjectName: e.target.value })}
                        className="w-full py-2 px-3 border border-[#337418] rounded-xl text-xs font-semibold bg-[#0F0F0F] text-[#F8F8F8] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#979DAB] uppercase">File Type</label>
                      <select
                        value={formDetails.type}
                        onChange={(e) => setFormDetails({ ...formDetails, type: e.target.value as any })}
                        className="w-full py-2 px-3 border border-[#337418] rounded-xl text-xs font-semibold bg-[#0F0F0F] text-[#F8F8F8] outline-none"
                      >
                        <option value="notes">Lecture Notes</option>
                        <option value="pyq">Question Papers (PYQ)</option>
                        <option value="manual">Lab Manuals</option>
                        <option value="book">Reference Textbooks</option>
                        <option value="syllabus">Syllabus Guide</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#979DAB] uppercase">Tags (comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. sql, normalization, relational algebra"
                        value={formDetails.tags}
                        onChange={(e) => setFormDetails({ ...formDetails, tags: e.target.value })}
                        className="w-full py-2 px-3 border border-[#337418] rounded-xl text-xs font-semibold bg-[#0F0F0F] text-[#F8F8F8] outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#979DAB] uppercase">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Brief summary of the document contents..."
                      value={formDetails.description}
                      onChange={(e) => setFormDetails({ ...formDetails, description: e.target.value })}
                      className="w-full py-2 px-3 border border-[#337418] rounded-xl text-xs font-semibold bg-[#0F0F0F] text-[#F8F8F8] outline-none"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowUploadForm(false)}
                      className="px-4 py-2 bg-[#202020] border border-[#337418] text-[#F8F8F8] font-bold text-xs rounded-xl hover:bg-[#337418]/10 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploadingProgress !== null}
                      className="px-6 py-2 bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-[#F8F8F8] font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:bg-[#337418]/45"
                    >
                      {editingResource ? 'Save Details' : 'Upload Resource'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          STUDENT VIEW / FILTERING SEARCH CONTROLS
          ---------------------------------------------------- */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#979DAB]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            disabled={resources.length === 0}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={resources.length === 0 ? "Search is disabled until resources exist" : "Search by syllabus title, code, tags..."}
            className={`w-full pl-10 pr-4 py-3 border border-[#337418] rounded-xl text-sm transition-all outline-none bg-[#202020] text-[#F8F8F8] placeholder-[#979DAB] ${
              resources.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>

        <div className="flex overflow-x-auto gap-2 scrollbar-hide">
          {types.map(t => (
            <button
              key={t}
              disabled={resources.length === 0}
              onClick={() => setActiveType(t)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap border cursor-pointer ${
                resources.length === 0 
                  ? 'opacity-50 cursor-not-allowed border-[#337418] text-[#979DAB] bg-[#202020]' 
                  : activeType === t
                  ? 'bg-[#5DD62C] border-[#5DD62C] text-[#0F0F0F] shadow-sm'
                  : 'bg-[#202020] border-[#337418] text-[#F8F8F8] hover:bg-[#337418]/30'
              }`}
            >
              {t === 'All' ? 'ALL FORMATS' : t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------
          RESOURCES LISTING / EMPTY STATES
          ---------------------------------------------------- */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-[#5DD62C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-[#979DAB] font-bold font-mono">LOADING CURATED REPOSITORY...</p>
        </div>
      ) : resources.length === 0 ? (
        /* professional Empty State when no resources exist */
        <div className="border border-[#337418] rounded-3xl p-16 bg-[#202020] flex flex-col items-center justify-center text-center space-y-4 max-w-2xl mx-auto animate-fade-in shadow-lg">
          <div className="w-16 h-16 rounded-full bg-[#337418]/10 flex items-center justify-center text-[#5DD62C]">
            <BookOpen className="w-8 h-8 text-[#5DD62C]" stroke="#5DD62C" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#F8F8F8]">No study resources are available yet.</h3>
            <p className="text-xs text-[#979DAB] leading-relaxed max-w-sm">
              Resources will appear here once uploaded by the administrator. Check back soon for syllabi, guides, and manuals!
            </p>
          </div>
          {userRole === 'ADMIN' && (
            <button
              onClick={() => setShowUploadForm(true)}
              className="px-4 py-2 bg-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-[#F8F8F8] font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              Start Uploading Now
            </button>
          )}
        </div>
      ) : filteredResources.length === 0 ? (
        <p className="text-xs text-[#979DAB] text-center py-16 font-semibold">No resource matches your query filter search.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredResources.map(res => {
            const isDownloading = downloadingId === res.id;
            const isDownloaded = downloadedIds.includes(res.id);
            const isSaved = savedIds.includes(res.id);

            return (
              <div 
                key={res.id}
                className="border border-[#337418] rounded-3xl p-6 bg-[#202020] hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border border-[#337418] text-[#F8F8F8] bg-[#337418]/25">
                      {res.type}
                    </span>
                    <span className="text-[10px] font-mono text-[#979DAB] font-bold">{res.fileSize}</span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base leading-snug text-[#F8F8F8]">{res.title}</h3>
                    <p className="text-[10px] text-[#5DD62C] font-mono tracking-wide mt-1">Course: {res.subjectName} ({res.subjectCode})</p>
                    {res.description && (
                      <p className="text-xs text-[#979DAB] mt-2 bg-[#0F0F0F]/30 p-2.5 rounded-xl border border-[#337418]/50">{res.description}</p>
                    )}
                    {res.tags && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {res.tags.split(',').map((tag, i) => (
                          <span key={i} className="text-[8px] px-1.5 py-0.5 rounded bg-[#337418]/20 border border-[#337418]/30 text-[#979DAB] font-bold">
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-bold text-[#979DAB]">
                    <span>Sem {res.semester}</span>
                    <span>•</span>
                    <span>Department: {res.department || 'CSE'}</span>
                    <span>•</span>
                    <span>Uploaded by: {res.addedBy}</span>
                  </div>
                </div>

                {isDownloading && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[10px] font-mono font-bold text-[#5DD62C]">
                      <span>Downloading Resource Package...</span>
                      <span>{downloadProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#0F0F0F] overflow-hidden border border-[#337418]">
                      <div 
                        className="bg-[#5DD62C] h-full transition-all duration-200" 
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions Panel */}
                <div className="pt-4 border-t border-[#337418] flex items-center justify-between gap-4">
                  {userRole === 'ADMIN' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(res)}
                        className="p-2 border border-[#337418] rounded-xl hover:bg-[#337418]/20 text-[#5DD62C] transition-colors cursor-pointer"
                        title="Edit Resource"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#5DD62C]" stroke="#5DD62C" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(res.id)}
                        className="p-2 border border-[#337418] rounded-xl hover:bg-[#337418]/20 text-rose-505 transition-colors cursor-pointer"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-550" stroke="#ff4d4d" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSaveToggle(res.id)}
                      className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border ${
                        isSaved
                          ? 'bg-[#337418]/30 border-[#5DD62C] text-[#5DD62C]'
                          : 'bg-[#202020] border-[#337418] text-[#979DAB] hover:text-[#F8F8F8] hover:bg-[#337418]/20'
                      }`}
                    >
                      <Save className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#5DD62C] text-[#5DD62C]' : 'text-[#337418]'}`} />
                      <span>{isSaved ? 'Saved in Profile' : 'Save Bookmark'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDownloadSimulation(res.id)}
                    disabled={isDownloading || isDownloaded}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border ${
                      isDownloaded
                        ? 'bg-[#337418]/30 border-[#337418] text-[#5DD62C]'
                        : isDownloading
                        ? 'bg-[#202020] text-[#979DAB] cursor-not-allowed border border-[#337418]'
                        : 'bg-[#5DD62C] border-[#5DD62C] hover:bg-[#337418] text-[#0F0F0F] hover:text-[#F8F8F8] shadow-sm'
                    }`}
                  >
                    {isDownloaded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#5DD62C]" stroke="#5DD62C" />
                        <span>Downloaded</span>
                      </>
                    ) : isDownloading ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

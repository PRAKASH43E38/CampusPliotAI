/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
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
  UploadCloud 
} from 'lucide-react';
import { ResourceItem } from '../types';
import { mockStudent } from '../data/mockData';

interface ResourceCenterViewProps {
  isDark?: boolean;
  userRole?: 'STUDENT' | 'ADMIN';
}

export default function ResourceCenterView({ userRole = 'STUDENT' }: ResourceCenterViewProps) {
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
  const [rawFile, setRawFile] = useState<File | null>(null);
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
    const categoryQuery = activeType === 'All' ? '' : activeType;
    fetch(`/api/resources?q=${encodeURIComponent(search)}&category=${categoryQuery}`)
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
  }, [search, activeType]);

  // ----------------------------------------------------
  // PHYSICAL DOWNLOAD ROUTING
  // ----------------------------------------------------
  const handleDownload = (id: string) => {
    if (downloadingId) return;

    setDownloadingId(id);
    setDownloadProgress(25);

    const checkInterval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(checkInterval);
          setDownloadingId(null);
          setDownloadedIds((prevList) => [...prevList, id]);
          return 100;
        }
        return prev + 25;
      });
    }, 300);

    const matched = resources.find(r => r.id === id);
    if (!matched || !matched.fileUrl) return;

    const link = document.createElement('a');
    link.href = matched.fileUrl;
    link.setAttribute('download', matched.title || 'resource-download');
    link.setAttribute('target', '_blank');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveToggle = (id: string) => {
    let updated: string[];
    if (savedIds.includes(id)) {
      updated = savedIds.filter(x => x !== id);
    } else {
      updated = [...savedIds, id];
    }
    setSavedIds(updated);

    fetch('/api/student/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savedResources: updated })
    }).catch(err => console.error("Error saving resource link:", err));
  };

  // ----------------------------------------------------
  // ADMIN ACTIONS
  // ----------------------------------------------------
  const handleDeleteClick = (id: string) => {
    if (!confirm("Are you sure you want to delete this resource catalog item?")) return;
    fetch(`/api/resources/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error();
        fetchResources();
      })
      .catch(err => console.error("Error deleting catalog item:", err));
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
      type: res.type as any,
      tags: res.tags || '',
      fileUrl: res.fileUrl || ''
    });
    setSelectedFile({ name: 'Existing File Asset', size: res.fileSize });
    setShowUploadForm(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setRawFile(file);
      setSelectedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setRawFile(file);
      setSelectedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingProgress(15);

    const proceedWithSave = (finalFileUrl: string) => {
      const payload = {
        ...formDetails,
        fileUrl: finalFileUrl,
        fileSize: selectedFile ? selectedFile.size : '1.4 MB',
        addedBy: 'Admin Operations'
      };

      const url = editingResource ? `/api/resources/${editingResource.id}` : '/api/resources';
      const method = editingResource ? 'PUT' : 'POST';

      fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(res => {
          if (!res.ok) throw new Error();
          setUploadingProgress(null);
          setShowUploadForm(false);
          setEditingResource(null);
          setSelectedFile(null);
          setRawFile(null);
          fetchResources();
        })
        .catch(err => {
          console.error("Error creating resource link record:", err);
          setUploadingProgress(null);
        });
    };

    if (rawFile) {
      setUploadingProgress(45);
      const formData = new FormData();
      formData.append('file', rawFile);

      fetch('/api/resources/upload', {
        method: 'POST',
        body: formData
      })
        .then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then(data => {
          setUploadingProgress(90);
          proceedWithSave(data.fileUrl);
        })
        .catch(() => {
          setUploadingProgress(90);
          proceedWithSave("https://institution-storage.supabase.co/v1/object/public/notes/sample_syllabus.pdf");
        });
    } else {
      proceedWithSave(formDetails.fileUrl || "https://institution-storage.supabase.co/v1/object/public/notes/sample_syllabus.pdf");
    }
  };

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(search.toLowerCase()) ||
                          res.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
                          res.subjectName.toLowerCase().includes(search.toLowerCase());
    const matchesType = activeType === 'All' || res.type === activeType;
    return matchesSearch && matchesType;
  });

  const types = ['All', 'notes', 'pyq', 'manual', 'book'];

  return (
    <div className="space-y-6 pb-16 font-sans">
      
      {/* PORTAL HEADER BANNER */}
      <div className="border p-6 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white border-[#A7C7DD]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#0A4174]/10 text-[#0A4174]">
              <FileDown className="w-5 h-5 text-[#0A4174]" />
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-[#001D39]">
              Resource Repository Center
            </h2>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
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
            className="px-4 py-2.5 bg-[#4E8EA2] hover:bg-[#346271] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <Upload className="w-4 h-4 text-white" />
            <span>{showUploadForm ? 'Close Manager' : 'Upload Resource'}</span>
          </button>
        ) : (
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-[#A7C7DD] text-[#0A4174] bg-[#BDD8E9]/20">
            Format: V Semester B.Tech
          </span>
        )}
      </div>

      {/* ADMIN VIEW: UPLOAD & STATISTICS PANEL */}
      {userRole === 'ADMIN' && (
        <div className="space-y-6">
          {/* Admin Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Uploaded Resources', count: resources.length, detail: 'Repository Catalog Catalog' },
              { label: 'Total Curated Formats', count: `${resources.filter(r => r.type === 'notes').length} Notes, ${resources.filter(r => r.type === 'pyq').length} PYQs`, detail: 'Categorized Distribution' },
              { label: 'Repository Status', count: 'Active Sync', detail: 'Public Database Storage' }
            ].map((stat, i) => (
              <div key={i} className="p-6 border border-[#A7C7DD] rounded-3xl bg-white flex justify-between items-center shadow-sm">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.label}</span>
                  <h4 className="text-xl font-extrabold text-[#001D39]">{stat.count}</h4>
                  <p className="text-[10px] text-[#0A4174] font-mono">{stat.detail}</p>
                </div>
                <span className="p-2 rounded-xl bg-[#BDD8E9]/20">
                  <BarChart className="w-5 h-5 text-[#0A4174]" />
                </span>
              </div>
            ))}
          </div>

          {/* Upload / Edit Form Drawer */}
          {showUploadForm && (
            <div className="p-6 border border-[#A7C7DD] rounded-3xl bg-white space-y-6 animate-fade-in shadow-md">
              <div className="border-b border-[#A7C7DD]/60 pb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-extrabold text-[#001D39]">
                    {editingResource ? 'Edit Resource Metadata' : 'Upload Academic Resource File'}
                  </h3>
                  <p className="text-xs text-slate-500">Upload to storage and register metadata catalog</p>
                </div>
                <button onClick={() => setShowUploadForm(false)} className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-650 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Drag and Drop Box */}
                <div className="lg:col-span-5 space-y-4">
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-[#A7C7DD] hover:border-[#0A4174] transition-colors rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-3 bg-[#BDD8E9]/10 cursor-pointer relative"
                  >
                    <input
                      type="file"
                      id="resource-file-input"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="w-10 h-10 text-[#0A4174]" />
                    <div>
                      <p className="text-xs font-bold text-[#001D39]">Drag & Drop Academic File Here</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Or browse folder files (PDF, ZIP, DOCX)</p>
                    </div>
                  </div>

                  {selectedFile && (
                    <div className="p-4 border border-[#A7C7DD]/60 rounded-2xl bg-slate-50 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#0A4174]" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#001D39] truncate">{selectedFile.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{selectedFile.size}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-slate-500 hover:text-[#001D39] cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {uploadingProgress !== null && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono font-bold text-[#0A4174]">
                        <span>Uploading...</span>
                        <span>{uploadingProgress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-[#A7C7DD]/60">
                        <div 
                          className="bg-[#0A4174] h-full transition-all duration-200" 
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
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Resource Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. DBMS Normalization Notes"
                        value={formDetails.title}
                        onChange={(e) => setFormDetails({ ...formDetails, title: e.target.value })}
                        className="w-full py-2 px-3 border border-[#A7C7DD] rounded-xl text-xs font-semibold bg-white text-[#001D39] focus:border-[#0A4174] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Department</label>
                      <select
                        value={formDetails.department}
                        onChange={(e) => setFormDetails({ ...formDetails, department: e.target.value })}
                        className="w-full py-2 px-3 border border-[#A7C7DD] rounded-xl text-xs font-semibold bg-white text-[#001D39] focus:border-[#0A4174] outline-none cursor-pointer"
                      >
                        {['Computer Science & Engineering', 'Electronics & Communication', 'Electrical & Electronics', 'Mechanical Engineering', 'Civil Engineering', 'MBA Studies'].map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Semester (1-8)</label>
                      <input
                        type="number"
                        min={1}
                        max={8}
                        value={formDetails.semester}
                        onChange={(e) => setFormDetails({ ...formDetails, semester: parseInt(e.target.value) || 1 })}
                        className="w-full py-2 px-3 border border-[#A7C7DD] rounded-xl text-xs font-semibold bg-white text-[#001D39] focus:border-[#0A4174] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Subject Code</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CS301"
                        value={formDetails.subjectCode}
                        onChange={(e) => setFormDetails({ ...formDetails, subjectCode: e.target.value })}
                        className="w-full py-2 px-3 border border-[#A7C7DD] rounded-xl text-xs font-semibold bg-white text-[#001D39] focus:border-[#0A4174] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Subject Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Database Management"
                        value={formDetails.subjectName}
                        onChange={(e) => setFormDetails({ ...formDetails, subjectName: e.target.value })}
                        className="w-full py-2 px-3 border border-[#A7C7DD] rounded-xl text-xs font-semibold bg-white text-[#001D39] focus:border-[#0A4174] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">File Type</label>
                      <select
                        value={formDetails.type}
                        onChange={(e) => setFormDetails({ ...formDetails, type: e.target.value as any })}
                        className="w-full py-2 px-3 border border-[#A7C7DD] rounded-xl text-xs font-semibold bg-white text-[#001D39] focus:border-[#0A4174] outline-none cursor-pointer"
                      >
                        <option value="notes">Lecture Notes</option>
                        <option value="pyq">Question Papers (PYQ)</option>
                        <option value="manual">Lab Manuals</option>
                        <option value="book">Reference Textbooks</option>
                        <option value="syllabus">Syllabus Guide</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Tags (comma separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. sql, normalization"
                        value={formDetails.tags}
                        onChange={(e) => setFormDetails({ ...formDetails, tags: e.target.value })}
                        className="w-full py-2 px-3 border border-[#A7C7DD] rounded-xl text-xs font-semibold bg-white text-[#001D39] focus:border-[#0A4174] outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Brief summary of the document..."
                      value={formDetails.description}
                      onChange={(e) => setFormDetails({ ...formDetails, description: e.target.value })}
                      className="w-full py-2 px-3 border border-[#A7C7DD] rounded-xl text-xs font-semibold bg-white text-[#001D39] focus:border-[#0A4174] outline-none"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowUploadForm(false)}
                      className="px-4 py-2 bg-slate-50 border border-[#A7C7DD] text-[#0A4174] font-bold text-xs rounded-xl hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploadingProgress !== null}
                      className="px-6 py-2 bg-[#0A4174] hover:bg-[#002b52] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer disabled:bg-slate-200"
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

      {/* STUDENT VIEW / FILTERING SEARCH CONTROLS */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-[#0A4174]" />
          </div>
          <input
            type="text"
            disabled={resources.length === 0}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={resources.length === 0 ? "Search is disabled until resources exist" : "Search by syllabus title, code, tags..."}
            className={`w-full pl-10 pr-4 py-3 border border-[#A7C7DD] rounded-full text-sm transition-all outline-none bg-white text-slate-800 placeholder-slate-400 focus:border-[#0A4174] focus:ring-2 focus:ring-[#0A4174]/10 ${
              resources.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>

        <div className="flex overflow-x-auto gap-2 scrollbar-none">
          {types.map(t => {
            const isActive = activeType === t;
            return (
              <button
                key={t}
                disabled={resources.length === 0}
                onClick={() => setActiveType(t)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap border cursor-pointer ${
                  resources.length === 0 
                    ? 'opacity-50 cursor-not-allowed border-slate-200 text-slate-400 bg-slate-50' 
                    : isActive
                    ? 'bg-[#0A4174] border-[#0A4174] text-white shadow-sm'
                    : 'bg-white border-[#A7C7DD] text-slate-650 hover:bg-[#BDD8E9]/20'
                }`}
              >
                {t === 'All' ? 'ALL FORMATS' : t.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* RESOURCES LISTING / EMPTY STATES */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-4 border-[#0A4174] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-slate-450 font-bold font-mono">LOADING CURATED REPOSITORY...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="border border-[#A7C7DD] rounded-3xl p-16 bg-white flex flex-col items-center justify-center text-center space-y-4 max-w-2xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#BDD8E9]/20 flex items-center justify-center text-[#0A4174]">
            <BookOpen className="w-8 h-8 text-[#0A4174]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-[#001D39]">No study resources are available yet.</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Resources will appear here once uploaded by the administrator. Check back soon for syllabi, guides, and manuals!
            </p>
          </div>
          {userRole === 'ADMIN' && (
            <button
              onClick={() => setShowUploadForm(true)}
              className="px-4 py-2 bg-[#0A4174] hover:bg-[#002b52] text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Start Uploading Now
            </button>
          )}
        </div>
      ) : filteredResources.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-16 font-semibold">No resource matches your query filter search.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredResources.map(res => {
            const isDownloading = downloadingId === res.id;
            const isDownloaded = downloadedIds.includes(res.id);
            const isSaved = savedIds.includes(res.id);

            return (
              <div 
                key={res.id}
                className="border border-[#A7C7DD] rounded-3xl p-6 bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-mono font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#BDD8E9]/30 text-[#0A4174] border border-[#A7C7DD]/30">
                      {res.type}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{res.fileSize}</span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base leading-snug text-[#001D39]">{res.title}</h3>
                    <p className="text-[10px] text-[#4E8EA2] font-mono tracking-wide mt-1">Course: {res.subjectName} ({res.subjectCode})</p>
                    {res.description && (
                      <p className="text-xs text-slate-650 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{res.description}</p>
                    )}
                    {res.tags && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {res.tags.split(',').map((tag, i) => (
                          <span key={i} className="text-[8px] px-1.5 py-0.5 rounded bg-[#BDD8E9]/20 border border-[#A7C7DD]/35 text-[#0A4174] font-bold">
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                    <span>Sem {res.semester}</span>
                    <span>•</span>
                    <span>Department: {res.department || 'CSE'}</span>
                    <span>•</span>
                    <span>Coordinator: {res.addedBy}</span>
                  </div>
                </div>

                {isDownloading && (
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[10px] font-mono font-bold text-[#0A4174]">
                      <span>Downloading Resource...</span>
                      <span>{downloadProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-[#A7C7DD]/60">
                      <div 
                        className="bg-[#0A4174] h-full transition-all duration-200" 
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions Panel */}
                <div className="pt-4 border-t border-[#A7C7DD]/40 flex items-center justify-between gap-4">
                  {userRole === 'ADMIN' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditClick(res)}
                        className="p-2 border border-[#A7C7DD] rounded-xl hover:bg-slate-50 text-[#0A4174] transition-colors cursor-pointer"
                        title="Edit Resource"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#0A4174]" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(res.id)}
                        className="p-2 border border-rose-200 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSaveToggle(res.id)}
                      className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border ${
                        isSaved
                          ? 'bg-[#BDD8E9]/20 border-[#A7C7DD] text-[#0A4174]'
                          : 'bg-white border-[#A7C7DD] text-slate-550 hover:bg-[#BDD8E9]/20 hover:text-[#0A4174]'
                      }`}
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaved ? 'Saved in Profile' : 'Save Bookmark'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDownload(res.id)}
                    disabled={isDownloading || isDownloaded}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 border ${
                      isDownloaded
                        ? 'bg-slate-100 border-[#A7C7DD] text-slate-500 cursor-not-allowed'
                        : isDownloading
                        ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-[#0A4174] border-[#0A4174] text-white hover:bg-[#002b52] shadow-sm'
                    }`}
                  >
                    {isDownloaded ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-slate-500" />
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

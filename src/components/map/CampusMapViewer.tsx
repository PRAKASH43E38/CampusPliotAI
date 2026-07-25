import React, { useState } from 'react';
import { Building, Classroom } from '../../types';
import { MapPin, Search, Navigation, Plus, Minus, RotateCcw, ShieldCheck, Compass, Layers3, CheckCircle2, Sparkles } from 'lucide-react';
import { campusBuildings } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export const CampusMapViewer: React.FC = () => {
  const { role } = useAuth();
  
  // States
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(campusBuildings[2]); // Default CSE Block
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [activeFloor, setActiveFloor] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mapStyle, setMapStyle] = useState<'satellite' | 'standard'>('standard'); // Default to Standard (Road Map top-view)
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnimatedRoute, setShowAnimatedRoute] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  
  // Drag-to-pan states
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const categories = [
    { id: 'all', label: 'All Locations' },
    { id: 'gate', label: 'Gate & Parking' },
    { id: 'academic', label: 'Academic Blocks' },
    { id: 'lab', label: 'Research & AI Labs' },
    { id: 'facility', label: 'Amenities & Library' },
    { id: 'hostel', label: 'Student Hostels' },
    { id: 'sports', label: 'Sports Arena' },
    { id: 'admin', label: 'Administration' }
  ];

  const mainGate = campusBuildings[0]; // Main Gate 1

  const filteredBuildings = campusBuildings.filter((b) => {
    const matchesCat = activeCategory === 'all' || b.category === activeCategory;
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.departments.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const activeClassrooms = selectedBuilding?.classrooms?.filter(c => c.floor === activeFloor) || [];

  // Winding route generator that traces paths from Main Gate (43%, 88%) along the satellite map roads
  const getRoutePath = (bldg: Building) => {
    if (bldg.id === 'bldg_gate') return '';
    const end = bldg.coordinates;
    
    if (end.x < 35) {
      // Left side (Admin, Clinic, Sports, ATM)
      return `M 43,88 Q 43,78 30,75 T 22,50 T ${end.x},${end.y}`;
    } else if (end.y < 30) {
      // Top side (ME Block, Library)
      return `M 43,88 Q 43,78 53,52 T 52,25 T ${end.x},${end.y}`;
    } else {
      // Center / Right side (CSE, AI, Canteen, Hostels)
      return `M 43,88 Q 43,78 53,58 T 68,52 T ${end.x},${end.y}`;
    }
  };

  // Drag-to-pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Restrict pan offset based on zoom level to keep map in bounds
    const maxPan = (zoomLevel - 1.0) * 350;
    setPanOffset({
      x: Math.max(-maxPan - 150, Math.min(maxPan + 150, newX)),
      y: Math.max(-maxPan - 150, Math.min(maxPan + 150, newY))
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Get indoor blueprint coordinate paths for classroom animation
  const getIndoorPath = (roomId: string) => {
    // Blueprint is rendered on 100x100 space
    // Entrance: (50, 95)
    // Left classrooms (Room 1 & 3): center is 25
    // Right classrooms (Room 2 & 4): center is 75
    switch (roomId) {
      case 'c_01': // Ground: Seminar Hall A (Left)
      case 'c_03': // F1: LH-101 (Left)
      case 'c_05': // F1: Lab 104 (Left)
      case 'c_06': // F2: LH-201 (Left)
      case 'c_08': // F2: HPC Lab (Left)
      case 'c_09': // F3: HOD Cabin (Left)
      case 'c_11': // F3: LH-301 (Left)
      case 'c_13': // F4: Cyber Lab (Left)
      case 'ai_01': // NVIDIA GPU Cluster (Left)
      case 'ai_03': // ML Lecture Hall (Left)
        return 'M 50,95 L 50,70 L 25,70 L 25,45';
      
      case 'c_02': // Ground: Reception (Right)
      case 'c_04': // F1: LH-102 (Right)
      case 'c_07': // F2: LH-202 (Right)
      case 'c_10': // F3: Faculty Cabin (Right)
      case 'c_12': // F3: Agentic AI Lab (Right)
      case 'c_14': // F4: PhD Studio (Right)
      case 'ai_02': // CV Robotics Studio (Right)
      case 'ai_04': // GenAI Lounge (Right)
        return 'M 50,95 L 50,70 L 75,70 L 75,45';
      
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Google Maps Style Header Control Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 animate-pulse" />
            <input
              type="text"
              placeholder="Search Main Gate, CSE Dept, LH-101, Cricket Ground..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          {/* Map Style Selector & Zoom Controls */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
              <button
                onClick={() => setMapStyle('standard')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  mapStyle === 'standard' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Layers3 className="w-3.5 h-3.5" />
                Road Map (Default)
              </button>
              <button
                onClick={() => setMapStyle('satellite')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  mapStyle === 'satellite' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-emerald-300" />
                Satellite 3D
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.0))}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold active:scale-95 transition-all"
                title="Zoom In"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(1.0, prev - 0.2))} // Disable zooming out beyond 1.0 (limit of the image)
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold active:scale-95 transition-all"
                title="Zoom Out"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setZoomLevel(1.0); setPanOffset({ x: 0, y: 0 }); setSelectedBuilding(campusBuildings[2]); }}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold active:scale-95 transition-all"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Filter Pills */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0 mr-1">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  activeCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Google-Maps Style Canvas & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Vector Map Canvas */}
        <div 
          className="lg:col-span-2 relative min-h-[550px] sm:min-h-[650px] rounded-3xl bg-[#090d16] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden group select-none cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Draggable & Scalable Map Container */}
          <div
            className="w-full h-full absolute inset-0 transition-transform duration-300 ease-out origin-center"
            style={{ 
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              backgroundImage: mapStyle === 'satellite' ? 'url(/campus-map.png)' : 'none',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center',
              backgroundColor: mapStyle === 'standard' ? '#fbfaf7' : '#090d16'
            }}
          >
            {/* Grid layout for Standard style map */}
            {mapStyle === 'standard' && (
              <div className="absolute inset-0 bg-[#f1ede5] bg-[linear-gradient(to_right,#e4dbcd_1px,transparent_1px),linear-gradient(to_bottom,#e4dbcd_1px,transparent_1px)] bg-[size:32px_32px] opacity-60" />
            )}

            {/* Custom SVG overlay mapped directly via 0-100 viewBox */}
            <svg 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none" 
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Show road layouts on road style map */}
              {mapStyle === 'standard' && (
                <>
                  <path d="M 43,99 L 43,78" fill="none" stroke="#ddd3c5" strokeWidth="6" />
                  <path d="M 43,78 Q 43,65 30,62 T 22,50 T 25,35" fill="none" stroke="#e9dfd0" strokeWidth="4" />
                  <path d="M 43,78 Q 50,70 53,52 T 75,47" fill="none" stroke="#e9dfd0" strokeWidth="4" />
                  <path d="M 53,52 Q 53,35 52,15" fill="none" stroke="#e9dfd0" strokeWidth="4" />
                </>
              )}

              {/* STUDENT EXCLUSIVE: Glowing walk route line from Main Gate */}
              {role === 'student' && showAnimatedRoute && selectedBuilding && selectedBuilding.id !== 'bldg_gate' && (
                <>
                  {/* Outer glow trail */}
                  <path
                    d={getRoutePath(selectedBuilding)}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    className="opacity-50"
                  />
                  {/* Dashed marching ants */}
                  <path
                    d={getRoutePath(selectedBuilding)}
                    fill="none"
                    stroke="#fed7a5"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeDasharray="2 2"
                    className="animate-pulse"
                  />
                  {/* Guided laser dot */}
                  <circle r="0.8" fill="#9e6752">
                    <animateMotion
                      path={getRoutePath(selectedBuilding)}
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </>
              )}
            </svg>

            {/* Render building markers */}
            {filteredBuildings.map((bldg) => {
              const isSelected = selectedBuilding?.id === bldg.id;
              const isGate = bldg.category === 'gate';
              
              // Determine badge colors based on selection or roles
              const pinColor = isSelected 
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-400/50 scale-110 z-30'
                : isGate 
                ? 'bg-amber-600 text-white border border-amber-400' 
                : 'bg-slate-900/90 border border-slate-700 text-slate-200 hover:border-emerald-400';

              return (
                <div
                  key={bldg.id}
                  style={{ top: `${bldg.coordinates.y}%`, left: `${bldg.coordinates.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    onClick={() => {
                      setSelectedBuilding(bldg);
                      setSelectedClassroom(null);
                      setActiveFloor(0);
                    }}
                    className="relative flex flex-col items-center group transition-transform duration-200"
                  >
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center font-bold shadow-2xl transition-all ${pinColor}`}>
                      <MapPin className={`w-4 h-4 sm:w-5 sm:h-5 ${isSelected ? 'text-white' : 'text-emerald-400'}`} />
                    </div>
                    <span className="mt-1 px-1.5 py-0.5 rounded bg-slate-950/90 border border-slate-800 text-[8px] sm:text-[9px] font-extrabold text-white whitespace-nowrap shadow-md">
                      {bldg.code}
                    </span>
                  </button>
                </div>
              );
            })}

            {/* STUDENT EXCLUSIVE: Deep Zoom Floor Blueprint overlay directly in map canvas */}
            {role === 'student' && selectedBuilding && selectedBuilding.classrooms && zoomLevel >= 1.3 && (
              <div 
                className="absolute inset-0 z-40 bg-slate-950/95 flex flex-col p-4 sm:p-6 animate-in zoom-in-95 duration-200"
                onMouseDown={(e) => e.stopPropagation()} // Prevent map dragging inside the blueprint
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white">{selectedBuilding.name} Blueprint Map</h4>
                      <p className="text-[10px] text-slate-400">Indoor Classroom Walkways & Status Navigation</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-0.5">
                    {Array.from({ length: selectedBuilding.floors }).map((_, f) => (
                      <button
                        key={f}
                        onClick={() => { setActiveFloor(f); setSelectedClassroom(null); }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all ${
                          activeFloor === f ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {f === 0 ? 'G' : `F${f}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid layout containing schematic blueprint & details */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  
                  {/* Schematic Map Container */}
                  <div className="relative aspect-square max-h-[280px] sm:max-h-[340px] w-full mx-auto border-2 border-dashed border-emerald-900 bg-slate-900/50 rounded-2xl p-4 overflow-hidden flex flex-col justify-between">
                    
                    {/* SVG Blueprint lines */}
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none p-4">
                      {/* Corridors & Walls */}
                      <rect x="5" y="5" width="90" height="90" fill="none" stroke="#2d4354" strokeWidth="2" />
                      <line x1="50" y1="5" x2="50" y2="95" stroke="#2d4354" strokeWidth="4" strokeDasharray="2 2" />
                      <line x1="5" y1="70" x2="95" y2="70" stroke="#2d4354" strokeWidth="4" />
                      
                      {/* Animated indoor path */}
                      {selectedClassroom && (
                        <>
                          <path
                            d={getIndoorPath(selectedClassroom.id)}
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3"
                            strokeLinecap="round"
                            className="opacity-40"
                          />
                          <path
                            d={getIndoorPath(selectedClassroom.id)}
                            fill="none"
                            stroke="#fed7a5"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray="4 4"
                          />
                          <circle r="2.5" fill="#9e6752">
                            <animateMotion
                              path={getIndoorPath(selectedClassroom.id)}
                              dur="2.5s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        </>
                      )}
                    </svg>

                    {/* Room Layouts boxes mapped on Grid */}
                    <div className="grid grid-cols-2 gap-8 h-4/5 z-10">
                      {/* Room Left */}
                      <button
                        onClick={() => setSelectedClassroom(activeClassrooms[0] || null)}
                        className={`rounded-xl border flex flex-col items-center justify-center p-3 transition-all ${
                          selectedClassroom?.id === activeClassrooms[0]?.id
                            ? 'bg-emerald-500/10 border-emerald-500 text-white ring-2 ring-emerald-500/30'
                            : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider">Left Zone</span>
                        <span className="text-xs font-black text-white mt-1 truncate max-w-full">
                          {activeClassrooms[0]?.name || 'Lab Room 1'}
                        </span>
                        <span className="text-[9px] text-emerald-400 font-bold mt-0.5">{activeClassrooms[0]?.code}</span>
                      </button>

                      {/* Room Right */}
                      <button
                        onClick={() => setSelectedClassroom(activeClassrooms[1] || null)}
                        className={`rounded-xl border flex flex-col items-center justify-center p-3 transition-all ${
                          selectedClassroom?.id === activeClassrooms[1]?.id
                            ? 'bg-emerald-500/10 border-emerald-500 text-white ring-2 ring-emerald-500/30'
                            : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider">Right Zone</span>
                        <span className="text-xs font-black text-white mt-1 truncate max-w-full">
                          {activeClassrooms[1]?.name || 'Lecture Hall 2'}
                        </span>
                        <span className="text-[9px] text-emerald-400 font-bold mt-0.5">{activeClassrooms[1]?.code}</span>
                      </button>
                    </div>

                    <div className="text-center z-10">
                      <span className="inline-block px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        ⬅ Building Entrance (Corridor) ➡
                      </span>
                    </div>

                  </div>

                  {/* Room Details Column */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 h-full overflow-y-auto">
                    {selectedClassroom ? (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-xs font-black text-white">{selectedClassroom.name}</span>
                          <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/25">
                            {selectedClassroom.code}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5 text-[10px] text-slate-400 font-medium">
                          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                            <span className="block text-[9px] font-bold text-slate-500 uppercase">Usage Type:</span>
                            <span className="text-white font-bold">{selectedClassroom.type}</span>
                          </div>
                          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                            <span className="block text-[9px] font-bold text-slate-500 uppercase">Capacity:</span>
                            <span className="text-white font-bold">{selectedClassroom.capacity} Students</span>
                          </div>
                          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 col-span-2">
                            <span className="block text-[9px] font-bold text-slate-500 uppercase">Current Event/Status:</span>
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              {selectedClassroom.currentStatus}
                            </span>
                          </div>
                          {selectedClassroom.instructor && (
                            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 col-span-2">
                              <span className="block text-[9px] font-bold text-slate-500 uppercase">Active Instructor:</span>
                              <span className="text-white font-bold">{selectedClassroom.instructor}</span>
                            </div>
                          )}
                        </div>

                        {/* Walking route info */}
                        <div className="p-3 bg-emerald-950/40 border border-emerald-900 rounded-xl">
                          <p className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <Navigation className="w-3 h-3 text-emerald-400 animate-bounce" /> Indoor Navigation Enabled
                          </p>
                          <p className="text-[9px] text-emerald-200 mt-1 font-medium">
                            Follow the green glowing indicators along the hallway to the left or right to reach the entrance.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-10 text-slate-500">
                        <Layers3 className="w-8 h-8 text-slate-600 mb-2 animate-bounce" />
                        <p className="text-xs font-semibold">Select a Room Blueprint Area</p>
                        <p className="text-[10px] text-slate-600 mt-1">Select a classroom box on the left map schematic to initiate indoor path routing.</p>
                      </div>
                    )}
                  </div>

                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
                  <span className="text-[10px] font-bold text-slate-500">💡 Tip: Use G or F1-F4 tabs to navigate building floors.</span>
                  <button 
                    onClick={() => { setZoomLevel(1.0); setSelectedClassroom(null); }}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white text-[10px] font-bold rounded-lg transition-all"
                  >
                    Close Blueprint Zoom
                  </button>
                </div>
              </div>
            )}

            {/* ADMIN EXCLUSIVE OVERLAY: Simplified Security Patrol & RFID Hub status overlays */}
            {role === 'admin' && (
              <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 items-end">
                <span className="px-3 py-1 rounded-2xl bg-amber-600 border border-amber-400 text-[10px] font-black text-white flex items-center gap-1.5 shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                  Security Console View
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[9px] text-amber-300 font-bold">
                  RFID Scan Locks: Active
                </span>
              </div>
            )}

            {/* Floating Info Banner when zoomed */}
            {zoomLevel > 1.0 && (
              <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-[9px] font-bold text-slate-400">
                🔍 Drag to Pan Map
              </div>
            )}
          </div>

          {/* Floating Walking Navigation Bar (Student Only) */}
          {role === 'student' && selectedBuilding && selectedBuilding.id !== 'bldg_gate' && (
            <div className="absolute bottom-4 left-4 z-20 p-3 rounded-2xl bg-slate-900/95 border border-slate-800 backdrop-blur-md text-xs text-white flex items-center gap-3 shadow-xl max-w-sm">
              <Navigation className="w-5 h-5 text-emerald-400 animate-spin-slow shrink-0" />
              <div>
                <p className="font-bold text-white">🚶 GPS Walking Trail: Active</p>
                <p className="text-[10px] text-emerald-300 font-semibold mt-0.5">
                  Route traces from Gate ➔ {selectedBuilding.name}.
                  {selectedBuilding.classrooms && (
                    <span className="text-amber-300 font-bold"> Zoom map (1.3x+) to inspect rooms!</span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Admin Info Box (Admin Only) */}
          {role === 'admin' && (
            <div className="absolute bottom-4 left-4 z-20 p-3 rounded-2xl bg-slate-900/95 border border-slate-800 backdrop-blur-md text-xs text-white flex items-center gap-3 shadow-xl max-w-sm">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="font-bold text-white">🔒 Administrative Mode Active</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Interactive student features (GPS walking paths, classroom blueprint zooming) are disabled. Inspecting static RFID coverage points.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Details Inspector */}
        <div className="space-y-4">
          {selectedBuilding ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 animate-in fade-in duration-200">
              
              {/* Building Image */}
              <div className="relative h-44 rounded-2xl overflow-hidden">
                <img
                  src={selectedBuilding.image}
                  alt={selectedBuilding.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-md bg-emerald-600 text-white">
                      {selectedBuilding.code}
                    </span>
                    <h3 className="text-base font-black text-white mt-1">{selectedBuilding.name}</h3>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    {selectedBuilding.status}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {selectedBuilding.description}
              </p>

              {/* Floor Classroom zoom list (Student View Only) */}
              {role === 'student' && selectedBuilding.classrooms && (
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Layers3 className="w-4 h-4 text-emerald-600" /> Floor Classroom Inspector
                    </h4>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {selectedBuilding.floors} Floors
                    </span>
                  </div>

                  {/* Floor select tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {Array.from({ length: selectedBuilding.floors }).map((_, f) => (
                      <button
                        key={f}
                        onClick={() => { setActiveFloor(f); setSelectedClassroom(null); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                          activeFloor === f
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {f === 0 ? 'Ground Floor' : `Floor ${f}`}
                      </button>
                    ))}
                  </div>

                  {/* Classrooms listed */}
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {activeClassrooms.length > 0 ? (
                      activeClassrooms.map((cls) => (
                        <div
                          key={cls.id}
                          onClick={() => {
                            setSelectedClassroom(cls);
                            // Auto zoom-in when clicking a classroom
                            setZoomLevel(1.5);
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                            selectedClassroom?.id === cls.id
                              ? 'bg-emerald-500/10 border-emerald-500 text-slate-900 dark:text-white'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 hover:border-emerald-500/50'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-slate-900 dark:text-white">{cls.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                              {cls.code}
                            </span>
                          </div>
                          
                          <div className="mt-1 flex items-center justify-between text-[11px]">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{cls.currentStatus}</span>
                            <span className="text-slate-400 font-medium">{cls.type} • Cap: {cls.capacity}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-xl font-semibold">
                        Regular Lecture Halls on Floor {activeFloor}
                      </div>
                    )}
                  </div>

                  {/* Blueprint Zoom Prompt */}
                  {zoomLevel < 1.3 && (
                    <button
                      onClick={() => setZoomLevel(1.4)}
                      className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all mt-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Zoom In Map to Open Blueprint Layout
                    </button>
                  )}
                </div>
              )}

              {/* Facilities List (Admin / General View) */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Key Facilities & Features
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBuilding.facilities.map((fac, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                    >
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sidebar Action (Student Only) */}
              {role === 'student' && selectedBuilding.id !== 'bldg_gate' && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <button
                    onClick={() => setShowAnimatedRoute(!showAnimatedRoute)}
                    className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Navigation className="w-4 h-4" />
                    {showAnimatedRoute ? 'Hide GPS Road Path' : 'Show Road Path from Gate'}
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-400">
              <MapPin className="w-10 h-10 mx-auto mb-2 text-emerald-500 animate-bounce" />
              <p className="text-xs font-semibold">Select a building pin on the map to inspect details.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

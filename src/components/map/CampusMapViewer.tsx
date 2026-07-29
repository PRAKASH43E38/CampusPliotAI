import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, Info } from 'lucide-react';

interface BuildingPoint {
  id: string;
  name: string;
  code: string;
  category: string;
  x: number;
  y: number;
  description: string;
}

const BUILDINGS: BuildingPoint[] = [
  { id: '1', name: 'Main Academic Block', code: 'MAB-101', category: 'Academic', x: 25, y: 35, description: 'Houses CSE, ECE & IT Department Classrooms and Dean Office.' },
  { id: '2', name: 'Central Library & Innovation Center', code: 'LIB-01', category: 'Library', x: 50, y: 30, description: 'Digital e-library, research journals, & 24/7 quiet study zones.' },
  { id: '3', name: 'Science & Humanities Wing', code: 'SHW-02', category: 'Academic', x: 75, y: 40, description: 'Physics & Chemistry laboratories, Mathematics department.' },
  { id: '4', name: 'Administrative Building', code: 'ADM-01', category: 'Admin', x: 35, y: 70, description: 'Principal office, Registrar, Accounts, & Exam Cell.' },
  { id: '5', name: 'Auditorium & Event Hall', code: 'AUD-100', category: 'Events', x: 65, y: 75, description: '1500-seater air-conditioned hall for national symposiums.' }
];

export const CampusMapViewer: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingPoint>(BUILDINGS[0]);
  const [destination, setDestination] = useState<BuildingPoint>(BUILDINGS[1]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#F8FAF8] dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#2E7D32] dark:text-[#4CAF50]" />
            Campus Interactive Map & Route Guidance
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#CBD5E1] mt-1">
            Navigate through academic blocks, laboratories, library, and administrative wings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-[#E8F5E9] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] text-xs font-semibold text-[#2E7D32] dark:text-[#81C784]">
            Live Navigation Active
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Map Visualizer */}
        <div className="lg:col-span-2 rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] p-6 relative min-h-[420px] flex flex-col justify-between">
          
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7280] dark:text-[#CBD5E1] flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50]" /> Ground Master Map Plan
            </span>
            <span className="text-[11px] px-2.5 py-1 rounded-md bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC] font-medium">
              Scale 1:500
            </span>
          </div>

          {/* SVG Map Canvas with Solid Green Navigation Path */}
          <div className="relative w-full h-[320px] my-4 rounded-xl bg-white dark:bg-[#0F172A] border border-[#DDE5DD] dark:border-[#334155] overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Grid Lines */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E5E7EB" strokeWidth="0.5" className="dark:stroke-slate-800" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Navigation Path (Solid Green Line) */}
              <polyline
                points={`${selectedBuilding.x},${selectedBuilding.y} ${(selectedBuilding.x + destination.x) / 2},${selectedBuilding.y} ${destination.x},${destination.y}`}
                fill="none"
                stroke="#2E7D32"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                className="dark:stroke-[#4CAF50]"
              />

              {/* Building Markers */}
              {BUILDINGS.map((b) => {
                const isOrigin = b.id === selectedBuilding.id;
                const isDest = b.id === destination.id;
                return (
                  <g key={b.id} className="cursor-pointer" onClick={() => setSelectedBuilding(b)}>
                    <circle
                      cx={b.x}
                      cy={b.y}
                      r={isOrigin || isDest ? "4" : "2.5"}
                      fill={isOrigin || isDest ? (isDest ? "#2E7D32" : "#1F2937") : "#6B7280"}
                      className={isDest ? "dark:fill-[#4CAF50]" : ""}
                    />
                    <text
                      x={b.x}
                      y={b.y - 5}
                      fontSize="3.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill="#1F2937"
                      className="dark:fill-[#F8FAFC]"
                    >
                      {b.code}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Controls */}
          <div className="flex items-center justify-between text-xs text-[#6B7280] dark:text-[#CBD5E1]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#2E7D32] dark:bg-[#4CAF50] inline-block" />
              Green line indicates shortest wheelchair-accessible route.
            </span>
            <button
              onClick={() => {
                const swap = selectedBuilding;
                setSelectedBuilding(destination);
                setDestination(swap);
              }}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] text-[#1F2937] dark:text-[#F8FAFC] font-semibold hover:bg-[#E8F5E9] cursor-pointer"
            >
              Swap Route
            </button>
          </div>

        </div>

        {/* Route Details Panel */}
        <div className="rounded-2xl bg-[#F4F8F4] dark:bg-[#1E293B] border border-[#DDE5DD] dark:border-[#334155] p-6 space-y-6">
          <h3 className="text-base font-bold text-[#1F2937] dark:text-[#F8FAFC] flex items-center gap-2 border-b border-[#E5E7EB] dark:border-[#475569] pb-3">
            <Navigation className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
            Route Controls
          </h3>

          {/* From Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#6B7280] dark:text-[#CBD5E1]">Current Origin</label>
            <select
              value={selectedBuilding.id}
              onChange={(e) => {
                const found = BUILDINGS.find(b => b.id === e.target.value);
                if (found) setSelectedBuilding(found);
              }}
              className="w-full"
            >
              {BUILDINGS.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>

          {/* To Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#6B7280] dark:text-[#CBD5E1]">Destination</label>
            <select
              value={destination.id}
              onChange={(e) => {
                const found = BUILDINGS.find(b => b.id === e.target.value);
                if (found) setDestination(found);
              }}
              className="w-full"
            >
              {BUILDINGS.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
              ))}
            </select>
          </div>

          {/* Location Info Box */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#162033] border border-[#DDE5DD] dark:border-[#334155] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D32] dark:text-[#4CAF50]">
              <Info className="w-4 h-4" /> Destination Details
            </div>
            <p className="text-sm font-bold text-[#1F2937] dark:text-[#F8FAFC]">
              {destination.name}
            </p>
            <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] leading-relaxed">
              {destination.description}
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => alert(`Starting step-by-step navigation to ${destination.name}`)}
            className="w-full py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] dark:bg-[#4CAF50] dark:hover:bg-[#43A047] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors border-none cursor-pointer"
          >
            <MapPin className="w-4 h-4" /> Start Navigation
          </button>
        </div>

      </div>
    </div>
  );
};

export default CampusMapViewer;

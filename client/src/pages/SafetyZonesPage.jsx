import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Shield,
  AlertTriangle,
  Camera,
  Plus,
  X,
  CheckCircle2,
  ExternalLink,
  Layers,
  ArrowRight,
  Sliders,
  Maximize2
} from 'lucide-react';
import { useInspections } from '../context/InspectionContext';

export const SafetyZonesPage = () => {
  const { zones, setZones, cameras, selectedSite, sites } = useInspections();
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [newZone, setNewZone] = useState({
    name: '',
    type: 'Fall Hazard',
    site: sites[0]?.name || 'Apex Tower Project',
    camera: 'CAM-001 (North Scaffolding)',
    desc: 'Mandatory edge fall protection boundary envelope.',
  });

  const navigate = useNavigate();

  const filteredZones = zones.filter(
    (z) => selectedSite === 'All Sites' || z.site === selectedSite
  );

  const handleOpenZoneCam = (camString) => {
    const camId = camString?.split(' ')[0] || 'CAM-001';
    navigate(`/live-cameras?camera=${camId}`);
  };

  const handleAddZoneSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `Z-${zones.length + 1}`,
      name: newZone.name,
      type: newZone.type,
      site: newZone.site,
      camera: newZone.camera,
      status: 'NORMAL',
      breaches: 0,
      color: newZone.type === 'Fall Hazard' ? '#DC2626' : '#0284C7',
      desc: newZone.desc,
    };
    setZones([created, ...zones]);
    setShowAddZoneModal(false);
  };

  const zoneTypeColors = {
    'Fall Hazard': 'bg-red-950 text-red-400 border-red-800',
    'Restricted Area': 'bg-amber-950 text-amber-400 border-amber-800',
    'Machine Exclusion': 'bg-orange-950 text-orange-400 border-orange-800',
    'Worker Staging': 'bg-sky-950 text-sky-400 border-sky-800',
    'Emergency Exit': 'bg-emerald-950 text-emerald-400 border-emerald-800',
    'Material Storage': 'bg-purple-950 text-purple-400 border-purple-800',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-400" />
              Virtual Safety Zones & Perimeter Geofencing
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-sky-300 rounded border border-slate-700">
              AI SPATIAL MAPPING
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Geofenced virtual polygon boundaries monitored 24/7 by computer vision for unauthorized breaches and collision hazards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddZoneModal(true)}
            className="vg-btn-primary text-xs flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create Virtual Zone</span>
          </button>
        </div>
      </div>

      {/* Zone Types Legend Strip */}
      <div className="vg-card p-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-300 mr-2 text-[11px] uppercase tracking-wide">Zone Classifications:</span>
        <span className="px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-semibold text-[11px]">
          ● Fall Hazard
        </span>
        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-semibold text-[11px]">
          ● Restricted Area
        </span>
        <span className="px-2 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800 font-semibold text-[11px]">
          ● Machine Exclusion
        </span>
        <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 font-semibold text-[11px]">
          ● Worker Staging
        </span>
        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold text-[11px]">
          ● Emergency Exit
        </span>
      </div>

      {/* Virtual Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredZones.map((zone) => {
          const isBreached = zone.status?.includes('BREACHED') || zone.status?.includes('CRITICAL');

          return (
            <div
              key={zone.id}
              onClick={() => handleOpenZoneCam(zone.camera)}
              className={`vg-card p-4 flex flex-col justify-between space-y-3 cursor-pointer transition hover:border-slate-600 hover:shadow-xl ${
                isBreached ? 'border-l-4 border-l-red-500 bg-red-950/10' : 'border-l-4 border-l-sky-500'
              }`}
            >
              {/* Top Row: Zone Name & Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                      {zone.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      zoneTypeColors[zone.type] || 'bg-slate-800 text-slate-300'
                    }`}>
                      {zone.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm mt-1.5">{zone.name}</h3>
                </div>

                <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold shrink-0 ${
                  isBreached
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  {zone.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed">
                {zone.desc || 'Optical spatial geofence active.'}
              </p>

              {/* Camera & Site Metadata */}
              <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block font-mono">Camera Feed</span>
                  <span className="font-semibold text-slate-200 flex items-center gap-1">
                    <Camera className="w-3 h-3 text-sky-400" />
                    {zone.camera}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block font-mono">Job Site</span>
                  <span className="font-semibold text-slate-200 truncate max-w-[120px] block">
                    {zone.site}
                  </span>
                </div>
              </div>

              {/* Bottom Action Strip */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-sky-400 font-bold">
                <span>Breaches: <strong className={zone.breaches > 0 ? 'text-red-400' : 'text-slate-300'}>{zone.breaches || 0}</strong></span>
                <span className="flex items-center gap-1 text-[11px] hover:underline">
                  Launch 24/7 CCTV Feed <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Zone Modal */}
      {showAddZoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0F172A] border border-slate-700 rounded-lg shadow-2xl overflow-hidden text-slate-200">
            <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-white text-sm">Define Virtual Safety Zone</h3>
              </div>
              <button
                onClick={() => setShowAddZoneModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddZoneSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Zone Name</label>
                <input
                  type="text"
                  required
                  value={newZone.name}
                  onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                  placeholder="e.g. Scaffolding Leading Edge Buffer"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Zone Classification</label>
                  <select
                    value={newZone.type}
                    onChange={(e) => setNewZone({ ...newZone, type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="Fall Hazard">Fall Hazard</option>
                    <option value="Restricted Area">Restricted Area</option>
                    <option value="Machine Exclusion">Machine Exclusion</option>
                    <option value="Worker Staging">Worker Staging</option>
                    <option value="Emergency Exit">Emergency Exit</option>
                    <option value="Material Storage">Material Storage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Monitored Site</label>
                  <select
                    value={newZone.site}
                    onChange={(e) => setNewZone({ ...newZone, site: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                  >
                    {sites.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Assigned CCTV Camera</label>
                <select
                  value={newZone.camera}
                  onChange={(e) => setNewZone({ ...newZone, camera: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  {cameras.map((c) => (
                    <option key={c.id} value={`${c.id} (${c.name})`}>
                      {c.id} &bull; {c.name} ({c.site})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Safety Protocol / Description</label>
                <textarea
                  rows={2}
                  value={newZone.desc}
                  onChange={(e) => setNewZone({ ...newZone, desc: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddZoneModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="vg-btn-primary text-xs font-bold px-4 py-1.5 shadow-md"
                >
                  Create Zone Boundary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

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
    'Fall Hazard': 'bg-red-50 text-red-700 border-red-200',
    'Restricted Area': 'bg-orange-50 text-orange-700 border-orange-200',
    'Machine Exclusion': 'bg-amber-50 text-amber-700 border-amber-200',
    'Worker Staging': 'bg-blue-50 text-blue-700 border-blue-200',
    'Emergency Exit': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Material Storage': 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-700" />
              Virtual Safety Zones & Perimeter Controls
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              CCTV SPATIAL MAPPING
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Geofenced virtual polygon boundaries monitored 24/7 by neural vision models for unauthorized breaches and collision hazards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddZoneModal(true)}
            className="vg-btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create Virtual Zone</span>
          </button>
        </div>
      </div>

      {/* Zone Types Legend Strip */}
      <div className="vg-card p-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-slate-700 mr-2 text-[11px] uppercase tracking-wide">Supported Zone Types:</span>
        <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-semibold text-[11px]">
          ● Fall Hazard
        </span>
        <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200 font-semibold text-[11px]">
          ● Restricted Area
        </span>
        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[11px]">
          ● Machine Exclusion
        </span>
        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[11px]">
          ● Worker Staging
        </span>
        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
          ● Emergency Exit
        </span>
        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-semibold text-[11px]">
          ● Material Storage
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
              className={`vg-card p-4 flex flex-col justify-between space-y-3 cursor-pointer transition hover:border-slate-400 hover:shadow-md ${
                isBreached ? 'border-l-4 border-l-red-600 bg-red-50/20' : 'border-l-4 border-l-sky-600'
              }`}
            >
              {/* Top Row: Zone Name & Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {zone.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      zoneTypeColors[zone.type] || 'bg-slate-100 text-slate-700'
                    }`}>
                      {zone.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mt-1.5">{zone.name}</h3>
                </div>

                <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold shrink-0 ${
                  isBreached
                    ? 'bg-red-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {zone.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {zone.desc || 'Optical spatial geofence active.'}
              </p>

              {/* Camera & Site Metadata */}
              <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Camera Stream</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1">
                    <Camera className="w-3 h-3 text-slate-500" />
                    {zone.camera}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Site</span>
                  <span className="font-semibold text-slate-800 truncate max-w-[120px] block">
                    {zone.site}
                  </span>
                </div>
              </div>

              {/* Bottom Action Strip */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-sky-700 font-bold">
                <span>Active Breaches: <strong className={zone.breaches > 0 ? 'text-red-600' : 'text-slate-700'}>{zone.breaches || 0}</strong></span>
                <span className="flex items-center gap-1 text-[11px] hover:underline">
                  Launch Camera Stream <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Zone Modal */}
      {showAddZoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden text-slate-800">
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-slate-900 text-sm">Define Virtual Safety Zone</h3>
              </div>
              <button
                onClick={() => setShowAddZoneModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddZoneSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Zone Name</label>
                <input
                  type="text"
                  required
                  value={newZone.name}
                  onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
                  placeholder="e.g. Scaffolding Leading Edge Buffer"
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Zone Classification</label>
                  <select
                    value={newZone.type}
                    onChange={(e) => setNewZone({ ...newZone, type: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-600"
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
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Monitored Site</label>
                  <select
                    value={newZone.site}
                    onChange={(e) => setNewZone({ ...newZone, site: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-600"
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
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Assigned CCTV Camera</label>
                <select
                  value={newZone.camera}
                  onChange={(e) => setNewZone({ ...newZone, camera: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-600"
                >
                  {cameras.map((c) => (
                    <option key={c.id} value={`${c.id} (${c.name})`}>
                      {c.id} &bull; {c.name} ({c.site})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Safety Description / Protocol</label>
                <textarea
                  rows={2}
                  value={newZone.desc}
                  onChange={(e) => setNewZone({ ...newZone, desc: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddZoneModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="vg-btn-primary text-xs font-bold px-4 py-1.5"
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

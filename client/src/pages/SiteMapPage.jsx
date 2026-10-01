import React, { useState } from 'react';
import { MapPin, Camera, AlertTriangle, ShieldCheck, ArrowRight, Layers, Eye, RefreshCw } from 'lucide-react';
import { useInspections, SEED_SITE_MAP_MARKERS } from '../context/InspectionContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { IncidentModal } from '../components/common/IncidentModal';
import { Link } from 'react-router-dom';

export const SiteMapPage = () => {
  const { sites, cameras, incidents } = useInspections();
  const [selectedSiteId, setSelectedSiteId] = useState('ALL');
  const [activeMarker, setActiveMarker] = useState(SEED_SITE_MAP_MARKERS[0]);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const filteredMarkers = selectedSiteId === 'ALL'
    ? SEED_SITE_MAP_MARKERS
    : SEED_SITE_MAP_MARKERS.filter((m) => m.siteId === selectedSiteId);

  const handleOpenIncident = (incId) => {
    const found = incidents.find((i) => i.id === incId);
    if (found) setSelectedIncident(found);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Site Risk Map</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time geospatial hazard matrix and perimeter camera mapping across monitored job sites.
          </p>
        </div>

        {/* Site Filter Toolbar */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Site Filter:</label>
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="bg-white border border-slate-300 text-slate-800 text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-sky-600"
          >
            <option value="ALL">All Active Job Sites ({SEED_SITE_MAP_MARKERS.length} Sensors)</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Map Container & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Canvas */}
        <div className="lg:col-span-2 vg-card p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">Operational Architectural Grid 2D</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500 font-mono text-[11px]">WGS-84 ACTIVE TELEMETRY</span>
            </div>

            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-red-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-red-600" /> Critical
              </span>
              <span className="flex items-center gap-1 text-orange-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-orange-500" /> High
              </span>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Safe
              </span>
            </div>
          </div>

          {/* Interactive Blueprint Surface */}
          <div className="relative mt-4 flex-1 min-h-[420px] bg-slate-900 rounded border border-slate-800 overflow-hidden flex items-center justify-center select-none">
            {/* Architectural Grid Background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Simulated Building Structural Outlines */}
            <div className="absolute inset-10 border border-slate-700/60 rounded flex flex-col justify-between p-6 pointer-events-none">
              <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
                <span>North Elevation Perimeter</span>
                <span>Tower Core & Crane Axis</span>
                <span>East Logistics Gate</span>
              </div>
              <div className="grid grid-cols-3 gap-4 h-48 border-t border-b border-slate-800/80 my-auto py-2">
                <div className="border border-dashed border-slate-700/40 rounded p-2 text-[9px] font-mono text-slate-500">
                  SECTOR A // SCAFFOLDING TIER
                </div>
                <div className="border border-dashed border-slate-700/40 rounded p-2 text-[9px] font-mono text-slate-500">
                  SECTOR B // HEAVY MACHINERY YARD
                </div>
                <div className="border border-dashed border-slate-700/40 rounded p-2 text-[9px] font-mono text-slate-500">
                  SECTOR C // CONCRETE TRENCH POUR
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
                <span>Sub-grade Basement Vault</span>
                <span>Substation 480V Bay</span>
                <span>Material Staging Bay</span>
              </div>
            </div>

            {/* Interactive Pins */}
            {filteredMarkers.map((marker) => {
              const isSelected = activeMarker?.id === marker.id;
              const colorBg =
                marker.severity === 'CRITICAL'
                  ? 'bg-red-600'
                  : marker.severity === 'HIGH'
                  ? 'bg-orange-500'
                  : 'bg-emerald-500';

              return (
                <button
                  key={marker.id}
                  onClick={() => setActiveMarker(marker)}
                  style={{ top: `${marker.y}%`, left: `${marker.x}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all group z-20 ${
                    isSelected ? 'ring-4 ring-white/60 scale-125' : 'hover:scale-110'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full ${colorBg} flex items-center justify-center text-white shadow-md`}>
                    <MapPin className="w-2.5 h-2.5" />
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 -top-6 bg-slate-900 border border-slate-700 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    {marker.label}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Click any node marker to inspect telemetry details and linked CCTV stream.</span>
            <span>Sensor Nodes Active: {filteredMarkers.length}</span>
          </div>
        </div>

        {/* Selected Sensor Node Quick Detail Card */}
        <div className="vg-card p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{activeMarker?.label || 'Select Marker'}</h3>
                <p className="text-[11px] text-slate-500">{activeMarker?.siteName}</p>
              </div>
              {activeMarker && <RiskBadge level={activeMarker.severity} size="sm" />}
            </div>

            {activeMarker ? (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Active Hazard Status</span>
                  <span className="font-semibold text-slate-800 text-sm">{activeMarker.hazard}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                  <div>
                    <span className="font-medium text-slate-700 block">Recommended Action</span>
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{activeMarker.recommendedAction}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Last Telemetry Timestamp</span>
                    <span className="font-mono text-slate-700 font-medium">{activeMarker.timestamp}</span>
                  </div>
                </div>

                {activeMarker.incidentId && (
                  <div className="p-2.5 rounded bg-red-50 border border-red-200 text-red-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold block">Linked Open Incident</span>
                      <span className="text-[11px]">{activeMarker.incidentId}</span>
                    </div>
                    <button
                      onClick={() => handleOpenIncident(activeMarker.incidentId)}
                      className="text-xs bg-red-600 hover:bg-red-700 text-white font-medium px-2.5 py-1 rounded"
                    >
                      View Incident
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Select any camera node on the map to review details.</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 mt-4 space-y-2">
            <Link
              to="/live-monitoring"
              className="vg-btn-primary w-full justify-center text-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Open Live CCTV Matrix</span>
            </Link>
          </div>
        </div>
      </div>

      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
};

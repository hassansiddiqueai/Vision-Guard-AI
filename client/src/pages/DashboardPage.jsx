import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Camera,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  Activity,
  Maximize2,
  HardHat,
  Bot,
  MapPin,
  Layers,
  Radio,
  Eye,
  AlertCircle,
  Users,
  Building,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useInspections } from '../context/InspectionContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { IncidentModal } from '../components/common/IncidentModal';

export const DashboardPage = () => {
  const {
    sites,
    cameras,
    incidents,
    zones,
    selectedSite,
    getStats,
    setIsAssistantOpen,
    acknowledgeEvent,
    resolveEvent
  } = useInspections();

  const [selectedIncident, setSelectedIncident] = useState(null);
  const navigate = useNavigate();
  const stats = getStats();

  const handleOpenIncident = (inc) => {
    setSelectedIncident(inc);
  };

  const handleOpenCam = (camId) => {
    navigate(`/live-cameras?camera=${camId}`);
  };

  // Filtered cameras based on global site selector
  const visibleCameras = selectedSite === 'All Sites'
    ? cameras
    : cameras.filter((c) => c.site === selectedSite);

  // Filtered incidents based on global site selector
  const visibleIncidents = selectedSite === 'All Sites'
    ? incidents
    : incidents.filter((i) => i.site === selectedSite);

  const activeIncidents = visibleIncidents.filter((i) => i.status !== 'CLOSED');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Safety Operations Center
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              SIMULATED / DEMO TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous computer vision monitoring, hazard classification, human verification, and incident resolution tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="vg-btn-secondary text-xs"
            title="Ask AI Safety Assistant"
          >
            <Bot className="w-3.5 h-3.5 text-sky-600" />
            <span>Safety AI Assistant</span>
          </button>
          <Link to="/inspections/new" className="vg-btn-primary text-xs">
            <span>+ New Safety Audit</span>
          </Link>
        </div>
      </div>

      {/* TOP KPI ROW (Requirement 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* ACTIVE SITES */}
        <div className="vg-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Active Sites</span>
            <Building className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {selectedSite === 'All Sites' ? sites.length : '1'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {selectedSite === 'All Sites' ? 'Sites Monitored' : 'Active Site'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block truncate">
            {selectedSite === 'All Sites' ? 'Multi-Site Grid Active' : selectedSite}
          </span>
        </div>

        {/* CAMERAS ONLINE */}
        <div className="vg-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Cameras Online</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-slate-900">{stats.onlineCamerasCount}</span>
            <span className="text-xs text-slate-400 font-mono">/ {stats.totalCamerasCount}</span>
          </div>
          <span className="text-[11px] text-emerald-700 mt-1 block font-medium">
            100% Core Ingestion Active
          </span>
        </div>

        {/* ACTIVE INCIDENTS */}
        <div className={`vg-card p-3.5 border-l-4 ${
          stats.activeIncidentsCount > 0 ? 'border-l-red-600' : 'border-l-emerald-600'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-slate-600 text-[10px] font-bold uppercase tracking-wider">Active Incidents</span>
            <AlertTriangle className={`w-3.5 h-3.5 ${stats.activeIncidentsCount > 0 ? 'text-red-600' : 'text-emerald-600'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-2xl font-bold font-mono ${stats.activeIncidentsCount > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
              {stats.activeIncidentsCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">Open Events</span>
          </div>
          <span className="text-[11px] text-red-600 mt-1 block font-medium">
            {stats.criticalHazards} Critical requiring action
          </span>
        </div>

        {/* WORKERS MONITORED */}
        <div className="vg-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Workers Monitored</span>
            <Users className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-slate-900">{stats.workersMonitored || 127}</span>
            <span className="text-xs text-slate-500">Personnel</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            PPE Compliance: <strong className="text-slate-700 font-mono">{stats.ppeComplianceRate}</strong>
          </span>
        </div>

        {/* SAFETY STATUS */}
        <div className="vg-card p-3.5 border-l-4 border-l-emerald-600 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 text-[10px] font-bold uppercase tracking-wider">Safety Status</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-base font-bold text-emerald-800">
              {stats.criticalHazards > 0 ? 'Hazard Alert' : 'Monitoring Normal'}
            </span>
          </div>
          <span className="text-[11px] text-slate-600 mt-1 block">
            Safety Score: <strong className="font-mono text-slate-800">{stats.siteSafetyScore}/100</strong>
          </span>
        </div>
      </div>

      {/* PROMINENT LIVE CAMERA GRID (Requirement 5) */}
      <div className="vg-card p-4 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <Radio className="w-4 h-4 text-slate-800" />
            <h2 className="text-sm font-bold text-slate-900">Live CCTV Control Matrix</h2>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              ({visibleCameras.length} Active Feeds)
            </span>
          </div>

          <Link
            to="/live-cameras"
            className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1"
          >
            Open Multi-Camera Control Center <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-column responsive grid: Desktop 4-col, Tablet 2-col, Mobile 1-col */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleCameras.slice(0, 4).map((cam) => {
            // Find corresponding incident for this camera if any
            const matchingIncident = incidents.find(
              (inc) => inc.camera?.includes(cam.id) && inc.status !== 'CLOSED'
            ) || incidents.find((inc) => inc.camera?.includes(cam.id));

            return (
              <div
                key={cam.id}
                className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-2xs flex flex-col justify-between hover:border-slate-300 transition"
              >
                {/* Top Meta Bar */}
                <div className="px-3 py-1.5 bg-slate-900 text-white flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-emerald-300">LIVE</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="font-bold text-white">{cam.id}</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">{cam.fps} FPS</span>
                </div>

                {/* Video / High-Res Camera Stream Container */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden group">
                  <img
                    src={cam.feedUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=800&auto=format&fit=crop'}
                    alt={cam.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlaid AI Detection Bounding Boxes & Tags */}
                  {cam.currentRisk === 'CRITICAL' || cam.currentRisk === 'HIGH' ? (
                    <div className="absolute inset-0 pointer-events-none p-2">
                      <div className="border border-red-500 bg-red-500/15 rounded absolute left-[20%] top-[15%] w-[45%] h-[60%] flex flex-col justify-between p-1">
                        <div className="flex flex-col gap-0.5 self-start">
                          <span className="bg-red-600 text-white font-mono font-bold text-[8px] px-1 py-0.5 rounded">
                            PERSON &bull; NO HELMET 94%
                          </span>
                          <span className="bg-amber-600 text-white font-mono font-bold text-[8px] px-1 py-0.5 rounded">
                            RESTRICTED ZONE 88%
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 pointer-events-none p-2">
                      <div className="border border-emerald-500 bg-emerald-500/10 rounded absolute left-[25%] top-[20%] w-[35%] h-[55%] flex flex-col justify-between p-1">
                        <span className="bg-emerald-700 text-white font-mono font-bold text-[8px] px-1 py-0.5 rounded self-start">
                          PERSON &bull; PPE COMPLIANT 98%
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Top-Right Risk Severity Badge */}
                  <div className="absolute top-2 right-2">
                    <RiskBadge level={cam.currentRisk} size="sm" />
                  </div>

                  {/* Stream Status Overlay */}
                  <div className="absolute bottom-1 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded">
                    <span className="truncate">{cam.siteCode || 'SITE'}</span>
                    <span className="text-emerald-400 font-bold">ONLINE</span>
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 truncate">{cam.name}</h3>
                    <p className="text-[11px] text-slate-500 truncate">{cam.site}</p>
                  </div>

                  {/* People / Compliance Metrics */}
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-700 space-y-0.5">
                    <div className="flex justify-between">
                      <span>Detected:</span>
                      <strong className="text-slate-900">7 workers</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>PPE Status:</span>
                      <span className="text-emerald-700 font-semibold">
                        {cam.currentRisk === 'CRITICAL' ? '5 compliant, 1 violation' : '7 fully compliant'}
                      </span>
                    </div>
                  </div>

                  {/* Actions: [OPEN CAMERA] & [VIEW INCIDENT] */}
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                    <button
                      onClick={() => handleOpenCam(cam.id)}
                      className="flex-1 py-1 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-300 transition text-center"
                    >
                      OPEN CAMERA
                    </button>
                    {matchingIncident && (
                      <button
                        onClick={() => handleOpenIncident(matchingIncident)}
                        className="py-1 px-2 rounded bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold border border-red-200 transition"
                      >
                        VIEW INCIDENT
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OPERATIONAL SECTION: Recent Incidents & Safety Zones Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Incidents Table */}
        <div className="lg:col-span-2 vg-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Active Industrial Incidents</h2>
              <p className="text-[11px] text-slate-500">
                Awaiting human confirmation, field acknowledgement, or corrective action.
              </p>
            </div>
            <Link to="/incidents" className="text-xs text-sky-700 hover:text-sky-800 font-bold">
              All Incidents ({visibleIncidents.length}) &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-2 px-3 font-mono">Incident ID</th>
                  <th className="py-2 px-3">Hazard Condition</th>
                  <th className="py-2 px-3">Camera / Site</th>
                  <th className="py-2 px-3">Severity</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleIncidents.slice(0, 5).map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{inc.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-[180px] truncate">
                      {inc.hazard}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-[140px] truncate">
                      {inc.camera} &bull; {inc.site}
                    </td>
                    <td className="py-2.5 px-3">
                      <RiskBadge level={inc.severity} size="sm" />
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        inc.status === 'CLOSED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inc.status === 'ACKNOWLEDGED'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenIncident(inc)}
                          className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-800 font-semibold text-[11px] transition"
                        >
                          VIEW
                        </button>
                        {inc.status === 'DETECTED' && (
                          <button
                            onClick={() => acknowledgeEvent(inc.id)}
                            className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded font-semibold text-[11px] transition"
                          >
                            ACK
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Safety Zones Status Overview */}
        <div className="space-y-4">
          <div className="vg-card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-700" />
                <h2 className="text-sm font-bold text-slate-900">Virtual Safety Zones</h2>
              </div>
              <Link to="/safety-zones" className="text-xs text-sky-700 hover:text-sky-800 font-semibold">
                Manage &rarr;
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              {(zones || []).slice(0, 4).map((z) => (
                <div
                  key={z.id}
                  onClick={() => navigate(`/live-cameras?camera=${z.camera.slice(0, 7)}`)}
                  className="p-2.5 rounded bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: z.color || '#0284C7' }} />
                      <span>{z.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{z.camera} &bull; {z.type}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    z.status?.includes('BREACHED') || z.status?.includes('CRITICAL')
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {z.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Simulation Link */}
          <div className="p-3.5 rounded-md bg-slate-100 border border-slate-300 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Simulation Controls</span>
              <span className="text-[11px] text-slate-500">Test PPE breaches, edge fall risks, and machinery envelopes.</span>
            </div>
            <Link
              to="/settings"
              className="px-2.5 py-1.5 bg-slate-900 text-white rounded text-xs font-bold hover:bg-slate-800 transition"
            >
              Open Controls
            </Link>
          </div>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
};

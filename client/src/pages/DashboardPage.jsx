import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  Zap,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useInspections } from '../context/InspectionContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { IncidentModal } from '../components/common/IncidentModal';
import { CameraStreamPlayer } from '../components/camera/CameraStreamPlayer';

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
  const [pulseTick, setPulseTick] = useState(0);
  const navigate = useNavigate();
  const stats = getStats();

  // Simulated live telemetry pulse tick for equalizer bars
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseTick((prev) => (prev + 1) % 100);
    }, 400);
    return () => clearInterval(interval);
  }, []);

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
      {/* Top Header & Cyber Live Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-sky-400" />
              Industrial Safety Operations Center
            </h1>
            <span className="text-[10px] font-mono px-2.5 py-0.5 bg-emerald-950/80 text-emerald-300 rounded border border-emerald-800 font-bold flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              NEURAL MONITORING ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time computer vision inference, optical boundary telemetry, automated PPE compliance verification, and instant risk alerting.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Live AI Engine Inference Frequency Bar */}
          <div className="hidden xl:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-md font-mono text-[11px] text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span className="text-slate-400">CV INFERENCE:</span>
            <div className="flex items-end gap-0.5 h-3.5 px-1">
              {[8, 14, 11, 16, 9, 13, 17, 12].map((baseH, idx) => {
                const height = Math.min(16, Math.max(4, baseH + Math.sin(pulseTick + idx) * 5));
                return (
                  <span
                    key={idx}
                    style={{ height: `${height}px` }}
                    className="w-1 bg-sky-400 rounded-xs transition-all duration-300"
                  />
                );
              })}
            </div>
            <span className="text-emerald-400 font-bold">30 FPS</span>
          </div>

          <button
            onClick={() => setIsAssistantOpen(true)}
            className="vg-btn-secondary text-xs"
            title="Ask AI Safety Assistant"
          >
            <Bot className="w-3.5 h-3.5 text-sky-400" />
            <span>AI Assistant</span>
          </button>

          <Link to="/inspections/new" className="vg-btn-primary text-xs shadow-lg">
            <Zap className="w-3.5 h-3.5" />
            <span>+ New Safety Audit</span>
          </Link>
        </div>
      </div>

      {/* TOP KPI ROW (Next-Level Glowing Cyber Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* ACTIVE SITES */}
        <div className="vg-cyber-card p-3.5 hover:border-sky-500 transition duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">Active Sites</span>
            <Building className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">
              {selectedSite === 'All Sites' ? sites.length : '1'}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {selectedSite === 'All Sites' ? 'Sites Monitored' : 'Active Facility'}
            </span>
          </div>
          <span className="text-[11px] text-sky-400 mt-1.5 block truncate font-medium">
            {selectedSite === 'All Sites' ? 'Global Grid Synchronized' : selectedSite}
          </span>
        </div>

        {/* CAMERAS ONLINE */}
        <div className="vg-cyber-card p-3.5 hover:border-emerald-500 transition duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">CCTV Ingestion</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono text-emerald-400 tracking-tight">{stats.onlineCamerasCount}</span>
            <span className="text-xs text-slate-500 font-mono">/ {stats.totalCamerasCount} Online</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1.5 block font-medium flex items-center gap-1">
            <Activity className="w-3 h-3 animate-pulse" /> 100% Optical Telemetry Live
          </span>
        </div>

        {/* ACTIVE INCIDENTS */}
        <div className={`vg-cyber-card p-3.5 border-l-4 transition duration-300 ${
          stats.activeIncidentsCount > 0
            ? 'border-l-red-500 hover:border-red-500 shadow-red-950/20'
            : 'border-l-emerald-500 hover:border-emerald-500'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-[10px] font-bold uppercase tracking-wider font-mono">Risk Hazards</span>
            <AlertTriangle className={`w-4 h-4 ${stats.activeIncidentsCount > 0 ? 'text-red-400 animate-bounce' : 'text-emerald-400'}`} />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className={`text-3xl font-bold font-mono ${stats.activeIncidentsCount > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {stats.activeIncidentsCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">Open Events</span>
          </div>
          <span className="text-[11px] text-red-400 mt-1.5 block font-medium">
            {stats.criticalHazards} Critical requiring auditor action
          </span>
        </div>

        {/* WORKERS MONITORED */}
        <div className="vg-cyber-card p-3.5 hover:border-cyan-500 transition duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider font-mono">Field Personnel</span>
            <Users className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1">
            <span className="text-3xl font-bold font-mono text-white tracking-tight">{stats.workersMonitored || 127}</span>
            <span className="text-xs text-slate-400">Tracked</span>
          </div>
          <span className="text-[11px] text-slate-300 mt-1.5 block">
            PPE Compliance: <strong className="text-emerald-400 font-mono font-bold">{stats.ppeComplianceRate}</strong>
          </span>
        </div>

        {/* SAFETY SCORE */}
        <div className="vg-cyber-card p-3.5 border-l-4 border-l-emerald-500 col-span-2 sm:col-span-1 hover:border-emerald-400 transition duration-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 text-[10px] font-bold uppercase tracking-wider font-mono">Site Safety Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold font-mono text-emerald-300 tracking-tight">
              {stats.siteSafetyScore}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
          </div>
          <span className="text-[11px] text-emerald-400 mt-1.5 block font-medium">
            ● Optimal Compliance Range
          </span>
        </div>
      </div>

      {/* PROMINENT LIVE CAMERA MATRIX */}
      <div className="vg-card p-4 space-y-4 border border-slate-800 bg-[#0B1120]/90 backdrop-blur-md shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <Radio className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold text-white tracking-tight">24/7 Live CCTV Operations Matrix</h2>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              ({visibleCameras.length} Active Video Feeds)
            </span>
          </div>

          <Link
            to="/live-cameras"
            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 transition"
          >
            <span>Open Multi-Camera Operations Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-column responsive matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleCameras.slice(0, 4).map((cam) => {
            const matchingIncident = incidents.find(
              (inc) => inc.camera?.includes(cam.id) && inc.status !== 'CLOSED'
            ) || incidents.find((inc) => inc.camera?.includes(cam.id));

            return (
              <div
                key={cam.id}
                className="border border-slate-800/80 rounded-lg overflow-hidden bg-[#0F172A] shadow-xl flex flex-col justify-between hover:border-sky-500/80 hover:shadow-sky-500/10 transition duration-300 group"
              >
                {/* 24/7 Video Stream Player */}
                <CameraStreamPlayer
                  camera={cam}
                  isDetailed={false}
                  showOverlays={true}
                  showZones={false}
                />

                {/* Card Information */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="font-bold text-xs text-white truncate group-hover:text-sky-300 transition-colors">
                      {cam.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate">{cam.site} &bull; {cam.location}</p>
                  </div>

                  {/* People / Compliance Metrics */}
                  <div className="p-2 rounded bg-slate-900/95 border border-slate-800 text-[10px] font-mono text-slate-300 space-y-0.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Personnel Detected:</span>
                      <strong className="text-slate-100">7 workers</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">PPE Classification:</span>
                      <span className="text-emerald-400 font-semibold">
                        {cam.currentRisk === 'CRITICAL' ? '5 compliant, 1 violation' : '7 fully compliant'}
                      </span>
                    </div>
                  </div>

                  {/* Actions: [OPEN STREAM] & [VIEW INCIDENT] */}
                  <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                    <button
                      onClick={() => handleOpenCam(cam.id)}
                      className="flex-1 py-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold border border-slate-700 transition text-center shadow-sm"
                    >
                      OPEN FEED
                    </button>
                    {matchingIncident && (
                      <button
                        onClick={() => handleOpenIncident(matchingIncident)}
                        className="py-1.5 px-2.5 rounded bg-red-950/90 hover:bg-red-900 text-red-300 text-[11px] font-bold border border-red-800 transition shadow-sm animate-pulse"
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
        <div className="lg:col-span-2 vg-card p-4 space-y-3 border border-slate-800 bg-[#0B1120]/90 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-white">Active Industrial Risk Events</h2>
              <p className="text-[11px] text-slate-400">
                Awaiting human confirmation, supervisor verification, or immediate field action.
              </p>
            </div>
            <Link to="/incidents" className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1">
              <span>All Incidents ({visibleIncidents.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3 font-mono">Incident ID</th>
                  <th className="py-2.5 px-3">Hazard Classification</th>
                  <th className="py-2.5 px-3">Camera / Site</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {visibleIncidents.slice(0, 5).map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-sky-400">{inc.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-white max-w-[180px] truncate">
                      {inc.hazard}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 max-w-[140px] truncate">
                      {inc.camera} &bull; {inc.site}
                    </td>
                    <td className="py-2.5 px-3">
                      <RiskBadge level={inc.severity} size="sm" />
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        inc.status === 'CLOSED'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : inc.status === 'ACKNOWLEDGED'
                          ? 'bg-blue-950/80 text-blue-300 border border-blue-800'
                          : 'bg-red-950/80 text-red-300 border border-red-800 animate-pulse'
                      }`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenIncident(inc)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-200 font-semibold text-[11px] transition shadow"
                        >
                          VIEW
                        </button>
                        {inc.status === 'DETECTED' && (
                          <button
                            onClick={() => acknowledgeEvent(inc.id)}
                            className="px-2.5 py-1 bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-700 rounded font-semibold text-[11px] transition shadow"
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
          <div className="vg-card p-4 space-y-3 border border-slate-800 bg-[#0B1120]/90 backdrop-blur-md">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold text-white">Virtual Safety Zones</h2>
              </div>
              <Link to="/safety-zones" className="text-xs text-sky-400 hover:text-sky-300 font-semibold">
                Manage &rarr;
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              {(zones || []).slice(0, 4).map((z) => (
                <div
                  key={z.id}
                  onClick={() => navigate(`/live-cameras?camera=${z.camera.slice(0, 7)}`)}
                  className="p-2.5 rounded bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer transition flex items-center justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-white group-hover:text-sky-300 transition-colors">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: z.color || '#0284C7' }} />
                      <span>{z.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{z.camera} &bull; {z.type}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    z.status?.includes('BREACHED') || z.status?.includes('CRITICAL')
                      ? 'bg-red-950/80 text-red-300 border border-red-800 animate-pulse'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                  }`}>
                    {z.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Simulation Link */}
          <div className="p-3.5 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-between text-xs shadow-lg">
            <div>
              <span className="font-bold text-white block">Simulation Testbench</span>
              <span className="text-[11px] text-slate-400">Trigger simulated safety violations and boundary breaches.</span>
            </div>
            <Link
              to="/settings"
              className="px-3 py-1.5 bg-sky-700 hover:bg-sky-600 text-white rounded text-xs font-bold transition shadow"
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

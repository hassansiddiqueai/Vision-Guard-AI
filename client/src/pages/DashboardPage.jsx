import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Activity,
  Maximize2,
  HardHat,
  Bot,
  Layers,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { useInspections } from '../context/InspectionContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { DemoScenarioToolbar } from '../components/common/DemoScenarioToolbar';
import { IncidentModal } from '../components/common/IncidentModal';

export const DashboardPage = () => {
  const { inspections, incidents, cameras, getStats, setIsAssistantOpen } = useInspections();
  const [selectedIncident, setSelectedIncident] = useState(null);

  const stats = getStats();

  const handleOpenIncident = (inc) => {
    setSelectedIncident(inc);
  };

  return (
    <div className="space-y-6">
      {/* Demo Scenario Bar */}
      <DemoScenarioToolbar />

      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Safety Operations Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous computer vision monitoring, active risk classification, and incident resolution tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAssistantOpen(true)}
            className="vg-btn-secondary text-xs"
          >
            <Bot className="w-3.5 h-3.5 text-sky-600" />
            <span>AI Safety Assistant</span>
          </button>
          <Link to="/inspections/new" className="vg-btn-primary text-xs">
            <span>+ New Inspection</span>
          </Link>
        </div>
      </div>

      {/* Safety Overview: 5 Key Operational Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="vg-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">Cameras Online</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono text-slate-900">{stats.onlineCamerasCount}</span>
            <span className="text-xs text-slate-400">/ {stats.totalCamerasCount}</span>
          </div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block font-medium">100% Core Streams Active</span>
        </div>

        <div className="vg-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-[11px] font-medium uppercase tracking-wider">Active Inspections</span>
            <Activity className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-slate-900">{stats.total}</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Audit Records Logged</span>
        </div>

        <div className="vg-card p-3.5 border-l-4 border-l-red-600">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 text-[11px] font-medium uppercase tracking-wider">Critical Risks</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono text-red-600">{stats.criticalHazards}</span>
            <span className="text-xs text-red-700 font-medium">Requires Action</span>
          </div>
          <span className="text-[11px] text-red-600 mt-0.5 block">Immediate field halt threshold</span>
        </div>

        <div className="vg-card p-3.5 border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 text-[11px] font-medium uppercase tracking-wider">Warnings</span>
            <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-orange-600">{stats.warningHazards}</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Medium & High severity</span>
        </div>

        <div className="vg-card p-3.5 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <span className="text-slate-600 text-[11px] font-medium uppercase tracking-wider">Resolved Today</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-emerald-700">{stats.resolvedTodayCount}</span>
          </div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block">Verified & closed</span>
        </div>
      </div>

      {/* Live Camera Grid (Compact CCTV Matrix) */}
      <div className="vg-card p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-slate-700" />
            <h2 className="text-sm font-semibold text-slate-900">Live CCTV Stream Matrix</h2>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
              SIMULATED HACKATHON FEEDS
            </span>
          </div>
          <Link to="/live-monitoring" className="text-xs text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1">
            View All Fullscreen <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {cameras.slice(0, 4).map((cam) => (
            <div key={cam.id} className="border border-slate-200 rounded overflow-hidden bg-slate-50 flex flex-col">
              <div className="relative aspect-video bg-slate-900">
                <img
                  src={cam.feedUrl}
                  alt={cam.name}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1.5 px-1.5 py-0.5 bg-slate-900/80 rounded text-[10px] font-mono text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LIVE</span>
                </div>
                <div className="absolute top-2 right-2">
                  <RiskBadge level={cam.currentRisk} size="sm" />
                </div>
                <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[10px] font-mono text-slate-300 bg-slate-950/70 px-1.5 py-0.5 rounded">
                  <span>{cam.id}</span>
                  <span>{cam.fps} FPS</span>
                </div>
              </div>

              <div className="p-2.5 flex-1 flex flex-col justify-between text-xs">
                <div>
                  <h3 className="font-semibold text-slate-800 truncate">{cam.name}</h3>
                  <p className="text-[11px] text-slate-500 truncate">{cam.site}</p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Detections: <strong>{cam.activeDetections}</strong></span>
                  <Link to="/live-monitoring" className="text-sky-600 font-medium hover:underline">
                    Inspect Feed
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Middle Grid: Recent Critical Events & Safety Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Critical Events Table */}
        <div className="lg:col-span-2 vg-card p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Recent Critical & High Risk Events</h2>
              <p className="text-[11px] text-slate-500">Events requiring immediate field acknowledgement or verification.</p>
            </div>
            <Link to="/incidents" className="text-xs text-sky-600 hover:text-sky-700 font-medium">
              View All Events ({incidents.length})
            </Link>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3 font-medium">Event ID</th>
                  <th className="py-2 px-3 font-medium">Hazard</th>
                  <th className="py-2 px-3 font-medium">Site / Location</th>
                  <th className="py-2 px-3 font-medium">Severity</th>
                  <th className="py-2 px-3 font-medium">Lifecycle</th>
                  <th className="py-2 px-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incidents.slice(0, 5).map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 font-mono text-slate-600 font-medium">{inc.id}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 max-w-[180px] truncate">{inc.hazard}</td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-[140px] truncate">{inc.site}</td>
                    <td className="py-2.5 px-3">
                      <RiskBadge level={inc.severity} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 font-medium">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        inc.status === 'CLOSED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inc.status === 'VERIFICATION'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleOpenIncident(inc)}
                        className="text-sky-600 hover:text-sky-700 font-medium"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Hazards & Camera Health */}
        <div className="space-y-6">
          {/* Top Recurring Hazards */}
          <div className="vg-card p-4">
            <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-200">
              Top Monitored Hazards
            </h2>
            <div className="mt-3 space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Scaffolding Structural Void</span>
                  <span className="font-mono font-medium">38%</span>
                </div>
                <div className="w-full bg-slate-100 rounded h-1.5">
                  <div className="bg-red-600 h-1.5 rounded" style={{ width: '38%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Machinery Envelope Proximity</span>
                  <span className="font-mono font-medium">27%</span>
                </div>
                <div className="w-full bg-slate-100 rounded h-1.5">
                  <div className="bg-orange-500 h-1.5 rounded" style={{ width: '27%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>Uncapped Rebar Impalement</span>
                  <span className="font-mono font-medium">19%</span>
                </div>
                <div className="w-full bg-slate-100 rounded h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded" style={{ width: '19%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span>PPE Vest / Helmet Compliance</span>
                  <span className="font-mono font-medium">16%</span>
                </div>
                <div className="w-full bg-slate-100 rounded h-1.5">
                  <div className="bg-sky-600 h-1.5 rounded" style={{ width: '16%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Camera Health Monitor */}
          <div className="vg-card p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">Camera Health Status</h2>
              <span className="text-[11px] text-slate-500 font-mono">ALL SENSORS</span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              {cameras.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                  <div>
                    <span className="font-medium text-slate-800 block">{c.id}</span>
                    <span className="text-[11px] text-slate-500 truncate max-w-[140px] block">{c.name}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      c.status === 'ONLINE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
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

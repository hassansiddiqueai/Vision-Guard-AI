import React from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle,
  Camera,
  Layers,
  Activity,
  CheckCircle2,
  HardHat,
  Radio
} from 'lucide-react';
import { useInspections } from '../context/InspectionContext';

export const AnalyticsPage = () => {
  const { getStats, cameras, sites, incidents, selectedSite } = useInspections();
  const stats = getStats();

  const weeklyData = [
    { day: 'Mon', count: 18, critical: 3, resolved: 14 },
    { day: 'Tue', count: 24, critical: 2, resolved: 20 },
    { day: 'Wed', count: 19, critical: 4, resolved: 16 },
    { day: 'Thu', count: 28, critical: 1, resolved: 25 },
    { day: 'Fri', count: 32, critical: 5, resolved: 26 },
    { day: 'Sat', count: 14, critical: 0, resolved: 14 },
    { day: 'Sun', count: 11, critical: 1, resolved: 10 },
  ];

  const categoryDistribution = [
    { category: 'Fall Hazard / Leading Edge', count: 12, pct: 36, color: 'bg-red-600' },
    { category: 'Heavy Machine Proximity Arc', count: 9, pct: 28, color: 'bg-orange-500' },
    { category: 'PPE Helmet & Vest Compliance', count: 7, pct: 22, color: 'bg-amber-500' },
    { category: 'Emergency Exit Corridor Egress', count: 5, pct: 14, color: 'bg-sky-600' },
  ];

  const zoneDistribution = [
    { zone: 'Apex Tower (Elevated Scaffolding Sector)', risks: 6, percentage: 38, color: 'bg-red-600' },
    { zone: 'Harbor Gateway (Machinery Yard 3)', risks: 4, percentage: 25, color: 'bg-orange-500' },
    { zone: 'Eastside Medical (Basement Trench Bay)', risks: 3, percentage: 19, color: 'bg-amber-500' },
    { zone: 'Substation 4 (480V Distribution Vault)', risks: 3, percentage: 18, color: 'bg-sky-600' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sky-700" />
              Safety Intelligence & Risk Analytics
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300 font-bold">
              DEMO ANALYTICS
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical breakdown of computer vision hazard frequencies, PPE compliance velocity, and site risk profiles.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded border border-slate-200">
          <span>PERIOD: LAST 7 DAYS &bull; {selectedSite}</span>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="vg-card p-3.5">
          <span className="text-[10px] font-bold uppercase text-slate-500 block font-mono">PPE Compliance Index</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-700">{stats.ppeComplianceRate}</span>
          </div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block font-medium">Headwear, High-Vis & Harness</span>
        </div>

        <div className="vg-card p-3.5">
          <span className="text-[10px] font-bold uppercase text-slate-500 block font-mono">Avg Resolution Velocity</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">2.4 hrs</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Detection &rarr; Human Verification</span>
        </div>

        <div className="vg-card p-3.5 border-l-4 border-l-red-600">
          <span className="text-[10px] font-bold uppercase text-slate-600 block font-mono">Critical Incidents (7d)</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-red-600">16</span>
          </div>
          <span className="text-[11px] text-red-600 mt-0.5 block font-medium">14 verified & closed</span>
        </div>

        <div className="vg-card p-3.5 border-l-4 border-l-emerald-600">
          <span className="text-[10px] font-bold uppercase text-slate-600 block font-mono">Camera Stream Uptime</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-700">99.8%</span>
          </div>
          <span className="text-[11px] text-emerald-700 mt-0.5 block font-medium">18/18 Online Feeds</span>
        </div>
      </div>

      {/* 2x2 Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Incidents Over Time Bar Chart */}
        <div className="vg-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Incidents Over Time (7-Day Volume)</h2>
              <p className="text-[11px] text-slate-500">Daily detections vs verified corrective resolutions.</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 bg-slate-300 rounded-xs" /> Detected
              </span>
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-xs" /> Resolved
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-end justify-between h-48 gap-2 pt-4 px-2">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center gap-1 h-36">
                  <div
                    className="w-4 bg-slate-300 hover:bg-slate-400 rounded-t transition"
                    style={{ height: `${(d.count / 35) * 100}%` }}
                    title={`Detected: ${d.count}`}
                  />
                  <div
                    className="w-4 bg-emerald-600 hover:bg-emerald-700 rounded-t transition"
                    style={{ height: `${(d.resolved / 35) * 100}%` }}
                    title={`Resolved: ${d.resolved}`}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-600 font-bold">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hazard Risk Distribution by Job Site Zone */}
        <div className="vg-card p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Risk Concentration by Virtual Zone</h2>
              <p className="text-[11px] text-slate-500">Spatial distribution of safety anomalies across monitored sectors.</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {zoneDistribution.map((z) => (
              <div key={z.zone} className="text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-800">{z.zone}</span>
                  <span className="font-mono text-slate-700 font-bold">{z.percentage}% ({z.risks} events)</span>
                </div>
                <div className="w-full bg-slate-100 rounded h-2">
                  <div className={`${z.color} h-2 rounded`} style={{ width: `${z.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incidents by Category */}
        <div className="vg-card p-4 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Incidents by Hazard Category</h2>
              <p className="text-[11px] text-slate-500">Classification of recurring industrial risks.</p>
            </div>
          </div>

          <div className="space-y-3">
            {categoryDistribution.map((cat) => (
              <div key={cat.category} className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                  <span className="font-bold text-slate-800">{cat.category}</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{cat.count} events ({cat.pct}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* System & Optical Pipeline Health Summary */}
        <div className="vg-card p-4 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900">System Telemetry & Health Audit</h2>
              <p className="text-[11px] text-slate-500">Hardware and neural inference latency measurements.</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">VISION ENGINE</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> ONLINE
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">CAMERA CONNECTIONS</span>
              <span className="text-slate-900 font-bold font-mono">18/18 ONLINE</span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">VIDEO PIPELINE</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="font-semibold text-slate-700">MEASURED LATENCY</span>
              <span className="text-slate-900 font-mono font-bold">84ms (Target: &lt;100ms)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
} from 'lucide-react';
import { useInspections } from '../context/InspectionContext';

export const AnalyticsPage = () => {
  const { getStats, cameras, sites } = useInspections();
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

  const zoneDistribution = [
    { zone: 'Apex Tower (Elevated Scaffolding)', risks: 6, percentage: 38, color: 'bg-red-600' },
    { zone: 'Harbor Gateway (Machinery Yard 3)', risks: 4, percentage: 25, color: 'bg-orange-500' },
    { zone: 'Eastside Medical (Basement Trench)', risks: 3, percentage: 19, color: 'bg-amber-500' },
    { zone: 'Substation 4 (480V Distribution Bay)', risks: 3, percentage: 18, color: 'bg-sky-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Safety Risk Analytics & Telemetry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical aggregation of hazard frequencies, OSHA violation trends, and incident resolution velocity.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span>REPORTING PERIOD: LAST 7 DAYS</span>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="vg-card p-4">
          <span className="text-[11px] font-medium uppercase text-slate-500 block">Overall PPE Compliance</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-700">{stats.ppeComplianceRate}</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">Headwear, High-Vis & Harness</span>
        </div>

        <div className="vg-card p-4">
          <span className="text-[11px] font-medium uppercase text-slate-500 block">Avg Incident Resolution Time</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">2.4 hrs</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">From detection to verification</span>
        </div>

        <div className="vg-card p-4">
          <span className="text-[11px] font-medium uppercase text-slate-500 block">Total Critical Incidents (7d)</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-red-600">16</span>
          </div>
          <span className="text-[11px] text-red-600 mt-1 block">14 verified & closed</span>
        </div>

        <div className="vg-card p-4">
          <span className="text-[11px] font-medium uppercase text-slate-500 block">Optical Engine Uptime</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">99.8%</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Across 6 CCTV streams</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Risk Events Bar Chart */}
        <div className="vg-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Risk Events & Remediation (7 Days)</h2>
              <p className="text-[11px] text-slate-500">Daily detection volume vs resolved incidents.</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 bg-slate-300 rounded-xs" /> Detected
              </span>
              <span className="flex items-center gap-1 text-emerald-700">
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
                <span className="text-[11px] font-mono text-slate-500">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hazard Risk Distribution by Site Zone */}
        <div className="vg-card p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Hazard Distribution by Job Site Zone</h2>
              <p className="text-[11px] text-slate-500">Concentration of active and historical anomalies.</p>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {zoneDistribution.map((z) => (
              <div key={z.zone} className="text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-slate-800">{z.zone}</span>
                  <span className="font-mono text-slate-600 font-semibold">{z.percentage}% ({z.risks} risks)</span>
                </div>
                <div className="w-full bg-slate-100 rounded h-2">
                  <div className={`${z.color} h-2 rounded`} style={{ width: `${z.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600">
            <strong>Key Analytical Finding:</strong> 38% of high-severity incidents originate on elevated scaffolding tiers during shift changeover periods. Mandatory pre-shift coupling checks recommended.
          </div>
        </div>
      </div>
    </div>
  );
};

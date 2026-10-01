import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import {
  ClipboardList,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Plus,
  ArrowRight,
  ChevronRight,
  Activity,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  Server,
  Database,
  Cpu,
  Radio,
  RotateCcw,
  Cctv,
  Award,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage = () => {
  const { inspections, getStats, resetDemo } = useInspections();
  const navigate = useNavigate();
  const [selectedSiteFilter, setSelectedSiteFilter] = useState('ALL');
  const [chartRange, setChartRange] = useState('7d');

  const stats = getStats();

  const filteredInspections = inspections.filter((insp) => {
    if (selectedSiteFilter === 'ALL') return true;
    return insp.site.includes(selectedSiteFilter);
  });

  const getSeverityBadge = (severity) => {
    const s = (severity || 'LOW').toUpperCase();
    if (s === 'CRITICAL') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          CRITICAL
        </span>
      );
    }
    if (s === 'HIGH') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          HIGH
        </span>
      );
    }
    if (s === 'MEDIUM') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
          MEDIUM
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        LOW / SAFE
      </span>
    );
  };

  // Activity trend mock data scaling based on filter
  const activityDays = chartRange === '7d'
    ? [
        { day: 'Mon', count: 18, critical: 2, resolved: 14 },
        { day: 'Tue', count: 24, critical: 4, resolved: 20 },
        { day: 'Wed', count: 32, critical: 3, resolved: 28 },
        { day: 'Thu', count: 28, critical: 1, resolved: 26 },
        { day: 'Fri', count: 35, critical: 5, resolved: 30 },
        { day: 'Sat', count: 20, critical: 2, resolved: 18 },
        { day: 'Sun', count: 15, critical: 1, resolved: 14 },
      ]
    : chartRange === '30d'
    ? [
        { day: 'W1', count: 95, critical: 12, resolved: 80 },
        { day: 'W2', count: 120, critical: 16, resolved: 105 },
        { day: 'W3', count: 140, critical: 14, resolved: 125 },
        { day: 'W4', count: 110, critical: 9, resolved: 98 },
      ]
    : [
        { day: 'Jul', count: 380, critical: 45, resolved: 330 },
        { day: 'Aug', count: 420, critical: 38, resolved: 385 },
        { day: 'Sep', count: 460, critical: 32, resolved: 430 },
      ];

  const maxVolume = Math.max(...activityDays.map((d) => d.count), 40);

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span>Industrial Safety Operations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Safety Control Center Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time monitoring of workplace hazards, active camera telemetry, and regulatory compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Site Filter */}
          <select
            value={selectedSiteFilter}
            onChange={(e) => setSelectedSiteFilter(e.target.value)}
            className="py-1.5 px-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 font-mono focus:outline-none"
          >
            <option value="ALL">All Project Sites</option>
            <option value="Apex Tower">Apex Tower</option>
            <option value="Harbor Gateway">Harbor Gateway</option>
            <option value="Eastside Medical">Eastside Medical</option>
            <option value="Industrial Park">Industrial Park</option>
          </select>

          <button
            onClick={() => {
              if (window.confirm('Reset demo state to default baseline?')) {
                resetDemo();
              }
            }}
            title="Reset demo data"
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition text-xs flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          <Link
            to="/inspections/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ New Inspection</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Site Safety Score */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>SAFETY SCORE</span>
            <Award className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2">
            <span
              className={`text-2xl font-bold font-mono ${
                stats.siteSafetyScore > 85
                  ? 'text-emerald-400'
                  : stats.siteSafetyScore > 70
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {stats.siteSafetyScore}
            </span>
            <span className="text-xs text-slate-400 font-mono"> / 100</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>+2.4% vs last week</span>
          </div>
        </div>

        {/* Total Inspections */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>TOTAL AUDITS</span>
            <ClipboardList className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold font-mono text-white">{stats.total}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Field & Live Vision Scans</span>
        </div>

        {/* Critical Hazards */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>CRITICAL</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold font-mono text-rose-400">{stats.criticalHazards}</span>
          </div>
          <span className="text-[10px] text-rose-400/80 font-mono">Immediate Action Req.</span>
        </div>

        {/* Open Incidents */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>OPEN ACTIONS</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold font-mono text-amber-400">{stats.openIssues}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Assigned to site leads</span>
        </div>

        {/* PPE Compliance */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>PPE COMPLIANCE</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">{stats.ppeComplianceRate}</span>
          </div>
          <span className="text-[10px] text-emerald-400/80 font-mono">OSHA 1926 Target &gt;90%</span>
        </div>

        {/* Active Cameras */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>CCTV FEEDS</span>
            <Cctv className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-bold font-mono text-white">{stats.activeCamerasCount}</span>
            <span className="text-xs text-slate-400 font-mono"> / 4 Online</span>
          </div>
          <Link to="/live-monitoring" className="text-[10px] text-sky-400 hover:underline font-mono">
            Open Control Wall →
          </Link>
        </div>
      </div>

      {/* Main Grid: Activity Graph + Hazard Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Inspection Volume Activity Bar Chart */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200">
                Inspection & Safety Velocity
              </h3>
              <p className="text-xs text-slate-400">
                Computer vision scan volume and hazard remediations
              </p>
            </div>

            {/* Time range selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
              {['7d', '30d', '90d'].map((r) => (
                <button
                  key={r}
                  onClick={() => setChartRange(r)}
                  className={`px-2 py-0.5 rounded transition ${
                    chartRange === r
                      ? 'bg-sky-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Industrial Bar Chart */}
          <div className="pt-4 h-52 flex items-end justify-between gap-3 px-2 border-b border-slate-800">
            {activityDays.map((item, idx) => {
              const heightPct = Math.round((item.count / maxVolume) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* Volume Bar */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[32px] bg-slate-800 group-hover:bg-sky-500 transition-all rounded-t relative flex items-start justify-center"
                    >
                      <span className="text-[10px] font-mono text-slate-300 opacity-0 group-hover:opacity-100 transition absolute -top-5">
                        {item.count}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{item.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <span>Average Resolution SLA: <strong className="text-slate-200">1.8 hrs</strong></span>
            <span>AI Inference Accuracy: <strong className="text-sky-400">98.4%</strong></span>
          </div>
        </div>

        {/* Right 4 Cols: Hazard Severity Distribution */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Hazard Distribution</h3>
            <p className="text-xs text-slate-400">Breakdown across all active sites</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {/* Critical */}
            <div>
              <div className="flex justify-between mb-1 text-[11px]">
                <span className="text-rose-400 font-bold">Critical</span>
                <span className="text-slate-300">{stats.riskCounts.CRITICAL}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${Math.min(100, stats.riskCounts.CRITICAL * 25)}%` }}
                />
              </div>
            </div>

            {/* High */}
            <div>
              <div className="flex justify-between mb-1 text-[11px]">
                <span className="text-amber-400 font-bold">High</span>
                <span className="text-slate-300">{stats.riskCounts.HIGH}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${Math.min(100, stats.riskCounts.HIGH * 25)}%` }}
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between mb-1 text-[11px]">
                <span className="text-yellow-400 font-bold">Medium</span>
                <span className="text-slate-300">{stats.riskCounts.MEDIUM}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full"
                  style={{ width: `${Math.min(100, stats.riskCounts.MEDIUM * 25)}%` }}
                />
              </div>
            </div>

            {/* Low / Safe */}
            <div>
              <div className="flex justify-between mb-1 text-[11px]">
                <span className="text-emerald-400 font-bold">Low / Verified Safe</span>
                <span className="text-slate-300">{stats.riskCounts.LOW + stats.riskCounts.SAFE}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: '85%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Inspections Table */}
      <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Recent Field Audits</h3>
            <p className="text-xs text-slate-400">Latest telemetry captures and inspection records</p>
          </div>
          <Link
            to="/inspections"
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>View All Records</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-slate-500 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">ID / Scope</th>
                <th className="py-2.5 px-3">Site & Location</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Risk Rating</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredInspections.slice(0, 5).map((insp) => (
                <tr
                  key={insp.id}
                  onClick={() => navigate(`/inspections/${insp.id}`)}
                  className="hover:bg-slate-850/40 transition cursor-pointer group"
                >
                  <td className="py-3 px-3">
                    <span className="font-mono text-[10px] text-sky-400 block font-semibold">
                      {insp.id}
                    </span>
                    <span className="font-semibold text-slate-200 group-hover:text-sky-400 transition truncate block max-w-xs">
                      {insp.name}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <span className="block font-medium">{insp.site}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{insp.location}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {new Date(insp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getSeverityBadge(insp.riskLevel)}
                  </td>
                  <td className="py-3 px-3 font-mono text-sky-400 font-bold whitespace-nowrap">
                    {insp.overallConfidence || 95}%
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <Link
                      to={`/inspections/${insp.id}`}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

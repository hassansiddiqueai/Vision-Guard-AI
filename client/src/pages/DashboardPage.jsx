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
} from 'lucide-react';

export const DashboardPage = () => {
  const { inspections, getStats } = useInspections();
  const navigate = useNavigate();
  const [selectedSiteFilter, setSelectedSiteFilter] = useState('ALL');

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
      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
        LOW / SAFE
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor inspection activity, hazards, and compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
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

          <Link
            to="/inspections/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ New Inspection</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inspections */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>TOTAL INSPECTIONS</span>
            <ClipboardList className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">{stats.total}</span>
            <span className="text-[11px] text-emerald-400 font-mono">Completed</span>
          </div>
          <p className="text-[11px] text-slate-400">Active site surveillance records</p>
        </div>

        {/* Critical Hazards */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>CRITICAL HAZARDS</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-rose-400">{stats.criticalHazards}</span>
            <span className="text-[11px] text-rose-400 font-mono">Immediate Action</span>
          </div>
          <p className="text-[11px] text-slate-400">Imminent structural / safety threats</p>
        </div>

        {/* Open Issues */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>OPEN ISSUES</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-400">{stats.openIssues}</span>
            <span className="text-[11px] text-amber-400 font-mono">Pending Remediation</span>
          </div>
          <p className="text-[11px] text-slate-400">Assigned corrective action items</p>
        </div>

        {/* Compliance Rate */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>COMPLIANCE RATE</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-emerald-400">{stats.complianceRate}</span>
            <span className="text-[11px] text-slate-400 font-mono">OSHA Benchmark</span>
          </div>
          <p className="text-[11px] text-slate-400">Resolved safety items proportion</p>
        </div>
      </div>

      {/* Grid: Inspection Activity & Hazard Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inspection Activity Trend Chart */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Inspection Activity</h3>
              <p className="text-xs text-slate-400">Weekly visual inspection volume & completed audits</p>
            </div>
            <span className="text-xs font-mono text-slate-400">LAST 7 DAYS</span>
          </div>

          {/* Clean Activity Bar Visualization */}
          <div className="pt-2">
            <div className="h-44 flex items-end justify-between gap-3 px-2 border-b border-slate-800 pb-2">
              {[
                { day: 'Mon', count: 12, critical: 2 },
                { day: 'Tue', count: 18, critical: 4 },
                { day: 'Wed', count: 15, critical: 1 },
                { day: 'Thu', count: 24, critical: 6 },
                { day: 'Fri', count: 28, critical: 3 },
                { day: 'Sat', count: 14, critical: 2 },
                { day: 'Sun', count: 8, critical: 0 },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition">
                    {bar.count}
                  </div>
                  <div className="w-full bg-slate-800 rounded-t overflow-hidden flex flex-col justify-end" style={{ height: `${(bar.count / 30) * 100}%` }}>
                    {bar.critical > 0 && (
                      <div
                        className="w-full bg-rose-500/80"
                        style={{ height: `${(bar.critical / bar.count) * 100}%` }}
                        title={`${bar.critical} Critical`}
                      />
                    )}
                    <div className="w-full bg-sky-500/80 flex-1" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{bar.day}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-3">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
                  Standard Audits
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                  Critical Violations
                </span>
              </div>
              <span>AVG INFERENCE: 840MS</span>
            </div>
          </div>
        </div>

        {/* Hazard Distribution Breakdown */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Hazard Distribution</h3>
            <p className="text-xs text-slate-400">Severity tier breakdown across sites</p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Critical Hazards', count: stats.riskCounts.CRITICAL, color: 'bg-rose-500', text: 'text-rose-400' },
              { label: 'High Risk', count: stats.riskCounts.HIGH, color: 'bg-amber-500', text: 'text-amber-400' },
              { label: 'Medium Risk', count: stats.riskCounts.MEDIUM, color: 'bg-yellow-500', text: 'text-yellow-400' },
              { label: 'Low / Safe', count: stats.riskCounts.LOW, color: 'bg-emerald-500', text: 'text-emerald-400' },
            ].map((row) => {
              const pct = stats.total > 0 ? Math.round((row.count / stats.total) * 100) : 0;
              return (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className={row.text}>{row.label}</span>
                    <span className="text-slate-300 font-semibold">{row.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className={`${row.color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <Link
              to="/hazards"
              className="text-xs text-sky-400 hover:text-sky-300 font-mono flex items-center justify-between"
            >
              <span>Manage All Open Hazards</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Recent Inspections & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Inspections Table */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-200">Recent Inspections</h3>
              <p className="text-xs text-slate-400">Latest site scans and audit outcomes</p>
            </div>
            <Link
              to="/inspections"
              className="text-xs font-mono text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Inspection ID</th>
                  <th className="py-2.5 px-4">Location / Site</th>
                  <th className="py-2.5 px-4">Date</th>
                  <th className="py-2.5 px-4">Inspector</th>
                  <th className="py-2.5 px-4">Risk Level</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredInspections.slice(0, 4).map((insp) => (
                  <tr
                    key={insp.id}
                    onClick={() => navigate(`/inspections/${insp.id}`)}
                    className="hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="py-3 px-4 font-semibold text-sky-400">{insp.id}</td>
                    <td className="py-3 px-4 font-sans text-slate-200 truncate max-w-[180px]">
                      {insp.site}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(insp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-sans">{insp.inspector}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{getSeverityBadge(insp.riskLevel)}</td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <Link
                        to={`/inspections/${insp.id}`}
                        onClick={(e) => e.stopPropagation()}
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

        {/* System Health Status Panel */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200">System Infrastructure</h3>
            <p className="text-xs text-slate-400">Core neural & database operational status</p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'AI Vision Neural Engine', sub: 'Gemini 2.5 Flash Multimodal', status: 'Operational', icon: Cpu },
              { name: 'Vision API Gateway', sub: 'Express Ingestion Buffer', status: 'Operational', icon: Radio },
              { name: 'Backend Cluster', sub: 'Node.js Core Microservice', status: 'Operational', icon: Server },
              { name: 'PostgreSQL Database', sub: 'Supabase Data Matrix', status: 'Operational', icon: Database },
            ].map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">{srv.name}</p>
                      <p className="text-[10px] text-slate-400">{srv.sub}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {srv.status}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>UPTIME: 99.98%</span>
            <span>ENCRYPTED (256-BIT)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

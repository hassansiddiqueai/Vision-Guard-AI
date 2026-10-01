import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import {
  ClipboardList,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Plus,
  ChevronRight,
  Activity,
  Award,
  CheckCircle2,
  Clock,
  RotateCcw,
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

  const getRiskBadge = (severity) => {
    const s = (severity || 'LOW').toUpperCase();
    if (s === 'CRITICAL') return <span className="vg-badge-critical">CRITICAL</span>;
    if (s === 'HIGH') return <span className="vg-badge-high">HIGH</span>;
    if (s === 'MEDIUM') return <span className="vg-badge-medium">MEDIUM</span>;
    return <span className="vg-badge-safe">LOW</span>;
  };

  const activityDays = chartRange === '7d'
    ? [
        { day: 'Mon', count: 18 },
        { day: 'Tue', count: 24 },
        { day: 'Wed', count: 32 },
        { day: 'Thu', count: 28 },
        { day: 'Fri', count: 35 },
        { day: 'Sat', count: 20 },
        { day: 'Sun', count: 15 },
      ]
    : chartRange === '30d'
    ? [
        { day: 'Week 1', count: 95 },
        { day: 'Week 2', count: 120 },
        { day: 'Week 3', count: 140 },
        { day: 'Week 4', count: 110 },
      ]
    : [
        { day: 'Jul', count: 380 },
        { day: 'Aug', count: 420 },
        { day: 'Sep', count: 460 },
      ];

  const maxVolume = Math.max(...activityDays.map((d) => d.count), 40);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#243247]">
        <div>
          <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#F1F5F9] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-[13px] text-[#94A3B8] mt-0.5">
            Monitor inspections, hazards, and corrective actions across active sites.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Site Filter */}
          <select
            value={selectedSiteFilter}
            onChange={(e) => setSelectedSiteFilter(e.target.value)}
            className="py-1.5 px-2.5 bg-[#111C2E] border border-[#243247] rounded-md text-[13px] text-[#F1F5F9] focus:outline-none focus:border-[#22C7E8]"
          >
            <option value="ALL">All Sites</option>
            <option value="Apex Tower">Apex Tower</option>
            <option value="Harbor Gateway">Harbor Gateway</option>
            <option value="Eastside Medical">Eastside Medical</option>
            <option value="Industrial Park">Industrial Park</option>
          </select>

          <Link to="/inspections/new" className="vg-btn-primary">
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Inspection</span>
          </Link>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total Inspections */}
        <div className="vg-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-[12px] font-medium">
            <span>Total Inspections</span>
            <ClipboardList className="w-4 h-4 text-[#64748B]" />
          </div>
          <div className="my-1.5">
            <span className="text-[26px] font-semibold text-[#F1F5F9] leading-none">
              {stats.total}
            </span>
          </div>
          <span className="text-[12px] text-[#22C55E] font-medium">+12% this week</span>
        </div>

        {/* Critical Hazards */}
        <div className="vg-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-[12px] font-medium">
            <span>Critical Hazards</span>
            <Flame className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="my-1.5">
            <span className="text-[26px] font-semibold text-[#EF4444] leading-none">
              {stats.criticalHazards}
            </span>
          </div>
          <span className="text-[12px] text-[#94A3B8]">Requires immediate action</span>
        </div>

        {/* Open Issues */}
        <div className="vg-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-[12px] font-medium">
            <span>Open Issues</span>
            <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="my-1.5">
            <span className="text-[26px] font-semibold text-[#F59E0B] leading-none">
              {stats.openIssues}
            </span>
          </div>
          <span className="text-[12px] text-[#94A3B8]">Assigned to site leads</span>
        </div>

        {/* Safety Score */}
        <div className="vg-card p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#94A3B8] text-[12px] font-medium">
            <span>Safety Score</span>
            <Award className="w-4 h-4 text-[#22C7E8]" />
          </div>
          <div className="my-1.5">
            <span className="text-[26px] font-semibold text-[#F1F5F9] leading-none">
              {stats.siteSafetyScore}
              <span className="text-[14px] font-normal text-[#94A3B8]"> / 100</span>
            </span>
          </div>
          <span className="text-[12px] text-[#22C55E] font-medium">Site compliant</span>
        </div>
      </div>

      {/* Main Grid: Activity Chart + Hazard Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 8 Cols: Activity Chart */}
        <div className="lg:col-span-8 vg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-[#F1F5F9]">Inspection Activity</h2>
              <p className="text-[12px] text-[#94A3B8]">Weekly inspection volume over time</p>
            </div>

            {/* Time range tabs */}
            <div className="flex items-center gap-1 bg-[#0B1220] p-0.5 rounded border border-[#243247] text-[11px]">
              {['7d', '30d', '90d'].map((r) => (
                <button
                  key={r}
                  onClick={() => setChartRange(r)}
                  className={`px-2 py-0.5 rounded transition ${
                    chartRange === r
                      ? 'bg-[#1E293B] text-[#F1F5F9] font-medium'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Simple Clean Bar Chart */}
          <div className="pt-4 h-44 flex items-end justify-between gap-2 px-1 border-b border-[#243247]">
            {activityDays.map((item, idx) => {
              const heightPct = Math.round((item.count / maxVolume) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="w-full flex items-end justify-center h-full">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full max-w-[28px] bg-[#1E293B] group-hover:bg-[#22C7E8] transition-colors rounded-t"
                    />
                  </div>
                  <span className="text-[11px] text-[#94A3B8]">{item.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[12px] text-[#94A3B8] pt-1">
            <span>Average Resolution Time: <strong className="text-[#F1F5F9]">1.8 hrs</strong></span>
            <span>PPE Compliance Rate: <strong className="text-[#22C55E]">92.4%</strong></span>
          </div>
        </div>

        {/* Right 4 Cols: Hazard Distribution */}
        <div className="lg:col-span-4 vg-card p-4 space-y-3">
          <div>
            <h2 className="text-[15px] font-semibold text-[#F1F5F9]">Hazard Distribution</h2>
            <p className="text-[12px] text-[#94A3B8]">Breakdown by severity status</p>
          </div>

          <div className="space-y-2.5 text-[12px]">
            {/* Critical */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#EF4444] font-medium">Critical</span>
                <span className="text-[#F1F5F9]">{stats.riskCounts.CRITICAL}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#0B1220] overflow-hidden">
                <div
                  className="h-full bg-[#EF4444] rounded-full"
                  style={{ width: `${Math.min(100, stats.riskCounts.CRITICAL * 25)}%` }}
                />
              </div>
            </div>

            {/* High */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#F59E0B] font-medium">High</span>
                <span className="text-[#F1F5F9]">{stats.riskCounts.HIGH}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#0B1220] overflow-hidden">
                <div
                  className="h-full bg-[#F59E0B] rounded-full"
                  style={{ width: `${Math.min(100, stats.riskCounts.HIGH * 25)}%` }}
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#EAB308] font-medium">Medium</span>
                <span className="text-[#F1F5F9]">{stats.riskCounts.MEDIUM}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#0B1220] overflow-hidden">
                <div
                  className="h-full bg-[#EAB308] rounded-full"
                  style={{ width: `${Math.min(100, stats.riskCounts.MEDIUM * 25)}%` }}
                />
              </div>
            </div>

            {/* Low / Safe */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#22C55E] font-medium">Low / Safe</span>
                <span className="text-[#F1F5F9]">{stats.riskCounts.LOW + stats.riskCounts.SAFE}</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#0B1220] overflow-hidden">
                <div className="h-full bg-[#22C55E] rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Inspections Table */}
      <div className="vg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-[#F1F5F9]">Recent Inspections</h2>
            <p className="text-[12px] text-[#94A3B8]">Latest audits conducted across active sites</p>
          </div>
          <Link
            to="/inspections"
            className="text-[13px] font-medium text-[#22C7E8] hover:underline flex items-center gap-1"
          >
            <span>View all inspections</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="text-[#94A3B8] text-[11px] uppercase font-medium border-b border-[#243247]">
              <tr>
                <th className="py-2 px-3">Inspection ID</th>
                <th className="py-2 px-3">Site</th>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Inspector</th>
                <th className="py-2 px-3">Risk Level</th>
                <th className="py-2 px-3">Confidence</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243247]/60">
              {filteredInspections.slice(0, 5).map((insp) => (
                <tr
                  key={insp.id}
                  onClick={() => navigate(`/inspections/${insp.id}`)}
                  className="hover:bg-[#16243B] transition-colors cursor-pointer"
                >
                  <td className="py-2.5 px-3 font-mono font-medium text-[#22C7E8]">
                    {insp.id}
                  </td>
                  <td className="py-2.5 px-3 text-[#F1F5F9] font-medium">
                    {insp.site}
                  </td>
                  <td className="py-2.5 px-3 text-[#94A3B8]">
                    {new Date(insp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-2.5 px-3 text-[#94A3B8]">
                    {insp.inspector || 'Safety Inspector'}
                  </td>
                  <td className="py-2.5 px-3">
                    {getRiskBadge(insp.riskLevel)}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[#F1F5F9]">
                    {insp.overallConfidence || 95}%
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <Link
                      to={`/inspections/${insp.id}`}
                      className="vg-btn-secondary py-1 px-2.5 text-[12px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View
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

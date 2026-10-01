import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import {
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  Check,
  XCircle,
} from 'lucide-react';

export const HazardsPage = () => {
  const { updateFindingStatus, getStats } = useInspections();
  const stats = getStats();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const allHazards = stats.allHazards || [];

  const filteredHazards = allHazards.filter((h) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      (h.label && h.label.toLowerCase().includes(q)) ||
      (h.evidence && h.evidence.toLowerCase().includes(q)) ||
      (h.site && h.site.toLowerCase().includes(q)) ||
      (h.assignedTo && h.assignedTo.toLowerCase().includes(q));

    const sev = (h.severity || 'LOW').toUpperCase();
    const matchSev = severityFilter === 'ALL' || sev === severityFilter;

    const stat = h.status || 'Open';
    const matchStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'OPEN' && (stat === 'Open' || stat === 'In Progress')) ||
      (statusFilter === 'RESOLVED' && (stat === 'Resolved' || stat === 'Compliant'));

    return matchSearch && matchSev && matchStatus;
  });

  const getRiskBadge = (severity) => {
    const s = (severity || 'LOW').toUpperCase();
    if (s === 'CRITICAL') return <span className="vg-badge-critical">CRITICAL</span>;
    if (s === 'HIGH') return <span className="vg-badge-high">HIGH</span>;
    if (s === 'MEDIUM') return <span className="vg-badge-medium">MEDIUM</span>;
    return <span className="vg-badge-safe">LOW</span>;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#243247]">
        <div>
          <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#F1F5F9] tracking-tight">
            Hazards Register
          </h1>
          <p className="text-[13px] text-[#94A3B8] mt-0.5">
            Active safety hazards, severity classifications, and remediation statuses.
          </p>
        </div>

        <div className="flex items-center gap-3 text-[12px] font-mono">
          <div className="px-2.5 py-1 rounded bg-[#111C2E] border border-[#243247]">
            <span className="text-[#94A3B8]">Critical: </span>
            <strong className="text-[#EF4444]">{stats.criticalHazards}</strong>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#111C2E] border border-[#243247]">
            <span className="text-[#94A3B8]">Open: </span>
            <strong className="text-[#F59E0B]">{stats.openIssues}</strong>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 p-3 rounded bg-[#111C2E] border border-[#243247] text-[13px]">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hazards, sites, evidence, or assignee..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#22C7E8]"
          />
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="w-full sm:w-auto py-1.5 px-2.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9]"
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto py-1.5 px-2.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9]"
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {/* Table */}
      <div className="vg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="text-[#94A3B8] text-[11px] uppercase font-medium bg-[#0F172A] border-b border-[#243247]">
              <tr>
                <th className="py-2.5 px-3">Hazard / Evidence</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Site</th>
                <th className="py-2.5 px-3">Assigned To</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243247]/60">
              {filteredHazards.map((hazard) => {
                const isResolved = hazard.status === 'Resolved' || hazard.status === 'Compliant';

                return (
                  <tr key={`${hazard.inspectionId}-${hazard.id}`} className="hover:bg-[#16243B] transition-colors">
                    <td className="py-2.5 px-3 max-w-xs">
                      <p className="font-medium text-[#F1F5F9]">{hazard.label}</p>
                      <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">{hazard.evidence}</p>
                    </td>

                    <td className="py-2.5 px-3">
                      {getRiskBadge(hazard.severity)}
                    </td>

                    <td className="py-2.5 px-3 font-mono text-[#F1F5F9]">
                      {hazard.confidence}%
                    </td>

                    <td className="py-2.5 px-3 text-[#94A3B8]">
                      <Link
                        to={`/inspections/${hazard.inspectionId}`}
                        className="text-[#F1F5F9] hover:underline flex items-center gap-1"
                      >
                        <span>{hazard.site}</span>
                        <ExternalLink className="w-3 h-3 text-[#64748B]" />
                      </Link>
                    </td>

                    <td className="py-2.5 px-3 text-[#94A3B8]">
                      {hazard.assignedTo || 'Unassigned'}
                    </td>

                    <td className="py-2.5 px-3">
                      <span className={isResolved ? 'text-[#22C55E] text-[12px] font-medium' : 'text-[#F59E0B] text-[12px] font-medium'}>
                        {hazard.status || 'Open'}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          const next = isResolved ? 'Open' : 'Resolved';
                          updateFindingStatus(hazard.inspectionId, hazard.id, next);
                        }}
                        className="vg-btn-secondary py-1 px-2.5 text-[12px]"
                      >
                        {isResolved ? 'Reopen' : 'Resolve'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

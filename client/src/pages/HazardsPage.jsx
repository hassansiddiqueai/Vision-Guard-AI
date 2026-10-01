import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import {
  AlertTriangle,
  Search,
  CheckCircle2,
  Clock,
  User,
  Shield,
  Filter,
  ExternalLink,
  MapPin,
  FileCheck,
  Check,
  XCircle,
} from 'lucide-react';

export const HazardsPage = () => {
  const { inspections, updateFindingStatus, getStats } = useInspections();
  const stats = getStats();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Collect all findings across inspections
  const allHazards = stats.allHazards || [];

  const filteredHazards = allHazards.filter((h) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      (h.label && h.label.toLowerCase().includes(q)) ||
      (h.evidence && h.evidence.toLowerCase().includes(q)) ||
      (h.site && h.site.toLowerCase().includes(q)) ||
      (h.inspectionName && h.inspectionName.toLowerCase().includes(q)) ||
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

  const getSeverityBadge = (severity) => {
    const s = (severity || 'LOW').toUpperCase();
    switch (s) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            LOW / SAFE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Hazard Intelligence Matrix</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Hazard Register & Action Items
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Cross-facility database of computer-vision detected safety anomalies, risk classifications, and mitigation statuses.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <span className="font-bold text-sm block">{stats.criticalHazards}</span>
            <span className="text-[10px] text-slate-400">Critical Hazards</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <span className="font-bold text-sm block">{stats.openIssues}</span>
            <span className="text-[10px] text-slate-400">Open Actions</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hazards, sites, evidence, or assignee..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-slate-200 placeholder-slate-400 transition"
          />
        </div>

        {/* Severity */}
        <div className="sm:col-span-3">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full py-2 px-2.5 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-slate-300 font-mono"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low / Compliant</option>
          </select>
        </div>

        {/* Status */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-2.5 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-slate-300 font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open & In Progress</option>
            <option value="RESOLVED">Resolved / Verified</option>
          </select>
        </div>
      </div>

      {/* Table / List View */}
      {filteredHazards.length === 0 ? (
        <div className="py-16 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 p-8 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No hazards matching query</h3>
          <p className="text-xs text-slate-400">All filtered items have been remediated or no matching records exist.</p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/90 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Hazard & Evidence</th>
                  <th className="py-3.5 px-4">Severity</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4">Site / Inspection</th>
                  <th className="py-3.5 px-4">Assigned To</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Corrective Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredHazards.map((hazard) => {
                  const isResolved = hazard.status === 'Resolved' || hazard.status === 'Compliant';

                  return (
                    <tr key={`${hazard.inspectionId}-${hazard.id}`} className="hover:bg-slate-850/40 transition">
                      {/* Label & Evidence */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-semibold text-slate-200 text-xs">{hazard.label}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                          {hazard.evidence || hazard.riskFactor || 'Identified via visual inspection pipeline.'}
                        </p>
                        {hazard.complianceRef && (
                          <span className="inline-block mt-1 font-mono text-[10px] text-sky-400/90 bg-sky-950/50 px-1.5 py-0.2 rounded border border-sky-800/40">
                            {hazard.complianceRef}
                          </span>
                        )}
                      </td>

                      {/* Severity */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getSeverityBadge(hazard.severity)}
                      </td>

                      {/* Confidence */}
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-400 whitespace-nowrap">
                        {hazard.confidence}%
                      </td>

                      {/* Site & Inspection Link */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <Link
                          to={`/inspections/${hazard.inspectionId}`}
                          className="text-slate-200 hover:text-sky-400 transition font-medium flex items-center gap-1 group"
                        >
                          <span className="truncate max-w-[140px]">{hazard.site}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-sky-400" />
                        </Link>
                        <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                          {hazard.inspectionId}
                        </span>
                      </td>

                      {/* Assignee */}
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        {hazard.assignedTo ? (
                          <div className="flex items-center gap-1.5 text-xs">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate max-w-[120px]">{hazard.assignedTo}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono ${
                            isResolved
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : hazard.status === 'In Progress'
                              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {isResolved ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          <span>{hazard.status || 'Open'}</span>
                        </span>
                      </td>

                      {/* Action Toggle */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            const newStatus = isResolved ? 'Open' : 'Resolved';
                            updateFindingStatus(hazard.inspectionId, hazard.id, newStatus);
                          }}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition inline-flex items-center gap-1.5 ${
                            isResolved
                              ? 'bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700'
                              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                          }`}
                        >
                          {isResolved ? (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>Reopen</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Mark Resolved</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

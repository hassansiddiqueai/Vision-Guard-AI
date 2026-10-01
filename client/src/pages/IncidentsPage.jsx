import React, { useState } from 'react';
import { useInspections } from '../context/InspectionContext';
import {
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Shield,
  ExternalLink,
  PlusCircle,
  XCircle,
  UserCheck,
  Check,
} from 'lucide-react';

export const IncidentsPage = () => {
  const { incidents, updateIncidentStatus, assignIncident } = useInspections();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredIncidents = incidents.filter((inc) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      inc.id.toLowerCase().includes(q) ||
      inc.hazard.toLowerCase().includes(q) ||
      inc.site.toLowerCase().includes(q) ||
      (inc.assignedTo && inc.assignedTo.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Incident Lifecycle Operations</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Safety Incident Management & Corrective Remediation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Track, assign, and verify resolution for hazards detected across computer vision surveillance and field audits.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Open Incidents</span>
            <span className="text-sm font-bold text-rose-400">
              {incidents.filter((i) => i.status !== 'RESOLVED').length}
            </span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Resolved</span>
            <span className="text-sm font-bold text-emerald-400">
              {incidents.filter((i) => i.status === 'RESOLVED').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search incident ID, hazard, site, or assignee..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="IN PROGRESS">IN PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 font-mono"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
          </select>
        </div>
      </div>

      {/* Incidents Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIncidents.map((inc) => {
          const isResolved = inc.status === 'RESOLVED';

          return (
            <div
              key={inc.id}
              className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800/40">
                      {inc.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        inc.severity === 'CRITICAL'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : inc.severity === 'HIGH'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isResolved
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : inc.status === 'IN PROGRESS'
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {inc.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white">{inc.hazard}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {inc.site} • {inc.location}
                </p>
              </div>

              {/* Evidence Preview & Corrective Action */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950 border border-slate-850">
                  {inc.evidenceImage && (
                    <img
                      src={inc.evidenceImage}
                      alt="evidence"
                      className="w-16 h-12 object-cover rounded border border-slate-800 shrink-0"
                    />
                  )}
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Corrective Action Mandate:
                    </span>
                    <p className="text-slate-200 text-xs mt-0.5">{inc.correctiveAction}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    <span>{inc.assignedTo}</span>
                  </div>
                  <span>Due: {inc.dueDate || 'Immediate'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    const assignee = prompt('Assign to personnel:', inc.assignedTo);
                    if (assignee) assignIncident(inc.id, assignee);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  Reassign
                </button>

                <button
                  onClick={() => {
                    const next = isResolved ? 'OPEN' : 'RESOLVED';
                    updateIncidentStatus(inc.id, next);
                  }}
                  className={`px-3 py-1 rounded text-xs font-semibold transition flex items-center gap-1.5 ${
                    isResolved
                      ? 'bg-slate-800 text-slate-400 hover:text-rose-400'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {isResolved ? (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reopen Incident</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Verify & Resolve</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useInspections } from '../context/InspectionContext';
import {
  Search,
  User,
  Check,
  XCircle,
} from 'lucide-react';

export const IncidentsPage = () => {
  const { incidents, updateIncidentStatus, assignIncident } = useInspections();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredIncidents = incidents.filter((inc) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      inc.id.toLowerCase().includes(q) ||
      inc.hazard.toLowerCase().includes(q) ||
      inc.site.toLowerCase().includes(q) ||
      (inc.assignedTo && inc.assignedTo.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#243247]">
        <div>
          <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#F1F5F9] tracking-tight">
            Safety Incidents
          </h1>
          <p className="text-[13px] text-[#94A3B8] mt-0.5">
            Track, assign, and verify corrective safety actions.
          </p>
        </div>

        <div className="flex items-center gap-3 text-[12px]">
          <div className="px-2.5 py-1 rounded bg-[#111C2E] border border-[#243247]">
            <span className="text-[#94A3B8]">Open: </span>
            <strong className="text-[#EF4444]">{incidents.filter((i) => i.status !== 'RESOLVED').length}</strong>
          </div>
          <div className="px-2.5 py-1 rounded bg-[#111C2E] border border-[#243247]">
            <span className="text-[#94A3B8]">Resolved: </span>
            <strong className="text-[#22C55E]">{incidents.filter((i) => i.status === 'RESOLVED').length}</strong>
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
            placeholder="Search incident ID, hazard, site, or assignee..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#22C7E8]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto py-1.5 px-2.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9]"
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="ASSIGNED">ASSIGNED</option>
          <option value="IN PROGRESS">IN PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      </div>

      {/* Incidents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredIncidents.map((inc) => {
          const isResolved = inc.status === 'RESOLVED';

          return (
            <div key={inc.id} className="vg-card p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px] text-[#22C7E8] font-semibold">{inc.id}</span>
                  <span className={isResolved ? 'text-[#22C55E] text-[12px] font-semibold' : 'text-[#EF4444] text-[12px] font-semibold'}>
                    {inc.status}
                  </span>
                </div>

                <h3 className="text-[14px] font-semibold text-[#F1F5F9]">{inc.hazard}</h3>
                <p className="text-[12px] text-[#94A3B8] mt-0.5">{inc.site} · {inc.location}</p>
              </div>

              {/* Action Mandate */}
              <div className="p-2.5 rounded bg-[#0B1220] border border-[#243247] text-[12px] space-y-1">
                <span className="text-[#64748B] text-[11px] block">CORRECTIVE ACTION:</span>
                <p className="text-[#F1F5F9] font-medium">{inc.correctiveAction}</p>
                <div className="flex justify-between text-[#64748B] text-[11px] pt-1">
                  <span>Assigned: <strong className="text-[#94A3B8]">{inc.assignedTo}</strong></span>
                  <span>Due: {inc.dueDate || 'Immediate'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-[#243247] flex items-center justify-between">
                <button
                  onClick={() => {
                    const assignee = prompt('Reassign incident to:', inc.assignedTo);
                    if (assignee) assignIncident(inc.id, assignee);
                  }}
                  className="vg-btn-ghost text-[12px] py-1"
                >
                  Reassign
                </button>

                <button
                  onClick={() => {
                    const next = isResolved ? 'OPEN' : 'RESOLVED';
                    updateIncidentStatus(inc.id, next);
                  }}
                  className="vg-btn-secondary text-[12px] py-1 px-3"
                >
                  {isResolved ? 'Reopen' : 'Mark Resolved'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

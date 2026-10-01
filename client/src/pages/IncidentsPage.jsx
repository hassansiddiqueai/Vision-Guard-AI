import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Camera,
  UserCheck,
  Shield,
  ArrowRight,
  Plus,
  CheckCircle2,
  UserPlus
} from 'lucide-react';
import { useInspections } from '../context/InspectionContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { IncidentModal } from '../components/common/IncidentModal';
import { DemoScenarioToolbar } from '../components/common/DemoScenarioToolbar';

export const IncidentsPage = () => {
  const { incidents, acknowledgeEvent, resolveEvent, selectedSite } = useInspections();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedIncident, setSelectedIncident] = useState(null);

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSite = selectedSite === 'All Sites' || inc.site === selectedSite;
    const matchesSearch =
      inc.hazard.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inc.camera && inc.camera.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inc.assignedTo && inc.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;

    return matchesSite && matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Risk Events & Incident Control Register
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-grade safety incident workflow: Detected &rarr; Acknowledged &rarr; Assigned &rarr; Corrective Action &rarr; Verification &rarr; Closed.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-semibold">
            Active Open: {incidents.filter((i) => i.status !== 'CLOSED').length}
          </span>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
            Resolved: {incidents.filter((i) => i.status === 'CLOSED').length}
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="vg-card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by hazard, camera ID, site, officer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-white border border-slate-300 text-slate-700 text-xs rounded-md px-2.5 py-1.5 focus:outline-none font-semibold"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Severity</option>
            <option value="HIGH">High Severity</option>
            <option value="MEDIUM">Medium Severity</option>
            <option value="LOW">Low Severity</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 text-slate-700 text-xs rounded-md px-2.5 py-1.5 focus:outline-none font-semibold"
          >
            <option value="ALL">All Lifecycle Stages</option>
            <option value="DETECTED">Detected</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="CORRECTIVE_ACTION">Action In Progress</option>
            <option value="VERIFICATION">Verification Required</option>
            <option value="CLOSED">Closed / Resolved</option>
          </select>
        </div>
      </div>

      {/* Incidents Data Table */}
      <div className="vg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Hazard Event</th>
                <th className="py-2.5 px-3">Camera / Sensor</th>
                <th className="py-2.5 px-3">Site & Location</th>
                <th className="py-2.5 px-3">Detected Time</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3">Lifecycle Status</th>
                <th className="py-2.5 px-3">Assigned To</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncidents.length > 0 ? (
                filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-3">
                      <RiskBadge level={inc.severity} size="sm" />
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900 max-w-[220px]">
                      <div>{inc.hazard}</div>
                      <div className="font-mono text-[10px] text-slate-400 font-normal">{inc.id}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-700">
                      {inc.camera || 'CAM-001'}
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      <div className="font-semibold text-slate-900">{inc.site}</div>
                      <div className="text-[11px] text-slate-500">{inc.location}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">{inc.detectedAt}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {inc.confidence || 96.5}%
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          inc.status === 'CLOSED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : inc.status === 'VERIFICATION'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : inc.status === 'CORRECTIVE_ACTION'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-800 font-semibold">
                      {inc.assignedTo || 'Unassigned'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {inc.status === 'DETECTED' && (
                          <button
                            onClick={() => acknowledgeEvent(inc.id)}
                            title="Acknowledge Event"
                            className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-[11px] transition"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedIncident(inc)}
                          className="vg-btn-primary text-xs px-2.5 py-1"
                        >
                          <span>Event Detail &rarr;</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No risk incidents match the specified search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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


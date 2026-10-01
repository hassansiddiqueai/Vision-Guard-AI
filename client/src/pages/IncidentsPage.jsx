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
} from 'lucide-react';
import { useInspections } from '../context/InspectionContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { IncidentModal } from '../components/common/IncidentModal';
import { DemoScenarioToolbar } from '../components/common/DemoScenarioToolbar';

export const IncidentsPage = () => {
  const { incidents } = useInspections();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedIncident, setSelectedIncident] = useState(null);

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.hazard.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inc.assignedTo && inc.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Demo Scenario Bar */}
      <DemoScenarioToolbar />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Risk Events & Incident Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit-grade lifecycle tracking: Detected → Acknowledged → Assigned → Corrective Action → Verification → Closed.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-500">
          Total Incidents: {incidents.length} | Open: {incidents.filter((i) => i.status !== 'CLOSED').length}
        </span>
      </div>

      {/* Search and Filters */}
      <div className="vg-card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by hazard, site, officer, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-white border border-slate-300 text-slate-700 text-xs rounded px-2 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical Risks</option>
            <option value="HIGH">High Risks</option>
            <option value="MEDIUM">Medium Risks</option>
            <option value="LOW">Low Risks</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 text-slate-700 text-xs rounded px-2 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Lifecycle Statuses</option>
            <option value="DETECTED">Detected</option>
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
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-medium">Incident ID</th>
                <th className="py-2.5 px-3 font-medium">Hazard / Anomaly</th>
                <th className="py-2.5 px-3 font-medium">Site & Sector</th>
                <th className="py-2.5 px-3 font-medium">Detected Time</th>
                <th className="py-2.5 px-3 font-medium">Assigned Officer</th>
                <th className="py-2.5 px-3 font-medium">Severity</th>
                <th className="py-2.5 px-3 font-medium">Lifecycle Status</th>
                <th className="py-2.5 px-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncidents.length > 0 ? (
                filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-mono font-medium text-slate-700">{inc.id}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900 max-w-[200px] truncate">
                      {inc.hazard}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-[160px] truncate">
                      {inc.site}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">{inc.detectedAt}</td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {inc.assignedTo || 'Unassigned'}
                    </td>
                    <td className="py-3 px-3">
                      <RiskBadge level={inc.severity} size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
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
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedIncident(inc)}
                        className="vg-btn-secondary text-xs px-2 py-1"
                      >
                        Manage Lifecycle
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
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

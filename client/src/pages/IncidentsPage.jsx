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
  Download,
  AlertOctagon,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { useInspections } from '../context/InspectionContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { IncidentModal } from '../components/common/IncidentModal';

export const IncidentsPage = () => {
  const {
    incidents,
    acknowledgeEvent,
    resolveEvent,
    escalateIncident,
    selectedSite,
    sites
  } = useInspections();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'RESOLVED'
  const [selectedIncident, setSelectedIncident] = useState(null);

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSite = selectedSite === 'All Sites' || inc.site === selectedSite;
    const matchesSearch =
      inc.hazard.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inc.camera && inc.camera.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inc.assignedTo && inc.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesTab = true;
    if (activeTab === 'CRITICAL') matchesTab = inc.severity === 'CRITICAL' && inc.status !== 'CLOSED';
    else if (activeTab === 'HIGH') matchesTab = inc.severity === 'HIGH' && inc.status !== 'CLOSED';
    else if (activeTab === 'MEDIUM') matchesTab = (inc.severity === 'MEDIUM' || inc.severity === 'LOW') && inc.status !== 'CLOSED';
    else if (activeTab === 'RESOLVED') matchesTab = inc.status === 'CLOSED';

    return matchesSite && matchesSearch && matchesTab;
  });

  const criticalCount = incidents.filter((i) => i.severity === 'CRITICAL' && i.status !== 'CLOSED').length;
  const highCount = incidents.filter((i) => i.severity === 'HIGH' && i.status !== 'CLOSED').length;
  const mediumCount = incidents.filter((i) => (i.severity === 'MEDIUM' || i.severity === 'LOW') && i.status !== 'CLOSED').length;
  const resolvedCount = incidents.filter((i) => i.status === 'CLOSED').length;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Incident Management & Verification
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              AUDIT LOG
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational register of computer-vision detected hazards, supervisor verifications, and corrective actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 border border-slate-300 text-slate-700 font-bold">
            Total: {incidents.length}
          </span>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-red-50 border border-red-300 text-red-700 font-bold">
            Active: {incidents.filter((i) => i.status !== 'CLOSED').length}
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar (Requirement 9) */}
      <div className="vg-card p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Severity Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              activeTab === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            All ({incidents.length})
          </button>
          <button
            onClick={() => setActiveTab('CRITICAL')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              activeTab === 'CRITICAL'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => setActiveTab('HIGH')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              activeTab === 'HIGH'
                ? 'bg-orange-600 text-white'
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
            }`}
          >
            High ({highCount})
          </button>
          <button
            onClick={() => setActiveTab('MEDIUM')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              activeTab === 'MEDIUM'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Medium ({mediumCount})
          </button>
          <button
            onClick={() => setActiveTab('RESOLVED')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              activeTab === 'RESOLVED'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, detection, site, camera..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
          />
        </div>
      </div>

      {/* Incidents Data Table */}
      <div className="vg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 uppercase font-bold text-[11px]">
              <tr>
                <th className="py-2.5 px-3 font-mono">Incident ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Camera</th>
                <th className="py-2.5 px-3">Site</th>
                <th className="py-2.5 px-3">Detection</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3 font-mono">Confidence</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIncidents.length > 0 ? (
                filteredIncidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50/80 transition">
                    {/* Incident ID */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {inc.id}
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {inc.detectedAt || '15:04:22'}
                    </td>

                    {/* Camera */}
                    <td className="py-3 px-3 font-mono text-slate-700 font-medium">
                      {inc.camera?.slice(0, 7) || 'CAM-001'}
                    </td>

                    {/* Site */}
                    <td className="py-3 px-3 text-slate-800 font-medium max-w-[140px] truncate">
                      {inc.site}
                    </td>

                    {/* Detection */}
                    <td className="py-3 px-3 font-bold text-slate-900 max-w-[200px] truncate">
                      {inc.hazard}
                    </td>

                    {/* Severity */}
                    <td className="py-3 px-3">
                      <RiskBadge level={inc.severity} size="sm" />
                    </td>

                    {/* Confidence */}
                    <td className="py-3 px-3 font-mono font-bold text-sky-700">
                      {inc.confidence || 94}%
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        inc.status === 'CLOSED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : inc.status === 'ESCALATED'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : inc.status === 'ACKNOWLEDGED'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {inc.status === 'DETECTED' ? 'Awaiting verification' : inc.status}
                      </span>
                    </td>

                    {/* Actions: VIEW | ACKNOWLEDGE | ESCALATE | RESOLVE */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedIncident(inc)}
                          className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-800 font-bold text-[11px] transition"
                        >
                          VIEW
                        </button>

                        {inc.status === 'DETECTED' && (
                          <button
                            onClick={() => acknowledgeEvent(inc.id)}
                            className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-300 rounded font-bold text-[11px] transition"
                          >
                            ACKNOWLEDGE
                          </button>
                        )}

                        {inc.status !== 'ESCALATED' && inc.status !== 'CLOSED' && (
                          <button
                            onClick={() => escalateIncident(inc.id, 'Escalated by supervisor')}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded font-bold text-[11px] transition"
                          >
                            ESCALATE
                          </button>
                        )}

                        {inc.status !== 'CLOSED' && (
                          <button
                            onClick={() => resolveEvent(inc.id, 'Resolved and verified')}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded font-bold text-[11px] transition"
                          >
                            RESOLVE
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No incidents match the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
};

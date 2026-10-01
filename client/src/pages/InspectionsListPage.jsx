import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import {
  Search,
  Plus,
  Trash2,
  MapPin,
  ClipboardList,
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';

export const InspectionsListPage = () => {
  const navigate = useNavigate();
  const { inspections, deleteInspection } = useInspections();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  const filtered = inspections.filter((insp) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      (insp.id && insp.id.toLowerCase().includes(q)) ||
      (insp.name && insp.name.toLowerCase().includes(q)) ||
      (insp.site && insp.site.toLowerCase().includes(q)) ||
      (insp.inspector && insp.inspector.toLowerCase().includes(q));

    const risk = (insp.riskLevel || 'LOW').toUpperCase();
    const matchRisk = selectedRisk === 'ALL' || risk === selectedRisk;

    const type = insp.type || 'General';
    const matchType = selectedType === 'ALL' || type.toLowerCase().includes(selectedType.toLowerCase());

    return matchSearch && matchRisk && matchType;
  });

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Safety Inspection Logs & Audits
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Database of completed visual audits, geometric anomalies, and corrective action directives.
          </p>
        </div>

        <Link to="/inspections/new" className="vg-btn-primary text-xs">
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Inspection</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 p-3 rounded bg-white border border-slate-200 text-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, Site, or Inspector..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-600"
          />
        </div>

        <select
          value={selectedRisk}
          onChange={(e) => setSelectedRisk(e.target.value)}
          className="w-full sm:w-auto py-1.5 px-2.5 bg-white border border-slate-300 rounded text-slate-700"
        >
          <option value="ALL">All Risk Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full sm:w-auto py-1.5 px-2.5 bg-white border border-slate-300 rounded text-slate-700"
        >
          <option value="ALL">All Audit Types</option>
          <option value="Scaffolding">Scaffolding</option>
          <option value="Construction">Construction</option>
          <option value="Machinery">Machinery</option>
          <option value="PPE">PPE</option>
          <option value="Infrastructure">Infrastructure</option>
        </select>
      </div>

      {/* Table */}
      <div className="vg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-slate-600 text-[11px] uppercase font-semibold bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Audit ID & Title</th>
                <th className="py-2.5 px-3">Job Site & Sector</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Audit Date</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((insp) => (
                <tr
                  key={insp.id}
                  onClick={() => navigate(`/inspections/${insp.id}`)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-sky-700 block">{insp.id}</span>
                    <span className="text-slate-900 font-semibold truncate block max-w-xs">{insp.name}</span>
                  </td>

                  <td className="py-3 px-3 text-slate-600">
                    <span className="text-slate-900 font-medium block">{insp.site}</span>
                    <span className="text-[11px] text-slate-500">{insp.location}</span>
                  </td>

                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {insp.type}
                  </td>

                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    {new Date(insp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  <td className="py-3 px-3">
                    <RiskBadge level={insp.riskLevel} size="sm" />
                  </td>

                  <td className="py-3 px-3 font-mono font-medium text-slate-800">
                    {insp.overallConfidence || 95}%
                  </td>

                  <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/inspections/${insp.id}`}
                        className="vg-btn-secondary py-1 px-2.5 text-xs"
                      >
                        Inspect
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete inspection ${insp.id}?`)) {
                            deleteInspection(insp.id);
                          }
                        }}
                        className="p-1.5 rounded text-slate-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import {
  Search,
  Plus,
  Trash2,
  MapPin,
} from 'lucide-react';

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

  const getRiskBadge = (risk) => {
    const r = (risk || 'LOW').toUpperCase();
    if (r === 'CRITICAL') return <span className="vg-badge-critical">CRITICAL</span>;
    if (r === 'HIGH') return <span className="vg-badge-high">HIGH</span>;
    if (r === 'MEDIUM') return <span className="vg-badge-medium">MEDIUM</span>;
    return <span className="vg-badge-safe">LOW</span>;
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#243247]">
        <div>
          <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#F1F5F9] tracking-tight">
            Inspections
          </h1>
          <p className="text-[13px] text-[#94A3B8] mt-0.5">
            Database of visual inspection records and hazard classifications.
          </p>
        </div>

        <Link to="/inspections/new" className="vg-btn-primary">
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Inspection</span>
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 p-3 rounded bg-[#111C2E] border border-[#243247] text-[13px]">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, Site, or Inspector..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#22C7E8]"
          />
        </div>

        <select
          value={selectedRisk}
          onChange={(e) => setSelectedRisk(e.target.value)}
          className="w-full sm:w-auto py-1.5 px-2.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9]"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full sm:w-auto py-1.5 px-2.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9]"
        >
          <option value="ALL">All Types</option>
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
          <table className="w-full text-left text-[13px]">
            <thead className="text-[#94A3B8] text-[11px] uppercase font-medium bg-[#0F172A] border-b border-[#243247]">
              <tr>
                <th className="py-2.5 px-3">Inspection ID</th>
                <th className="py-2.5 px-3">Site / Location</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Risk Level</th>
                <th className="py-2.5 px-3">Confidence</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#243247]/60">
              {filtered.map((insp) => (
                <tr
                  key={insp.id}
                  onClick={() => navigate(`/inspections/${insp.id}`)}
                  className="hover:bg-[#16243B] transition-colors cursor-pointer"
                >
                  <td className="py-2.5 px-3">
                    <span className="font-mono font-medium text-[#22C7E8] block">{insp.id}</span>
                    <span className="text-[#F1F5F9] font-medium truncate block max-w-xs">{insp.name}</span>
                  </td>

                  <td className="py-2.5 px-3 text-[#94A3B8]">
                    <span className="text-[#F1F5F9] font-medium block">{insp.site}</span>
                    <span className="text-[11px]">{insp.location}</span>
                  </td>

                  <td className="py-2.5 px-3 text-[#94A3B8]">
                    {insp.type}
                  </td>

                  <td className="py-2.5 px-3 text-[#94A3B8]">
                    {new Date(insp.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  <td className="py-2.5 px-3">
                    {getRiskBadge(insp.riskLevel)}
                  </td>

                  <td className="py-2.5 px-3 font-mono text-[#F1F5F9]">
                    {insp.overallConfidence || 95}%
                  </td>

                  <td className="py-2.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/inspections/${insp.id}`}
                        className="vg-btn-secondary py-1 px-2.5 text-[12px]"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete inspection ${insp.id}?`)) {
                            deleteInspection(insp.id);
                          }
                        }}
                        className="p-1.5 rounded text-[#64748B] hover:text-[#EF4444]"
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

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import {
  Search,
  Filter,
  PlusCircle,
  Scan,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  ArrowUpDown,
  Trash2,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';

export const InspectionsListPage = () => {
  const navigate = useNavigate();
  const { inspections, deleteInspection } = useInspections();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Filter & Sort Logic
  const filtered = inspections.filter((insp) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      (insp.id && insp.id.toLowerCase().includes(q)) ||
      (insp.name && insp.name.toLowerCase().includes(q)) ||
      (insp.site && insp.site.toLowerCase().includes(q)) ||
      (insp.inspector && insp.inspector.toLowerCase().includes(q)) ||
      (insp.location && insp.location.toLowerCase().includes(q));

    const risk = (insp.riskLevel || 'LOW').toUpperCase();
    const matchRisk = selectedRisk === 'ALL' || risk === selectedRisk;

    const type = insp.type || 'General';
    const matchType = selectedType === 'ALL' || type.toLowerCase().includes(selectedType.toLowerCase());

    const status = insp.status || 'Completed';
    const matchStatus = selectedStatus === 'ALL' || status === selectedStatus;

    return matchSearch && matchRisk && matchType && matchStatus;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'highest_risk') {
      const p = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1, SAFE: 0 };
      return (p[b.riskLevel] || 0) - (p[a.riskLevel] || 0);
    }
    if (sortBy === 'confidence') return (b.overallConfidence || 0) - (a.overallConfidence || 0);
    return 0;
  });

  const getRiskBadge = (risk) => {
    const r = (risk || 'LOW').toUpperCase();
    switch (r) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            LOW / SAFE
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>Inspection Registry</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Safety & Visual Inspection Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Complete database of industrial computer vision audits, defect classifications, and compliance logs.
          </p>
        </div>

        <Link
          to="/inspections/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Inspection</span>
        </Link>
      </div>

      {/* Filter and Query Toolstrip */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        {/* Search */}
        <div className="sm:col-span-4 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, Site, Inspector, or Scope..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-slate-200 placeholder-slate-400 transition"
          />
        </div>

        {/* Risk Filter */}
        <div className="sm:col-span-2">
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="w-full py-2 px-2.5 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-slate-300 font-mono"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical Hazards</option>
            <option value="HIGH">High Severity</option>
            <option value="MEDIUM">Medium Severity</option>
            <option value="LOW">Low / Compliant</option>
          </select>
        </div>

        {/* Type Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full py-2 px-2.5 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-slate-300 font-mono"
          >
            <option value="ALL">All Inspection Types</option>
            <option value="Scaffolding">Scaffolding Safety</option>
            <option value="Construction">Construction Safety</option>
            <option value="Machinery">Machinery & Equipment</option>
            <option value="PPE">PPE Compliance</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="General">General Safety</option>
          </select>
        </div>

        {/* Sort */}
        <div className="sm:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full py-2 px-2.5 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-slate-300 font-mono"
          >
            <option value="newest">Sort: Most Recent First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="highest_risk">Sort: Highest Risk Priority</option>
            <option value="confidence">Sort: AI Confidence</option>
          </select>
        </div>
      </div>

      {/* Main Table / Empty State */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 p-8 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
            <Scan className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-200">No inspections found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery || selectedRisk !== 'ALL' || selectedType !== 'ALL'
              ? 'No inspection records match the specified search and filter criteria.'
              : 'Start by uploading your first site image to begin an AI-powered visual inspection.'}
          </p>
          <div className="pt-2">
            {searchQuery || selectedRisk !== 'ALL' || selectedType !== 'ALL' ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRisk('ALL');
                  setSelectedType('ALL');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
              >
                Reset Filters
              </button>
            ) : (
              <Link
                to="/inspections/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Start Inspection</span>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/90 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Inspection / ID</th>
                  <th className="py-3.5 px-4">Site & Location</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Findings</th>
                  <th className="py-3.5 px-4">Risk Severity</th>
                  <th className="py-3.5 px-4">AI Conf.</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filtered.map((insp) => {
                  const dateStr = new Date(insp.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const findingsCount = insp.findings ? insp.findings.length : 0;
                  const openCount = insp.findings ? insp.findings.filter(f => f.status === 'Open' || f.status === 'In Progress').length : 0;

                  return (
                    <tr
                      key={insp.id}
                      onClick={() => navigate(`/inspections/${insp.id}`)}
                      className="hover:bg-slate-850/40 transition cursor-pointer group"
                    >
                      {/* ID & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                            {insp.imageUrl ? (
                              <img src={insp.imageUrl} alt={insp.name} className="w-full h-full object-cover" />
                            ) : (
                              <Scan className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-mono text-[10px] text-sky-400 font-semibold block">
                              {insp.id}
                            </span>
                            <span className="font-semibold text-slate-200 group-hover:text-sky-400 transition truncate block max-w-xs sm:max-w-sm">
                              {insp.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Site */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <div className="flex items-center gap-1.5 text-xs text-slate-200 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[150px]">{insp.site}</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block font-mono pl-5 truncate max-w-[150px]">
                          {insp.location || 'Facility'}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-mono">
                          {insp.type}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono whitespace-nowrap">
                        {dateStr}
                      </td>

                      {/* Findings */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono text-slate-300 font-bold">
                          {findingsCount}
                        </span>
                        {openCount > 0 ? (
                          <span className="text-[11px] text-amber-400 ml-1.5 font-mono">
                            ({openCount} open)
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-400 ml-1.5 font-mono">
                            (Clean)
                          </span>
                        )}
                      </td>

                      {/* Risk */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getRiskBadge(insp.riskLevel)}
                      </td>

                      {/* Confidence */}
                      <td className="py-3.5 px-4 font-mono font-bold text-sky-400 whitespace-nowrap">
                        {insp.overallConfidence || 95}%
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/inspections/${insp.id}`}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete audit record ${insp.id}?`)) {
                                deleteInspection(insp.id);
                              }
                            }}
                            title="Delete Record"
                            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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

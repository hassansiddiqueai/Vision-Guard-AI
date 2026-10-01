import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { inspectionService } from '../services/inspectionService';
import { RiskBadge } from '../components/common/RiskBadge';
import { ConfidenceBar } from '../components/common/ConfidenceBar';
import { EmptyState } from '../components/common/EmptyState';
import {
  Search,
  ScanEye,
  Trash2,
  Plus,
  CheckCircle2,
} from 'lucide-react';

export const HistoryPage = () => {
  const navigate = useNavigate();
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('date_desc');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await inspectionService.getInspections();
        const list = Array.isArray(data) ? data : data.inspections || [];
        setInspections(list);
      } catch (err) {
        // Fallback to local storage history
        const localList = JSON.parse(localStorage.getItem('vg_inspections_history') || '[]');
        setInspections(localList);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this inspection audit record?')) {
      const updated = inspections.filter((item) => item.id !== id);
      setInspections(updated);
      localStorage.setItem('vg_inspections_history', JSON.stringify(updated));
      inspectionService.deleteInspection(id).catch(() => {});
    }
  };

  // Filter & Sort logic
  const filteredInspections = inspections
    .filter((item) => {
      // Search
      const text = `${item.title || ''} ${item.fileName || ''} ${item.category || ''} ${item.summary || ''}`.toLowerCase();
      const matchesSearch = text.includes(searchQuery.toLowerCase());

      // Risk
      const itemRisk = (item.risk || item.risk_level || 'LOW').toUpperCase();
      const matchesRisk = selectedRisk === 'ALL' || itemRisk === selectedRisk;

      // Category
      const itemCategory = item.category || 'Other';
      const matchesCategory = selectedCategory === 'ALL' || itemCategory === selectedCategory;

      return matchesSearch && matchesRisk && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.createdAt || b.timestamp || 0) - new Date(a.createdAt || a.timestamp || 0);
      }
      if (sortBy === 'date_asc') {
        return new Date(a.createdAt || a.timestamp || 0) - new Date(b.createdAt || b.timestamp || 0);
      }
      if (sortBy === 'conf_desc') {
        const confA = a.confidence || 0;
        const confB = b.confidence || 0;
        return confB - confA;
      }
      if (sortBy === 'risk_high') {
        const priority = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        const rA = priority[(a.risk || 'LOW').toUpperCase()] || 0;
        const rB = priority[(b.risk || 'LOW').toUpperCase()] || 0;
        return rB - rA;
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-850">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            Inspection History & Audit Logs
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse, filter, and inspect past vision diagnostic telemetry records.
          </p>
        </div>

        <Link
          to="/inspect"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Inspection</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        {/* Search */}
        <div className="sm:col-span-4 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords, filenames, defects..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs text-slate-200 placeholder-slate-500 transition"
          />
        </div>

        {/* Risk Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="w-full py-2 px-3 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs text-slate-300 font-mono"
          >
            <option value="ALL">All Risk Severities</option>
            <option value="CRITICAL">Critical Hazards</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2 px-3 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs text-slate-300 font-mono"
          >
            <option value="ALL">All Categories</option>
            <option value="Workplace Safety">Workplace Safety</option>
            <option value="Construction">Construction & Scaffolding</option>
            <option value="Equipment">Heavy Equipment</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="sm:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full py-2 px-3 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs text-slate-300 font-mono"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="conf_desc">Highest Confidence</option>
            <option value="risk_high">Highest Risk</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-mono text-slate-400">LOADING AUDIT RECORDS...</p>
        </div>
      ) : filteredInspections.length === 0 ? (
        <EmptyState
          icon={ScanEye}
          title="No Inspections Yet"
          description={
            searchQuery || selectedRisk !== 'ALL' || selectedCategory !== 'ALL'
              ? 'No inspections matched your filter criteria.'
              : 'You have not performed any visual inspections yet.'
          }
          actionText={
            searchQuery || selectedRisk !== 'ALL' || selectedCategory !== 'ALL'
              ? 'Clear Filters'
              : 'Start Your First Inspection'
          }
          onAction={
            searchQuery || selectedRisk !== 'ALL' || selectedCategory !== 'ALL'
              ? () => {
                  setSearchQuery('');
                  setSelectedRisk('ALL');
                  setSelectedCategory('ALL');
                }
              : null
          }
          actionLink={
            searchQuery || selectedRisk !== 'ALL' || selectedCategory !== 'ALL'
              ? null
              : '/inspect'
          }
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Inspection</th>
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Risk Severity</th>
                    <th className="py-3.5 px-4">Confidence</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filteredInspections.map((item) => {
                    const dateStr = item.createdAt || item.timestamp || new Date().toISOString();
                    const formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    const risk = item.risk || item.risk_level || 'LOW';
                    const category = item.category || 'General';
                    const title = item.title || item.fileName || `Inspection #${item.id?.slice?.(0, 6) || 'REQ'}`;
                    const confidence = item.confidence || item.confidence_score || 95;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-850/40 transition group cursor-pointer"
                        onClick={() => navigate(`/inspection/${item.id}`)}
                      >
                        <td className="py-4 px-4 font-sans">
                          <div className="flex items-center gap-3">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt="thumb"
                                className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                                <ScanEye className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-slate-200 group-hover:text-cyan-400 transition truncate max-w-[220px]">
                                {title}
                              </p>
                              <p className="text-[11px] text-slate-500 font-mono">
                                ID: {item.id?.slice(0, 10)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                          {formattedDate}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                            {category}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <RiskBadge level={risk} size="sm" />
                        </td>
                        <td className="py-4 px-4 text-cyan-400 font-bold whitespace-nowrap">
                          {confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence)}%
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Analyzed</span>
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Link
                              to={`/inspection/${item.id}`}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition"
                            >
                              View
                            </Link>
                            <button
                              onClick={(e) => handleDelete(item.id, e)}
                              className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                              title="Delete Inspection"
                            >
                              <Trash2 className="w-4 h-4" />
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

          {/* Mobile Card List View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filteredInspections.map((item) => {
              const dateStr = item.createdAt || item.timestamp || new Date().toISOString();
              const formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
              const risk = item.risk || item.risk_level || 'LOW';
              const title = item.title || item.fileName || `Inspection #${item.id?.slice?.(0, 6)}`;
              const confidence = item.confidence || item.confidence_score || 95;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt="thumb"
                          className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                          <ScanEye className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-sm text-slate-200">{title}</h4>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">{formattedDate}</p>
                      </div>
                    </div>
                    <RiskBadge level={risk} size="sm" />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
                    <span className="text-slate-400">CONFIDENCE:</span>
                    <span className="text-cyan-400 font-bold">
                      {confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Link
                      to={`/inspection/${item.id}`}
                      className="flex-1 text-center py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
                    >
                      View Report
                    </Link>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

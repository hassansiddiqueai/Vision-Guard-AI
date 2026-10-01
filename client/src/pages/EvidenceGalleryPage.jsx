import React, { useState } from 'react';
import { useInspections } from '../context/InspectionContext';
import {
  Eye,
  Trash2,
  Download,
  Search,
  Filter,
  Camera,
  Calendar,
  AlertTriangle,
  ExternalLink,
  PlusCircle,
  X,
} from 'lucide-react';

export const EvidenceGalleryPage = () => {
  const { evidenceList, deleteEvidence, addIncident } = useInspections();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [previewItem, setPreviewItem] = useState(null);

  const filtered = evidenceList.filter((evd) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      evd.id.toLowerCase().includes(q) ||
      evd.hazard.toLowerCase().includes(q) ||
      (evd.camera && evd.camera.toLowerCase().includes(q)) ||
      (evd.location && evd.location.toLowerCase().includes(q));

    const matchSev = severityFilter === 'ALL' || evd.severity === severityFilter;
    return matchSearch && matchSev;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>Forensic Evidence Vault</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Visual Evidence Snapshots & Defect Archive
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            High-resolution visual telemetry captures, annotated defect frames, and chronological hazard snapshots.
          </p>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Total Evidence Frames: <strong className="text-white">{evidenceList.length}</strong>
        </span>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search evidence by ID, hazard, camera, or grid location..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
          />
        </div>

        <div className="sm:col-span-4">
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

      {/* Evidence Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 p-8 space-y-2">
          <Eye className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-200">No evidence snapshots found</h3>
          <p className="text-xs text-slate-400">Capture visual evidence from the Live Camera feed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-800 bg-slate-950 mb-3 group">
                  <img
                    src={item.imageUrl}
                    alt={item.hazard}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur font-mono text-[10px] text-sky-400 border border-slate-700">
                    {item.id}
                  </div>
                  <div
                    className={`absolute top-2 right-2 px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      item.severity === 'CRITICAL'
                        ? 'bg-rose-600 text-white'
                        : item.severity === 'HIGH'
                        ? 'bg-amber-600 text-slate-950'
                        : 'bg-yellow-600 text-slate-950'
                    }`}
                  >
                    {item.severity}
                  </div>
                </div>

                <h3 className="text-xs font-bold text-white line-clamp-1">{item.hazard}</h3>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-1">
                  <span>{item.camera || 'CAM-01'}</span>
                  <span className="text-sky-400 font-bold">{item.confidence || 96}%</span>
                </div>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">{item.timestamp}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewItem(item)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      addIncident({
                        hazard: item.hazard,
                        severity: item.severity,
                        site: item.location || 'Apex Tower',
                        location: item.location || 'Sector 4',
                        evidenceImage: item.imageUrl,
                        assignedTo: 'Site Safety Supervisor',
                        correctiveAction: 'Investigate evidence capture and remediate.',
                      });
                      alert(`Incident record created for ${item.id}`);
                    }}
                    title="Convert to Incident"
                    className="p-1.5 rounded bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-slate-300 transition text-xs flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Incident</span>
                  </button>
                  <button
                    onClick={() => deleteEvidence(item.id)}
                    title="Delete snapshot"
                    className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-sky-400 font-bold">{previewItem.id}</span>
                <h3 className="text-base font-bold text-white">{previewItem.hazard}</h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 max-h-[400px]">
              <img
                src={previewItem.imageUrl}
                alt="preview"
                className="w-full h-full object-contain max-h-[400px]"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono p-3 rounded-lg bg-slate-950 border border-slate-850">
              <div>
                <span className="text-slate-500 block text-[10px]">CAMERA</span>
                <span className="text-slate-200">{previewItem.camera}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">SEVERITY</span>
                <span className="text-rose-400 font-bold">{previewItem.severity}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">TIME</span>
                <span className="text-slate-200">{previewItem.timestamp}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useInspections } from '../context/InspectionContext';
import {
  Eye,
  Trash2,
  Search,
  X,
} from 'lucide-react';

export const EvidenceGalleryPage = () => {
  const { evidenceList, deleteEvidence } = useInspections();
  const [searchQuery, setSearchQuery] = useState('');
  const [previewItem, setPreviewItem] = useState(null);

  const filtered = evidenceList.filter((evd) => {
    const q = searchQuery.toLowerCase();
    return (
      evd.id.toLowerCase().includes(q) ||
      evd.hazard.toLowerCase().includes(q) ||
      (evd.camera && evd.camera.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#243247]">
        <div>
          <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#F1F5F9] tracking-tight">
            Evidence Vault
          </h1>
          <p className="text-[13px] text-[#94A3B8] mt-0.5">
            Archived visual evidence snapshots and annotated hazard frames.
          </p>
        </div>

        <span className="text-[12px] text-[#94A3B8]">
          Total Snapshots: <strong className="text-[#F1F5F9]">{evidenceList.length}</strong>
        </span>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#64748B]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search evidence by ID, hazard, or camera..."
          className="w-full pl-8 pr-3 py-1.5 bg-[#111C2E] border border-[#243247] rounded text-[13px] text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#22C7E8]"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((item) => (
          <div key={item.id} className="vg-card p-3 space-y-2.5 flex flex-col justify-between">
            <div>
              <div className="relative aspect-video rounded overflow-hidden border border-[#243247] bg-[#0B1220] mb-2">
                <img
                  src={item.imageUrl}
                  alt={item.hazard}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-1.5 py-0.2 rounded bg-[#0B1220]/80 font-mono text-[10px] text-[#22C7E8]">
                  {item.id}
                </span>
                <span className="absolute top-2 right-2 px-1.5 py-0.2 rounded font-mono text-[10px] font-semibold bg-[#EF4444] text-white">
                  {item.severity}
                </span>
              </div>

              <h3 className="text-[13px] font-semibold text-[#F1F5F9] truncate">{item.hazard}</h3>
              <p className="text-[11px] text-[#94A3B8]">{item.camera} · {item.timestamp}</p>
            </div>

            <div className="pt-2 border-t border-[#243247] flex items-center justify-between">
              <button
                onClick={() => setPreviewItem(item)}
                className="vg-btn-secondary text-[12px] py-1 px-2.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect</span>
              </button>

              <button
                onClick={() => deleteEvidence(item.id)}
                className="p-1 rounded text-[#64748B] hover:text-[#EF4444]"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-[#0B1220]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl vg-card p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#243247]">
              <div>
                <span className="font-mono text-[11px] text-[#22C7E8]">{previewItem.id}</span>
                <h3 className="text-[15px] font-semibold text-[#F1F5F9]">{previewItem.hazard}</h3>
              </div>
              <button onClick={() => setPreviewItem(null)} className="text-[#64748B] hover:text-[#F1F5F9]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded overflow-hidden border border-[#243247] bg-[#0B1220] max-h-80">
              <img src={previewItem.imageUrl} alt="preview" className="w-full h-80 object-contain mx-auto" />
            </div>

            <div className="flex justify-end pt-2 border-t border-[#243247]">
              <button onClick={() => setPreviewItem(null)} className="vg-btn-secondary text-[12px]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

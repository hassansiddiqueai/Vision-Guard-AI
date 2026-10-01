import React, { useState } from 'react';
import {
  FileText,
  Camera,
  Download,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Shield,
  Film,
  X
} from 'lucide-react';
import { useInspections } from '../context/InspectionContext';

export const EvidenceVaultPage = () => {
  const { evidence, incidents, selectedSite } = useInspections();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Combine SEED_EVIDENCE with incident evidence records
  const allEvidence = [
    ...(evidence || []),
    ...incidents
      .filter((i) => i.evidenceImage)
      .map((i) => ({
        id: `EVD-${i.id?.replace('INC-', '') || '99'}`,
        incidentId: i.id,
        hazard: i.hazard,
        camera: i.camera || 'CAM-001',
        site: i.site,
        location: i.location || 'Active Operational Sector',
        timestamp: i.detectedAt || '2026-10-01 15:04:22',
        confidence: i.confidence || 96,
        imageUrl: i.evidenceImage,
        fileSize: '3.6 MB',
        resolution: '1920x1080 (FHD)',
      })),
  ];

  // Deduplicate by ID
  const uniqueEvidence = Array.from(new Map(allEvidence.map((item) => [item.id, item])).values());

  const filteredEvidence = uniqueEvidence.filter((ev) => {
    const matchesSite = selectedSite === 'All Sites' || ev.site === selectedSite;
    const matchesSearch =
      ev.hazard.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.camera.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.incidentId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSite && matchesSearch;
  });

  const handleDownload = (ev) => {
    alert(`[EVIDENCE DOWNLOAD INITIATED] Downloading high-resolution optical evidence frame ${ev.id} (${ev.fileSize}, ${ev.resolution}) with cryptographic SHA-256 integrity hash.`);
  };

  const handleExportPDF = (ev) => {
    alert(`[PDF AUDIT REPORT EXPORT] Generating OSHA-compliant chain-of-custody audit report for ${ev.incidentId} (${ev.hazard}).`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-sky-700" />
              Evidence Vault & Audit Chain
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              TAMPER-EVIDENT ARCHIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically sealed visual frames, bounding box telemetry, and inspection records for HSE regulatory audit defense.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('[BATCH EXPORT] Exporting all site evidence records to ZIP archive.')}
            className="vg-btn-secondary text-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Archive (ZIP)</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="vg-card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search evidence by ID, incident, camera..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
          />
        </div>

        <div className="text-xs text-slate-500 font-mono font-medium">
          Showing <strong>{filteredEvidence.length}</strong> verified evidence frames
        </div>
      </div>

      {/* Evidence Grid (3 columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvidence.map((ev) => (
          <div
            key={ev.id}
            className="vg-card overflow-hidden flex flex-col justify-between border border-slate-200 hover:border-slate-300 transition shadow-xs"
          >
            {/* Top Bar */}
            <div className="px-3 py-1.5 bg-slate-900 text-white flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold text-sky-400">{ev.id}</span>
              <span className="text-slate-400 text-[10px]">INCIDENT: {ev.incidentId}</span>
            </div>

            {/* Evidence Image Container */}
            <div
              onClick={() => setSelectedItem(ev)}
              className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer group"
            >
              <img
                src={ev.imageUrl}
                alt={ev.hazard}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="px-3 py-1.5 bg-slate-900/90 text-white text-xs font-bold rounded flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-sky-400" /> Inspect Frame
                </span>
              </div>
              <div className="absolute bottom-1 right-2 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-slate-300">
                {ev.resolution || '1080p'}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2 text-xs">
              <div>
                <h3 className="font-bold text-slate-900 line-clamp-1">{ev.hazard}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{ev.site} &bull; {ev.camera}</p>
              </div>

              <div className="p-2 rounded bg-slate-50 border border-slate-200 space-y-0.5 text-[10px] font-mono text-slate-600">
                <div className="flex justify-between">
                  <span>Timestamp:</span>
                  <span className="text-slate-800 font-semibold">{ev.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span>CV Confidence:</span>
                  <span className="text-sky-700 font-bold">{ev.confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span>File Size:</span>
                  <span>{ev.fileSize || '3.8 MB'}</span>
                </div>
              </div>

              {/* Action Buttons: View | Download | Export PDF */}
              <div className="pt-2 border-t border-slate-200 grid grid-cols-3 gap-1.5 text-center">
                <button
                  onClick={() => setSelectedItem(ev)}
                  className="py-1 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-300 transition"
                >
                  View
                </button>
                <button
                  onClick={() => handleDownload(ev)}
                  className="py-1 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-300 transition"
                >
                  Download
                </button>
                <button
                  onClick={() => handleExportPDF(ev)}
                  className="py-1 px-2 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 text-[11px] font-bold border border-sky-200 transition"
                >
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Frame Preview Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden text-slate-800">
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono">
                <span className="font-bold text-sky-700">{selectedItem.id}</span>
                <span className="text-slate-400">&bull;</span>
                <span className="font-bold text-slate-900">{selectedItem.hazard}</span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.hazard}
                className="max-h-[55vh] object-contain rounded"
              />
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="font-mono text-slate-600 space-y-0.5">
                <div>Source: <strong>{selectedItem.camera}</strong> ({selectedItem.site})</div>
                <div>Recorded: <strong>{selectedItem.timestamp}</strong> &bull; Resolution: <strong>{selectedItem.resolution || '1080p'}</strong></div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(selectedItem)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded font-bold text-slate-800 transition"
                >
                  Download Frame
                </button>
                <button
                  onClick={() => handleExportPDF(selectedItem)}
                  className="vg-btn-primary text-xs font-bold px-3.5 py-1.5"
                >
                  Export Incident PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

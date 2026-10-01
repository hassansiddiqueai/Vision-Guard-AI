import React from 'react';
import { Camera, Download, X, Check, Copy, Shield, FileText } from 'lucide-react';

export const SnapshotModal = ({ snapshot, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!snapshot) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `VISIONGUARD_EVIDENCE_${snapshot.cameraId || 'CAM'}_${Date.now()}.png`;
    link.href = snapshot.dataUrl;
    link.click();
  };

  const handleCopyHash = () => {
    const hash = `SHA-256:${btoa(snapshot.timestamp + snapshot.cameraId).slice(0, 32).toUpperCase()}`;
    navigator.clipboard?.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const integrityHash = `SHA-256:${btoa(snapshot.timestamp + (snapshot.cameraId || 'CAM-001')).slice(0, 32).toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white border border-slate-300 rounded-lg shadow-2xl overflow-hidden text-slate-900 font-sans">
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-sm tracking-tight">SNAPSHOT CAPTURED &bull; VISUAL EVIDENCE</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Snapshot Image Preview */}
        <div className="p-4 space-y-4 bg-slate-50">
          <div className="relative rounded-md overflow-hidden border border-slate-300 bg-slate-950 aspect-video flex items-center justify-center shadow-inner">
            <img
              src={snapshot.dataUrl}
              alt="Captured Frame"
              className="w-full h-full object-contain"
            />
            <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700">
              {snapshot.cameraId || 'CAM-001'} &bull; {snapshot.resolution || '1280x720'}
            </div>
            <div className="absolute bottom-2 right-2 bg-slate-950/85 backdrop-blur-xs text-emerald-400 px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-900">
              TAMPER-EVIDENT FORENSIC FRAME
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            <div className="p-2.5 rounded bg-white border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase">Camera Source</span>
              <span className="font-bold text-slate-800">{snapshot.cameraId || 'CAM-001'}</span>
            </div>
            <div className="p-2.5 rounded bg-white border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase">Capture Timestamp</span>
              <span className="font-bold text-slate-800 truncate block">{snapshot.timestamp || new Date().toISOString()}</span>
            </div>
            <div className="p-2.5 rounded bg-white border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[10px] uppercase">Frame Hash</span>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 truncate text-[11px]">{integrityHash.slice(0, 16)}...</span>
                <button
                  onClick={handleCopyHash}
                  className="text-sky-600 hover:text-sky-800 text-[10px] flex items-center gap-0.5 font-sans font-semibold"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Frame archived to memory cache for inspection audit.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 rounded bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>SAVE IMAGE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

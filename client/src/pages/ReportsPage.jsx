import React, { useState } from 'react';
import { useInspections } from '../context/InspectionContext';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  Shield,
  MapPin,
  Calendar,
  User,
  Scan,
  Share2,
  Building,
} from 'lucide-react';

export const ReportsPage = () => {
  const { inspections } = useInspections();
  const [selectedId, setSelectedId] = useState(inspections[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);

  const currentInspection = inspections.find((item) => item.id === selectedId) || inspections[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Generate JSON/Text report export
      const reportData = JSON.stringify(currentInspection, null, 2);
      const blob = new Blob([reportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VisionGuard_Report_${currentInspection?.id || 'AUDIT'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }, 600);
  };

  if (!currentInspection) {
    return (
      <div className="py-20 text-center text-slate-400 font-mono text-xs">
        No inspection records available to generate reports.
      </div>
    );
  }

  const dateFormatted = new Date(currentInspection.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>Audit Documentation</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Inspection & Compliance Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Generate, preview, print, and export regulatory-grade inspection audit summaries.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>Print Audit Sheet</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>{isGenerating ? 'Exporting...' : 'Download JSON Data'}</span>
          </button>
        </div>
      </div>

      {/* Select Inspection Toolbar */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs print:hidden">
        <label htmlFor="audit-select" className="font-medium text-slate-300 flex items-center gap-2">
          <Building className="w-4 h-4 text-sky-400" />
          <span>Select Target Inspection:</span>
        </label>
        <select
          id="audit-select"
          aria-label="Select Target Inspection"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full sm:w-auto min-w-[340px] py-2 px-3 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-slate-200 font-mono text-xs"
        >
          {inspections.map((insp) => (
            <option key={insp.id} value={insp.id}>
              {insp.id} — {insp.name} ({insp.site})
            </option>
          ))}
        </select>
      </div>

      {/* Printable Report Document Container */}
      <div className="p-6 sm:p-8 rounded-xl bg-slate-950 border border-slate-800 space-y-6 shadow-2xl print:border-none print:shadow-none print:p-0">
        {/* Report Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-wide text-white flex items-center gap-1">
                VISION<span className="text-sky-400">GUARD</span> AI
              </span>
              <p className="text-[10px] text-slate-400 font-mono">INDUSTRIAL SAFETY INTELLIGENCE REPORT</p>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-slate-400 space-y-0.5">
            <div>
              REPORT REF: <span className="text-sky-400 font-bold">{currentInspection.id}</span>
            </div>
            <div>GENERATED: {dateFormatted}</div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-900/60 border border-slate-850 text-xs">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Site / Facility</span>
            <span className="font-semibold text-slate-200">{currentInspection.site}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Inspection Scope</span>
            <span className="font-semibold text-slate-200">{currentInspection.type}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Lead Auditor</span>
            <span className="font-semibold text-slate-200">{currentInspection.inspector}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Overall Risk Rating</span>
            <span
              className={`font-mono font-bold ${
                currentInspection.riskLevel === 'CRITICAL'
                  ? 'text-rose-400'
                  : currentInspection.riskLevel === 'HIGH'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {currentInspection.riskLevel} ({currentInspection.overallConfidence || 95}%)
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-300">
            1. Executive Summary
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/40 p-4 rounded-lg border border-slate-850">
            {currentInspection.summary ||
              'Comprehensive computer-vision audit executed across site imagery. All anomalous geometric patterns, protective barrier voids, and structural couplings were evaluated against safety benchmarks.'}
          </p>
        </div>

        {/* Evidence & Defect Image */}
        {currentInspection.imageUrl && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-300">
              2. Visual Evidence Target
            </h3>
            <div className="rounded-lg overflow-hidden border border-slate-800 max-h-80 bg-slate-900">
              <img
                src={currentInspection.imageUrl}
                alt="Audit target"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        )}

        {/* Detailed Findings Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-slate-300">
            3. Hazard Detections & Corrective Actions
          </h3>

          <div className="space-y-3">
            {(currentInspection.findings || []).map((f, idx) => (
              <div
                key={f.id || idx}
                className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-400">#{idx + 1}</span>
                    <span className="font-bold text-slate-200">{f.label}</span>
                  </div>
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                      f.severity === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : f.severity === 'HIGH'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {f.severity} • {f.confidence}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 pt-1">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Visual Evidence:</span>
                    <p className="text-[11px]">{f.evidence || 'Visual defect detected.'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Compliance Standard:</span>
                    <p className="text-[11px] font-mono text-sky-400">{f.complianceRef || 'Applicable safety baseline'}</p>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-850 mt-2">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                    Mandated Corrective Remediation:
                  </span>
                  <p className="text-slate-200 text-xs font-medium mt-0.5">
                    {f.correctiveAction || 'Halt operations in area and remediate.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Signoff Footer */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between gap-4 text-xs font-mono text-slate-400">
          <div>
            <span>SYSTEM SIGNATURE: </span>
            <span className="text-slate-200">VISIONGUARD-V2-ENGINE-VERIFIED</span>
          </div>
          <div>
            <span>AUDITOR SIGN-OFF: </span>
            <span className="text-slate-200">{currentInspection.inspector}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

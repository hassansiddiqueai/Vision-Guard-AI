import React, { useState } from 'react';
import { useInspections } from '../context/InspectionContext';
import {
  FileText,
  Printer,
  Download,
  Shield,
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
      const reportData = JSON.stringify(currentInspection, null, 2);
      const blob = new Blob([reportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VisionGuard_Report_${currentInspection?.id || 'AUDIT'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }, 400);
  };

  if (!currentInspection) {
    return (
      <div className="py-20 text-center text-[#94A3B8] text-[13px]">
        No inspection records available to generate reports.
      </div>
    );
  }

  const dateFormatted = new Date(currentInspection.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#243247] print:hidden">
        <div>
          <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#F1F5F9] tracking-tight">
            Inspection Reports
          </h1>
          <p className="text-[13px] text-[#94A3B8] mt-0.5">
            Generate and export regulatory-grade inspection audit reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="vg-btn-secondary">
            <Printer className="w-3.5 h-3.5 text-[#22C7E8]" />
            <span>Print Report</span>
          </button>

          <button onClick={handleDownload} disabled={isGenerating} className="vg-btn-primary">
            <Download className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Exporting...' : 'Download Data'}</span>
          </button>
        </div>
      </div>

      {/* Select Inspection Bar */}
      <div className="vg-card p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px] print:hidden">
        <label htmlFor="audit-select" className="font-medium text-[#F1F5F9] flex items-center gap-2">
          <Building className="w-4 h-4 text-[#22C7E8]" />
          <span>Select Inspection:</span>
        </label>
        <select
          id="audit-select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full sm:w-auto min-w-[320px] py-1.5 px-2.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9] text-[13px]"
        >
          {inspections.map((insp) => (
            <option key={insp.id} value={insp.id}>
              {insp.id} — {insp.name} ({insp.site})
            </option>
          ))}
        </select>
      </div>

      {/* Printable Report Container */}
      <div className="vg-card p-6 sm:p-8 space-y-5 print:border-none print:p-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#243247]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#22C7E8]/10 border border-[#22C7E8]/30 flex items-center justify-center text-[#22C7E8]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-[15px] text-[#F1F5F9]">
                VISION<span className="text-[#22C7E8]">GUARD</span>
              </span>
              <p className="text-[11px] text-[#94A3B8]">SAFETY INSPECTION AUDIT REPORT</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-[12px] text-[#94A3B8] space-y-0.5">
            <div>REPORT ID: <strong className="text-[#F1F5F9] font-mono">{currentInspection.id}</strong></div>
            <div>DATE: {dateFormatted}</div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded bg-[#0B1220] border border-[#243247] text-[12px]">
          <div>
            <span className="text-[#64748B] text-[11px] block">SITE</span>
            <span className="font-medium text-[#F1F5F9]">{currentInspection.site}</span>
          </div>
          <div>
            <span className="text-[#64748B] text-[11px] block">TYPE</span>
            <span className="font-medium text-[#F1F5F9]">{currentInspection.type}</span>
          </div>
          <div>
            <span className="text-[#64748B] text-[11px] block">INSPECTOR</span>
            <span className="font-medium text-[#F1F5F9]">{currentInspection.inspector}</span>
          </div>
          <div>
            <span className="text-[#64748B] text-[11px] block">RISK LEVEL</span>
            <span className="font-medium text-[#EF4444]">{currentInspection.riskLevel}</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-1.5">
          <h2 className="text-[13px] font-semibold text-[#F1F5F9] uppercase tracking-wider font-mono">
            1. Executive Summary
          </h2>
          <p className="text-[13px] text-[#94A3B8] leading-relaxed p-3 rounded bg-[#0B1220] border border-[#243247]">
            {currentInspection.summary}
          </p>
        </div>

        {/* Evidence Image */}
        {currentInspection.imageUrl && (
          <div className="space-y-1.5">
            <h2 className="text-[13px] font-semibold text-[#F1F5F9] uppercase tracking-wider font-mono">
              2. Visual Evidence Target
            </h2>
            <div className="rounded overflow-hidden border border-[#243247] bg-[#0B1220] max-h-72">
              <img
                src={currentInspection.imageUrl}
                alt="Inspection target"
                className="w-full h-72 object-cover"
              />
            </div>
          </div>
        )}

        {/* Findings */}
        <div className="space-y-2">
          <h2 className="text-[13px] font-semibold text-[#F1F5F9] uppercase tracking-wider font-mono">
            3. Findings & Corrective Actions
          </h2>

          <div className="space-y-2">
            {(currentInspection.findings || []).map((f, idx) => (
              <div key={f.id || idx} className="p-3 rounded bg-[#0B1220] border border-[#243247] space-y-1.5 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#F1F5F9]">
                    #{idx + 1} {f.label}
                  </span>
                  <span className="text-[#EF4444] font-medium font-mono">{f.severity} · {f.confidence}%</span>
                </div>

                <p className="text-[#94A3B8]">{f.evidence}</p>

                <div className="p-2 rounded bg-[#111C2E] border border-[#243247] mt-1">
                  <span className="text-[#64748B] text-[11px] block">CORRECTIVE ACTION:</span>
                  <p className="text-[#F1F5F9] font-medium mt-0.5">{f.correctiveAction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

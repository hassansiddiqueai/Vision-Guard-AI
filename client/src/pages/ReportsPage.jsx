import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Shield,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useInspections } from '../context/InspectionContext';
import { RiskBadge } from '../components/common/RiskBadge';

export const ReportsPage = () => {
  const { inspections, sites } = useInspections();
  const [selectedInspectionId, setSelectedInspectionId] = useState(inspections[0]?.id || 'INS-0241');

  const activeInspection = inspections.find((i) => i.id === selectedInspectionId) || inspections[0];

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeInspection, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeInspection.id}_Safety_Report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Safety Inspection & Audit Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate formal OSHA/ISO compliant safety inspection reports with evidence logs and corrective actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedInspectionId}
            onChange={(e) => setSelectedInspectionId(e.target.value)}
            className="bg-white border border-slate-300 text-slate-800 text-xs rounded px-2.5 py-1.5 focus:outline-none"
          >
            {inspections.map((insp) => (
              <option key={insp.id} value={insp.id}>
                {insp.id} — {insp.name}
              </option>
            ))}
          </select>

          <button onClick={handlePrint} className="vg-btn-primary text-xs">
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>

          <button onClick={handleExportJson} className="vg-btn-secondary text-xs">
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Printable Formal Audit Report Sheet */}
      <div className="vg-card p-8 max-w-4xl mx-auto bg-white text-slate-900 space-y-6 shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0">
        {/* Formal Header */}
        <div className="flex items-start justify-between pb-6 border-b-2 border-slate-900">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                VG
              </div>
              <span className="font-bold text-lg tracking-tight">VISIONGUARD INDUSTRIAL</span>
            </div>
            <p className="text-xs text-slate-500 font-mono">AUTOMATED COMPUTER VISION SAFETY AUDIT REPORT</p>
          </div>

          <div className="text-right text-xs">
            <div className="font-mono font-bold text-slate-900 text-sm">{activeInspection.id}</div>
            <div className="text-slate-500 mt-0.5">Date: {activeInspection.createdAt?.slice(0, 10)}</div>
            <div className="text-slate-500">Standard: OSHA 1926 & ISO 45001</div>
          </div>
        </div>

        {/* Audit Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Monitored Job Site</span>
            <span className="font-bold text-slate-900">{activeInspection.site}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Audit Sector / Location</span>
            <span className="font-medium text-slate-800">{activeInspection.location}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Lead Safety Auditor</span>
            <span className="font-medium text-slate-800">{activeInspection.inspector}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Overall Risk Status</span>
            <span className="font-bold text-red-600">{activeInspection.riskLevel}</span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            1. Executive Audit Summary
          </h3>
          <p className="text-slate-700 leading-relaxed">{activeInspection.summary}</p>
        </div>

        {/* Evidence Image and Bounding Box Record */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            2. Photographic Evidence & Coordinate Diagnostics
          </h3>
          <div className="border border-slate-200 rounded p-2 bg-slate-50 flex flex-col sm:flex-row gap-4 items-center">
            <img
              src={activeInspection.imageUrl}
              alt="Evidence Capture"
              className="w-full sm:w-80 h-48 object-cover rounded border border-slate-200"
            />
            <div className="space-y-2 text-xs flex-1">
              <span className="font-semibold text-slate-800 block">Anomaly Explanation:</span>
              <p className="text-slate-600 leading-relaxed">{activeInspection.explanation}</p>
              <div className="pt-2 text-[11px] font-mono text-slate-500">
                <span>File: {activeInspection.fileName}</span> | <span>Size: {activeInspection.fileSize}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Findings Register */}
        <div className="space-y-2 text-xs">
          <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
            3. Detailed Finding Register & Corrective Directives
          </h3>
          <table className="w-full border border-slate-200 text-left text-xs">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-2 border-b">Finding Item</th>
                <th className="p-2 border-b">Severity</th>
                <th className="p-2 border-b">Compliance Standard</th>
                <th className="p-2 border-b">Required Corrective Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(activeInspection.findings || []).map((f) => (
                <tr key={f.id}>
                  <td className="p-2 font-medium text-slate-900">{f.label}</td>
                  <td className="p-2">
                    <RiskBadge level={f.severity} size="sm" />
                  </td>
                  <td className="p-2 font-mono text-[11px] text-slate-600">{f.complianceRef}</td>
                  <td className="p-2 text-slate-700">{f.correctiveAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signatures & Approvals */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
          <div>
            <span className="text-slate-500 block mb-6">Certified Safety Auditor Signature:</span>
            <div className="border-b border-slate-400 w-48 mb-1"></div>
            <span className="font-medium text-slate-800">{activeInspection.inspector}</span>
          </div>

          <div>
            <span className="text-slate-500 block mb-6">Site Supervisor Verification & Closure:</span>
            <div className="border-b border-slate-400 w-48 mb-1"></div>
            <span className="font-medium text-slate-800">Pending Field Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
};

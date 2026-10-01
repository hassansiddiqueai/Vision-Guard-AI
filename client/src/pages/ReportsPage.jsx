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
  FileSpreadsheet
} from 'lucide-react';
import { useInspections } from '../context/InspectionContext';
import { RiskBadge } from '../components/common/RiskBadge';

export const ReportsPage = () => {
  const { inspections, incidents, sites, getStats, selectedSite } = useInspections();
  const [reportType, setReportType] = useState('INSPECTION'); // 'DAILY' | 'WEEKLY' | 'INSPECTION' | 'INCIDENT'
  const [selectedInspectionId, setSelectedInspectionId] = useState(inspections[0]?.id || 'INS-0241');

  const stats = getStats();
  const activeInspection = inspections.find((i) => i.id === selectedInspectionId) || inspections[0];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'INCIDENT') {
      csvContent += 'Incident ID,Hazard,Severity,Site,Location,Camera,Detected At,Status,Assigned To\n';
      incidents.forEach((inc) => {
        csvContent += `"${inc.id}","${inc.hazard}","${inc.severity}","${inc.site}","${inc.location}","${inc.camera}","${inc.detectedAt}","${inc.status}","${inc.assignedTo || ''}"\n`;
      });
    } else {
      csvContent += 'Inspection ID,Name,Site,Discipline,Date,Risk Level,Confidence,Status,Findings Count\n';
      inspections.forEach((insp) => {
        csvContent += `"${insp.id}","${insp.name}","${insp.site}","${insp.type}","${insp.createdAt}","${insp.riskLevel}","${insp.overallConfidence}%","${insp.status}","${insp.findings?.length || 0}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VisionGuard_${reportType}_Safety_Report.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-700" />
            Safety Audit & Compliance Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate printable OSHA 1926 / ISO 45001 safety reports with evidentiary frame crops and corrective action sign-offs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Report Type Switcher */}
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-md px-2.5 py-1.5 focus:outline-none"
          >
            <option value="INSPECTION">Inspection Audit Report</option>
            <option value="DAILY">Daily Safety Report</option>
            <option value="WEEKLY">Weekly Safety Summary</option>
            <option value="INCIDENT">Incident & Corrective Log</option>
          </select>

          {reportType === 'INSPECTION' && (
            <select
              value={selectedInspectionId}
              onChange={(e) => setSelectedInspectionId(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs rounded-md px-2.5 py-1.5 focus:outline-none"
            >
              {inspections.map((insp) => (
                <option key={insp.id} value={insp.id}>
                  {insp.id} &bull; {insp.name}
                </option>
              ))}
            </select>
          )}

          <button onClick={handlePrint} className="vg-btn-primary text-xs">
            <Printer className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>

          <button onClick={handleExportCSV} className="vg-btn-secondary text-xs">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Printable Formal Audit Report Sheet */}
      <div className="vg-card p-8 bg-white text-slate-900 space-y-6 shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0">
        {/* Formal Header */}
        <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                VG
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900">VISIONGUARD INDUSTRIAL</span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              {reportType === 'DAILY' && 'DAILY SITE SAFETY MONITORING LOG'}
              {reportType === 'WEEKLY' && 'WEEKLY EXECUTIVE SAFETY SUMMARY'}
              {reportType === 'INCIDENT' && 'INCIDENT & CORRECTIVE ACTION LOG'}
              {reportType === 'INSPECTION' && 'AUTOMATED COMPUTER VISION SAFETY AUDIT REPORT'}
            </p>
          </div>

          <div className="text-right text-xs">
            <div className="font-mono font-bold text-slate-900 text-sm">
              {reportType === 'INSPECTION' ? activeInspection.id : `REP-${new Date().toISOString().slice(0, 10)}`}
            </div>
            <div className="text-slate-500 mt-0.5">Date: {new Date().toLocaleDateString()}</div>
            <div className="text-slate-500">Standard: OSHA 1926 &bull; ISO 45001</div>
          </div>
        </div>

        {/* Executive Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-md border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Site Scope</span>
            <span className="font-bold text-slate-900">{selectedSite}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Overall Safety Score</span>
            <span className="font-bold text-emerald-700">{stats.siteSafetyScore}/100</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Critical Events</span>
            <span className="font-bold text-red-700">{stats.criticalHazards} Detected</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Camera Uptime</span>
            <span className="font-bold text-slate-900">99.8% Online</span>
          </div>
        </div>

        {/* Report Content Body based on type */}
        {reportType === 'INSPECTION' ? (
          <>
            {/* Visual Evidence Section */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                1. Visual Evidence & Neural Spatial Diagnostics
              </h2>
              <div className="relative rounded-md overflow-hidden border border-slate-200 bg-slate-900 aspect-video max-h-72 w-full">
                <img
                  src={activeInspection.imageUrl}
                  alt={activeInspection.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-slate-900/90 text-white font-mono text-[10px] px-2 py-0.5 rounded">
                  {activeInspection.id} &bull; Latency: 85ms
                </div>
              </div>
            </div>

            {/* Findings Table */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                2. Classified Hazards & OSHA Standards Mapping
              </h2>
              <table className="w-full text-left text-xs border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                    <th className="py-2 px-3">Hazard Identifier</th>
                    <th className="py-2 px-3">Standard Reference</th>
                    <th className="py-2 px-3">Severity</th>
                    <th className="py-2 px-3">Confidence</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeInspection.findings.map((f) => (
                    <tr key={f.id}>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{f.label}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{f.complianceRef}</td>
                      <td className="py-2.5 px-3">
                        <RiskBadge level={f.severity} size="sm" />
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{f.confidence}%</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-700">{f.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Corrective Actions */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                3. Mandatory Corrective Directives
              </h2>
              <div className="space-y-2">
                {activeInspection.recommendations.map((rec, i) => (
                  <div key={i} className="p-3 rounded-md bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900">{rec.priority}</span>
                    </div>
                    <p className="text-slate-700 mt-1 font-semibold">{rec.action}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">{rec.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Incident / Daily Summary Table */
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Chronological Incident & Action Registry
            </h2>
            <table className="w-full text-left text-xs border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                  <th className="py-2 px-3">Incident ID</th>
                  <th className="py-2 px-3">Hazard</th>
                  <th className="py-2 px-3">Severity</th>
                  <th className="py-2 px-3">Site & Camera</th>
                  <th className="py-2 px-3">Detected Time</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Assigned Supervisor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incidents.map((inc) => (
                  <tr key={inc.id}>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{inc.id}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{inc.hazard}</td>
                    <td className="py-2.5 px-3"><RiskBadge level={inc.severity} size="sm" /></td>
                    <td className="py-2.5 px-3 text-slate-600">{inc.site} ({inc.camera})</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{inc.detectedAt}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{inc.status}</td>
                    <td className="py-2.5 px-3 text-slate-700">{inc.assignedTo || 'Unassigned'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Formal Sign-off Section */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Lead Safety Officer</span>
            <div className="h-10 border-b border-slate-300 mt-2 flex items-end font-serif italic text-slate-700">
              Marcus Vance, Certified Safety Professional (CSP)
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Signature & Digital Timestamp Token</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Site Operations Director</span>
            <div className="h-10 border-b border-slate-300 mt-2 flex items-end font-serif italic text-slate-700">
              Jackson Reed, EHS Operations
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Verified & Approved for Compliance Archival</span>
          </div>
        </div>
      </div>
    </div>
  );
};

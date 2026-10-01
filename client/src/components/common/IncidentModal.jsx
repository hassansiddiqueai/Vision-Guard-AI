import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  AlertTriangle,
  Shield,
  Clock,
  UserCheck,
  Camera,
  FileText,
  Download,
  Share2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useInspections } from '../../context/InspectionContext';
import { RiskBadge } from './RiskBadge';

export const IncidentModal = ({ incident, onClose }) => {
  const { updateIncidentStatus, escalateIncident, verifyIncident } = useInspections();
  const [verificationFeedback, setVerificationFeedback] = useState(incident?.humanVerification || 'PENDING');
  const [notes, setNotes] = useState(incident?.correctiveActionNotes || '');
  const [escalateReason, setEscalateReason] = useState('');
  const [showEscalateInput, setShowEscalateInput] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!incident) return null;

  // Default timeline if not set
  const timelineMilestones = incident.timeline && incident.timeline.length > 0 ? incident.timeline : [
    { time: incident.detectedAt ? incident.detectedAt.split(' ')[1] || '15:04:22' : '15:04:22', event: 'Computer Vision hazard detection triggered', status: 'DETECTED', type: 'system' },
    { time: '15:04:24', event: `AI neural risk verification score: ${incident.confidence || 96}% confidence`, status: 'VERIFIED', type: 'ai' },
    { time: '15:04:27', event: 'Human verification requested to Duty Safety Supervisor', status: 'PENDING', type: 'workflow' },
    { time: '15:04:31', event: `Supervisor notified (${incident.assignedTo || 'Site Lead'})`, status: 'NOTIFIED', type: 'workflow' },
    { time: incident.status !== 'DETECTED' ? '15:05:02' : 'Pending', event: 'Incident acknowledged by field operations', status: incident.status !== 'DETECTED' ? 'ACKNOWLEDGED' : 'WAITING', type: 'human' },
    { time: incident.status === 'CLOSED' ? '15:06:10' : 'Pending', event: 'Corrective action implemented and verified on site', status: incident.status === 'CLOSED' ? 'RESOLVED' : 'WAITING', type: 'human' },
  ];

  const handleAcknowledge = () => {
    updateIncidentStatus(incident.id, 'ACKNOWLEDGED', {
      correctiveActionNotes: notes || incident.correctiveActionNotes || 'Acknowledged by Site Safety Supervisor.',
    });
  };

  const handleVerify = (status) => {
    setVerificationFeedback(status);
    verifyIncident(incident.id, status, `Human confirmation: Marked as ${status}`);
  };

  const handleEscalate = () => {
    if (!showEscalateInput) {
      setShowEscalateInput(true);
      return;
    }
    escalateIncident(incident.id, escalateReason || 'Critical hazard escalated to Corporate HSE Director');
    setShowEscalateInput(false);
  };

  const handleResolve = () => {
    updateIncidentStatus(incident.id, 'CLOSED', {
      correctiveActionNotes: notes || 'Hazard mitigated and physical perimeter secured.',
      resolvedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      humanVerification: 'VERIFIED',
    });
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`[AUDIT EVIDENCE EXPORT] Incident report PDF generated for ${incident.id} (${incident.hazard}). Download ready.`);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-lg shadow-2xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800">
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded border border-slate-300">
              {incident.id}
            </span>
            <RiskBadge level={incident.severity} size="sm" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {incident.hazard}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="hidden sm:flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-100 px-2.5 py-1 rounded transition"
              title="Export Incident Audit PDF"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{isExporting ? 'Exporting...' : 'Export Audit'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {/* Top Telemetry & Location Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-md border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Camera / Source</span>
              <span className="font-semibold text-slate-900 block truncate">{incident.camera || 'CAM-001'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Monitored Site</span>
              <span className="font-semibold text-slate-900 block truncate">{incident.site || 'Apex Tower Project'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">Timestamp</span>
              <span className="font-mono text-slate-800 block">{incident.detectedAt || '2026-10-01 15:04:22'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-mono">AI Confidence</span>
              <span className="font-mono font-bold text-sky-700 block">{incident.confidence || 96}% CV Confidence</span>
            </div>
          </div>

          {/* Visual Evidence Frame & Detection Overlay */}
          <div className="border border-slate-200 rounded-md overflow-hidden bg-slate-900">
            <div className="px-3 py-1.5 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between text-slate-300">
              <span className="text-[11px] font-mono flex items-center gap-1.5 font-semibold text-white">
                <Camera className="w-3.5 h-3.5 text-sky-400" />
                VISUAL EVIDENCE FRAME &bull; {incident.camera}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">
                AI BOUNDING BOX ACTIVE
              </span>
            </div>
            <div className="relative aspect-video max-h-64 sm:max-h-72 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={incident.evidenceImage || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1000&auto=format&fit=crop'}
                alt="Hazard Evidence"
                className="w-full h-full object-cover"
              />
              {/* Overlaid Detection Box & Tag */}
              <div className="absolute inset-0 pointer-events-none p-4">
                <div className="border-2 border-red-500 bg-red-500/10 rounded absolute left-[22%] top-[18%] w-[38%] h-[55%] flex flex-col justify-between p-1.5">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="bg-red-600 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded">
                      {incident.hazard?.toUpperCase() || 'CRITICAL HAZARD'}
                    </span>
                    <span className="bg-slate-900 text-slate-200 font-mono text-[9px] px-1 py-0.5 rounded">
                      {incident.confidence || 96}% CONFIDENCE
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-red-300 bg-slate-950/80 px-1 rounded self-start">
                    ZONE: {incident.location || 'Sector 4B Platform'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: WHY IS THIS DANGEROUS? */}
          <div className="p-3.5 rounded-md bg-red-50/70 border border-red-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-red-900 font-bold text-xs uppercase tracking-wide">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>Why Is This Dangerous?</span>
            </div>
            <p className="text-slate-800 text-xs leading-relaxed">
              {incident.explanation || 'Visual computer vision telemetry detected an active deviation from workplace safety controls. Failure to address this condition presents immediate physical injury risk to site personnel and violates OSHA regulatory standards.'}
            </p>
          </div>

          {/* Section: RECOMMENDED ACTION */}
          <div className="p-3.5 rounded-md bg-sky-50/70 border border-sky-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-sky-900 font-bold text-xs uppercase tracking-wide">
              <Shield className="w-3.5 h-3.5 text-sky-700" />
              <span>Recommended Operational Action</span>
            </div>
            <p className="text-slate-800 text-xs leading-relaxed">
              {incident.recommendedAction || 'Immediately issue a verbal halt to workers in the affected zone. Dispatch the assigned safety officer to inspect the area, enforce PPE / guardrail requirements, and record verified corrective action.'}
            </p>
          </div>

          {/* Section: HUMAN VERIFICATION */}
          <div className="p-3.5 rounded-md bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wide">Human Verification Control</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                verificationFeedback === 'VERIFIED'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : verificationFeedback === 'REJECTED'
                  ? 'bg-slate-200 text-slate-700 border border-slate-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                STATUS: {verificationFeedback}
              </span>
            </div>

            <p className="text-[11px] text-slate-600">
              Confirm whether the AI detection reflects a genuine workplace safety hazard or a false positive.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleVerify('VERIFIED')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition ${
                  verificationFeedback === 'VERIFIED'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verify Hazard (Genuine Incident)</span>
              </button>

              <button
                type="button"
                onClick={() => handleVerify('REJECTED')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition ${
                  verificationFeedback === 'REJECTED'
                    ? 'bg-slate-700 text-white'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject (False Anomaly)</span>
              </button>
            </div>
          </div>

          {/* Section: INCIDENT TIMELINE */}
          <div className="p-3.5 rounded-md bg-white border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Incident Lifecycle Timeline
              </span>
              <span className="text-[10px] font-mono text-slate-400">AUDIT TRAIL</span>
            </div>

            <div className="space-y-2.5 pl-1">
              {timelineMilestones.map((step, idx) => {
                const isCompleted = step.status !== 'WAITING';
                return (
                  <div key={idx} className="flex items-start gap-3 relative">
                    <span className="font-mono text-[10px] text-slate-500 font-semibold w-16 shrink-0 pt-0.5">
                      {step.time}
                    </span>
                    <div className="relative flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        isCompleted ? 'bg-sky-600' : 'bg-slate-300'
                      }`} />
                      {idx < timelineMilestones.length - 1 && (
                        <div className="w-0.5 h-5 bg-slate-200 mt-0.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${isCompleted ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                        {step.event}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Supervisor Corrective Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-800">
              Supervisor Corrective Action Log
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record operational resolution notes (e.g., tether secured, safety stand-down completed, zone barricaded)..."
              className="w-full bg-white border border-slate-300 rounded-md p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-sky-600 focus:outline-none"
            />
          </div>

          {/* Optional Escalation Input Box */}
          {showEscalateInput && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md space-y-2">
              <span className="text-xs font-bold text-red-900 block">
                Escalate Incident to Corporate HSE Director
              </span>
              <input
                type="text"
                value={escalateReason}
                onChange={(e) => setEscalateReason(e.target.value)}
                placeholder="Reason for immediate leadership escalation..."
                className="w-full bg-white border border-red-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowEscalateInput(false)}
                  className="px-2.5 py-1 text-xs bg-slate-200 text-slate-700 rounded hover:bg-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEscalate}
                  className="px-2.5 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 font-bold"
                >
                  Confirm Escalation
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions: ACKNOWLEDGE | ESCALATE | RESOLVE */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition"
          >
            Close
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {incident.status === 'DETECTED' && (
              <button
                onClick={handleAcknowledge}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-md hover:bg-slate-100 shadow-xs transition"
              >
                Acknowledge Incident
              </button>
            )}

            {incident.status !== 'ESCALATED' && incident.status !== 'CLOSED' && (
              <button
                onClick={handleEscalate}
                className="px-3.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-100 transition"
              >
                Escalate Incident
              </button>
            )}

            {incident.status !== 'CLOSED' ? (
              <button
                onClick={handleResolve}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs transition"
              >
                Mark Resolved & Close
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-md">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Resolved & Archived
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

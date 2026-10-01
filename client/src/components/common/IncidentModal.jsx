import React, { useState } from 'react';
import { X, CheckCircle, Clock, UserCheck, AlertTriangle, Shield, ArrowRight, Camera, FileText } from 'lucide-react';
import { useInspections } from '../../context/InspectionContext';
import { RiskBadge } from './RiskBadge';

export const IncidentModal = ({ incident, onClose }) => {
  const { updateIncidentStatus, assignIncident } = useInspections();
  const [assignedTo, setAssignedTo] = useState(incident?.assignedTo || 'Site Safety Lead');
  const [dueDate, setDueDate] = useState(incident?.dueDate || '2026-10-01 16:00');
  const [notes, setNotes] = useState(incident?.correctiveActionNotes || '');
  const [afterImage, setAfterImage] = useState(incident?.afterImage || '');

  if (!incident) return null;

  const steps = [
    { key: 'DETECTED', label: '1. Detected' },
    { key: 'ACKNOWLEDGED', label: '2. Acknowledged' },
    { key: 'ASSIGNED', label: '3. Assigned' },
    { key: 'CORRECTIVE_ACTION', label: '4. Action In Progress' },
    { key: 'VERIFICATION', label: '5. Verification' },
    { key: 'CLOSED', label: '6. Closed' },
  ];

  const currentStepIdx = steps.findIndex((s) => s.key === incident.status) || 0;

  const handleSaveAssignment = (e) => {
    e.preventDefault();
    assignIncident(incident.id, assignedTo, dueDate, notes);
  };

  const handleAdvanceStatus = (nextStatus) => {
    updateIncidentStatus(incident.id, nextStatus, {
      correctiveActionNotes: notes,
      afterImage: afterImage || incident.afterImage,
      verificationRequired: nextStatus === 'VERIFICATION',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-lg shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
              {incident.id}
            </span>
            <RiskBadge level={incident.severity} size="sm" />
            <h2 className="text-sm font-semibold text-slate-900 truncate">{incident.hazard}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lifecycle Stepper */}
        <div className="p-3 border-b border-slate-200 bg-white overflow-x-auto">
          <div className="flex items-center justify-between min-w-[500px]">
            {steps.map((step, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              return (
                <div key={step.key} className="flex items-center gap-1.5 text-xs">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-sky-600 text-white'
                        : isPast
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isPast ? '✓' : idx + 1}
                  </span>
                  <span
                    className={`font-medium ${
                      isCurrent ? 'text-sky-700 font-semibold' : isPast ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  {idx < steps.length - 1 && <span className="text-slate-300 mx-1">→</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-50 rounded border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[11px]">Site</span>
              <span className="font-medium text-slate-800">{incident.site}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Camera / Sector</span>
              <span className="font-medium text-slate-800">{incident.camera || incident.location}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Detected Time</span>
              <span className="font-medium text-slate-800">{incident.detectedAt}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Assigned Officer</span>
              <span className="font-medium text-slate-800">{incident.assignedTo || 'Unassigned'}</span>
            </div>
          </div>

          {/* Evidence Frame: Before vs After */}
          <div className="space-y-1.5">
            <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-slate-500" /> Evidence Records (Before & After)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-slate-200 rounded p-2 bg-slate-50">
                <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block mb-1">
                  Initial Hazard Detection (Before)
                </span>
                <img
                  src={incident.evidenceImage}
                  alt="Hazard Evidence"
                  className="w-full h-36 object-cover rounded border border-slate-200"
                />
              </div>

              <div className="border border-slate-200 rounded p-2 bg-slate-50">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                  Remediation Proof (After)
                </span>
                {incident.afterImage ? (
                  <img
                    src={incident.afterImage}
                    alt="Remediation Proof"
                    className="w-full h-36 object-cover rounded border border-slate-200"
                  />
                ) : (
                  <div className="w-full h-36 border border-dashed border-slate-300 rounded flex flex-col items-center justify-center text-slate-400 text-center p-2">
                    <span>No remediation photo uploaded yet</span>
                    <button
                      onClick={() => setAfterImage('https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop')}
                      className="mt-2 text-[11px] text-sky-600 hover:underline"
                    >
                      + Attach Field Verification Photo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Operational Q&A Context */}
          <div className="space-y-2 p-3 bg-slate-50 rounded border border-slate-200">
            <div>
              <span className="font-semibold text-slate-900 block">WHY IS THIS DANGEROUS?</span>
              <p className="text-slate-600 mt-0.5">{incident.explanation}</p>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-900 block">RECOMMENDED ACTION</span>
              <p className="text-slate-600 mt-0.5">{incident.recommendedAction}</p>
            </div>
          </div>

          {/* Corrective Action Form */}
          <form onSubmit={handleSaveAssignment} className="space-y-3 border-t border-slate-200 pt-3">
            <h4 className="font-semibold text-slate-800">Corrective Action Tracking</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Assigned Supervisor</label>
                <input
                  type="text"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Target Resolution Due Date</label>
                <input
                  type="text"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">Field Corrective Action Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log actions taken on site (e.g. locking pin inserted, safety stand-down completed)..."
                className="w-full bg-white border border-slate-300 rounded p-2 text-xs text-slate-800"
              />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="vg-btn-secondary text-xs">
                Save Assignment Details
              </button>
            </div>
          </form>

          {incident.verificationRequired && (
            <div className="p-2.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Human Confirmation Mandatory:</strong> Potentially resolved — safety supervisor verification required before final closure.
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button onClick={onClose} className="vg-btn-secondary text-xs">
            Close Panel
          </button>

          <div className="flex items-center gap-2">
            {incident.status === 'DETECTED' && (
              <button
                onClick={() => handleAdvanceStatus('ACKNOWLEDGED')}
                className="vg-btn-secondary text-xs"
              >
                Acknowledge Incident
              </button>
            )}

            {incident.status === 'ACKNOWLEDGED' && (
              <button
                onClick={() => handleAdvanceStatus('ASSIGNED')}
                className="vg-btn-primary text-xs"
              >
                Assign to Field Officer
              </button>
            )}

            {incident.status === 'ASSIGNED' && (
              <button
                onClick={() => handleAdvanceStatus('CORRECTIVE_ACTION')}
                className="vg-btn-primary text-xs"
              >
                Start Corrective Action
              </button>
            )}

            {incident.status === 'CORRECTIVE_ACTION' && (
              <button
                onClick={() => handleAdvanceStatus('VERIFICATION')}
                className="vg-btn-primary text-xs"
              >
                Mark Corrected (Request Verification)
              </button>
            )}

            {incident.status === 'VERIFICATION' && (
              <button
                onClick={() => handleAdvanceStatus('CLOSED')}
                className="vg-btn-primary text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Verify & Close Incident
              </button>
            )}

            {incident.status === 'CLOSED' && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Incident Verified & Closed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

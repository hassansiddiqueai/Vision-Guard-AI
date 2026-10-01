import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import {
  Shield,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  User,
  Clock,
  Check,
  XCircle,
  Download,
  Share2,
} from 'lucide-react';

export const InspectionResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInspection, updateFindingStatus, assignFinding, addNote } = useInspections();

  const inspection = getInspection(id);
  const [selectedFindingId, setSelectedFindingId] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');

  if (!inspection) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-[18px] font-semibold text-[#F1F5F9]">Inspection Not Found</h2>
        <p className="text-[13px] text-[#94A3B8]">The requested inspection record does not exist.</p>
        <Link to="/inspections" className="vg-btn-primary">
          Back to Inspections
        </Link>
      </div>
    );
  }

  const findings = inspection.findings || [];
  const activeFinding = findings.find((f) => f.id === selectedFindingId) || findings[0] || null;

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addNote(inspection.id, newNoteText.trim(), 'Safety Inspector');
    setNewNoteText('');
  };

  const getRiskBadge = (severity) => {
    const s = (severity || 'LOW').toUpperCase();
    if (s === 'CRITICAL') return <span className="vg-badge-critical">CRITICAL</span>;
    if (s === 'HIGH') return <span className="vg-badge-high">HIGH</span>;
    if (s === 'MEDIUM') return <span className="vg-badge-medium">MEDIUM</span>;
    return <span className="vg-badge-safe">LOW</span>;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#243247]">
        <div className="flex items-center gap-3">
          <Link
            to="/inspections"
            className="p-1.5 rounded bg-[#111C2E] border border-[#243247] text-[#94A3B8] hover:text-[#F1F5F9]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-[#22C7E8]">{inspection.id}</span>
              <span className="text-[#64748B]">·</span>
              <span className="text-[12px] text-[#94A3B8]">{inspection.site}</span>
            </div>
            <h1 className="text-[20px] font-semibold text-[#F1F5F9] tracking-tight">
              {inspection.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/reports" className="vg-btn-secondary">
            <FileText className="w-3.5 h-3.5 text-[#22C7E8]" />
            <span>Generate Report</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Left Visual Evidence + Right Findings & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 7 Cols: Image & Overlay */}
        <div className="lg:col-span-7 space-y-3">
          <div className="vg-card p-3 space-y-2">
            <div className="flex items-center justify-between text-[12px] text-[#94A3B8] font-medium">
              <span>Visual Evidence Frame</span>
              <span>Overall Confidence: <strong className="text-[#F1F5F9] font-mono">{inspection.overallConfidence || 95}%</strong></span>
            </div>

            <div className="relative rounded bg-[#0B1220] border border-[#243247] overflow-hidden">
              <img
                src={inspection.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop'}
                alt={inspection.name}
                className="w-full max-h-[440px] object-cover mx-auto"
              />

              {/* Bounding box overlay for selected finding */}
              {activeFinding && (
                <div
                  className="absolute pointer-events-none border-2 border-[#EF4444] bg-[#EF4444]/10 rounded"
                  style={{ top: '25%', left: '35%', width: '35%', height: '45%' }}
                >
                  <div className="absolute -top-5 left-0 px-1.5 py-0.2 bg-[#EF4444] text-white font-mono text-[10px] font-semibold rounded">
                    {activeFinding.label} · {activeFinding.confidence}%
                  </div>
                </div>
              )}
            </div>

            <p className="text-[12px] text-[#94A3B8] leading-relaxed pt-1">
              {inspection.summary}
            </p>
          </div>

          {/* Explainable AI Diagnostics */}
          {activeFinding && (
            <div className="vg-card p-4 space-y-3">
              <h3 className="text-[13px] font-semibold text-[#F1F5F9] uppercase tracking-wider font-mono">
                Why was this detected?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
                <div className="p-2.5 rounded bg-[#0B1220] border border-[#243247]">
                  <span className="text-[#64748B] text-[11px] block font-mono">DETECTED OBJECT</span>
                  <p className="text-[#F1F5F9] font-medium mt-0.5">{activeFinding.label}</p>
                </div>

                <div className="p-2.5 rounded bg-[#0B1220] border border-[#243247]">
                  <span className="text-[#64748B] text-[11px] block font-mono">SEVERITY & CONFIDENCE</span>
                  <p className="text-[#EF4444] font-medium mt-0.5 font-mono">{activeFinding.severity} · {activeFinding.confidence}%</p>
                </div>

                <div className="p-2.5 rounded bg-[#0B1220] border border-[#243247] sm:col-span-2">
                  <span className="text-[#64748B] text-[11px] block font-mono">VISUAL EVIDENCE</span>
                  <p className="text-[#94A3B8] mt-0.5">{activeFinding.evidence || 'Optical anomaly detected.'}</p>
                </div>

                <div className="p-2.5 rounded bg-[#0B1220] border border-[#243247] sm:col-span-2">
                  <span className="text-[#64748B] text-[11px] block font-mono">MAPPED SAFETY REQUIREMENT</span>
                  <p className="text-[#22C7E8] font-mono text-[11px] mt-0.5">{activeFinding.complianceRef || 'Applicable safety baseline'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Findings & Remediation */}
        <div className="lg:col-span-5 space-y-3">
          {/* Summary Box */}
          <div className="vg-card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#243247]">
              <div>
                <span className="text-[11px] text-[#64748B] uppercase font-mono block">Overall Risk</span>
                <span className="text-[16px] font-semibold text-[#F1F5F9]">{inspection.riskLevel}</span>
              </div>
              {getRiskBadge(inspection.riskLevel)}
            </div>

            {/* Findings List */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase text-[#94A3B8] tracking-wider block">
                Detected Findings ({findings.length})
              </span>

              {findings.map((f) => {
                const isSelected = activeFinding?.id === f.id;
                const isResolved = f.status === 'Resolved' || f.status === 'Compliant';

                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFindingId(f.id)}
                    className={`p-3 rounded border cursor-pointer transition ${
                      isSelected
                        ? 'bg-[#16243B] border-[#22C7E8]'
                        : 'bg-[#0B1220] border-[#243247] hover:border-[#384F70]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[13px] font-medium text-[#F1F5F9]">{f.label}</span>
                      <span className="text-[11px] font-mono font-semibold text-[#EF4444]">{f.severity}</span>
                    </div>

                    <p className="text-[11px] text-[#94A3B8] leading-normal">{f.riskFactor || f.evidence}</p>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#243247] text-[11px]">
                      <span className="text-[#64748B]">
                        Status: <strong className={isResolved ? 'text-[#22C55E]' : 'text-[#F59E0B]'}>{f.status || 'Open'}</strong>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateFindingStatus(inspection.id, f.id, isResolved ? 'Open' : 'Resolved');
                        }}
                        className="text-[#22C7E8] hover:underline font-medium"
                      >
                        {isResolved ? 'Reopen' : 'Mark Resolved'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Corrective Action Panel */}
          {activeFinding && (
            <div className="vg-card p-4 space-y-3">
              <h3 className="text-[13px] font-semibold text-[#F1F5F9]">
                Mandated Corrective Action
              </h3>

              <div className="p-3 rounded bg-[#0B1220] border border-[#243247] text-[12px] space-y-1">
                <p className="text-[#F1F5F9] font-medium">{activeFinding.correctiveAction}</p>
                <div className="flex justify-between text-[#64748B] text-[11px] pt-1">
                  <span>Assigned: <strong className="text-[#94A3B8]">{activeFinding.assignedTo || 'Unassigned'}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const assignee = prompt('Assign finding to personnel:', activeFinding.assignedTo || 'Site Lead');
                    if (assignee) assignFinding(inspection.id, activeFinding.id, assignee);
                  }}
                  className="vg-btn-secondary flex-1 justify-center py-1.5 text-[12px]"
                >
                  Assign Action
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const isResolved = activeFinding.status === 'Resolved' || activeFinding.status === 'Compliant';
                    updateFindingStatus(inspection.id, activeFinding.id, isResolved ? 'Open' : 'Resolved');
                  }}
                  className="vg-btn-primary flex-1 justify-center py-1.5 text-[12px]"
                >
                  {activeFinding.status === 'Resolved' ? 'Reopen Finding' : 'Mark Resolved'}
                </button>
              </div>
            </div>
          )}

          {/* Notes Log */}
          <div className="vg-card p-4 space-y-3">
            <h3 className="text-[13px] font-semibold text-[#F1F5F9]">
              Inspector Notes
            </h3>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {(inspection.notesList || []).map((n) => (
                <div key={n.id} className="p-2 rounded bg-[#0B1220] border border-[#243247] text-[11px]">
                  <div className="flex justify-between text-[#64748B]">
                    <span className="font-medium text-[#94A3B8]">{n.author}</span>
                    <span>{n.date}</span>
                  </div>
                  <p className="text-[#F1F5F9] mt-0.5">{n.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add audit note..."
                className="flex-1 py-1.5 px-2.5 bg-[#0B1220] border border-[#243247] rounded text-[12px] text-[#F1F5F9] placeholder-[#64748B]"
              />
              <button type="submit" className="vg-btn-secondary py-1.5 text-[12px]">
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

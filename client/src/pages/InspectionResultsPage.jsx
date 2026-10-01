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
} from 'lucide-react';
import { RiskBadge } from '../components/common/RiskBadge';

export const InspectionResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInspection, updateFindingStatus } = useInspections();

  const inspection = getInspection(id);
  const [selectedFindingId, setSelectedFindingId] = useState(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [notesList, setNotesList] = useState(inspection?.notesList || []);

  if (!inspection) {
    return (
      <div className="py-20 text-center space-y-3">
        <h2 className="text-base font-semibold text-slate-800">Inspection Not Found</h2>
        <p className="text-xs text-slate-500">The requested audit record does not exist.</p>
        <Link to="/inspections" className="vg-btn-primary text-xs">
          Back to Inspection Logs
        </Link>
      </div>
    );
  }

  const findings = inspection.findings || [];
  const activeFinding = findings.find((f) => f.id === selectedFindingId) || findings[0] || null;

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const newEntry = {
      id: Date.now(),
      author: 'Safety Inspector',
      text: newNoteText.trim(),
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setNotesList((prev) => [...prev, newEntry]);
    setNewNoteText('');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/inspections"
            className="p-1.5 rounded bg-white border border-slate-300 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-sky-700">{inspection.id}</span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-600">{inspection.site}</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
              {inspection.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/reports" className="vg-btn-secondary text-xs">
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Generate Formal Report</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Left Visual Evidence + Right Findings & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 7 Cols: Image & Overlay */}
        <div className="lg:col-span-7 space-y-3">
          <div className="vg-card p-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Visual Evidence Capture Frame</span>
              <span>Overall Model Confidence: <strong className="text-slate-900 font-mono">{inspection.overallConfidence || 95}%</strong></span>
            </div>

            <div className="relative rounded bg-slate-900 border border-slate-200 overflow-hidden">
              <img
                src={inspection.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop'}
                alt={inspection.name}
                className="w-full max-h-[420px] object-cover mx-auto"
              />

              {/* Bounding box overlay for selected finding */}
              {activeFinding && (
                <div
                  className="absolute pointer-events-none border-2 border-red-600 bg-red-600/15 rounded"
                  style={{ top: '22%', left: '38%', width: '32%', height: '42%' }}
                >
                  <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-red-600 text-white font-mono text-[10px] font-bold rounded">
                    {activeFinding.label} · {activeFinding.confidence}%
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              {inspection.summary}
            </p>
          </div>

          {/* Explainable AI Diagnostics */}
          {activeFinding && (
            <div className="vg-card p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono border-b border-slate-200 pb-1.5">
                WHY IS THIS CLASSIFIED AS A RISK?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase block font-mono">DETECTED ANOMALY</span>
                  <p className="text-slate-900 font-semibold mt-0.5">{activeFinding.label}</p>
                </div>

                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[10px] uppercase block font-mono">SEVERITY & CONFIDENCE</span>
                  <p className="text-red-600 font-bold mt-0.5 font-mono">{activeFinding.severity} · {activeFinding.confidence}%</p>
                </div>

                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 sm:col-span-2">
                  <span className="text-slate-500 text-[10px] uppercase block font-mono">GEOMETRIC / TEXTURE EVIDENCE</span>
                  <p className="text-slate-700 mt-0.5">{activeFinding.evidence || 'Optical void anomaly detected in coupling joint.'}</p>
                </div>

                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 sm:col-span-2">
                  <span className="text-slate-500 text-[10px] uppercase block font-mono">OSHA / ISO MANDATED STANDARD</span>
                  <p className="text-sky-700 font-semibold font-mono text-[11px] mt-0.5">{activeFinding.complianceRef || 'OSHA 1926.451 Standard'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Findings & Remediation */}
        <div className="lg:col-span-5 space-y-3">
          {/* Summary Box */}
          <div className="vg-card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Overall Risk Level</span>
                <span className="text-base font-bold text-slate-900">{inspection.riskLevel}</span>
              </div>
              <RiskBadge level={inspection.riskLevel} size="sm" />
            </div>

            {/* Findings List */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase text-slate-600 tracking-wider block">
                Audit Findings ({findings.length})
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
                        ? 'bg-sky-50/50 border-sky-600'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-900">{f.label}</span>
                      <RiskBadge level={f.severity} size="sm" />
                    </div>

                    <p className="text-[11px] text-slate-600 leading-normal">{f.riskFactor || f.evidence}</p>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500">
                        Status: <strong className={isResolved ? 'text-emerald-700' : 'text-amber-700'}>{f.status || 'Open'}</strong>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateFindingStatus(inspection.id, f.id, isResolved ? 'Open' : 'Resolved');
                        }}
                        className="text-sky-600 hover:underline font-semibold"
                      >
                        {isResolved ? 'Reopen' : 'Mark Resolved'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Corrective Action Directive */}
          {activeFinding && (
            <div className="vg-card p-4 space-y-3">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Mandated Corrective Directive
              </h3>

              <div className="p-3 rounded bg-slate-50 border border-slate-200 text-xs space-y-1">
                <p className="text-slate-800 font-medium">{activeFinding.correctiveAction}</p>
                <div className="flex justify-between text-slate-500 text-[11px] pt-1">
                  <span>Assigned Officer: <strong className="text-slate-700">{activeFinding.assignedTo || 'Marcus Vance'}</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Notes Log */}
          <div className="vg-card p-4 space-y-3">
            <h3 className="text-xs font-semibold text-slate-900">
              Audit Notes & Log Entries
            </h3>

            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {notesList.map((n) => (
                <div key={n.id} className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px]">
                  <div className="flex justify-between text-slate-500">
                    <span className="font-medium text-slate-700">{n.author}</span>
                    <span className="font-mono">{n.date}</span>
                  </div>
                  <p className="text-slate-800 mt-0.5">{n.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Log field audit note..."
                className="flex-1 py-1.5 px-2.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 placeholder-slate-400"
              />
              <button type="submit" className="vg-btn-secondary py-1 text-xs">
                Post Note
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


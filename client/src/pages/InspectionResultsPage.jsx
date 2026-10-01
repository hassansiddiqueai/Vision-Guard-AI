import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import { ImageAnnotationViewer } from '../components/common/ImageAnnotationViewer';
import {
  ArrowLeft,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  User,
  MapPin,
  FileText,
  Plus,
  Send,
  Printer,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Shield,
  Zap,
} from 'lucide-react';

export const InspectionResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getInspection, updateFindingStatus, assignFinding, addNote } = useInspections();

  const inspection = getInspection(id);

  // Local state for modals / inline interactions
  const [activeFindingIdx, setActiveFindingIdx] = useState(0);
  const [newNoteText, setNewNoteText] = useState('');
  const [assigneeInput, setAssigneeInput] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  if (!inspection) {
    return (
      <div className="p-12 text-center space-y-4">
        <h3 className="text-base font-bold text-white">Inspection Record Not Found</h3>
        <p className="text-xs text-slate-400">Unable to locate record {id}.</p>
        <Link
          to="/inspections"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Inspections List</span>
        </Link>
      </div>
    );
  }

  const findings = inspection.findings || [];
  const activeFinding = findings[activeFindingIdx] || findings[0];

  const handleToggleStatus = (findingId, currentStatus) => {
    const nextStatus = currentStatus === 'Resolved' ? 'Open' : 'Resolved';
    updateFindingStatus(inspection.id, findingId, nextStatus);
  };

  const handleAssignSubmit = (findingId) => {
    if (assigneeInput.trim()) {
      assignFinding(inspection.id, findingId, assigneeInput.trim());
      setAssigneeInput('');
      setIsAssigning(false);
    }
  };

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (newNoteText.trim()) {
      addNote(inspection.id, newNoteText.trim(), inspection.inspector || 'Auditor');
      setNewNoteText('');
    }
  };

  const getRiskBadge = (risk) => {
    const r = (risk || 'LOW').toUpperCase();
    if (r === 'CRITICAL') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          CRITICAL RISK
        </span>
      );
    }
    if (r === 'HIGH') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          HIGH RISK
        </span>
      );
    }
    if (r === 'MEDIUM') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-xs font-mono font-semibold">
          MEDIUM RISK
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
        LOW RISK / SAFE
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/inspections')}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition"
            title="Back to List"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-400">{inspection.id}</span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-400 font-mono">{inspection.type}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">{inspection.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <Link
            to={`/reports?inspectionId=${inspection.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Create Audit Report</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Left Image Viewer + Right Summary & Explainable AI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Large Inspection Image & Bounding Overlays */}
        <div className="lg:col-span-6 space-y-4 sticky lg:top-20">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <ImageAnnotationViewer
              imageUrl={inspection.imageUrl}
              alt={inspection.name}
              annotations={findings}
            />

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
              <span className="truncate max-w-[200px]">{inspection.fileName}</span>
              <span className="text-emerald-400">SPATIAL HUD READY</span>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">PROJECT SITE:</span>
              <span className="text-slate-200">{inspection.site}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">LOCATION:</span>
              <span className="text-slate-200">{inspection.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">INSPECTOR:</span>
              <span className="text-slate-200">{inspection.inspector}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">DATE RECORDED:</span>
              <span className="text-slate-200">{new Date(inspection.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Findings, Explainability, & Actions */}
        <div className="lg:col-span-6 space-y-5">
          {/* Executive Risk Card */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">OVERALL RISK RATING</span>
                <div className="mt-1">{getRiskBadge(inspection.riskLevel)}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">AI CONFIDENCE</span>
                <span className="text-xl font-bold font-mono text-sky-400">{inspection.overallConfidence}%</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed">
              {inspection.summary}
            </div>
          </div>

          {/* Detected Findings List */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                Detected Findings & Safety Hazards ({findings.length})
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Click finding to inspect</span>
            </div>

            <div className="space-y-2.5">
              {findings.map((finding, idx) => (
                <div
                  key={finding.id || idx}
                  onClick={() => setActiveFindingIdx(idx)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition ${
                    activeFindingIdx === idx
                      ? 'bg-slate-800/90 border-sky-500/80 shadow-sm'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">{finding.label}</span>
                        <span className="text-[10px] font-mono text-sky-400">[{finding.confidence}%]</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{finding.evidence}</p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        finding.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' :
                        finding.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-sky-500/20 text-sky-400'
                      }`}>
                        {finding.severity}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        finding.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {finding.status || 'Open'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIVE FINDING DEEP-DIVE: Explainable AI & Corrective Action */}
          {activeFinding && (
            <div className="p-5 rounded-xl bg-slate-900 border border-sky-500/30 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-sky-400" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-300">
                    Why Was This Detected? — {activeFinding.label}
                  </h4>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400">VISUAL EVIDENCE: </span>
                    <span className="text-slate-200">{activeFinding.evidence}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">RISK FACTOR: </span>
                    <span className="text-amber-400">{activeFinding.riskFactor}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">MAPPED REFERENCE: </span>
                    <span className="text-sky-400">{activeFinding.complianceRef}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">ASSIGNED TO: </span>
                    <span className="text-slate-200">{activeFinding.assignedTo || 'Unassigned'}</span>
                  </div>
                </div>

                {/* Immediate Corrective Action */}
                <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-amber-400">
                    Immediate Corrective Action Directive
                  </span>
                  <p className="text-xs font-medium leading-relaxed">
                    {activeFinding.correctiveAction}
                  </p>
                </div>

                {/* Action Controls: Mark Resolved, Assign Issue, Add Note */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(activeFinding.id, activeFinding.status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                      activeFinding.status === 'Resolved'
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{activeFinding.status === 'Resolved' ? 'Reopen Issue' : 'Mark Resolved'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAssigning(!isAssigning)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    Assign Issue
                  </button>

                  <Link
                    to={`/reports?inspectionId=${inspection.id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                  >
                    Create Report
                  </Link>
                </div>

                {/* Inline Assignment Input */}
                {isAssigning && (
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={assigneeInput}
                      onChange={(e) => setAssigneeInput(e.target.value)}
                      placeholder="e.g. Marcus Vance (Site Lead)"
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-slate-100 placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAssignSubmit(activeFinding.id)}
                      className="px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes & Audit Timeline */}
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Audit Notes & Log Entries ({inspection.notesList?.length || 0})
            </h4>

            <div className="space-y-2">
              {(inspection.notesList || []).map((note) => (
                <div key={note.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="text-sky-400 font-semibold">{note.author}</span>
                    <span>{note.date}</span>
                  </div>
                  <p className="text-slate-300">{note.text}</p>
                </div>
              ))}
            </div>

            {/* Add Note Input */}
            <form onSubmit={handleAddNoteSubmit} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add inspector field observation note..."
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={!newNoteText.trim()}
                className="px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition disabled:opacity-40"
              >
                Add Note
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

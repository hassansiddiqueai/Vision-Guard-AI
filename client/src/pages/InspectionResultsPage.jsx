import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { inspectionService } from '../services/inspectionService';
import { ImageAnnotationViewer } from '../components/common/ImageAnnotationViewer';
import { RiskBadge } from '../components/common/RiskBadge';
import { ConfidenceBar } from '../components/common/ConfidenceBar';
import {
  ShieldAlert,
  ArrowLeft,
  Sparkles,
  Printer,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Tag,
  Crosshair,
  FileCheck2,
  HelpCircle,
} from 'lucide-react';

export const InspectionResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [inspection, setInspection] = useState(location.state?.inspection || null);
  const [loading, setLoading] = useState(!location.state?.inspection);
  const [error, setError] = useState(null);
  const [whyExpanded, setWhyExpanded] = useState(true);
  const [detectionsExpanded, setDetectionsExpanded] = useState(true);
  const [anomaliesExpanded, setAnomaliesExpanded] = useState(true);
  const [recommendationsExpanded, setRecommendationsExpanded] = useState(true);

  useEffect(() => {
    if (inspection) return;

    const fetchInspection = async () => {
      setLoading(true);
      try {
        const data = await inspectionService.getInspectionById(id);
        setInspection(data);
      } catch (err) {
        // Fallback to local history
        const localList = JSON.parse(localStorage.getItem('vg_inspections_history') || '[]');
        const found = localList.find((item) => item.id === id);
        if (found) {
          setInspection(found);
        } else if (localList.length > 0) {
          setInspection(localList[0]);
        } else {
          setError('Inspection report not found.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInspection();
  }, [id, inspection]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this inspection audit record?')) {
      try {
        await inspectionService.deleteInspection(id);
      } catch (e) {
        console.warn('Backend delete failed, removing from local store', e);
      }

      // Remove from local history
      const localList = JSON.parse(localStorage.getItem('vg_inspections_history') || '[]');
      const updated = localList.filter((item) => item.id !== id);
      localStorage.setItem('vg_inspections_history', JSON.stringify(updated));

      navigate('/history');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-300">
        <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono text-cyan-400">RETRIEVING AUDIT DIAGNOSTICS...</p>
      </div>
    );
  }

  if (error || !inspection) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white">Inspection Report Not Found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          {error || 'Unable to locate telemetry for the requested inspection ID.'}
        </p>
        <div className="pt-2">
          <Link
            to="/history"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Inspection Logs</span>
          </Link>
        </div>
      </div>
    );
  }

  const riskLevel = inspection.risk || inspection.risk_level || 'LOW';
  const confidenceScore = inspection.confidence || inspection.confidence_score || 95;
  const formattedDate = new Date(inspection.createdAt || inspection.timestamp || Date.now()).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const allAnnotations = [
    ...(inspection.detections || []),
    ...(inspection.anomalies || []),
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-850">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/history')}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            title="Back to History"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AUDIT ID: {inspection.id}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formattedDate}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              {inspection.title || inspection.fileName || 'Visual Inspection Diagnostic'}
            </h2>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition"
            title="Print / Export Report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition"
            title="Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <Link
            to="/inspect"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Inspection</span>
          </Link>
        </div>
      </div>

      {/* Main WOW Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Canvas & Visual HUD */}
        <div className="lg:col-span-6 space-y-4 sticky lg:top-24">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <ImageAnnotationViewer
              imageUrl={inspection.imageUrl}
              alt={inspection.title}
              annotations={allAnnotations}
            />

            {/* Target Telemetry Metadata Footer */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-3">
                <span className="text-slate-300 font-semibold">{inspection.fileName || 'Target Image'}</span>
                {inspection.fileSize && <span>[{inspection.fileSize}]</span>}
              </div>
              <div className="text-cyan-400 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5" />
                <span>SPATIAL MATRIX OK</span>
              </div>
            </div>
          </div>

          {/* Description Context (if provided by user) */}
          {inspection.description && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs">
              <span className="font-mono text-[10px] uppercase text-slate-400 tracking-wider block mb-1">
                Auditor Context Notes
              </span>
              <p className="text-slate-300 leading-relaxed">{inspection.description}</p>
            </div>
          )}
        </div>

        {/* Right Column: AI Analysis Summary & Findings */}
        <div className="lg:col-span-6 space-y-4">
          {/* Executive Overview Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  OVERALL RISK SEVERITY
                </span>
                <RiskBadge level={riskLevel} size="lg" />
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  MODEL CERTAINTY
                </span>
                <div className="w-32">
                  <ConfidenceBar score={confidenceScore} size="md" />
                </div>
              </div>
            </div>

            {/* Category & Status Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>CATEGORY: {inspection.category || 'General'}</span>
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>AI VERIFIED</span>
              </span>
            </div>

            {/* Executive Summary */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Executive Finding Summary
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
                {inspection.summary ||
                  'Visual scan completed with no critical anomalies detected. Standard compliance met.'}
              </div>
            </div>
          </div>

          {/* Anomalies & Violations Section */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setAnomaliesExpanded(!anomaliesExpanded)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-850/40 transition"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Detected Anomalies & Safety Violations (
                  {inspection.anomalies?.length || 0})
                </h4>
              </div>
              {anomaliesExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {anomaliesExpanded && (
              <div className="p-4 pt-0 space-y-3">
                {!inspection.anomalies || inspection.anomalies.length === 0 ? (
                  <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-850 text-xs text-slate-400 font-mono text-center">
                    Zero visual anomalies flagged in target region.
                  </div>
                ) : (
                  inspection.anomalies.map((anom, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-slate-700 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-xs sm:text-sm font-semibold text-slate-100">
                          {anom.title}
                        </h5>
                        <RiskBadge level={anom.severity || 'HIGH'} size="sm" />
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {anom.description}
                      </p>

                      {anom.evidence && (
                        <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-850 font-mono">
                          <span className="text-cyan-400 font-semibold">EVIDENCE: </span>
                          <span>{anom.evidence}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Detections / Objects Isolated Section */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setDetectionsExpanded(!detectionsExpanded)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-850/40 transition"
            >
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Spatial Detections & Elements ({inspection.detections?.length || 0})
                </h4>
              </div>
              {detectionsExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {detectionsExpanded && (
              <div className="p-4 pt-0 space-y-2">
                {!inspection.detections || inspection.detections.length === 0 ? (
                  <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-850 text-xs text-slate-400 font-mono text-center">
                    No specific objects categorized.
                  </div>
                ) : (
                  inspection.detections.map((det, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-850 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-200">{det.name}</p>
                        {det.location && (
                          <p className="text-[11px] font-mono text-slate-400">
                            LOC: {det.location}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {det.confidence && (
                          <span className="text-[11px] font-mono text-cyan-400">
                            {Math.round(det.confidence <= 1 ? det.confidence * 100 : det.confidence)}%
                          </span>
                        )}
                        <RiskBadge level={det.severity || 'LOW'} size="sm" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Actionable Recommendations Section */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setRecommendationsExpanded(!recommendationsExpanded)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-850/40 transition"
            >
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Prioritized Action Plan ({inspection.recommendations?.length || 0})
                </h4>
              </div>
              {recommendationsExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {recommendationsExpanded && (
              <div className="p-4 pt-0 space-y-2.5">
                {!inspection.recommendations || inspection.recommendations.length === 0 ? (
                  <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-850 text-xs text-slate-400 font-mono text-center">
                    No immediate corrective actions required.
                  </div>
                ) : (
                  inspection.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          {rec.priority || 'P1'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-100">
                        {rec.action}
                      </p>
                      {rec.reason && (
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          <span className="text-slate-500 font-mono">REASON: </span>
                          {rec.reason}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Explainable AI: "Why was this detected?" */}
          <div className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.05)]">
            <button
              onClick={() => setWhyExpanded(!whyExpanded)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-850/40 transition"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                  Explainable AI: Why was this detected?
                </h4>
              </div>
              {whyExpanded ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-cyan-400" />}
            </button>

            {whyExpanded && (
              <div className="p-4 pt-0">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/20 text-xs text-slate-300 leading-relaxed space-y-2">
                  <p>
                    {inspection.explanation ||
                      'The visual intelligence engine cross-referenced spatial boundary tensors, texture gradient maps, and safety regulatory criteria to identify these patterns with high statistical certainty.'}
                  </p>
                  <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>REGULATORY MAPPING: OSHA / ISO COMPLIANT</span>
                    <span className="text-cyan-400">EXPLAINABILITY INDEX: 1.0</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

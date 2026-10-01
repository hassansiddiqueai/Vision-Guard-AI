import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import {
  Cpu,
  Camera,
  Image as ImageIcon,
  Video,
  Shield,
  MapPin,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  Scan,
} from 'lucide-react';

export const InspectionEnginePage = () => {
  const navigate = useNavigate();
  const { addInspection } = useInspections();

  const [step, setStep] = useState(1);
  const [source, setSource] = useState('Camera');
  const [type, setType] = useState('Construction Safety');
  const [site, setSite] = useState('Apex Tower — Zone B');
  const [location, setLocation] = useState('Sector 4 Platform');
  const [inspector, setInspector] = useState('Lead Safety Auditor');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [completedInspection, setCompletedInspection] = useState(null);

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setStep(5);

    const stages = [
      'Ingesting visual feed from selected source...',
      'Preprocessing optical frame tensor...',
      'Executing multi-class object detection...',
      'Running hazard & PPE compliance classifiers...',
      'Computing spatial risk geometry & confidence...',
      'Synthesizing Explainable AI diagnostics...',
    ];

    stages.forEach((msg, idx) => {
      setTimeout(() => {
        setAnalysisProgress(msg);
      }, idx * 600);
    });

    setTimeout(() => {
      setIsAnalyzing(false);
      const newInsp = {
        id: `INS-${Math.floor(1000 + Math.random() * 9000)}`,
        name: `${type} Diagnostic Audit`,
        site,
        type,
        inspector,
        location,
        createdAt: new Date().toISOString(),
        status: 'Completed',
        riskLevel: 'CRITICAL',
        overallConfidence: 98.4,
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop',
        summary: `Automated inspection pipeline completed for ${site}. Critical hazard detected: structural scaffolding lock pin void flagged on tier 6 upright.`,
        explanation: 'Spatial edge geometry and texture segmentation flagged absence of standard Grade-8 locking pin in structural coupling joint.',
        findings: [
          {
            id: 'F-ENG-1',
            label: 'Missing Scaffolding Lock Pin',
            severity: 'CRITICAL',
            confidence: 98.4,
            box_2d: [180, 420, 520, 780],
            status: 'Open',
            evidence: 'Absence of Grade-8 lock fastener in primary joint hub.',
            riskFactor: 'Catastrophic scaffold collapse under dynamic structural load.',
            complianceRef: 'OSHA 1926.451(a)(1) Scaffold Framework',
            correctiveAction: 'Halt scaffold elevation work and insert certified locking pin immediately.',
            assignedTo: 'Site Safety Supervisor',
          },
          {
            id: 'F-ENG-2',
            label: 'PPE High-Vis Vest Verified',
            severity: 'LOW',
            confidence: 99.1,
            box_2d: [150, 200, 260, 320],
            status: 'Compliant',
            evidence: 'Class 2 fluorescent vest detected.',
            complianceRef: 'OSHA 1926.201 Compliant',
            correctiveAction: 'No action required.',
            assignedTo: null,
          }
        ],
        recommendations: [
          { priority: 'P1 - IMMEDIATE', action: 'Insert certified locking pin before workers access platform.', reason: 'Imminent collapse hazard exceeds minimum structural threshold.' },
          { priority: 'P2 - STANDARD', action: 'Conduct 5-minute pre-shift stand-down on fall arrest procedures.', reason: 'Reinforce 100% tie-off compliance.' }
        ],
        notesList: [
          { id: 1, author: inspector, text: 'Automated inspection initiated via VisionGuard Inspection Engine.', date: new Date().toISOString().replace('T', ' ').slice(0, 16) }
        ]
      };

      addInspection(newInsp);
      setCompletedInspection(newInsp);
      setStep(6);
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 pb-4 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-xs">
          <Cpu className="w-3.5 h-3.5" />
          <span>Automated Vision Diagnostic Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          VisionGuard Inspection Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Execute end-to-end computer vision analysis: configure optical source, classify hazards, and generate regulatory reports.
        </p>
      </div>

      {/* 7-Step Progression Bar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 overflow-x-auto gap-2">
          {[
            { num: 1, label: 'Source' },
            { num: 2, label: 'Scope' },
            { num: 3, label: 'Site' },
            { num: 4, label: 'Confirm' },
            { num: 5, label: 'Inference' },
            { num: 6, label: 'Findings' },
            { num: 7, label: 'Report' },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-1.5 shrink-0 ${
                step === s.num
                  ? 'text-sky-400 font-bold'
                  : step > s.num
                  ? 'text-emerald-400'
                  : 'text-slate-600'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === s.num
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : step > s.num
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-6">
        {/* Step 1: Source */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Step 1: Select Visual Inspection Source
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Camera', label: 'Live Camera / CCTV', icon: Camera, desc: 'Real-time USB camera or RTSP stream' },
                { id: 'Image', label: 'Static High-Res Image', icon: ImageIcon, desc: 'JPG/PNG field photograph upload' },
                { id: 'Video', label: 'Recorded Video File', icon: Video, desc: 'MP4/WebM surveillance clip' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = source === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSource(item.id)}
                    className={`p-4 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-sky-400 ring-1 ring-sky-400/40'
                        : 'bg-slate-950 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-3 ${isSelected ? 'text-sky-400' : 'text-slate-400'}`} />
                    <div>
                      <p className="text-xs font-bold text-slate-200">{item.label}</p>
                      <p className="text-[11px] text-slate-400 mt-1">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition flex items-center gap-2"
              >
                <span>Next: Select Scope</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Type */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Step 2: Select Inspection Type & Scope
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                'Construction Safety',
                'Scaffolding Safety',
                'PPE Compliance',
                'Machinery Safety',
                'Fire & Thermal Safety',
                'Site Security',
              ].map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`p-3.5 rounded-lg border text-left text-xs transition ${
                    type === t
                      ? 'bg-slate-800 border-sky-400 text-white font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition flex items-center gap-2"
              >
                <span>Next: Select Facility Site</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Site */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Step 3: Select Site & Location Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Target Project Site</label>
                <select
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                >
                  <option value="Apex Tower — Zone B">Apex Tower — Zone B</option>
                  <option value="Harbor Gateway Extension">Harbor Gateway Extension</option>
                  <option value="Eastside Medical Center">Eastside Medical Center</option>
                  <option value="Industrial Park Substation 4">Industrial Park Substation 4</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Grid Location / Sector</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-mono mb-1">Lead Safety Inspector</label>
                <input
                  type="text"
                  value={inspector}
                  onChange={(e) => setInspector(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition flex items-center gap-2"
              >
                <span>Next: Review & Start</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm & Start */}
        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Step 4: Confirm Parameters & Start Inspection
            </h3>
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-850 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>INSPECTION SOURCE:</span>
                <span className="text-sky-400 font-bold">{source}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>SCOPE / TYPE:</span>
                <span className="text-slate-200">{type}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>TARGET SITE:</span>
                <span className="text-slate-200">{site}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GRID SECTOR:</span>
                <span className="text-slate-200">{location}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>INSPECTOR:</span>
                <span className="text-slate-200">{inspector}</span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Back
              </button>
              <button
                onClick={handleStartAnalysis}
                className="px-6 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Start AI Inspection</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Inference Loading */}
        {step === 5 && (
          <div className="py-16 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-sky-500/20 border-t-sky-400 rounded-full animate-spin mx-auto" />
            <h3 className="text-base font-bold text-white">Running Vision Diagnostic Pipeline...</h3>
            <p className="text-xs font-mono text-sky-400 animate-pulse">{analysisProgress}</p>
          </div>
        )}

        {/* Step 6: Findings */}
        {step === 6 && completedInspection && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs text-sky-400 font-bold">
                  {completedInspection.id}
                </span>
                <h3 className="text-base font-bold text-white">{completedInspection.name}</h3>
              </div>
              <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-mono font-bold">
                {completedInspection.riskLevel}
              </span>
            </div>

            <div className="space-y-3">
              {completedInspection.findings.map((f, idx) => (
                <div
                  key={f.id}
                  className="p-3.5 rounded-lg bg-slate-950 border border-slate-850 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">
                      #{idx + 1} {f.label}
                    </span>
                    <span className="font-mono text-sky-400 font-bold">{f.confidence}%</span>
                  </div>
                  <p className="text-slate-400">{f.evidence}</p>
                  <p className="text-slate-300 font-medium pt-1 text-[11px]">
                    Action: {f.correctiveAction}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Run Another Scan
              </button>
              <button
                onClick={() => navigate(`/inspections/${completedInspection.id}`)}
                className="px-5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition flex items-center gap-2"
              >
                <span>Open Full Inspection & Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

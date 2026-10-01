import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import {
  Camera,
  Image as ImageIcon,
  Video,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';

export const InspectionEnginePage = () => {
  const navigate = useNavigate();
  const { addInspection, SITES } = useInspections();

  const [step, setStep] = useState(1);
  const [source, setSource] = useState('Camera');
  const [type, setType] = useState('Construction Safety');
  const [site, setSite] = useState('Apex Tower — Zone B');
  const [location, setLocation] = useState('Sector 4 Platform');
  const [inspector, setInspector] = useState('Safety Inspector');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [completedInspection, setCompletedInspection] = useState(null);

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setStep(3);

    const stages = [
      'Ingesting visual feed and calibrated sensor frames...',
      'Preprocessing image frame (CLAHE contrast normalization)...',
      'Running computer vision neural detection & PPE classifier...',
      'Assessing risk matrix and calculating confidence metrics...',
      'Synthesizing OSHA corrective action recommendations...',
    ];

    stages.forEach((msg, idx) => {
      setTimeout(() => {
        setAnalysisProgress(msg);
      }, idx * 500);
    });

    setTimeout(() => {
      setIsAnalyzing(false);
      const newInsp = {
        id: `INS-${Math.floor(1000 + Math.random() * 9000)}`,
        name: `${type} Audit`,
        site,
        type,
        inspector,
        location,
        createdAt: new Date().toISOString(),
        status: 'Completed',
        riskLevel: 'CRITICAL',
        overallConfidence: 98.4,
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop',
        summary: `Automated inspection pipeline completed for ${site}. Optical anomalies and PPE compliance were evaluated under standard industrial thresholds.`,
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
        ],
        recommendations: [
          { priority: 'P1 - IMMEDIATE', action: 'Insert certified locking pin before workers access platform.', reason: 'Imminent collapse hazard exceeds minimum structural threshold.' },
        ],
        notesList: [
          { id: 1, author: inspector, text: 'Inspection processed via automated CV engine.', date: new Date().toISOString().replace('T', ' ').slice(0, 16) }
        ]
      };

      addInspection(newInsp);
      setCompletedInspection(newInsp);
      setStep(4);
    }, 2600);
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Inspection Engine
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Execute automated visual safety audits: select site, ingest visual feeds, classify hazards, and generate compliance reports.
        </p>
      </div>

      {/* 5-Step Stepper */}
      <div className="vg-card p-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          {[
            { num: 1, label: '1. Visual Source' },
            { num: 2, label: '2. Audit Parameters' },
            { num: 3, label: '3. CV Processing' },
            { num: 4, label: '4. Findings Review' },
            { num: 5, label: '5. Formal Report' },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-1.5 ${
                step === s.num
                  ? 'text-sky-700 font-bold border-b-2 border-sky-700 pb-0.5'
                  : step > s.num
                  ? 'text-emerald-700'
                  : 'text-slate-400'
              }`}
            >
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="vg-card p-5 space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Step 1: Select Visual Input Source</h2>
              <p className="text-xs text-slate-500 mt-0.5">Choose camera feed, upload static image frame, or stream recorded video.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Camera', label: 'Live Camera / CCTV', icon: Camera, desc: 'Real-time RTSP/WebRTC stream' },
                { id: 'Image', label: 'Image Frame Upload', icon: ImageIcon, desc: 'High-res site photo JPEG/PNG' },
                { id: 'Video', label: 'Recorded Video File', icon: Video, desc: 'Incident recording MP4/WebM' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = source === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSource(item.id)}
                    className={`p-4 rounded-md border text-left transition ${
                      isSelected
                        ? 'bg-sky-50/50 border-sky-600 ring-1 ring-sky-600'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2.5 ${isSelected ? 'text-sky-700' : 'text-slate-400'}`} />
                    <p className="text-xs font-bold text-slate-900">{item.label}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{item.desc}</p>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button onClick={() => setStep(2)} className="vg-btn-primary">
                <span>Continue to Audit Parameters</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Step 2: Configure Audit Parameters</h2>
              <p className="text-xs text-slate-500 mt-0.5">Specify site metadata, inspection category, and location coordinates.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Inspection Discipline</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 text-xs focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
                >
                  <option value="Construction Safety">Construction Safety & PPE</option>
                  <option value="Scaffolding Safety">Scaffolding & Structural Integrity</option>
                  <option value="PPE Compliance">Full PPE Compliance Audit</option>
                  <option value="Machinery Safety">Heavy Machinery & Perimeter Clearance</option>
                  <option value="Fire & Environmental">Fire Hazard & Egress Obstruction</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Target Facility / Site</label>
                <select
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 text-xs focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
                >
                  <option value="Apex Tower — Zone B">Apex Tower — Zone B</option>
                  <option value="Harbor Gateway Extension">Harbor Gateway Extension</option>
                  <option value="Eastside Logistics Center">Eastside Logistics Center</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Specific Grid / Zone Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 text-xs focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Assigned Inspector</label>
                <input
                  type="text"
                  value={inspector}
                  onChange={(e) => setInspector(e.target.value)}
                  className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 text-xs focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-slate-100">
              <button onClick={() => setStep(1)} className="vg-btn-secondary">
                Back
              </button>
              <button onClick={handleStartAnalysis} className="vg-btn-primary">
                <span>Execute Vision Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-14 text-center space-y-4">
            <div className="w-10 h-10 border-3 border-slate-200 border-t-sky-700 rounded-full animate-spin mx-auto" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Executing Computer Vision Pipeline...</h3>
              <p className="text-xs text-slate-500 font-mono mt-1.5">{analysisProgress}</p>
            </div>
            <div className="w-64 bg-slate-100 h-1.5 rounded-full mx-auto overflow-hidden">
              <div className="bg-sky-600 h-full w-3/4 animate-pulse rounded-full" />
            </div>
          </div>
        )}

        {step === 4 && completedInspection && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Step 4: AI Findings & Hazard Review</h2>
                <p className="text-xs text-slate-500 mt-0.5">Audit ID: {completedInspection.id} • Risk Level: {completedInspection.riskLevel}</p>
              </div>
              <span className="vg-badge-critical">{completedInspection.riskLevel} RISK DETECTED</span>
            </div>

            <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-md flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-red-900">Critical Anomaly Identified</p>
                <p className="text-red-800 mt-0.5">{completedInspection.explanation}</p>
              </div>
            </div>

            <div className="space-y-2">
              {completedInspection.findings.map((f, idx) => (
                <div key={f.id} className="p-3.5 rounded-md bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Finding #{idx + 1}: {f.label}</span>
                    <span className="text-red-700 font-mono font-bold">{f.confidence}% Confidence</span>
                  </div>
                  <p className="text-slate-600"><span className="font-semibold text-slate-700">Evidence:</span> {f.evidence}</p>
                  <p className="text-slate-600"><span className="font-semibold text-slate-700">Standard:</span> {f.complianceRef}</p>
                  <p className="text-slate-900 font-semibold pt-1 border-t border-slate-200"><span className="text-sky-700">Required Action:</span> {f.correctiveAction}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-3 border-t border-slate-100">
              <button onClick={() => setStep(1)} className="vg-btn-secondary">
                Run Another Scan
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/reports')}
                  className="vg-btn-secondary"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Report</span>
                </button>
                <button
                  onClick={() => navigate(`/inspections/${completedInspection.id}`)}
                  className="vg-btn-primary"
                >
                  <span>Open Full Audit View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


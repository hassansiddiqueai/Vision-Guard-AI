import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import {
  Camera,
  Image as ImageIcon,
  Video,
  ArrowRight,
} from 'lucide-react';

export const InspectionEnginePage = () => {
  const navigate = useNavigate();
  const { addInspection } = useInspections();

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
      'Ingesting visual feed...',
      'Preprocessing image frame...',
      'Running computer vision detection...',
      'Assessing risk level and confidence...',
      'Generating recommendations...',
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
        summary: `Automated inspection pipeline completed for ${site}. Optical anomalies and PPE compliance were evaluated.`,
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
            assignedTo: 'Safety Supervisor',
          },
        ],
        recommendations: [
          { priority: 'P1 - IMMEDIATE', action: 'Insert certified locking pin before workers access platform.', reason: 'Imminent collapse hazard exceeds minimum structural threshold.' },
        ],
        notesList: [
          { id: 1, author: inspector, text: 'Inspection processed via automated engine.', date: new Date().toISOString().replace('T', ' ').slice(0, 16) }
        ]
      };

      addInspection(newInsp);
      setCompletedInspection(newInsp);
      setStep(4);
    }, 2800);
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Header */}
      <div className="pb-3 border-b border-[#243247]">
        <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#F1F5F9] tracking-tight">
          Inspection Engine
        </h1>
        <p className="text-[13px] text-[#94A3B8] mt-0.5">
          Execute automated visual safety inspections step by step.
        </p>
      </div>

      {/* 5-Step Stepper */}
      <div className="vg-card p-3">
        <div className="flex items-center justify-between text-[12px] font-medium text-[#94A3B8]">
          {[
            { num: 1, label: '1. Source' },
            { num: 2, label: '2. Inspection' },
            { num: 3, label: '3. Analysis' },
            { num: 4, label: '4. Findings' },
            { num: 5, label: '5. Report' },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-1.5 ${
                step === s.num
                  ? 'text-[#22C7E8] font-semibold'
                  : step > s.num
                  ? 'text-[#22C55E]'
                  : 'text-[#64748B]'
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
            <h2 className="text-[15px] font-semibold text-[#F1F5F9]">Step 1: Select Visual Source</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'Camera', label: 'Live Camera / CCTV', icon: Camera, desc: 'Real-time camera feed' },
                { id: 'Image', label: 'Image Upload', icon: ImageIcon, desc: 'High-res site photo' },
                { id: 'Video', label: 'Video File', icon: Video, desc: 'Recorded MP4/WebM clip' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = source === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSource(item.id)}
                    className={`p-3.5 rounded border text-left transition ${
                      isSelected
                        ? 'bg-[#1E293B] border-[#22C7E8]'
                        : 'bg-[#0B1220] border-[#243247] hover:border-[#384F70]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#22C7E8]' : 'text-[#64748B]'}`} />
                    <p className="text-[13px] font-semibold text-[#F1F5F9]">{item.label}</p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">{item.desc}</p>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setStep(2)} className="vg-btn-primary">
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-[15px] font-semibold text-[#F1F5F9]">Step 2: Configure Inspection Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
              <div>
                <label className="block text-[#94A3B8] mb-1">Inspection Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full py-1.5 px-2.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9]"
                >
                  <option value="Construction Safety">Construction Safety</option>
                  <option value="Scaffolding Safety">Scaffolding Safety</option>
                  <option value="PPE Compliance">PPE Compliance</option>
                  <option value="Machinery Safety">Machinery Safety</option>
                </select>
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1">Target Site</label>
                <select
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  className="w-full py-1.5 px-2.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9]"
                >
                  <option value="Apex Tower — Zone B">Apex Tower — Zone B</option>
                  <option value="Harbor Gateway Extension">Harbor Gateway Extension</option>
                  <option value="Eastside Medical Center">Eastside Medical Center</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[#94A3B8] mb-1">Grid Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full py-1.5 px-2.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9]"
                />
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(1)} className="vg-btn-ghost">
                Back
              </button>
              <button onClick={handleStartAnalysis} className="vg-btn-primary">
                <span>Start AI Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#243247] border-t-[#22C7E8] rounded-full animate-spin mx-auto" />
            <h3 className="text-[15px] font-semibold text-[#F1F5F9]">Processing Inspection...</h3>
            <p className="text-[13px] text-[#94A3B8] font-mono">{analysisProgress}</p>
          </div>
        )}

        {step === 4 && completedInspection && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#243247]">
              <h2 className="text-[15px] font-semibold text-[#F1F5F9]">Step 4: Findings Summary</h2>
              <span className="vg-badge-critical">{completedInspection.riskLevel}</span>
            </div>

            <div className="space-y-2">
              {completedInspection.findings.map((f, idx) => (
                <div key={f.id} className="p-3 rounded bg-[#0B1220] border border-[#243247] text-[12px] space-y-1">
                  <div className="flex justify-between font-semibold text-[#F1F5F9]">
                    <span>#{idx + 1} {f.label}</span>
                    <span className="text-[#EF4444] font-mono">{f.confidence}%</span>
                  </div>
                  <p className="text-[#94A3B8]">{f.evidence}</p>
                  <p className="text-[#F1F5F9] pt-1">Action: {f.correctiveAction}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(1)} className="vg-btn-ghost">
                Run Another Scan
              </button>
              <button
                onClick={() => navigate(`/inspections/${completedInspection.id}`)}
                className="vg-btn-primary"
              >
                <span>View Full Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

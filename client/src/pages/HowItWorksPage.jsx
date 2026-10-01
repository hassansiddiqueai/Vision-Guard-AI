import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Cpu,
  Scan,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  Play,
  Layers,
} from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Visual Ingestion & Capture',
    icon: Camera,
    shortDesc: 'Camera, image, or video stream enters VisionGuard.',
    details: 'Supports RTSP CCTV streams, USB cameras, drone footage, and high-resolution mobile photos from the field. Real-time pre-processing standardizes color space and dynamic contrast.',
  },
  {
    step: '02',
    title: 'Computer Vision Analysis',
    icon: Cpu,
    shortDesc: 'Neural networks execute multi-class spatial inference.',
    details: 'Custom edge vision models identify human poses, geometric framework connections, heavy machinery clearances, and PPE contours in under 50 milliseconds.',
  },
  {
    step: '03',
    title: 'Hazard & Defect Detection',
    icon: Scan,
    shortDesc: 'Objects, PPE gaps, and physical hazards are classified.',
    details: 'Pinpoints missing hard hats, detached lanyards, unshielded rotating gears, structural joint voids, and unauthorized perimeter crossing with high precision.',
  },
  {
    step: '04',
    title: 'Multi-Factor Risk Scoring',
    icon: AlertTriangle,
    shortDesc: 'Risk engine calculates severity and confidence rating.',
    details: 'Deterministically categorizes incidents as CRITICAL, HIGH, MEDIUM, or LOW based on kinetic proximity, fall heights, and workplace safety baselines.',
  },
  {
    step: '05',
    title: 'Explainable AI & Diagnostics',
    icon: FileCheck,
    shortDesc: 'Synthesizes transparent visual evidence and compliance references.',
    details: 'Maps detections directly to OSHA 1926/1910 and ISO 45001 safety clauses so auditors understand the precise justification behind each alert.',
  },
  {
    step: '06',
    title: 'Action & Incident Remediation',
    icon: CheckCircle2,
    shortDesc: 'Safety teams acknowledge, assign, and resolve issues.',
    details: 'Generates automated incident tickets, notifies supervisors, tracks mean-time-to-resolution (MTTR), and exports verifiable audit reports.',
  },
];

export const HowItWorksPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 pb-6 border-b border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-xs">
          <Layers className="w-3.5 h-3.5" />
          <span>Industrial Vision Pipeline</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          How VisionGuard AI Operates
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          From live optical feed ingestion to explainable hazard classification and regulatory audit export in seconds.
        </p>
      </div>

      {/* 6 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          const isActive = activeStep === idx;

          return (
            <button
              key={s.step}
              onClick={() => setActiveStep(idx)}
              className={`p-5 rounded-2xl border text-left transition relative overflow-hidden flex flex-col justify-between space-y-3 ${
                isActive
                  ? 'bg-slate-900 border-sky-400 ring-1 ring-sky-400/40'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-mono text-xs font-bold text-slate-500">{s.step}</span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white mb-1">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.shortDesc}</p>
              </div>

              {isActive && (
                <div className="pt-2 border-t border-slate-800 text-[11px] text-sky-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg">
                  {s.details}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* CTA Footer */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Experience the Live Inspection Pipeline</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Connect your camera or test our deterministic computer vision scenarios now.
          </p>
        </div>

        <Link
          to="/live-monitoring"
          className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-sky-500/20"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>Launch Live Inspection</span>
        </Link>
      </div>
    </div>
  );
};

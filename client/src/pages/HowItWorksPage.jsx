import React from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Cpu,
  Scan,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Capture',
    icon: Camera,
    desc: 'Camera, image, or video enters VisionGuard from CCTV feeds, field photos, or mobile devices.',
  },
  {
    step: '02',
    title: 'Analyze',
    icon: Cpu,
    desc: 'Computer vision models process the visual scene to identify personnel, machinery, and structures.',
  },
  {
    step: '03',
    title: 'Detect',
    icon: Scan,
    desc: 'Objects, missing PPE, structural anomalies, and perimeter violations are classified.',
  },
  {
    step: '04',
    title: 'Assess',
    icon: AlertTriangle,
    desc: 'Risk engine calculates severity, confidence score, and hazard priority level.',
  },
  {
    step: '05',
    title: 'Explain',
    icon: FileCheck,
    desc: 'System generates an explanation with visual evidence and mapped safety standards.',
  },
  {
    step: '06',
    title: 'Act',
    icon: CheckCircle2,
    desc: 'Safety supervisors acknowledge alerts, assign corrective actions, and track resolution.',
  },
];

export const HowItWorksPage = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 pb-4 border-b border-[#243247]">
        <h1 className="text-[24px] sm:text-[28px] font-semibold text-[#F1F5F9] tracking-tight">
          How VisionGuard Works
        </h1>
        <p className="text-[14px] text-[#94A3B8] max-w-lg mx-auto">
          A closed-loop safety intelligence pipeline from visual capture to resolution.
        </p>
      </div>

      {/* 6 Clean Numbered Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.step} className="vg-card p-4 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded bg-[#1E293B] border border-[#243247] flex items-center justify-center text-[#22C7E8] shrink-0 font-mono text-[12px] font-bold">
                {s.step}
              </div>
              <div className="space-y-1">
                <h2 className="text-[15px] font-semibold text-[#F1F5F9] flex items-center gap-2">
                  <span>{s.title}</span>
                </h2>
                <p className="text-[13px] text-[#94A3B8] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="vg-card p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px]">
        <div>
          <span className="font-semibold text-[#F1F5F9] block">Ready to inspect site imagery?</span>
          <span className="text-[#94A3B8]">Launch live camera monitoring or upload an inspection photo.</span>
        </div>

        <Link to="/live-monitoring" className="vg-btn-primary">
          <span>Launch Live Inspection</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

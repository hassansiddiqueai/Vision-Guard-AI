import React, { useState } from 'react';
import {
  Eye,
  ShieldCheck,
  AlertTriangle,
  UserX,
  Lock,
  Truck,
  Flame,
  Camera,
  Scale,
  FileText,
  Activity,
  Cctv,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CAPABILITIES = [
  {
    id: 'real-time-detection',
    title: 'Real-Time Edge Detection',
    icon: Eye,
    desc: 'Low-latency spatial object bounding and human presence detection.',
    details: 'Processes optical frames through computer vision models to identify personnel, equipment, and structural boundaries.',
  },
  {
    id: 'ppe-compliance',
    title: 'PPE Compliance Verification',
    icon: ShieldCheck,
    desc: 'Automated verification of hard hats, high-vis vests, and safety gear.',
    details: 'Classifies presence and adherence of ANSI Z89.1 hard hats, reflective vests, and fall protection harnesses.',
  },
  {
    id: 'hazard-detection',
    title: 'Physical Hazard Classification',
    icon: AlertTriangle,
    desc: 'Detects structural defects, missing guardrails, and uncapped rebar.',
    details: 'Identifies displaced locking pins, unprotected openings, and walking corridor obstructions.',
  },
  {
    id: 'fall-detection',
    title: 'Fall & Collapse Detection',
    icon: UserX,
    desc: 'Rapid descent motion vectoring and worker immobility monitoring.',
    details: 'Flags sudden elevation drops and motionless worker states to trigger emergency response.',
  },
  {
    id: 'restricted-zone',
    title: 'Restricted Zone Monitoring',
    icon: Lock,
    desc: 'Virtual tripwire barriers around high-voltage and crane swing radii.',
    details: 'Evaluates perimeter boundaries to alert operators when personnel enter exclusion zones.',
  },
  {
    id: 'machine-safety',
    title: 'Machinery & Vehicle Safety',
    icon: Truck,
    desc: 'Worker-to-machine proximity monitoring and blind-spot alerts.',
    details: 'Calculates separation distance between forklifts or heavy machinery and nearby ground personnel.',
  },
  {
    id: 'fire-smoke',
    title: 'Fire & Smoke Detection',
    icon: Flame,
    desc: 'Early visual plume diffusion and smolder identification.',
    details: 'Monitors early smoke plumes in electrical cabinets and industrial utility rooms.',
  },
  {
    id: 'evidence-capture',
    title: 'Evidence Capture',
    icon: Camera,
    desc: 'Automatic high-resolution snapshot archival for critical safety incidents.',
    details: 'Stores timestamped visual evidence frames with camera ID and severity tags.',
  },
  {
    id: 'risk-scoring',
    title: 'Risk Scoring Engine',
    icon: Scale,
    desc: 'Multi-factor composite scoring engine rating overall site safety 0–100.',
    details: 'Aggregates violation frequency, resolution speed, and open hazard priority into an actionable score.',
  },
  {
    id: 'incident-mgmt',
    title: 'Incident Management',
    icon: Activity,
    desc: 'End-to-end incident dispatching, assignment, and corrective verification.',
    details: 'Converts optical alerts into actionable supervisor tickets with due dates and resolution sign-offs.',
  },
  {
    id: 'compliance-reports',
    title: 'Compliance Reports',
    icon: FileText,
    desc: 'Automated OSHA 1926/1910 and ISO 45001 audit report generation.',
    details: 'Compiles photographic evidence, executive summaries, and regulatory requirements into exportable reports.',
  },
  {
    id: 'live-monitoring',
    title: 'Live CCTV Monitoring',
    icon: Cctv,
    desc: 'Centralized camera wall with multi-feed hazard telemetry.',
    details: 'Streams active CCTV feeds and displays real-time risk scores across facility work zones.',
  },
];

export const CapabilitiesPage = () => {
  const [selectedCap, setSelectedCap] = useState(null);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 pb-4 border-b border-[#243247]">
        <h1 className="text-[24px] sm:text-[28px] font-semibold text-[#F1F5F9] tracking-tight">
          System Capabilities
        </h1>
        <p className="text-[14px] text-[#94A3B8] max-w-lg mx-auto">
          Overview of computer vision, hazard detection, and compliance tools.
        </p>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {CAPABILITIES.map((cap) => {
          const Icon = cap.icon;
          return (
            <div
              key={cap.id}
              onClick={() => setSelectedCap(cap)}
              className="vg-card p-4 space-y-2 cursor-pointer hover:border-[#384F70] transition"
            >
              <div className="w-8 h-8 rounded bg-[#1E293B] border border-[#243247] flex items-center justify-center text-[#22C7E8]">
                <Icon className="w-4 h-4" />
              </div>
              <h2 className="text-[14px] font-semibold text-[#F1F5F9]">{cap.title}</h2>
              <p className="text-[12px] text-[#94A3B8] leading-relaxed">{cap.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedCap && (
        <div className="fixed inset-0 bg-[#0B1220]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md vg-card p-5 space-y-3">
            <div className="flex items-start justify-between pb-2 border-b border-[#243247]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-[#1E293B] border border-[#243247] flex items-center justify-center text-[#22C7E8]">
                  <selectedCap.icon className="w-4 h-4" />
                </div>
                <h3 className="text-[15px] font-semibold text-[#F1F5F9]">{selectedCap.title}</h3>
              </div>
              <button onClick={() => setSelectedCap(null)} className="text-[#64748B] hover:text-[#F1F5F9]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[13px] text-[#F1F5F9]">{selectedCap.desc}</p>
            <p className="text-[12px] text-[#94A3B8] leading-relaxed p-3 rounded bg-[#0B1220] border border-[#243247]">
              {selectedCap.details}
            </p>

            <div className="flex justify-between items-center pt-2 border-t border-[#243247]">
              <Link to="/live-monitoring" className="vg-btn-primary py-1.5 px-3 text-[12px]">
                Open Live Monitoring
              </Link>
              <button onClick={() => setSelectedCap(null)} className="vg-btn-ghost text-[12px]">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

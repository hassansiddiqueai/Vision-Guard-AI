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
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CAPABILITIES = [
  {
    id: 'real-time-detection',
    title: 'Real-Time Edge Detection',
    icon: Eye,
    category: 'Core Vision',
    desc: 'Low-latency spatial object bounding and human pose estimation at 30+ FPS.',
    whatItDetects: 'Human presence, equipment boundaries, hazardous proximity corridors, and scaffolding joints.',
    howItWorks: 'Processes optical frames through optimized tensor models running locally on edge or cloud inferencing nodes.',
    output: 'Pixel-level bounding boxes, class labels, and confidence probability distributions.',
    example: 'Identifies worker entering high-risk excavation trench within 42 milliseconds.',
  },
  {
    id: 'ppe-compliance',
    title: 'PPE Compliance Verification',
    icon: ShieldCheck,
    category: 'Worker Safety',
    desc: 'Automated verification of hard hats, high-vis vests, goggles, and safety harnesses.',
    whatItDetects: 'Missing ANSI hard hats, unfastened chin straps, absent reflective vests, and unhooked lanyards.',
    howItWorks: 'Multi-stage hierarchical classifier isolating head, torso, and limb regions of detected personnel.',
    output: 'Pass/Fail compliance flags per worker with color-coded bounding overlays.',
    example: 'Flags subcontractor entering Sector B without required high-visibility vest.',
  },
  {
    id: 'hazard-detection',
    title: 'Physical Hazard Classification',
    icon: AlertTriangle,
    category: 'Site Safety',
    desc: 'Detects structural defects, missing guardrails, uncapped rebar, and loose debris.',
    whatItDetects: 'Displaced locking pins, missing toe-boards, open floor penetrations, and obstructed walkways.',
    howItWorks: 'Geometric anomaly analysis comparing visual features against CAD or standard scaffolding archetypes.',
    output: 'Hazard severity rating, evidence snippet, and recommended immediate corrective action.',
    example: 'Identifies missing diagonal brace locking pin on tier 6 scaffolding platform.',
  },
  {
    id: 'fall-detection',
    title: 'Fall & Collapse Detection',
    icon: UserX,
    category: 'Emergency',
    desc: 'Rapid descent motion vectoring and horizontal immobility monitoring.',
    whatItDetects: 'Sudden worker slip/trip/fall events and post-fall motionless states.',
    howItWorks: 'Optical flow temporal analysis tracking skeletal keypoint velocities and aspect ratio changes.',
    output: 'Critical priority alarm chime with precise grid coordinates and live snapshot.',
    example: 'Triggers emergency response alert when worker remains prone on floor plane for >8 seconds.',
  },
  {
    id: 'restricted-zone',
    title: 'Restricted Zone Perimeter',
    icon: Lock,
    category: 'Security',
    desc: 'Virtual tripwire barriers around high-voltage equipment and crane radii.',
    whatItDetects: 'Personnel crossing digital exclusion zones and entering machine swing envelopes.',
    howItWorks: 'Polygon perimeter geometric intersection algorithm evaluated on every frame.',
    output: 'Audible boundary alarm and automatic equipment pause signal trigger.',
    example: 'Alerts crane operator when pedestrian enters the 50-ton boom swing perimeter.',
  },
  {
    id: 'machine-safety',
    title: 'Machinery & Vehicle Safety',
    icon: Truck,
    category: 'Heavy Equipment',
    desc: 'Dynamic worker-to-machine separation zone monitoring and blind-spot detection.',
    whatItDetects: 'Pedestrians within 3 meters of moving forklifts, excavators, and loaders.',
    howItWorks: 'Spatial depth estimation calculating metric distance between vehicle chassis and worker bounding boxes.',
    output: 'Proximity warning with audio beacon notification and speed limitation recommendation.',
    example: 'Warns forklift driver of ground crew standing in rear blind zone during reversing maneuver.',
  },
  {
    id: 'fire-smoke',
    title: 'Fire & Thermal Anomaly Detection',
    icon: Flame,
    category: 'Environmental',
    desc: 'Early visual plume diffusion and smolder identification.',
    whatItDetects: 'Smoke plumes, open flame signatures, and rapid volumetric particulate expansion.',
    howItWorks: 'Dynamic texture turbulence analysis combined with color spectrum anomaly filtering.',
    output: 'Early fire warning alert before traditional aspirating smoke detectors trigger.',
    example: 'Detects electrical cabinet smolder in substation 2 minutes prior to thermal detector alarm.',
  },
  {
    id: 'evidence-capture',
    title: 'Forensic Evidence Capture',
    icon: Camera,
    category: 'Audit Vault',
    desc: 'Automatic high-resolution snapshot archival for critical safety incidents.',
    whatItDetects: 'Any event exceeding High or Critical risk thresholds.',
    howItWorks: 'Captures full-resolution raw frame, burns in metadata watermarks, and stores securely.',
    output: 'Verifiable visual evidence frame with camera ID, timestamp, and confidence metadata.',
    example: 'Archives high-res evidence frame of uncapped rebar dowels before concrete pour.',
  },
  {
    id: 'risk-scoring',
    title: 'Deterministic Risk Scoring',
    icon: Scale,
    category: 'Intelligence',
    desc: 'Multi-factor composite scoring engine rating overall site safety 0–100.',
    whatItDetects: 'Aggregated frequency of violations, resolution rates, and open hazard severity.',
    howItWorks: 'Weighted multi-attribute decision matrix normalized against facility workforce size.',
    output: 'Dynamic 0-100 Site Safety Score and trend analysis metrics.',
    example: 'Calculates Apex Tower Site Safety Score at 86/100 based on open scaffolding finding.',
  },
  {
    id: 'incident-mgmt',
    title: 'Incident Lifecycle Management',
    icon: Activity,
    category: 'Operations',
    desc: 'End-to-end incident dispatching, assignment, and corrective verification.',
    whatItDetects: 'Active hazard alerts requiring human safety team remediation.',
    howItWorks: 'Workflow ticketing engine with role-based assignment, status transitions, and SLAs.',
    output: 'Interactive incident record with assignee, due date, and sign-off status.',
    example: 'Assigns scaffolding lockout action to Site Safety Lead with 2-hour completion SLA.',
  },
  {
    id: 'compliance-reports',
    title: 'Regulatory Compliance Reports',
    icon: FileText,
    category: 'Governance',
    desc: 'Automated OSHA 1926/1910 and ISO 45001 audit report generation.',
    whatItDetects: 'Complete historical inspection telemetry and remediation logs.',
    howItWorks: 'Synthesizes executive summary, photographic evidence, and mapped compliance rules.',
    output: 'Printable and downloadable PDF/JSON audit dossier with digital system signature.',
    example: 'Generates comprehensive scaffolding audit sheet for OSHA compliance officer review.',
  },
  {
    id: 'live-monitoring',
    title: 'Multi-Camera Surveillance',
    icon: Cctv,
    category: 'Control Center',
    desc: 'Centralized live CCTV camera wall with multi-feed hazard telemetry.',
    whatItDetects: 'Concurrent visual feeds across multiple site sectors and facility levels.',
    howItWorks: 'Parallel video decoding and inference stream multiplexer.',
    output: 'Live multi-camera grid with per-camera risk badges and instant full-screen switcher.',
    example: 'Monitors 4 active construction zones concurrently in single unified control room.',
  },
];

export const CapabilitiesPage = () => {
  const [selectedCap, setSelectedCap] = useState(null);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
          VisionGuard System Capabilities
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
          Comprehensive suite of industrial computer vision, edge inferencing, risk scoring, and compliance verification modules.
        </p>
      </div>

      {/* Grid of 12 Capabilities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CAPABILITIES.map((cap) => {
          const Icon = cap.icon;
          return (
            <div
              key={cap.id}
              onClick={() => setSelectedCap(cap)}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-sky-400/50 hover:bg-slate-900 transition cursor-pointer flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 uppercase">{cap.category}</span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-sky-400 transition mb-1">
                  {cap.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{cap.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs text-sky-400 font-medium">
                <span>View Specifications</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Detail View */}
      {selectedCap && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <selectedCap.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{selectedCap.category}</span>
                  <h3 className="text-base font-bold text-white">{selectedCap.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedCap(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-850">
              {selectedCap.desc}
            </p>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="font-mono text-[10px] uppercase text-sky-400 block font-bold">What It Detects:</span>
                <p className="text-slate-200 mt-0.5">{selectedCap.whatItDetects}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-sky-400 block font-bold">How It Works:</span>
                <p className="text-slate-200 mt-0.5">{selectedCap.howItWorks}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-sky-400 block font-bold">Telemetry Output:</span>
                <p className="text-slate-200 mt-0.5 font-mono text-[11px] text-slate-300">{selectedCap.output}</p>
              </div>

              <div>
                <span className="font-mono text-[10px] uppercase text-emerald-400 block font-bold">Operational Example:</span>
                <p className="text-slate-200 mt-0.5 italic">{selectedCap.example}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800">
              <Link
                to="/live-monitoring"
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition"
              >
                Test In Live Monitoring
              </Link>
              <button
                onClick={() => setSelectedCap(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

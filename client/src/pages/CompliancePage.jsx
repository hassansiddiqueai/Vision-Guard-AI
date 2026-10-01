import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import {
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Award,
  BookOpen,
} from 'lucide-react';

const STANDARDS = [
  {
    code: 'OSHA 1926.451(a)(1)',
    title: 'Scaffolding Structural Capacity & Fasteners',
    category: 'Scaffolding Safety',
    description: 'Scaffolds and components shall be capable of supporting without failure its own weight and at least 4 times the maximum intended load. All diagonal locking pins and cross braces must be pinned securely.',
    mappedDetections: 'Missing diagonal lock pins, displaced baseplates, buckled uprights.',
    riskLevel: 'CRITICAL',
    status: 'NON-COMPLIANT',
    activeIssueCount: 1,
    activeInspectionId: 'INS-0241',
  },
  {
    code: 'OSHA 1926.501',
    title: 'Duty to Have Fall Protection (6-Foot Rule)',
    category: 'Fall Arrest',
    description: 'Each employee on a walking/working surface with an unprotected side or edge 6 feet or more above a lower level shall be protected by guardrail systems, safety net systems, or personal fall arrest.',
    mappedDetections: 'Unlatched harnesses, perimeter access without static lines, missing midrails.',
    riskLevel: 'HIGH',
    status: 'REVIEW REQUIRED',
    activeIssueCount: 1,
    activeInspectionId: 'INS-0241',
  },
  {
    code: 'OSHA 1910.212(a)(1)',
    title: 'General Machine Guarding & Rotating Parts',
    category: 'Machinery',
    description: 'One or more methods of machine guarding shall be provided to protect the operator and other employees in the machine area from hazards such as rotating parts, nip points, and flying chips.',
    mappedDetections: 'Unguarded belt pulleys, missing chain covers, exposed PTO shafts.',
    riskLevel: 'HIGH',
    status: 'NON-COMPLIANT',
    activeIssueCount: 1,
    activeInspectionId: 'INS-0240',
  },
  {
    code: 'OSHA 1926.701(b)',
    title: 'Protruding Rebar Dowel Protection',
    category: 'Concrete Construction',
    description: 'All protruding reinforcing steel, onto and into which employees could fall, shall be guarded with steel-reinforced mushroom safety caps to eliminate the hazard of impalement.',
    mappedDetections: 'Uncapped vertical steel rebars, missing square troughs.',
    riskLevel: 'CRITICAL',
    status: 'COMPLIANT',
    activeIssueCount: 0,
    activeInspectionId: 'INS-0239',
  },
  {
    code: 'NFPA 70E / OSHA 1910.303(g)',
    title: 'Electrical Equipment Working Space Clearance',
    category: 'Electrical & Infrastructure',
    description: 'Sufficient access and working space (minimum 36-inch depth) shall be provided and maintained about all electric equipment to permit ready and safe operation and maintenance.',
    mappedDetections: 'Pallets or inventory stored within 36-inch boundary arc of switchgear.',
    riskLevel: 'MEDIUM',
    status: 'COMPLIANT',
    activeIssueCount: 0,
    activeInspectionId: 'INS-0238',
  },
  {
    code: 'OSHA 1926.100',
    title: 'Head Protection & Hard Hat Compliance',
    category: 'PPE Baseline',
    description: 'Employees working in areas where there is a possible danger of head injury from impact, or from falling or flying objects, shall be protected by protective helmets.',
    mappedDetections: 'Optical headwear classification, high-visibility vest color detection.',
    riskLevel: 'LOW',
    status: 'COMPLIANT',
    activeIssueCount: 0,
    activeInspectionId: 'INS-0241',
  },
];

export const CompliancePage = () => {
  const { getStats } = useInspections();
  const stats = getStats();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filtered = STANDARDS.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      s.code.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.mappedDetections.toLowerCase().includes(q);

    const matchCat = selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            <Scale className="w-3.5 h-3.5 text-sky-400" />
            <span>Regulatory Standards & Benchmarks</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Safety Compliance & Standard Mapping
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Automated alignment of computer vision defect detections against OSHA 1926/1910, ISO 45001, and NFPA standards.
          </p>
        </div>

        {/* Global Compliance Score Card */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Compliance Rate</span>
            <span className="text-lg font-bold font-mono text-white">{stats.complianceRate}</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search standards by OSHA code, title, or mapped hazard..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-slate-200 placeholder-slate-400 transition"
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2 px-2.5 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-slate-300 font-mono"
          >
            <option value="ALL">All Safety Standards</option>
            <option value="Scaffolding Safety">Scaffolding Safety</option>
            <option value="Fall Arrest">Fall Protection</option>
            <option value="Machinery">Machinery & Guarding</option>
            <option value="Concrete Construction">Concrete Construction</option>
            <option value="Electrical & Infrastructure">Electrical Clearance</option>
            <option value="PPE Baseline">PPE Compliance</option>
          </select>
        </div>
      </div>

      {/* Standards Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((std) => (
          <div
            key={std.code}
            className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                    {std.code}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono ml-2">
                    {std.category}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    std.status === 'COMPLIANT'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : std.status === 'REVIEW REQUIRED'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {std.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-200">{std.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{std.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="p-2 rounded bg-slate-950 border border-slate-850">
                <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                  Visual AI Detection Mapping:
                </span>
                <p className="text-slate-300 font-mono text-[11px]">{std.mappedDetections}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                  <span>Active Violations:</span>
                  <span className={std.activeIssueCount > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {std.activeIssueCount}
                  </span>
                </div>

                {std.activeInspectionId && (
                  <Link
                    to={`/inspections/${std.activeInspectionId}`}
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium text-xs transition"
                  >
                    <span>View Inspection ({std.activeInspectionId})</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

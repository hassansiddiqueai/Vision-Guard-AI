import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import {
  Search,
  ExternalLink,
  Award,
} from 'lucide-react';

const STANDARDS = [
  {
    code: 'OSHA 1926.451(a)(1)',
    title: 'Scaffolding Structural Capacity & Fasteners',
    category: 'Scaffolding Safety',
    description: 'Scaffolds shall support without failure its own weight and at least 4 times maximum intended load. All diagonal locking pins and cross braces must be secured.',
    riskLevel: 'CRITICAL',
    status: 'NON-COMPLIANT',
    activeIssueCount: 1,
    activeInspectionId: 'INS-0241',
  },
  {
    code: 'OSHA 1926.501',
    title: 'Duty to Have Fall Protection (6-Foot Rule)',
    category: 'Fall Protection',
    description: 'Employees on a walking/working surface with an unprotected side 6 feet or more above lower levels shall be protected by guardrail systems or personal fall arrest.',
    riskLevel: 'HIGH',
    status: 'REVIEW REQUIRED',
    activeIssueCount: 1,
    activeInspectionId: 'INS-0241',
  },
  {
    code: 'OSHA 1910.212(a)(1)',
    title: 'Machine Guarding & Rotating Components',
    category: 'Machinery',
    description: 'One or more methods of machine guarding shall be provided to protect the operator and other employees from hazards such as rotating parts and nip points.',
    riskLevel: 'HIGH',
    status: 'NON-COMPLIANT',
    activeIssueCount: 1,
    activeInspectionId: 'INS-0240',
  },
  {
    code: 'OSHA 1926.701(b)',
    title: 'Protruding Rebar Dowel Protection',
    category: 'Concrete Construction',
    description: 'All protruding reinforcing steel onto and into which employees could fall shall be guarded with steel-reinforced mushroom safety caps to eliminate impalement hazard.',
    riskLevel: 'CRITICAL',
    status: 'COMPLIANT',
    activeIssueCount: 0,
    activeInspectionId: 'INS-0239',
  },
  {
    code: 'NFPA 70E / OSHA 1910.303(g)',
    title: 'Electrical Equipment Working Space Clearance',
    category: 'Electrical & Infrastructure',
    description: 'Sufficient access and working space (minimum 36-inch depth) shall be maintained about all electric equipment to permit safe operation.',
    riskLevel: 'MEDIUM',
    status: 'COMPLIANT',
    activeIssueCount: 0,
    activeInspectionId: 'INS-0238',
  },
  {
    code: 'OSHA 1926.100',
    title: 'Head Protection & Hard Hat Compliance',
    category: 'PPE Baseline',
    description: 'Employees working in areas where there is a possible danger of head injury from impact or falling objects shall be protected by protective helmets.',
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

  const filtered = STANDARDS.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      s.code.toLowerCase().includes(q) ||
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#243247]">
        <div>
          <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#F1F5F9] tracking-tight">
            Compliance & Standards
          </h1>
          <p className="text-[13px] text-[#94A3B8] mt-0.5">
            Automated alignment against OSHA 1926/1910 and ISO 45001 safety regulations.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#111C2E] border border-[#243247] text-[13px]">
          <span className="text-[#94A3B8]">Overall Compliance Rate:</span>
          <strong className="text-[#22C55E] font-mono">{stats.complianceRate}</strong>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#64748B]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by OSHA code, title, or regulation..."
          className="w-full pl-8 pr-3 py-1.5 bg-[#111C2E] border border-[#243247] rounded text-[13px] text-[#F1F5F9] placeholder-[#64748B] focus:outline-none focus:border-[#22C7E8]"
        />
      </div>

      {/* Standards Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((std) => (
          <div key={std.code} className="vg-card p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="font-mono text-[11px] font-semibold text-[#22C7E8] bg-[#0B1220] px-2 py-0.5 rounded border border-[#243247]">
                  {std.code}
                </span>

                <span
                  className={`text-[11px] font-medium ${
                    std.status === 'COMPLIANT'
                      ? 'text-[#22C55E]'
                      : std.status === 'REVIEW REQUIRED'
                      ? 'text-[#F59E0B]'
                      : 'text-[#EF4444]'
                  }`}
                >
                  {std.status}
                </span>
              </div>

              <h3 className="text-[14px] font-semibold text-[#F1F5F9]">{std.title}</h3>
              <p className="text-[12px] text-[#94A3B8] leading-normal mt-1">{std.description}</p>
            </div>

            <div className="pt-2 border-t border-[#243247] flex items-center justify-between text-[12px]">
              <span className="text-[#64748B]">
                Active Violations: <strong className={std.activeIssueCount > 0 ? 'text-[#EF4444]' : 'text-[#22C55E]'}>{std.activeIssueCount}</strong>
              </span>

              {std.activeInspectionId && (
                <Link
                  to={`/inspections/${std.activeInspectionId}`}
                  className="text-[#22C7E8] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Inspection Details</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

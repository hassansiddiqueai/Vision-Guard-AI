import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
  Building2,
  HardHat,
  Wrench,
  Factory,
  ArrowRight,
  Play,
  CheckCircle2,
  Shield,
} from 'lucide-react';

export const LandingPage = () => {
  const domains = [
    {
      title: 'Construction & Scaffolding',
      desc: 'Detect missing diagonal pins, unbraced formwork, and loose planking.',
      icon: Building2,
      risk: 'CRITICAL',
    },
    {
      title: 'PPE & Fall Protection',
      desc: 'Verify harness tie-offs, hard hat adherence, and high-visibility vest compliance.',
      icon: HardHat,
      risk: 'HIGH',
    },
    {
      title: 'Heavy Equipment & Machinery',
      desc: 'Identify unshielded pinch-points, hydraulic seal weeping, and pedestrian proximity.',
      icon: Wrench,
      risk: 'HIGH',
    },
    {
      title: 'Industrial Facilities & Egress',
      desc: 'Audit 36-inch electrical panel clearances and emergency egress pathways.',
      icon: Factory,
      risk: 'MEDIUM',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1220] text-[#F1F5F9] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-[#243247]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#111C2E] border border-[#243247] text-[#22C7E8] text-[12px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                <span>Industrial Computer Vision Platform</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-semibold text-[#F1F5F9] tracking-tight leading-tight">
                AI-Powered Visual Inspection for High-Risk Environments
              </h1>

              <p className="text-[14px] sm:text-[15px] text-[#94A3B8] leading-relaxed max-w-lg">
                Analyze site imagery, detect visual hazards, explain findings, and generate actionable inspection reports in seconds.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <Link to="/inspections/new" className="vg-btn-primary py-2 px-4 text-[13px]">
                  <span>Start Inspection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link to="/dashboard" className="vg-btn-secondary py-2 px-4 text-[13px]">
                  <span>View Demo</span>
                </Link>
              </div>

              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-[#243247] text-[12px]">
                <div>
                  <span className="text-[#64748B] block text-[11px]">STANDARDS</span>
                  <span className="text-[#F1F5F9] font-medium">OSHA / ISO Mapped</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">INFERENCE</span>
                  <span className="text-[#F1F5F9] font-medium">&lt; 1.2s Latency</span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[11px]">AUDIT OUTPUT</span>
                  <span className="text-[#F1F5F9] font-medium">Print-Ready Reports</span>
                </div>
              </div>
            </div>

            {/* Right Inspection Preview */}
            <div className="lg:col-span-6">
              <div className="vg-card p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#94A3B8] px-1">
                  <span>SAMPLE AUDIT · INS-0241</span>
                  <span className="text-[#EF4444] font-semibold">CRITICAL HAZARD</span>
                </div>

                <div className="relative rounded overflow-hidden border border-[#243247] bg-[#0B1220]">
                  <img
                    src="https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1000&auto=format&fit=crop"
                    alt="Inspection Preview"
                    className="w-full h-64 object-cover"
                  />

                  {/* Clean Bounding Box */}
                  <div
                    className="absolute border-2 border-[#EF4444] bg-[#EF4444]/10 rounded pointer-events-none"
                    style={{ top: '25%', left: '35%', width: '38%', height: '48%' }}
                  >
                    <div className="absolute -top-5 left-0 px-1.5 py-0.2 bg-[#EF4444] text-white font-mono text-[10px] font-semibold rounded">
                      MISSING GUARD PIN · 98.4%
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-[#0B1220] border border-[#243247] text-[12px] space-y-1">
                  <span className="text-[#F1F5F9] font-medium block">
                    Critical coupling anomaly detected on scaffold tier 6.
                  </span>
                  <p className="text-[11px] text-[#94A3B8]">
                    Stop elevation work and inspect coupling before workers access elevated platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industrial Domains Section */}
      <section className="py-14 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center space-y-1.5 mb-8">
          <h2 className="text-[20px] sm:text-[22px] font-semibold text-[#F1F5F9]">
            Inspection Domains Covered
          </h2>
          <p className="text-[13px] text-[#94A3B8]">
            Automated defect classification across industrial operations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {domains.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="vg-card p-4 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded bg-[#1E293B] border border-[#243247] flex items-center justify-center text-[#22C7E8] mb-2">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-[14px] font-semibold text-[#F1F5F9]">{item.title}</h3>
                  <p className="text-[12px] text-[#94A3B8] leading-relaxed mt-1">{item.desc}</p>
                </div>

                <span className="text-[10px] font-mono font-medium text-[#64748B]">
                  Risk Threshold: {item.risk}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

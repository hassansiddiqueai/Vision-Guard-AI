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
  Shield,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Radio,
  FileCheck
} from 'lucide-react';

export const LandingPage = () => {
  const domains = [
    {
      title: 'Construction & Scaffolding',
      desc: 'Detect missing diagonal pins, unbraced formwork, and loose platform planking.',
      icon: Building2,
      risk: 'CRITICAL',
    },
    {
      title: 'PPE Compliance & Edge Safety',
      desc: 'Verify harness tie-offs, hard hat adherence, gloves, and high-visibility vest compliance.',
      icon: HardHat,
      risk: 'HIGH',
    },
    {
      title: 'Heavy Equipment & Proximity',
      desc: 'Monitor crane swing radii, excavator exclusion perimeters, and pedestrian blindspots.',
      icon: Wrench,
      risk: 'HIGH',
    },
    {
      title: 'Restricted Zones & Egress',
      desc: 'Track virtual zone boundaries, blocked fire exit corridors, and hazardous fall perimeters.',
      icon: Factory,
      risk: 'MEDIUM',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-10 pb-14 lg:pt-14 lg:pb-16 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>Industrial Computer Vision Safety Platform</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                Continuous Computer-Vision Safety Monitoring for High-Risk Sites
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed max-w-lg">
                VisionGuard monitors CCTV streams and site imagery in real time: detects optical hazards, classifies OSHA risk severity, enforces corrective action workflows, and generates audit reports.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <Link to="/dashboard" className="vg-btn-primary py-2.5 px-4 text-xs font-bold">
                  <span>Enter Safety Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link to="/live-monitoring" className="vg-btn-secondary py-2.5 px-4 text-xs font-semibold">
                  <Radio className="w-3.5 h-3.5 text-red-600" />
                  <span>Live CCTV Grid</span>
                </Link>
              </div>

              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">STANDARDS</span>
                  <span className="text-slate-800 font-bold">OSHA 1926 & ISO 45001</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">INFERENCE</span>
                  <span className="text-slate-800 font-bold">&lt; 1.2s Real-Time</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">VERIFICATION</span>
                  <span className="text-slate-800 font-bold">Human-in-the-Loop</span>
                </div>
              </div>
            </div>

            {/* Right Inspection Preview */}
            <div className="lg:col-span-6">
              <div className="vg-card p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 px-1">
                  <span>CAM-01 · APEX TOWER ZONE B</span>
                  <span className="vg-badge-critical">CRITICAL HAZARD DETECTED</span>
                </div>

                <div className="relative rounded overflow-hidden border border-slate-200 bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1000&auto=format&fit=crop"
                    alt="Inspection Preview"
                    className="w-full h-64 object-cover"
                  />

                  {/* Clean Bounding Box */}
                  <div
                    className="absolute border-2 border-red-500 bg-red-500/10 rounded pointer-events-none"
                    style={{ top: '25%', left: '35%', width: '38%', height: '48%' }}
                  >
                    <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-red-600 text-white font-mono text-[10px] font-bold rounded">
                      MISSING LOCK PIN · 98.4% CONF
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-md bg-red-50/70 border border-red-200 text-xs space-y-1">
                  <span className="text-red-900 font-bold block">
                    Structural Scaffolding Anomaly Identified
                  </span>
                  <p className="text-red-800 text-[11px]">
                    OSHA 1926.451(a)(1): Grade-8 lock fastener missing from coupling hub. Imminent collapse hazard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industrial Domains Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center space-y-1 mb-8">
          <h2 className="text-xl font-bold text-slate-900">
            Automated Computer Vision Detection Capabilities
          </h2>
          <p className="text-xs text-slate-500">
            Real-time optical defect classification and spatial telemetry across active operational environments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {domains.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="vg-card p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-sky-700 mb-2">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">{item.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Default Severity:</span>
                  <span className="font-bold text-slate-800">{item.risk}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};


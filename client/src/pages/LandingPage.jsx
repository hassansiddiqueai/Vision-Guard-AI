import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import {
  Shield,
  ArrowRight,
  HardHat,
  Building2,
  Wrench,
  Factory,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sliders,
  Play,
} from 'lucide-react';

export const LandingPage = () => {
  const domains = [
    {
      title: 'Construction & Scaffolding',
      desc: 'Detect missing diagonal pins, unbraced formwork, loose planking, and trench collapse risks.',
      icon: Building2,
      risk: 'CRITICAL',
    },
    {
      title: 'PPE & Fall Protection',
      desc: 'Verify 100% harness tie-off, hard hat adherence, safety glasses, and high-visibility vest compliance.',
      icon: HardHat,
      risk: 'HIGH',
    },
    {
      title: 'Heavy Equipment & Machinery',
      desc: 'Identify unshielded pinch-points, hydraulic seal weeping, missing safety interlocks, and mechanical fatigue.',
      icon: Wrench,
      risk: 'HIGH',
    },
    {
      title: 'Industrial Facilities & Egress',
      desc: 'Audit 36-inch electrical panel clearances, obstructed eyewash stations, and fire exit pathways.',
      icon: Factory,
      risk: 'MEDIUM',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-800 bg-industrial-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-700 text-sky-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>ENTERPRISE COMPUTER VISION PLATFORM</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                AI-Powered Visual Inspection for High-Risk Environments
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Analyze site imagery, detect visual hazards, explain findings, and generate actionable inspection reports in seconds.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/inspections/new"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-sm"
                >
                  <span>Start Inspection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition"
                >
                  <Play className="w-3.5 h-3.5 text-sky-400" />
                  <span>View Demo Dashboard</span>
                </Link>
              </div>

              {/* Core Industry Specs */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[11px]">BENCHMARKS</span>
                  <span className="text-slate-200 font-semibold">OSHA / ISO Mapped</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">INFERENCE</span>
                  <span className="text-slate-200 font-semibold">&lt; 1.2s Latency</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">ACCURACY</span>
                  <span className="text-emerald-400 font-semibold">98.4% Recall</span>
                </div>
              </div>
            </div>

            {/* Right: Realistic Inspection Preview Card */}
            <div className="lg:col-span-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                {/* HUD Header */}
                <div className="h-10 bg-slate-950 px-4 flex items-center justify-between border-b border-slate-800 text-xs font-mono">
                  <span className="text-slate-300 font-medium">LIVE AUDIT // APEX TOWER — TIER 6</span>
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    RISK: CRITICAL
                  </span>
                </div>

                {/* Simulated Visual Inspection Canvas */}
                <div className="relative h-64 sm:h-72 bg-slate-950 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1000&auto=format&fit=crop"
                    alt="Inspection target"
                    className="w-full h-full object-cover opacity-80"
                  />

                  {/* Bounding Box 1: Critical Missing Pin */}
                  <div className="absolute top-12 right-16 w-36 h-24 border-2 border-rose-500 bg-rose-500/15 rounded">
                    <div className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500 text-slate-950">
                      MISSING LOCK PIN [98.4%]
                    </div>
                  </div>

                  {/* Bounding Box 2: Worker PPE Verified */}
                  <div className="absolute bottom-6 left-12 w-28 h-28 border-2 border-emerald-400 bg-emerald-500/10 rounded">
                    <div className="absolute -top-5 left-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500 text-slate-950">
                      HARD HAT OK [99.1%]
                    </div>
                  </div>
                </div>

                {/* Finding Action Strip */}
                <div className="p-4 bg-slate-900/90 border-t border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">Immediate Corrective Action:</span>
                    <span className="text-rose-400 font-mono text-[11px]">PRIORITY 1</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Stop scaffold elevation work and inspect diagonal coupling pin before allowing worker ascent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industrial Domains */}
      <section className="py-16 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">Industrial Scope</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Purpose-Built for Safety Inspection Workflows
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Trained on industrial safety benchmarks, OSHA/ISO compliance rules, and equipment wear profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {domains.map((d, i) => {
              const Icon = d.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sky-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-white">{d.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{d.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5-Step Process */}
      <section className="py-16 bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">Inspection Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              End-to-End Operational Workflow
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { num: '01', title: 'Upload Image', desc: 'Ingest site photos or mobile captures in JPG, PNG, or WEBP format.' },
              { num: '02', title: 'Vision AI Analysis', desc: 'Multimodal neural network extracts spatial features and hazards.' },
              { num: '03', title: 'Detect Hazards', desc: 'Isolate bounding coordinates, tag anomalies, and score risk severity.' },
              { num: '04', title: 'Explain Findings', desc: 'Generate plain-English root causes with relevant safety citations.' },
              { num: '05', title: 'Action & Report', desc: 'Assign corrective action tasks and export compliance audit reports.' },
            ].map((step, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-sky-400 font-bold">{step.num}</span>
                <h4 className="text-xs font-bold text-slate-200">{step.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/inspections/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition"
            >
              <span>Launch Site Inspection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

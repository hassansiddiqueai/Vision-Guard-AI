import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { RiskBadge } from '../components/common/RiskBadge';
import { ConfidenceBar } from '../components/common/ConfidenceBar';
import {
  Sparkles,
  ArrowRight,
  ScanEye,
  AlertTriangle,
  FileCheck2,
  Cpu,
  Crosshair,
  TrendingUp,
  HardHat,
  Wrench,
  Building2,
  Factory,
  Eye,
  Zap,
} from 'lucide-react';

export const LandingPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const workflowSteps = [
    {
      step: '01',
      title: 'UPLOAD',
      desc: 'Upload high-resolution images or live mobile captures of construction sites, machinery, or work zones.',
      icon: ScanEye,
      detail: 'Supports JPG, PNG, WEBP with automated distortion correction and visual enhancement.',
    },
    {
      step: '02',
      title: 'ANALYZE',
      desc: 'Multimodal vision neural networks analyze spatial regions, hazard patterns, and material integrity.',
      icon: Cpu,
      detail: 'Runs multi-layer visual intelligence to detect micro-cracks, missing PPE, and mechanical wear.',
    },
    {
      step: '03',
      title: 'DETECT',
      desc: 'Isolate anomalies with precise bounding geometry, classification tags, and severity risk indexing.',
      icon: Crosshair,
      detail: 'Calculates high-precision confidence ratings and categorizes issues by risk level.',
    },
    {
      step: '04',
      title: 'EXPLAIN',
      desc: 'Generate human-explainable AI diagnostics explaining exact root causes and regulatory citations.',
      icon: Eye,
      detail: 'Explains why each anomaly was flagged, citing OSHA/ISO safety benchmarks.',
    },
    {
      step: '05',
      title: 'ACT',
      desc: 'Receive immediate prioritized corrective action recommendations and dispatchable field reports.',
      icon: FileCheck2,
      detail: 'Export structured audit logs, PDF summaries, and trigger remediation alerts instantly.',
    },
  ];

  const capabilities = [
    {
      icon: HardHat,
      title: 'Workplace & PPE Compliance',
      desc: 'Automated detection of missing helmets, high-visibility vests, harness violations, and unsafe worker proximity.',
      risk: 'CRITICAL',
    },
    {
      icon: Building2,
      title: 'Structural & Site Hazards',
      desc: 'Identify unbraced scaffolding, exposed rebar, structural fissures, falling debris risks, and perimeter breaches.',
      risk: 'HIGH',
    },
    {
      icon: Wrench,
      title: 'Heavy Equipment & Machinery',
      desc: 'Detect hydraulic leaks, missing safety guards, corrosion wear, misaligned conveyor belts, and thermal fatigue.',
      risk: 'MEDIUM',
    },
    {
      icon: Factory,
      title: 'Infrastructure & Facilities',
      desc: 'Continuous anomaly scans for pipeline joints, electrical panels, fire exit obstructions, and ventilation ducts.',
      risk: 'HIGH',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-tech-grid">
        {/* Background Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>AI-POWERED VISUAL INTELLIGENCE</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              See What Humans <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Miss.</span>
            </h1>

            {/* Supporting Text */}
            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Transform visual inspections into actionable intelligence with AI-powered anomaly detection, risk analysis, and explainable insights.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/inspect"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)]"
              >
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                <span>Start Inspection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-sm transition shadow-sm"
              >
                <span>Explore Dashboard</span>
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="mt-12 pt-8 border-t border-slate-850/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold font-mono text-cyan-400">99.4%</p>
                <p className="text-xs text-slate-400 mt-1">Hazard Recall Accuracy</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-emerald-400">&lt; 1.2s</p>
                <p className="text-xs text-slate-400 mt-1">Neural Inference Latency</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-blue-400">100%</p>
                <p className="text-xs text-slate-400 mt-1">Explainable Reasoning</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-mono text-amber-400">ISO/OSHA</p>
                <p className="text-xs text-slate-400 mt-1">Compliance Mapped</p>
              </div>
            </div>
          </div>

          {/* Hero Visual: Sophisticated Interactive Product Preview */}
          <div className="mt-16 relative max-w-5xl mx-auto" id="demo">
            {/* Outer Glow & Frame */}
            <div className="rounded-2xl p-1 bg-gradient-to-b from-cyan-500/30 via-slate-800/40 to-slate-900/80 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
              <div className="bg-slate-950 rounded-[14px] overflow-hidden border border-slate-800">
                {/* Product Header Bar */}
                <div className="h-11 bg-slate-900/90 px-4 flex items-center justify-between border-b border-slate-800 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-slate-500 ml-2">|</span>
                    <span className="text-slate-400">DEMO_SIMULATION // INDUSTRIAL_SCAFFOLDING_09.JPG</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-cyan-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      LIVE AI AUDIT PREVIEW
                    </span>
                  </div>
                </div>

                {/* Main Split Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Left: Image Canvas with Bounding Box & HUD */}
                  <div className="lg:col-span-7 bg-slate-950 p-6 relative flex flex-col justify-between min-h-[380px] border-b lg:border-b-0 lg:border-r border-slate-800">
                    {/* Simulated High-Tech Inspection Image */}
                    <div className="relative w-full h-80 rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 flex items-center justify-center group">
                      {/* Stylized background machinery / structural graphic */}
                      <div className="absolute inset-0 opacity-40 bg-tech-grid" />
                      
                      {/* Simulated Inspection Scene Graphic */}
                      <div className="relative z-10 text-center p-6">
                        <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center">
                          <HardHat className="w-10 h-10 text-amber-400 animate-pulse" />
                        </div>
                        <p className="text-xs font-mono text-slate-300 font-semibold">
                          CONSTRUCTION ZONE // LEVEL 4 AUDIT
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Scaffold Structural Integrity & Worker Harness Verification
                        </p>
                      </div>

                      {/* Detection Bounding Region 1: Critical Scaffold Missing Lock Pin */}
                      <div className="absolute top-10 right-10 w-44 h-32 border-2 border-rose-500 bg-rose-500/15 rounded ring-2 ring-rose-500/30 animate-pulse">
                        <div className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-500 text-slate-950 flex items-center gap-1 shadow">
                          <span>CRITICAL // MISSING LOCK PIN</span>
                        </div>
                        <div className="absolute bottom-1 right-1 text-[9px] font-mono text-rose-300 bg-slate-950/80 px-1 rounded">
                          CONF: 98.4%
                        </div>
                      </div>

                      {/* Detection Bounding Region 2: Worker PPE Verified */}
                      <div className="absolute bottom-8 left-8 w-36 h-28 border-2 border-cyan-400 bg-cyan-400/10 rounded">
                        <div className="absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-400 text-slate-950 flex items-center gap-1 shadow">
                          <span>VERIFIED // HARD HAT DETECTED</span>
                        </div>
                        <div className="absolute bottom-1 right-1 text-[9px] font-mono text-cyan-300 bg-slate-950/80 px-1 rounded">
                          CONF: 99.1%
                        </div>
                      </div>

                      {/* Radar Scanline Animation */}
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-75 shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-scan-line pointer-events-none" />
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                        GEO-COORDINATES: LAT 37.7749 / LON -122.4194
                      </span>
                      <span className="text-cyan-400">AI INFERENCE TIME: 840MS</span>
                    </div>
                  </div>

                  {/* Right: AI Analysis Panel */}
                  <div className="lg:col-span-5 bg-slate-900/60 p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      {/* Risk & Confidence Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div>
                          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            ASSESSMENT STATUS
                          </p>
                          <div className="mt-1">
                            <RiskBadge level="CRITICAL" size="md" />
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            CONFIDENCE
                          </p>
                          <p className="text-lg font-bold font-mono text-cyan-400 mt-0.5">98.4%</p>
                        </div>
                      </div>

                      {/* AI Executive Summary */}
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                          AI Finding Summary
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                          Severe structural safety violation identified on scaffold joint tier 3. Lock pin is absent, presenting catastrophic collapse hazard under dynamic load.
                        </p>
                      </div>

                      {/* Explainable Root Cause */}
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Why was this detected?</span>
                        </h4>
                        <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                          <p>• Visual gap in primary coupling mechanism (Region B-4)</p>
                          <p>• Cross-referenced with OSHA 1926.451(a)(1) scaffold safety standards</p>
                        </div>
                      </div>

                      {/* Actionable Recommendation */}
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>Immediate Corrective Action</span>
                        </h4>
                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                          <p className="font-semibold">Halt scaffold elevation immediately.</p>
                          <p className="text-[11px] text-amber-300/80 mt-0.5">
                            Insert certified Grade-8 locking pin before allowing worker ascent.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800">
                      <Link
                        to="/inspect"
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Run Real Inspection With Your Image</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: The Problem */}
      <section className="py-20 border-t border-slate-850 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              The Inspection Bottleneck
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-4">
              Human Inspection Has Blindspots
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              Manual visual reviews are slow, prone to fatigue, and frequently miss critical micro-anomalies that lead to catastrophic failures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">Missed Micro-Hazards</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Human eyes tire after hours on site. Hairline cracks, missing fasteners, and unlatched harnesses slip through standard audits.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">Lagging Paper Audits</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Inspection reports take days to compile manually. By the time safety managers review paperwork, the hazard has already escalated.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">Inconsistent Severity Scoring</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Different inspectors assign arbitrary risk levels. VisionGuard standardizes hazard severity using objective neural benchmarks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How VisionGuard Works (UPLOAD -> ANALYZE -> DETECT -> EXPLAIN -> ACT) */}
      <section className="py-20 border-t border-slate-850 bg-slate-900/40" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Autonomous Pipeline
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-4">
              How VisionGuard Works
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              A 5-stage multimodal vision pipeline that turns raw photos into definitive compliance actions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {workflowSteps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`cursor-pointer p-5 rounded-xl border transition-all duration-300 relative ${
                    activeTab === idx
                      ? 'bg-slate-900 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-cyan-400 font-bold">{item.step}</span>
                    <Icon
                      className={`w-5 h-5 ${
                        activeTab === idx ? 'text-cyan-400' : 'text-slate-500'
                      }`}
                    />
                  </div>
                  <h3 className="font-mono font-bold text-sm text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Interactive Step Detail Card */}
          <div className="mt-8 p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-mono uppercase text-cyan-400 tracking-wider">
                  STAGE {workflowSteps[activeTab].step} // {workflowSteps[activeTab].title} SPECIFICATION
                </p>
                <p className="text-sm text-slate-200 mt-1">{workflowSteps[activeTab].detail}</p>
              </div>
            </div>

            <Link
              to="/inspect"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow"
            >
              <span>Test This Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3: Core Capabilities */}
      <section className="py-20 border-t border-slate-850 bg-slate-950" id="capabilities">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Enterprise Domains
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-4">
              Designed for High-Risk Environments
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              VisionGuard AI is trained on rigorous industrial standards, construction codes, and safety protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition group"
                >
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/20 transition">
                      <Icon className="w-6 h-6" />
                    </div>
                    <RiskBadge level={cap.risk} size="sm" />
                  </div>

                  <h3 className="text-lg font-bold text-white mt-4">{cap.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Call To Action Banner */}
      <section className="py-20 border-t border-slate-850 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Upgrade Your Visual Audits?
          </h2>
          <p className="mt-4 text-slate-300 text-base max-w-xl mx-auto">
            Upload your first inspection photo now. Let VisionGuard AI identify hazards, evaluate risks, and generate actionable reports in seconds.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/inspect"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)]"
            >
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>Launch New Inspection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm transition"
            >
              Access Dashboard
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

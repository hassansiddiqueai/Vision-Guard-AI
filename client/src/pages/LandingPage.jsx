import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Radio,
  Eye,
  AlertTriangle,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Lock,
  Activity,
  Layers,
  Building
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const LandingPage = () => {
  const pillars = [
    {
      title: 'Live Monitoring',
      desc: 'Connect CCTV, IP, and local camera streams across multiple job sites with sub-100ms processing.',
      icon: Radio,
      link: '/live-cameras',
    },
    {
      title: 'AI Detection',
      desc: 'Automatic identification of missing PPE, fall hazards, machine proximity breaches, and structural risks.',
      icon: Eye,
      link: '/live-cameras',
    },
    {
      title: 'Incident Response',
      desc: 'Human-in-the-loop verification, instant supervisor alerts, and verifiable corrective action audit logs.',
      icon: AlertTriangle,
      link: '/incidents',
    },
    {
      title: 'Safety Analytics',
      desc: 'Real-time hazard frequency metrics, PPE compliance indices, and tamper-evident evidence archiving.',
      icon: BarChart3,
      link: '/analytics',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-sky-700" />
            <span>Industrial Safety Operations Center</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
            "See the risk before it becomes an incident."
          </h1>

          <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Continuous computer-vision safety monitoring for high-risk industrial, construction, and infrastructure sites.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              to="/dashboard"
              className="px-6 py-2.5 bg-sky-700 hover:bg-sky-800 text-white rounded-md text-xs font-bold shadow-xs transition flex items-center gap-2"
            >
              <span>ENTER SAFETY CENTER</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/live-cameras"
              className="px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-md text-xs font-bold transition flex items-center gap-2"
            >
              <Radio className="w-4 h-4 text-red-600 animate-pulse" />
              <span>LIVE CAMERAS</span>
            </Link>
          </div>

          {/* Clean Stream Preview Banner */}
          <div className="pt-8 max-w-4xl mx-auto">
            <div className="vg-card overflow-hidden border border-slate-300 shadow-md">
              <div className="px-4 py-2 bg-slate-900 text-white flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  APEX TOWER &bull; CAM-001 (SCAFFOLDING MATRIX)
                </span>
                <span className="text-emerald-400 font-bold">LIVE TELEMETRY</span>
              </div>
              <div className="relative aspect-video max-h-72 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop"
                  alt="Industrial Stream"
                  className="w-full h-full object-cover"
                />
                {/* Overlaid Detection Box */}
                <div className="absolute left-[25%] top-[20%] w-[35%] h-[55%] border-2 border-red-500 bg-red-500/15 rounded flex flex-col justify-between p-2 pointer-events-none">
                  <span className="bg-red-600 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded self-start">
                    NO HELMET &bull; 94% CONFIDENCE
                  </span>
                  <span className="bg-slate-950/80 text-red-300 font-mono text-[9px] px-1 rounded self-start">
                    ZONE: SCAFFOLD PLATFORM 6
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Operational Pillars */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <Link
                  key={idx}
                  to={p.link}
                  className="vg-card p-5 space-y-2.5 hover:border-slate-400 hover:shadow-md transition flex flex-col justify-between block"
                >
                  <div>
                    <div className="w-8 h-8 rounded bg-sky-50 text-sky-700 flex items-center justify-center mb-3 border border-sky-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{p.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {p.desc}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-sky-700 flex items-center gap-1 pt-2">
                    Open {p.title} &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

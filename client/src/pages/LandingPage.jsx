import React, { useState } from 'react';
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
  Building,
  Camera,
  Crosshair,
  Maximize2
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { BackgroundAtmosphere } from '../components/common/BackgroundAtmosphere';

export const LandingPage = () => {
  const [activeSiteIdx, setActiveSiteIdx] = useState(0);

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

  const showcaseSites = [
    {
      id: 'CAM-001',
      name: 'Apex Tower Column Rebar & Scaffolding Tier 6',
      site: 'Apex Tower Project',
      type: 'Fall Hazard & High-Elevation Rebar Work',
      imageUrl: '/assets/construction-site-bg.jpg',
      tag: 'MISSING HARNESS AT ELEVATION • 94%',
      status: 'CRITICAL',
      statusColor: 'bg-red-600',
    },
    {
      id: 'CAM-002',
      name: 'Heavy Equipment Logistics Yard',
      site: 'Harbor Gateway Logistics Yard',
      type: 'Machinery Swing Exclusion Envelope',
      imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=1200&auto=format&fit=crop',
      tag: 'MACHINE PROXIMITY • 1.2M DISTANCE',
      status: 'HIGH RISK',
      statusColor: 'bg-orange-600',
    },
    {
      id: 'CAM-003',
      name: 'Sub-Grade Deep Trench Foundation',
      site: 'Eastside Medical Center Phase 2',
      type: 'Impalement Dowel & Edge Safety',
      imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
      tag: 'UNCAPPED REBAR • VERIFIED',
      status: 'MONITORED',
      statusColor: 'bg-amber-600',
    },
    {
      id: 'CAM-004',
      name: '480V High-Voltage Switchgear Bay',
      site: 'Substation 4 Infrastructure',
      type: 'Clearance Arc & Egress Corridor',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
      tag: 'EGRESS CLEARANCE • COMPLIANT',
      status: 'SAFE',
      statusColor: 'bg-emerald-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans relative overflow-hidden">
      {/* Dynamic Interactive Background Atmosphere with Animated Radar & Photo Nodes */}
      <BackgroundAtmosphere variant="light" />

      <Navbar />

      {/* Hero Section with Interactive Photo Stream Backdrop */}
      <section className="relative pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-slate-200 bg-white/80 backdrop-blur-xs z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-5">
          {/* Animated Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Industrial Computer Vision Safety Platform &bull; Live Telemetry</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            "See the risk before it becomes an incident."
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Continuous computer-vision safety monitoring for high-risk industrial, construction, and infrastructure sites.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-sky-700 hover:bg-sky-800 text-white rounded-md text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 group"
            >
              <span>ENTER SAFETY CENTER</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/live-cameras"
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-md text-xs font-bold transition flex items-center gap-2 shadow-xs hover:border-slate-400"
            >
              <Radio className="w-4 h-4 text-red-600 animate-pulse" />
              <span>LIVE CAMERAS</span>
            </Link>
          </div>

          {/* Interactive Live Stream Showcase Banner */}
          <div className="pt-8 max-w-4xl mx-auto text-left">
            <div className="vg-card overflow-hidden border border-slate-300 shadow-xl bg-slate-950 rounded-lg">
              {/* Top HUD Strip */}
              <div className="px-4 py-2 bg-slate-900 text-white flex items-center justify-between text-xs font-mono border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-white">{showcaseSites[activeSiteIdx].id}</span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-300 font-semibold">{showcaseSites[activeSiteIdx].name}</span>
                </div>
                <span className="text-emerald-400 font-bold bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
                  OPTICAL SCAN ACTIVE
                </span>
              </div>

              {/* Main Photo Container with Optical Scanline & Detection Overlays */}
              <div className="relative aspect-video max-h-80 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src={showcaseSites[activeSiteIdx].imageUrl}
                  alt={showcaseSites[activeSiteIdx].name}
                  className="w-full h-full object-cover opacity-90 transition duration-500"
                />

                {/* Animated Horizontal Scanline */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-sky-400/20 to-transparent h-16 w-full animate-scanline" />

                {/* Overlaid Detection Box */}
                <div className="absolute left-[24%] top-[18%] w-[38%] h-[56%] border-2 border-red-500 bg-red-500/15 rounded flex flex-col justify-between p-2 pointer-events-none animate-pulse">
                  <div className="flex flex-col gap-1 self-start">
                    <span className="bg-red-600 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded shadow-xs">
                      {showcaseSites[activeSiteIdx].tag}
                    </span>
                    <span className="bg-slate-950/80 text-amber-300 font-mono text-[9px] px-1 rounded self-start">
                      SECTOR: LEVEL 6 BEAM
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-white bg-slate-950/80 px-1 rounded self-start">
                    STATUS: {showcaseSites[activeSiteIdx].status}
                  </span>
                </div>

                {/* Bottom Overlay Telemetry */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-slate-300 bg-slate-950/80 px-3 py-1 rounded backdrop-blur-xs border border-slate-800">
                  <span>RESOLUTION: 1920x1080 (FHD) &bull; 30 FPS</span>
                  <span className="text-emerald-400 font-bold">LATENCY: 84ms</span>
                </div>
              </div>

              {/* Interactive Site Switcher Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-900 border-t border-slate-800 text-xs">
                {showcaseSites.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSiteIdx(idx)}
                    className={`p-2.5 text-left transition flex flex-col justify-between border-r border-slate-800 last:border-r-0 ${
                      activeSiteIdx === idx
                        ? 'bg-slate-800/90 text-white border-b-2 border-b-sky-500 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-sky-400">{s.id}</span>
                    <span className="truncate font-semibold">{s.site}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Operational Pillars */}
      <section className="py-14 bg-slate-50/90 relative z-10 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Enterprise Safety Operations Architecture
            </h2>
            <p className="text-xs text-slate-500">
              Designed for safety superintendents, project directors, and HSE inspection teams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <Link
                  key={idx}
                  to={p.link}
                  className="vg-card p-5 space-y-3 hover:border-sky-500 hover:shadow-lg transition flex flex-col justify-between block group bg-white/90 backdrop-blur-xs"
                >
                  <div>
                    <div className="w-9 h-9 rounded-md bg-sky-50 text-sky-700 flex items-center justify-center mb-3 border border-sky-200 group-hover:bg-sky-600 group-hover:text-white transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-sky-700 transition">{p.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">
                      {p.desc}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-sky-700 flex items-center gap-1 pt-2 group-hover:translate-x-1 transition-transform">
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

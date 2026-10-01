import React, { useState } from 'react';
import { Camera, Radio, Eye, AlertTriangle, ShieldCheck, Crosshair, MapPin } from 'lucide-react';

export const BackgroundAtmosphere = ({ variant = 'light' }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const backgroundPhotos = [
    {
      id: 'NODE-01',
      title: 'Scaffolding Bay Tier 4',
      site: 'Apex Tower',
      tag: 'NO HARNESS 91%',
      status: 'CRITICAL',
      statusColor: 'text-red-600 bg-red-50 border-red-200',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=600&auto=format&fit=crop',
      position: 'top-12 left-6 lg:left-12',
      rotation: '-rotate-2',
      delay: '0s',
    },
    {
      id: 'NODE-02',
      title: 'Heavy Crane Swing Envelope',
      site: 'Harbor Gateway Yard',
      tag: 'ZONE BREACH 88%',
      status: 'HIGH RISK',
      statusColor: 'text-orange-600 bg-orange-50 border-orange-200',
      image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=600&auto=format&fit=crop',
      position: 'top-32 right-6 lg:right-16',
      rotation: 'rotate-3',
      delay: '2s',
    },
    {
      id: 'NODE-03',
      title: 'Structural Trench Foundation',
      site: 'Eastside Medical Phase 2',
      tag: 'IMPACT ZONE OK',
      status: 'MONITORED',
      statusColor: 'text-sky-700 bg-sky-50 border-sky-200',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop',
      position: 'bottom-20 left-10 lg:left-24',
      rotation: 'rotate-2',
      delay: '4s',
    },
    {
      id: 'NODE-04',
      title: 'Substation Transformer Bay',
      site: 'Substation 4 Infrastructure',
      tag: 'ARC FLASH SAFE',
      status: 'COMPLIANT',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
      position: 'bottom-16 right-8 lg:right-20',
      rotation: '-rotate-3',
      delay: '1.5s',
    },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Base Grid Layer */}
      <div
        className={`absolute inset-0 ${
          variant === 'dark' ? 'vg-dark-grid opacity-50' : 'vg-telemetry-grid opacity-35'
        }`}
      />

      {/* 2. Concentric Radar Rings & Rotating Sweep Line */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] pointer-events-none opacity-25">
        <div className="absolute inset-0 vg-radar-circle animate-hud-spin" />
        <div className="absolute inset-16 vg-radar-circle border-sky-400/20" />
        <div className="absolute inset-36 vg-radar-circle border-sky-400/30" />
        <div className="absolute inset-60 vg-radar-circle border-sky-400/40" />
        
        {/* Radar Center Crosshairs */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-[1px] bg-sky-400/20" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-[1px] bg-sky-400/20" />
        </div>

        {/* Sweeping Radar Beam */}
        <div className="absolute inset-0 origin-center animate-radar">
          <div className="w-1/2 h-1/2 bg-gradient-to-br from-sky-400/20 to-transparent rounded-tl-full" />
        </div>
      </div>

      {/* 3. Ambient Glowing Floating Light Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl animate-float pointer-events-none" />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-300/15 rounded-full blur-3xl animate-float-reverse pointer-events-none"
        style={{ animationDelay: '3s' }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none"
      />

      {/* 4. Interactive Floating Industrial Photo Nodes (Pointer events enabled for interactive hover) */}
      <div className="absolute inset-0 pointer-events-auto">
        {backgroundPhotos.map((node) => {
          const isHovered = hoveredCard === node.id;
          return (
            <div
              key={node.id}
              onMouseEnter={() => setHoveredCard(node.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ animationDelay: node.delay }}
              className={`absolute ${node.position} transition-all duration-500 hidden md:block cursor-pointer animate-photo-drift z-0 ${
                isHovered
                  ? 'scale-110 opacity-100 z-30 shadow-2xl ring-2 ring-sky-500'
                  : 'opacity-40 hover:opacity-90 hover:scale-105'
              }`}
            >
              <div
                className={`w-44 lg:w-52 rounded-lg overflow-hidden border bg-white/95 backdrop-blur-md shadow-lg transition-transform ${node.rotation}`}
              >
                {/* Image Frame with Optical Scanline */}
                <div className="relative h-24 sm:h-28 overflow-hidden bg-slate-900">
                  <img
                    src={node.image}
                    alt={node.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isHovered ? 'scale-110 filter contrast-125' : 'filter brightness-90 contrast-105'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Realtime Scanline Beam */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-400/25 to-transparent h-8 w-full animate-scanline pointer-events-none" />

                  {/* Top Live Badge */}
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-slate-950/80 backdrop-blur-xs text-white px-1.5 py-0.5 rounded text-[9px] font-mono border border-slate-700/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{node.id}</span>
                  </div>

                  {/* Status Overlay */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[9px] font-mono">
                    <span className={`px-1 rounded font-bold border ${node.statusColor}`}>
                      {node.tag}
                    </span>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="p-2 text-[10px] bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-semibold text-slate-800 truncate max-w-[120px]">
                    {node.site}
                  </span>
                  <span className="text-[9px] text-sky-700 font-mono font-bold">
                    [LIVE]
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Fixed Corner Telemetry Markers */}
      <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-400 tracking-wider hidden sm:flex items-center gap-2">
        <Crosshair className="w-3 h-3 text-sky-600 animate-hud-spin" />
        <span>RADAR LAT: 37.7749° N &bull; OPTICAL ENGINE: 30 FPS &bull; SUB-100MS</span>
      </div>

      <div className="absolute bottom-3 right-4 text-[10px] font-mono text-slate-400 tracking-wider hidden sm:flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>SYNCHRONIZED TELEMETRY BUS ACTIVE</span>
      </div>
    </div>
  );
};

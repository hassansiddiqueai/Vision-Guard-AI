import React, { useState, useEffect, useRef } from 'react';
import { Camera, Radio, Eye, AlertTriangle, ShieldCheck, Crosshair, MapPin, Zap, Activity } from 'lucide-react';

export const BackgroundAtmosphere = ({ variant = 'dark' }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Interactive mouse tracking for subtle parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Hardware-accelerated cybernetic particle network canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = 42;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: i % 5 === 0 ? '#38BDF8' : i % 7 === 0 ? '#10B981' : '#64748B',
      });
    }

    let frameId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle connections
      for (let i = 0; i < particleCount; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();

        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.18 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const backgroundPhotos = [
    {
      id: 'FEED-01',
      title: 'Scaffolding & Rebar Tier 4',
      site: 'Apex Tower Project',
      tag: 'ZONE BREACH 94%',
      status: 'CRITICAL',
      statusColor: 'text-red-400 bg-red-950/80 border-red-700',
      image: '/assets/construction-site-bg.jpg',
      position: 'top-16 left-6 lg:left-14',
      rotation: '-rotate-2',
      delay: '0s',
    },
    {
      id: 'FEED-02',
      title: 'Heavy Crane Swing Radius',
      site: 'Harbor Gateway Yard',
      tag: 'PROXIMITY ALERT',
      status: 'HIGH RISK',
      statusColor: 'text-amber-400 bg-amber-950/80 border-amber-700',
      image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=600&auto=format&fit=crop',
      position: 'top-28 right-6 lg:right-16',
      rotation: 'rotate-3',
      delay: '2s',
    },
    {
      id: 'FEED-03',
      title: 'Excavation Foundation Trench',
      site: 'Eastside Medical Phase 2',
      tag: 'PPE VERIFIED 99%',
      status: 'COMPLIANT',
      statusColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-700',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop',
      position: 'bottom-20 left-10 lg:left-24',
      rotation: 'rotate-2',
      delay: '4s',
    },
    {
      id: 'FEED-04',
      title: 'Substation Transformer Bay 4',
      site: 'Substation 4 Grid',
      tag: 'ARC FLASH SAFE',
      status: 'OPTIMAL',
      statusColor: 'text-sky-400 bg-sky-950/80 border-sky-700',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
      position: 'bottom-16 right-8 lg:right-20',
      rotation: '-rotate-3',
      delay: '1.5s',
    },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 0. Ambient Industrial Construction Background Photo Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/construction-site-bg.jpg"
          alt="Construction Site Telemetry Background"
          className="w-full h-full object-cover filter contrast-125 opacity-10 brightness-50 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/90 to-[#070B14]/75" />
      </div>

      {/* 1. Cyber Mesh Grid */}
      <div className="absolute inset-0 vg-cyber-grid opacity-60 pointer-events-none" />

      {/* 2. Interactive Particle Network Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40" />

      {/* 3. Glowing Ambient Cyber Light Orbs (With Mouse Parallax) */}
      <div
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        className="absolute -top-40 -left-40 w-[480px] h-[480px] bg-sky-600/15 rounded-full blur-[110px] animate-orb-float pointer-events-none transition-transform duration-700"
      />
      <div
        style={{ transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)` }}
        className="absolute -bottom-40 -right-40 w-[520px] h-[520px] bg-emerald-600/12 rounded-full blur-[120px] animate-orb-float pointer-events-none transition-transform duration-700"
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[380px] h-[380px] bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none animate-pulse"
      />

      {/* 4. Giant Holographic Radar Rings with Rotating Sweeping Beam */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] pointer-events-none opacity-20">
        {/* Concentric HUD Rings */}
        <div className="absolute inset-0 rounded-full border border-dashed border-sky-400/30 animate-hud-cw" />
        <div className="absolute inset-20 rounded-full border border-sky-400/20 animate-hud-ccw" />
        <div className="absolute inset-40 rounded-full border border-dashed border-cyan-400/30" />
        <div className="absolute inset-64 rounded-full border border-sky-400/40" />

        {/* Reticle Crosshairs */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-[1px] bg-sky-400/25" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-[1px] bg-sky-400/25" />
        </div>

        {/* Sweeping Radar Beam */}
        <div className="absolute inset-0 origin-center animate-radar-sweep">
          <div className="w-1/2 h-1/2 bg-gradient-to-br from-sky-400/30 to-transparent rounded-tl-full" />
        </div>
      </div>

      {/* 5. Interactive Floating Hologram CCTV Chips (Hoverable with 3D Pop) */}
      <div className="absolute inset-0 pointer-events-auto">
        {backgroundPhotos.map((node) => {
          const isHovered = hoveredCard === node.id;
          return (
            <div
              key={node.id}
              onMouseEnter={() => setHoveredCard(node.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{ animationDelay: node.delay }}
              className={`absolute ${node.position} transition-all duration-500 hidden md:block cursor-pointer ${
                node.id.endsWith('1') || node.id.endsWith('3') ? 'animate-float-card' : 'animate-float-card-rev'
              } z-0 ${
                isHovered
                  ? 'scale-115 opacity-100 z-40 shadow-2xl ring-2 ring-sky-400'
                  : 'opacity-35 hover:opacity-95 hover:scale-105'
              }`}
            >
              <div
                className={`w-48 lg:w-56 rounded-lg overflow-hidden border border-slate-700/80 bg-[#0B1120]/95 backdrop-blur-xl shadow-2xl transition-transform duration-300 ${node.rotation}`}
              >
                {/* Image Frame with Optical Scanline */}
                <div className="relative h-24 sm:h-28 overflow-hidden bg-slate-950">
                  <img
                    src={node.image}
                    alt={node.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isHovered ? 'scale-110 filter contrast-125 brightness-105' : 'filter brightness-80 contrast-110'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent" />
                  
                  {/* Realtime Scanline Beam */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sky-400/30 to-transparent h-6 w-full animate-scanline-fast pointer-events-none" />

                  {/* Top Live Badge */}
                  <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-slate-950/90 backdrop-blur-md text-white px-2 py-0.5 rounded text-[9px] font-mono border border-slate-700 shadow">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold text-sky-300">{node.id}</span>
                  </div>

                  {/* Status Overlay */}
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[9px] font-mono">
                    <span className={`px-1.5 py-0.5 rounded font-bold border shadow ${node.statusColor}`}>
                      {node.tag}
                    </span>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="p-2 text-[10px] bg-[#090D18] border-t border-slate-800 flex items-center justify-between">
                  <span className="font-semibold text-slate-300 truncate max-w-[130px]">
                    {node.site}
                  </span>
                  <span className="text-[9px] text-sky-400 font-mono font-bold flex items-center gap-1">
                    <Activity className="w-2.5 h-2.5 animate-pulse text-emerald-400" />
                    LIVE
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. Fixed Telemetry HUD Markers */}
      <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-500 tracking-wider hidden sm:flex items-center gap-2">
        <Crosshair className="w-3 h-3 text-sky-400 animate-hud-cw" />
        <span>RADAR LAT: 37.7749° N &bull; OPTICAL ENGINE: 30 FPS &bull; LATENCY &lt; 42MS</span>
      </div>

      <div className="absolute bottom-3 right-4 text-[10px] font-mono text-slate-500 tracking-wider hidden sm:flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-emerald-400/90 font-bold">NEURAL TELEMETRY SYNCHRONIZED</span>
      </div>
    </div>
  );
};

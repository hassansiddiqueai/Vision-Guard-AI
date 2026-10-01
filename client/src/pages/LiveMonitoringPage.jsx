import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Cctv,
  Activity,
  AlertTriangle,
  Shield,
  CheckCircle2,
  RefreshCw,
  Maximize2,
  Sliders,
  Play,
  Pause,
  Clock,
  Radio,
  Eye,
  ExternalLink,
} from 'lucide-react';

const CAMERAS = [
  {
    id: 'CAM-01',
    name: 'Sector 4 Scaffolding Matrix',
    location: 'North Elevation - Level 6',
    status: 'ONLINE',
    fps: 30,
    bitrate: '4.2 Mbps',
    resolution: '1440p (2K)',
    riskLevel: 'CRITICAL',
    lastEvent: 'Missing lock pin detected on diagonal brace joint',
    lastEventTime: '12s ago',
    confidence: '98.4%',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1000&auto=format&fit=crop',
    inspectionId: 'INS-0241',
  },
  {
    id: 'CAM-02',
    name: 'Heavy Equipment Staging Yard',
    location: 'Yard Sector C - Maintenance Dock',
    status: 'ONLINE',
    fps: 25,
    bitrate: '3.8 Mbps',
    resolution: '1080p',
    riskLevel: 'HIGH',
    lastEvent: 'Exposed rotating pulley drive without guard shield',
    lastEventTime: '3m ago',
    confidence: '96.0%',
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=1000&auto=format&fit=crop',
    inspectionId: 'INS-0240',
  },
  {
    id: 'CAM-03',
    name: 'Foundation Excavation & Trench',
    location: 'Sub-grade Basement Pour Sector 2',
    status: 'ONLINE',
    fps: 30,
    bitrate: '4.5 Mbps',
    resolution: '1440p (2K)',
    riskLevel: 'SAFE',
    lastEvent: 'OSHA safety caps verified on all protruding dowels',
    lastEventTime: '8m ago',
    confidence: '97.9%',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop',
    inspectionId: 'INS-0239',
  },
  {
    id: 'CAM-04',
    name: 'Substation High-Voltage Bay',
    location: '480V Main Distribution Room',
    status: 'ONLINE',
    fps: 20,
    bitrate: '2.4 Mbps',
    resolution: '1080p',
    riskLevel: 'SAFE',
    lastEvent: '36-inch perimeter clearance compliance maintained',
    lastEventTime: '14m ago',
    confidence: '96.2%',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop',
    inspectionId: 'INS-0238',
  },
];

export const LiveMonitoringPage = () => {
  const [selectedCam, setSelectedCam] = useState(CAMERAS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [streamTime, setStreamTime] = useState(new Date().toLocaleTimeString());
  const [events, setEvents] = useState([
    { id: 1, cam: 'CAM-01', time: '13:42:08', type: 'CRITICAL', text: 'Missing diagonal lock pin flagged on scaffolding tier 6', conf: '98.4%' },
    { id: 2, cam: 'CAM-02', time: '13:39:15', type: 'HIGH', text: 'Worker within 1.5m of unguarded drive belt', conf: '96.0%' },
    { id: 3, cam: 'CAM-01', time: '13:35:40', type: 'WARNING', text: 'Perimeter worker tether status pending line verification', conf: '91.2%' },
    { id: 4, cam: 'CAM-03', time: '13:30:12', type: 'INFO', text: 'Concrete pour sector 2 rebar safety caps confirmed compliant', conf: '97.9%' },
    { id: 5, cam: 'CAM-04', time: '13:22:04', type: 'INFO', text: 'Switchgear aisle clearance restored to 42 inches', conf: '96.2%' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStreamTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Site CCTV & Vision Telemetry</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-400 font-bold">
              SIMULATION FEED
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Live Site Surveillance & Computer Vision Monitoring
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time optical hazard detection, perimeter safety checks, and edge inferencing telemetry.
          </p>
        </div>

        {/* Global Control Hub */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium font-mono transition ${
              isPlaying
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'PAUSE INFERENCE' : 'RESUME STREAM'}</span>
          </button>

          <Link
            to="/inspections/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Run Manual Scan</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Video Stream + Telemetry Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Main Video HUD */}
        <div className="lg:col-span-8 space-y-4">
          {/* Video Container */}
          <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center group">
            {/* Background Stream Image */}
            <img
              src={selectedCam.imageUrl}
              alt={selectedCam.name}
              className="w-full h-full object-cover opacity-90 transition duration-300"
            />

            {/* Industrial Viewfinder Crosshairs & Grid Lines */}
            <div className="absolute inset-0 pointer-events-none border border-slate-700/40">
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-sky-400/80" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-sky-400/80" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-sky-400/80" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-sky-400/80" />
            </div>

            {/* Top Stream Overlay */}
            <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent flex items-center justify-between font-mono text-[11px] text-slate-200 pointer-events-none">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  LIVE
                </span>
                <span className="font-bold text-white tracking-wide">{selectedCam.id} — {selectedCam.name}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span>{selectedCam.resolution}</span>
                <span>{selectedCam.fps} FPS</span>
                <span className="text-sky-400 font-bold">{streamTime}</span>
              </div>
            </div>

            {/* Live Bounding Box Simulation */}
            {selectedCam.riskLevel === 'CRITICAL' && (
              <div
                className="absolute border-2 border-rose-500 bg-rose-500/10 pointer-events-none rounded transition-all duration-300"
                style={{ top: '22%', left: '38%', width: '32%', height: '40%' }}
              >
                <div className="absolute -top-6 left-0 px-1.5 py-0.5 bg-rose-600 text-white font-mono text-[10px] font-bold rounded flex items-center gap-1 shadow">
                  <AlertTriangle className="w-3 h-3" />
                  MISSING PIN DETECTED [98.4%]
                </div>
              </div>
            )}

            {selectedCam.riskLevel === 'HIGH' && (
              <div
                className="absolute border-2 border-amber-500 bg-amber-500/10 pointer-events-none rounded transition-all duration-300"
                style={{ top: '30%', left: '50%', width: '28%', height: '35%' }}
              >
                <div className="absolute -top-6 left-0 px-1.5 py-0.5 bg-amber-600 text-slate-950 font-mono text-[10px] font-bold rounded flex items-center gap-1 shadow">
                  <AlertTriangle className="w-3 h-3" />
                  EXPOSED PULLEY [96.0%]
                </div>
              </div>
            )}

            {/* Bottom Stream Telemetry Bar */}
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950/90 via-slate-950/70 to-transparent flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-slate-400">STATUS:</span>
                <span className="text-emerald-400 font-semibold">{selectedCam.status}</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">LATENCY:</span>
                <span className="text-slate-200">18ms</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">BITRATE:</span>
                <span className="text-slate-200">{selectedCam.bitrate}</span>
              </div>

              <Link
                to={`/inspections/${selectedCam.inspectionId}`}
                className="pointer-events-auto px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 hover:border-sky-400 text-slate-200 hover:text-sky-400 transition text-[11px] flex items-center gap-1.5"
              >
                <Eye className="w-3 h-3" />
                <span>Audit Snapshot</span>
              </Link>
            </div>
          </div>

          {/* Camera Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CAMERAS.map((cam) => {
              const isSelected = selectedCam.id === cam.id;
              return (
                <button
                  key={cam.id}
                  onClick={() => setSelectedCam(cam)}
                  className={`p-2.5 rounded-xl border text-left transition relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-sky-400 ring-1 ring-sky-400/40'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10px] font-bold text-slate-400">{cam.id}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        cam.riskLevel === 'CRITICAL'
                          ? 'bg-rose-500 animate-ping'
                          : cam.riskLevel === 'HIGH'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                  </div>
                  <p className="text-xs font-semibold text-slate-200 truncate">{cam.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{cam.location}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Real-Time Vision Telemetry Stream */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Unit Diagnostic Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Current Stream Risk</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  selectedCam.riskLevel === 'CRITICAL'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    : selectedCam.riskLevel === 'HIGH'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {selectedCam.riskLevel}
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                <span>Latest Detection:</span>
                <span className="text-slate-200 font-medium">{selectedCam.lastEventTime}</span>
              </div>
              <p className="text-xs text-slate-200 font-medium bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                {selectedCam.lastEvent}
              </p>
              <div className="flex justify-between text-slate-400 font-mono text-[11px] pt-1">
                <span>Model Confidence:</span>
                <span className="text-sky-400 font-bold">{selectedCam.confidence}</span>
              </div>
            </div>
          </div>

          {/* Live Event Stream Log */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Detection Event Log
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">5 events</span>
            </div>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-slate-400">{evt.cam} • {evt.time}</span>
                    <span
                      className={`font-bold ${
                        evt.type === 'CRITICAL'
                          ? 'text-rose-400'
                          : evt.type === 'HIGH'
                          ? 'text-amber-400'
                          : evt.type === 'WARNING'
                          ? 'text-yellow-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {evt.type}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs">{evt.text}</p>
                  <div className="text-[10px] font-mono text-sky-400 text-right">
                    Conf: {evt.conf}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

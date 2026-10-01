import React, { useState, useEffect } from 'react';
import {
  Camera,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  AlertTriangle,
  ShieldCheck,
  Layers,
  Settings,
  RefreshCw,
  HardHat,
  Eye,
  Sliders,
  Radio,
  CheckCircle,
  AlertOctagon,
} from 'lucide-react';
import { useInspections } from '../context/InspectionContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { DemoScenarioToolbar } from '../components/common/DemoScenarioToolbar';
import { IncidentModal } from '../components/common/IncidentModal';

export const LiveMonitoringPage = () => {
  const { cameras, addIncident, triggerHazardAlert } = useInspections();
  const [selectedCameraId, setSelectedCameraId] = useState('CAM-001');
  const [isPlaying, setIsPlaying] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showBoxes, setShowBoxes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const activeCamera = cameras.find((c) => c.id === selectedCameraId) || cameras[0];

  // Simulated live timestamp
  const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => setTimestamp(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCreateInstantIncident = () => {
    const newInc = addIncident({
      hazard: activeCamera.currentRisk === 'CRITICAL' ? 'Scaffolding Lock Pin Absence' : 'Equipment Proximity Violation',
      category: 'Environmental',
      severity: activeCamera.currentRisk,
      confidence: 97.4,
      site: activeCamera.site,
      location: activeCamera.location,
      camera: `${activeCamera.id} (${activeCamera.name})`,
      explanation: 'Manual inspector trigger from live CCTV surveillance monitor.',
      recommendedAction: 'Dispatch field supervisor to verify compliance and secure perimeter.',
      evidenceImage: activeCamera.feedUrl,
    });
    setSelectedIncident(newInc);
  };

  return (
    <div className="space-y-6">
      {/* Demo Scenario Toolbar */}
      <DemoScenarioToolbar />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">Live CCTV & Computer Vision Monitoring</h1>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              DEMO FEED
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time optical stream analysis, virtual boundary breach detection, and safety envelope verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowZones(!showZones)}
            className={`text-xs px-2.5 py-1.5 rounded border transition flex items-center gap-1.5 ${
              showZones
                ? 'bg-sky-50 text-sky-700 border-sky-300 font-medium'
                : 'bg-white text-slate-600 border-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Virtual Zones {showZones ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className={`text-xs px-2.5 py-1.5 rounded border transition flex items-center gap-1.5 ${
              showBoxes
                ? 'bg-sky-50 text-sky-700 border-sky-300 font-medium'
                : 'bg-white text-slate-600 border-slate-300'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Overlays {showBoxes ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Main Focus CCTV Monitor Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 16:9 Primary Video Feed */}
        <div className={`lg:col-span-2 vg-card overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}>
          {/* Feed Header */}
          <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between text-white text-xs border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1 text-emerald-400 font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> LIVE
              </span>
              <span className="font-semibold">{activeCamera.name}</span>
              <span className="text-slate-400 font-mono text-[11px]">({activeCamera.id})</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-400 text-[11px]">{timestamp}</span>
              <RiskBadge level={activeCamera.currentRisk} size="sm" />
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Video Viewport with Virtual Detection Bounding Boxes */}
          <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden select-none">
            <img
              src={activeCamera.feedUrl}
              alt={activeCamera.name}
              className={`w-full h-full object-cover transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-70'}`}
            />

            {/* Virtual Restricted Zones Overlay */}
            {showZones && activeCamera.zones && (
              <div className="absolute inset-0 pointer-events-none">
                {activeCamera.zones.map((zone) => (
                  <div
                    key={zone.id}
                    className="absolute border-2 border-dashed border-red-500 bg-red-500/10 rounded p-2"
                    style={{
                      top: zone.id === 'Z-1' ? '15%' : '40%',
                      left: zone.id === 'Z-1' ? '20%' : '50%',
                      width: '35%',
                      height: '45%',
                    }}
                  >
                    <span className="bg-red-600 text-white font-mono text-[9px] px-1 py-0.5 rounded font-bold uppercase tracking-wider">
                      {zone.name} [BREACH DETECTED]
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Computer Vision Detection Overlays */}
            {showBoxes && activeCamera.currentRisk === 'CRITICAL' && (
              <div
                className="absolute border-2 border-red-600 bg-red-600/15 rounded pointer-events-none"
                style={{ top: '22%', left: '42%', width: '28%', height: '36%' }}
              >
                <div className="absolute -top-5 left-0 bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1">
                  <span>MISSING LOCK PIN · 98.4%</span>
                </div>
              </div>
            )}

            {showBoxes && activeCamera.currentRisk === 'HIGH' && (
              <div
                className="absolute border-2 border-orange-500 bg-orange-500/15 rounded pointer-events-none"
                style={{ top: '35%', left: '30%', width: '32%', height: '40%' }}
              >
                <div className="absolute -top-5 left-0 bg-orange-500 text-white px-1.5 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1">
                  <span>PROXIMITY ENVELOPE · 94.7%</span>
                </div>
              </div>
            )}

            {/* Bottom Stream Telemetry Bar */}
            <div className="absolute bottom-2 left-3 right-3 bg-slate-900/85 backdrop-blur-xs border border-slate-800 text-white px-3 py-1.5 rounded flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-3">
                <span>{activeCamera.resolution}</span>
                <span>{activeCamera.fps} FPS</span>
                <span>{activeCamera.bitrate}</span>
                <span className="text-emerald-400">CV PIPELINE: ACTIVE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">LATENCY: 32ms</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-300">{activeCamera.location}</span>
              </div>
            </div>
          </div>

          {/* Bottom Stream Control Bar */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="vg-btn-secondary text-xs"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-slate-700" /> : <Play className="w-3.5 h-3.5 text-slate-700" />}
                <span>{isPlaying ? 'Pause Feed' : 'Resume Feed'}</span>
              </button>

              <button
                onClick={handleCreateInstantIncident}
                className="vg-btn-primary text-xs bg-red-600 hover:bg-red-700 text-white"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Escalate to Incident</span>
              </button>
            </div>

            <span className="text-slate-500 text-[11px]">
              Human verification required before initiating emergency shutdown.
            </span>
          </div>
        </div>

        {/* Right: Active Camera Risk & Telemetry Details */}
        <div className="space-y-4">
          <div className="vg-card p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-sm font-semibold text-slate-900">Active Risk Classification</h2>
              <RiskBadge level={activeCamera.currentRisk} size="sm" />
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Monitored Job Site</span>
                <span className="font-semibold text-slate-800">{activeCamera.site}</span>
                <span className="text-slate-500 block text-[11px] mt-0.5">{activeCamera.location}</span>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-semibold text-slate-900 block">WHY IS THIS DANGEROUS?</span>
                <p className="text-slate-600 leading-relaxed">
                  {activeCamera.currentRisk === 'CRITICAL'
                    ? 'Elevated scaffolding diagonal coupling lacks Grade-8 locking fastener under dynamic loading.'
                    : activeCamera.currentRisk === 'HIGH'
                    ? 'Worker operating within 1.2m of excavator swing radius without positive physical separation.'
                    : 'All monitored baseline safety and PPE compliance requirements met.'}
                </p>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="font-semibold text-slate-900 block">RECOMMENDED ACTION</span>
                <p className="text-slate-600 leading-relaxed">
                  {activeCamera.currentRisk === 'CRITICAL'
                    ? 'Halt elevation work immediately and bolt approved locking fastener before personnel access.'
                    : activeCamera.currentRisk === 'HIGH'
                    ? 'Signal machine operator to idle hydraulic boom until worker retreats outside envelope.'
                    : 'Maintain regular continuous optical perimeter scanning.'}
                </p>
              </div>
            </div>
          </div>

          {/* Virtual Zones Configured */}
          <div className="vg-card p-4">
            <h2 className="text-sm font-semibold text-slate-900 pb-2 border-b border-slate-200">
              Virtual Restricted Zones
            </h2>
            <div className="mt-3 space-y-2 text-xs">
              {activeCamera.zones && activeCamera.zones.length > 0 ? (
                activeCamera.zones.map((z) => (
                  <div key={z.id} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                    <div>
                      <span className="font-medium text-slate-800 block">{z.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{z.type}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      z.status === 'BREACHED'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {z.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-xs">No virtual zones configured on this sensor.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Camera Selection Multi-Grid (All Available Streams) */}
      <div className="vg-card p-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">All Job Site CCTV Feeds ({cameras.length})</h2>
            <p className="text-[11px] text-slate-500">Select any stream card to switch main viewport and view telemetry.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mt-4">
          {cameras.map((c) => {
            const isSelected = c.id === selectedCameraId;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCameraId(c.id)}
                className={`border rounded overflow-hidden text-left flex flex-col transition-all ${
                  isSelected
                    ? 'border-sky-600 ring-2 ring-sky-600/30 bg-sky-50/40'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="relative aspect-video bg-slate-900">
                  <img
                    src={c.feedUrl}
                    alt={c.name}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute top-1 left-1 bg-slate-900/80 px-1 rounded text-[9px] font-mono text-emerald-400">
                    ● LIVE
                  </div>
                  <div className="absolute top-1 right-1">
                    <RiskBadge level={c.currentRisk} size="sm" />
                  </div>
                </div>

                <div className="p-2 flex-1 flex flex-col justify-between text-xs">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-[11px] truncate">{c.name}</h3>
                    <p className="text-[10px] text-slate-500 truncate">{c.site}</p>
                  </div>
                  <div className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>{c.id}</span>
                    <span className="font-mono">{c.fps} FPS</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
};

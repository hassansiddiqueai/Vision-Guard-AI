import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Radio,
  Plus,
  X,
  Volume2,
  VolumeX,
  Camera as SnapshotIcon,
  CheckCircle2,
  Sliders,
  Activity,
  AlertCircle,
  Video,
  Server,
  Zap
} from 'lucide-react';
import { useInspections } from '../context/InspectionContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { IncidentModal } from '../components/common/IncidentModal';

export const LiveMonitoringPage = () => {
  const [searchParams] = useSearchParams();
  const {
    cameras,
    addCamera,
    testCameraConnection,
    selectedSite,
    sites,
    incidents,
    runSafetyScenario,
    isAudioMuted,
    setIsAudioMuted,
  } = useInspections();

  const [selectedCameraId, setSelectedCameraId] = useState(
    searchParams.get('camera') || 'CAM-001'
  );
  const [viewMode, setViewMode] = useState('DETAIL'); // 'GRID' | 'DETAIL'
  const [isPlaying, setIsPlaying] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [showBoxes, setShowBoxes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showAddCameraModal, setShowAddCameraModal] = useState(false);

  // Add Camera Form State
  const [newCamera, setNewCamera] = useState({
    name: '',
    site: sites[0]?.name || 'Apex Tower Project',
    type: 'RTSP Stream',
    rtspUrl: 'rtsp://192.168.1.120:554/live/ch0',
    username: 'admin',
    password: '••••••••',
    location: 'Tower Perimeter Level 4',
    resolution: '1080p (FHD)',
  });
  const [isTestingConn, setIsTestingConn] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Sync selected camera from URL query if present
  useEffect(() => {
    const qCam = searchParams.get('camera');
    if (qCam) {
      setSelectedCameraId(qCam);
      setViewMode('DETAIL');
    }
  }, [searchParams]);

  // Filtered cameras based on global site filter
  const visibleCameras = selectedSite === 'All Sites'
    ? cameras
    : cameras.filter((c) => c.site === selectedSite);

  const activeCamera =
    visibleCameras.find((c) => c.id === selectedCameraId) ||
    visibleCameras[0] ||
    cameras[0];

  // Simulated live clock
  const [liveClock, setLiveClock] = useState(new Date().toLocaleTimeString('en-US', { hour12: false }));
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(new Date().toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTestConnection = async () => {
    setIsTestingConn(true);
    setTestResult(null);
    const res = await testCameraConnection({ url: newCamera.rtspUrl });
    setIsTestingConn(false);
    setTestResult(res);
  };

  const handleAddCameraSubmit = (e) => {
    e.preventDefault();
    const created = addCamera({
      name: newCamera.name || `CCTV Stream ${newCamera.location}`,
      site: newCamera.site,
      location: newCamera.location,
      type: newCamera.type,
      resolution: newCamera.resolution,
      feedUrl: newCamera.type === 'Webcam' ? 'WEBCAM' : 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop',
    });
    setShowAddCameraModal(false);
    setSelectedCameraId(created.id);
    setViewMode('DETAIL');
  };

  const handleSnapshot = () => {
    alert(`[CAMERA SNAPSHOT CAPTURED] High-res frame recorded for ${activeCamera.id} (${activeCamera.name}) with timestamp ${liveClock}. Saved to Evidence Vault.`);
  };

  const activeCamIncident = incidents.find(
    (inc) => inc.camera?.includes(activeCamera.id) && inc.status !== 'CLOSED'
  ) || incidents.find((inc) => inc.camera?.includes(activeCamera.id));

  return (
    <div className="space-y-6">
      {/* Top Header & Operational Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Live CCTV Operations & Computer Vision Control
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              CV ENGINE ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time optical stream ingestion, boundary intrusion detection, PPE compliance classification, and risk tagging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-md border border-slate-300 bg-white p-0.5 text-xs">
            <button
              onClick={() => setViewMode('GRID')}
              className={`px-2.5 py-1 rounded font-semibold transition ${
                viewMode === 'GRID' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              4-Grid Matrix
            </button>
            <button
              onClick={() => setViewMode('DETAIL')}
              className={`px-2.5 py-1 rounded font-semibold transition ${
                viewMode === 'DETAIL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Focus Inspection
            </button>
          </div>

          {/* Add Camera Button */}
          <button
            onClick={() => setShowAddCameraModal(true)}
            className="vg-btn-primary text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Camera</span>
          </button>
        </div>
      </div>

      {/* 4-COLUMN RESPONSIVE GRID VIEW */}
      {viewMode === 'GRID' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleCameras.map((cam) => {
              const matchingIncident = incidents.find(
                (inc) => inc.camera?.includes(cam.id) && inc.status !== 'CLOSED'
              ) || incidents.find((inc) => inc.camera?.includes(cam.id));

              return (
                <div
                  key={cam.id}
                  className={`border rounded-md overflow-hidden bg-white shadow-xs flex flex-col justify-between transition cursor-pointer ${
                    cam.id === selectedCameraId
                      ? 'border-sky-600 ring-1 ring-sky-600'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => {
                    setSelectedCameraId(cam.id);
                    setViewMode('DETAIL');
                  }}
                >
                  {/* Top Meta Bar */}
                  <div className="px-3 py-1.5 bg-slate-900 text-white flex items-center justify-between text-[11px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold text-emerald-300">LIVE</span>
                      <span className="text-slate-400">&bull;</span>
                      <span className="font-bold text-white">{cam.id}</span>
                    </div>
                    <span className="text-slate-400 text-[10px]">{cam.fps} FPS</span>
                  </div>

                  {/* Video Viewport */}
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    <img
                      src={cam.feedUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=800&auto=format&fit=crop'}
                      alt={cam.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Detection Overlays */}
                    {cam.currentRisk === 'CRITICAL' || cam.currentRisk === 'HIGH' ? (
                      <div className="absolute inset-0 pointer-events-none p-2">
                        <div className="border border-red-500 bg-red-500/15 rounded absolute left-[20%] top-[15%] w-[45%] h-[60%] flex flex-col justify-between p-1">
                          <span className="bg-red-600 text-white font-mono font-bold text-[8px] px-1 py-0.5 rounded self-start">
                            PERSON &bull; NO HELMET 94%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 pointer-events-none p-2">
                        <div className="border border-emerald-500 bg-emerald-500/10 rounded absolute left-[25%] top-[20%] w-[35%] h-[55%] flex flex-col justify-between p-1">
                          <span className="bg-emerald-700 text-white font-mono font-bold text-[8px] px-1 py-0.5 rounded self-start">
                            PERSON &bull; PPE COMPLIANT 98%
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="absolute top-2 right-2">
                      <RiskBadge level={cam.currentRisk} size="sm" />
                    </div>

                    <div className="absolute bottom-1 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded">
                      <span className="truncate">{cam.siteCode || 'SITE'}</span>
                      <span className="text-emerald-400 font-bold">ONLINE</span>
                    </div>
                  </div>

                  {/* Card Info & Bottom Stats */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-bold text-xs text-slate-900 truncate">{cam.name}</h3>
                      <p className="text-[11px] text-slate-500 truncate">{cam.site}</p>
                    </div>

                    <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-700 space-y-0.5">
                      <div className="flex justify-between">
                        <span>7 people detected</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>
                          {cam.currentRisk === 'CRITICAL' ? '5 PPE compliant, 1 violation' : '7 PPE compliant'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCameraId(cam.id);
                          setViewMode('DETAIL');
                        }}
                        className="flex-1 py-1 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-300 transition text-center"
                      >
                        OPEN CAMERA
                      </button>
                      {matchingIncident && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIncident(matchingIncident);
                          }}
                          className="py-1 px-2 rounded bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold border border-red-200 transition"
                        >
                          VIEW INCIDENT
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FOCUS INSPECTION & CAMERA DETAIL VIEW */}
      {viewMode === 'DETAIL' && activeCamera && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Live Stream Viewport (2 Columns) */}
          <div className={`lg:col-span-2 vg-card overflow-hidden flex flex-col ${
            isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-black' : ''
          }`}>
            {/* Stream Top Control Header */}
            <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between text-white text-xs border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> LIVE
                </span>
                <span className="font-bold text-white text-sm">{activeCamera.id}</span>
                <span className="text-slate-300 truncate max-w-[200px]">{activeCamera.name}</span>
                <span className="text-slate-400 text-[11px] font-mono">&bull; {activeCamera.site}</span>
              </div>

              <div className="flex items-center gap-2 font-mono">
                <span className="text-slate-400 text-xs hidden sm:inline">{liveClock}</span>
                <RiskBadge level={activeCamera.currentRisk} size="sm" />
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1 rounded text-slate-400 hover:text-white transition"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Live Video Frame with Detection Overlays */}
            <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden select-none">
              <img
                src={activeCamera.feedUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop'}
                alt={activeCamera.name}
                className={`w-full h-full object-cover transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-70'}`}
              />

              {/* Overlaid Virtual Zones */}
              {showZones && activeCamera.zones && (
                <div className="absolute inset-0 pointer-events-none">
                  {activeCamera.zones.map((zone, idx) => (
                    <div
                      key={zone.id}
                      className="absolute border-2 border-dashed border-red-500 bg-red-500/10 rounded p-1.5"
                      style={{
                        top: idx === 0 ? '15%' : '45%',
                        left: idx === 0 ? '18%' : '52%',
                        width: idx === 0 ? '38%' : '40%',
                        height: idx === 0 ? '55%' : '45%',
                      }}
                    >
                      <span className="bg-red-600 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded">
                        ZONE: {zone.name} ({zone.status})
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Overlaid AI Detection Bounding Boxes */}
              {showBoxes && (
                <div className="absolute inset-0 pointer-events-none p-4">
                  {activeCamera.currentRisk === 'CRITICAL' || activeCamera.currentRisk === 'HIGH' ? (
                    <>
                      <div className="border-2 border-red-500 bg-red-500/15 rounded absolute left-[22%] top-[20%] w-[32%] h-[58%] flex flex-col justify-between p-1.5 animate-pulse">
                        <div className="flex flex-col gap-1 self-start">
                          <span className="bg-red-600 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded">
                            PERSON &bull; NO HELMET 94%
                          </span>
                          <span className="bg-amber-600 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded">
                            RESTRICTED ZONE BREACH 88%
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-red-300 bg-slate-950/80 px-1 rounded self-start">
                          ID: TRK-084 &bull; RISK: CRITICAL
                        </span>
                      </div>

                      <div className="border border-emerald-500 bg-emerald-500/10 rounded absolute left-[60%] top-[30%] w-[26%] h-[50%] flex flex-col justify-between p-1.5">
                        <span className="bg-emerald-700 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded self-start">
                          PERSON &bull; PPE OK 96%
                        </span>
                        <span className="text-[9px] font-mono text-emerald-300 bg-slate-950/80 px-1 rounded self-start">
                          ID: TRK-085 &bull; COMPLIANT
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="border border-emerald-500 bg-emerald-500/10 rounded absolute left-[30%] top-[25%] w-[38%] h-[55%] flex flex-col justify-between p-1.5">
                      <span className="bg-emerald-700 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded self-start">
                        PERSON &bull; PPE COMPLIANT 98%
                      </span>
                      <span className="text-[9px] font-mono text-emerald-300 bg-slate-950/80 px-1 rounded self-start">
                        SAFE &bull; HARDHAT + VEST VERIFIED
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Feed Stream Status Badge */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono text-white flex items-center gap-2 border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>RTSP/H.264 &bull; 1080p &bull; 84ms Latency</span>
              </div>
            </div>

            {/* Bottom Stream Control Strip */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1 font-mono transition"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Resume'}</span>
                </button>

                <button
                  onClick={() => setIsAudioMuted(!isAudioMuted)}
                  className={`p-1.5 rounded border transition flex items-center gap-1 font-mono ${
                    isAudioMuted
                      ? 'bg-slate-800 text-slate-400 border-slate-700'
                      : 'bg-sky-900/60 text-sky-300 border-sky-600'
                  }`}
                  title={isAudioMuted ? 'Unmute Audio Chime' : 'Mute Audio Chime'}
                >
                  {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isAudioMuted ? 'Muted' : 'Audio ON'}</span>
                </button>

                <button
                  onClick={handleSnapshot}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1 font-mono transition"
                  title="Capture High-Res Evidence Snapshot"
                >
                  <SnapshotIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Snapshot</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBoxes(!showBoxes)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition border ${
                    showBoxes
                      ? 'bg-sky-700 text-white border-sky-600'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  AI Overlays: {showBoxes ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => setShowZones(!showZones)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition border ${
                    showZones
                      ? 'bg-sky-700 text-white border-sky-600'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Zones: {showZones ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Telemetry, AI Classification, & Testing Trigger */}
          <div className="space-y-4">
            {/* Camera Diagnostics Card */}
            <div className="vg-card p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-700" />
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                    Live Stream Diagnostics
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ● ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Resolution</span>
                  <span className="font-bold font-mono text-slate-800">{activeCamera.resolution || '1080p (FHD)'}</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Stream FPS</span>
                  <span className="font-bold font-mono text-slate-800">{activeCamera.fps} Frames/Sec</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Target Latency</span>
                  <span className="font-bold font-mono text-slate-800">84ms (Measured)</span>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Personnel</span>
                  <span className="font-bold font-mono text-slate-800">7 Tracked</span>
                </div>
              </div>

              {/* Compliance & Current Risk */}
              <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">PPE Compliance Index</span>
                  <span className="font-mono font-bold text-slate-900">
                    {activeCamera.currentRisk === 'CRITICAL' ? '82.4%' : '98.5%'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded h-1.5">
                  <div
                    className={`h-1.5 rounded ${
                      activeCamera.currentRisk === 'CRITICAL' ? 'bg-red-600 w-[82%]' : 'bg-emerald-600 w-[98%]'
                    }`}
                  />
                </div>
              </div>

              {/* Attached Incident Button if any */}
              {activeCamIncident && (
                <button
                  onClick={() => setSelectedIncident(activeCamIncident)}
                  className="w-full py-2 px-3 rounded bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Inspect Active Incident ({activeCamIncident.id})</span>
                </button>
              )}
            </div>

            {/* Quick Simulation Trigger Toolbar */}
            <div className="vg-card p-4 space-y-2.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  Simulated Detection Triggers
                </span>
                <span className="text-[10px] font-mono text-slate-400">TEST CONTROLS</span>
              </div>

              <p className="text-[11px] text-slate-500">
                Inject verified test scenarios to evaluate hazard bounding boxes, real-time audio sirens, and incident creation.
              </p>

              <div className="space-y-1.5">
                <button
                  onClick={() => runSafetyScenario('ppe-violation')}
                  className="w-full text-left p-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 transition flex items-center justify-between"
                >
                  <span>1. PPE Missing Helmet / Vest</span>
                  <span className="text-[10px] font-mono font-bold text-orange-600">HIGH</span>
                </button>

                <button
                  onClick={() => runSafetyScenario('restricted-zone')}
                  className="w-full text-left p-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 transition flex items-center justify-between"
                >
                  <span>2. Crane Swing Boundary Breach</span>
                  <span className="text-[10px] font-mono font-bold text-red-600">CRITICAL</span>
                </button>

                <button
                  onClick={() => runSafetyScenario('machinery-proximity')}
                  className="w-full text-left p-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 transition flex items-center justify-between"
                >
                  <span>3. Excavator Exclusion Envelope</span>
                  <span className="text-[10px] font-mono font-bold text-orange-600">HIGH</span>
                </button>

                <button
                  onClick={() => runSafetyScenario('possible-fall')}
                  className="w-full text-left p-2 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800 transition flex items-center justify-between"
                >
                  <span>4. Unharnessed Slab Edge Fall</span>
                  <span className="text-[10px] font-mono font-bold text-red-600">CRITICAL</span>
                </button>
              </div>
            </div>

            {/* Camera Switcher Strip */}
            <div className="vg-card p-4 space-y-2">
              <span className="text-xs font-bold text-slate-900 block pb-1 border-b border-slate-200 uppercase tracking-wide">
                Available CCTV Sources ({visibleCameras.length})
              </span>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {visibleCameras.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCameraId(c.id)}
                    className={`w-full text-left p-2 rounded text-xs transition flex items-center justify-between ${
                      c.id === activeCamera.id
                        ? 'bg-sky-50 text-sky-900 border border-sky-300 font-bold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <div className="truncate">
                      <span className="font-mono text-[10px] mr-1.5">{c.id}</span>
                      <span>{c.name}</span>
                    </div>
                    <RiskBadge level={c.currentRisk} size="sm" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD CAMERA MODAL (Requirement 6) */}
      {showAddCameraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden text-slate-800">
            <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-slate-900 text-sm">Add CCTV / IP Camera Stream</h3>
              </div>
              <button
                onClick={() => setShowAddCameraModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCameraSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Camera Name</label>
                  <input
                    type="text"
                    required
                    value={newCamera.name}
                    onChange={(e) => setNewCamera({ ...newCamera, name: e.target.value })}
                    placeholder="e.g. West Perimeter Scaffold"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Monitored Site</label>
                  <select
                    value={newCamera.site}
                    onChange={(e) => setNewCamera({ ...newCamera, site: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-600"
                  >
                    {sites.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Camera Stream Type</label>
                  <select
                    value={newCamera.type}
                    onChange={(e) => setNewCamera({ ...newCamera, type: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-600"
                  >
                    <option value="RTSP Stream">RTSP Stream</option>
                    <option value="IP Camera">IP Camera (H.264/WebRTC)</option>
                    <option value="ONVIF">ONVIF Profile S/T</option>
                    <option value="Webcam">Local USB / Webcam</option>
                    <option value="Demo Video">Demo Video Loop</option>
                    <option value="Upload Video">Upload MP4 Inspection Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Location / Sector</label>
                  <input
                    type="text"
                    value={newCamera.location}
                    onChange={(e) => setNewCamera({ ...newCamera, location: e.target.value })}
                    placeholder="e.g. Zone B Level 6"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-600"
                  />
                </div>
              </div>

              {/* RTSP Fields */}
              {newCamera.type.includes('RTSP') || newCamera.type.includes('IP') || newCamera.type.includes('ONVIF') ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2.5">
                  <span className="font-bold text-slate-900 block text-[11px]">Stream Gateway Credentials</span>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-mono mb-0.5">Stream URL (RTSP / WebRTC)</label>
                    <input
                      type="text"
                      value={newCamera.rtspUrl}
                      onChange={(e) => setNewCamera({ ...newCamera, rtspUrl: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono mb-0.5">Username</label>
                      <input
                        type="text"
                        value={newCamera.username}
                        onChange={(e) => setNewCamera({ ...newCamera, username: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-mono mb-0.5">Password</label>
                      <input
                        type="password"
                        value={newCamera.password}
                        onChange={(e) => setNewCamera({ ...newCamera, password: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-mono text-slate-800"
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 leading-tight">
                    * Browser streams are piped via VisionGuard WebRTC / HLS backend gateway. Raw RTSP packets are transcoded in real-time.
                  </p>
                </div>
              ) : null}

              {/* Test Connection Results */}
              {testResult && (
                <div className={`p-2.5 rounded border text-xs ${
                  testResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <span className="font-bold block">
                    {testResult.success ? '✓ Connection Verified' : '✕ Connection Failed'}
                  </span>
                  <p className="text-[11px] mt-0.5">{testResult.message}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTestingConn}
                  className="px-3 py-1.5 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs transition"
                >
                  {isTestingConn ? 'Testing Stream Handshake...' : 'Test Connection'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCameraModal(false)}
                    className="px-3 py-1.5 text-slate-600 hover:text-slate-800 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="vg-btn-primary text-xs font-bold px-4 py-1.5"
                  >
                    Add Camera Stream
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Incident Modal */}
      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      )}
    </div>
  );
};

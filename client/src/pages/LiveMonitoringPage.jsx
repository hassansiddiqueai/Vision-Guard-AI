import React, { useState, useEffect, useRef } from 'react';
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
  Zap,
  Upload,
  ArrowRight
} from 'lucide-react';
import { useInspections } from '../context/InspectionContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { IncidentModal } from '../components/common/IncidentModal';
import { CameraStreamPlayer } from '../components/camera/CameraStreamPlayer';

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
  const [showZones, setShowZones] = useState(true);
  const [showBoxes, setShowBoxes] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showAddCameraModal, setShowAddCameraModal] = useState(false);

  // Add Camera Form State
  const [newCamera, setNewCamera] = useState({
    name: '',
    site: sites[0]?.name || 'Apex Tower Project',
    type: 'Demo Video', // 'Webcam' | 'Upload Video' | 'Demo Video' | 'HLS/WebRTC' | 'RTSP Stream'
    rtspUrl: 'rtsp://192.168.1.120:554/live/ch0',
    username: 'admin',
    password: '••••••••',
    location: 'Tower Perimeter Level 4',
    resolution: '1080p (FHD)',
    uploadedFileUrl: null,
  });

  const [isTestingConn, setIsTestingConn] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleTestConnection = async () => {
    setIsTestingConn(true);
    setTestResult(null);
    const res = await testCameraConnection({ url: newCamera.rtspUrl });
    setIsTestingConn(false);
    setTestResult(res);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewCamera((prev) => ({
        ...prev,
        uploadedFileUrl: url,
        name: prev.name || file.name.replace(/\.[^/.]+$/, ''),
      }));
      setTestResult({
        success: true,
        message: `Video file "${file.name}" loaded (${(file.size / (1024 * 1024)).toFixed(1)} MB). Ready for real-time computer vision analysis.`,
      });
    }
  };

  const handleAddCameraSubmit = (e) => {
    e.preventDefault();
    let feedUrl = 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop';
    if (newCamera.type === 'Webcam') {
      feedUrl = 'WEBCAM';
    } else if (newCamera.type === 'Upload Video' && newCamera.uploadedFileUrl) {
      feedUrl = newCamera.uploadedFileUrl;
    }

    const created = addCamera({
      name: newCamera.name || `CCTV Stream ${newCamera.location}`,
      site: newCamera.site,
      location: newCamera.location,
      type: newCamera.type,
      resolution: newCamera.resolution,
      feedUrl: feedUrl,
      videoUrl: newCamera.uploadedFileUrl || null,
    });

    setShowAddCameraModal(false);
    setSelectedCameraId(created.id);
    setViewMode('DETAIL');
  };

  const activeCamIncident = incidents.find(
    (inc) => inc.camera?.includes(activeCamera.id) && inc.status !== 'CLOSED'
  ) || incidents.find((inc) => inc.camera?.includes(activeCamera.id));

  return (
    <div className="space-y-6">
      {/* Top Header & Operational Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Live CCTV Operations & Computer Vision Control
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950/80 text-emerald-300 rounded border border-emerald-800 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CV ENGINE ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time optical stream ingestion, boundary intrusion detection, PPE compliance classification, and risk tagging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex rounded-md border border-slate-700 bg-slate-900 p-0.5 text-xs">
            <button
              onClick={() => setViewMode('GRID')}
              className={`px-2.5 py-1 rounded font-semibold transition ${
                viewMode === 'GRID' ? 'bg-sky-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              4-Grid Matrix
            </button>
            <button
              onClick={() => setViewMode('DETAIL')}
              className={`px-2.5 py-1 rounded font-semibold transition ${
                viewMode === 'DETAIL' ? 'bg-sky-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Focus Inspection
            </button>
          </div>

          {/* Camera Install / Discovery Link */}
          <button
            onClick={() => navigate('/camera-install')}
            className="vg-btn-secondary text-xs flex items-center gap-1.5"
            title="Install Hardware Webcam or RTSP Stream"
          >
            <Camera className="w-3.5 h-3.5 text-sky-400" />
            <span>Install Camera</span>
          </button>

          {/* Add Camera Button */}
          <button
            onClick={() => {
              setTestResult(null);
              setShowAddCameraModal(true);
            }}
            className="vg-btn-primary text-xs flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Quick Add</span>
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
                  className={`border rounded-md overflow-hidden bg-[#0F172A] shadow-lg flex flex-col justify-between transition cursor-pointer ${
                    cam.id === selectedCameraId
                      ? 'border-sky-500 ring-1 ring-sky-500'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                  onClick={() => {
                    setSelectedCameraId(cam.id);
                    setViewMode('DETAIL');
                  }}
                >
                  {/* Working Stream Player */}
                  <CameraStreamPlayer
                    camera={cam}
                    isDetailed={false}
                    showOverlays={true}
                    showZones={false}
                  />

                  {/* Card Info & Bottom Stats */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="font-bold text-xs text-white truncate">{cam.name}</h3>
                      <p className="text-[11px] text-slate-400 truncate">{cam.site} &bull; {cam.location}</p>
                    </div>

                    <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-[10px] font-mono text-slate-300 space-y-0.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Detected:</span>
                        <strong className="text-slate-100">7 workers</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">PPE Status:</span>
                        <span className="text-emerald-400 font-semibold">
                          {cam.currentRisk === 'CRITICAL' ? '5 compliant, 1 violation' : '7 fully compliant'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCameraId(cam.id);
                          setViewMode('DETAIL');
                        }}
                        className="flex-1 py-1 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold border border-slate-700 transition text-center"
                      >
                        OPEN CAMERA
                      </button>
                      {matchingIncident && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIncident(matchingIncident);
                          }}
                          className="py-1 px-2 rounded bg-red-950/80 hover:bg-red-900 text-red-300 text-[11px] font-bold border border-red-800 transition"
                        >
                          INCIDENT
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
          <div className="lg:col-span-2 space-y-4">
            <div className="vg-card overflow-hidden border border-slate-800 shadow-2xl">
              {/* Working Camera Player with Controls */}
              <CameraStreamPlayer
                camera={activeCamera}
                isDetailed={true}
                showOverlays={showBoxes}
                showZones={showZones}
              />
            </div>

            {/* Quick Stream Overlays Toggle Strip */}
            <div className="vg-card p-3 flex flex-wrap items-center justify-between gap-2 text-xs border border-slate-800 bg-[#0F172A]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-300 uppercase tracking-wide text-[11px]">Stream Overlays:</span>
                <button
                  onClick={() => setShowBoxes(!showBoxes)}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition border ${
                    showBoxes
                      ? 'bg-sky-700 text-white border-sky-600'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  AI Overlays: {showBoxes ? 'ON' : 'OFF'}
                </button>

                <button
                  onClick={() => setShowZones(!showZones)}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition border ${
                    showZones
                      ? 'bg-sky-700 text-white border-sky-600'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  Virtual Zones: {showZones ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                Source Type: <strong className="text-slate-200">{activeCamera.type || 'Demo Stream'}</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Telemetry, AI Classification, & Testing Trigger */}
          <div className="space-y-4">
            {/* Camera Diagnostics Card */}
            <div className="vg-card p-4 space-y-3 border border-slate-800 bg-[#0F172A]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  <h3 className="font-bold text-white text-xs uppercase tracking-wide">
                    Live Stream Diagnostics
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  ● ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Resolution</span>
                  <span className="font-bold font-mono text-slate-200">{activeCamera.resolution || '1080p (FHD)'}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Stream FPS</span>
                  <span className="font-bold font-mono text-slate-200">30 Frames/Sec</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Target Latency</span>
                  <span className="font-bold font-mono text-slate-200">84ms (Active)</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Personnel</span>
                  <span className="font-bold font-mono text-slate-200">7 Tracked</span>
                </div>
              </div>

              {/* Compliance & Current Risk */}
              <div className="p-3 rounded bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">PPE Compliance Index</span>
                  <span className="font-mono font-bold text-slate-200">
                    {activeCamera.currentRisk === 'CRITICAL' ? '82.4%' : '98.5%'}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded h-1.5">
                  <div
                    className={`h-1.5 rounded ${
                      activeCamera.currentRisk === 'CRITICAL' ? 'bg-red-500 w-[82%]' : 'bg-emerald-500 w-[98%]'
                    }`}
                  />
                </div>
              </div>

              {/* Attached Incident Button if any */}
              {activeCamIncident && (
                <button
                  onClick={() => setSelectedIncident(activeCamIncident)}
                  className="w-full py-2 px-3 rounded bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>Inspect Active Incident ({activeCamIncident.id})</span>
                </button>
              )}
            </div>

            {/* Quick Simulation Trigger Toolbar */}
            <div className="vg-card p-4 space-y-2.5 border border-slate-800 bg-[#0F172A]">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Simulated Detection Triggers
                </span>
                <span className="text-[10px] font-mono text-slate-400">DEMO AI</span>
              </div>

              <div className="space-y-1.5">
                <button
                  onClick={() => runSafetyScenario('ppe-violation')}
                  className="w-full text-left p-2 rounded bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition flex items-center justify-between"
                >
                  <span>1. PPE Missing Helmet / Vest</span>
                  <span className="text-[10px] font-mono font-bold text-orange-400">HIGH</span>
                </button>

                <button
                  onClick={() => runSafetyScenario('restricted-zone')}
                  className="w-full text-left p-2 rounded bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition flex items-center justify-between"
                >
                  <span>2. Crane Swing Boundary Breach</span>
                  <span className="text-[10px] font-mono font-bold text-red-400">CRITICAL</span>
                </button>

                <button
                  onClick={() => runSafetyScenario('machinery-proximity')}
                  className="w-full text-left p-2 rounded bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition flex items-center justify-between"
                >
                  <span>3. Excavator Exclusion Envelope</span>
                  <span className="text-[10px] font-mono font-bold text-orange-400">HIGH</span>
                </button>

                <button
                  onClick={() => runSafetyScenario('possible-fall')}
                  className="w-full text-left p-2 rounded bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition flex items-center justify-between"
                >
                  <span>4. Unharnessed Slab Edge Fall</span>
                  <span className="text-[10px] font-mono font-bold text-red-400">CRITICAL</span>
                </button>
              </div>
            </div>

            {/* Camera Switcher Strip */}
            <div className="vg-card p-4 space-y-2 border border-slate-800 bg-[#0F172A]">
              <span className="text-xs font-bold text-white block pb-1 border-b border-slate-800 uppercase tracking-wide">
                Available CCTV Sources ({visibleCameras.length})
              </span>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {visibleCameras.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCameraId(c.id)}
                    className={`w-full text-left p-2 rounded text-xs transition flex items-center justify-between ${
                      c.id === activeCamera.id
                        ? 'bg-sky-950/80 text-sky-200 border border-sky-600 font-bold'
                        : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <div className="truncate">
                      <span className="font-mono text-[10px] mr-1.5 text-sky-400">{c.id}</span>
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

      {/* ADD CAMERA MODAL */}
      {showAddCameraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0F172A] border border-slate-700 rounded-lg shadow-2xl overflow-hidden text-slate-100">
            <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-white text-sm">Add Camera Feed</h3>
              </div>
              <button
                onClick={() => setShowAddCameraModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCameraSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Camera Name</label>
                  <input
                    type="text"
                    required
                    value={newCamera.name}
                    onChange={(e) => setNewCamera({ ...newCamera, name: e.target.value })}
                    placeholder="e.g. North Gate Camera"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Site</label>
                  <select
                    value={newCamera.site}
                    onChange={(e) => setNewCamera({ ...newCamera, site: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  >
                    {sites.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Source Type Selector Buttons */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Source Type</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {['Webcam', 'Upload Video', 'Demo Video', 'HLS/WebRTC', 'RTSP'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setNewCamera({ ...newCamera, type: st });
                        setTestResult(null);
                      }}
                      className={`py-1.5 px-2 rounded border text-center font-bold text-[11px] transition ${
                        newCamera.type === st || (newCamera.type === 'Demo Feed' && st === 'Demo Video')
                          ? 'bg-sky-700 text-white border-sky-600'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Source Type Panels */}
              {newCamera.type === 'Upload Video' && (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded space-y-2">
                  <span className="font-bold text-slate-200 block text-[11px]">Upload Local MP4/WebM Video</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="video/mp4,video/webm,video/ogg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-3 border-2 border-dashed border-slate-700 hover:border-sky-500 rounded bg-slate-950 text-slate-300 hover:text-sky-300 text-xs font-bold transition flex flex-col items-center justify-center gap-1"
                  >
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span>Choose Video File (MP4, WebM)</span>
                  </button>
                </div>
              )}

              {newCamera.type === 'Webcam' && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded text-emerald-300 space-y-1">
                  <span className="font-bold block text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ● CAMERA READY (Browser Device)
                  </span>
                  <p className="text-[11px] text-emerald-400">
                    Resolution: 1280x720 (HD) &bull; FPS: 30 &bull; Real-time AI processing ready.
                  </p>
                </div>
              )}

              {newCamera.type === 'RTSP' && (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded space-y-2">
                  <span className="font-bold text-slate-200 block text-[11px]">RTSP Stream Gateway</span>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono mb-0.5">Stream URL</label>
                    <input
                      type="text"
                      value={newCamera.rtspUrl}
                      onChange={(e) => setNewCamera({ ...newCamera, rtspUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-slate-200"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={isTestingConn}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-slate-200 font-bold text-xs transition"
                    >
                      {isTestingConn ? 'Testing Handshake...' : 'TEST CONNECTION'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewCamera({ ...newCamera, type: 'Demo Video' });
                        setTestResult({
                          success: true,
                          message: 'Demo stream synced at 30 FPS with sub-100ms latency.',
                        });
                      }}
                      className="px-3 py-1 bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-700 rounded text-xs font-bold transition"
                    >
                      USE DEMO FEED
                    </button>
                  </div>
                </div>
              )}

              {/* Test Result Message */}
              {testResult && (
                <div className={`p-2.5 rounded border text-xs ${
                  testResult.success ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300' : 'bg-red-950/80 border-red-800 text-red-300'
                }`}>
                  <span className="font-bold block">
                    {testResult.success ? '✓ Connection Verified' : '✕ Connection Failed'}
                  </span>
                  <p className="text-[11px] mt-0.5">{testResult.message}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddCameraModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="vg-btn-primary text-xs font-bold px-4 py-1.5"
                >
                  ADD CAMERA
                </button>
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

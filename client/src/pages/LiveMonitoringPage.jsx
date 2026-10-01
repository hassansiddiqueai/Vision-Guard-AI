import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import { DEMO_SCENARIOS, captureEvidenceFrame } from '../services/visionEngine';
import { soundEngine } from '../services/riskEngine';
import {
  Camera,
  Video,
  Play,
  Pause,
  Maximize,
  RefreshCw,
  AlertTriangle,
  Shield,
  CheckCircle2,
  Upload,
  Volume2,
  VolumeX,
  Radio,
  Eye,
  Sliders,
  Sparkles,
  ExternalLink,
  PlusCircle,
  X,
  FileText,
  UserCheck,
} from 'lucide-react';

export const LiveMonitoringPage = () => {
  const navigate = useNavigate();
  const {
    triggerHazardAlert,
    addIncident,
    addEvidence,
    activeAlert,
    dismissActiveAlert,
    isAudioMuted,
    setIsAudioMuted,
  } = useInspections();

  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraStatus, setCameraStatus] = useState('IDLE'); // IDLE, CONNECTING, ACTIVE, ERROR, PAUSED
  const [errorMessage, setErrorMessage] = useState('');
  const [activeScenarioKey, setActiveScenarioKey] = useState('PPE_VIOLATION');
  const [isAnalysisActive, setIsAnalysisActive] = useState(true);
  const [detectionMode, setDetectionMode] = useState('DEMO_MODE'); // LIVE_AI, DEMO_MODE
  const [facingMode, setFacingMode] = useState('user');
  const [capturedEvidence, setCapturedEvidence] = useState(null);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentForm, setIncidentForm] = useState({
    hazard: '',
    severity: 'HIGH',
    assignedTo: 'Site Safety Supervisor',
    correctiveAction: 'Halt worker entry and equip required PPE.',
    site: 'Apex Tower — Zone B',
    location: 'Sector 4 Platform',
  });

  const [fps, setFps] = useState(28);
  const [latency, setLatency] = useState(42);

  const activeScenario = DEMO_SCENARIOS[activeScenarioKey] || DEMO_SCENARIOS.PPE_VIOLATION;

  // Start real browser camera
  const startCamera = async () => {
    setCameraStatus('CONNECTING');
    setErrorMessage('');
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraStatus('ACTIVE');
      setDetectionMode('LIVE_AI');
    } catch (err) {
      console.warn('Camera access error', err);
      setCameraStatus('ERROR');
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Camera permission was denied. Please allow camera access in browser settings or use Demo Mode / Upload.'
          : 'Camera device unavailable or not found. Fallback to Demo Simulation or sample upload below.'
      );
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraStatus('IDLE');
    setDetectionMode('DEMO_MODE');
  };

  // Switch camera front/back
  const switchCamera = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    if (cameraStatus === 'ACTIVE') {
      setTimeout(() => startCamera(), 100);
    }
  };

  // Fullscreen viewport
  const toggleFullscreen = () => {
    const el = document.getElementById('inspection-viewport');
    if (el) {
      if (!document.fullscreenElement) {
        el.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Trigger scenario
  const handleSelectScenario = (key) => {
    setActiveScenarioKey(key);
    const scenario = DEMO_SCENARIOS[key];
    if (scenario && scenario.riskLevel !== 'SAFE' && isAnalysisActive) {
      triggerHazardAlert({
        hazard: scenario.title,
        severity: scenario.riskLevel,
        riskScore: scenario.riskScore,
        description: scenario.description,
        evidenceImage: capturedEvidence || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=600&auto=format&fit=crop',
        site: 'Apex Tower — Zone B',
        location: 'Sector 4 Platform',
      });
    }
  };

  // Capture snapshot
  const handleCaptureEvidence = () => {
    let img = null;
    if (cameraStatus === 'ACTIVE' && videoRef.current) {
      img = captureEvidenceFrame(videoRef.current);
    }
    if (!img) {
      img = 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1000&auto=format&fit=crop';
    }
    setCapturedEvidence(img);

    addEvidence({
      hazard: activeScenario.title,
      severity: activeScenario.riskLevel,
      confidence: activeScenario.detections[0]?.confidence || 95,
      camera: cameraStatus === 'ACTIVE' ? 'LIVE-WEBCAM-01' : 'CAM-01 (Apex Tower)',
      location: 'Sector 4 Scaffolding Platform',
      imageUrl: img,
    });
  };

  // Open Incident Creation Modal
  const handleOpenIncidentModal = () => {
    setIncidentForm({
      hazard: activeAlert?.hazard || activeScenario.title,
      severity: activeAlert?.severity || activeScenario.riskLevel,
      assignedTo: 'Site Safety Supervisor',
      correctiveAction: activeScenario.detections[0]?.recommendedAction || 'Inspect work area and verify PPE.',
      site: 'Apex Tower — Zone B',
      location: 'Sector 4 Platform',
    });
    setShowIncidentModal(true);
  };

  const handleSaveIncident = (e) => {
    e.preventDefault();
    addIncident({
      hazard: incidentForm.hazard,
      severity: incidentForm.severity,
      riskScore: activeScenario.riskScore,
      site: incidentForm.site,
      location: incidentForm.location,
      assignedTo: incidentForm.assignedTo,
      correctiveAction: incidentForm.correctiveAction,
      evidenceImage: capturedEvidence || 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=600&auto=format&fit=crop',
      dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16).replace('T', ' '),
    });
    setShowIncidentModal(false);
    dismissActiveAlert();
    navigate('/incidents');
  };

  // Simulation telemetry fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAnalysisActive) {
        setFps(27 + Math.floor(Math.random() * 5));
        setLatency(38 + Math.floor(Math.random() * 12));
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [isAnalysisActive]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>Computer Vision Surveillance</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                detectionMode === 'LIVE_AI'
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}
            >
              {detectionMode === 'LIVE_AI' ? 'LIVE AI WEBCAM' : 'DEMO SIMULATION MODE'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Live Camera Inspection & Hazard Diagnostics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time optical object detection, PPE compliance verification, and instant risk scoring.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAudioMuted(soundEngine.toggleMute())}
            className={`p-2 rounded-lg border text-xs transition ${
              isAudioMuted
                ? 'bg-slate-900 border-slate-700 text-slate-400'
                : 'bg-sky-500/10 border-sky-500/30 text-sky-400'
            }`}
            title={isAudioMuted ? 'Unmute alert chimes' : 'Mute alert chimes'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {cameraStatus !== 'ACTIVE' ? (
            <button
              onClick={startCamera}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition shadow-sm"
            >
              <Camera className="w-4 h-4" />
              <span>Connect Camera</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs transition"
            >
              <Pause className="w-4 h-4" />
              <span>Stop Camera</span>
            </button>
          )}

          <button
            onClick={handleCaptureEvidence}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-semibold text-xs transition"
          >
            <Eye className="w-4 h-4 text-sky-400" />
            <span>Capture Evidence</span>
          </button>

          <Link
            to="/inspections/new"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-semibold text-xs transition"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Start Inspection</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Viewport + Risk Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Video Viewport & Scenarios */}
        <div className="lg:col-span-8 space-y-4">
          {/* Inspection Viewport Container */}
          <div
            id="inspection-viewport"
            className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center group select-none"
          >
            {/* Live Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${cameraStatus === 'ACTIVE' ? 'block' : 'hidden'}`}
            />

            {/* Fallback Simulation Background Image */}
            {cameraStatus !== 'ACTIVE' && (
              <img
                src="https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop"
                alt="Scaffold Simulation"
                className="w-full h-full object-cover opacity-80"
              />
            )}

            {/* Viewfinder Crosshairs */}
            <div className="absolute inset-0 pointer-events-none border border-slate-700/30">
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-sky-400" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-sky-400" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-sky-400" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-sky-400" />
            </div>

            {/* Top Telemetry HUD */}
            <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent flex items-center justify-between font-mono text-[11px] text-slate-200 pointer-events-none">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  {cameraStatus === 'ACTIVE' ? 'LIVE CAMERA' : 'SIMULATION'}
                </span>
                <span className="font-bold text-white tracking-wide">
                  {cameraStatus === 'ACTIVE' ? 'USB / INTEGRATED OPTICS' : 'CAM-01 (Apex Tower Zone B)'}
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <span>1280 × 720</span>
                <span>{fps} FPS</span>
                <span className="text-sky-400 font-bold">{latency}ms</span>
              </div>
            </div>

            {/* Dynamic Bounding Boxes Overlay */}
            {isAnalysisActive &&
              activeScenario.detections.map((det) => {
                const isCritical = det.severity === 'CRITICAL';
                const isHigh = det.severity === 'HIGH';
                const isSafe = det.severity === 'SAFE';

                return (
                  <div
                    key={det.id}
                    className={`absolute pointer-events-none rounded transition-all duration-300 border-2 ${
                      isCritical
                        ? 'border-rose-500 bg-rose-500/10'
                        : isHigh
                        ? 'border-amber-500 bg-amber-500/10'
                        : isSafe
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-cyan-500 bg-cyan-500/10'
                    }`}
                    style={{
                      top: `${det.box.top}%`,
                      left: `${det.box.left}%`,
                      width: `${det.box.width}%`,
                      height: `${det.box.height}%`,
                    }}
                  >
                    {/* Bounding Box Label Badge */}
                    <div
                      className={`absolute -top-6 left-0 px-2 py-0.5 font-mono text-[10px] font-bold rounded flex items-center gap-1.5 shadow ${
                        isCritical
                          ? 'bg-rose-600 text-white'
                          : isHigh
                          ? 'bg-amber-600 text-slate-950'
                          : isSafe
                          ? 'bg-emerald-600 text-white'
                          : 'bg-cyan-600 text-slate-950'
                      }`}
                    >
                      <span>{det.label}</span>
                      <span>[{det.confidence}%]</span>
                    </div>
                  </div>
                );
              })}

            {/* Camera Error / Denied Fallback Banner */}
            {cameraStatus === 'ERROR' && (
              <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center p-6 text-center z-10 space-y-3">
                <AlertTriangle className="w-12 h-12 text-amber-400" />
                <h3 className="text-base font-bold text-white">Camera Unavailable</h3>
                <p className="text-xs text-slate-400 max-w-md">{errorMessage}</p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={startCamera}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
                  >
                    Retry Permission
                  </button>
                  <button
                    onClick={() => {
                      setCameraStatus('IDLE');
                      setDetectionMode('DEMO_MODE');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-slate-950 transition"
                  >
                    Switch to Demo Mode
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Stream Telemetry Bar */}
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-slate-950/90 via-slate-950/70 to-transparent flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-slate-400">ANALYSIS:</span>
                <span className={isAnalysisActive ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                  {isAnalysisActive ? 'ACTIVE' : 'PAUSED'}
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">SCENARIO:</span>
                <span className="text-sky-400 font-bold">{activeScenario.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAnalysisActive(!isAnalysisActive)}
                  className="px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700 hover:border-sky-400 text-slate-200 text-[11px] transition"
                >
                  {isAnalysisActive ? 'Pause Inference' : 'Resume Inference'}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-1 rounded bg-slate-900/90 border border-slate-700 hover:border-sky-400 text-slate-200 text-[11px] transition"
                  title="Fullscreen"
                >
                  <Maximize className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Hackathon Deterministic Demo Scenarios Bar */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-wider">
                  Hackathon Demo Scenarios (Deterministic CV Simulation)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">6 Scenarios</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {Object.keys(DEMO_SCENARIOS).map((key) => {
                const scen = DEMO_SCENARIOS[key];
                const isSelected = activeScenarioKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectScenario(key)}
                    className={`p-2 rounded-lg border text-left text-xs transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-sky-400 ring-1 ring-sky-400/40 text-white font-semibold'
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-[10px] font-mono truncate mb-1">
                      {scen.category}
                    </span>
                    <span className="text-[11px] font-medium leading-tight truncate">
                      {scen.title.split(' ')[0]} {scen.title.split(' ')[1]}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold mt-1.5 ${
                        scen.riskLevel === 'CRITICAL'
                          ? 'text-rose-400'
                          : scen.riskLevel === 'HIGH'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {scen.riskLevel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Live Risk Monitor & Active Detections */}
        <div className="lg:col-span-4 space-y-4">
          {/* Overall Risk Score HUD */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">Live Risk Monitor</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-850">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block">Overall Risk Score</span>
                <span
                  className={`text-2xl font-bold font-mono ${
                    activeScenario.riskScore > 80
                      ? 'text-rose-400'
                      : activeScenario.riskScore > 50
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {activeScenario.riskScore} <span className="text-xs text-slate-400 font-sans">/ 100</span>
                </span>
              </div>

              <span
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                  activeScenario.riskLevel === 'CRITICAL'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    : activeScenario.riskLevel === 'HIGH'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {activeScenario.riskLevel}
              </span>
            </div>

            {/* Active Detections List */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase text-slate-400 block">Active Optical Detections</span>
              {activeScenario.detections.map((det) => (
                <div
                  key={det.id}
                  className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{det.label}</span>
                    <span className="font-mono text-sky-400 font-bold text-[11px]">{det.confidence}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{det.evidence}</p>
                  <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-900 flex justify-between">
                    <span>{det.complianceRef}</span>
                    <span
                      className={
                        det.severity === 'CRITICAL'
                          ? 'text-rose-400 font-bold'
                          : det.severity === 'HIGH'
                          ? 'text-amber-400 font-bold'
                          : 'text-emerald-400 font-bold'
                      }
                    >
                      {det.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleOpenIncidentModal}
                className="w-full py-2 px-3 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Create Incident Record</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Alert Modal Popup */}
      {activeAlert && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-rose-500/50 shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 animate-pulse">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-rose-400 font-bold tracking-wider uppercase block">
                    CRITICAL SAFETY ALERT
                  </span>
                  <h3 className="text-base font-bold text-white">{activeAlert.hazard}</h3>
                </div>
              </div>

              <button
                onClick={dismissActiveAlert}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
              {activeAlert.description}
            </p>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 p-2 rounded-lg bg-slate-950 border border-slate-850">
              <span>RISK SCORE: <strong className="text-rose-400">{activeAlert.riskScore || 92}/100</strong></span>
              <span>LOCATION: <strong className="text-slate-200">{activeAlert.location || 'Sector 4'}</strong></span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={dismissActiveAlert}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Acknowledge
              </button>
              <button
                onClick={handleOpenIncidentModal}
                className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Create Incident & Assign</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incident Creation Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Create Safety Incident</h3>
              <button
                onClick={() => setShowIncidentModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveIncident} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Hazard Title</label>
                <input
                  type="text"
                  value={incidentForm.hazard}
                  onChange={(e) => setIncidentForm({ ...incidentForm, hazard: e.target.value })}
                  required
                  className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Severity</label>
                  <select
                    value={incidentForm.severity}
                    onChange={(e) => setIncidentForm({ ...incidentForm, severity: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Site / Zone</label>
                  <input
                    type="text"
                    value={incidentForm.site}
                    onChange={(e) => setIncidentForm({ ...incidentForm, site: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Assigned Personnel</label>
                <input
                  type="text"
                  value={incidentForm.assignedTo}
                  onChange={(e) => setIncidentForm({ ...incidentForm, assignedTo: e.target.value })}
                  className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Mandated Corrective Action</label>
                <textarea
                  rows={2}
                  value={incidentForm.correctiveAction}
                  onChange={(e) => setIncidentForm({ ...incidentForm, correctiveAction: e.target.value })}
                  className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold"
                >
                  Save & Assign Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

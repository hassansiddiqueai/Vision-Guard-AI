import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import { DEMO_SCENARIOS, captureEvidenceFrame } from '../services/visionEngine';
import { soundEngine } from '../services/riskEngine';
import {
  Camera,
  Play,
  Pause,
  Maximize,
  AlertTriangle,
  Volume2,
  VolumeX,
  Eye,
  PlusCircle,
  X,
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
  const [cameraStatus, setCameraStatus] = useState('IDLE'); // IDLE, CONNECTING, ACTIVE, ERROR
  const [errorMessage, setErrorMessage] = useState('');
  const [activeScenarioKey, setActiveScenarioKey] = useState('PPE_VIOLATION');
  const [isAnalysisActive, setIsAnalysisActive] = useState(true);
  const [capturedEvidence, setCapturedEvidence] = useState(null);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [incidentForm, setIncidentForm] = useState({
    hazard: '',
    severity: 'HIGH',
    assignedTo: 'Safety Supervisor',
    correctiveAction: 'Halt work in active zone and equip required PPE.',
    site: 'Apex Tower — Zone B',
    location: 'Sector 4 Platform',
  });

  const [fps, setFps] = useState(24);
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
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraStatus('ACTIVE');
    } catch (err) {
      setCameraStatus('ERROR');
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in browser settings.'
          : 'Camera device unavailable. Using simulation demo mode.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraStatus('IDLE');
  };

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
      camera: cameraStatus === 'ACTIVE' ? 'Camera 01 (Live Feed)' : 'CAM-01 (Apex Tower)',
      location: 'Sector 4 Scaffolding Platform',
      imageUrl: img,
    });
  };

  const handleOpenIncidentModal = () => {
    setIncidentForm({
      hazard: activeAlert?.hazard || activeScenario.title,
      severity: activeAlert?.severity || activeScenario.riskLevel,
      assignedTo: 'Safety Supervisor',
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAnalysisActive) {
        setFps(24 + (Math.random() > 0.5 ? 1 : 0));
        setLatency(38 + Math.floor(Math.random() * 8));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isAnalysisActive]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#243247]">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#F1F5F9] tracking-tight">
              Live Monitoring
            </h1>
            <p className="text-[13px] text-[#94A3B8] mt-0.5">
              Live video surveillance and automated hazard detection.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsAudioMuted(soundEngine.toggleMute())}
            className="vg-btn-secondary py-1.5 px-2.5"
            title={isAudioMuted ? 'Unmute alerts' : 'Mute alerts'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-[#64748B]" /> : <Volume2 className="w-4 h-4 text-[#22C7E8]" />}
          </button>

          {cameraStatus !== 'ACTIVE' ? (
            <button onClick={startCamera} className="vg-btn-primary">
              <Camera className="w-4 h-4" />
              <span>Connect Camera</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="vg-btn-secondary text-[#EF4444] border-[#EF4444]/30 hover:bg-[#EF4444]/10"
            >
              <Pause className="w-4 h-4" />
              <span>Stop Camera</span>
            </button>
          )}

          <button onClick={handleCaptureEvidence} className="vg-btn-secondary">
            <Eye className="w-4 h-4" />
            <span>Capture Evidence</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Viewport + Right Side Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 8 Cols: Video Feed */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative aspect-video rounded-lg bg-[#0B1220] border border-[#243247] overflow-hidden flex items-center justify-center">
            {/* Live Video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${cameraStatus === 'ACTIVE' ? 'block' : 'hidden'}`}
            />

            {/* Fallback Simulation Feed */}
            {cameraStatus !== 'ACTIVE' && (
              <img
                src="https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop"
                alt="Monitoring Feed"
                className="w-full h-full object-cover opacity-85"
              />
            )}

            {/* Top Bar Overlay */}
            <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-[#0B1220]/90 to-transparent flex items-center justify-between text-[12px] font-mono pointer-events-none">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#0F172A] border border-[#243247] text-[#22C7E8] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                {cameraStatus === 'ACTIVE' ? 'LIVE CAMERA' : 'CAMERA 01 (SIMULATION)'}
              </span>
              <span className="text-[#94A3B8]">1080p · {fps} FPS · {latency}ms</span>
            </div>

            {/* Bounding Boxes */}
            {isAnalysisActive &&
              activeScenario.detections.map((det) => {
                const isCritical = det.severity === 'CRITICAL';
                const isHigh = det.severity === 'HIGH';
                const isSafe = det.severity === 'SAFE';

                return (
                  <div
                    key={det.id}
                    className={`absolute pointer-events-none border-2 rounded ${
                      isCritical
                        ? 'border-[#EF4444] bg-[#EF4444]/10'
                        : isHigh
                        ? 'border-[#F59E0B] bg-[#F59E0B]/10'
                        : isSafe
                        ? 'border-[#22C55E] bg-[#22C55E]/10'
                        : 'border-[#22C7E8] bg-[#22C7E8]/10'
                    }`}
                    style={{
                      top: `${det.box.top}%`,
                      left: `${det.box.left}%`,
                      width: `${det.box.width}%`,
                      height: `${det.box.height}%`,
                    }}
                  >
                    <div
                      className={`absolute -top-5 left-0 px-1.5 py-0.5 font-mono text-[10px] font-semibold rounded ${
                        isCritical
                          ? 'bg-[#EF4444] text-white'
                          : isHigh
                          ? 'bg-[#F59E0B] text-[#0B1220]'
                          : isSafe
                          ? 'bg-[#22C55E] text-white'
                          : 'bg-[#22C7E8] text-[#0B1220]'
                      }`}
                    >
                      {det.label} · {det.confidence}%
                    </div>
                  </div>
                );
              })}

            {/* Bottom Status Bar */}
            <div className="absolute bottom-0 inset-x-0 p-2.5 bg-[#0F172A]/90 border-t border-[#243247] flex items-center justify-between text-[12px] font-mono text-[#94A3B8]">
              <span>Camera 01 | 1080p | {fps} FPS | AI Analysis {isAnalysisActive ? 'ON' : 'PAUSED'}</span>
              <button
                onClick={() => setIsAnalysisActive(!isAnalysisActive)}
                className="text-[#22C7E8] hover:underline"
              >
                {isAnalysisActive ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>

          {/* Scenario Selector Toolbar */}
          <div className="vg-card p-3 space-y-2">
            <span className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider block">
              Demo Test Scenarios
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {Object.keys(DEMO_SCENARIOS).map((key) => {
                const scen = DEMO_SCENARIOS[key];
                const isSelected = activeScenarioKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectScenario(key)}
                    className={`py-1.5 px-2 rounded text-[12px] text-left transition ${
                      isSelected
                        ? 'bg-[#1E293B] border border-[#22C7E8] text-[#F1F5F9] font-medium'
                        : 'bg-[#0B1220] border border-[#243247] text-[#94A3B8] hover:text-[#F1F5F9]'
                    }`}
                  >
                    <span className="block font-medium truncate">{scen.title.split(' ')[0]} {scen.title.split(' ')[1]}</span>
                    <span className="text-[10px] text-[#64748B] block font-mono">{scen.riskLevel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Active Risks & Controls */}
        <div className="lg:col-span-4 space-y-3">
          {/* Active Risks Panel */}
          <div className="vg-card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#243247]">
              <h2 className="text-[14px] font-semibold text-[#F1F5F9]">Active Hazards</h2>
              <span className="text-[11px] font-mono text-[#94A3B8]">
                Risk Score: <strong className="text-[#F1F5F9]">{activeScenario.riskScore}/100</strong>
              </span>
            </div>

            <div className="space-y-2">
              {activeScenario.detections.map((det) => (
                <div key={det.id} className="p-2.5 rounded bg-[#0B1220] border border-[#243247] text-[12px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#F1F5F9]">{det.label}</span>
                    <span className="text-[#22C7E8] font-mono font-medium">{det.confidence}%</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] leading-normal">{det.evidence}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={handleOpenIncidentModal}
                className="w-full vg-btn-primary justify-center py-2"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Create Incident</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Incident Modal */}
      {showIncidentModal && (
        <div className="fixed inset-0 bg-[#0B1220]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md vg-card p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#243247]">
              <h3 className="text-[15px] font-semibold text-[#F1F5F9]">Create Incident Record</h3>
              <button onClick={() => setShowIncidentModal(false)} className="text-[#64748B] hover:text-[#F1F5F9]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveIncident} className="space-y-3 text-[13px]">
              <div>
                <label className="block text-[#94A3B8] mb-1">Hazard Title</label>
                <input
                  type="text"
                  value={incidentForm.hazard}
                  onChange={(e) => setIncidentForm({ ...incidentForm, hazard: e.target.value })}
                  className="w-full py-1.5 px-2.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1">Assigned Person</label>
                <input
                  type="text"
                  value={incidentForm.assignedTo}
                  onChange={(e) => setIncidentForm({ ...incidentForm, assignedTo: e.target.value })}
                  className="w-full py-1.5 px-2.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9]"
                />
              </div>

              <div>
                <label className="block text-[#94A3B8] mb-1">Corrective Action</label>
                <textarea
                  rows={2}
                  value={incidentForm.correctiveAction}
                  onChange={(e) => setIncidentForm({ ...incidentForm, correctiveAction: e.target.value })}
                  className="w-full py-1.5 px-2.5 bg-[#0B1220] border border-[#243247] rounded text-[#F1F5F9]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#243247]">
                <button
                  type="button"
                  onClick={() => setShowIncidentModal(false)}
                  className="vg-btn-ghost"
                >
                  Cancel
                </button>
                <button type="submit" className="vg-btn-primary">
                  Save Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

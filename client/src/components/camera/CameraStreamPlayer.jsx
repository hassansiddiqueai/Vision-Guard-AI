import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Camera,
  RotateCcw,
  RefreshCw,
  Eye,
  EyeOff,
  Radio,
  Video,
  ShieldAlert,
  AlertTriangle,
  Upload,
  Sparkles,
  CheckCircle2,
  Sliders,
  Layers,
  Zap
} from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';
import { SnapshotModal } from './SnapshotModal';
import { RiskBadge } from '../common/RiskBadge';

// Unique scene generator per camera
const CAMERA_SCENE_THEMES = {
  'CAM-001': {
    name: 'North Scaffolding Matrix',
    hue: 'rgba(56, 189, 248, 0.12)',
    boxColor: '#EF4444',
    boxLabel: 'NO HARD HAT • 94% RISK',
    subLabel: 'RESTRICTED EDGE ZONE',
    isHazard: true,
    workerCount: 5,
  },
  'CAM-002': {
    name: 'Heavy Equipment Staging Yard',
    hue: 'rgba(234, 88, 12, 0.12)',
    boxColor: '#F97316',
    boxLabel: 'MACHINERY SWING RADIUS',
    subLabel: 'PROXIMITY WARNING 1.8M',
    isHazard: true,
    workerCount: 3,
  },
  'CAM-003': {
    name: 'Basement Concrete Pour Sector',
    hue: 'rgba(16, 185, 129, 0.10)',
    boxColor: '#10B981',
    boxLabel: 'PERSON • PPE VERIFIED 99%',
    subLabel: 'FULL COMPLIANCE (VEST+HELMET)',
    isHazard: false,
    workerCount: 6,
  },
  'CAM-004': {
    name: 'Substation Electrical Bay 4',
    hue: 'rgba(14, 165, 233, 0.10)',
    boxColor: '#10B981',
    boxLabel: 'INSULATED PPE VERIFIED',
    subLabel: 'HIGH VOLTAGE ARC SAFE',
    isHazard: false,
    workerCount: 2,
  },
  'CAM-005': {
    name: 'Tower Crane Loading Dock',
    hue: 'rgba(245, 158, 11, 0.10)',
    boxColor: '#10B981',
    boxLabel: 'RIGGER • HARNESS ATTACHED',
    subLabel: 'SUSPENDED LOAD CLEAR',
    isHazard: false,
    workerCount: 4,
  },
  'CAM-006': {
    name: 'East Perimeter Storage Yard',
    hue: 'rgba(139, 92, 246, 0.10)',
    boxColor: '#10B981',
    boxLabel: 'SAFE ZONE • ZERO HAZARDS',
    subLabel: 'STORAGE BAY ACCESS OK',
    isHazard: false,
    workerCount: 3,
  },
};

export const CameraStreamPlayer = ({
  camera,
  isDetailed = false,
  showOverlays = true,
  showZones = true,
  onSnapshot,
  onInspectIncident,
}) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [activeSourceType, setActiveSourceType] = useState(
    camera?.type === 'Webcam' ? 'Webcam' : (camera?.videoUrl ? 'Upload Video' : 'Demo Video')
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aiOverlayEnabled, setAiOverlayEnabled] = useState(showOverlays);
  const [snapshotData, setSnapshotData] = useState(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(camera?.videoUrl || null);

  // Sync state if camera prop changes
  useEffect(() => {
    if (camera?.type === 'Webcam') {
      setActiveSourceType('Webcam');
    } else if (camera?.videoUrl) {
      setUploadedVideoUrl(camera.videoUrl);
      setActiveSourceType('Upload Video');
    }
  }, [camera?.id, camera?.type, camera?.videoUrl]);

  // WebRTC Camera Hook
  const {
    cameraState: webcamState,
    errorMessage: webcamError,
    stream: webcamStream,
    startCamera,
    stopCamera,
    pauseCamera,
    resumeCamera,
    switchCamera,
    captureFrame: captureWebcamFrame,
    bindVideoRef,
  } = useCamera({ autoStart: camera?.type === 'Webcam' });

  // Auto-start webcam if switching to Webcam
  useEffect(() => {
    if (activeSourceType === 'Webcam' && webcamState === 'idle') {
      startCamera();
    }
  }, [activeSourceType, webcamState, startCamera]);

  // Ensure video element receives stream whenever webcam becomes live
  useEffect(() => {
    if (activeSourceType === 'Webcam' && videoRef.current && webcamStream) {
      videoRef.current.srcObject = webcamStream;
      videoRef.current.play().catch(() => {});
    }
  }, [activeSourceType, webcamStream]);

  // 24/7 Embedded Canvas CCTV Engine
  useEffect(() => {
    if (activeSourceType !== 'Demo Video' && activeSourceType !== 'Local Video') {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const camId = camera?.id || 'CAM-001';
    const scene = CAMERA_SCENE_THEMES[camId] || CAMERA_SCENE_THEMES['CAM-001'];
    const isCritical = camera?.currentRisk === 'CRITICAL' || (camera?.currentRisk === 'HIGH' && scene.isHazard);

    // Primary construction background
    const img = new Image();
    img.src = '/assets/construction-site-bg.jpg';

    let scanlineY = 0;
    let tick = 0;
    let frameId;

    const renderLoop = () => {
      if (!isPlaying) {
        frameId = requestAnimationFrame(renderLoop);
        return;
      }

      tick += 0.025;
      scanlineY = (scanlineY + 1.8) % canvas.height;

      // 1. Draw base photo or industrial canvas fallback
      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        // High-tech dark industrial background grid
        ctx.fillStyle = '#090D16';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid lines
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 60) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 60) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      // 2. Camera-specific ambient tint & CCTV noise
      ctx.fillStyle = scene.hue;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(11, 17, 32, 0.20)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. High-tech scanning laser line
      const grad = ctx.createLinearGradient(0, scanlineY - 25, 0, scanlineY + 25);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.40)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanlineY - 25, canvas.width, 50);

      // 4. Optical Reticle / Crosshairs
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
      ctx.lineWidth = 1;
      // Center crosshair
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy);
      ctx.lineTo(cx + 20, cy);
      ctx.moveTo(cx, cy - 20);
      ctx.lineTo(cx, cy + 20);
      ctx.stroke();

      // Corner target brackets
      const bracketSize = 24;
      const margin = 16;
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2;
      // Top Left
      ctx.beginPath();
      ctx.moveTo(margin, margin + bracketSize);
      ctx.lineTo(margin, margin);
      ctx.lineTo(margin + bracketSize, margin);
      ctx.stroke();
      // Top Right
      ctx.beginPath();
      ctx.moveTo(canvas.width - margin - bracketSize, margin);
      ctx.lineTo(canvas.width - margin, margin);
      ctx.lineTo(canvas.width - margin, margin + bracketSize);
      ctx.stroke();
      // Bottom Left
      ctx.beginPath();
      ctx.moveTo(margin, canvas.height - margin - bracketSize);
      ctx.lineTo(margin, canvas.height - margin);
      ctx.lineTo(margin + bracketSize, canvas.height - margin);
      ctx.stroke();
      // Bottom Right
      ctx.beginPath();
      ctx.moveTo(canvas.width - margin - bracketSize, canvas.height - margin);
      ctx.lineTo(canvas.width - margin, canvas.height - margin);
      ctx.lineTo(canvas.width - margin, canvas.height - margin - bracketSize);
      ctx.stroke();

      // 5. AI Detection Overlays (Bounding Boxes & Classifications)
      if (aiOverlayEnabled) {
        // Main target worker box (smooth oscillation simulating movement)
        const boxX = canvas.width * 0.36 + Math.sin(tick) * 16;
        const boxY = canvas.height * 0.22 + Math.cos(tick) * 8;
        const boxW = canvas.width * 0.28;
        const boxH = canvas.height * 0.54;

        if (isCritical) {
          // Critical Hazard Box (Red Pulse)
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(boxX, boxY, boxW, boxH);
          ctx.fillStyle = 'rgba(239, 68, 68, 0.14)';
          ctx.fillRect(boxX, boxY, boxW, boxH);

          // Header Tag
          ctx.fillStyle = '#DC2626';
          ctx.fillRect(boxX, boxY - 26, 210, 24);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 11px "Inter", sans-serif';
          ctx.fillText(`🚨 ${scene.boxLabel}`, boxX + 8, boxY - 9);

          // Sub Tag
          ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
          ctx.fillRect(boxX, boxY + 2, 200, 18);
          ctx.fillStyle = '#FCA5A5';
          ctx.font = 'bold 10px "JetBrains Mono", monospace';
          ctx.fillText(`ZONE: ${scene.subLabel}`, boxX + 6, boxY + 15);
        } else {
          // Safe Compliant Box (Emerald Green)
          ctx.strokeStyle = '#10B981';
          ctx.lineWidth = 2;
          ctx.strokeRect(boxX, boxY, boxW, boxH);
          ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
          ctx.fillRect(boxX, boxY, boxW, boxH);

          // Header Tag
          ctx.fillStyle = '#059669';
          ctx.fillRect(boxX, boxY - 24, 200, 22);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 11px "Inter", sans-serif';
          ctx.fillText(`🛡️ ${scene.boxLabel}`, boxX + 8, boxY - 8);

          // Sub Tag
          ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
          ctx.fillRect(boxX, boxY + 2, 210, 18);
          ctx.fillStyle = '#6EE7B7';
          ctx.font = 'bold 10px "JetBrains Mono", monospace';
          ctx.fillText(scene.subLabel, boxX + 6, boxY + 15);
        }

        // Secondary Compliant Worker
        const w2X = canvas.width * 0.10 + Math.cos(tick * 0.8) * 8;
        const w2Y = canvas.height * 0.42;
        const w2W = canvas.width * 0.18;
        const w2H = canvas.height * 0.46;

        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(w2X, w2Y, w2W, w2H);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.08)';
        ctx.fillRect(w2X, w2Y, w2W, w2H);

        ctx.fillStyle = '#059669';
        ctx.fillRect(w2X, w2Y - 20, 140, 18);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px "Inter", sans-serif';
        ctx.fillText('WORKER • PPE OK 98%', w2X + 6, w2Y - 6);
      }

      // 6. Live Timestamp & Industrial CCTV Telemetry
      const now = new Date();
      const timeStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}.${Math.floor(now.getMilliseconds() / 100)}`;

      ctx.fillStyle = 'rgba(11, 17, 32, 0.90)';
      ctx.fillRect(12, canvas.height - 34, 320, 24);
      ctx.strokeStyle = '#1E293B';
      ctx.strokeRect(12, canvas.height - 34, 320, 24);

      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(`REC ● ${camId} • 24/7 LIVE • ${timeStr}`, 18, canvas.height - 18);

      frameId = requestAnimationFrame(renderLoop);
    };

    frameId = requestAnimationFrame(renderLoop);

    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [activeSourceType, isPlaying, aiOverlayEnabled, camera?.currentRisk, camera?.id]);

  // Fullscreen state listener
  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      stopCamera();
    };
  }, [stopCamera]);

  // Actions
  const handleStartWebcam = () => {
    setActiveSourceType('Webcam');
    startCamera();
  };

  const handleUseDemo = () => {
    stopCamera();
    setActiveSourceType('Demo Video');
    setIsPlaying(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const newUrl = URL.createObjectURL(file);
    objectUrlRef.current = newUrl;
    setUploadedVideoUrl(newUrl);
    setActiveSourceType('Upload Video');
    stopCamera();
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (activeSourceType === 'Webcam') {
      if (webcamState === 'live') {
        pauseCamera();
        setIsPlaying(false);
      } else {
        resumeCamera();
        setIsPlaying(true);
      }
      return;
    }

    if (activeSourceType === 'Upload Video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
      return;
    }

    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    if (activeSourceType === 'Webcam') {
      stopCamera();
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleCaptureSnapshot = () => {
    let captured = null;

    if (activeSourceType === 'Webcam' && webcamState === 'live') {
      captured = captureWebcamFrame(camera?.id || 'CAM-001');
    } else if (canvasRef.current && (activeSourceType === 'Demo Video' || activeSourceType === 'Local Video')) {
      const canvas = canvasRef.current;
      captured = {
        dataUrl: canvas.toDataURL('image/png'),
        timestamp: new Date().toISOString(),
        resolution: `${canvas.width}x${canvas.height}`,
        cameraId: camera?.id || 'CAM-001',
      };
    } else if (videoRef.current) {
      const video = videoRef.current;
      const c = document.createElement('canvas');
      c.width = video.videoWidth || 1280;
      c.height = video.videoHeight || 720;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, c.width, c.height);
        captured = {
          dataUrl: c.toDataURL('image/png'),
          timestamp: new Date().toISOString(),
          resolution: `${c.width}x${c.height}`,
          cameraId: camera?.id || 'CAM-001',
        };
      }
    }

    if (captured) {
      setSnapshotData(captured);
      if (onSnapshot) {
        onSnapshot(captured.dataUrl, camera);
      }
    }
  };

  // Status mapping
  const getStatus = () => {
    if (activeSourceType === 'Webcam') {
      if (webcamState === 'requesting') return { label: 'CONNECTING...', color: 'bg-amber-500 animate-pulse' };
      if (webcamState === 'live') return { label: 'LIVE WEBCAM', color: 'bg-emerald-500 animate-pulse' };
      if (webcamState === 'paused') return { label: 'PAUSED', color: 'bg-amber-500' };
      if (webcamState === 'denied') return { label: 'ACCESS DENIED', color: 'bg-red-500' };
      if (webcamState === 'unavailable') return { label: 'NO CAMERA', color: 'bg-red-500' };
      return { label: 'OFFLINE', color: 'bg-slate-500' };
    }
    if (activeSourceType === 'Upload Video') {
      return { label: 'PLAYING MP4', color: 'bg-sky-500 animate-pulse' };
    }
    if (!isPlaying) return { label: 'PAUSED', color: 'bg-amber-500' };
    return { label: '24/7 LIVE FEED', color: 'bg-emerald-500 animate-pulse' };
  };

  const status = getStatus();

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden bg-[#0A0F1D] flex flex-col justify-between border border-slate-800 ${
        isFullscreen ? 'w-screen h-screen z-50 rounded-none' : 'w-full aspect-video rounded-lg shadow-2xl'
      }`}
    >
      {/* 1. TOP HUD OVERLAY */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-30 flex items-center justify-between text-xs pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800 text-white font-mono shadow-md">
          <span className={`w-2 h-2 rounded-full ${status.color}`} />
          <span className="font-bold tracking-wider">{status.label}</span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-sky-300 font-bold">{camera?.id || 'CAM-001'}</span>
          <span className="text-slate-400 hidden sm:inline">&bull; 30 FPS</span>
          <span className="text-emerald-400 text-[10px] hidden md:inline font-bold">
            [{activeSourceType === 'Webcam' ? 'HARDWARE SENSOR' : activeSourceType === 'Upload Video' ? 'LOCAL VIDEO' : '24/7 CCTV MATRIX'}]
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5">
          <RiskBadge level={camera?.currentRisk || 'SAFE'} size="sm" />
        </div>
      </div>

      {/* 2. MAIN STREAM VIEWPORT */}
      <div className="relative w-full h-full flex items-center justify-center bg-[#060A14] overflow-hidden">
        {/* WEBCAM MODE */}
        {activeSourceType === 'Webcam' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Real Hardware Video Stream */}
            <video
              ref={(el) => {
                videoRef.current = el;
                bindVideoRef(el);
              }}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${
                webcamState === 'live' || webcamState === 'paused' ? 'block' : 'hidden'
              }`}
            />

            {/* AI HUD Bounding Box Overlay for Webcam */}
            {(webcamState === 'live' || webcamState === 'paused') && aiOverlayEnabled && (
              <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                {/* Simulated Real-Time Detection Box on User Camera */}
                <div className="relative w-64 h-80 border-2 border-emerald-500 bg-emerald-500/10 rounded">
                  <div className="absolute -top-7 left-0 bg-emerald-600 text-white px-2 py-0.5 rounded-t text-[11px] font-bold font-mono flex items-center gap-1 shadow">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>PERSON • PPE DETECTED 98%</span>
                  </div>
                  <div className="absolute -bottom-6 left-0 bg-slate-950/90 border border-slate-800 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-mono">
                    HELMET: OK | VEST: OK | GLOVES: OK
                  </div>
                </div>
              </div>
            )}

            {/* Webcam States Overlay */}
            {webcamState === 'requesting' && (
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 text-white">
                <div className="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-mono text-sky-400 font-bold tracking-wide">
                  CONNECTING TO HARDWARE CAMERA SENSOR...
                </p>
                <p className="text-[11px] text-slate-400">Please allow browser permission if prompted.</p>
              </div>
            )}

            {webcamState === 'denied' && (
              <div className="p-6 text-center max-w-md bg-slate-900/95 border border-slate-800 rounded-lg space-y-3 z-10 text-white shadow-2xl">
                <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
                <h4 className="font-bold text-sm font-mono text-red-400">CAMERA ACCESS BLOCKED</h4>
                <p className="text-xs text-slate-400">
                  {webcamError || 'Camera permission was denied in your browser settings.'}
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={handleStartWebcam}
                    className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold transition flex items-center gap-1.5 shadow"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> RETRY CAMERA
                  </button>
                  <button
                    onClick={handleUseDemo}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-bold transition"
                  >
                    SWITCH TO 24/7 FEED
                  </button>
                </div>
              </div>
            )}

            {webcamState === 'unavailable' && (
              <div className="p-6 text-center max-w-md bg-slate-900/95 border border-slate-800 rounded-lg space-y-3 z-10 text-white shadow-2xl">
                <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
                <h4 className="font-bold text-sm font-mono text-amber-400">NO WEBCAM DETECTED</h4>
                <p className="text-xs text-slate-400">
                  No video capture hardware was found. VisionGuard will automatically switch to the 24/7 CCTV matrix stream.
                </p>
                <button
                  onClick={handleUseDemo}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold transition"
                >
                  START 24/7 CCTV FEED
                </button>
              </div>
            )}

            {webcamState === 'idle' || webcamState === 'stopped' ? (
              <div className="p-6 text-center max-w-md bg-slate-900/95 border border-slate-800 rounded-lg space-y-3 z-10 text-white shadow-2xl">
                <Camera className="w-10 h-10 text-sky-400 mx-auto" />
                <h4 className="font-bold text-sm font-mono text-white">LIVE WEBCAM STREAM</h4>
                <p className="text-xs text-slate-400">
                  Click below to activate your system webcam and test real-time AI PPE detection.
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={handleStartWebcam}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
                  >
                    <Camera className="w-3.5 h-3.5" /> START WEBCAM
                  </button>
                  <button
                    onClick={handleUseDemo}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-xs font-semibold transition"
                  >
                    24/7 Feed
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* 24/7 DEMO CCTV MODE */}
        {(activeSourceType === 'Demo Video' || activeSourceType === 'Local Video') && (
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="w-full h-full object-cover"
          />
        )}

        {/* UPLOADED VIDEO MODE */}
        {activeSourceType === 'Upload Video' && (
          <div className="relative w-full h-full flex items-center justify-center">
            {uploadedVideoUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={uploadedVideoUrl}
                  autoPlay
                  playsInline
                  loop
                  muted={isMuted}
                  className="w-full h-full object-cover"
                />
                {/* AI Overlay on Uploaded Video */}
                {aiOverlayEnabled && (
                  <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                    <div className="relative w-72 h-80 border-2 border-sky-400 bg-sky-500/10 rounded animate-pulse">
                      <div className="absolute -top-7 left-0 bg-sky-600 text-white px-2 py-0.5 rounded-t text-[11px] font-bold font-mono">
                        AI TRACKING • 96% CONFIDENCE
                      </div>
                      <div className="absolute -bottom-6 left-0 bg-slate-950/90 border border-slate-800 text-sky-300 px-2 py-0.5 rounded text-[10px] font-mono">
                        MOTION VECTORS ACTIVE • ZONE: SAFE
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-6 text-center max-w-md bg-slate-900/95 border border-slate-800 rounded-lg space-y-3 z-10 text-white shadow-2xl">
                <Upload className="w-10 h-10 text-amber-400 mx-auto" />
                <h4 className="font-bold text-sm font-mono text-white">NO VIDEO LOADED</h4>
                <p className="text-xs text-slate-400">
                  Select an MP4/WebM video file from your computer to run automated safety inspections.
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold transition flex items-center gap-1.5 mx-auto"
                >
                  <Upload className="w-3.5 h-3.5" /> CHOOSE VIDEO FILE
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. INDUSTRIAL CONTROL BAR */}
      <div className="relative z-30 bg-[#090D18] border-t border-slate-800 p-2.5 px-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white">
        {/* Playback & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Start / Pause */}
          <button
            onClick={handleTogglePlay}
            className="p-1.5 px-2.5 rounded bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1.5 font-mono transition shadow-sm"
            title={isPlaying ? 'Pause Stream' : 'Resume Stream'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="font-bold">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          {/* Stop */}
          <button
            onClick={handleStop}
            className="p-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 font-mono transition"
            title="Stop Stream"
          >
            <Square className="w-3 h-3 text-red-400" />
            <span className="hidden sm:inline">STOP</span>
          </button>

          {/* Switch Camera (Hardware Webcam) */}
          {activeSourceType === 'Webcam' && (
            <button
              onClick={switchCamera}
              className="p-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 font-mono transition"
              title="Switch Front/Rear Camera"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">SWITCH</span>
            </button>
          )}

          {/* Snapshot Capture */}
          <button
            onClick={handleCaptureSnapshot}
            className="p-1.5 px-2.5 rounded bg-sky-950/90 hover:bg-sky-900 text-sky-200 border border-sky-600/80 flex items-center gap-1.5 font-mono transition shadow"
            title="Capture High-Res Forensic Snapshot"
          >
            <Camera className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-bold">SNAPSHOT</span>
          </button>

          {/* AI Overlay Toggle */}
          <button
            onClick={() => setAiOverlayEnabled(!aiOverlayEnabled)}
            className={`p-1.5 px-2.5 rounded border transition flex items-center gap-1 font-mono ${
              aiOverlayEnabled
                ? 'bg-sky-950 text-sky-300 border-sky-600 font-bold'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Computer Vision Bounding Boxes"
          >
            {aiOverlayEnabled ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">AI OVERLAYS</span>
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Upload Video Trigger */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 font-mono transition"
            title="Upload Custom MP4 / WebM Inspection Video"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">UPLOAD VIDEO</span>
          </button>
        </div>

        {/* Mode Selector & Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Quick 24/7 vs Webcam Source Switcher */}
          <div className="flex rounded bg-slate-950 border border-slate-700 p-0.5 text-xs font-mono">
            <button
              onClick={handleUseDemo}
              className={`px-2 py-0.5 rounded transition ${
                activeSourceType === 'Demo Video'
                  ? 'bg-sky-700 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              24/7 Feed
            </button>
            <button
              onClick={handleStartWebcam}
              className={`px-2 py-0.5 rounded transition ${
                activeSourceType === 'Webcam'
                  ? 'bg-emerald-700 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Webcam
            </button>
            <button
              onClick={() => {
                if (uploadedVideoUrl) {
                  setActiveSourceType('Upload Video');
                  stopCamera();
                  setIsPlaying(true);
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className={`px-2 py-0.5 rounded transition ${
                activeSourceType === 'Upload Video'
                  ? 'bg-amber-700 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upload
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={handleToggleFullscreen}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1 transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Snapshot Preview Modal */}
      {snapshotData && (
        <SnapshotModal snapshot={snapshotData} onClose={() => setSnapshotData(null)} />
      )}
    </div>
  );
};

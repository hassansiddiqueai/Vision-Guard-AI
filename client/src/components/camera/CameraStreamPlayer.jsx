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
  CheckCircle2
} from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';
import { SnapshotModal } from './SnapshotModal';
import { RiskBadge } from '../common/RiskBadge';

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
    camera?.type === 'Webcam' ? 'Webcam' : 'Demo Video'
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aiOverlayEnabled, setAiOverlayEnabled] = useState(showOverlays);
  const [snapshotData, setSnapshotData] = useState(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null);

  // Webcam Hook
  const {
    cameraState: webcamState,
    errorMessage: webcamError,
    startCamera,
    stopCamera,
    pauseCamera,
    resumeCamera,
    switchCamera,
    captureFrame: captureWebcamFrame,
    bindVideoRef,
  } = useCamera({ autoStart: camera?.type === 'Webcam' });

  // Embedded 30 FPS Canvas CCTV Animation Loop for Demo Mode
  useEffect(() => {
    if (activeSourceType !== 'Demo Video' && activeSourceType !== 'Local Video') {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = '/assets/construction-site-bg.jpg';

    let scanlineY = 0;
    let tick = 0;

    const renderLoop = () => {
      if (!isPlaying) {
        animationFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      tick += 0.03;
      scanlineY = (scanlineY + 1.5) % canvas.height;

      // Draw Base Construction Frame
      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Subtle CCTV noise/contrast filter
      ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Scanning Laser Line
      const grad = ctx.createLinearGradient(0, scanlineY - 20, 0, scanlineY + 20);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.35)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanlineY - 20, canvas.width, 40);

      // AI Bounding Box Overlays (Drawn on Canvas)
      if (aiOverlayEnabled) {
        const isCritical = camera?.currentRisk === 'CRITICAL' || camera?.currentRisk === 'HIGH';
        const boxX = canvas.width * 0.35 + Math.sin(tick) * 12;
        const boxY = canvas.height * 0.22 + Math.cos(tick) * 8;
        const boxW = canvas.width * 0.32;
        const boxH = canvas.height * 0.52;

        if (isCritical) {
          // Critical Hazard Box (Red)
          ctx.strokeStyle = '#EF4444';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(boxX, boxY, boxW, boxH);
          ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
          ctx.fillRect(boxX, boxY, boxW, boxH);

          // Box Tag
          ctx.fillStyle = '#DC2626';
          ctx.fillRect(boxX, boxY - 24, 180, 22);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 11px "Inter", sans-serif';
          ctx.fillText('NO HELMET • 94% RISK', boxX + 6, boxY - 8);

          // Sub Tag
          ctx.fillStyle = '#D97706';
          ctx.fillRect(boxX, boxY + 2, 190, 18);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 10px "Inter", sans-serif';
          ctx.fillText('RESTRICTED ZONE BREACH', boxX + 6, boxY + 15);
        } else {
          // Compliant Safe Box (Green)
          ctx.strokeStyle = '#10B981';
          ctx.lineWidth = 2;
          ctx.strokeRect(boxX, boxY, boxW, boxH);
          ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
          ctx.fillRect(boxX, boxY, boxW, boxH);

          ctx.fillStyle = '#059669';
          ctx.fillRect(boxX, boxY - 22, 160, 20);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 11px "Inter", sans-serif';
          ctx.fillText('PERSON • PPE VERIFIED 98%', boxX + 6, boxY - 7);
        }

        // Compliant secondary worker
        const w2X = canvas.width * 0.12;
        const w2Y = canvas.height * 0.45;
        const w2W = canvas.width * 0.22;
        const w2H = canvas.height * 0.45;

        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(w2X, w2Y, w2W, w2H);
        ctx.fillStyle = '#059669';
        ctx.fillRect(w2X, w2Y - 18, 120, 18);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px "Inter", sans-serif';
        ctx.fillText('PPE OK 96%', w2X + 4, w2Y - 5);
      }

      // Live Timestamp & Telemetry Watermark
      const now = new Date();
      const timeStr = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}.${Math.floor(now.getMilliseconds() / 100)}`;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(10, canvas.height - 30, 290, 22);
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(`REC ● ${camera?.id || 'CAM-001'} • ${timeStr}`, 16, canvas.height - 15);

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
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
    } else if (canvasRef.current && activeSourceType === 'Demo Video') {
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
      if (webcamState === 'requesting') return { label: 'CONNECTING', color: 'bg-amber-500 animate-pulse' };
      if (webcamState === 'live') return { label: 'LIVE', color: 'bg-emerald-500 animate-pulse' };
      if (webcamState === 'paused') return { label: 'PAUSED', color: 'bg-amber-500' };
      if (webcamState === 'denied') return { label: 'ACCESS DENIED', color: 'bg-red-500' };
      if (webcamState === 'unavailable') return { label: 'NO CAMERA', color: 'bg-red-500' };
      return { label: 'OFFLINE', color: 'bg-slate-500' };
    }
    if (!isPlaying) return { label: 'PAUSED', color: 'bg-amber-500' };
    return { label: 'LIVE', color: 'bg-emerald-500 animate-pulse' };
  };

  const status = getStatus();

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden bg-[#0A0F1D] flex flex-col justify-between border border-slate-800 ${
        isFullscreen ? 'w-screen h-screen z-50 rounded-none' : 'w-full aspect-video rounded-lg shadow-xl'
      }`}
    >
      {/* 1. Top HUD Overlay */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between text-xs pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800 text-white font-mono shadow-md">
          <span className={`w-2 h-2 rounded-full ${status.color}`} />
          <span className="font-bold tracking-wider">{status.label}</span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-slate-200 font-bold">{camera?.id || 'CAM-001'}</span>
          <span className="text-slate-400 hidden sm:inline">&bull; 30 FPS</span>
          <span className="text-sky-400 text-[10px] hidden md:inline font-semibold">[{activeSourceType}]</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5">
          <RiskBadge level={camera?.currentRisk || 'SAFE'} size="sm" />
        </div>
      </div>

      {/* 2. Main Video / Canvas Viewport */}
      <div className="relative w-full h-full flex items-center justify-center bg-[#060A14] overflow-hidden">
        {/* WEBCAM MODE */}
        {activeSourceType === 'Webcam' && (
          <>
            {webcamState === 'live' || webcamState === 'paused' ? (
              <video
                ref={bindVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            ) : webcamState === 'requesting' ? (
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 text-white">
                <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-mono text-sky-400 font-bold">INITIALIZING HARDWARE CAMERA STREAM...</p>
              </div>
            ) : webcamState === 'denied' ? (
              <div className="p-6 text-center max-w-md bg-slate-900/95 border border-slate-800 rounded-lg space-y-3 z-10 text-white shadow-2xl">
                <ShieldAlert className="w-8 h-8 text-red-500 mx-auto" />
                <h4 className="font-bold text-sm font-mono text-red-400">CAMERA ACCESS BLOCKED</h4>
                <p className="text-xs text-slate-400">
                  {webcamError || 'Camera permission was denied in your browser settings.'}
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={handleStartWebcam}
                    className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> TRY AGAIN
                  </button>
                  <button
                    onClick={handleUseDemo}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-bold transition"
                  >
                    USE DEMO FEED
                  </button>
                </div>
              </div>
            ) : webcamState === 'unavailable' ? (
              <div className="p-6 text-center max-w-md bg-slate-900/95 border border-slate-800 rounded-lg space-y-3 z-10 text-white shadow-2xl">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="font-bold text-sm font-mono text-amber-400">NO CAMERA DETECTED</h4>
                <p className="text-xs text-slate-400">
                  No video capture hardware found on this system. Switching to real-time demo loop.
                </p>
                <button
                  onClick={handleUseDemo}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold transition"
                >
                  USE DEMO FEED
                </button>
              </div>
            ) : (
              /* Idle / Prompt */
              <div className="p-6 text-center max-w-md bg-slate-900/95 border border-slate-800 rounded-lg space-y-3 z-10 text-white shadow-2xl">
                <Camera className="w-8 h-8 text-sky-400 mx-auto" />
                <h4 className="font-bold text-sm font-mono text-white">CAMERA ACCESS REQUIRED</h4>
                <p className="text-xs text-slate-400">
                  VisionGuard connects to your browser camera for live on-site inspection.
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={handleStartWebcam}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                  >
                    <Camera className="w-3.5 h-3.5" /> ALLOW CAMERA
                  </button>
                  <button
                    onClick={handleUseDemo}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-xs font-semibold transition"
                  >
                    Demo Feed
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* DEMO VIDEO MODE: 100% RELIABLE CANVAS CCTV ENGINE */}
        {(activeSourceType === 'Demo Video' || activeSourceType === 'Local Video') && (
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="w-full h-full object-cover"
          />
        )}

        {/* UPLOADED VIDEO MODE */}
        {activeSourceType === 'Upload Video' && uploadedVideoUrl && (
          <video
            ref={videoRef}
            src={uploadedVideoUrl}
            autoPlay
            playsInline
            loop
            muted={isMuted}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* 3. Dark Theme Industrial Control Footer */}
      <div className="relative z-20 bg-[#090D18] border-t border-slate-800 p-2.5 px-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white">
        {/* Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Start / Pause */}
          <button
            onClick={handleTogglePlay}
            className="p-1.5 px-2.5 rounded bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1.5 font-mono transition"
            title={isPlaying ? 'Pause Feed' : 'Start Feed'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="font-bold">{isPlaying ? 'PAUSE' : 'START'}</span>
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

          {/* Switch Camera (Webcam) */}
          {activeSourceType === 'Webcam' && (
            <button
              onClick={switchCamera}
              className="p-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 font-mono transition"
              title="Switch Camera (Front/Back)"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">SWITCH</span>
            </button>
          )}

          {/* Snapshot Button */}
          <button
            onClick={handleCaptureSnapshot}
            className="p-1.5 px-2.5 rounded bg-sky-900/50 hover:bg-sky-800/80 text-sky-200 border border-sky-600/60 flex items-center gap-1.5 font-mono transition shadow-sm"
            title="Capture Real High-Res Snapshot Frame"
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
            title="Toggle Demo AI Bounding Boxes"
          >
            {aiOverlayEnabled ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">AI OVERLAY</span>
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
            title="Upload Custom MP4/WebM Video"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">UPLOAD VIDEO</span>
          </button>
        </div>

        {/* Right Source Switcher & Fullscreen */}
        <div className="flex items-center gap-2">
          <select
            value={activeSourceType}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'Webcam') {
                handleStartWebcam();
              } else if (val === 'Upload Video') {
                fileInputRef.current?.click();
              } else {
                handleUseDemo();
              }
            }}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono py-1 px-2.5 rounded outline-none cursor-pointer hover:border-slate-500 transition"
          >
            <option value="Demo Video">Demo Video</option>
            <option value="Webcam">Live Webcam</option>
            <option value="Upload Video">Upload MP4</option>
          </select>

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

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
  Layers,
  Radio,
  Video,
  ShieldAlert,
  AlertTriangle,
  Upload,
  CheckCircle2,
  AlertCircle,
  HardHat,
  Sparkles
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
  onTriggerHazard,
}) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);
  const canvasSimRef = useRef(null);

  const [activeSourceType, setActiveSourceType] = useState(
    camera?.type || camera?.sourceType || 'Demo Video'
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aiOverlayEnabled, setAiOverlayEnabled] = useState(showOverlays);
  const [zonesEnabled, setZonesEnabled] = useState(showZones);
  const [snapshotData, setSnapshotData] = useState(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null);
  const [videoPlayError, setVideoPlayError] = useState(false);
  const [measuredFps, setMeasuredFps] = useState(camera?.fps || 30);

  // Webcam custom hook
  const {
    cameraState: webcamState,
    errorMessage: webcamError,
    startCamera,
    stopCamera,
    pauseCamera,
    resumeCamera,
    switchCamera,
    facingMode,
    captureFrame: captureWebcamFrame,
    bindVideoRef,
  } = useCamera({ autoStart: false });

  // Reliable demo video sources
  const demoVideoSources = {
    'CAM-001': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'CAM-002': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'CAM-003': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'CAM-004': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    'CAM-005': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'CAM-006': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  };

  const getActiveVideoSrc = () => {
    if (activeSourceType === 'Upload Video' && uploadedVideoUrl) {
      return uploadedVideoUrl;
    }
    if (activeSourceType === 'Demo Video' || activeSourceType === 'Local Video') {
      return demoVideoSources[camera?.id] || camera?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    }
    return camera?.videoUrl || demoVideoSources[camera?.id];
  };

  // Switch to webcam
  const handleStartWebcam = useCallback(() => {
    setActiveSourceType('Webcam');
    setVideoPlayError(false);
    startCamera();
  }, [startCamera]);

  // Switch to demo video fallback
  const handleUseDemoVideo = useCallback(() => {
    stopCamera();
    setActiveSourceType('Demo Video');
    setVideoPlayError(false);
    setIsPlaying(true);
  }, [stopCamera]);

  // Handle uploaded video file selection
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous object URL to prevent memory leaks
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const newUrl = URL.createObjectURL(file);
    objectUrlRef.current = newUrl;
    setUploadedVideoUrl(newUrl);
    setActiveSourceType('Upload Video');
    setVideoPlayError(false);
    stopCamera();
    setIsPlaying(true);
  };

  // Fullscreen state listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Cleanup object URLs and streams on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      stopCamera();
    };
  }, [stopCamera]);

  // Compute real stream status
  const getStreamStatus = () => {
    if (activeSourceType === 'Webcam') {
      if (webcamState === 'requesting') return { label: 'CONNECTING', color: 'bg-amber-500 animate-pulse', text: 'text-amber-400' };
      if (webcamState === 'live') return { label: 'LIVE', color: 'bg-emerald-500 animate-pulse', text: 'text-emerald-400' };
      if (webcamState === 'paused') return { label: 'PAUSED', color: 'bg-amber-500', text: 'text-amber-400' };
      if (webcamState === 'denied') return { label: 'ACCESS BLOCKED', color: 'bg-red-500', text: 'text-red-400' };
      if (webcamState === 'unavailable') return { label: 'NO CAMERA', color: 'bg-red-500', text: 'text-red-400' };
      if (webcamState === 'error') return { label: 'CAMERA ERROR', color: 'bg-red-500', text: 'text-red-400' };
      return { label: 'OFFLINE', color: 'bg-slate-500', text: 'text-slate-400' };
    }

    if (activeSourceType === 'RTSP') {
      return { label: 'GATEWAY REQUIRED', color: 'bg-amber-500', text: 'text-amber-400' };
    }

    if (videoPlayError) {
      return { label: 'STREAM OFFLINE', color: 'bg-red-500', text: 'text-red-400' };
    }

    if (!isPlaying) {
      return { label: 'PAUSED', color: 'bg-amber-500', text: 'text-amber-400' };
    }

    return { label: 'LIVE', color: 'bg-emerald-500 animate-pulse', text: 'text-emerald-400' };
  };

  const status = getStreamStatus();

  // Control Actions
  const handleTogglePlay = () => {
    if (activeSourceType === 'Webcam') {
      if (webcamState === 'live') {
        pauseCamera();
        setIsPlaying(false);
      } else if (webcamState === 'paused') {
        resumeCamera();
        setIsPlaying(true);
      } else {
        startCamera();
        setIsPlaying(true);
      }
      return;
    }

    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
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

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Snapshot generation
  const handleCaptureSnapshot = () => {
    let captured = null;

    if (activeSourceType === 'Webcam' && webcamState === 'live') {
      captured = captureWebcamFrame(camera?.id || 'CAM-001');
    } else if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        } catch (e) {
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const timeStr = new Date().toISOString();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(20, canvas.height - 60, 480, 42);
        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 15px "JetBrains Mono", monospace';
        ctx.fillText(`VISIONGUARD • ${camera?.id || 'CAM-001'} • ${timeStr}`, 32, canvas.height - 33);

        captured = {
          dataUrl: canvas.toDataURL('image/png'),
          timestamp: timeStr,
          resolution: `${canvas.width}x${canvas.height}`,
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

  const isCriticalOrHigh = camera?.currentRisk === 'CRITICAL' || camera?.currentRisk === 'HIGH';

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden bg-slate-950 flex flex-col justify-between border border-slate-800 ${
        isFullscreen ? 'w-screen h-screen z-50 rounded-none' : 'w-full aspect-video rounded-lg shadow-md'
      }`}
    >
      {/* 1. Top Industrial CCTV HUD Overlay Bar */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-20 flex items-center justify-between text-xs pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-xs px-2.5 py-1 rounded border border-slate-800/80 text-white font-mono shadow-xs">
          <span className={`w-2 h-2 rounded-full ${status.color}`} />
          <span className="font-bold tracking-wider">{status.label}</span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-slate-200 font-bold">{camera?.id || 'CAM-001'}</span>
          <span className="text-slate-400 hidden sm:inline">&bull; {measuredFps} FPS</span>
          <span className="text-sky-400 text-[10px] hidden md:inline font-semibold">[{activeSourceType}]</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5">
          <RiskBadge level={camera?.currentRisk || 'SAFE'} size="sm" />
        </div>
      </div>

      {/* 2. Main Video Viewport & Error/Permission Handler */}
      <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden">
        {/* WEBCAM SOURCE */}
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
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-mono text-sky-400 font-bold">INITIALIZING HARDWARE CAMERA STREAM...</p>
              </div>
            ) : webcamState === 'denied' ? (
              <div className="p-6 text-center max-w-md bg-slate-900/90 border border-slate-800 rounded-lg space-y-3 z-10 text-white">
                <ShieldAlert className="w-8 h-8 text-red-500 mx-auto" />
                <h4 className="font-bold text-sm font-mono text-red-400">CAMERA ACCESS BLOCKED</h4>
                <p className="text-xs text-slate-400">
                  {webcamError || 'Camera permission was denied in your browser settings.'}
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={handleStartWebcam}
                    className="px-3 py-1.5 bg-sky-700 hover:bg-sky-600 text-white rounded text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> TRY AGAIN
                  </button>
                  <button
                    onClick={handleUseDemoVideo}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-bold transition"
                  >
                    USE DEMO VIDEO
                  </button>
                </div>
              </div>
            ) : webcamState === 'unavailable' ? (
              <div className="p-6 text-center max-w-md bg-slate-900/90 border border-slate-800 rounded-lg space-y-3 z-10 text-white">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="font-bold text-sm font-mono text-amber-400">NO CAMERA DETECTED</h4>
                <p className="text-xs text-slate-400">
                  No video capture hardware found on this terminal. Switching to demo video loop.
                </p>
                <button
                  onClick={handleUseDemoVideo}
                  className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded text-xs font-bold transition"
                >
                  USE DEMO VIDEO
                </button>
              </div>
            ) : (
              /* Idle / Needs Permission Prompt */
              <div className="p-6 text-center max-w-md bg-slate-900/90 border border-slate-800 rounded-lg space-y-3 z-10 text-white">
                <Camera className="w-8 h-8 text-sky-400 mx-auto" />
                <h4 className="font-bold text-sm font-mono text-white">CAMERA ACCESS REQUIRED</h4>
                <p className="text-xs text-slate-400">
                  VisionGuard requires browser camera access to analyze live field video streams.
                </p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    onClick={handleStartWebcam}
                    className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                  >
                    <Camera className="w-3.5 h-3.5" /> ALLOW CAMERA
                  </button>
                  <button
                    onClick={handleUseDemoVideo}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-xs font-semibold transition"
                  >
                    Demo Video
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* RTSP GATEWAY NOTICE */}
        {activeSourceType === 'RTSP' && (
          <div className="p-6 text-center max-w-md bg-slate-900/95 border border-slate-800 rounded-lg space-y-3 z-10 text-white">
            <Radio className="w-8 h-8 text-amber-400 mx-auto" />
            <h4 className="font-bold text-sm font-mono text-amber-300">RTSP MEDIA GATEWAY REQUIRED</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Browsers cannot consume raw RTSP natively. RTSP streams must be transcoded to WebRTC or HLS via the VisionGuard Media Gateway.
            </p>
            <div className="p-2 bg-slate-950 rounded border border-slate-800 text-[10px] font-mono text-slate-400">
              RTSP CAMERA &rarr; MEDIA SERVER &rarr; WEBRTC/HLS &rarr; VISIONGUARD
            </div>
            <button
              onClick={handleUseDemoVideo}
              className="px-4 py-1.5 bg-sky-700 hover:bg-sky-600 text-white rounded text-xs font-bold transition"
            >
              PREVIEW VIA DEMO FEED
            </button>
          </div>
        )}

        {/* DEMO / UPLOADED VIDEO SOURCE */}
        {(activeSourceType === 'Demo Video' ||
          activeSourceType === 'Upload Video' ||
          activeSourceType === 'Local Video' ||
          activeSourceType === 'HLS/WebRTC') && (
          <>
            {videoPlayError ? (
              <div className="p-6 text-center max-w-md bg-slate-900/90 border border-slate-800 rounded-lg space-y-3 z-10 text-white">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="font-bold text-sm font-mono text-amber-300">DEMO FALLBACK ACTIVATED</h4>
                <p className="text-xs text-slate-400">
                  External video source encountered a CORS / network delay. Auto-recovering.
                </p>
                <button
                  onClick={() => {
                    setVideoPlayError(false);
                    if (videoRef.current) {
                      videoRef.current.load();
                      videoRef.current.play().catch(() => {});
                    }
                  }}
                  className="px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white rounded text-xs font-bold transition flex items-center gap-1.5 mx-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> RELOAD FEED
                </button>
              </div>
            ) : (
              <video
                ref={videoRef}
                src={getActiveVideoSrc()}
                autoPlay
                playsInline
                loop
                muted={isMuted}
                onPlay={() => {
                  setIsPlaying(true);
                  setVideoPlayError(false);
                }}
                onPause={() => setIsPlaying(false)}
                onError={() => {
                  console.warn('Video failed to load from primary CDN, activating fallback');
                  setVideoPlayError(true);
                }}
                className="w-full h-full object-cover"
              />
            )}
          </>
        )}

        {/* DEMO AI DETECTION BOUNDING BOXES OVERLAY */}
        {aiOverlayEnabled && (status.label === 'LIVE' || status.label === 'PAUSED') && (
          <div className="absolute inset-0 pointer-events-none p-3 z-10">
            {/* Top AI Indicator Badge */}
            <div className="absolute bottom-12 right-3 bg-slate-950/85 backdrop-blur-xs text-sky-400 px-2 py-0.5 rounded text-[10px] font-mono border border-sky-900/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400" />
              <span>DEMO AI DETECTION &bull; ACTIVE</span>
            </div>

            {isCriticalOrHigh ? (
              <>
                <div className="border-2 border-red-500 bg-red-500/15 rounded absolute left-[22%] top-[18%] w-[38%] h-[58%] flex flex-col justify-between p-1.5 animate-pulse">
                  <div className="flex flex-col gap-1 self-start">
                    <span className="bg-red-600 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded shadow-xs">
                      PERSON &bull; NO HELMET 94%
                    </span>
                    <span className="bg-amber-600 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded shadow-xs">
                      RESTRICTED ZONE BREACH 88%
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-red-300 bg-slate-950/90 px-1 rounded self-start border border-red-900">
                    TRACK-ID: #084 &bull; CRITICAL
                  </span>
                </div>

                <div className="border border-emerald-500 bg-emerald-500/10 rounded absolute left-[64%] top-[28%] w-[26%] h-[50%] flex flex-col justify-between p-1">
                  <span className="bg-emerald-700 text-white font-mono font-bold text-[8px] px-1 py-0.5 rounded self-start shadow-xs">
                    PERSON &bull; PPE OK 96%
                  </span>
                </div>
              </>
            ) : (
              <div className="border border-emerald-500 bg-emerald-500/10 rounded absolute left-[30%] top-[20%] w-[40%] h-[58%] flex flex-col justify-between p-1.5">
                <span className="bg-emerald-700 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded self-start shadow-xs">
                  PERSON &bull; PPE COMPLIANT 98%
                </span>
                <span className="text-[9px] font-mono text-emerald-300 bg-slate-950/90 px-1 rounded self-start border border-emerald-900">
                  HARNESS &bull; HELMET &bull; VEST VERIFIED
                </span>
              </div>
            )}
          </div>
        )}

        {/* VIRTUAL SAFETY ZONES OVERLAY */}
        {zonesEnabled && camera?.zones && (status.label === 'LIVE' || status.label === 'PAUSED') && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {camera.zones.map((zone, idx) => (
              <div
                key={zone.id}
                className="absolute border-2 border-dashed border-red-500 bg-red-500/10 rounded p-1.5"
                style={{
                  top: idx === 0 ? '14%' : '48%',
                  left: idx === 0 ? '16%' : '54%',
                  width: idx === 0 ? '42%' : '38%',
                  height: idx === 0 ? '60%' : '44%',
                }}
              >
                <span className="bg-red-600 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded shadow-xs">
                  ZONE: {zone.name} ({zone.status})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Interactive Industrial Control Footer Bar */}
      <div className="relative z-20 bg-slate-900/95 border-t border-slate-800 p-2.5 px-3 flex flex-wrap items-center justify-between gap-2 text-xs text-white">
        {/* Left Action Buttons: Play/Pause, Stop, Switch, Snapshot, AI Overlay */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Start / Pause */}
          <button
            onClick={handleTogglePlay}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1 font-mono transition"
            title={isPlaying ? 'Pause Feed' : 'Start Feed'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="font-bold">{isPlaying ? 'PAUSE' : 'START'}</span>
          </button>

          {/* Stop */}
          <button
            onClick={handleStop}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 font-mono transition"
            title="Stop Stream"
          >
            <Square className="w-3 h-3 text-red-400" />
            <span className="hidden sm:inline">STOP</span>
          </button>

          {/* Switch Camera (Webcam FacingMode) */}
          {activeSourceType === 'Webcam' && (
            <button
              onClick={switchCamera}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 font-mono transition"
              title="Switch Camera (Front/Back)"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">SWITCH</span>
            </button>
          )}

          {/* Audio Mute/Unmute */}
          {activeSourceType !== 'Webcam' && (
            <button
              onClick={handleToggleMute}
              className={`p-1.5 rounded border transition flex items-center gap-1 font-mono ${
                isMuted
                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                  : 'bg-sky-950 text-sky-300 border-sky-600'
              }`}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isMuted ? 'MUTED' : 'AUDIO'}</span>
            </button>
          )}

          {/* Snapshot Button */}
          <button
            onClick={handleCaptureSnapshot}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 flex items-center gap-1 font-mono transition shadow-2xs"
            title="Capture Real High-Res Snapshot Frame"
          >
            <Camera className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-bold">SNAPSHOT</span>
          </button>

          {/* AI Overlay Toggle */}
          <button
            onClick={() => setAiOverlayEnabled(!aiOverlayEnabled)}
            className={`p-1.5 rounded border transition flex items-center gap-1 font-mono ${
              aiOverlayEnabled
                ? 'bg-sky-950 text-sky-300 border-sky-600 font-bold'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Demo AI Bounding Boxes"
          >
            {aiOverlayEnabled ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">AI OVERLAY</span>
          </button>

          {/* Hidden File Input for Upload Video */}
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
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 font-mono transition"
            title="Upload Custom MP4/WebM Video"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">UPLOAD VIDEO</span>
          </button>
        </div>

        {/* Right Source Selector & Fullscreen Trigger */}
        <div className="flex items-center gap-2">
          {/* Quick Source Switcher Select */}
          <select
            value={activeSourceType}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'Webcam') {
                handleStartWebcam();
              } else if (val === 'Upload Video') {
                fileInputRef.current?.click();
              } else {
                handleUseDemoVideo();
              }
            }}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono py-1 px-2 rounded outline-none cursor-pointer hover:border-slate-500 transition"
          >
            <option value="Demo Video">Demo Video</option>
            <option value="Webcam">Live Webcam</option>
            <option value="Upload Video">Upload MP4</option>
            <option value="RTSP">RTSP Gateway</option>
          </select>

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

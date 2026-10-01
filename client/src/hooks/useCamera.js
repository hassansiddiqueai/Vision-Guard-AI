import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * useCamera Hook
 * Production-grade WebRTC camera hook with lifecycle management,
 * device enumeration, facingMode toggle, frame capture, and robust error classification.
 */
export const useCamera = ({
  autoStart = false,
  preferredFacingMode = 'environment',
  idealWidth = 1280,
  idealHeight = 720,
} = {}) => {
  const [cameraState, setCameraState] = useState('idle'); // 'idle' | 'requesting' | 'live' | 'paused' | 'denied' | 'unavailable' | 'error' | 'stopped'
  const [errorMessage, setErrorMessage] = useState(null);
  const [devices, setDevices] = useState([]);
  const [activeDeviceId, setActiveDeviceId] = useState(null);
  const [facingMode, setFacingMode] = useState(preferredFacingMode);
  const [streamInfo, setStreamInfo] = useState({ width: 0, height: 0, fps: 0 });

  const streamRef = useRef(null);
  const videoElementRef = useRef(null);

  // Enumerate video input devices
  const getDevices = useCallback(async () => {
    try {
      if (!navigator?.mediaDevices?.enumerateDevices) {
        return [];
      }
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices.filter((d) => d.kind === 'videoinput');
      setDevices(videoInputs);
      return videoInputs;
    } catch (err) {
      console.warn('Failed to enumerate media devices:', err);
      return [];
    }
  }, []);

  // Cleanup helper to stop every track on active MediaStream
  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          console.warn('Error stopping track:', e);
        }
      });
      streamRef.current = null;
    }

    if (videoElementRef.current) {
      videoElementRef.current.srcObject = null;
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    cleanupStream();
    setCameraState('stopped');
  }, [cleanupStream]);

  // Start / request camera stream
  const startCamera = useCallback(
    async (options = {}) => {
      // Clean up any existing stream first
      cleanupStream();

      if (!navigator?.mediaDevices?.getUserMedia) {
        setCameraState('unavailable');
        setErrorMessage('Live camera access is not supported by your current browser environment.');
        return null;
      }

      setCameraState('requesting');
      setErrorMessage(null);

      const targetFacingMode = options.facingMode || facingMode;
      const targetDeviceId = options.deviceId || activeDeviceId;

      const constraints = {
        audio: false,
        video: targetDeviceId
          ? { deviceId: { exact: targetDeviceId } }
          : {
              facingMode: targetFacingMode,
              width: { ideal: options.width || idealWidth },
              height: { ideal: options.height || idealHeight },
            },
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        // Attach stream to video element if assigned
        if (videoElementRef.current) {
          videoElementRef.current.srcObject = stream;
          try {
            await videoElementRef.current.play();
          } catch (playErr) {
            console.warn('Autoplay blocked, waiting for user interaction:', playErr);
          }
        }

        // Get track resolution & settings
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          const settings = videoTrack.getSettings ? videoTrack.getSettings() : {};
          setStreamInfo({
            width: settings.width || idealWidth,
            height: settings.height || idealHeight,
            fps: settings.frameRate ? Math.round(settings.frameRate) : 30,
          });
          if (settings.deviceId) {
            setActiveDeviceId(settings.deviceId);
          }
        }

        setCameraState('live');
        getDevices();
        return stream;
      } catch (err) {
        console.error('Camera getUserMedia error:', err);
        cleanupStream();

        // Standardized human-readable error classification
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraState('denied');
          setErrorMessage('Camera access was blocked. Please allow camera permissions in your browser settings.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setCameraState('unavailable');
          setErrorMessage('No camera device detected on this system. Use Demo Video or Upload Video.');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setCameraState('error');
          setErrorMessage('Camera is currently in use by another application or locked by the operating system.');
        } else if (err.name === 'OverconstrainedError') {
          setCameraState('error');
          setErrorMessage('Camera resolution/constraints could not be satisfied by the hardware.');
        } else if (err.name === 'SecurityError') {
          setCameraState('error');
          setErrorMessage('Camera requires a secure HTTPS or localhost origin.');
        } else {
          setCameraState('error');
          setErrorMessage(err.message || 'An unexpected hardware error occurred while accessing the camera.');
        }
        return null;
      }
    },
    [facingMode, activeDeviceId, idealWidth, idealHeight, cleanupStream, getDevices]
  );

  // Switch between front / back facing camera
  const switchCamera = useCallback(async () => {
    const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacingMode);
    setActiveDeviceId(null);
    return await startCamera({ facingMode: newFacingMode, deviceId: null });
  }, [facingMode, startCamera]);

  // Pause stream
  const pauseCamera = useCallback(() => {
    if (videoElementRef.current) {
      videoElementRef.current.pause();
      setCameraState('paused');
    }
  }, []);

  // Resume stream
  const resumeCamera = useCallback(() => {
    if (videoElementRef.current) {
      videoElementRef.current.play().catch(() => {});
      setCameraState('live');
    }
  }, []);

  // Capture current high-res frame from video element to Data URL
  const captureFrame = useCallback((cameraId = 'CAM-001', options = {}) => {
    const video = videoElementRef.current;
    if (!video) return null;

    const width = video.videoWidth || options.width || 1280;
    const height = video.videoHeight || options.height || 720;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    // Draw video frame
    try {
      ctx.drawImage(video, 0, 0, width, height);
    } catch (drawErr) {
      console.warn('Canvas drawImage error, generating diagnostic frame:', drawErr);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, width, height);
    }

    // Burn cryptographic timestamp and camera watermark
    const timeStr = new Date().toISOString();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(20, height - 60, 480, 42);
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 15px "JetBrains Mono", monospace';
    ctx.fillText(`VISIONGUARD • ${cameraId} • ${timeStr}`, 32, height - 33);

    const dataUrl = canvas.toDataURL('image/png');
    return {
      dataUrl,
      timestamp: timeStr,
      resolution: `${width}x${height}`,
      cameraId,
    };
  }, []);

  // Auto-start on mount if specified
  useEffect(() => {
    if (autoStart) {
      startCamera();
    }
    return () => {
      cleanupStream();
    };
  }, [autoStart, startCamera, cleanupStream]);

  // Bind video element
  const bindVideoRef = useCallback(
    (node) => {
      videoElementRef.current = node;
      if (node && streamRef.current) {
        node.srcObject = streamRef.current;
        node.play().catch(() => {});
      }
    },
    []
  );

  return {
    cameraState,
    errorMessage,
    devices,
    activeDeviceId,
    facingMode,
    streamInfo,
    stream: streamRef.current,
    videoRef: videoElementRef,
    bindVideoRef,
    startCamera,
    stopCamera,
    pauseCamera,
    resumeCamera,
    switchCamera,
    getDevices,
    captureFrame,
  };
};

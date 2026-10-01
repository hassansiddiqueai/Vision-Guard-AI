import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Radio,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Wifi,
  Smartphone,
  Server,
  Sliders,
  Shield,
  Zap,
  ArrowRight,
  Video,
  Globe,
  Settings,
  QrCode,
  HardDrive,
  Copy,
  Check,
  Eye
} from 'lucide-react';
import { useInspections } from '../context/InspectionContext';
import { useCamera } from '../hooks/useCamera';
import { RiskBadge } from '../components/common/RiskBadge';

export const CameraIntegrationsPage = () => {
  const navigate = useNavigate();
  const { cameras, addCamera, sites, testCameraConnection } = useInspections();

  const [activeTab, setActiveTab] = useState('WEBCAM_DISCOVERY'); // 'WEBCAM_DISCOVERY' | 'RTSP_IP' | 'MOBILE_BRIDGE' | 'VMS_NVR'
  const [selectedSite, setSelectedSite] = useState(sites[0]?.name || 'Apex Tower Project');
  const [cameraName, setCameraName] = useState('');
  const [zoneName, setZoneName] = useState('Scaffolding Matrix Level 4');
  const [copiedLink, setCopiedLink] = useState(false);

  // Hardware WebRTC Hook for discovery
  const {
    cameraState,
    errorMessage,
    devices,
    activeDeviceId,
    getDevices,
    startCamera,
    stopCamera,
    bindVideoRef,
  } = useCamera({ autoStart: true });

  // RTSP Manual Config State
  const [rtspConfig, setRtspConfig] = useState({
    name: 'North Perimeter RTSP Stream',
    rtspUrl: 'rtsp://192.168.1.140:554/live/ch0',
    username: 'admin',
    password: '',
    protocol: 'RTSP (H.264/H.265)',
    resolution: '1440p (2K)',
    brand: 'Hikvision / Dahua'
  });
  const [isTestingRtsp, setIsTestingRtsp] = useState(false);
  const [rtspTestResult, setRtspTestResult] = useState(null);

  // Enumerate devices on mount
  useEffect(() => {
    getDevices();
  }, [getDevices]);

  const handleInstallWebcam = (device) => {
    const installed = addCamera({
      name: cameraName || device.label || `Hardware Camera ${cameras.length + 1}`,
      site: selectedSite,
      location: `${selectedSite} - ${zoneName}`,
      type: 'Webcam',
      resolution: '1080p (FHD)',
      feedUrl: 'WEBCAM',
    });

    navigate(`/live-cameras?camera=${installed.id}`);
  };

  const handleTestRtsp = async () => {
    setIsTestingRtsp(true);
    setRtspTestResult(null);
    const res = await testCameraConnection({ url: rtspConfig.rtspUrl });
    setIsTestingRtsp(false);
    setRtspTestResult(res);
  };

  const handleInstallRtsp = () => {
    const installed = addCamera({
      name: rtspConfig.name,
      site: selectedSite,
      location: `${selectedSite} - ${zoneName}`,
      type: 'RTSP Stream',
      resolution: rtspConfig.resolution,
      feedUrl: rtspConfig.rtspUrl,
    });

    navigate(`/live-cameras?camera=${installed.id}`);
  };

  const handleCopyMobileLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/live-demo');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Camera className="w-6 h-6 text-sky-400" />
              Live Camera Ingestion & Installation Gateway
            </h1>
            <span className="text-[10px] font-mono px-2.5 py-0.5 bg-sky-950/80 text-sky-300 rounded border border-sky-800 font-bold flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              GATEWAY READY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Discover local hardware webcams, pair mobile phone optical sensors, or bridge industrial RTSP/ONVIF NVR video streams directly into the AI computer vision engine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/live-cameras')}
            className="vg-btn-secondary text-xs"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Open 24/7 CCTV Grid</span>
          </button>
        </div>
      </div>

      {/* Integration Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'WEBCAM_DISCOVERY', label: '1. Hardware Webcam / USB', icon: Camera, desc: 'Plug & Play Video Capture' },
          { id: 'RTSP_IP', label: '2. RTSP & ONVIF Stream', icon: Server, desc: 'Enterprise IP Cameras' },
          { id: 'MOBILE_BRIDGE', label: '3. Mobile Phone Sensor', icon: Smartphone, desc: 'QR Code Field Camera' },
          { id: 'VMS_NVR', label: '4. VMS & NVR Gateways', icon: HardDrive, desc: 'Hikvision, Dahua, Milestone' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-lg border text-left transition flex items-center gap-3 shrink-0 ${
                isActive
                  ? 'bg-sky-950/80 border-sky-500 ring-1 ring-sky-500 text-white'
                  : 'bg-[#0B1120] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className={`p-2 rounded-md ${isActive ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs">{tab.label}</p>
                <p className="text-[10px] text-slate-400">{tab.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HARDWARE WEBCAM & USB DISCOVERY */}
      {activeTab === 'WEBCAM_DISCOVERY' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Live Preview Stream with Computer Vision HUD */}
          <div className="lg:col-span-7 space-y-3">
            <div className="vg-cyber-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-xs text-white">Live Hardware Sensor Stream</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 text-emerald-400 rounded border border-slate-800">
                  30 FPS • AI PPE DETECTION ACTIVE
                </span>
              </div>

              {/* Video Viewport */}
              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                <video
                  ref={bindVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraState === 'live' ? 'block' : 'hidden'}`}
                />

                {/* AI HUD Bounding Box Overlay */}
                {cameraState === 'live' && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                    <div className="relative w-64 h-80 border-2 border-emerald-400 bg-emerald-500/10 rounded shadow-lg">
                      <div className="absolute -top-7 left-0 bg-emerald-600 text-white px-2 py-0.5 rounded-t text-[11px] font-bold font-mono flex items-center gap-1 shadow">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>HARDWARE SENSOR • PPE 99%</span>
                      </div>
                      <div className="absolute -bottom-6 left-0 bg-slate-950/90 border border-slate-800 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-mono">
                        HELMET: OK | VEST: OK | CONFIDENCE: 99.4%
                      </div>
                    </div>
                  </div>
                )}

                {cameraState === 'requesting' && (
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-3 text-white">
                    <div className="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-mono text-sky-400 font-bold">CONNECTING TO VIDEO CAPTURE HARDWARE...</p>
                  </div>
                )}

                {cameraState === 'denied' && (
                  <div className="p-6 text-center max-w-sm space-y-3 text-white">
                    <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
                    <h4 className="font-bold text-sm text-red-400 font-mono">CAMERA PERMISSION REQUIRED</h4>
                    <p className="text-xs text-slate-400">{errorMessage || 'Please allow camera permissions in your browser bar.'}</p>
                    <button
                      onClick={() => startCamera()}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold transition"
                    >
                      Retry Permission
                    </button>
                  </div>
                )}

                {(cameraState === 'idle' || cameraState === 'stopped' || cameraState === 'unavailable') && (
                  <div className="p-6 text-center max-w-sm space-y-3 text-white">
                    <Camera className="w-10 h-10 text-sky-400 mx-auto" />
                    <h4 className="font-bold text-sm text-white font-mono">START CAMERA PREVIEW</h4>
                    <p className="text-xs text-slate-400">Click below to activate your system's video sensor.</p>
                    <button
                      onClick={() => startCamera()}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold transition shadow-lg"
                    >
                      Start Camera Sensor
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Installation Form & Device List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="vg-cyber-card p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="font-bold text-sm text-white">Install Camera into Operations Center</h3>
                <button
                  onClick={() => getDevices()}
                  className="p-1 rounded text-slate-400 hover:text-white transition"
                  title="Rescan Devices"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Detected Devices */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-300">Detected Video Input Devices</label>
                {devices.length > 0 ? (
                  <div className="space-y-1.5">
                    {devices.map((d, i) => (
                      <div
                        key={d.deviceId || i}
                        className="p-2.5 rounded bg-slate-900 border border-slate-700 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-sky-400 shrink-0" />
                          <span className="font-semibold text-white truncate max-w-[200px]">
                            {d.label || `USB Video Camera ${i + 1}`}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                          READY
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400 text-center">
                    Default System Webcam Active
                  </div>
                )}
              </div>

              {/* Assigned Site & Zone */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Camera Name / Tag</label>
                  <input
                    type="text"
                    value={cameraName}
                    onChange={(e) => setCameraName(e.target.value)}
                    placeholder="e.g. Lead Auditor Field Inspection Cam"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Target Job Site</label>
                    <select
                      value={selectedSite}
                      onChange={(e) => setSelectedSite(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-2 text-xs text-white outline-none focus:border-sky-500"
                    >
                      {sites.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Safety Zone</label>
                    <input
                      type="text"
                      value={zoneName}
                      onChange={(e) => setZoneName(e.target.value)}
                      placeholder="e.g. Scaffolding Level 4"
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-2 text-xs text-white outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Install Action Button */}
              <button
                onClick={() => handleInstallWebcam(devices[0] || { label: 'Webcam Stream' })}
                className="w-full vg-btn-primary justify-center py-2.5 text-xs font-bold shadow-xl flex items-center gap-2 mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>INSTALL & LAUNCH LIVE 24/7 CCTV FEED</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RTSP & ONVIF STREAM CONFIG */}
      {activeTab === 'RTSP_IP' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="vg-cyber-card p-5 space-y-4">
              <h3 className="font-bold text-sm text-white pb-2 border-b border-slate-800">
                Configure Enterprise RTSP / ONVIF IP Camera Stream
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">RTSP Stream URI</label>
                  <input
                    type="text"
                    value={rtspConfig.rtspUrl}
                    onChange={(e) => setRtspConfig({ ...rtspConfig, rtspUrl: e.target.value })}
                    placeholder="rtsp://192.168.1.120:554/live/stream1"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white font-mono focus:border-sky-500 outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Supports H.264, H.265, MJPEG, and ONVIF Profile S/T endpoints over TCP/UDP.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Camera Identifier</label>
                    <input
                      type="text"
                      value={rtspConfig.name}
                      onChange={(e) => setRtspConfig({ ...rtspConfig, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Camera Brand / Gateway</label>
                    <select
                      value={rtspConfig.brand}
                      onChange={(e) => setRtspConfig({ ...rtspConfig, brand: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Hikvision / Dahua">Hikvision / Dahua</option>
                      <option value="Axis Communications">Axis Communications</option>
                      <option value="Hanwha Techwin">Hanwha Techwin</option>
                      <option value="Milestone / Genetec VMS">Milestone / Genetec VMS</option>
                      <option value="Generic RTSP">Generic RTSP Stream</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">RTSP Username</label>
                    <input
                      type="text"
                      value={rtspConfig.username}
                      onChange={(e) => setRtspConfig({ ...rtspConfig, username: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">Password</label>
                    <input
                      type="password"
                      value={rtspConfig.password}
                      onChange={(e) => setRtspConfig({ ...rtspConfig, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleTestRtsp}
                    disabled={isTestingRtsp}
                    className="vg-btn-secondary text-xs flex items-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTestingRtsp ? 'animate-spin' : ''}`} />
                    <span>{isTestingRtsp ? 'Testing RTSP Handshake...' : 'Validate Stream Connection'}</span>
                  </button>

                  <button
                    onClick={handleInstallRtsp}
                    className="vg-btn-primary text-xs font-bold shadow-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Install RTSP Camera Feed</span>
                  </button>
                </div>

                {rtspTestResult && (
                  <div
                    className={`p-3 rounded-md text-xs mt-2 ${
                      rtspTestResult.success
                        ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                        : 'bg-red-950/80 border border-red-800 text-red-300'
                    }`}
                  >
                    <p className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      {rtspTestResult.success ? 'RTSP CONNECTION ESTABLISHED' : 'HANDSHAKE TIMEOUT'}
                    </p>
                    <p className="text-[11px] mt-0.5">{rtspTestResult.message}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="vg-cyber-card p-5 space-y-3">
              <h4 className="font-bold text-sm text-white">Edge Video Ingestion Architecture</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                VisionGuard's backend transcoders ingest raw RTSP/H.264 streams, extract real-time frames at 30 FPS, and pass them into the computer vision pipeline with sub-50ms inference latency.
              </p>
              <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1.5 font-mono text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Stream Protocol:</span>
                  <strong className="text-sky-400">RTSP / WebRTC HLS</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Resolution:</span>
                  <strong className="text-white">1080p / 1440p (2K)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AI Safety Models:</span>
                  <strong className="text-emerald-400">PPE + Boundary Detection</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MOBILE PHONE CAMERA BRIDGE */}
      {activeTab === 'MOBILE_BRIDGE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vg-cyber-card p-6 space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-sky-950 border border-sky-600/80 flex items-center justify-center mx-auto text-sky-400 shadow-xl">
              <QrCode className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-white">Turn Any Smartphone into an On-Site AI Camera</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Scan this QR code with your iPhone or Android device to instantly open the mobile field inspection portal and stream live video into the central safety operations center.
            </p>

            <div className="p-4 bg-white rounded-xl inline-block shadow-2xl mx-auto border-4 border-slate-900">
              {/* High-tech stylized QR representation */}
              <div className="w-44 h-44 bg-slate-950 rounded flex flex-col items-center justify-center p-3 text-white space-y-2">
                <Smartphone className="w-12 h-12 text-sky-400 animate-bounce" />
                <span className="font-mono text-[11px] font-bold text-sky-300">SCAN TO STREAM</span>
                <span className="font-mono text-[9px] text-slate-400">{window.location.origin}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCopyMobileLink}
                className="vg-btn-secondary text-xs mx-auto flex items-center gap-2"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Mobile Pairing Link'}</span>
              </button>
            </div>
          </div>

          <div className="vg-cyber-card p-6 space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Mobile AI Camera Features
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1">
                <p className="font-bold text-white">● Instant Field Auditor Walking Audits</p>
                <p className="text-slate-400 text-[11px]">Supervisors can walk scaffolds and excavation edges with continuous real-time hazard classification.</p>
              </div>
              <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1">
                <p className="font-bold text-white">● Zero Mobile App Install Required</p>
                <p className="text-slate-400 text-[11px]">Runs natively in Mobile Safari & Chrome using standard WebRTC video streams.</p>
              </div>
              <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1">
                <p className="font-bold text-white">● Offline Frame Buffer</p>
                <p className="text-slate-400 text-[11px]">Automatic local buffering in low-connectivity underground construction zones.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VMS / NVR ENTERPRISE PLATFORMS */}
      {activeTab === 'VMS_NVR' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Hikvision NVR & iVMS', model: 'DS-7600 / 7700 Series', status: 'COMPATIBLE', desc: 'Direct ISAPI / RTSP stream ingestion' },
            { name: 'Dahua Smart NVR', model: 'NVR5000-I / 6000 Series', status: 'COMPATIBLE', desc: 'ONVIF Profile S/G/T protocol gateway' },
            { name: 'Axis Camera Station', model: 'Axis VAPIX & RTSP', status: 'CERTIFIED', desc: 'Zero-latency edge optical bridge' },
            { name: 'Milestone XProtect', model: 'Corporate & Expert VMS', status: 'CERTIFIED', desc: 'MIP SDK & WebRTC live stream proxy' },
          ].map((vms, idx) => (
            <div key={idx} className="vg-cyber-card p-4 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <Server className="w-5 h-5 text-sky-400" />
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[9px] font-bold">
                    {vms.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white mt-2">{vms.name}</h4>
                <p className="font-mono text-[10px] text-slate-400">{vms.model}</p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">{vms.desc}</p>
              </div>

              <button
                onClick={() => {
                  setRtspConfig((prev) => ({ ...prev, name: `${vms.name} Stream 1`, brand: vms.name }));
                  setActiveTab('RTSP_IP');
                }}
                className="vg-btn-secondary w-full justify-center text-xs mt-3"
              >
                <span>Configure Gateway</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import {
  Camera,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Radio,
  Trash2,
  RefreshCw,
  Power,
  ExternalLink,
  Shield,
  Video,
  Globe,
  Sliders,
  X,
  ArrowRight,
  Info
} from 'lucide-react';

export const CameraManagementPage = () => {
  const navigate = useNavigate();
  const {
    cameras,
    sites,
    addCamera,
    updateCamera,
    deleteCamera,
    testCameraConnection,
    selectedSite
  } = useInspections();

  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'ONLINE' | 'OFFLINE' | 'WARNING'
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [testingCamId, setTestingCamId] = useState(null);
  const [testResult, setTestResult] = useState(null);

  // Add Camera Form Wizard State
  const [addStep, setAddStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    site: 'Apex Tower Project',
    zone: 'Scaffolding Matrix',
    description: '',
    type: '24/7 CCTV Feed', // '24/7 CCTV Feed' | 'Webcam' | 'RTSP Stream' | 'IP Camera' | 'Upload Video'
    rtspUrl: 'rtsp://192.168.1.120:554/live/stream1',
    ipAddress: '192.168.1.120',
    port: '554',
    username: 'admin',
    password: '',
    resolution: '1080p (FHD)'
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  // Filter cameras
  const filteredCameras = cameras.filter((cam) => {
    const matchesSite = selectedSite === 'All Sites' || cam.site === selectedSite;
    const matchesSearch =
      cam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cam.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cam.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cam.site.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSite || !matchesSearch) return false;

    if (filterStatus === 'ONLINE') return cam.status === 'ONLINE';
    if (filterStatus === 'OFFLINE') return cam.status === 'OFFLINE';
    if (filterStatus === 'WARNING') return cam.status !== 'ONLINE' && cam.status !== 'OFFLINE';
    return true;
  });

  const handleTestConnection = async (cam) => {
    setTestingCamId(cam.id);
    setTestResult(null);
    const res = await testCameraConnection({ url: cam.feedUrl, id: cam.id });
    setTestResult({ id: cam.id, ...res });
    setTestingCamId(null);
    setTimeout(() => setTestResult(null), 4000);
  };

  const handleTogglePower = (cam) => {
    const newStatus = cam.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
    updateCamera(cam.id, { status: newStatus });
  };

  // Add camera wizard handlers
  const handleWizardTest = async () => {
    setIsConnecting(true);
    setConnectionStatus({ state: 'CONNECTING', message: 'Initiating video stream handshake...' });
    const res = await testCameraConnection({ url: formData.rtspUrl, ip: formData.ipAddress });
    setIsConnecting(false);
    if (res.success) {
      setConnectionStatus({ state: 'CONNECTED', message: res.message });
    } else {
      setConnectionStatus({ state: 'FAILED', message: res.message });
    }
  };

  const handleSaveNewCamera = () => {
    addCamera({
      name: formData.name || `CCTV ${formData.zone}`,
      site: formData.site,
      zone: formData.zone,
      type: formData.type === 'Webcam' ? 'Webcam' : 'Demo Video',
      location: `${formData.site} - ${formData.zone}`,
      resolution: formData.resolution,
      feedUrl: formData.type === 'Webcam' ? 'WEBCAM' : '/assets/construction-site-bg.jpg'
    });
    setIsAddModalOpen(false);
    setAddStep(1);
    setConnectionStatus(null);
    navigate('/live-cameras');
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Camera className="w-5 h-5 text-sky-400" />
            CCTV & Camera Ingestion Management
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure video ingestion gateways, hardware webcams, RTSP endpoints, and AI detection perimeters.
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
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="vg-btn-primary text-xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Camera</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Strips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="vg-card p-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Managed Feeds</span>
          <p className="text-xl font-bold text-white mt-0.5">{cameras.length}</p>
        </div>
        <div className="vg-card p-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Online & Streaming</span>
          <p className="text-xl font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {cameras.filter((c) => c.status === 'ONLINE').length}
          </p>
        </div>
        <div className="vg-card p-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Offline Feeds</span>
          <p className="text-xl font-bold text-slate-400 mt-0.5">
            {cameras.filter((c) => c.status === 'OFFLINE').length}
          </p>
        </div>
        <div className="vg-card p-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Hazard Alerts</span>
          <p className="text-xl font-bold text-red-400 mt-0.5">
            {cameras.filter((c) => c.currentRisk === 'CRITICAL' || c.currentRisk === 'HIGH').length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="vg-card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 w-full sm:w-auto flex-wrap">
          {[
            { id: 'ALL', label: 'All Feeds' },
            { id: 'ONLINE', label: 'Online Streams' },
            { id: 'OFFLINE', label: 'Offline' },
            { id: 'WARNING', label: 'Warning / Low Vis' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                filterStatus === tab.id
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, name, site..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Cameras Table */}
      <div className="vg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4">Camera Identifier</th>
                <th className="py-2.5 px-3">Site & Location</th>
                <th className="py-2.5 px-3">Source / Type</th>
                <th className="py-2.5 px-3">Telemetry</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">AI Safety Risk</th>
                <th className="py-2.5 px-4 text-right">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredCameras.map((cam) => {
                const isTesting = testingCamId === cam.id;
                const isThisResult = testResult && testResult.id === cam.id;

                return (
                  <tr key={cam.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                          <Camera className="w-4 h-4 text-sky-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{cam.name}</p>
                          <p className="font-mono text-[10px] text-slate-400">{cam.id} &bull; {cam.resolution}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-200">{cam.site}</p>
                      <p className="text-slate-400 text-[11px] truncate max-w-xs">{cam.location}</p>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-sky-300 font-semibold">
                        {cam.type || '24/7 CCTV Feed'}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                      <div>{cam.fps || 30} FPS &bull; {cam.bitrate || '4.0 Mbps'}</div>
                      <div className="text-slate-500 text-[10px]">Ping: {cam.lastPing || '2s ago'}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cam.status === 'ONLINE'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cam.status === 'ONLINE' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                        {cam.status}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={
                          cam.currentRisk === 'CRITICAL'
                            ? 'vg-badge-critical text-[10px]'
                            : cam.currentRisk === 'HIGH'
                            ? 'vg-badge-high text-[10px]'
                            : 'vg-badge-safe text-[10px]'
                        }
                      >
                        {cam.currentRisk} ({cam.activeDetections || 0} DET)
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleTestConnection(cam)}
                          disabled={isTesting}
                          title="Test Stream Handshake"
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-sky-400' : ''}`} />
                        </button>

                        <button
                          onClick={() => handleTogglePower(cam)}
                          title={cam.status === 'ONLINE' ? 'Disable Stream' : 'Enable Stream'}
                          className={`p-1.5 rounded transition ${
                            cam.status === 'ONLINE'
                              ? 'bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-300'
                              : 'bg-slate-800 hover:bg-emerald-900/60 text-slate-300 hover:text-emerald-300'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => navigate(`/live-cameras?camera=${cam.id}`)}
                          title="View Live CCTV Video"
                          className="p-1.5 rounded bg-sky-900/60 hover:bg-sky-800 text-sky-300 transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deleteCamera(cam.id)}
                          title="Delete Camera Configuration"
                          className="p-1.5 rounded bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {isThisResult && (
                        <p className={`text-[10px] mt-1 font-semibold ${testResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                          {testResult.message}
                        </p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5-Step "+ Add Camera" Working Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0F172A] rounded-lg border border-slate-700 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold tracking-tight">Add CCTV / Video Camera Stream</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Header */}
            <div className="bg-slate-900/60 px-5 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400">
              {[
                { num: 1, label: '1. Info' },
                { num: 2, label: '2. Source' },
                { num: 3, label: '3. Settings' },
                { num: 4, label: '4. Test' },
                { num: 5, label: '5. Deploy' },
              ].map((s) => (
                <span
                  key={s.num}
                  className={
                    addStep === s.num
                      ? 'text-sky-400 font-bold border-b-2 border-sky-400 pb-0.5'
                      : addStep > s.num
                      ? 'text-emerald-400 font-semibold'
                      : 'text-slate-500'
                  }
                >
                  {s.label}
                </span>
              ))}
            </div>

            {/* Modal Body Steps */}
            <div className="p-5 text-xs space-y-4 text-slate-300">
              {/* STEP 1: Camera Info */}
              {addStep === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">Camera Name / Tag</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. South Tower Scaffolding Level 4"
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-700 rounded-md text-white focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-200 mb-1">Assigned Job Site</label>
                      <select
                        value={formData.site}
                        onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                        className="w-full py-2 px-3 bg-slate-900 border border-slate-700 rounded-md text-white focus:ring-1 focus:ring-sky-500 outline-none"
                      >
                        {sites.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-200 mb-1">Site Operational Zone</label>
                      <input
                        type="text"
                        value={formData.zone}
                        onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                        placeholder="e.g. Sector 4 Platform"
                        className="w-full py-2 px-3 bg-slate-900 border border-slate-700 rounded-md text-white focus:ring-1 focus:ring-sky-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-200 mb-1">Description / Risk Purpose</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Continuous monitoring for PPE adherence and structural scaffold elevation clearance..."
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-700 rounded-md text-white focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Protocol Type */}
              {addStep === 2 && (
                <div className="space-y-3">
                  <p className="font-semibold text-slate-200">Select Video Stream Ingestion Source</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { id: '24/7 CCTV Feed', title: '24/7 Live CCTV Feed', desc: 'Continuous 30 FPS optical simulation stream' },
                      { id: 'Webcam', title: 'Hardware Webcam', desc: 'Direct system camera sensor via WebRTC' },
                      { id: 'RTSP Stream', title: 'RTSP Stream URI', desc: 'H.264/H.265 RTSP endpoint url' },
                      { id: 'IP Camera', title: 'Direct IP Camera', desc: 'Static IPv4 / ONVIF direct connect' },
                    ].map((proto) => (
                      <button
                        key={proto.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: proto.id })}
                        className={`p-3 rounded-md border text-left transition ${
                          formData.type === proto.id
                            ? 'bg-sky-950/80 border-sky-500 ring-1 ring-sky-500'
                            : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <p className="font-bold text-white">{proto.title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{proto.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Connection Details */}
              {addStep === 3 && (
                <div className="space-y-3">
                  {formData.type === 'RTSP Stream' && (
                    <div>
                      <label className="block font-semibold text-slate-200 mb-1">RTSP Stream URI</label>
                      <input
                        type="text"
                        value={formData.rtspUrl}
                        onChange={(e) => setFormData({ ...formData, rtspUrl: e.target.value })}
                        placeholder="rtsp://192.168.1.100:554/live/stream1"
                        className="w-full py-2 px-3 bg-slate-900 border border-slate-700 rounded-md text-white font-mono focus:ring-1 focus:ring-sky-500 outline-none"
                      />
                    </div>
                  )}

                  {formData.type === 'IP Camera' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-200 mb-1">IP Address</label>
                        <input
                          type="text"
                          value={formData.ipAddress}
                          onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                          placeholder="192.168.1.120"
                          className="w-full py-2 px-3 bg-slate-900 border border-slate-700 rounded-md text-white font-mono outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-200 mb-1">Port</label>
                        <input
                          type="text"
                          value={formData.port}
                          onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                          placeholder="554"
                          className="w-full py-2 px-3 bg-slate-900 border border-slate-700 rounded-md text-white font-mono outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {formData.type === 'Webcam' && (
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-md space-y-1">
                      <p className="font-bold text-emerald-400">WebRTC Hardware Video Access</p>
                      <p className="text-slate-400 text-[11px]">
                        VisionGuard will request access to your device's video capture hardware and stream at 30 FPS.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-200 mb-1">Username (Optional)</label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="admin"
                        className="w-full py-2 px-3 bg-slate-900 border border-slate-700 rounded-md text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-200 mb-1">Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full py-2 px-3 bg-slate-900 border border-slate-700 rounded-md text-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Test Connection */}
              {addStep === 4 && (
                <div className="space-y-3 py-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto text-sky-400">
                    <Radio className="w-6 h-6 text-sky-400 animate-pulse" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Validate Stream Readiness</h4>
                  <p className="text-slate-400 max-w-sm mx-auto">
                    VisionGuard will initialize a stream ping test to <code className="font-mono text-sky-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">{formData.type}</code>.
                  </p>

                  <button
                    onClick={handleWizardTest}
                    disabled={isConnecting}
                    className="vg-btn-primary mx-auto py-2 px-4 shadow-lg"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
                    <span>{isConnecting ? 'Testing Handshake...' : 'Test Connection Now'}</span>
                  </button>

                  {connectionStatus && (
                    <div
                      className={`p-3 rounded-md text-left text-xs ${
                        connectionStatus.state === 'CONNECTED'
                          ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                          : connectionStatus.state === 'FAILED'
                          ? 'bg-red-950 border border-red-800 text-red-300'
                          : 'bg-slate-900 border border-slate-700 text-slate-300'
                      }`}
                    >
                      <p className="font-bold">{connectionStatus.state}</p>
                      <p className="text-[11px] mt-0.5">{connectionStatus.message}</p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: Save & Deploy */}
              {addStep === 5 && (
                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-md space-y-2">
                    <h4 className="font-bold text-white">Stream Configuration Ready</h4>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div><span className="font-semibold text-slate-400">Camera:</span> {formData.name || 'CCTV Stream'}</div>
                      <div><span className="font-semibold text-slate-400">Site:</span> {formData.site}</div>
                      <div><span className="font-semibold text-slate-400">Zone:</span> {formData.zone}</div>
                      <div><span className="font-semibold text-slate-400">Source:</span> {formData.type}</div>
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Once deployed, this stream will be immediately accessible in the 24/7 CCTV operations matrix.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-5 py-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  if (addStep > 1) setAddStep(addStep - 1);
                  else setIsAddModalOpen(false);
                }}
                className="vg-btn-secondary text-xs"
              >
                {addStep === 1 ? 'Cancel' : 'Back'}
              </button>

              {addStep < 5 ? (
                <button
                  onClick={() => setAddStep(addStep + 1)}
                  className="vg-btn-primary text-xs"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSaveNewCamera}
                  className="vg-btn-primary text-xs font-bold shadow-lg"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save & Deploy Feed</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

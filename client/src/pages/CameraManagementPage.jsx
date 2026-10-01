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
    type: 'RTSP Stream', // 'RTSP Stream' | 'IP Camera' | 'ONVIF Camera' | 'Webcam' | 'Demo Video'
    rtspUrl: 'rtsp://192.168.1.120:554/live/stream1',
    ipAddress: '192.168.1.120',
    port: '554',
    username: 'admin',
    password: '',
    demoSource: 'Construction Zone Sample',
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
    setConnectionStatus({ state: 'CONNECTING', message: 'Initiating RTSP / ONVIF handshake...' });
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
      type: formData.type,
      location: `${formData.site} - ${formData.zone}`,
      resolution: formData.resolution,
      feedUrl: formData.type === 'Webcam' ? 'WEBCAM' : 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop'
    });
    setIsAddModalOpen(false);
    setAddStep(1);
    setConnectionStatus(null);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Camera className="w-5 h-5 text-sky-700" />
            CCTV & IP Camera Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure video ingestion gateways, ONVIF discovery, RTSP streaming endpoints, and AI detection perimeters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/live-cameras')}
            className="vg-btn-secondary text-xs"
          >
            <Radio className="w-3.5 h-3.5 text-red-600" />
            <span>Open CCTV Grid</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="vg-btn-primary text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Camera</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Strips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="vg-card p-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Managed Cameras</span>
          <p className="text-lg font-bold text-slate-900 mt-0.5">{cameras.length}</p>
        </div>
        <div className="vg-card p-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Online & Ingesting</span>
          <p className="text-lg font-bold text-emerald-700 mt-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            {cameras.filter((c) => c.status === 'ONLINE').length}
          </p>
        </div>
        <div className="vg-card p-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Offline / Unreachable</span>
          <p className="text-lg font-bold text-slate-600 mt-0.5">
            {cameras.filter((c) => c.status === 'OFFLINE').length}
          </p>
        </div>
        <div className="vg-card p-3">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Hazard Alerts</span>
          <p className="text-lg font-bold text-red-600 mt-0.5">
            {cameras.filter((c) => c.currentRisk === 'CRITICAL' || c.currentRisk === 'HIGH').length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="vg-card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 w-full sm:w-auto">
          {[
            { id: 'ALL', label: 'All Cameras' },
            { id: 'ONLINE', label: 'Online Streams' },
            { id: 'OFFLINE', label: 'Offline' },
            { id: 'WARNING', label: 'Warning / Obstructed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                filterStatus === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
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
            placeholder="Search by ID, name, location..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600"
          />
        </div>
      </div>

      {/* Cameras Table */}
      <div className="vg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-4">Camera Identifier</th>
                <th className="py-2.5 px-3">Site & Location</th>
                <th className="py-2.5 px-3">Protocol / Type</th>
                <th className="py-2.5 px-3">Telemetry</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">AI Safety Risk</th>
                <th className="py-2.5 px-4 text-right">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCameras.map((cam) => {
                const isTesting = testingCamId === cam.id;
                const isThisResult = testResult && testResult.id === cam.id;

                return (
                  <tr key={cam.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          <Camera className="w-4 h-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{cam.name}</p>
                          <p className="font-mono text-[10px] text-slate-400">{cam.id} &bull; {cam.resolution}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-800">{cam.site}</p>
                      <p className="text-slate-500 text-[11px] truncate max-w-xs">{cam.location}</p>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[10px] text-slate-700">
                        {cam.type || 'RTSP Stream'}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                      <div>{cam.fps} FPS &bull; {cam.bitrate}</div>
                      <div className="text-slate-400 text-[10px]">Ping: {cam.lastPing}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cam.status === 'ONLINE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cam.status === 'ONLINE' ? 'bg-emerald-600' : 'bg-slate-400'}`} />
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
                        {cam.currentRisk} ({cam.activeDetections} DET)
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleTestConnection(cam)}
                          disabled={isTesting}
                          title="Test RTSP Connection Handshake"
                          className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-sky-700' : ''}`} />
                        </button>

                        <button
                          onClick={() => handleTogglePower(cam)}
                          title={cam.status === 'ONLINE' ? 'Disable Camera Stream' : 'Enable Camera Stream'}
                          className={`p-1.5 rounded transition ${
                            cam.status === 'ONLINE'
                              ? 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600'
                              : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => navigate('/live-cameras')}
                          title="View Live CCTV Video"
                          className="p-1.5 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deleteCamera(cam.id)}
                          title="Delete Camera Configuration"
                          className="p-1.5 rounded bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-700 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {isThisResult && (
                        <p className={`text-[10px] mt-1 font-semibold ${testResult.success ? 'text-emerald-700' : 'text-red-600'}`}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold tracking-tight">Connect New CCTV / IP Camera</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Header */}
            <div className="bg-slate-100 px-5 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-500">
              {[
                { num: 1, label: '1. Info' },
                { num: 2, label: '2. Protocol' },
                { num: 3, label: '3. Credentials' },
                { num: 4, label: '4. Test Stream' },
                { num: 5, label: '5. Save' },
              ].map((s) => (
                <span
                  key={s.num}
                  className={
                    addStep === s.num
                      ? 'text-sky-700 font-bold border-b-2 border-sky-700 pb-0.5'
                      : addStep > s.num
                      ? 'text-emerald-700 font-semibold'
                      : 'text-slate-400'
                  }
                >
                  {s.label}
                </span>
              ))}
            </div>

            {/* Modal Body Steps */}
            <div className="p-5 text-xs space-y-4">
              {/* STEP 1: Camera Info */}
              {addStep === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Camera Name / Tag</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. West Perimeter Tower Crane Feed"
                      className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Assigned Job Site</label>
                      <select
                        value={formData.site}
                        onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                        className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
                      >
                        {sites.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Site Operational Zone</label>
                      <input
                        type="text"
                        value={formData.zone}
                        onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                        placeholder="e.g. Sector 4 Platform"
                        className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Description / Risk Purpose</label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Continuous monitoring for PPE adherence and structural scaffold elevation clearance..."
                      className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Protocol Type */}
              {addStep === 2 && (
                <div className="space-y-3">
                  <p className="font-semibold text-slate-700">Select CCTV Video Ingestion Protocol</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { id: 'RTSP Stream', title: 'RTSP Video Stream', desc: 'H.264/H.265 RTSP endpoint url' },
                      { id: 'IP Camera', title: 'Direct IP Camera', desc: 'Static IPv4 / ONVIF direct connect' },
                      { id: 'ONVIF Camera', title: 'ONVIF Profile S/T', desc: 'Auto-discovery over subnet' },
                      { id: 'Webcam', title: 'Browser WebCam / USB', desc: 'Local video hardware device' },
                      { id: 'Demo Video', title: 'Simulated CCTV Feed', desc: 'Realistic synthetic test stream' },
                    ].map((proto) => (
                      <button
                        key={proto.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: proto.id })}
                        className={`p-3 rounded-md border text-left transition ${
                          formData.type === proto.id
                            ? 'bg-sky-50 border-sky-600 ring-1 ring-sky-600'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <p className="font-bold text-slate-900">{proto.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{proto.desc}</p>
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
                      <label className="block font-semibold text-slate-700 mb-1">RTSP Stream URI</label>
                      <input
                        type="text"
                        value={formData.rtspUrl}
                        onChange={(e) => setFormData({ ...formData, rtspUrl: e.target.value })}
                        placeholder="rtsp://192.168.1.100:554/live/stream1"
                        className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 font-mono focus:ring-1 focus:ring-sky-600 focus:border-sky-600 outline-none"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        Architecture Note: RTSP is converted via WebRTC/HLS media gateway backend for low-latency browser display.
                      </p>
                    </div>
                  )}

                  {formData.type === 'IP Camera' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">IP Address</label>
                        <input
                          type="text"
                          value={formData.ipAddress}
                          onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                          placeholder="192.168.1.120"
                          className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 font-mono outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Port</label>
                        <input
                          type="text"
                          value={formData.port}
                          onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                          placeholder="554"
                          className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 font-mono outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {formData.type === 'Demo Video' && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Sample Industrial Footage</label>
                      <select
                        value={formData.demoSource}
                        onChange={(e) => setFormData({ ...formData, demoSource: e.target.value })}
                        className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 outline-none"
                      >
                        <option value="Scaffolding Platform Tier 6">Scaffolding Platform Tier 6 (Structural)</option>
                        <option value="Heavy Equipment Yard">Heavy Equipment Yard (Proximity)</option>
                        <option value="Substation Transformer Bay">Substation Transformer Bay (High Voltage)</option>
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">RTSP Username (Optional)</label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="admin"
                        className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full py-2 px-3 bg-white border border-slate-300 rounded-md text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Test Connection */}
              {addStep === 4 && (
                <div className="space-y-3 py-2 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-700">
                    <Radio className="w-6 h-6 text-sky-700" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Validate Stream Connection</h4>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    VisionGuard will send a ping request to <code className="font-mono text-slate-800 bg-slate-100 px-1 rounded">{formData.type}</code> and verify frame synchronization.
                  </p>

                  <button
                    onClick={handleWizardTest}
                    disabled={isConnecting}
                    className="vg-btn-primary mx-auto py-2 px-4"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
                    <span>{isConnecting ? 'Testing Handshake...' : 'Test Connection Now'}</span>
                  </button>

                  {connectionStatus && (
                    <div
                      className={`p-3 rounded-md text-left text-xs ${
                        connectionStatus.state === 'CONNECTED'
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                          : connectionStatus.state === 'FAILED'
                          ? 'bg-red-50 border border-red-200 text-red-700'
                          : 'bg-slate-100 border border-slate-200 text-slate-700'
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
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md space-y-2">
                    <h4 className="font-bold text-slate-900">Configuration Ready for Deployment</h4>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                      <div><span className="font-semibold text-slate-800">Camera:</span> {formData.name || 'CCTV Stream'}</div>
                      <div><span className="font-semibold text-slate-800">Site:</span> {formData.site}</div>
                      <div><span className="font-semibold text-slate-800">Zone:</span> {formData.zone}</div>
                      <div><span className="font-semibold text-slate-800">Protocol:</span> {formData.type}</div>
                    </div>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Once saved, the feed will immediately begin continuous AI inference and hazard perimeter classification.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
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
                  className="vg-btn-primary text-xs font-bold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save & Deploy Camera</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

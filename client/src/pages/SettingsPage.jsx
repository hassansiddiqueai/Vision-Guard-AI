import React, { useState } from 'react';
import { useInspections } from '../context/InspectionContext';
import {
  Bell,
  Sliders,
  CheckCircle2,
  RotateCcw,
  Shield,
  Layers,
  Zap,
  Activity,
  Server,
  Radio,
  AlertTriangle
} from 'lucide-react';

export const SettingsPage = () => {
  const { resetDemo, runSafetyScenario, activeScenario } = useInspections();
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('vg_app_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      showCoordinatesOnScan: true,
      browserAudioAlerts: true,
      confidenceThreshold: 85,
      defaultSite: 'Apex Tower Project',
      mediaGatewayProtocol: 'WebRTC / RTSP Transcoder',
      targetInferenceLatency: '84ms',
    };
  });

  const [savedFeedback, setSavedFeedback] = useState(false);
  const [resetFeedback, setResetFeedback] = useState(false);

  const handleToggle = (key) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('vg_app_settings', JSON.stringify(updated));
      return updated;
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleChange = (key, value) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('vg_app_settings', JSON.stringify(updated));
      return updated;
    });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleResetDemo = () => {
    resetDemo();
    setResetFeedback(true);
    setTimeout(() => setResetFeedback(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            System Telemetry & Simulation Controls
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure computer vision neural inference thresholds, RTSP media pipelines, and test simulation scenarios.
          </p>
        </div>

        {savedFeedback && (
          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Parameters Saved</span>
          </span>
        )}
      </div>

      {/* CONSOLIDATED SIMULATION MODE PANEL (Requirement 15) */}
      <div className="vg-card p-5 border-l-4 border-l-sky-600 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Simulation Mode Controls
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-50 text-amber-800 rounded border border-amber-300 font-bold">
                SIMULATION ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Trigger instant industrial hazard events across CCTV cameras to demonstrate real-time bounding boxes, sirens, and human verification workflows.
            </p>
          </div>

          <button
            onClick={handleResetDemo}
            className="vg-btn-secondary text-xs font-bold flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>RESET SIMULATION</span>
          </button>
        </div>

        {resetFeedback && (
          <div className="p-2.5 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Simulation Reset: All default seed cameras, incidents, and virtual zones have been restored cleanly.</span>
          </div>
        )}

        {/* 5 Specific Scenario Triggers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {/* 1. PPE Violation */}
          <button
            onClick={() => runSafetyScenario('ppe-violation')}
            className={`p-3 rounded-md border text-left transition flex flex-col justify-between space-y-2 ${
              activeScenario === 'ppe-violation'
                ? 'bg-sky-50 border-sky-600 ring-1 ring-sky-600'
                : 'bg-white hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">1. PPE Violation</span>
              <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                HIGH RISK
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Worker detected without mandatory ANSI hard hat & high-vis vest on Level 6 scaffold.
            </p>
            <span className="text-[10px] font-mono text-sky-700 font-bold">Trigger Detection &rarr;</span>
          </button>

          {/* 2. Restricted Area */}
          <button
            onClick={() => runSafetyScenario('restricted-zone')}
            className={`p-3 rounded-md border text-left transition flex flex-col justify-between space-y-2 ${
              activeScenario === 'restricted-zone'
                ? 'bg-sky-50 border-sky-600 ring-1 ring-sky-600'
                : 'bg-white hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">2. Restricted Area Breach</span>
              <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                CRITICAL
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Unauthorized entry inside the 5-meter crane suspended load drop perimeter.
            </p>
            <span className="text-[10px] font-mono text-sky-700 font-bold">Trigger Detection &rarr;</span>
          </button>

          {/* 3. Machine Proximity */}
          <button
            onClick={() => runSafetyScenario('machinery-proximity')}
            className={`p-3 rounded-md border text-left transition flex flex-col justify-between space-y-2 ${
              activeScenario === 'machinery-proximity'
                ? 'bg-sky-50 border-sky-600 ring-1 ring-sky-600'
                : 'bg-white hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">3. Machine Proximity</span>
              <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                HIGH RISK
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Worker within 1.2m collision envelope of operating hydraulic excavator slew arm.
            </p>
            <span className="text-[10px] font-mono text-sky-700 font-bold">Trigger Detection &rarr;</span>
          </button>

          {/* 4. Possible Fall */}
          <button
            onClick={() => runSafetyScenario('possible-fall')}
            className={`p-3 rounded-md border text-left transition flex flex-col justify-between space-y-2 ${
              activeScenario === 'possible-fall'
                ? 'bg-sky-50 border-sky-600 ring-1 ring-sky-600'
                : 'bg-white hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">4. Possible Fall Hazard</span>
              <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                CRITICAL
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Unharnessed worker leaning within 0.8m of unprotected leading slab edge.
            </p>
            <span className="text-[10px] font-mono text-sky-700 font-bold">Trigger Detection &rarr;</span>
          </button>

          {/* 5. Multi-Zone Risk */}
          <button
            onClick={() => runSafetyScenario('multiple-risks')}
            className={`p-3 rounded-md border text-left transition flex flex-col justify-between space-y-2 ${
              activeScenario === 'multiple-risks'
                ? 'bg-sky-50 border-sky-600 ring-1 ring-sky-600'
                : 'bg-white hover:bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">5. Multi-Zone Risk</span>
              <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                MULTI-CAM
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Concurrent structural pin anomaly and machinery perimeter violation across streams.
            </p>
            <span className="text-[10px] font-mono text-sky-700 font-bold">Trigger Detection &rarr;</span>
          </button>
        </div>
      </div>

      {/* Computer Vision & Media Gateway Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CV Inference Parameters */}
        <div className="vg-card p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5 pb-2 border-b border-slate-200">
            <Sliders className="w-3.5 h-3.5 text-slate-700" />
            Computer Vision Inference Parameters
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1 text-slate-700 font-medium">
                <span>Minimum Confidence Threshold</span>
                <strong className="font-mono text-slate-900">{settings.confidenceThreshold}%</strong>
              </div>
              <input
                type="range"
                min="60"
                max="98"
                step="2"
                value={settings.confidenceThreshold}
                onChange={(e) => handleChange('confidenceThreshold', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-sky-600"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Target inference threshold before triggering automated supervisor alerts.
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="text-slate-800 font-bold block">Live Bounding Box Overlays</span>
                <span className="text-[11px] text-slate-500">Render spatial defect boxes on CCTV canvas.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.showCoordinatesOnScan}
                onChange={() => handleToggle('showCoordinatesOnScan')}
                className="w-4 h-4 accent-sky-600"
              />
            </div>
          </div>
        </div>

        {/* Audio Alerts & Ingestion Pipeline */}
        <div className="vg-card p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5 pb-2 border-b border-slate-200">
            <Bell className="w-3.5 h-3.5 text-slate-700" />
            Audio Siren & Ingestion Pipeline
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-800 font-bold block">Audible Field Siren / Chime</span>
                <span className="text-[11px] text-slate-500">Play web audio siren on Critical incidents.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.browserAudioAlerts}
                onChange={() => handleToggle('browserAudioAlerts')}
                className="w-4 h-4 accent-sky-600"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block text-[10px] font-mono uppercase">Media Ingestion Pipeline</span>
              <span className="font-mono text-slate-800 font-bold">{settings.mediaGatewayProtocol}</span>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block text-[10px] font-mono uppercase">Measured Target Latency</span>
              <span className="font-mono text-emerald-700 font-bold">{settings.targetInferenceLatency} (Sub-100ms)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

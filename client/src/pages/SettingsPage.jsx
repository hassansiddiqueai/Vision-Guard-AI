import React, { useState } from 'react';
import { useInspections } from '../context/InspectionContext';
import {
  Bell,
  Sliders,
  CheckCircle2,
  RotateCcw,
  Shield,
  Layers,
} from 'lucide-react';

export const SettingsPage = () => {
  const { resetDemo } = useInspections();
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
      confidenceThreshold: 75,
      defaultSite: 'Apex Tower Project',
    };
  });

  const [savedFeedback, setSavedFeedback] = useState(false);

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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            System & Optical Engine Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure computer vision neural thresholds, virtual zone alerts, and system parameters.
          </p>
        </div>

        {savedFeedback && (
          <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settings Saved</span>
          </span>
        )}
      </div>

      {/* Vision Engine Settings */}
      <div className="vg-card p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-slate-700" />
          <span>Computer Vision Detection Parameters</span>
        </h2>

        <div className="space-y-4 text-xs pt-2 border-t border-slate-200">
          <div>
            <div className="flex justify-between mb-1.5 text-slate-700">
              <span className="font-medium">Minimum Neural Confidence Filter Threshold</span>
              <strong className="font-mono text-slate-900">{settings.confidenceThreshold}%</strong>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={settings.confidenceThreshold}
              onChange={(e) => handleChange('confidenceThreshold', Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-sky-600"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Detections below this threshold require human supervisory confirmation before escalation.
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span className="text-slate-800 font-medium block">Live Bounding Box Overlays</span>
              <span className="text-[11px] text-slate-500">Render spatial defect bounding frames over CCTV stream canvases.</span>
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

      {/* Notification Alerts */}
      <div className="vg-card p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-700" />
          <span>Audio Alert Configuration</span>
        </h2>

        <div className="space-y-3 text-xs pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-800 font-medium block">Audible Field Siren / Warning Chimes</span>
              <span className="text-[11px] text-slate-500">Play web audio notification sound upon Critical or High risk detection events.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.browserAudioAlerts}
              onChange={() => handleToggle('browserAudioAlerts')}
              className="w-4 h-4 accent-sky-600"
            />
          </div>
        </div>
      </div>

      {/* Demo Maintenance */}
      <div className="vg-card p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-slate-700" />
          <span>Hackathon Demo Data Management</span>
        </h2>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
          <div>
            <span className="text-slate-800 font-medium block">Reset Application Demo State</span>
            <span className="text-[11px] text-slate-500">Restore default seed inspections, live streams, and incident registers.</span>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset all demo state to default baseline?')) {
                resetDemo();
                alert('Demo state reset successfully.');
              }
            }}
            className="vg-btn-secondary text-xs"
          >
            Reset Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};


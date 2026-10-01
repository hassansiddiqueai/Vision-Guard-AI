import React, { useState } from 'react';
import { useInspections } from '../context/InspectionContext';
import {
  Bell,
  Eye,
  Sliders,
  CheckCircle2,
  RotateCcw,
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
      defaultSite: 'Apex Tower — Zone B',
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
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#243247]">
        <div>
          <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#F1F5F9] tracking-tight">
            Settings
          </h1>
          <p className="text-[13px] text-[#94A3B8] mt-0.5">
            Configure system parameters, alert thresholds, and operational preferences.
          </p>
        </div>

        {savedFeedback && (
          <span className="text-[12px] text-[#22C55E] font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Saved</span>
          </span>
        )}
      </div>

      {/* Vision Engine Settings */}
      <div className="vg-card p-4 space-y-3">
        <h2 className="text-[14px] font-semibold text-[#F1F5F9] flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#22C7E8]" />
          <span>Vision Engine Parameters</span>
        </h2>

        <div className="space-y-3 text-[13px] pt-1 border-t border-[#243247]">
          <div>
            <div className="flex justify-between mb-1 text-[#94A3B8]">
              <span>Minimum Confidence Threshold</span>
              <strong className="text-[#F1F5F9] font-mono">{settings.confidenceThreshold}%</strong>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={settings.confidenceThreshold}
              onChange={(e) => handleChange('confidenceThreshold', Number(e.target.value))}
              className="w-full h-1.5 bg-[#0B1220] rounded appearance-none cursor-pointer accent-[#22C7E8]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-[#F1F5F9] font-medium block">Show Bounding Box Annotations</span>
              <span className="text-[11px] text-[#94A3B8]">Display spatial defect labels directly over visual canvas.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showCoordinatesOnScan}
              onChange={() => handleToggle('showCoordinatesOnScan')}
              className="w-4 h-4 accent-[#22C7E8]"
            />
          </div>
        </div>
      </div>

      {/* Notification Alerts */}
      <div className="vg-card p-4 space-y-3">
        <h2 className="text-[14px] font-semibold text-[#F1F5F9] flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#22C7E8]" />
          <span>Alert Notifications</span>
        </h2>

        <div className="space-y-3 text-[13px] pt-1 border-t border-[#243247]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[#F1F5F9] font-medium block">Web Audio Hazard Chimes</span>
              <span className="text-[11px] text-[#94A3B8]">Sound audible chimes when Critical or High risks are detected.</span>
            </div>
            <input
              type="checkbox"
              checked={settings.browserAudioAlerts}
              onChange={() => handleToggle('browserAudioAlerts')}
              className="w-4 h-4 accent-[#22C7E8]"
            />
          </div>
        </div>
      </div>

      {/* Demo Maintenance */}
      <div className="vg-card p-4 space-y-3">
        <h2 className="text-[14px] font-semibold text-[#F1F5F9] flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-[#22C7E8]" />
          <span>Demo Data Maintenance</span>
        </h2>

        <div className="flex items-center justify-between pt-1 border-t border-[#243247] text-[13px]">
          <div>
            <span className="text-[#F1F5F9] font-medium block">Reset Application Demo State</span>
            <span className="text-[11px] text-[#94A3B8]">Restore seed inspections, incidents, and camera statuses to default baseline.</span>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset all demo state to default?')) {
                resetDemo();
                alert('Demo state reset successfully.');
              }
            }}
            className="vg-btn-secondary text-[12px]"
          >
            Reset Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};

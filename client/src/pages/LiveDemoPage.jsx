import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import { DEMO_SCENARIOS } from '../services/visionEngine';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Camera,
} from 'lucide-react';

export const LiveDemoPage = () => {
  const { triggerHazardAlert } = useInspections();
  const [selectedScenarioKey, setSelectedScenarioKey] = useState('PPE_VIOLATION');
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [timeline, setTimeline] = useState([
    { id: 1, time: '13:45:10', text: 'Worker detected in work zone', type: 'INFO' },
    { id: 2, time: '13:45:12', text: 'Missing helmet flagged (confidence 94%)', type: 'HIGH' },
    { id: 3, time: '13:45:15', text: 'Hazard alert generated', type: 'ALERT' },
  ]);

  const activeScenario = DEMO_SCENARIOS[selectedScenarioKey] || DEMO_SCENARIOS.PPE_VIOLATION;

  const handleScenarioChange = (key) => {
    setSelectedScenarioKey(key);
    const scen = DEMO_SCENARIOS[key];
    const now = new Date().toLocaleTimeString();

    setTimeline((prev) => [
      { id: Date.now(), time: now, text: `Triggered: ${scen.title}`, type: scen.riskLevel === 'SAFE' ? 'INFO' : 'ALERT' },
      ...prev.slice(0, 6),
    ]);

    if (scen.riskLevel !== 'SAFE') {
      triggerHazardAlert({
        hazard: scen.title,
        severity: scen.riskLevel,
        riskScore: scen.riskScore,
        description: scen.description,
        location: 'Demo Zone B',
      });
    }
  };

  const handleReset = () => {
    setSelectedScenarioKey('PPE_VIOLATION');
    setTimeline([
      { id: 1, time: new Date().toLocaleTimeString(), text: 'Pipeline reset to default baseline', type: 'INFO' },
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#243247]">
        <div>
          <h1 className="text-[22px] sm:text-[24px] font-semibold text-[#F1F5F9] tracking-tight">
            Live Safety Inspection Demo
          </h1>
          <p className="text-[13px] text-[#94A3B8] mt-0.5">
            Real-time visual safety analysis, hazard overlays, and detection timeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAnalyzing(!isAnalyzing)}
            className="vg-btn-secondary"
          >
            {isAnalyzing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#22C7E8]" />}
            <span>{isAnalyzing ? 'Pause Analysis' : 'Resume Analysis'}</span>
          </button>
          <button onClick={handleReset} className="vg-btn-secondary">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Video Viewport + Detections & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 8 Cols: Video Feed */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative aspect-video rounded-lg bg-[#0B1220] border border-[#243247] overflow-hidden flex items-center justify-center">
            <img
              src="https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop"
              alt="Demo feed"
              className="w-full h-full object-cover opacity-85"
            />

            <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-[#0B1220]/90 to-transparent flex items-center justify-between text-[12px] font-mono">
              <span className="text-[#22C7E8] font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                Camera connected (Simulation)
              </span>
              <span className="text-[#94A3B8]">1080p · 24 FPS</span>
            </div>

            {/* Bounding Box Overlays */}
            {isAnalyzing &&
              activeScenario.detections.map((det) => (
                <div
                  key={det.id}
                  className={`absolute pointer-events-none border-2 rounded ${
                    det.severity === 'CRITICAL'
                      ? 'border-[#EF4444] bg-[#EF4444]/10'
                      : det.severity === 'HIGH'
                      ? 'border-[#F59E0B] bg-[#F59E0B]/10'
                      : 'border-[#22C55E] bg-[#22C55E]/10'
                  }`}
                  style={{
                    top: `${det.box.top}%`,
                    left: `${det.box.left}%`,
                    width: `${det.box.width}%`,
                    height: `${det.box.height}%`,
                  }}
                >
                  <div
                    className={`absolute -top-5 left-0 px-1.5 py-0.2 font-mono text-[10px] font-semibold rounded ${
                      det.severity === 'CRITICAL'
                        ? 'bg-[#EF4444] text-white'
                        : det.severity === 'HIGH'
                        ? 'bg-[#F59E0B] text-[#0B1220]'
                        : 'bg-[#22C55E] text-white'
                    }`}
                  >
                    {det.label} · {det.confidence}%
                  </div>
                </div>
              ))}
          </div>

          {/* Scenario Selector */}
          <div className="vg-card p-3 space-y-2">
            <span className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider block">
              Trigger Demo Scenarios
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {Object.keys(DEMO_SCENARIOS).map((key) => {
                const scen = DEMO_SCENARIOS[key];
                const isSelected = selectedScenarioKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleScenarioChange(key)}
                    className={`py-1.5 px-2 rounded text-[12px] text-left transition ${
                      isSelected
                        ? 'bg-[#1E293B] border border-[#22C7E8] text-[#F1F5F9] font-medium'
                        : 'bg-[#0B1220] border border-[#243247] text-[#94A3B8] hover:text-[#F1F5F9]'
                    }`}
                  >
                    <span className="block font-medium truncate">{scen.title.split(' ')[0]} {scen.title.split(' ')[1]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Detections & Event Timeline */}
        <div className="lg:col-span-4 space-y-3">
          {/* Detected Hazards */}
          <div className="vg-card p-4 space-y-2.5">
            <h2 className="text-[14px] font-semibold text-[#F1F5F9]">Detected Hazards</h2>
            <div className="space-y-2">
              {activeScenario.detections.map((d) => (
                <div key={d.id} className="p-2.5 rounded bg-[#0B1220] border border-[#243247] text-[12px]">
                  <div className="flex justify-between font-medium text-[#F1F5F9]">
                    <span>{d.label}</span>
                    <span className="text-[#22C7E8] font-mono">{d.confidence}%</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">{d.evidence}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Event Timeline */}
          <div className="vg-card p-4 space-y-2.5">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#64748B]" />
              <h2 className="text-[14px] font-semibold text-[#F1F5F9]">Event Timeline</h2>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto text-[11px] font-mono">
              {timeline.map((evt) => (
                <div key={evt.id} className="p-1.5 rounded bg-[#0B1220] border border-[#243247] text-[#94A3B8] flex items-center justify-between">
                  <span className="text-[#64748B]">{evt.time}</span>
                  <span className={evt.type === 'ALERT' ? 'text-[#EF4444] font-semibold' : 'text-[#F1F5F9]'}>
                    {evt.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

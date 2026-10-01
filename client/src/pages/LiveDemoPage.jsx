import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import { DEMO_SCENARIOS } from '../services/visionEngine';
import {
  Camera,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Sliders,
  ExternalLink,
} from 'lucide-react';

export const LiveDemoPage = () => {
  const { triggerHazardAlert } = useInspections();
  const [selectedScenarioKey, setSelectedScenarioKey] = useState('PPE_VIOLATION');
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [timeline, setTimeline] = useState([
    { id: 1, time: '13:45:10', text: 'Worker detected in elevation zone', type: 'INFO' },
    { id: 2, time: '13:45:12', text: 'Hard hat absence detected (confidence: 94%)', type: 'HIGH' },
    { id: 3, time: '13:45:15', text: 'High-risk PPE violation alert generated', type: 'ALERT' },
  ]);

  const activeScenario = DEMO_SCENARIOS[selectedScenarioKey] || DEMO_SCENARIOS.PPE_VIOLATION;

  const handleScenarioChange = (key) => {
    setSelectedScenarioKey(key);
    const scen = DEMO_SCENARIOS[key];
    const now = new Date().toLocaleTimeString();

    setTimeline((prev) => [
      { id: Date.now(), time: now, text: `Triggered: ${scen.title}`, type: scen.riskLevel === 'SAFE' ? 'INFO' : 'ALERT' },
      ...prev.slice(0, 8),
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
      { id: 1, time: new Date().toLocaleTimeString(), text: 'Demo pipeline reset to initial baseline', type: 'INFO' },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Interactive Demonstration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Live Computer Vision Demonstration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time visual safety analysis, spatial bounding box inferencing, and alert timeline telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAnalyzing(!isAnalyzing)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
          >
            {isAnalyzing ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            <span>{isAnalyzing ? 'Pause Analysis' : 'Resume Analysis'}</span>
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Feed + Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Video Simulation HUD */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center group">
            <img
              src="https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop"
              alt="Demo stream"
              className="w-full h-full object-cover opacity-85"
            />

            {/* Crosshair Viewfinder */}
            <div className="absolute inset-0 pointer-events-none border border-slate-700/30">
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-sky-400" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-sky-400" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-sky-400" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-sky-400" />
            </div>

            {/* Top Bar */}
            <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-slate-950/90 to-transparent flex items-center justify-between font-mono text-[11px] text-slate-200">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/40 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                LIVE VISUAL FEED
              </span>
              <span className="text-slate-400">1440p • 30 FPS • 28ms</span>
            </div>

            {/* Bounding Boxes */}
            {isAnalyzing &&
              activeScenario.detections.map((det) => (
                <div
                  key={det.id}
                  className={`absolute pointer-events-none border-2 rounded ${
                    det.severity === 'CRITICAL'
                      ? 'border-rose-500 bg-rose-500/10'
                      : det.severity === 'HIGH'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-emerald-500 bg-emerald-500/10'
                  }`}
                  style={{
                    top: `${det.box.top}%`,
                    left: `${det.box.left}%`,
                    width: `${det.box.width}%`,
                    height: `${det.box.height}%`,
                  }}
                >
                  <div
                    className={`absolute -top-6 left-0 px-2 py-0.5 font-mono text-[10px] font-bold rounded ${
                      det.severity === 'CRITICAL'
                        ? 'bg-rose-600 text-white'
                        : det.severity === 'HIGH'
                        ? 'bg-amber-600 text-slate-950'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {det.label} [{det.confidence}%]
                  </div>
                </div>
              ))}
          </div>

          {/* Scenario Selector */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase font-mono text-slate-400">
              Select Demo Scenario
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {Object.keys(DEMO_SCENARIOS).map((key) => {
                const scen = DEMO_SCENARIOS[key];
                const isSelected = selectedScenarioKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleScenarioChange(key)}
                    className={`p-2 rounded-lg border text-left text-xs transition ${
                      isSelected
                        ? 'bg-slate-800 border-sky-400 text-white font-bold'
                        : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-[10px] block font-mono text-slate-500 mb-0.5">
                      {scen.category}
                    </span>
                    <span className="truncate block">{scen.title.split(' ')[0]} {scen.title.split(' ')[1]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Detections & Event Timeline */}
        <div className="lg:col-span-4 space-y-4">
          {/* AI Detections */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase font-mono text-slate-200">
              AI Visual Detections
            </h3>
            <div className="space-y-2">
              {activeScenario.detections.map((d) => (
                <div key={d.id} className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 text-xs">
                  <div className="flex justify-between font-bold text-slate-200">
                    <span>{d.label}</span>
                    <span className="font-mono text-sky-400">{d.confidence}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{d.evidence}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Event Timeline */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-bold uppercase font-mono text-slate-200">
                Detection Event Timeline
              </h3>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
              {timeline.map((evt) => (
                <div
                  key={evt.id}
                  className="p-2 rounded-lg bg-slate-950 border border-slate-850 text-slate-300 font-mono text-[11px] flex items-start gap-2"
                >
                  <span className="text-slate-500 shrink-0">{evt.time}</span>
                  <span className={evt.type === 'ALERT' ? 'text-rose-400 font-bold' : 'text-slate-300'}>
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

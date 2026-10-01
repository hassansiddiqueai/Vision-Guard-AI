import React from 'react';
import { Play, RotateCcw, AlertTriangle, Shield, HardHat, Footprints, AlertOctagon, Layers } from 'lucide-react';
import { useInspections } from '../../context/InspectionContext';

export const DemoScenarioToolbar = () => {
  const { runSafetyScenario, resetDemo, activeScenario } = useInspections();

  const scenarios = [
    { key: 'ppe-violation', label: '1. PPE Violation', icon: HardHat, desc: 'Missing Helmet & Vest' },
    { key: 'restricted-zone', label: '2. Restricted Area', icon: AlertOctagon, desc: 'Crane Zone Entry' },
    { key: 'machinery-proximity', label: '3. Machine Proximity', icon: AlertTriangle, desc: 'Worker < 1.2m' },
    { key: 'possible-fall', label: '4. Possible Fall', icon: Footprints, desc: 'Unharnessed Scaffold' },
    { key: 'multiple-risks', label: '5. Multi-Zone Risks', icon: Layers, desc: 'Concurrent Hazards' },
  ];

  return (
    <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-slate-200 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
            DEMO MODE
          </span>
          <span className="text-xs text-slate-600">
            Run realistic simulated safety incidents across live streams:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isActive = activeScenario === sc.key;
            return (
              <button
                key={sc.key}
                onClick={() => runSafetyScenario(sc.key)}
                title={sc.desc}
                className={`text-xs px-2.5 py-1.5 rounded flex items-center gap-1.5 transition ${
                  isActive
                    ? 'bg-red-600 text-white font-semibold'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sc.label}</span>
              </button>
            );
          })}

          <button
            onClick={resetDemo}
            title="Reset Simulated State"
            className="text-xs px-2.5 py-1.5 rounded bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 flex items-center gap-1.5 transition ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

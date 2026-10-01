import {
  Bell,
  Eye,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export const SettingsPage = () => {
  // Load real persistent settings from localStorage
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('vg_app_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      // Appearance
      theme: 'dark-first',
      showCoordinatesOnScan: true,
      highContrastAnnotations: true,
      compactView: false,

      // Notifications
      notifyCriticalHazards: true,
      notifyDailyDigest: false,
      browserAudioAlerts: false,

      // Vision Engine
      confidenceThreshold: 75,
      defaultCategory: 'Workplace Safety',
      autoScanOnUpload: false,
    };
  });

  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleToggle = (key) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('vg_app_settings', JSON.stringify(updated));
      return updated;
    });
    showSaveIndicator();
  };

  const handleChange = (key, value) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem('vg_app_settings', JSON.stringify(updated));
      return updated;
    });
    showSaveIndicator();
  };

  const showSaveIndicator = () => {
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-850">
        <div>
          <h2 className="text-2xl font-bold font-display text-white">
            System & Engine Settings
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure visual inspection parameters, notification triggers, and user interface preferences.
          </p>
        </div>

        {savedFeedback && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono animate-fade-in">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>PREFERENCES PERSISTED</span>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Section 1: Appearance & Visual HUD */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Eye className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-200">
              Visual HUD & Display Preferences
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  Show Spatial Coordinates on Inspection Canvas
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Render live bounding box labels and detection tags on analyzed images.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('showCoordinatesOnScan')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.showCoordinatesOnScan ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                    settings.showCoordinatesOnScan ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-850">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  High-Contrast Hazard Overlays
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enforces maximum contrast neon outlines on Critical & High severity regions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('highContrastAnnotations')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.highContrastAnnotations ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                    settings.highContrastAnnotations ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Vision AI Inference Engine Config */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-200">
              Vision AI Engine Tuning
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-slate-300 font-semibold">Minimum Confidence Cutoff Filter</span>
                <span className="text-cyan-400 font-bold">{settings.confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={settings.confidenceThreshold}
                onChange={(e) => handleChange('confidenceThreshold', parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer bg-slate-950 rounded-lg h-2"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Detections with confidence below {settings.confidenceThreshold}% will be suppressed from immediate critical alerts.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-850">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Default Audit Category Preset
              </label>
              <select
                value={settings.defaultCategory}
                onChange={(e) => handleChange('defaultCategory', e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs text-slate-300 font-mono"
              >
                <option value="Workplace Safety">Workplace Safety & PPE</option>
                <option value="Construction">Construction & Scaffolding</option>
                <option value="Equipment">Heavy Equipment & Machinery</option>
                <option value="Infrastructure">Infrastructure & Facilities</option>
                <option value="Other">General Visual Audit</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Notification Alerts */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-200">
              Notifications & Hazard Dispatch
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  Instant Alerts for Critical Hazards
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Trigger high-priority alert banners when an inspection scores Critical risk.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('notifyCriticalHazards')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.notifyCriticalHazards ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                    settings.notifyCriticalHazards ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-850">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  Audio Cue upon Scan Completion
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Play subtle telemetry chime when the neural pipeline finishes processing an image.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('browserAudioAlerts')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.browserAudioAlerts ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                    settings.browserAudioAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * VisionGuard Industrial Risk Scoring & Safety Engine
 * Deterministic multi-factor risk evaluator, severity classifier, and action mapper.
 */

export const DETECTION_CATEGORIES = {
  PEOPLE: 'People & Worker Presence',
  PPE: 'Personal Protective Equipment',
  FALL: 'Fall & Elevation Safety',
  CONSTRUCTION_HAZARDS: 'Construction & Environmental Hazards',
  MACHINERY: 'Heavy Machinery & Vehicles',
  FIRE_SMOKE: 'Fire & Thermal Anomalies',
  ELECTRICAL: 'Electrical & Working Clearances',
  SECURITY: 'Perimeter & Restricted Access',
};

export const SEVERITY_LEVELS = {
  CRITICAL: {
    label: 'CRITICAL',
    weight: 100,
    color: '#f43f5e',
    textColor: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30',
  },
  HIGH: {
    label: 'HIGH',
    weight: 75,
    color: '#f59e0b',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
  MEDIUM: {
    label: 'MEDIUM',
    weight: 50,
    color: '#eab308',
    textColor: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
  },
  LOW: {
    label: 'LOW',
    weight: 25,
    color: '#06b6d4',
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
  },
  SAFE: {
    label: 'SAFE',
    weight: 0,
    color: '#10b981',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
};

/**
 * Calculates a composite 0-100 Site Safety Score
 * @param {Object} metrics
 */
export const calculateSiteSafetyScore = ({
  ppeComplianceRate = 92,
  criticalHazards = 0,
  openIncidents = 0,
  resolvedIncidents = 5,
  inspectionFrequencyScore = 95,
}) => {
  // Base 100 with deduction penalties
  let score = 100;

  // Deduct for critical hazards (12 pts each)
  score -= criticalHazards * 12;

  // Deduct for open unassigned incidents (4 pts each)
  score -= openIncidents * 4;

  // Penalty for low PPE compliance below 95%
  if (ppeComplianceRate < 95) {
    score -= (95 - ppeComplianceRate) * 1.2;
  }

  // Bonus for resolution throughput
  score += Math.min(resolvedIncidents * 1.5, 8);

  // Inspection frequency weighting
  score = score * 0.85 + inspectionFrequencyScore * 0.15;

  return Math.max(10, Math.min(99, Math.round(score)));
};

/**
 * Deterministic Hazard Risk Calculator
 */
export const evaluateRisk = (hazardType, confidence = 95) => {
  const hazardDefinitions = {
    // PPE Violations
    'Missing Helmet': {
      category: 'PPE',
      severity: 'HIGH',
      baseScore: 84,
      complianceRef: 'OSHA 1926.100 Head Protection',
      description: 'Worker detected in active elevation zone without required impact helmet.',
      recommendedAction: 'Halt worker entry and supply ANSI Z89.1 certified head protection immediately.',
    },
    'Missing Safety Vest': {
      category: 'PPE',
      severity: 'MEDIUM',
      baseScore: 65,
      complianceRef: 'OSHA 1926.201 Signaling & High-Vis',
      description: 'Personnel in vehicular traffic zone lacking high-visibility Class 2 reflective garment.',
      recommendedAction: 'Equip worker with reflective safety vest before entering forklift aisle.',
    },
    'Unsecured Harness': {
      category: 'FALL',
      severity: 'CRITICAL',
      baseScore: 96,
      complianceRef: 'OSHA 1926.501 Fall Protection',
      description: 'Worker at elevated perimeter with detached or unlatched lanyard carabiner.',
      recommendedAction: 'Mandate immediate 100% tie-off to certified overhead anchorage line.',
    },
    'Restricted Zone Intrusion': {
      category: 'SECURITY',
      severity: 'CRITICAL',
      baseScore: 94,
      complianceRef: 'OSHA 1910.147 / Site Perimeter Rule',
      description: 'Unauthorized worker detected inside active crane swing radius / restricted area.',
      recommendedAction: 'Sound zone warning horn and evacuate personnel to safe muster perimeter.',
    },
    'Forklift Proximity Warning': {
      category: 'MACHINERY',
      severity: 'HIGH',
      baseScore: 88,
      complianceRef: 'OSHA 1910.178 Powered Industrial Trucks',
      description: 'Pedestrian worker within 2-meter blind spot of operating heavy forklift.',
      recommendedAction: 'Signal vehicle operator to stop and establish 3-meter pedestrian clearance.',
    },
    'Worker Fall / Immobility': {
      category: 'FALL',
      severity: 'CRITICAL',
      baseScore: 99,
      complianceRef: 'OSHA 1926 General Duty Clause',
      description: 'Rapid elevation drop or horizontal immobility signature detected on floor plane.',
      recommendedAction: 'Dispatch site emergency first responder to exact grid sector immediately.',
    },
    'Thermal Anomaly / Smoke': {
      category: 'FIRE_SMOKE',
      severity: 'CRITICAL',
      baseScore: 97,
      complianceRef: 'NFPA 1 / OSHA 1926.150 Fire Protection',
      description: 'Visual particulate plume and thermal contrast signature isolated in facility quadrant.',
      recommendedAction: 'Verify sprinkler valve line and initiate section fire alarm verification.',
    },
    'Missing Scaffolding Lock Pin': {
      category: 'CONSTRUCTION_HAZARDS',
      severity: 'CRITICAL',
      baseScore: 98,
      complianceRef: 'OSHA 1926.451(a)(1) Scaffold Framework',
      description: 'Structural coupling anomaly: diagonal brace lock pin missing on tier upright.',
      recommendedAction: 'Tag scaffold red (DO NOT USE) and install certified lock fastener.',
    },
    'Exposed Machine Pulley': {
      category: 'MACHINERY',
      severity: 'HIGH',
      baseScore: 82,
      complianceRef: 'OSHA 1910.212 Machine Guarding',
      description: 'Exposed rotating belt drive assembly without physical protective grating.',
      recommendedAction: 'Lockout equipment and bolt fixed safety barrier cover.',
    },
    'Uncapped Rebar Dowels': {
      category: 'CONSTRUCTION_HAZARDS',
      severity: 'CRITICAL',
      baseScore: 95,
      complianceRef: 'OSHA 1926.701(b) Concrete Rebar',
      description: 'Vertical protruding cut-steel dowels in access trench without impalement caps.',
      recommendedAction: 'Install OSHA-compliant steel-reinforced mushroom safety caps on all dowels.',
    },
    'PPE Verified Compliant': {
      category: 'PPE',
      severity: 'SAFE',
      baseScore: 10,
      complianceRef: 'OSHA 1926 Safety Standard',
      description: 'Helmet, high-visibility vest, and safety boots verified active.',
      recommendedAction: 'Standard monitoring. No corrective remediation needed.',
    },
  };

  const def = hazardDefinitions[hazardType] || {
    category: 'GENERAL',
    severity: 'MEDIUM',
    baseScore: 60,
    complianceRef: 'Applicable Workplace Safety Standard',
    description: `Visual anomaly detected: ${hazardType}`,
    recommendedAction: 'Inspect work area and verify safety compliance standard.',
  };

  const riskScore = Math.min(100, Math.round((def.baseScore * (confidence / 100)) + 5));

  return {
    ...def,
    type: hazardType,
    confidence: Math.round(confidence),
    riskScore,
    timestamp: new Date().toISOString(),
  };
};

/**
 * Web Audio API synthesizer for clean industrial chimes and alarm alerts.
 * Works seamlessly in any modern browser without needing external assets.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playCriticalAlert() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio feedback unavailable', e);
    }
  }

  playWarningChime() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}

export const soundEngine = new SoundEngine();

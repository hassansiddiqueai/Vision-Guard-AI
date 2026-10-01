/**
 * VisionGuard Computer Vision & Edge Inferencing Engine
 * Supports Live Camera stream processing, bounding-box tracking,
 * and deterministic demo simulation scenarios with evidence capture.
 */

import { evaluateRisk } from './riskEngine';

export const DEMO_SCENARIOS = {
  PPE_VIOLATION: {
    id: 'PPE_VIOLATION',
    title: 'Missing Helmet & PPE Non-Compliance',
    category: 'PPE',
    riskLevel: 'HIGH',
    riskScore: 86,
    description: 'Worker detected in active scaffolding zone without required ANSI impact helmet.',
    detections: [
      {
        id: 'DET-PPE-01',
        label: 'NO HELMET',
        object: 'Person (Worker)',
        severity: 'HIGH',
        confidence: 93.8,
        riskScore: 86,
        box: { top: 18, left: 38, width: 24, height: 58 },
        subBoxes: [
          { label: 'HEAD (UNPROTECTED)', top: 18, left: 44, width: 12, height: 14, severity: 'HIGH' }
        ],
        evidence: 'Exposed hair/head without hard hat in overhead hazard zone.',
        complianceRef: 'OSHA 1926.100 Head Protection',
        recommendedAction: 'Halt work and supply ANSI Z89.1 certified helmet before worker proceeds.',
      },
      {
        id: 'DET-PPE-02',
        label: 'SAFETY VEST DETECTED',
        object: 'Hi-Vis Vest',
        severity: 'SAFE',
        confidence: 97.2,
        riskScore: 12,
        box: { top: 34, left: 41, width: 18, height: 26 },
        evidence: 'Class 2 fluorescent vest detected and verified.',
        complianceRef: 'OSHA 1926.201 High-Vis Standard',
        recommendedAction: 'No action needed. Compliant.',
      }
    ]
  },

  PROPER_PPE: {
    id: 'PROPER_PPE',
    title: 'Full PPE Compliance Verified',
    category: 'PPE',
    riskLevel: 'SAFE',
    riskScore: 15,
    description: 'Worker equipped with approved helmet, high-vis vest, and harness.',
    detections: [
      {
        id: 'DET-SAFE-01',
        label: 'HELMET VERIFIED',
        object: 'Hard Hat (ANSI)',
        severity: 'SAFE',
        confidence: 98.6,
        riskScore: 10,
        box: { top: 16, left: 42, width: 16, height: 14 },
        evidence: 'Certified white hard hat detected with secure chin strap.',
        complianceRef: 'OSHA 1926.100 Compliant',
        recommendedAction: 'Standard monitoring.',
      },
      {
        id: 'DET-SAFE-02',
        label: 'HI-VIS VEST VERIFIED',
        object: 'Safety Vest',
        severity: 'SAFE',
        confidence: 99.1,
        riskScore: 8,
        box: { top: 30, left: 39, width: 22, height: 32 },
        evidence: 'Retroreflective striping and high-vis fabric confirmed.',
        complianceRef: 'OSHA 1926.201 Compliant',
        recommendedAction: 'Standard monitoring.',
      }
    ]
  },

  RESTRICTED_ZONE: {
    id: 'RESTRICTED_ZONE',
    title: 'Restricted Exclusion Zone Intrusion',
    category: 'SECURITY',
    riskLevel: 'CRITICAL',
    riskScore: 94,
    description: 'Personnel detected crossing perimeter barrier into high-voltage crane swing radius.',
    detections: [
      {
        id: 'DET-ZONE-01',
        label: 'ZONE INTRUSION',
        object: 'Unauthorized Worker',
        severity: 'CRITICAL',
        confidence: 96.4,
        riskScore: 94,
        box: { top: 25, left: 45, width: 30, height: 60 },
        evidence: 'Worker crossed virtual tripwire into 50-ton mobile crane rotation path.',
        complianceRef: 'OSHA 1926.1424 Crane Swing Radius Clearance',
        recommendedAction: 'Stop crane rotation immediately and clear the exclusion radius.',
      }
    ]
  },

  MACHINERY_RISK: {
    id: 'MACHINERY_RISK',
    title: 'Forklift & Pedestrian Unsafe Proximity',
    category: 'MACHINERY',
    riskLevel: 'HIGH',
    riskScore: 89,
    description: 'Pedestrian worker within 1.6-meter proximity of moving heavy forklift.',
    detections: [
      {
        id: 'DET-MACH-01',
        label: 'UNSAFE PROXIMITY (1.6m)',
        object: 'Forklift + Worker Proximity',
        severity: 'HIGH',
        confidence: 94.2,
        riskScore: 89,
        box: { top: 22, left: 20, width: 62, height: 55 },
        evidence: 'Pedestrian in blind zone behind reversing 5000lb pneumatic forklift.',
        complianceRef: 'OSHA 1910.178 Powered Industrial Trucks',
        recommendedAction: 'Sound reverse beacon and establish 3-meter minimum safety separation.',
      }
    ]
  },

  FALL_DETECTION: {
    id: 'FALL_DETECTION',
    title: 'Worker Fall / Immobility Detected',
    category: 'FALL',
    riskLevel: 'CRITICAL',
    riskScore: 99,
    description: 'Sudden vertical descent trajectory followed by static prone posture on deck.',
    detections: [
      {
        id: 'DET-FALL-01',
        label: 'WORKER DOWN / FALL',
        object: 'Fallen Person',
        severity: 'CRITICAL',
        confidence: 98.9,
        riskScore: 99,
        box: { top: 52, left: 28, width: 48, height: 32 },
        evidence: 'Horizontal body alignment at ground plane with zero motion vector over 10s.',
        complianceRef: 'OSHA General Duty Clause Sec 5(a)(1)',
        recommendedAction: 'Dispatch site first aid response team to Sector 4 platform immediately.',
      }
    ]
  },

  FIRE_SMOKE: {
    id: 'FIRE_SMOKE',
    title: 'Thermal Plume & Smoke Hazard',
    category: 'FIRE_SMOKE',
    riskLevel: 'CRITICAL',
    riskScore: 97,
    description: 'Visual particulate plume rising from electrical distribution cabinet.',
    detections: [
      {
        id: 'DET-FIRE-01',
        label: 'SMOKE PLUME DETECTED',
        object: 'Smoke Plume',
        severity: 'CRITICAL',
        confidence: 97.5,
        riskScore: 97,
        box: { top: 15, left: 32, width: 36, height: 45 },
        evidence: 'Dynamic gray vapor diffusion pattern with rapid volumetric expansion.',
        complianceRef: 'NFPA 1 Fire Code / OSHA 1926.150',
        recommendedAction: 'Isolate main breaker 4B and verify fire suppression deployment.',
      }
    ]
  }
};

/**
 * Capture high-resolution image snapshot from video or canvas
 */
export const captureEvidenceFrame = (videoElement) => {
  if (!videoElement) return null;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth || 1280;
    canvas.height = videoElement.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  } catch (err) {
    console.warn('Failed capturing video frame', err);
    return null;
  }
};

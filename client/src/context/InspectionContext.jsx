import React, { createContext, useContext, useState, useEffect } from 'react';
import { inspectionService } from '../services/inspectionService';
import { calculateSiteSafetyScore, soundEngine } from '../services/riskEngine';

const InspectionContext = createContext(null);

export const SEED_SITES = [
  { id: 'SITE-01', name: 'Apex Tower Project', code: 'APX-B', address: '450 North Harbor Blvd, Sector 4', activeSupervisors: 4, openRisks: 2, safetyScore: 88 },
  { id: 'SITE-02', name: 'Harbor Gateway Logistics Yard', code: 'HGW-Y3', address: 'Terminal Pier 12, Heavy Equipment Bay', activeSupervisors: 3, openRisks: 1, safetyScore: 92 },
  { id: 'SITE-03', name: 'Eastside Medical Center Phase 2', code: 'EMC-FND', address: '880 Health Sciences Parkway', activeSupervisors: 5, openRisks: 0, safetyScore: 98 },
  { id: 'SITE-04', name: 'Substation 4 Infrastructure', code: 'SUB-4', address: 'Industrial Substation Grid 14', activeSupervisors: 2, openRisks: 0, safetyScore: 96 },
];

export const SEED_CAMERAS = [
  {
    id: 'CAM-001',
    name: 'North Scaffolding Matrix',
    site: 'Apex Tower Project',
    siteCode: 'APX-B',
    location: 'Grid Sector 4B, Level 6 Platform',
    status: 'ONLINE', // 'ONLINE' | 'OFFLINE' | 'LOW_VISIBILITY' | 'OBSTRUCTED' | 'FROZEN' | 'POOR_CONNECTION'
    health: 'Good',
    resolution: '1440p (2K)',
    fps: 30,
    bitrate: '4.2 Mbps',
    currentRisk: 'CRITICAL',
    lastPing: '2s ago',
    uptime: '99.8%',
    activeDetections: 2,
    feedUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop',
    zones: [
      { id: 'Z-1', name: 'Fall Hazard Edge Zone', type: 'FALL_HAZARD', color: '#DC2626', status: 'BREACHED' },
      { id: 'Z-2', name: 'Worker Staging Area', type: 'SAFE_ZONE', color: '#16A34A', status: 'NORMAL' },
    ],
  },
  {
    id: 'CAM-002',
    name: 'Heavy Equipment Staging Yard',
    site: 'Harbor Gateway Logistics Yard',
    siteCode: 'HGW-Y3',
    location: 'Excavator & Forklift Fleet Yard 3',
    status: 'ONLINE',
    health: 'Good',
    resolution: '1080p (FHD)',
    fps: 25,
    bitrate: '3.6 Mbps',
    currentRisk: 'HIGH',
    lastPing: '4s ago',
    uptime: '99.4%',
    activeDetections: 1,
    feedUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=1200&auto=format&fit=crop',
    zones: [
      { id: 'Z-3', name: 'Machinery Swing Radius', type: 'RESTRICTED_MACHINERY', color: '#EA580C', status: 'MONITORED' },
      { id: 'Z-4', name: 'Vehicle Transit Corridor', type: 'VEHICLE_ZONE', color: '#CA8A04', status: 'NORMAL' },
    ],
  },
  {
    id: 'CAM-003',
    name: 'Basement Concrete Pour Sector',
    site: 'Eastside Medical Center Phase 2',
    siteCode: 'EMC-FND',
    location: 'Sub-grade Foundation Trench 2',
    status: 'ONLINE',
    health: 'Good',
    resolution: '1440p (2K)',
    fps: 30,
    bitrate: '4.8 Mbps',
    currentRisk: 'SAFE',
    lastPing: '1s ago',
    uptime: '100%',
    activeDetections: 0,
    feedUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    zones: [
      { id: 'Z-5', name: 'Trench Excavation Perimeter', type: 'UNSAFE_EDGE', color: '#DC2626', status: 'NORMAL' },
    ],
  },
  {
    id: 'CAM-004',
    name: 'Substation Electrical Bay 4',
    site: 'Substation 4 Infrastructure',
    siteCode: 'SUB-4',
    location: '480V Distribution Vault & Egress',
    status: 'ONLINE',
    health: 'Good',
    resolution: '1080p (FHD)',
    fps: 20,
    bitrate: '2.8 Mbps',
    currentRisk: 'SAFE',
    lastPing: '3s ago',
    uptime: '99.9%',
    activeDetections: 0,
    feedUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    zones: [
      { id: 'Z-6', name: '36-Inch Clearance Arc', type: 'HIGH_VOLTAGE_CLEARANCE', color: '#DC2626', status: 'NORMAL' },
    ],
  },
  {
    id: 'CAM-005',
    name: 'Tower Crane Loading Dock',
    site: 'Apex Tower Project',
    siteCode: 'APX-B',
    location: 'Material Hoist & Suspended Load Zone',
    status: 'LOW_VISIBILITY',
    health: 'Lens Dust Detected',
    resolution: '1080p',
    fps: 24,
    bitrate: '3.1 Mbps',
    currentRisk: 'SAFE',
    lastPing: '15s ago',
    uptime: '97.2%',
    activeDetections: 0,
    feedUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    zones: [
      { id: 'Z-7', name: 'Suspended Load Drop Radius', type: 'SUSPENDED_LOAD', color: '#DC2626', status: 'NORMAL' },
    ],
  },
  {
    id: 'CAM-006',
    name: 'East Perimeter Storage Yard',
    site: 'Harbor Gateway Logistics Yard',
    siteCode: 'HGW-Y3',
    location: 'Flammable Storage & Tank Farm',
    status: 'ONLINE',
    health: 'Good',
    resolution: '1080p',
    fps: 25,
    bitrate: '3.4 Mbps',
    currentRisk: 'SAFE',
    lastPing: '5s ago',
    uptime: '99.6%',
    activeDetections: 0,
    feedUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=1200&auto=format&fit=crop',
    zones: [
      { id: 'Z-8', name: 'No-Smoking / Hot Work Zone', type: 'RESTRICTED_ZONE', color: '#DC2626', status: 'NORMAL' },
    ],
  },
];

export const SEED_INSPECTIONS = [
  {
    id: 'INS-0241',
    name: 'North Scaffolding Safety & Fall Protection Audit',
    site: 'Apex Tower Project',
    type: 'Scaffolding Safety',
    inspector: 'Sarah Connor (Lead Auditor)',
    location: 'Grid Sector 4B, Level 6 Platform',
    notes: 'Pre-shift elevation inspection following heavy wind gusts.',
    createdAt: '2026-10-01T08:30:00Z',
    status: 'Completed',
    riskLevel: 'CRITICAL',
    overallConfidence: 98.4,
    fileName: 'scaffold_tier6_joint.jpg',
    fileSize: '3.42 MB',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop',
    summary: 'Critical structural coupling anomaly detected on scaffold tier 6. Primary diagonal brace locking pin is absent, presenting catastrophic collapse hazard under dynamic load. Worker harness lifeline tie-off unverified.',
    explanation: 'Spatial edge analysis flagged visual void at the diagonal joint intersection (Region B-4). Cross-referenced against OSHA 1926.451(a)(1) standard for scaffold structural integrity.',
    findings: [
      {
        id: 'F-0241-1',
        label: 'Missing Diagonal Lock Pin',
        category: 'Environmental',
        severity: 'CRITICAL',
        confidence: 98.4,
        box_2d: [180, 420, 520, 780],
        status: 'Open',
        evidence: 'Absence of Grade-8 lock fastener in primary joint hub.',
        riskFactor: 'Imminent scaffold collapse under dynamic structural load.',
        complianceRef: 'OSHA 1926.451(a)(1) Scaffold Framework',
        correctiveAction: 'Halt scaffold elevation work and insert certified locking pin before workers access platform.',
        assignedTo: 'Marcus Vance (Site Safety Lead)',
      },
      {
        id: 'F-0241-2',
        label: 'Unsecured Worker Proximity',
        category: 'Behavior',
        severity: 'HIGH',
        confidence: 91.2,
        box_2d: [350, 150, 750, 420],
        status: 'Open',
        evidence: 'Lanyard carabiner unlatched while within 2m of open perimeter.',
        riskFactor: 'Severe fall from height risk.',
        complianceRef: 'OSHA 1926.501 Fall Protection',
        correctiveAction: 'Enforce mandatory 100% tie-off to overhead static line immediately.',
        assignedTo: 'Framing Crew Foreman',
      },
      {
        id: 'F-0241-3',
        label: 'Hard Hat & Hi-Vis PPE Verified',
        category: 'PPE',
        severity: 'LOW',
        confidence: 99.1,
        box_2d: [150, 200, 260, 320],
        status: 'Compliant',
        evidence: 'ANSI Z89.1 certified headwear and Class 2 vest detected.',
        riskFactor: 'None. Meets standard baseline.',
        complianceRef: 'OSHA 1926.100 Head Protection',
        correctiveAction: 'No action required. Compliance verified.',
        assignedTo: null,
      }
    ],
    recommendations: [
      { priority: 'P1 - IMMEDIATE', action: 'Halt scaffold elevation work and inspect coupling before workers access elevated platform.', reason: 'Imminent collapse hazard exceeds minimum structural threshold.' },
      { priority: 'P2 - HIGH', action: 'Install 4-inch minimum toe-boards along platform perimeter.', reason: 'Mitigates dropped object hazards for lower-tier personnel.' },
      { priority: 'P3 - STANDARD', action: 'Conduct 5-minute pre-shift stand-down on fall arrest procedures.', reason: 'Reinforce 100% tie-off compliance.' }
    ],
    notesList: [
      { id: 1, author: 'Sarah Connor', text: 'Tagged scaffold red tag at 08:45 AM. Maintenance notified.', date: '2026-10-01 08:45' }
    ]
  },
  {
    id: 'INS-0240',
    name: 'Hydraulic Excavator Pre-Op Inspection',
    site: 'Harbor Gateway Logistics Yard',
    type: 'Machinery',
    inspector: 'David Miller',
    location: 'Heavy Machinery Staging Yard',
    notes: 'Daily pre-operation mechanical verification on CAT 336 Excavator.',
    createdAt: '2026-09-30T14:15:00Z',
    status: 'Completed',
    riskLevel: 'HIGH',
    overallConfidence: 94.6,
    fileName: 'excavator_boom_cyl.jpg',
    fileSize: '4.10 MB',
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=1200&auto=format&fit=crop',
    summary: 'Fluid weeping detected on boom lift hydraulic cylinder gland seal. Missing safety interlock shield over right auxiliary drive pulley assembly.',
    explanation: 'Surface texture classifier isolated liquid sheen pattern along cylinder barrel and detected exposed rotating belt drive without physical guard.',
    findings: [
      {
        id: 'F-0240-1',
        label: 'Exposed Rotating Pulley Drive',
        category: 'Environmental',
        severity: 'HIGH',
        confidence: 96.0,
        box_2d: [200, 580, 540, 880],
        status: 'Open',
        evidence: 'Absence of safety grating over rotating drive belt.',
        riskFactor: 'Entrapment and severe laceration hazard.',
        complianceRef: 'OSHA 1910.212 Machine Guarding',
        correctiveAction: 'Lock out unit and reinstall fixed protective cover.',
        assignedTo: 'Mechanical Shop Supervisor',
      },
      {
        id: 'F-0240-2',
        label: 'Hydraulic Cylinder Weeping',
        category: 'Environmental',
        severity: 'MEDIUM',
        confidence: 93.8,
        box_2d: [380, 280, 680, 560],
        status: 'In Progress',
        evidence: 'Oil residue buildup on cylinder rod wiper seal.',
        riskFactor: 'Gradual loss of hydraulic pressure and environmental fluid contamination.',
        complianceRef: 'ISO 4413 Hydraulic Fluid Power',
        correctiveAction: 'Schedule seal kit replacement at next 250hr service cycle.',
        assignedTo: 'Fleet Mechanic Lead',
      }
    ],
    recommendations: [
      { priority: 'P1 - HIGH', action: 'Lock out machine and bolt fixed yellow safety enclosure.', reason: 'Rotating component entrapment hazard.' }
    ],
    notesList: [
      { id: 1, author: 'David Miller', text: 'Unit placed in lockout status pending guard installation.', date: '2026-09-30 14:30' }
    ]
  },
  {
    id: 'INS-0239',
    name: 'Foundation Rebar & Trench Perimeter Review',
    site: 'Eastside Medical Center Phase 2',
    type: 'Construction Safety',
    inspector: 'Elena Rostova',
    location: 'Sub-grade Basement Pour Sector 2',
    notes: 'Pre-pour inspection for concrete reinforcement and trench safety.',
    createdAt: '2026-09-30T10:00:00Z',
    status: 'Completed',
    riskLevel: 'CRITICAL',
    overallConfidence: 97.9,
    fileName: 'trench_rebar_caps.jpg',
    fileSize: '2.88 MB',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    summary: 'Multiple uncapped vertical protruding rebar dowels located in direct worker access trench. Trench egress ladder not secured.',
    explanation: 'Geometric bounding identified exposed cut-steel cylindrical rebars within 1.2m of walking trench floor lacking mushroom safety caps.',
    findings: [
      {
        id: 'F-0239-1',
        label: 'Uncapped Protruding Steel Rebar',
        category: 'Environmental',
        severity: 'CRITICAL',
        confidence: 97.9,
        box_2d: [480, 180, 880, 650],
        status: 'Resolved',
        evidence: '14 exposed vertical rebar ends without protective caps.',
        riskFactor: 'Fatal puncture and impalement hazard.',
        complianceRef: 'OSHA 1926.701(b) Concrete & Masonry Rebar',
        correctiveAction: 'Install steel-reinforced OSHA rebar caps immediately across all dowels.',
        assignedTo: 'Foundation Subcontractor',
      }
    ],
    recommendations: [
      { priority: 'P1 - IMMEDIATE', action: 'Install OSHA-approved safety caps on all protruding vertical dowels.', reason: 'Prevents catastrophic puncture/impalement injuries.' }
    ],
    notesList: [
      { id: 1, author: 'Elena Rostova', text: 'Rebar caps installed by subcontractor foreman at 11:15 AM. Verified resolved.', date: '2026-09-30 11:15' }
    ]
  },
  {
    id: 'INS-0238',
    name: 'Substation Electrical Bay & Egress Clearance',
    site: 'Substation 4 Infrastructure',
    type: 'Infrastructure',
    inspector: 'James Sterling',
    location: '480V Main Distribution Room',
    notes: 'Routine quarterly facility compliance and emergency path audit.',
    createdAt: '2026-09-29T16:20:00Z',
    status: 'Completed',
    riskLevel: 'MEDIUM',
    overallConfidence: 96.2,
    fileName: 'panel_clearance_egress.jpg',
    fileSize: '3.15 MB',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    summary: 'Storage pallet encroaching within 36-inch clearance zone of 480V switchgear panel. Emergency eyewash station verified operational.',
    explanation: 'Spatial footprint analysis calculated floor clearance distance of 22 inches between wooden pallet edge and electrical enclosure door.',
    findings: [
      {
        id: 'F-0238-1',
        label: 'Obstructed Electrical Panel Clearance',
        category: 'Environmental',
        severity: 'MEDIUM',
        confidence: 96.2,
        box_2d: [350, 420, 780, 820],
        status: 'Resolved',
        evidence: 'Pallet stored inside the 36-inch boundary arc of switchgear.',
        riskFactor: 'Delayed electrical disconnect during arc flash or emergency event.',
        complianceRef: 'NFPA 70E / OSHA 1910.303(g)',
        correctiveAction: 'Relocate palletized inventory to designated storage rack.',
        assignedTo: 'Facility Logistics Team',
      }
    ],
    recommendations: [
      { priority: 'P2 - HIGH', action: 'Maintain minimum 36-inch clear working space in front of electrical gear.', reason: 'NFPA standard for safe emergency maintenance access.' }
    ],
    notesList: [
      { id: 1, author: 'James Sterling', text: 'Pallet moved to warehouse aisle 4. Line marked with yellow floor paint.', date: '2026-09-29 17:00' }
    ]
  }
];

export const SEED_INCIDENTS = [
  {
    id: 'INC-104',
    hazard: 'Missing Diagonal Scaffolding Pin',
    category: 'Environmental',
    severity: 'CRITICAL',
    confidence: 98.4,
    site: 'Apex Tower Project',
    location: 'Grid Sector 4B, Level 6 Platform',
    camera: 'CAM-001 (North Scaffolding)',
    detectedAt: '2026-10-01 08:32',
    status: 'ASSIGNED', // 'DETECTED' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'CORRECTIVE_ACTION' | 'VERIFICATION' | 'CLOSED'
    assignedTo: 'Marcus Vance (Site Safety Lead)',
    evidenceImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=600&auto=format&fit=crop',
    afterImage: null,
    explanation: 'Scaffold framework lacks primary diagonal brace locking fastener under dynamic loading.',
    recommendedAction: 'Halt elevated work, red-tag scaffold, and insert certified Grade-8 pin.',
    correctiveActionNotes: 'Maintenance crew dispatched with replacement locking pin kit.',
    dueDate: '2026-10-01 11:00',
    verificationRequired: true,
  },
  {
    id: 'INC-103',
    hazard: 'Exposed Machine Pulley Assembly',
    category: 'Environmental',
    severity: 'HIGH',
    confidence: 96.0,
    site: 'Harbor Gateway Logistics Yard',
    location: 'Excavator Yard 3',
    camera: 'CAM-002 (Heavy Equipment)',
    detectedAt: '2026-09-30 14:18',
    status: 'CORRECTIVE_ACTION',
    assignedTo: 'Dave Miller (Fleet Lead)',
    evidenceImage: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=600&auto=format&fit=crop',
    afterImage: null,
    explanation: 'Rotating belt drive pulley is exposed without physical safety barrier.',
    recommendedAction: 'Lockout equipment and install bolted steel guard enclosure.',
    correctiveActionNotes: 'Steel guard enclosure fabricating in machine shop.',
    dueDate: '2026-09-30 18:00',
    verificationRequired: true,
  },
  {
    id: 'INC-102',
    hazard: 'Uncapped Vertical Rebar Dowels',
    category: 'Environmental',
    severity: 'CRITICAL',
    confidence: 97.9,
    site: 'Eastside Medical Center Phase 2',
    location: 'Sub-grade Basement Trench',
    camera: 'CAM-003 (Basement Pour)',
    detectedAt: '2026-09-30 10:05',
    status: 'CLOSED',
    assignedTo: 'Foundation Subcontractor',
    evidenceImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop',
    afterImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop',
    explanation: 'Vertical sharp cut-steel rebars presented immediate puncture risk.',
    recommendedAction: 'Install steel-reinforced OSHA rebar caps.',
    correctiveActionNotes: '14 safety mushroom caps installed and verified by inspector Elena Rostova.',
    dueDate: '2026-09-30 12:00',
    resolvedAt: '2026-09-30 11:15',
    verificationRequired: false,
  },
  {
    id: 'INC-101',
    hazard: 'Switchgear Panel Egress Obstruction',
    category: 'Environmental',
    severity: 'MEDIUM',
    confidence: 96.2,
    site: 'Substation 4 Infrastructure',
    location: '480V Distribution Bay',
    camera: 'CAM-004 (Substation Bay)',
    detectedAt: '2026-09-29 16:22',
    status: 'CLOSED',
    assignedTo: 'Facility Logistics Team',
    evidenceImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
    afterImage: null,
    explanation: 'Wooden inventory pallet stored within the 36-inch boundary arc of 480V switchgear.',
    recommendedAction: 'Clear 36-inch perimeter and mark yellow floor safety zone.',
    correctiveActionNotes: 'Pallet removed to storage aisle 4.',
    dueDate: '2026-09-29 18:00',
    resolvedAt: '2026-09-29 17:00',
    verificationRequired: false,
  }
];

export const SEED_SITE_MAP_MARKERS = [
  { id: 'M-1', siteId: 'SITE-01', siteName: 'Apex Tower Project', x: 28, y: 34, severity: 'CRITICAL', label: 'CAM-001 (Scaffolding Tier 6)', hazard: 'Missing Scaffold Locking Pin', incidentId: 'INC-104', timestamp: '08:32 AM', recommendedAction: 'Halt elevated work and insert Grade-8 pin.' },
  { id: 'M-2', siteId: 'SITE-01', siteName: 'Apex Tower Project', x: 42, y: 65, severity: 'SAFE', label: 'CAM-005 (Loading Bay)', hazard: 'None (Compliant)', incidentId: null, timestamp: 'Live', recommendedAction: 'Maintain active perimeter monitoring.' },
  { id: 'M-3', siteId: 'SITE-02', siteName: 'Harbor Gateway Yard', x: 68, y: 28, severity: 'HIGH', label: 'CAM-002 (CAT 336 Yard)', hazard: 'Exposed Pulley Drive', incidentId: 'INC-103', timestamp: '14:18 PM', recommendedAction: 'Lockout equipment and install barrier.' },
  { id: 'M-4', siteId: 'SITE-02', siteName: 'Harbor Gateway Yard', x: 82, y: 72, severity: 'SAFE', label: 'CAM-006 (Fuel Tank Farm)', hazard: 'None (Compliant)', incidentId: null, timestamp: 'Live', recommendedAction: 'Regular continuous scan.' },
  { id: 'M-5', siteId: 'SITE-03', siteName: 'Eastside Medical Phase 2', x: 55, y: 50, severity: 'SAFE', label: 'CAM-003 (Foundation Sector 2)', hazard: 'Rebar Caps Verified', incidentId: 'INC-102', timestamp: 'Resolved', recommendedAction: 'Safe for concrete pour crew.' },
];

export const InspectionProvider = ({ children }) => {
  const [sites, setSites] = useState(SEED_SITES);
  const [cameras, setCameras] = useState(SEED_CAMERAS);
  const [inspections, setInspections] = useState(() => {
    const saved = localStorage.getItem('vg_inspections_store');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return SEED_INSPECTIONS;
  });

  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem('vg_incidents_store');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return SEED_INCIDENTS;
  });

  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF-1',
      type: 'CRITICAL',
      title: 'Critical Safety Alert: Missing Scaffold Pin',
      message: 'Visual anomaly detected on Apex Tower Zone B tier 6 scaffold frame.',
      timestamp: '12m ago',
      read: false,
      link: '/inspections/INS-0241',
    },
    {
      id: 'NOTIF-2',
      type: 'HIGH',
      title: 'High Risk Hazard: Exposed Machine Pulley',
      message: 'Unguarded belt assembly detected in Heavy Equipment Yard.',
      timestamp: '45m ago',
      read: false,
      link: '/inspections/INS-0240',
    },
    {
      id: 'NOTIF-3',
      type: 'RESOLVED',
      title: 'Corrective Action Completed',
      message: 'OSHA safety caps installed on rebar dowels at Eastside Medical.',
      timestamp: '2h ago',
      read: true,
      link: '/incidents',
    }
  ]);

  const [activeAlert, setActiveAlert] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [activeScenario, setActiveScenario] = useState(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('vg_inspections_store', JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem('vg_incidents_store', JSON.stringify(incidents));
  }, [incidents]);

  // Alert trigger with audio chime
  const triggerHazardAlert = (alertData) => {
    setActiveAlert(alertData);
    if (!isAudioMuted) {
      if (alertData.severity === 'CRITICAL') {
        soundEngine.playCriticalAlert();
      } else {
        soundEngine.playWarningChime();
      }
    }

    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      type: alertData.severity || 'HIGH',
      title: `${alertData.severity} Hazard: ${alertData.title || alertData.hazard}`,
      message: alertData.description || 'Hazard detected via real-time computer vision monitoring.',
      timestamp: 'Just now',
      read: false,
      link: alertData.inspectionId ? `/inspections/${alertData.inspectionId}` : '/live-monitoring',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const dismissActiveAlert = () => {
    setActiveAlert(null);
  };

  // Add new inspection
  const addInspection = (newInspection) => {
    setInspections((prev) => [newInspection, ...prev]);
    return newInspection;
  };

  const getInspection = (id) => {
    return inspections.find((item) => item.id === id) || inspections[0] || null;
  };

  const deleteInspection = async (id) => {
    try {
      await inspectionService.deleteInspection(id);
    } catch {}
    setInspections((prev) => prev.filter((item) => item.id !== id));
  };

  // Camera Management CRUD
  const addCamera = (cameraData) => {
    const newId = `CAM-${String(cameras.length + 1).padStart(3, '0')}`;
    const newCam = {
      id: newId,
      name: cameraData.name || `CCTV Stream ${newId}`,
      site: cameraData.site || 'Apex Tower Project',
      siteCode: cameraData.siteCode || 'APX-B',
      location: cameraData.location || cameraData.zone || 'Main Operational Yard',
      status: 'ONLINE',
      health: 'Good',
      resolution: cameraData.resolution || '1080p (FHD)',
      fps: 30,
      bitrate: '3.8 Mbps',
      currentRisk: 'SAFE',
      lastPing: 'Just now',
      uptime: '100%',
      activeDetections: 0,
      feedUrl: cameraData.feedUrl || (cameraData.type === 'Webcam' ? 'WEBCAM' : 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop'),
      type: cameraData.type || 'RTSP Stream',
      zones: [
        { id: `Z-${Date.now()}`, name: `${cameraData.zone || 'Work'} Perimeter`, type: 'SAFE_ZONE', color: '#16A34A', status: 'NORMAL' }
      ]
    };
    setCameras((prev) => [newCam, ...prev]);
    return newCam;
  };

  const updateCamera = (id, data) => {
    setCameras((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  };

  const deleteCamera = (id) => {
    setCameras((prev) => prev.filter((c) => c.id !== id));
  };

  const testCameraConnection = async (params) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    // Simulate handshake check
    if (params?.url?.includes('fail') || params?.ip === '0.0.0.0') {
      return { success: false, message: 'Handshake timeout. RTSP port 554 unreachable or authentication failed.' };
    }
    return {
      success: true,
      message: 'Connection verified. RTSP/H.264 stream synced at 30 FPS with sub-100ms latency.',
      codec: 'H.264 / AAC',
      resolution: '1920x1080',
      fps: 30
    };
  };

  // Site Management CRUD
  const addSite = (siteData) => {
    const newSite = {
      id: `SITE-${String(sites.length + 1).padStart(2, '0')}`,
      name: siteData.name,
      code: siteData.code || siteData.name.slice(0, 3).toUpperCase(),
      address: siteData.address || 'Industrial Zone Sector 1',
      activeSupervisors: Number(siteData.activeSupervisors) || 2,
      openRisks: 0,
      safetyScore: 98,
      type: siteData.type || 'Construction'
    };
    setSites((prev) => [...prev, newSite]);
    return newSite;
  };

  const updateSite = (id, siteData) => {
    setSites((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...siteData } : s))
    );
  };

  // Team & Roles Management
  const [teamMembers, setTeamMembers] = useState([
    { id: 'TM-01', name: 'Marcus Vance', email: 'm.vance@visionguard.ai', role: 'Safety Supervisor', status: 'Active', site: 'Apex Tower Project', lastActive: '5m ago' },
    { id: 'TM-02', name: 'Sarah Connor', email: 's.connor@visionguard.ai', role: 'Safety Manager', status: 'Active', site: 'Harbor Gateway Logistics Yard', lastActive: '12m ago' },
    { id: 'TM-03', name: 'David Miller', email: 'd.miller@visionguard.ai', role: 'Safety Officer', status: 'Active', site: 'Eastside Medical Center Phase 2', lastActive: '1h ago' },
    { id: 'TM-04', name: 'Elena Rostova', email: 'e.rostova@visionguard.ai', role: 'Operator', status: 'Active', site: 'Apex Tower Project', lastActive: 'Just now' },
    { id: 'TM-05', name: 'Jackson Reed', email: 'j.reed@visionguard.ai', role: 'Admin', status: 'Active', site: 'All Sites', lastActive: '2m ago' },
  ]);

  const addTeamMember = (member) => {
    const newMember = {
      id: `TM-${String(teamMembers.length + 1).padStart(2, '0')}`,
      status: 'Active',
      lastActive: 'Just invited',
      ...member
    };
    setTeamMembers((prev) => [newMember, ...prev]);
    return newMember;
  };

  const updateTeamMemberRole = (id, role) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role } : m))
    );
  };

  const removeTeamMember = (id) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // Selected Global Site Filter
  const [selectedSite, setSelectedSite] = useState('All Sites');

  // System Health state
  const [systemHealth, setSystemHealth] = useState({
    cameraService: 'Operational',
    aiDetection: 'Operational',
    alertService: 'Operational',
    database: 'Operational',
  });

  // Event actions
  const acknowledgeEvent = (eventId) => {
    updateIncidentStatus(eventId, 'ACKNOWLEDGED');
  };

  const assignEvent = (eventId, assignee, notes) => {
    assignIncident(eventId, assignee, null, notes);
  };

  const resolveEvent = (eventId, notes) => {
    updateIncidentStatus(eventId, 'CLOSED', { correctiveActionNotes: notes });
  };

  const updateFindingStatus = (inspectionId, findingId, newStatus) => {
    setInspections((prev) =>
      prev.map((insp) => {
        if (insp.id !== inspectionId) return insp;
        const updatedFindings = (insp.findings || []).map((f) => {
          if (f.id === findingId) {
            return { ...f, status: newStatus };
          }
          return f;
        });
        return { ...insp, findings: updatedFindings };
      })
    );
  };

  // Incident Lifecycle Management
  const addIncident = (incidentData) => {
    const newInc = {
      id: `INC-${Math.floor(100 + Math.random() * 900)}`,
      detectedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'DETECTED',
      assignedTo: 'Site Safety Lead',
      verificationRequired: true,
      ...incidentData,
    };
    setIncidents((prev) => [newInc, ...prev]);
    return newInc;
  };

  const updateIncidentStatus = (incidentId, newStatus, extraData = {}) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          const isClosed = newStatus === 'CLOSED' || newStatus === 'RESOLVED';
          return {
            ...inc,
            status: newStatus,
            resolvedAt: isClosed ? new Date().toISOString().replace('T', ' ').slice(0, 16) : inc.resolvedAt,
            ...extraData,
          };
        }
        return inc;
      })
    );
  };

  const assignIncident = (incidentId, assignee, dueDate, notes) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            assignedTo: assignee,
            dueDate: dueDate || inc.dueDate,
            correctiveActionNotes: notes || inc.correctiveActionNotes,
            status: inc.status === 'DETECTED' ? 'ASSIGNED' : inc.status,
          };
        }
        return inc;
      })
    );
  };

  // Run Safety Scenarios (Interactive Demo Mode)
  const runSafetyScenario = (scenarioKey) => {
    setActiveScenario(scenarioKey);

    const scenarios = {
      'ppe-violation': {
        title: 'PPE Violation Detected (Missing Helmet & High-Vis)',
        severity: 'HIGH',
        category: 'PPE',
        hazard: 'Worker Missing Hard Hat & Class 2 Vest',
        site: 'Apex Tower Project',
        camera: 'CAM-001 (North Scaffolding)',
        location: 'Level 6 Staging Sector',
        description: 'Computer vision isolated personnel in active construction zone without mandatory ANSI headwear and reflective vest.',
        action: 'Immediate field stop order issued. Provide required PPE before resuming tasks.',
        confidence: 96.2,
      },
      'restricted-zone': {
        title: 'Restricted Zone Perimeter Breach',
        severity: 'CRITICAL',
        category: 'Behavior',
        hazard: 'Unauthorized Worker in Heavy Crane Swing Radius',
        site: 'Apex Tower Project',
        camera: 'CAM-005 (Loading Bay)',
        location: 'Sector 3 Hoist Zone',
        description: 'Virtual boundary Z-7 (Suspended Load Radius) breached while overhead hoist operation active.',
        action: 'Sound audio siren, pause hoist rotation, and clear personnel from drop zone.',
        confidence: 98.9,
      },
      'machinery-proximity': {
        title: 'Unsafe Machinery Proximity Alert',
        severity: 'HIGH',
        category: 'Behavior',
        hazard: 'Worker Within 1.2m of Operating CAT 336 Excavator',
        site: 'Harbor Gateway Logistics Yard',
        camera: 'CAM-002 (Heavy Equipment)',
        location: 'Yard 3 Trenching Bay',
        description: 'Personnel detected inside the 3-meter safety exclusion envelope of operating hydraulic arm.',
        action: 'Signal excavator operator to idle engine until worker retreats behind barrier.',
        confidence: 94.7,
      },
      'possible-fall': {
        title: 'Imminent Fall Hazard (Unharnessed at Elevation)',
        severity: 'CRITICAL',
        category: 'Behavior',
        hazard: 'Worker within 1m of Open Edge Without Anchor Tie-Off',
        site: 'Apex Tower Project',
        camera: 'CAM-001 (North Scaffolding)',
        location: 'Level 6 Perimeter Beam',
        description: 'No harness lifeline tether detected within OSHA 6-foot edge distance (OSHA 1926.501).',
        action: 'Order worker to anchor to static line immediately. Dispatch safety officer.',
        confidence: 99.1,
      },
      'multiple-risks': {
        title: 'Simultaneous Multi-Zone Hazards Detected',
        severity: 'CRITICAL',
        category: 'Environmental',
        hazard: 'Scaffold Pin Void + Machinery Clearance Violation',
        site: 'Apex Tower Project',
        camera: 'CAM-001 & CAM-002',
        location: 'Multiple Operational Sectors',
        description: 'Concurrent structural and behavioral violations detected across multiple CCTV streams.',
        action: 'Initiate site-wide pre-shift safety stand-down across all working sectors.',
        confidence: 97.5,
      },
    };

    const target = scenarios[scenarioKey] || scenarios['ppe-violation'];

    // Update cameras risk
    setCameras((prev) =>
      prev.map((c) => {
        if (c.id === 'CAM-001') {
          return { ...c, currentRisk: target.severity, activeDetections: c.activeDetections + 1 };
        }
        return c;
      })
    );

    // Create incident
    const newInc = addIncident({
      hazard: target.hazard,
      category: target.category,
      severity: target.severity,
      confidence: target.confidence,
      site: target.site,
      location: target.location,
      camera: target.camera,
      explanation: target.description,
      recommendedAction: target.action,
      evidenceImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=600&auto=format&fit=crop',
    });

    // Trigger visual + audio alert
    triggerHazardAlert({
      title: target.title,
      hazard: target.hazard,
      severity: target.severity,
      description: target.description,
      inspectionId: 'INS-0241',
      incidentId: newInc.id,
    });
  };

  // AI Safety Assistant Q&A
  const askSafetyAssistant = (query) => {
    const q = query.toLowerCase();
    const stats = getStats();

    if (q.includes('critical') || q.includes('urgent') || q.includes('danger')) {
      const critInc = incidents.filter((i) => i.severity === 'CRITICAL' && i.status !== 'CLOSED');
      return {
        answer: `There are currently ${critInc.length} open Critical Risk incidents requiring immediate supervisor action: ${critInc.map((i) => `"${i.hazard}" at ${i.site} (${i.camera})`).join(', ') || 'None'}. Immediate remediation recommended.`,
        data: critInc,
      };
    }

    if (q.includes('unresolved') || q.includes('open') || q.includes('incident')) {
      const openInc = incidents.filter((i) => i.status !== 'CLOSED');
      return {
        answer: `There are ${openInc.length} active open incidents across your monitored sites. ${openInc.filter((i) => i.status === 'ASSIGNED').length} are assigned to supervisors, and ${openInc.filter((i) => i.status === 'CORRECTIVE_ACTION').length} are in corrective action stages.`,
        data: openInc,
      };
    }

    if (q.includes('camera') || q.includes('alert') || q.includes('cctv')) {
      const highestCam = cameras.find((c) => c.currentRisk === 'CRITICAL') || cameras[0];
      return {
        answer: `Camera "${highestCam.name}" (${highestCam.id}) located at ${highestCam.location} has the highest risk profile with ${highestCam.activeDetections} active detections. Camera health status is ${highestCam.status}.`,
        data: cameras,
      };
    }

    if (q.includes('hazard') || q.includes('common') || q.includes('ppe')) {
      return {
        answer: `Top recurring hazards this week: 1. Scaffolding Structural Locking Void (38%), 2. Worker Proximity to Moving Heavy Machinery (27%), 3. Uncapped Vertical Rebar Dowels (19%), 4. PPE Vest Compliance (16%). Overall PPE compliance is ${stats.ppeComplianceRate}.`,
        data: stats.allHazards,
      };
    }

    // Default status summary
    return {
      answer: `VisionGuard Industrial Status Summary: Overall Site Safety Score is ${stats.siteSafetyScore}/100. ${stats.onlineCamerasCount} of ${cameras.length} CCTV cameras are online. Total active critical hazards: ${stats.criticalHazards}. Active open incidents: ${stats.activeIncidentsCount}.`,
      data: stats,
    };
  };

  // Reset demo state
  const resetDemo = () => {
    setSites(SEED_SITES);
    setCameras(SEED_CAMERAS);
    setInspections(SEED_INSPECTIONS);
    setIncidents(SEED_INCIDENTS);
    localStorage.setItem('vg_inspections_store', JSON.stringify(SEED_INSPECTIONS));
    localStorage.setItem('vg_incidents_store', JSON.stringify(SEED_INCIDENTS));
    setActiveAlert(null);
    setActiveScenario(null);
  };

  // Compute aggregate stats
  const getStats = () => {
    const filteredInspections = selectedSite === 'All Sites' 
      ? inspections 
      : inspections.filter((i) => i.site === selectedSite);
    
    const filteredCameras = selectedSite === 'All Sites'
      ? cameras
      : cameras.filter((c) => c.site === selectedSite);

    const filteredIncidents = selectedSite === 'All Sites'
      ? incidents
      : incidents.filter((i) => i.site === selectedSite);

    const total = filteredInspections.length;
    let criticalHazards = 0;
    let warningHazards = 0;
    let openIssues = 0;
    let totalIssues = 0;
    let resolvedIssues = 0;
    let totalConfidence = 0;

    const riskCounts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, SAFE: 0 };
    const allHazards = [];

    filteredInspections.forEach((insp) => {
      const r = (insp.riskLevel || 'LOW').toUpperCase();
      if (riskCounts[r] !== undefined) riskCounts[r]++;
      else riskCounts.LOW++;

      const conf = insp.overallConfidence || 95;
      totalConfidence += conf <= 1 ? conf * 100 : conf;

      (insp.findings || []).forEach((f) => {
        totalIssues++;
        const s = (f.severity || 'LOW').toUpperCase();
        if (s === 'CRITICAL') criticalHazards++;
        if (s === 'HIGH' || s === 'MEDIUM') warningHazards++;

        if (f.status === 'Open' || f.status === 'In Progress') openIssues++;
        if (f.status === 'Resolved' || f.status === 'Compliant') resolvedIssues++;

        allHazards.push({
          ...f,
          inspectionId: insp.id,
          inspectionName: insp.name,
          site: insp.site,
          date: insp.createdAt,
          type: insp.type,
        });
      });
    });

    const ppeComplianceRate = 92.4;
    const siteSafetyScore = calculateSiteSafetyScore({
      ppeComplianceRate,
      criticalHazards,
      openIncidents: filteredIncidents.filter((i) => i.status !== 'CLOSED').length,
      resolvedIncidents: filteredIncidents.filter((i) => i.status === 'CLOSED').length,
    });

    const complianceRate = totalIssues > 0
      ? ((resolvedIssues / totalIssues) * 100).toFixed(1)
      : '98.5';

    const onlineCameras = filteredCameras.filter((c) => c.status === 'ONLINE').length;
    const offlineCameras = filteredCameras.length - onlineCameras;

    return {
      total,
      criticalHazards,
      warningHazards,
      openIssues,
      resolvedTodayCount: filteredIncidents.filter((i) => i.status === 'CLOSED').length,
      complianceRate: `${complianceRate}%`,
      ppeComplianceRate: `${ppeComplianceRate}%`,
      siteSafetyScore,
      avgConfidence: total > 0 ? (totalConfidence / total).toFixed(1) : '96.2',
      riskCounts,
      allHazards,
      activeIncidentsCount: filteredIncidents.filter((i) => i.status !== 'CLOSED').length,
      onlineCamerasCount: onlineCameras,
      offlineCamerasCount: offlineCameras,
      totalCamerasCount: filteredCameras.length,
    };
  };

  return (
    <InspectionContext.Provider
      value={{
        sites,
        addSite,
        updateSite,
        cameras,
        addCamera,
        updateCamera,
        deleteCamera,
        testCameraConnection,
        inspections,
        incidents,
        teamMembers,
        addTeamMember,
        updateTeamMemberRole,
        removeTeamMember,
        selectedSite,
        setSelectedSite,
        systemHealth,
        setSystemHealth,
        notifications,
        activeAlert,
        isAudioMuted,
        setIsAudioMuted,
        activeScenario,
        isAssistantOpen,
        setIsAssistantOpen,
        triggerHazardAlert,
        dismissActiveAlert,
        getInspection,
        addInspection,
        deleteInspection,
        updateFindingStatus,
        addIncident,
        updateIncidentStatus,
        assignIncident,
        acknowledgeEvent,
        assignEvent,
        resolveEvent,
        runSafetyScenario,
        askSafetyAssistant,
        resetDemo,
        getStats,
      }}
    >
      {children}
    </InspectionContext.Provider>
  );
};

export const useInspections = () => {
  const context = useContext(InspectionContext);
  if (!context) {
    throw new Error('useInspections must be used within an InspectionProvider');
  }
  return context;
};



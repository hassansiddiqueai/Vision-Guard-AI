import React, { createContext, useContext, useState, useEffect } from 'react';
import { inspectionService } from '../services/inspectionService';
import { calculateSiteSafetyScore, soundEngine } from '../services/riskEngine';

const InspectionContext = createContext(null);

const SEED_INSPECTIONS = [
  {
    id: 'INS-0241',
    name: 'North Scaffolding Safety & Fall Protection Audit',
    site: 'Apex Tower — Zone B',
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
    site: 'Harbor Gateway Extension',
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
    site: 'Eastside Medical Center',
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
    site: 'Industrial Park Substation 4',
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

const SEED_INCIDENTS = [
  {
    id: 'INC-104',
    hazard: 'Missing Diagonal Scaffolding Pin',
    severity: 'CRITICAL',
    riskScore: 98,
    site: 'Apex Tower — Zone B',
    location: 'Tier 6 Scaffolding Platform',
    detectedAt: '2026-10-01 08:32',
    status: 'ASSIGNED',
    assignedTo: 'Marcus Vance (Site Safety Lead)',
    evidenceImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=600&auto=format&fit=crop',
    correctiveAction: 'Halt scaffold work and bolt locking pin.',
    dueDate: '2026-10-01 10:00',
  },
  {
    id: 'INC-103',
    hazard: 'Exposed Machine Pulley Assembly',
    severity: 'HIGH',
    riskScore: 88,
    site: 'Harbor Gateway Extension',
    location: 'Excavator Yard 3',
    detectedAt: '2026-09-30 14:18',
    status: 'IN PROGRESS',
    assignedTo: 'Dave Miller (Fleet Lead)',
    evidenceImage: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=600&auto=format&fit=crop',
    correctiveAction: 'Lockout equipment and install barrier.',
    dueDate: '2026-09-30 18:00',
  },
  {
    id: 'INC-102',
    hazard: 'Uncapped Vertical Rebar Dowels',
    severity: 'CRITICAL',
    riskScore: 95,
    site: 'Eastside Medical Center',
    location: 'Sub-grade Basement Trench',
    detectedAt: '2026-09-30 10:05',
    status: 'RESOLVED',
    assignedTo: 'Foundation Subcontractor',
    evidenceImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop',
    correctiveAction: 'Safety mushroom caps installed on all 14 dowels.',
    dueDate: '2026-09-30 12:00',
    resolvedAt: '2026-09-30 11:15',
  },
  {
    id: 'INC-101',
    hazard: 'Switchgear Panel Egress Obstruction',
    severity: 'MEDIUM',
    riskScore: 65,
    site: 'Industrial Park Substation 4',
    location: '480V Distribution Bay',
    detectedAt: '2026-09-29 16:22',
    status: 'RESOLVED',
    assignedTo: 'Facility Logistics Team',
    evidenceImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
    correctiveAction: 'Pallet removed to storage aisle 4.',
    dueDate: '2026-09-29 18:00',
    resolvedAt: '2026-09-29 17:00',
  }
];

const SEED_EVIDENCE = [
  {
    id: 'EVD-001',
    hazard: 'Missing Diagonal Lock Pin',
    severity: 'CRITICAL',
    confidence: 98.4,
    camera: 'CAM-01 (Apex Tower)',
    location: 'Sector 4B Platform',
    timestamp: '2026-10-01 08:32:15',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'EVD-002',
    hazard: 'Exposed Rotating Pulley Drive',
    severity: 'HIGH',
    confidence: 96.0,
    camera: 'CAM-02 (Yard Dock)',
    location: 'CAT 336 Boom',
    timestamp: '2026-09-30 14:18:22',
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'EVD-003',
    hazard: 'Uncapped Steel Rebar Dowels',
    severity: 'CRITICAL',
    confidence: 97.9,
    camera: 'CAM-03 (Foundation Pour)',
    location: 'Basement Trench Sector 2',
    timestamp: '2026-09-30 10:05:40',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600&auto=format&fit=crop',
  }
];

const SEED_NOTIFICATIONS = [
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
];

const SEED_CAMERAS = [
  { id: 'CAM-001', name: 'North Scaffolding Matrix', site: 'Apex Tower — Zone B', status: 'ONLINE', resolution: '1440p (2K)', fps: 30, risk: 'CRITICAL' },
  { id: 'CAM-002', name: 'Heavy Equipment Staging', site: 'Harbor Gateway Extension', status: 'ONLINE', resolution: '1080p', fps: 25, risk: 'HIGH' },
  { id: 'CAM-003', name: 'Basement Concrete Pour', site: 'Eastside Medical Center', status: 'ONLINE', resolution: '1440p', fps: 30, risk: 'SAFE' },
  { id: 'CAM-004', name: 'Substation Electrical Bay', site: 'Industrial Park Substation 4', status: 'ONLINE', resolution: '1080p', fps: 20, risk: 'SAFE' },
];

export const InspectionProvider = ({ children }) => {
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

  const [evidenceList, setEvidenceList] = useState(() => {
    const saved = localStorage.getItem('vg_evidence_store');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return SEED_EVIDENCE;
  });

  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS);
  const [cameras, setCameras] = useState(SEED_CAMERAS);
  const [activeAlert, setActiveAlert] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('vg_inspections_store', JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem('vg_incidents_store', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('vg_evidence_store', JSON.stringify(evidenceList));
  }, [evidenceList]);

  // Alert trigger with audio chime
  const triggerHazardAlert = (alertData) => {
    setActiveAlert(alertData);
    if (alertData.severity === 'CRITICAL') {
      soundEngine.playCriticalAlert();
    } else {
      soundEngine.playWarningChime();
    }

    // Add to notifications log
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

  // Incident methods
  const addIncident = (incidentData) => {
    const newInc = {
      id: `INC-${Math.floor(100 + Math.random() * 900)}`,
      detectedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'OPEN',
      assignedTo: 'Site Safety Supervisor',
      ...incidentData,
    };
    setIncidents((prev) => [newInc, ...prev]);
    return newInc;
  };

  const updateIncidentStatus = (incidentId, newStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: newStatus,
            resolvedAt: newStatus === 'RESOLVED' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : inc.resolvedAt,
          };
        }
        return inc;
      })
    );
  };

  const assignIncident = (incidentId, assignee) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return { ...inc, assignedTo: assignee, status: inc.status === 'OPEN' ? 'ASSIGNED' : inc.status };
        }
        return inc;
      })
    );
  };

  // Evidence methods
  const addEvidence = (evidenceData) => {
    const newEvd = {
      id: `EVD-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ...evidenceData,
    };
    setEvidenceList((prev) => [newEvd, ...prev]);
    return newEvd;
  };

  const deleteEvidence = (id) => {
    setEvidenceList((prev) => prev.filter((item) => item.id !== id));
  };

  // Notification methods
  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Reset demo state
  const resetDemo = () => {
    setInspections(SEED_INSPECTIONS);
    setIncidents(SEED_INCIDENTS);
    setEvidenceList(SEED_EVIDENCE);
    setNotifications(SEED_NOTIFICATIONS);
    localStorage.setItem('vg_inspections_store', JSON.stringify(SEED_INSPECTIONS));
    localStorage.setItem('vg_incidents_store', JSON.stringify(SEED_INCIDENTS));
    localStorage.setItem('vg_evidence_store', JSON.stringify(SEED_EVIDENCE));
    setActiveAlert(null);
  };

  // Compute aggregate stats
  const getStats = () => {
    const total = inspections.length;
    let criticalHazards = 0;
    let openIssues = 0;
    let totalIssues = 0;
    let resolvedIssues = 0;
    let totalConfidence = 0;

    const riskCounts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, SAFE: 0 };
    const allHazards = [];

    inspections.forEach((insp) => {
      const r = (insp.riskLevel || 'LOW').toUpperCase();
      if (riskCounts[r] !== undefined) riskCounts[r]++;
      else riskCounts.LOW++;

      const conf = insp.overallConfidence || 95;
      totalConfidence += conf <= 1 ? conf * 100 : conf;

      (insp.findings || []).forEach((f) => {
        totalIssues++;
        const s = (f.severity || 'LOW').toUpperCase();
        if (s === 'CRITICAL') criticalHazards++;
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
      openIncidents: incidents.filter((i) => i.status !== 'RESOLVED').length,
      resolvedIncidents: incidents.filter((i) => i.status === 'RESOLVED').length,
    });

    const complianceRate = totalIssues > 0
      ? ((resolvedIssues / totalIssues) * 100).toFixed(1)
      : '98.5';

    return {
      total,
      criticalHazards,
      openIssues,
      complianceRate: `${complianceRate}%`,
      ppeComplianceRate: `${ppeComplianceRate}%`,
      siteSafetyScore,
      avgConfidence: total > 0 ? (totalConfidence / total).toFixed(1) : '96.2',
      riskCounts,
      allHazards,
      activeIncidentsCount: incidents.filter((i) => i.status !== 'RESOLVED').length,
      activeCamerasCount: cameras.filter((c) => c.status === 'ONLINE').length,
    };
  };

  return (
    <InspectionContext.Provider
      value={{
        inspections,
        incidents,
        evidenceList,
        notifications,
        cameras,
        activeAlert,
        isAudioMuted,
        setIsAudioMuted,
        triggerHazardAlert,
        dismissActiveAlert,
        getInspection,
        addInspection,
        deleteInspection,
        updateFindingStatus,
        addIncident,
        updateIncidentStatus,
        assignIncident,
        addEvidence,
        deleteEvidence,
        markNotificationRead,
        clearNotifications,
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

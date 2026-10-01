import React, { createContext, useContext, useState, useEffect } from 'react';
import { inspectionService } from '../services/inspectionService';

const InspectionContext = createContext(null);

// Initial industrial inspection seed dataset
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
      { priority: 'P1 - HIGH', action: 'Lock out machine and bolt fixed yellow safety enclosure.', reason: 'Rotating component entrapment hazard.' },
      { priority: 'P2 - MEDIUM', action: 'Wipe cylinder rod and monitor weep rate during trial cycle.', reason: 'Quantify seal degradation rate.' }
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

export const InspectionProvider = ({ children }) => {
  const [inspections, setInspections] = useState(() => {
    const saved = localStorage.getItem('vg_inspections_store');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.warn('Failed parsing saved inspections', e);
      }
    }
    localStorage.setItem('vg_inspections_store', JSON.stringify(SEED_INSPECTIONS));
    return SEED_INSPECTIONS;
  });

  const [loading, setLoading] = useState(false);
  const [activeInspectionId, setActiveInspectionId] = useState(null);

  // Sync with backend API if online
  useEffect(() => {
    const syncBackend = async () => {
      try {
        const data = await inspectionService.getInspections();
        if (Array.isArray(data) && data.length > 0) {
          // Merge backend records with existing store
          setInspections((prev) => {
            const map = new Map();
            prev.forEach((item) => map.set(item.id, item));
            data.forEach((item) => {
              // Convert backend schema to unified inspection model
              const unified = {
                id: item.id || `INS-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
                name: item.title || item.name || 'Site Inspection Scan',
                site: item.site || 'Main Project Site',
                type: item.category || item.type || 'General Safety',
                inspector: item.inspector || 'Safety Auditor',
                location: item.location || 'Facility Work Zone',
                notes: item.description || item.notes || '',
                createdAt: item.createdAt || new Date().toISOString(),
                status: item.status || 'Completed',
                riskLevel: (item.risk || item.riskLevel || 'LOW').toUpperCase(),
                overallConfidence: item.confidence || item.overallConfidence || 95,
                fileName: item.fileName || 'inspection_target.jpg',
                fileSize: item.fileSize || '2.5 MB',
                imageUrl: item.imageUrl || '',
                summary: item.summary || '',
                explanation: item.explanation || '',
                findings: (item.findings || item.anomalies || []).map((f, idx) => ({
                  id: f.id || `F-${idx + 1}`,
                  label: f.label || f.title || f.name || 'Visual Anomaly',
                  severity: (f.severity || 'HIGH').toUpperCase(),
                  confidence: f.confidence || 90,
                  box_2d: f.box_2d || null,
                  status: f.status || 'Open',
                  evidence: f.evidence || '',
                  riskFactor: f.description || f.riskFactor || '',
                  complianceRef: f.complianceRef || 'Applicable safety standard',
                  correctiveAction: f.correctiveAction || (item.recommendations?.[idx]?.action) || 'Inspect and remediate hazard.',
                  assignedTo: f.assignedTo || null,
                })),
                recommendations: item.recommendations || [],
                notesList: item.notesList || []
              };
              map.set(unified.id, unified);
            });
            const merged = Array.from(map.values());
            localStorage.setItem('vg_inspections_store', JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.info('Using localized inspection telemetry database');
      }
    };

    syncBackend();
  }, []);

  // Update store helper
  const saveStore = (updatedList) => {
    setInspections(updatedList);
    localStorage.setItem('vg_inspections_store', JSON.stringify(updatedList));
  };

  // Add new inspection
  const addInspection = (newInspection) => {
    const updated = [newInspection, ...inspections];
    saveStore(updated);
    return newInspection;
  };

  // Get inspection by ID
  const getInspection = (id) => {
    return inspections.find((item) => item.id === id) || inspections[0] || null;
  };

  // Delete inspection
  const deleteInspection = async (id) => {
    try {
      await inspectionService.deleteInspection(id);
    } catch {}
    const updated = inspections.filter((item) => item.id !== id);
    saveStore(updated);
  };

  // Toggle Finding Status (Open / In Progress / Resolved)
  const updateFindingStatus = (inspectionId, findingId, newStatus) => {
    const updated = inspections.map((insp) => {
      if (insp.id !== inspectionId) return insp;
      const updatedFindings = (insp.findings || []).map((f) => {
        if (f.id === findingId) {
          return { ...f, status: newStatus };
        }
        return f;
      });
      return { ...insp, findings: updatedFindings };
    });
    saveStore(updated);
  };

  // Assign Finding to personnel
  const assignFinding = (inspectionId, findingId, assignee) => {
    const updated = inspections.map((insp) => {
      if (insp.id !== inspectionId) return insp;
      const updatedFindings = (insp.findings || []).map((f) => {
        if (f.id === findingId) {
          return { ...f, assignedTo: assignee };
        }
        return f;
      });
      return { ...insp, findings: updatedFindings };
    });
    saveStore(updated);
  };

  // Add inspection note
  const addNote = (inspectionId, text, author = 'Inspector') => {
    const updated = inspections.map((insp) => {
      if (insp.id !== inspectionId) return insp;
      const newNote = {
        id: Date.now(),
        author,
        text,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      };
      return { ...insp, notesList: [...(insp.notesList || []), newNote] };
    });
    saveStore(updated);
  };

  // Compute aggregate stats for Dashboard and Analytics
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

    const complianceRate = totalIssues > 0
      ? ((resolvedIssues / totalIssues) * 100).toFixed(1)
      : '98.5';

    return {
      total,
      criticalHazards,
      openIssues,
      complianceRate: `${complianceRate}%`,
      avgConfidence: total > 0 ? (totalConfidence / total).toFixed(1) : '96.2',
      riskCounts,
      allHazards,
    };
  };

  return (
    <InspectionContext.Provider
      value={{
        inspections,
        loading,
        getInspection,
        addInspection,
        deleteInspection,
        updateFindingStatus,
        assignFinding,
        addNote,
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

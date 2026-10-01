const fs = require('fs');
const path = require('path');
const supabase = require('../config/supabase');
const env = require('../config/env');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default initial dataset
const INITIAL_DB = {
  users: [],
  inspections: [
    {
      id: 'INS-0241',
      title: 'North Scaffolding Safety & Fall Protection Audit',
      site: 'Apex Tower — Zone B',
      location: 'Grid Sector 4B, Level 6 Platform',
      category: 'Scaffolding Safety',
      inspector: 'Sarah Connor (Lead Auditor)',
      risk: 'CRITICAL',
      confidence: 98.4,
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?q=80&w=1200&auto=format&fit=crop',
      summary: 'Critical structural coupling anomaly detected on scaffold tier 6. Primary diagonal brace locking pin is absent, presenting catastrophic collapse hazard under dynamic load. Worker harness lifeline tie-off unverified.',
      explanation: 'Spatial edge analysis flagged visual void at the diagonal joint intersection (Region B-4). Cross-referenced against OSHA 1926.451(a)(1) standard for scaffold structural integrity.',
      detections: [
        { name: 'Missing Diagonal Lock Pin', confidence: 98.4, severity: 'CRITICAL', location: 'Tier 6 Scaffolding Joint', box_2d: [180, 420, 520, 780] },
        { name: 'Unsecured Worker Proximity', confidence: 91.2, severity: 'HIGH', location: 'Platform Edge', box_2d: [350, 150, 750, 420] }
      ],
      anomalies: [
        { title: 'Missing Diagonal Lock Pin', severity: 'CRITICAL', confidence: 98.4, evidence: 'Absence of Grade-8 lock fastener in primary joint hub.' }
      ],
      recommendations: [
        { priority: 'P1 - IMMEDIATE', action: 'Halt scaffold elevation work and insert certified locking pin before workers access platform.', reason: 'Imminent collapse hazard exceeds minimum structural threshold.' }
      ],
      createdAt: '2026-10-01T08:30:00Z',
      updatedAt: '2026-10-01T08:30:00Z',
    },
    {
      id: 'INS-0240',
      title: 'Hydraulic Excavator Pre-Op Inspection',
      site: 'Harbor Gateway Extension',
      location: 'Heavy Machinery Staging Yard',
      category: 'Machinery',
      inspector: 'David Miller',
      risk: 'HIGH',
      confidence: 94.6,
      imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?q=80&w=1200&auto=format&fit=crop',
      summary: 'Fluid weeping detected on boom lift hydraulic cylinder gland seal. Missing safety interlock shield over right auxiliary drive pulley assembly.',
      explanation: 'Surface texture classifier isolated liquid sheen pattern along cylinder barrel and detected exposed rotating belt drive without physical guard.',
      detections: [
        { name: 'Exposed Rotating Pulley Drive', confidence: 96.0, severity: 'HIGH', location: 'Engine Compartment', box_2d: [200, 580, 540, 880] }
      ],
      anomalies: [
        { title: 'Exposed Rotating Pulley Drive', severity: 'HIGH', confidence: 96.0, evidence: 'Absence of safety grating over rotating drive belt.' }
      ],
      recommendations: [
        { priority: 'P1 - HIGH', action: 'Lock out machine and bolt fixed yellow safety enclosure.', reason: 'Rotating component entrapment hazard.' }
      ],
      createdAt: '2026-09-30T14:15:00Z',
      updatedAt: '2026-09-30T14:15:00Z',
    }
  ],
  incidents: [
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
    }
  ],
  evidence: [
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
    }
  ],
  cameras: [
    { id: 'CAM-001', name: 'North Scaffolding Matrix', site: 'Apex Tower — Zone B', location: 'Level 6 Platform', status: 'ONLINE', resolution: '1440p (2K)', fps: 30, risk: 'CRITICAL' },
    { id: 'CAM-002', name: 'Heavy Equipment Staging', site: 'Harbor Gateway Extension', location: 'Maintenance Dock', status: 'ONLINE', resolution: '1080p', fps: 25, risk: 'HIGH' },
    { id: 'CAM-003', name: 'Basement Concrete Pour', site: 'Eastside Medical Center', location: 'Trench Sector 2', status: 'ONLINE', resolution: '1440p', fps: 30, risk: 'SAFE' },
    { id: 'CAM-004', name: 'Substation Electrical Bay', site: 'Industrial Park Substation 4', location: '480V Main Distribution', status: 'ONLINE', resolution: '1080p', fps: 20, risk: 'SAFE' }
  ],
  notifications: [
    { id: 'NOTIF-1', type: 'CRITICAL', title: 'Critical Hazard: Missing Scaffold Pin', message: 'Visual anomaly on Apex Tower Zone B tier 6 scaffold frame.', timestamp: '12m ago', read: false },
    { id: 'NOTIF-2', type: 'HIGH', title: 'High Risk: Exposed Machine Pulley', message: 'Unguarded belt assembly detected in Heavy Equipment Yard.', timestamp: '45m ago', read: false }
  ],
  corrective_actions: [
    { id: 'CA-01', incidentId: 'INC-104', action: 'Install Grade-8 certified locking pin', assignedTo: 'Marcus Vance', priority: 'P1 - IMMEDIATE', dueDate: '2026-10-01 10:00', status: 'OPEN' },
    { id: 'CA-02', incidentId: 'INC-103', action: 'Bolt yellow protective safety enclosure', assignedTo: 'Dave Miller', priority: 'P2 - HIGH', dueDate: '2026-09-30 18:00', status: 'IN PROGRESS' }
  ],
  reports: [
    { id: 'REP-0241', inspectionId: 'INS-0241', site: 'Apex Tower — Zone B', date: '2026-10-01', riskScore: 98, status: 'GENERATED' }
  ]
};

const initLocalDb = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2));
  }
};

initLocalDb();

const readLocalDb = () => {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return { ...INITIAL_DB, ...parsed };
  } catch {
    return INITIAL_DB;
  }
};

const writeLocalDb = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed writing to local database file:', err.message);
  }
};

const isSupabaseConfigured = () => {
  return (
    env.SUPABASE_URL &&
    env.SUPABASE_KEY &&
    !env.SUPABASE_URL.includes('placeholder')
  );
};

const dbService = {
  // USER OPERATIONS
  async createUser(userData) {
    const userWithDefaults = {
      id: userData.id || `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: userData.role || 'INSPECTOR',
      organization: userData.organization || 'Enterprise Safety Division',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('users').insert([userWithDefaults]).select().single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase createUser fallback:', err.message);
      }
    }

    const db = readLocalDb();
    db.users.push(userWithDefaults);
    writeLocalDb(db);
    return userWithDefaults;
  },

  async findUserByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('email', normalizedEmail).single();
        if (!error && data) return data;
      } catch (err) {}
    }
    const db = readLocalDb();
    return db.users.find((u) => u.email === normalizedEmail) || null;
  },

  async findUserById(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('users').select('id, name, email, role, organization, createdAt').eq('id', id).single();
        if (!error && data) return data;
      } catch (err) {}
    }
    const db = readLocalDb();
    const user = db.users.find((u) => u.id === id);
    if (!user) return null;
    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  // INSPECTIONS
  async createInspection(inspectionData) {
    const inspection = {
      id: inspectionData.id || `INS-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: inspectionData.userId || null,
      title: inspectionData.title,
      site: inspectionData.site || 'Apex Tower — Zone B',
      location: inspectionData.location || 'Sector 4 Platform',
      fileName: inspectionData.fileName || 'inspection.jpg',
      fileSize: inspectionData.fileSize || '2.5 MB',
      imageUrl: inspectionData.imageUrl || '',
      category: inspectionData.category || 'Workplace Safety',
      inspector: inspectionData.inspector || 'Safety Inspector',
      risk: (inspectionData.risk || 'LOW').toUpperCase(),
      confidence: inspectionData.confidence || 95,
      summary: inspectionData.summary || '',
      detections: inspectionData.detections || [],
      anomalies: inspectionData.anomalies || [],
      recommendations: inspectionData.recommendations || [],
      explanation: inspectionData.explanation || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('inspections').insert([inspection]).select().single();
        if (!error && data) return data;
      } catch (err) {}
    }

    const db = readLocalDb();
    db.inspections.unshift(inspection);
    writeLocalDb(db);
    return inspection;
  },

  async getInspections(params = {}) {
    const { userId, search, risk, category, limit = 50 } = params;
    const db = readLocalDb();
    let list = [...(db.inspections || [])];

    if (userId) list = list.filter((i) => i.userId === userId || !i.userId);
    if (risk && risk !== 'ALL') list = list.filter((i) => (i.risk || '').toUpperCase() === risk.toUpperCase());
    if (category && category !== 'ALL') list = list.filter((i) => i.category === category);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          (i.title || '').toLowerCase().includes(q) ||
          (i.site || '').toLowerCase().includes(q) ||
          (i.summary || '').toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list.slice(0, Number(limit));
  },

  async getInspectionById(id) {
    const db = readLocalDb();
    return (db.inspections || []).find((i) => i.id === id) || null;
  },

  async deleteInspection(id) {
    const db = readLocalDb();
    const initialLen = db.inspections.length;
    db.inspections = db.inspections.filter((i) => i.id !== id);
    writeLocalDb(db);
    return db.inspections.length < initialLen;
  },

  // INCIDENTS
  async createIncident(incidentData) {
    const incident = {
      id: `INC-${Math.floor(100 + Math.random() * 900)}`,
      hazard: incidentData.hazard,
      severity: (incidentData.severity || 'HIGH').toUpperCase(),
      riskScore: incidentData.riskScore || 85,
      site: incidentData.site || 'Apex Tower — Zone B',
      location: incidentData.location || 'Sector 4 Platform',
      detectedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: incidentData.status || 'OPEN',
      assignedTo: incidentData.assignedTo || 'Site Safety Supervisor',
      evidenceImage: incidentData.evidenceImage || '',
      correctiveAction: incidentData.correctiveAction || 'Inspect and remediate hazard.',
      dueDate: incidentData.dueDate || new Date(Date.now() + 86400000).toISOString().slice(0, 16).replace('T', ' '),
    };

    const db = readLocalDb();
    db.incidents.unshift(incident);
    writeLocalDb(db);
    return incident;
  },

  async getIncidents(params = {}) {
    const db = readLocalDb();
    let list = [...(db.incidents || [])];
    if (params.status && params.status !== 'ALL') {
      list = list.filter((i) => i.status === params.status);
    }
    if (params.severity && params.severity !== 'ALL') {
      list = list.filter((i) => i.severity === params.severity);
    }
    return list;
  },

  async updateIncident(id, updateData) {
    const db = readLocalDb();
    const idx = (db.incidents || []).findIndex((i) => i.id === id);
    if (idx === -1) return null;
    db.incidents[idx] = {
      ...db.incidents[idx],
      ...updateData,
      resolvedAt: updateData.status === 'RESOLVED' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : db.incidents[idx].resolvedAt,
    };
    writeLocalDb(db);
    return db.incidents[idx];
  },

  // EVIDENCE
  async createEvidence(evidenceData) {
    const evidence = {
      id: `EVD-${Math.floor(100 + Math.random() * 900)}`,
      hazard: evidenceData.hazard || 'Optical Defect',
      severity: (evidenceData.severity || 'HIGH').toUpperCase(),
      confidence: evidenceData.confidence || 95,
      camera: evidenceData.camera || 'CAM-01 (Apex Tower)',
      location: evidenceData.location || 'Sector 4 Platform',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      imageUrl: evidenceData.imageUrl || '',
    };
    const db = readLocalDb();
    db.evidence.unshift(evidence);
    writeLocalDb(db);
    return evidence;
  },

  async getEvidenceList() {
    const db = readLocalDb();
    return db.evidence || [];
  },

  // CAMERAS
  async getCameras() {
    const db = readLocalDb();
    return db.cameras || [];
  },

  async updateCamera(id, updateData) {
    const db = readLocalDb();
    const idx = (db.cameras || []).findIndex((c) => c.id === id);
    if (idx === -1) return null;
    db.cameras[idx] = { ...db.cameras[idx], ...updateData };
    writeLocalDb(db);
    return db.cameras[idx];
  },

  // NOTIFICATIONS
  async getNotifications() {
    const db = readLocalDb();
    return db.notifications || [];
  },

  async markNotificationRead(id) {
    const db = readLocalDb();
    const notif = (db.notifications || []).find((n) => n.id === id);
    if (notif) notif.read = true;
    writeLocalDb(db);
    return notif;
  },

  // DASHBOARD STATS
  async getDashboardStats() {
    const db = readLocalDb();
    const inspections = db.inspections || [];
    const incidents = db.incidents || [];
    const cameras = db.cameras || [];

    const criticalHazards = inspections.filter((i) => (i.risk || '').toUpperCase() === 'CRITICAL').length;
    const openIncidents = incidents.filter((i) => i.status !== 'RESOLVED').length;
    const resolvedIncidents = incidents.filter((i) => i.status === 'RESOLVED').length;

    return {
      totalInspections: inspections.length,
      criticalHazards,
      openIssues: openIncidents,
      resolvedIncidents,
      complianceRate: '94.2%',
      ppeComplianceRate: '92.4%',
      siteSafetyScore: 86,
      activeCameras: cameras.filter((c) => c.status === 'ONLINE').length,
    };
  }
};

module.exports = dbService;

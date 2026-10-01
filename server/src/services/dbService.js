const fs = require('fs');
const path = require('path');
const supabase = require('../config/supabase');
const env = require('../config/env');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure local fallback db file exists
const initLocalDb = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify({ users: [], inspections: [] }, null, 2)
    );
  }
};

initLocalDb();

const readLocalDb = () => {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { users: [], inspections: [] };
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
      role: userData.role || 'Safety Inspector',
      organization: userData.organization || 'Enterprise Safety Division',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('users')
          .insert([userWithDefaults])
          .select()
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase createUser failed, falling back to local DB:', err.message);
      }
    }

    // Local DB fallback
    const db = readLocalDb();
    db.users.push(userWithDefaults);
    writeLocalDb(db);
    return userWithDefaults;
  },

  async findUserByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', normalizedEmail)
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase findUserByEmail failed, checking local DB:', err.message);
      }
    }

    const db = readLocalDb();
    return db.users.find((u) => u.email === normalizedEmail) || null;
  },

  async findUserById(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email, role, organization, createdAt')
          .eq('id', id)
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase findUserById failed, checking local DB:', err.message);
      }
    }

    const db = readLocalDb();
    const user = db.users.find((u) => u.id === id);
    if (!user) return null;
    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  async updateUser(id, updateData) {
    const payload = {
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('users')
          .update(payload)
          .eq('id', id)
          .select('id, name, email, role, organization, createdAt')
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase updateUser failed, updating local DB:', err.message);
      }
    }

    const db = readLocalDb();
    const index = db.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    db.users[index] = { ...db.users[index], ...payload };
    writeLocalDb(db);
    const { password: _, ...safeUser } = db.users[index];
    return safeUser;
  },

  // INSPECTION OPERATIONS
  async createInspection(inspectionData) {
    const inspection = {
      id: inspectionData.id || `insp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: inspectionData.userId || null,
      title: inspectionData.title,
      fileName: inspectionData.fileName,
      fileSize: inspectionData.fileSize,
      imageUrl: inspectionData.imageUrl,
      category: inspectionData.category || 'Workplace Safety',
      description: inspectionData.description || '',
      risk: inspectionData.risk || 'LOW',
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
        const { data, error } = await supabase
          .from('inspections')
          .insert([inspection])
          .select()
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase createInspection failed, storing in local DB:', err.message);
      }
    }

    const db = readLocalDb();
    db.inspections.unshift(inspection);
    writeLocalDb(db);
    return inspection;
  },

  async getInspections(params = {}) {
    const { userId, search, risk, category, limit = 50 } = params;

    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('inspections').select('*').order('createdAt', { ascending: false });

        if (userId) query = query.eq('userId', userId);
        if (risk && risk !== 'ALL') query = query.eq('risk', risk);
        if (category && category !== 'ALL') query = query.eq('category', category);
        if (limit) query = query.limit(Number(limit));

        const { data, error } = await query;
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getInspections failed, querying local DB:', err.message);
      }
    }

    const db = readLocalDb();
    let list = [...db.inspections];

    if (userId) {
      list = list.filter((i) => i.userId === userId || !i.userId);
    }
    if (risk && risk !== 'ALL') {
      list = list.filter((i) => (i.risk || '').toUpperCase() === risk.toUpperCase());
    }
    if (category && category !== 'ALL') {
      list = list.filter((i) => i.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          (i.title || '').toLowerCase().includes(q) ||
          (i.fileName || '').toLowerCase().includes(q) ||
          (i.summary || '').toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list.slice(0, Number(limit));
  },

  async getInspectionById(id) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('inspections')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getInspectionById failed, searching local DB:', err.message);
      }
    }

    const db = readLocalDb();
    return db.inspections.find((i) => i.id === id) || null;
  },

  async deleteInspection(id) {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase
          .from('inspections')
          .delete()
          .eq('id', id);

        if (!error) return true;
      } catch (err) {
        console.warn('Supabase deleteInspection failed, deleting from local DB:', err.message);
      }
    }

    const db = readLocalDb();
    const initialLen = db.inspections.length;
    db.inspections = db.inspections.filter((i) => i.id !== id);
    writeLocalDb(db);
    return db.inspections.length < initialLen;
  },

  async getAnalytics(userId = null) {
    const inspections = await this.getInspections({ userId, limit: 1000 });

    const riskCounts = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    const categoryCounts = {};
    let totalConfidence = 0;
    let anomalyCount = 0;

    inspections.forEach((insp) => {
      const r = (insp.risk || 'LOW').toUpperCase();
      if (riskCounts[r] !== undefined) riskCounts[r]++;
      else riskCounts.LOW++;

      const cat = insp.category || 'Workplace Safety';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

      const conf = insp.confidence || 95;
      totalConfidence += conf <= 1 ? conf * 100 : conf;

      anomalyCount += (insp.anomalies?.length || 0);
    });

    return {
      total: inspections.length,
      riskCounts,
      categoryCounts,
      avgConfidence: inspections.length > 0 ? Math.round(totalConfidence / inspections.length) : 0,
      anomalyCount,
    };
  },
};

module.exports = dbService;

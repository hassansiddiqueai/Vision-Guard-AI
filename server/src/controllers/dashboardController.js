const dbService = require('../services/dbService');

const dashboardController = {
  async getStats(req, res, next) {
    try {
      const stats = await dbService.getDashboardStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  },

  async getActivity(req, res, next) {
    try {
      const { range = '7d' } = req.query;
      const activityData = [
        { day: 'Mon', count: 18, critical: 2, resolved: 14 },
        { day: 'Tue', count: 24, critical: 4, resolved: 20 },
        { day: 'Wed', count: 32, critical: 3, resolved: 28 },
        { day: 'Thu', count: 28, critical: 1, resolved: 26 },
        { day: 'Fri', count: 35, critical: 5, resolved: 30 },
        { day: 'Sat', count: 20, critical: 2, resolved: 18 },
        { day: 'Sun', count: 15, critical: 1, resolved: 14 },
      ];
      res.json({ success: true, data: activityData, range });
    } catch (err) {
      next(err);
    }
  },

  async getHazards(req, res, next) {
    try {
      const inspections = await dbService.getInspections({ limit: 100 });
      const hazards = [];
      inspections.forEach((insp) => {
        (insp.findings || insp.anomalies || []).forEach((f) => {
          hazards.push({
            ...f,
            inspectionId: insp.id,
            site: insp.site,
            category: insp.category,
          });
        });
      });
      res.json({ success: true, data: hazards });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = dashboardController;

const dbService = require('../services/dbService');

const incidentController = {
  async getIncidents(req, res, next) {
    try {
      const { status, severity } = req.query;
      const incidents = await dbService.getIncidents({ status, severity });
      res.json({ success: true, data: incidents });
    } catch (err) {
      next(err);
    }
  },

  async createIncident(req, res, next) {
    try {
      const { hazard, severity, site, location, assignedTo, correctiveAction, evidenceImage } = req.body;
      if (!hazard) {
        return res.status(400).json({ error: 'Hazard title is required' });
      }

      const incident = await dbService.createIncident({
        hazard,
        severity,
        site,
        location,
        assignedTo,
        correctiveAction,
        evidenceImage,
      });

      res.status(201).json({ success: true, data: incident });
    } catch (err) {
      next(err);
    }
  },

  async updateIncident(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await dbService.updateIncident(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Incident not found' });
      }
      res.json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = incidentController;

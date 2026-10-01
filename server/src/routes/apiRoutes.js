const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');
const dashboardController = require('../controllers/dashboardController');
const dbService = require('../services/dbService');
const { optionalAuth, requireAuth } = require('../middlewares/authMiddleware');

// Dashboard endpoints
router.get('/dashboard/stats', optionalAuth, dashboardController.getStats);
router.get('/dashboard/activity', optionalAuth, dashboardController.getActivity);
router.get('/dashboard/hazards', optionalAuth, dashboardController.getHazards);

// Incidents endpoints
router.get('/incidents', optionalAuth, incidentController.getIncidents);
router.post('/incidents', optionalAuth, incidentController.createIncident);
router.patch('/incidents/:id', optionalAuth, incidentController.updateIncident);

// Evidence endpoints
router.get('/evidence', optionalAuth, async (req, res, next) => {
  try {
    const evidence = await dbService.getEvidenceList();
    res.json({ success: true, data: evidence });
  } catch (err) {
    next(err);
  }
});

router.post('/evidence', optionalAuth, async (req, res, next) => {
  try {
    const created = await dbService.createEvidence(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    next(err);
  }
});

// Camera endpoints
router.get('/cameras', optionalAuth, async (req, res, next) => {
  try {
    const cameras = await dbService.getCameras();
    res.json({ success: true, data: cameras });
  } catch (err) {
    next(err);
  }
});

router.patch('/cameras/:id', optionalAuth, async (req, res, next) => {
  try {
    const updated = await dbService.updateCamera(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
});

// Notification endpoints
router.get('/notifications', optionalAuth, async (req, res, next) => {
  try {
    const notifs = await dbService.getNotifications();
    res.json({ success: true, data: notifs });
  } catch (err) {
    next(err);
  }
});

router.patch('/notifications/:id', optionalAuth, async (req, res, next) => {
  try {
    const notif = await dbService.markNotificationRead(req.params.id);
    res.json({ success: true, data: notif });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

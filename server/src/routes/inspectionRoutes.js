const express = require('express');
const inspectionController = require('../controllers/inspectionController');
const upload = require('../middlewares/uploadMiddleware');
const { optionalAuth } = require('../middlewares/authMiddleware');

const router = express.Router();

// Analyze image
router.post('/analyze', optionalAuth, upload.single('image'), inspectionController.analyzeImage);

// Aggregate analytics
router.get('/analytics', optionalAuth, inspectionController.getAnalytics);

// List inspections with filters
router.get('/', optionalAuth, inspectionController.getInspections);

// Single inspection detail
router.get('/:id', optionalAuth, inspectionController.getInspectionById);

// Delete inspection
router.delete('/:id', optionalAuth, inspectionController.deleteInspection);

module.exports = router;

const storageService = require('../services/storageService');
const aiVisionService = require('../services/aiVisionService');
const dbService = require('../services/dbService');
const { analyzeInputSchema } = require('../validations/inspectionValidation');

const inspectionController = {
  // Analyze uploaded inspection image with Gemini Vision AI
  async analyzeImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded. Please provide an inspection image.' });
      }

      const { category, description } = analyzeInputSchema.parse(req.body);
      const userId = req.user ? req.user.id : null;

      // 1. Upload to Supabase/local storage
      const imageUrl = await storageService.uploadInspectionImage(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      // 2. Run Vision AI Inference
      const aiAnalysis = await aiVisionService.analyzeInspectionImage(
        req.file.buffer,
        req.file.mimetype,
        category,
        description
      );

      // 3. Format inspection record
      const fileSizeFormatted = `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`;
      const inspectionRecord = {
        userId,
        title: aiAnalysis.title || `${category} Audit - ${req.file.originalname}`,
        fileName: req.file.originalname,
        fileSize: fileSizeFormatted,
        imageUrl,
        category,
        description: description || '',
        risk: aiAnalysis.risk,
        confidence: aiAnalysis.confidence,
        summary: aiAnalysis.summary,
        detections: aiAnalysis.detections,
        anomalies: aiAnalysis.anomalies,
        recommendations: aiAnalysis.recommendations,
        explanation: aiAnalysis.explanation,
      };

      // 4. Save to database
      const savedInspection = await dbService.createInspection(inspectionRecord);

      return res.status(201).json(savedInspection);
    } catch (error) {
      next(error);
    }
  },

  // Get all inspections with filters
  async getInspections(req, res, next) {
    try {
      const { search, risk, category, limit } = req.query;
      const userId = req.user ? req.user.id : null;

      const inspections = await dbService.getInspections({
        userId,
        search,
        risk,
        category,
        limit,
      });

      return res.status(200).json(inspections);
    } catch (error) {
      next(error);
    }
  },

  // Get single inspection by ID
  async getInspectionById(req, res, next) {
    try {
      const { id } = req.params;
      const inspection = await dbService.getInspectionById(id);

      if (!inspection) {
        return res.status(404).json({ error: 'Inspection report not found.' });
      }

      return res.status(200).json(inspection);
    } catch (error) {
      next(error);
    }
  },

  // Delete inspection
  async deleteInspection(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await dbService.deleteInspection(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Inspection record not found.' });
      }

      return res.status(200).json({ success: true, message: 'Inspection record deleted successfully.' });
    } catch (error) {
      next(error);
    }
  },

  // Get aggregate analytics
  async getAnalytics(req, res, next) {
    try {
      const userId = req.user ? req.user.id : null;
      const analytics = await dbService.getAnalytics(userId);

      return res.status(200).json(analytics);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = inspectionController;

const { z } = require('zod');

const riskEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

const detectionSchema = z.object({
  name: z.string(),
  confidence: z.number().min(0).max(100),
  severity: riskEnum.default('LOW'),
  location: z.string().optional().default(''),
  box_2d: z.array(z.number()).length(4).optional(), // [ymin, xmin, ymax, xmax] (0-1000)
});

const anomalySchema = z.object({
  title: z.string(),
  description: z.string(),
  severity: riskEnum.default('HIGH'),
  evidence: z.string().optional().default(''),
  confidence: z.number().min(0).max(100).default(90),
});

const recommendationSchema = z.object({
  priority: z.string().default('P1 - IMMEDIATE'),
  action: z.string(),
  reason: z.string().optional().default(''),
});

const aiInspectionResponseSchema = z.object({
  title: z.string().default('Visual Inspection Diagnostic'),
  summary: z.string().default('Visual analysis completed.'),
  risk: riskEnum.default('LOW'),
  confidence: z.number().min(0).max(100).default(95),
  detections: z.array(detectionSchema).default([]),
  anomalies: z.array(anomalySchema).default([]),
  recommendations: z.array(recommendationSchema).default([]),
  explanation: z.string().default(''),
});

const analyzeInputSchema = z.object({
  category: z.string().default('Workplace Safety'),
  description: z.string().optional().default(''),
});

module.exports = {
  riskEnum,
  detectionSchema,
  anomalySchema,
  recommendationSchema,
  aiInspectionResponseSchema,
  analyzeInputSchema,
};

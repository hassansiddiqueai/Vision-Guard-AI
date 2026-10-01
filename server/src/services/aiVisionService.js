const ai = require('../config/gemini');
const { aiInspectionResponseSchema } = require('../validations/inspectionValidation');

const aiVisionService = {
  /**
   * Analyzes an inspection image using Gemini Vision AI
   * @param {Buffer} imageBuffer - Raw image buffer
   * @param {string} mimeType - Image MIME type (image/jpeg, image/png, etc.)
   * @param {string} category - Inspection category (Workplace Safety, Construction, Equipment, Infrastructure, Other)
   * @param {string} userNotes - Optional context notes provided by inspector
   * @returns {Promise<Object>} Structured AI diagnostic report
   */
  async analyzeInspectionImage(imageBuffer, mimeType = 'image/jpeg', category = 'Workplace Safety', userNotes = '') {
    const base64Data = imageBuffer.toString('base64');

    const systemPrompt = `You are VisionGuard AI, an expert industrial safety inspector, structural engineer, and computer-vision anomaly detection system.
Your mission is to perform deep visual inspection of the uploaded image to identify safety violations, hazards, structural anomalies, missing PPE, equipment wear, and regulatory non-compliances (e.g. OSHA, ISO, ANSI).

Inspection Domain Context: ${category}
Auditor Field Notes: ${userNotes || 'None provided'}

Analyze the image carefully and produce a comprehensive, structured JSON assessment.

Rules for response:
1. Overall Risk must be one of: "LOW", "MEDIUM", "HIGH", "CRITICAL".
   - CRITICAL: Imminent life safety danger (e.g. active worker at height without harness, uncapped rebar in walkway, structural collapse risk).
   - HIGH: Serious non-compliance or hazard (e.g. missing guardrails, unshielded rotating machinery, blocked emergency exits).
   - MEDIUM: Moderate maintenance or safety issues (e.g. minor hydraulic weeping, surface corrosion, missing warning signage).
   - LOW: Safe compliant environment, standard routine maintenance.
2. Detections: Key objects, workers, equipment, or areas observed in the image. Where possible, include "box_2d": [ymin, xmin, ymax, xmax] as normalized integers from 0 to 1000 representing the bounding region.
3. Anomalies: Specific visual defects, non-compliances, or hazards found. Include title, description, severity ("LOW"|"MEDIUM"|"HIGH"|"CRITICAL"), visual evidence description, and confidence (0-100).
4. Recommendations: Actionable, prioritized corrective actions ("P1 - IMMEDIATE", "P2 - HIGH", "P3 - STANDARD/ROUTINE").
5. Explanation: Provide a clear, technical "Why was this detected?" explainability paragraph referencing visual cues and safety standards.
6. Confidence: An overall numeric percentage score (e.g. 96.5) reflecting the certainty of this assessment.

Respond ONLY with valid JSON conforming to this schema:
{
  "title": "String - Descriptive title of audit",
  "summary": "String - 2-3 sentence executive summary of findings",
  "risk": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "confidence": 95.0,
  "detections": [
    {
      "name": "String - Object/element name",
      "confidence": 98.0,
      "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      "location": "String - Description of location in image",
      "box_2d": [ymin, xmin, ymax, xmax]
    }
  ],
  "anomalies": [
    {
      "title": "String - Anomaly title",
      "description": "String - Detailed description of defect or violation",
      "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
      "evidence": "String - Visual evidence supporting detection",
      "confidence": 95.0
    }
  ],
  "recommendations": [
    {
      "priority": "P1 - IMMEDIATE" | "P2 - HIGH" | "P3 - STANDARD",
      "action": "String - Concrete action required",
      "reason": "String - Regulatory or safety rationale"
    }
  ],
  "explanation": "String - Technical explainable AI reasoning for why these issues were identified"
}`;

    // Supported models in order of priority
    const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    let lastError = null;

    for (const modelName of models) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            systemPrompt,
          ],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        });

        const rawText = response.text;
        if (!rawText) {
          throw new Error('Empty response received from Vision AI model');
        }

        // Clean any accidental markdown wrap
        let jsonStr = rawText.trim();
        if (jsonStr.startsWith('```json')) {
          jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (jsonStr.startsWith('```')) {
          jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        const parsedJson = JSON.parse(jsonStr);

        // Normalize risk if anomalies has critical
        if (parsedJson.anomalies && parsedJson.anomalies.some(a => (a.severity || '').toUpperCase() === 'CRITICAL')) {
          parsedJson.risk = 'CRITICAL';
        }

        // Validate through Zod
        const validated = aiInspectionResponseSchema.parse(parsedJson);
        return validated;
      } catch (err) {
        console.warn(`Vision model ${modelName} attempt failed: ${err.message}`);
        lastError = err;
        // Continue to next model if available
      }
    }

    throw new Error(`AI Vision Analysis failed: ${lastError ? lastError.message : 'Unable to complete inference'}`);
  },
};

module.exports = aiVisionService;

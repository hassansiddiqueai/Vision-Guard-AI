const { GoogleGenAI } = require('@google/genai');
const env = require('./env');

if (!env.GEMINI_API_KEY) {
  console.warn('WARNING: GEMINI_API_KEY is missing from environment variables. AI vision analysis will fail.');
}

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

module.exports = ai;

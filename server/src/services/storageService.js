const path = require('path');
const fs = require('fs');
const supabase = require('../config/supabase');
const env = require('../config/env');

const storageService = {
  /**
   * Uploads an image file buffer to Supabase Storage with local fallback
   * @param {Buffer} buffer - File buffer
   * @param {string} originalName - Original filename
   * @param {string} mimeType - File mime type
   * @returns {Promise<string>} Public URL of the uploaded image
   */
  async uploadInspectionImage(buffer, originalName, mimeType = 'image/jpeg') {
    const ext = path.extname(originalName) || '.jpg';
    const fileName = `inspection_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = `uploads/${fileName}`;

    // Attempt Supabase Storage first if configured
    if (env.SUPABASE_URL && env.SUPABASE_KEY && !env.SUPABASE_URL.includes('placeholder')) {
      try {
        const { data, error } = await supabase.storage
          .from('inspections')
          .upload(filePath, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!error && data) {
          const { data: publicData } = supabase.storage
            .from('inspections')
            .getPublicUrl(filePath);

          if (publicData && publicData.publicUrl) {
            return publicData.publicUrl;
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload failed, saving to local static storage:', err.message);
      }
    }

    // Fallback: Save to local public/uploads directory
    const uploadsDir = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const localFilePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(localFilePath, buffer);

    // Return URL served by Express
    return `/uploads/${fileName}`;
  },
};

module.exports = storageService;

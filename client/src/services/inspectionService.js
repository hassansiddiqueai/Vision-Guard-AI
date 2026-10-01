import api from './api';

export const inspectionService = {
  // Analyze an uploaded image with AI
  async analyzeImage(formData, onUploadProgress) {
    try {
      const response = await api.post('/inspections/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || error.response.data.message || 'Vision AI analysis failed');
      }
      throw error;
    }
  },

  // Get all inspections with optional filters
  async getInspections(params = {}) {
    try {
      const response = await api.get('/inspections', { params });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || 'Failed to fetch inspections');
      }
      throw error;
    }
  },

  // Get single inspection by ID
  async getInspectionById(id) {
    try {
      const response = await api.get(`/inspections/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || 'Failed to fetch inspection details');
      }
      throw error;
    }
  },

  // Delete an inspection
  async deleteInspection(id) {
    try {
      const response = await api.delete(`/inspections/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || 'Failed to delete inspection');
      }
      throw error;
    }
  },

  // Get aggregate analytics data
  async getAnalytics() {
    try {
      const response = await api.get('/inspections/analytics');
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || 'Failed to fetch analytics');
      }
      throw error;
    }
  }
};

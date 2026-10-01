import api from './api';

export const authService = {
  // Login with email and password
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      // If server is not reachable or endpoint not yet active, throw appropriate message
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || error.response.data.message || 'Login failed');
      }
      throw error;
    }
  },

  // Register a new user
  async register(fullName, email, password) {
    try {
      const response = await api.post('/auth/register', {
        name: fullName,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || error.response.data.message || 'Registration failed');
      }
      throw error;
    }
  },

  // Get current user profile
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || 'Failed to fetch user profile');
      }
      throw error;
    }
  },

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || 'Failed to update profile');
      }
      throw error;
    }
  },

  // Logout helper
  logout() {
    localStorage.removeItem('vg_token');
    localStorage.removeItem('vg_user');
  }
};

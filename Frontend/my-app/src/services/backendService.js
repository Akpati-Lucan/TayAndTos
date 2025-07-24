import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080';

class BackendService {
  constructor() {
    this.isBackendAvailable = false;
    this.lastHealthCheck = null;
    this.healthCheckInterval = null;
  }

  async checkBackendHealth() {
    try {
      console.log('Checking backend health at:', `${BACKEND_URL}/health`);
      const response = await axios.get(`${BACKEND_URL}/health`, { timeout: 3000 });
      this.isBackendAvailable = response.status === 200;
      this.lastHealthCheck = new Date();
      console.log('Backend health check: OK');
      return true;
    } catch (error) {
      this.isBackendAvailable = false;
      console.warn('Backend health check failed:', error.message);
      console.warn('Error details:', error.response?.status, error.response?.data);
      return false;
    }
  }

  getBackendStatus() {
    return {
      isAvailable: this.isBackendAvailable,
      lastCheck: this.lastHealthCheck,
      url: BACKEND_URL
    };
  }

  isUserAuthenticated() {
    const token = localStorage.getItem('token');
    const userData = this.getCachedUserData();
    return {
      hasToken: !!token,
      hasUserData: !!userData,
      isAuthenticated: !!(token && userData)
    };
  }

  startHealthChecks(intervalMs = 30000) {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    this.checkBackendHealth();
    this.healthCheckInterval = setInterval(() => {
      this.checkBackendHealth();
    }, intervalMs);
    console.log(`Backend health checks started (interval: ${intervalMs}ms)`);
  }

  stopHealthChecks() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      console.log('Backend health checks stopped');
    }
  }

  async makeAuthenticatedRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    console.log('Checking for authentication token...');
    if (!token) {
      console.log('No token found in localStorage');
      throw new Error('No authentication token found');
    }
    console.log('Token found, proceeding with API request');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    };

    try {
      console.log('Checking backend availability...');
      if (!this.isBackendAvailable) {
        console.log('Backend not available, checking health...');
        await this.checkBackendHealth();
      }

      if (!this.isBackendAvailable) {
        console.log('Backend health check failed');
        throw new Error('Backend server is not available');
      }

      console.log(`Making API request to: ${BACKEND_URL}${endpoint}`);
      const response = await axios.get(`${BACKEND_URL}${endpoint}`, config);
      console.log('API request successful');
      return response.data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async makeAuthenticatedPost(endpoint, data, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      if (!this.isBackendAvailable) await this.checkBackendHealth();
      if (!this.isBackendAvailable) throw new Error('Backend server is not available');
      const response = await axios.post(`${BACKEND_URL}${endpoint}`, data, config);
      return response.data;
    } catch (error) {
      console.error(`API POST request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async makeAuthenticatedPut(endpoint, data, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      if (!this.isBackendAvailable) await this.checkBackendHealth();
      if (!this.isBackendAvailable) throw new Error('Backend server is not available');
      const response = await axios.put(`${BACKEND_URL}${endpoint}`, data, config);
      return response.data;
    } catch (error) {
      console.error(`API PUT request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getUserProfile() {
    try {
      console.log('Attempting to fetch user profile from API...');
      return await this.makeAuthenticatedRequest('/users/profile');
    } catch (error) {
      console.log('API call failed, checking for cached data...');
      const userData = this.getCachedUserData();
      if (userData) {
        console.log('Using cached user data as fallback');
        return userData;
      }
      console.log('No cached data available, throwing error');
      throw error;
    }
  }

  getCachedUserData() {
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
    try {
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing cached user data:', error);
      return null;
    }
  }

  async getUserBookings() {
    return await this.makeAuthenticatedRequest('/users/bookings');
  }

  async updateUserProfile(profileData) {
    return await this.makeAuthenticatedPut('/users/profile', profileData);
  }

  async updateUserPassword(passwordData) {
    return await this.makeAuthenticatedPut('/users/profile/password', passwordData);
  }

  async deleteUser(userId) {
    if (!userId) throw new Error('User ID is required');
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token found');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    };

    try {
      if (!this.isBackendAvailable) await this.checkBackendHealth();
      if (!this.isBackendAvailable) throw new Error('Backend server is not available');
      const response = await axios.delete(`${BACKEND_URL}/users/${userId}`, config);
      return response.data;
    } catch (error) {
      console.error(`API DELETE request failed for /users/${userId}:`, error);
      throw error;
    }
  }

  clearCachedUserData() {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
  }

  // Test backend connectivity
  async testBackendConnection() {
    console.log('Testing backend connection...');
    try {
      const response = await axios.get(`${BACKEND_URL}/health`, { 
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Backend connection test successful:', response.data);
      return true;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      if (error.code === 'ECONNREFUSED') {
        console.error('Backend server is not running or not accessible');
      }
      return false;
    }
  }
}

const backendService = new BackendService();
export default backendService;

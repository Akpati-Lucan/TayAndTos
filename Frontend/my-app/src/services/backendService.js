import axios from 'axios';

const BACKEND_URL = 'http://localhost:8080';

class BackendService {
  constructor() {
    this.isBackendAvailable = false;
    this.lastHealthCheck = null;
    this.healthCheckInterval = null;
  }

  // Check if backend is running
  async checkBackendHealth() {
    try {
      const response = await axios.get(`${BACKEND_URL}/health`, { 
        timeout: 3000 
      });
      this.isBackendAvailable = response.status === 200;
      this.lastHealthCheck = new Date();
      console.log('Backend health check: OK');
      return true;
    } catch (error) {
      this.isBackendAvailable = false;
      console.warn('Backend health check failed:', error.message);
      return false;
    }
  }

  // Get current backend status
  getBackendStatus() {
    return {
      isAvailable: this.isBackendAvailable,
      lastCheck: this.lastHealthCheck,
      url: BACKEND_URL
    };
  }

  // Start periodic health checks
  startHealthChecks(intervalMs = 30000) { // Check every 30 seconds by default
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    // Initial check
    this.checkBackendHealth();

    // Set up periodic checks
    this.healthCheckInterval = setInterval(() => {
      this.checkBackendHealth();
    }, intervalMs);

    console.log(`Backend health checks started (interval: ${intervalMs}ms)`);
  }

  // Stop periodic health checks
  stopHealthChecks() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
      console.log('Backend health checks stopped');
    }
  }

  // Make authenticated API request with fallback
  async makeAuthenticatedRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    };

    try {
      // Check backend health first
      if (!this.isBackendAvailable) {
        await this.checkBackendHealth();
      }

      if (!this.isBackendAvailable) {
        throw new Error('Backend server is not available');
      }

      const response = await axios.get(`${BACKEND_URL}${endpoint}`, config);
      return response.data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Make authenticated POST request
  async makeAuthenticatedPost(endpoint, data, options = {}) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      // Check backend health first
      if (!this.isBackendAvailable) {
        await this.checkBackendHealth();
      }

      if (!this.isBackendAvailable) {
        throw new Error('Backend server is not available');
      }

      const response = await axios.post(`${BACKEND_URL}${endpoint}`, data, config);
      return response.data;
    } catch (error) {
      console.error(`API POST request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Make authenticated PUT request
  async makeAuthenticatedPut(endpoint, data, options = {}) {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      // Check backend health first
      if (!this.isBackendAvailable) {
        await this.checkBackendHealth();
      }

      if (!this.isBackendAvailable) {
        throw new Error('Backend server is not available');
      }

      const response = await axios.put(`${BACKEND_URL}${endpoint}`, data, config);
      return response.data;
    } catch (error) {
      console.error(`API PUT request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get user profile with fallback to cached data
  async getUserProfile() {
    try {
      return await this.makeAuthenticatedRequest('/users/profile');
    } catch (error) {
      // Fallback to cached data
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userData) {
        console.warn('Using cached user data due to API error');
        return JSON.parse(userData);
      }
      throw error;
    }
  }

  // Get user bookings
  async getUserBookings() {
    return await this.makeAuthenticatedRequest('/users/bookings');
  }

  // Update user profile
  async updateUserProfile(profileData) {
    return await this.makeAuthenticatedPut('/users/profile', profileData);
  }

  // Update user password
  async updateUserPassword(passwordData) {
    return await this.makeAuthenticatedPut('/users/profile/password', passwordData);
  }
}

// Create singleton instance
const backendService = new BackendService();

export default backendService; 
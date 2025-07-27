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
  
      const method = (options.method || 'get').toLowerCase();
      const url = `${BACKEND_URL}${endpoint}`;
  
      console.log(`Making ${method.toUpperCase()} request to: ${url}`);
  
      // Extract data if present (for POST/PUT/PATCH)
      const { data, ...restConfig } = config;
  
      const response = 
        ['post', 'put', 'patch'].includes(method)
          ? await axios[method](url, data, restConfig)
          : await axios[method](url, restConfig);
  
      console.log('API request successful');
      return response.data;
  
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }
  
  async makeAuthenticatedPost(endpoint, data = {}, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found');
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
      if (!this.isBackendAvailable) {
        console.log('Checking backend availability...');
        await this.checkBackendHealth();
      }
  
      if (!this.isBackendAvailable) {
        throw new Error('Backend server is not available');
      }
  
      const url = `${BACKEND_URL}${endpoint}`;
      console.log(`Sending POST to: ${url}`);
      const response = await axios.post(url, data, config);
      return response.data;
  
    } catch (error) {
      const status = error.response?.status;
  
      // Optional: auto logout or redirect if unauthorized
      if (status === 401 || status === 403) {
        console.warn('Authorization failed, redirecting to login');
        localStorage.removeItem('token');
        window.location.href = '/login'; // or use a router redirect
      }
  
      console.error(`API POST request failed for ${endpoint}:`, error);
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to complete POST request'
      );
    }
  }
  
  async makeAuthenticatedPut(endpoint, data = {}, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found');
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
      if (!this.isBackendAvailable) {
        console.log('Checking backend availability...');
        await this.checkBackendHealth();
      }
  
      if (!this.isBackendAvailable) {
        throw new Error('Backend server is not available');
      }
  
      const url = `${BACKEND_URL}${endpoint}`;
      console.log(`Sending PUT to: ${url}`);
      const response = await axios.put(url, data, config);
      return response.data;
  
    } catch (error) {
      const status = error.response?.status;
  
      if (status === 401 || status === 403) {
        console.warn('Authorization failed, redirecting to login');
        localStorage.removeItem('token');
        window.location.href = '/login'; // or router-based redirect
      }
  
      console.error(`API PUT request failed for ${endpoint}:`, error);
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to complete PUT request'
      );
    }
  }

  async makeGuestRequest(method, endpoint, data = {}, customHeaders = {}) {
    try {
      if (!this.isBackendAvailable) {
        await this.checkBackendHealth();
      }
  
      if (!this.isBackendAvailable) {
        throw new Error('Backend server is not available');
      }
  
      const url = `${BACKEND_URL}${endpoint}`;
  
      const config = {
        method,
        url,
        headers: {
          'Content-Type': 'application/json',
          ...customHeaders
        }
      };
  
      if (['post', 'put', 'patch', 'delete'].includes(method.toLowerCase())) {
        config.data = data;
      }
  
      const response = await axios(config);
      return response.data;
  
    } catch (error) {
      console.error(`Guest API request failed for ${endpoint}:`, error);
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Guest request failed'
      );
    }
  }


  
  
  async getUserProfile() {
    try {
      console.log('Attempting to fetch user profile from API...');
      const profile = await this.makeAuthenticatedRequest('/users/profile');
  
      // Optionally cache the fetched profile
      this.cacheUserData(profile);
  
      return profile;
  
    } catch (error) {
      console.warn('API call failed:', error.message || error);
  
      console.log('Checking for cached data as fallback...');
      const userData = this.getCachedUserData();
  
      if (userData) {
        console.log('Using cached user data as fallback');
        return userData;
      }
  
      console.log('No cached data available, throwing error');
      throw error;
    }
  }
  
  async getUserBookings() {
    try {
      console.log('BackendService: Fetching user bookings...');
      // Try the new endpoint first
      try {
        const bookings = await this.makeAuthenticatedRequest('/bookings/my-bookings');
        console.log('BackendService: User bookings received from new endpoint:', bookings);
        return bookings;
      } catch (newEndpointError) {
        console.log('BackendService: New endpoint failed, trying old endpoint...');
        // Fallback to the old endpoint
        const bookings = await this.makeAuthenticatedRequest('/users/bookings');
        console.log('BackendService: User bookings received from old endpoint:', bookings);
        return bookings;
      }
    } catch (error) {
      console.error('BackendService: Error fetching user bookings:', error);
      throw error;
    }
  }

  cacheUserData(userData) {
    try {
      console.log('Caching user data:', userData);
      const userDataString = JSON.stringify(userData);
      localStorage.setItem('user', userDataString);
      sessionStorage.setItem('user', userDataString);
      console.log('User data cached successfully');
    } catch (error) {
      console.error('Error caching user data:', error);
    }
  }

  getCachedUserData() {
    let userData = localStorage.getItem('user');
    let source = 'localStorage';
  
    if (!userData) {
      userData = sessionStorage.getItem('user');
      source = 'sessionStorage';
    }
  
    if (!userData) {
      console.log('No cached user data found in either storage');
      return null;
    }
  
    try {
      console.log(`Using cached user data from ${source}`);
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing cached user data:', error);
      return null;
    }
  }
  
  async fetchUserBookings() {
    try {
      return await this.makeAuthenticatedRequest('/users/bookings');
    } catch (error) {
      console.error('Failed to fetch user bookings:', error);
      throw error;
    }
  }
  
  async updateUserProfile(profileData) {
    try {
      const res = await this.makeAuthenticatedPut('/users/profile', profileData);
      return res; // Return the full response (updated user object)
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  }
  
  async updateUserPassword(passwordData) {
    try {
      const res = await this.makeAuthenticatedPut('/users/profile/password', passwordData);
      return res?.message || 'Password updated successfully';
    } catch (error) {
      console.error('Failed to update user password:', error);
      throw error;
    }
  }
  

  async makeAuthenticatedDelete(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found');
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
      if (!this.isBackendAvailable) {
        console.log('Checking backend availability...');
        await this.checkBackendHealth();
      }
  
      if (!this.isBackendAvailable) {
        throw new Error('Backend server is not available');
      }
  
      const response = await axios.delete(`${BACKEND_URL}${endpoint}`, config);
      return response.data;
  
    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        // Only redirect for authentication errors (401), not authorization errors (403)
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      console.error(`API DELETE request failed for ${endpoint}:`, error);
      throw new Error(
        error.response?.data?.message || error.message || 'Failed to delete resource'
      );
    }
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
    console.log('Clearing cached user data and tokens');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    console.log('Cached data cleared successfully');
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

    console.log('Backend connection test successful:', response.status, response.data);
    return true;

  } catch (error) {
    if (error.response) {
      // Backend responded with a status code outside the 2xx range
      console.error(`Backend error (status ${error.response.status}):`, error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      console.error('Backend connection timed out');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running or not accessible');
    } else {
      console.error('Unexpected error during backend connection test:', error.message || error);
    }

    return false;
  }
}

  async makeGuestBookingRequest(endpoint, data = {}) {
    try {
      if (!this.isBackendAvailable) {
        await this.checkBackendHealth();
      }
      if (!this.isBackendAvailable) {
        throw new Error('Backend server is not available');
      }
      const url = `${BACKEND_URL}${endpoint}`;
      console.log('Making guest booking request to:', url, 'with data:', data);
      
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Guest booking response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Guest booking request failed for ${endpoint}:`, error);
      console.error('Error response:', error.response?.data);
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Error finding booking'
      );
    }
  }

  // Find guest booking and generate temporary token
  async findGuestBookingAndGenerateToken(confirmationCode, email) {
    try {
      console.log('BackendService: Finding guest booking and generating token...', { confirmationCode, email });
      const response = await this.makeGuestBookingRequest('/guest_bookings/find-and-token', {
        confirmation_code: confirmationCode,
        email: email
      });
      console.log('BackendService: Guest booking found and token generated:', response);
      return response;
    } catch (error) {
      console.error('BackendService: Error finding guest booking and generating token:', error);
      console.error('Error details:', {
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      throw new Error(
        error.response?.data?.message ||
        error.message ||
        'Failed to find guest booking and generate token'
      );
    }
  }
}

const backendService = new BackendService();
export default backendService;

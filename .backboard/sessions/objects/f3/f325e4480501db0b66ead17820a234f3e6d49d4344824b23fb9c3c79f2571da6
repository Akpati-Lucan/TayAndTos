# Backend Services Documentation

This directory contains modular backend services for the TayAndTos frontend application. These services provide a clean, organized interface for communicating with the backend API, handling authentication, and managing application state.

## 🏗️ Services Overview

The backend services system provides:
- **API Integration**: Centralized backend communication
- **Authentication Management**: JWT token handling and user sessions
- **Request Handling**: HTTP request management with error handling
- **Service Modularity**: Organized, maintainable service architecture
- **Error Handling**: Consistent error processing and user feedback
- **Configuration Management**: Centralized API configuration
- **Health Monitoring**: Backend service health checks

## 📁 Service Files

- **`index.js`** - Main service export hub and backward compatibility
- **`config.js`** - Configuration and constants
- **`request_service.js`** - Base HTTP request handling
- **`auth_service.js`** - Authentication and user management
- **`user_service.js`** - User profile and management operations
- **`booking_service.js`** - Booking operations and management
- **`email_service.js`** - Email-related operations
- **`health_service.js`** - Backend health monitoring

## 🔧 Configuration (`config.js`)

### Purpose
Centralizes configuration constants and API settings.

### Implementation
```javascript
// Backend API configuration
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '/api';

// Axios instance configuration
export const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});
```

### Environment Variables
```env
# Backend API URL
REACT_APP_BACKEND_URL=/api

# API Timeout (in milliseconds)
REACT_APP_API_TIMEOUT=10000

# Environment
REACT_APP_ENVIRONMENT=development
```

## 🌐 Request Service (`request_service.js`)

### Purpose
Handles base HTTP requests and provides authentication and guest request methods.

### Core Methods

#### Authenticated Requests
```javascript
// Make authenticated HTTP request
const authRequest = async (endpoint, method = 'GET', data = null, options = {}) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('User not authenticated. Please log in again.');
  }

  const config = {
    method,
    url: endpoint,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  };

  if (data) {
    config.data = data;
  }

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};
```

#### Guest Requests
```javascript
// Make guest HTTP request
const guestRequest = async (endpoint, method = 'GET', data = null, options = {}) => {
  const guestToken = getGuestToken();
  
  if (!guestToken) {
    throw new Error('Guest token required for this operation.');
  }

  const config = {
    method,
    url: endpoint,
    headers: {
      'guest-token': guestToken,
      ...options.headers
    }
  };

  if (data) {
    config.data = data;
  }

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};
```

### Error Handling
```javascript
// Handle request errors
const handleRequestError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        throw new Error(data.error || 'Bad request');
      case 401:
        throw new Error('Authentication required');
      case 403:
        throw new Error('Access denied');
      case 404:
        throw new Error('Resource not found');
      case 500:
        throw new Error('Server error');
      default:
        throw new Error(data.error || 'Request failed');
    }
  } else if (error.request) {
    // Request made but no response
    throw new Error('No response from server');
  } else {
    // Request setup error
    throw new Error('Request failed');
  }
};
```

## 🔐 Authentication Service (`auth_service.js`)

### Purpose
Manages user authentication, JWT tokens, and user session data.

### Core Methods

#### Token Management
```javascript
// Store authentication token
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Get authentication token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Remove authentication token
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Store guest token
const setGuestToken = (token) => {
  sessionStorage.setItem('guestToken', token);
};

// Get guest token
const getGuestToken = () => {
  return sessionStorage.getItem('guestToken');
};

// Remove guest token
const removeGuestToken = () => {
  sessionStorage.removeItem('guestToken');
};
```

#### User Session Management
```javascript
// Store user data
const setUserData = (user) => {
  localStorage.setItem('userData', JSON.stringify(user));
};

// Get user data
const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Remove user data
const removeUserData = () => {
  localStorage.removeItem('userData');
};

// Check if user is authenticated
const isUserAuthenticated = () => {
  const token = getAuthToken();
  const user = getUserData();
  return !!(token && user);
};

// Clear all authentication data
const clearAuthData = () => {
  removeAuthToken();
  removeUserData();
  removeGuestToken();
};
```

#### Authentication Operations
```javascript
// User login
const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/users/login', {
      email,
      password
    });

    const { token, user } = response.data;
    
    setAuthToken(token);
    setUserData(user);
    
    return { success: true, user };
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
};

// User logout
const logout = () => {
  clearAuthData();
  return { success: true };
};

// User registration
const signup = async (userData) => {
  try {
    const response = await axiosInstance.post('/users/signup', userData);
    return { success: true, message: response.data.message };
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
};
```

## 👤 User Service (`user_service.js`)

### Purpose
Handles user profile operations and user management.

### Core Methods

#### Profile Management
```javascript
// Get user profile
const getUserProfile = async () => {
  try {
    const response = await authRequest('/users/profile');
    return response;
  } catch (error) {
    throw new Error('Failed to fetch user profile');
  }
};

// Update user profile
const updateUserProfile = async (profileData) => {
  try {
    const response = await authRequest('/users/profile', 'PUT', profileData);
    return response;
  } catch (error) {
    throw new Error('Failed to update user profile');
  }
};

// Change password
const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await authRequest('/users/change-password', 'PUT', {
      currentPassword,
      newPassword
    });
    return response;
  } catch (error) {
    throw new Error('Failed to change password');
  }
};
```

#### User Management (Admin)
```javascript
// Get all users (admin only)
const getAllUsers = async () => {
  try {
    const response = await authRequest('/users');
    return response;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

// Get user by ID (admin only)
const getUserById = async (userId) => {
  try {
    const response = await authRequest(`/users/${userId}`);
    return response;
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
};

// Update user (admin only)
const updateUser = async (userId, userData) => {
  try {
    const response = await authRequest(`/users/${userId}`, 'PUT', userData);
    return response;
  } catch (error) {
    throw new Error('Failed to update user');
  }
};

// Delete user (admin only)
const deleteUser = async (userId) => {
  try {
    const response = await authRequest(`/users/${userId}`, 'DELETE');
    return response;
  } catch (error) {
    throw new Error('Failed to delete user');
  }
};
```

## 📅 Booking Service (`booking_service.js`)

### Purpose
Manages all booking-related operations including user and guest bookings.

### Core Methods

#### User Bookings
```javascript
// Create new booking
const createBooking = async (bookingData) => {
  try {
    const response = await authRequest('/bookings', 'POST', bookingData);
    return response;
  } catch (error) {
    throw new Error('Failed to create booking');
  }
};

// Get user bookings
const getUserBookings = async () => {
  try {
    const response = await authRequest('/bookings');
    return response;
  } catch (error) {
    throw new Error('Failed to fetch bookings');
  }
};

// Get booking by ID
const getBookingById = async (bookingId) => {
  try {
    const response = await authRequest(`/bookings/${bookingId}`);
    return response;
  } catch (error) {
    throw new Error('Failed to fetch booking');
  }
};

// Update booking
const updateBooking = async (bookingId, bookingData) => {
  try {
    const response = await authRequest(`/bookings/${bookingId}`, 'PUT', bookingData);
    return response;
  } catch (error) {
    throw new Error('Failed to update booking');
  }
};

// Cancel booking
const cancelBooking = async (bookingId) => {
  try {
    const response = await authRequest(`/bookings/${bookingId}`, 'DELETE');
    return response;
  } catch (error) {
    throw new Error('Failed to cancel booking');
  }
};
```

#### Guest Bookings
```javascript
// Create guest booking
const createGuestBooking = async (bookingData) => {
  try {
    const response = await axiosInstance.post('/guest-bookings', bookingData);
    
    if (response.data.guestToken) {
      setGuestToken(response.data.guestToken);
    }
    
    return response.data;
  } catch (error) {
    throw new Error('Failed to create guest booking');
  }
};

// Get guest booking
const getGuestBooking = async (bookingId, guestToken) => {
  try {
    const response = await axiosInstance.get(`/guest-bookings/${bookingId}`, {
      headers: { 'guest-token': guestToken }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch guest booking');
  }
};

// Update guest booking
const updateGuestBooking = async (bookingId, bookingData) => {
  try {
    const response = await axiosInstance.put(`/guest-bookings/${bookingId}`, bookingData, {
      headers: { 'guest-token': getGuestToken() }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update guest booking');
  }
};

// Cancel guest booking
const cancelGuestBooking = async (bookingId) => {
  try {
    const response = await axiosInstance.delete(`/guest-bookings/${bookingId}`, {
      headers: { 'guest-token': getGuestToken() }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to cancel guest booking');
  }
};
```

#### Specialized Methods
```javascript
// Make authenticated GET request
const makeAuthenticatedGet = async (endpoint) => {
  try {
    const response = await authRequest(endpoint, 'GET');
    return response;
  } catch (error) {
    throw new Error('Failed to fetch data');
  }
};

// Make guest PUT request
const makeGuestPut = async (endpoint, data) => {
  try {
    const response = await axiosInstance.put(endpoint, data, {
      headers: { 'guest-token': getGuestToken() }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update data');
  }
};

// Make guest DELETE request
const makeGuestDelete = async (endpoint) => {
  try {
    const response = await axiosInstance.delete(endpoint, {
      headers: { 'guest-token': getGuestToken() }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete data');
  }
};
```

## 📧 Email Service (`email_service.js`)

### Purpose
Handles email-related operations and confirmation requests.

### Core Methods

#### Email Operations
```javascript
// Send confirmation email
const sendConfirmationEmail = async (email) => {
  try {
    const response = await axiosInstance.post('/email/send-confirmation', { email });
    return response.data;
  } catch (error) {
    throw new Error('Failed to send confirmation email');
  }
};

// Resend confirmation email
const resendConfirmationEmail = async (email) => {
  try {
    const response = await axiosInstance.post('/email/resend-confirmation', { email });
    return response.data;
  } catch (error) {
    throw new Error('Failed to resend confirmation email');
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email) => {
  try {
    const response = await axiosInstance.post('/email/password-reset', { email });
    return response.data;
  } catch (error) {
    throw new Error('Failed to send password reset email');
  }
};

// Preview email templates
const previewEmail = async (emailType, data) => {
  try {
    const response = await axiosInstance.post('/email/preview', {
      type: emailType,
      data: data
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to preview email');
  }
};
```

## 🏥 Health Service (`health_service.js`)

### Purpose
Monitors backend service health and provides system status information.

### Core Methods

#### Health Monitoring
```javascript
// Check backend health
const checkBackendHealth = async () => {
  try {
    const response = await axiosInstance.get('/health');
    return response.data;
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

// Start health monitoring
const startHealthChecks = (interval = 30000) => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
  
  healthCheckInterval = setInterval(async () => {
    try {
      const health = await checkBackendHealth();
      console.log('Backend health:', health.status);
      
      if (health.status === 'unhealthy') {
        console.warn('Backend service is unhealthy');
      }
    } catch (error) {
      console.error('Health check failed:', error);
    }
  }, interval);
  
  return { success: true, message: 'Health monitoring started' };
};

// Stop health monitoring
const stopHealthChecks = () => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
    return { success: true, message: 'Health monitoring stopped' };
  }
  return { success: false, message: 'No health monitoring active' };
};

// Get health status
const getHealthStatus = async () => {
  try {
    const health = await checkBackendHealth();
    return {
      status: health.status,
      timestamp: new Date().toISOString(),
      details: health
    };
  } catch (error) {
    return {
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
};
```

## 🔗 Service Integration (`index.js`)

### Purpose
Provides a unified interface for all backend services and maintains backward compatibility.

### Implementation
```javascript
// Import all services
import authService from './auth_service.js';
import userService from './user_service.js';
import bookingService from './booking_service.js';
import emailService from './email_service.js';
import healthService from './health_service.js';
import requestService from './request_service.js';

// Create unified backend service object
const backendService = {
  // Authentication methods
  login: authService.login,
  signup: authService.signup,
  logout: authService.logout,
  isUserAuthenticated: authService.isUserAuthenticated,
  
  // Token management
  setAuthToken: authService.setAuthToken,
  getAuthToken: authService.getAuthToken,
  removeAuthToken: authService.removeAuthToken,
  setGuestToken: authService.setGuestToken,
  getGuestToken: authService.getGuestToken,
  removeGuestToken: authService.removeGuestToken,
  
  // User management
  getUserProfile: userService.getUserProfile,
  updateUserProfile: userService.updateUserProfile,
  changePassword: userService.changePassword,
  getAllUsers: userService.getAllUsers,
  getUserById: userService.getUserById,
  updateUser: userService.updateUser,
  deleteUser: userService.deleteUser,
  
  // Booking management
  createBooking: bookingService.createBooking,
  getUserBookings: bookingService.getUserBookings,
  getBookingById: bookingService.getBookingById,
  updateBooking: bookingService.updateBooking,
  cancelBooking: bookingService.cancelBooking,
  createGuestBooking: bookingService.createGuestBooking,
  getGuestBooking: bookingService.getGuestBooking,
  updateGuestBooking: bookingService.updateGuestBooking,
  cancelGuestBooking: bookingService.cancelGuestBooking,
  
  // Specialized methods
  makeAuthenticatedRequest: requestService.authRequest,
  makeAuthenticatedGet: bookingService.makeAuthenticatedGet,
  makeGuestPut: bookingService.makeGuestPut,
  makeGuestDelete: bookingService.makeGuestDelete,
  
  // Email services
  sendConfirmationEmail: emailService.sendConfirmationEmail,
  resendConfirmationEmail: emailService.resendConfirmationEmail,
  sendPasswordResetEmail: emailService.sendPasswordResetEmail,
  previewEmail: emailService.previewEmail,
  
  // Health monitoring
  checkBackendHealth: healthService.checkBackendHealth,
  startHealthChecks: healthService.startHealthChecks,
  stopHealthChecks: healthService.stopHealthChecks,
  getHealthStatus: healthService.getHealthStatus
};

// Export the unified service
export default backendService;

// Also export individual services for direct access
export { authService, userService, bookingService, emailService, healthService, requestService };
```

## 🚨 Error Handling

### Error Types
The services handle various types of errors:

- **Network Errors**: Connection failures and timeouts
- **Authentication Errors**: Invalid tokens and expired sessions
- **Validation Errors**: Invalid input data and business rule violations
- **Server Errors**: Backend service failures and database errors
- **Permission Errors**: Access denied and insufficient privileges

### Error Response Format
```javascript
// Standard error response
{
  error: 'Error message',
  status: 400,
  timestamp: '2024-01-15T10:30:00.000Z',
  path: '/endpoint',
  method: 'POST',
  details: 'Additional error details'
}
```

### Error Handling Strategy
```javascript
// Service-level error handling
try {
  const result = await serviceMethod();
  return result;
} catch (error) {
  // Log error for debugging
  console.error('Service error:', error);
  
  // Re-throw with user-friendly message
  throw new Error(error.message || 'Operation failed');
}

// Component-level error handling
try {
  const result = await backendService.methodName();
  setData(result);
} catch (error) {
  setError(error.message);
  setLoading(false);
}
```

## 🔄 Service Lifecycle

### 1. **Initialization**
- Load configuration from environment variables
- Initialize Axios instance with base configuration
- Set up interceptors for request/response handling

### 2. **Request Processing**
- Validate request parameters
- Add authentication headers
- Make HTTP request to backend
- Process response data

### 3. **Error Handling**
- Catch and categorize errors
- Provide user-friendly error messages
- Log errors for debugging
- Handle authentication failures

### 4. **Response Processing**
- Validate response data
- Transform data if needed
- Return processed results
- Update local state if required

## 🧪 Testing Services

### Unit Testing
```javascript
// Test service methods
describe('AuthService', () => {
  test('login should store token and user data', async () => {
    const mockResponse = { token: 'test-token', user: { id: 1 } };
    axiosInstance.post.mockResolvedValue({ data: mockResponse });
    
    const result = await authService.login('test@example.com', 'password');
    
    expect(result.success).toBe(true);
    expect(localStorage.getItem('authToken')).toBe('test-token');
  });
});
```

### Integration Testing
```javascript
// Test service integration
describe('Service Integration', () => {
  test('booking creation should update user bookings', async () => {
    const booking = await backendService.createBooking(bookingData);
    const userBookings = await backendService.getUserBookings();
    
    expect(userBookings).toContainEqual(booking);
  });
});
```

## 📊 Performance Considerations

### Request Optimization
- **Request Caching**: Cache frequently requested data
- **Batch Requests**: Combine multiple requests when possible
- **Request Debouncing**: Prevent rapid successive requests
- **Connection Pooling**: Reuse HTTP connections

### Memory Management
- **Token Cleanup**: Remove expired tokens automatically
- **Data Cleanup**: Clear old data from storage
- **Event Cleanup**: Remove event listeners and intervals

## 🔒 Security Features

### Token Security
- **Secure Storage**: Use appropriate storage mechanisms
- **Token Expiration**: Handle expired tokens gracefully
- **Token Rotation**: Implement token refresh mechanisms
- **Secure Transmission**: Use HTTPS for all API calls

### Input Validation
- **Client-side Validation**: Validate input before sending
- **Data Sanitization**: Clean input data
- **Type Checking**: Ensure correct data types
- **Business Rule Validation**: Validate business logic

## 🚨 Common Issues & Solutions

### 1. **Authentication Failures**
**Issue:** Users can't authenticate or stay logged in
**Solution:** Check token storage, expiration, and backend authentication

### 2. **API Connection Issues**
**Issue:** Frontend can't connect to backend
**Solution:** Verify backend URL, CORS configuration, and network connectivity

### 3. **Guest Token Problems**
**Issue:** Guest operations fail
**Solution:** Check guest token storage and validation

### 4. **Service Method Errors**
**Issue:** Service methods throw unexpected errors
**Solution:** Verify method parameters and backend API responses

### 5. **Performance Issues**
**Issue:** Slow API responses or memory leaks
**Solution:** Implement caching, optimize requests, and clean up resources

## 📚 Related Documentation

- **Main Frontend**: See `../README.md` for overall frontend documentation
- **Backend API**: See `../../Backend/README.md` for backend API documentation
- **Component Usage**: See `../components/README.md` for component documentation
- **Page Implementation**: See `../pages/README.md` for page documentation

## 🔄 Service Maintenance

### 1. **Regular Updates**
- Update service methods for new API endpoints
- Maintain backward compatibility
- Update error handling for new error types
- Refresh security implementations

### 2. **Performance Monitoring**
- Monitor API response times
- Track error rates and types
- Monitor memory usage
- Optimize request patterns

### 3. **Security Updates**
- Update authentication mechanisms
- Implement new security features
- Monitor for security vulnerabilities
- Update token handling

### 4. **Testing and Validation**
- Test new service methods
- Validate error handling
- Test integration with components
- Perform security testing

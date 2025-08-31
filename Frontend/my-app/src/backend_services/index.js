// services/backend/index.js
import healthService from './health_service.js';
import authService from './auth_service.js';
import userService from './user_service.js';
import bookingService from './booking_service.js';
import emailService from './email_service.js';

// Create a comprehensive backendService object that provides all the methods
// that the frontend pages are currently using
const backendService = {
  // Health and connection methods
  testBackendConnection: () => healthService.testBackendConnection(),
  startHealthChecks: (intervalMs) => healthService.startHealthChecks(intervalMs),
  stopHealthChecks: () => healthService.stopHealthChecks(),
  
  // Authentication methods
  isUserAuthenticated: () => authService.isUserAuthenticated(),
  clearCachedUserData: () => authService.clearCachedUserData(),
  
  // User methods
  getUserProfile: () => userService.getUserProfile(),
  updateUserProfile: (data) => userService.updateUserProfile(data),
  updateUserPassword: (data) => userService.updateUserPassword(data),
  deleteUser: (userId) => userService.deleteUser(userId),
  
  // Booking methods
  getUserBookings: () => bookingService.getUserBookings(),
  findGuestBookingAndGenerateToken: (code, email) => bookingService.findGuestBookingAndGenerateToken(code, email),
  makeAuthenticatedRequest: (endpoint, data) => bookingService.makeAuthenticatedRequest(endpoint, data),
  makeGuestRequest: (endpoint, data) => bookingService.makeGuestRequest(endpoint, data),
  makeGuestPut: (endpoint, data, guestToken) => bookingService.makeGuestPut(endpoint, data, guestToken),
  makeGuestDelete: (endpoint, data, guestToken) => bookingService.makeGuestDelete(endpoint, data, guestToken),
  makeAuthenticatedDelete: (endpoint) => bookingService.makeAuthenticatedDelete(endpoint),
  makeAuthenticatedPut: (endpoint, data) => bookingService.makeAuthenticatedPut(endpoint, data),
  makeAuthenticatedGet: (endpoint) => bookingService.makeAuthenticatedGet(endpoint),
  makeGuestBookingRequest: (endpoint, data) => bookingService.makeGuestBookingRequest(endpoint, data),
  
  // Email methods
  resendNewUserConfirmationEmail: (email, first_name, last_name) => 
    emailService.resendNewUserConfirmationEmail(email, first_name, last_name),
  
  // Individual service access (for advanced usage)
  health: healthService,
  auth: authService,
  user: userService,
  booking: bookingService,
  email: emailService
};

export default backendService;

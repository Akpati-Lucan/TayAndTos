// services/backend/bookingService.js
import requestService from './request_service.js';

class BookingService {
  async getUserBookings() {
    try {
      return await requestService.authRequest('get', '/bookings/my-bookings');
    } catch {
      return requestService.authRequest('get', '/users/bookings');
    }
  }

  async findGuestBookingAndToken(code, email) {
    return requestService.guestRequest('post', '/guest_bookings/find-and-token', {
      confirmation_code: code,
      email
    });
  }

  async findGuestBookingAndGenerateToken(code, email) {
    return requestService.guestRequest('post', '/guest_bookings/find-and-token', {
      confirmation_code: code,
      email
    });
  }

  async makeAuthenticatedRequest(endpoint, data = {}) {
    return requestService.authRequest('post', endpoint, data);
  }

  async makeGuestRequest(endpoint, data = {}) {
    return requestService.guestRequest('post', endpoint, data);
  }

  async makeAuthenticatedDelete(endpoint) {
    return requestService.authRequest('delete', endpoint);
  }

  async makeAuthenticatedPut(endpoint, data = {}) {
    return requestService.authRequest('put', endpoint, data);
  }

  async makeGuestBookingRequest(endpoint, data = {}) {
    return requestService.guestRequest('post', endpoint, data);
  }

  async makeGuestPut(endpoint, data = {}, guestToken = null) {
    const options = {};
    if (guestToken) {
      options.headers = { Authorization: `Bearer ${guestToken}` };
    }
    return requestService.guestRequest('put', endpoint, data, options);
  }

  async makeGuestDelete(endpoint, data = {}, guestToken = null) {
    const options = {};
    if (guestToken) {
      options.headers = { Authorization: `Bearer ${guestToken}` };
    }
    return requestService.guestRequest('delete', endpoint, data, options);
  }

  async makeAuthenticatedGet(endpoint) {
    return requestService.authRequest('get', endpoint);
  }
}

export default new BookingService();

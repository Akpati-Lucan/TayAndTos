// services/backend/emailService.js
import requestService from './request_service.js';

class EmailService {
  async sendBookingConfirmation(booking, user) {
    const endpoint = booking.user_id
      ? '/email/send-booking-confirmation'
      : '/email/send-guest-booking-confirmation';
    return requestService.authRequest('post', endpoint, { booking, user });
  }

  async sendNewUserConfirmation(user) {
    return requestService.authRequest('post', '/email/send-new-user-confirmation', { user });
  }

  async resendNewUserConfirmation(email, first_name, last_name) {
    return requestService.guestRequest('post', '/email/resend-new-user-confirmation', {
      email, first_name, last_name
    });
  }

  async testEmailConnection() {
    return requestService.guestRequest('get', '/email/test-connection');
  }

  async resendNewUserConfirmationEmail(email, first_name, last_name) {
    return this.resendNewUserConfirmation(email, first_name, last_name);
  }
}

export default new EmailService();

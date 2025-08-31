// services/backend/userService.js
import requestService from './request_service.js';
import authService from './auth_service.js';

class UserService {
  async getProfile() {
    const profile = await requestService.authRequest('get', '/users/profile');
    authService.cacheUser(profile);
    return profile;
  }

  async updateProfile(data) {
    return requestService.authRequest('put', '/users/profile', data);
  }

  async updatePassword(data) {
    return requestService.authRequest('put', '/users/profile/password', data);
  }

  async deleteUser(userId) {
    return requestService.authRequest('delete', `/users/${userId}`);
  }

  async getUserProfile() {
    return this.getProfile();
  }

  async updateUserProfile(data) {
    return this.updateProfile(data);
  }

  async updateUserPassword(data) {
    return this.updatePassword(data);
  }

  async getUsers() {
    return requestService.authRequest('get', '/users');
  }
}

export default new UserService();

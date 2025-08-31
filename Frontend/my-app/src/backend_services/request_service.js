// services/backend/requestService.js
import { axiosInstance } from './config.js';
import healthService from './health_service.js';
import authService from './auth_service.js';

class RequestService {
  async authRequest(method, endpoint, data = {}, options = {}) {
    const token = authService.getToken();
    if (!token) throw new Error('No auth token found');

    if (!healthService.isAvailable) await healthService.check();
    if (!healthService.isAvailable) throw new Error('Backend unavailable');

    return axiosInstance({
      method,
      url: endpoint,
      headers: { Authorization: `Bearer ${token}`, ...options.headers },
      data,
      ...options
    }).then(res => res.data);
  }

  async guestRequest(method, endpoint, data = {}, options = {}) {
    if (!healthService.isAvailable) await healthService.check();
    if (!healthService.isAvailable) throw new Error('Backend unavailable');

    return axiosInstance({
      method,
      url: endpoint,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      data,
      ...options
    }).then(res => res.data);
  }
}

export default new RequestService();
